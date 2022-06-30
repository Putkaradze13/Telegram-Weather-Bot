require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { getWeatherData } = require('./data-provider');
const formatedMessage = require('./message-generator');

const { TOKEN, HOST, PORT, URL, W_URL, API_KEY } = process.env;

const bot = new TelegramBot(TOKEN, {
  webHook: {
    host: HOST,
    port: PORT,
  },
});
bot.setWebHook(URL + TOKEN);

bot.setMyCommands([
  { command: '/start', description: "Let's get started" },
  { command: '/help', description: 'Instruction' },
]);

bot.onText(/\/(start)/, async (msg) =>
  bot.sendMessage(
    msg.chat.id,
    `Hello ${msg.chat.first_name}, please type city name to get weather information.`
  )
);

bot.onText(/\/(help)/, async (msg) =>
  bot.sendMessage(
    msg.chat.id,
    `To receive information about the weather in any city, you should send city name you are interested in.`
  )
);

bot.on('message', async (msg) => {
  try {
    const { text } = msg;
    const data = await getWeatherData(text, API_KEY, W_URL);
    if (
      typeof data === 'string' &&
      msg.text !== '/start' &&
      msg.text !== '/help'
    ) {
      return bot.sendMessage(msg.chat.id, `"${msg.text}" is wrong command`);
    }
    const message = formatedMessage({
      name: data.name,
      description: data.weather[0].description,
      temp: Math.floor(data.main.temp),
      feels_like: Math.floor(data.main.feels_like),
      humidity: data.main.humidity,
      wind: Math.floor(data.wind.speed),
      sunrise: new Date(
        parseInt(data.sys.sunrise, 10) * 1000
      ).toLocaleTimeString(),
      sunset: new Date(
        parseInt(data.sys.sunset, 10) * 1000
      ).toLocaleTimeString(),
      country: data.sys.country,
    });
    return bot.sendMessage(msg.chat.id, message, { parse_mode: 'HTML' });
  } catch (error) {
    return error.message;
  }
});

const shutdown = () => process.exit();

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
