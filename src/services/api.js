/*
* Constantes
*/
const APIKEY = import.meta.env.VITE_TOKEN; // Token key
const FORECAST = 7; // Total de dias para previsão

/*
* Search Cities by term
*/
export const searchCities = async (term) => {
  const response = await fetch(`http://api.weatherapi.com/v1/search.json?lang=pt&key=${APIKEY}&q=${term}`);
  const data = await response.json();
  if (data.length === 0) {
    alert('Nenhuma cidade encontrada');
    return [];
  }
  return data;
};

/*
* Get Weather by city
*/
export const getWeatherByCity = async (url) => {
  const response = await fetch(`http://api.weatherapi.com/v1/current.json?lang=pt&key=${APIKEY}&q=${url}`);
  const data = await response.json();
  const weatherInfo = {
    temp: data.current.temp_c,
    condition: data.current.condition.text,
    icon: data.current.condition.icon,
  };
  return weatherInfo;
};

/*
* Get Infos City Weather 7 days
*/
export const fetchForecastData = async (cityUrl) => {
  const urlApi = `http://api.weatherapi.com/v1/forecast.json?lang=pt&key=${APIKEY}&q=${cityUrl}&days=${FORECAST}`;
  const response = await fetch(urlApi);
  const data = await response.json();
  if (data.length === 0) throw new Error('Error API connect');
  const forecastData = data.forecast.forecastday.map((day) => ({
    date: day.date,
    maxTemp: day.day.maxtemp_c,
    minTemp: day.day.mintemp_c,
    condition: day.day.condition.text,
    icon: day.day.condition.icon,
  }));
  return forecastData;
};
