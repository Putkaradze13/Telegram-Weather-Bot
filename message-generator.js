function formatedMessage(properties) {
  return `<b>Weather Forecast:
    \nCity: ${properties.name}</b>
    \t\t\t<b>weather:</b> ${properties.description},
    \t\t\t<b>temperature:</b> ${Math.floor(properties.temp)}°c,
    \t\t\t<b>feels like:</b> ${Math.floor(properties.feels_like)}°c, 
    \t\t\t<b>humidity:</b> ${properties.humidity}%, 
    \t\t\t<b>wind:</b> ${Math.floor(properties.wind)} m/s, 
    \t\t\t<b>sunrise:</b> ${properties.sunrise},
    \t\t\t<b>sunset:</b> ${properties.sunset},
    \t\t\t<b>country:</b> ${properties.country}`;
}
module.exports = formatedMessage;
