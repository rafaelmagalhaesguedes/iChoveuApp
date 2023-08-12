// Import functions
import { searchCities, getWeatherByCity, fetchForecastData } from './weatherAPI';

/**
 * Cria um elemento HTML com as informações passadas
 */
const createElement = (tagName, className, textContent = '') => {
  const element = document.createElement(tagName);
  element.classList.add(...className.split(' '));
  element.textContent = textContent;
  return element;
};

/**
 * Recebe as informações de uma previsão e retorna um elemento HTML
 */
function createForecast(forecast) {
  const { date, maxTemp, minTemp, condition, icon } = forecast;

  const weekday = new Date(date);
  weekday.setDate(weekday.getDate() + 1);
  const weekdayName = weekday.toLocaleDateString('pt-BR', { weekday: 'short' });

  const forecastElement = createElement('div', 'forecast');
  const dateElement = createElement('p', 'forecast-weekday', weekdayName);

  const maxElement = createElement('span', 'forecast-temp max', 'max');
  const maxTempElement = createElement('span', 'forecast-temp max', `${maxTemp}º`);
  const minElement = createElement('span', 'forecast-temp min', 'min');
  const minTempElement = createElement('span', 'forecast-temp min', `${minTemp}º`);
  const tempContainer = createElement('div', 'forecast-temp-container');
  tempContainer.appendChild(maxElement);
  tempContainer.appendChild(minElement);
  tempContainer.appendChild(maxTempElement);
  tempContainer.appendChild(minTempElement);

  const conditionElement = createElement('p', 'forecast-condition', condition);
  const iconElement = createElement('img', 'forecast-icon');
  iconElement.src = icon.replace('64x64', '128x128');

  const middleContainer = createElement('div', 'forecast-middle-container');
  middleContainer.appendChild(tempContainer);
  middleContainer.appendChild(iconElement);

  forecastElement.appendChild(dateElement);
  forecastElement.appendChild(middleContainer);
  forecastElement.appendChild(conditionElement);

  return forecastElement;
}

/**
 * Limpa todos os elementos filhos de um dado elemento
 */
const clearChildrenById = (elementId) => {
  const citiesList = document.getElementById(elementId);
  while (citiesList.firstChild) {
    citiesList.removeChild(citiesList.firstChild);
  }
};

/**
 * Recebe uma lista de previsões e as exibe na tela dentro de um modal
 */
export const showForecast = (forecastList) => {
  const forecastContainer = document.getElementById('forecast-container');
  const weekdayContainer = document.getElementById('weekdays');
  clearChildrenById('weekdays');
  forecastList.forEach((forecast) => {
    const weekdayElement = createForecast(forecast);
    weekdayContainer.appendChild(weekdayElement);
  });

  forecastContainer.classList.remove('hidden');
};

/**
 * Cria um elemento com o icone da condição temporal
 */
const createIconContainer = (icon) => {
  const iconContainer = createElement('div', 'icon-container');
  const iconElement = createElement('img', 'condition-icon');
  iconElement.src = icon.replace('64x64', '128x128');
  iconContainer.appendChild(iconElement);
  return iconContainer;
};

/**
 * Cria um elemento com as informações do tempo
 */
const createCityInfo = ({ condition, temp, icon }) => {
  const infoContainer = createElement('div', 'city-info-container');
  const conditionElement = createElement('p', 'city-condition', condition);
  const tempContainer = createElement('p', 'city-temp', `${temp} ºC`);
  const iconContainer = createIconContainer(icon);
  const conditionTempContainer = createElement('div', 'condition-temp-container');
  conditionTempContainer.appendChild(conditionElement);
  conditionTempContainer.appendChild(tempContainer);
  infoContainer.appendChild(conditionTempContainer);
  infoContainer.appendChild(iconContainer);
  return infoContainer;
};

/**
 * Cria um elemento com o cabeçalho das informações
 */
const createCityHeading = ({ name, country }) => {
  const cityHeadingContainer = createElement('div', 'heading-container');
  const headingElement = createElement('div', 'city-heading');
  const nameElement = createElement('h2', 'city-name', name);
  const countryElement = createElement('p', 'city-country', country);
  headingElement.appendChild(nameElement);
  headingElement.appendChild(countryElement);
  cityHeadingContainer.appendChild(headingElement);
  return cityHeadingContainer;
};

/**
 * Cria um elemento HTML que representa uma cidade
 */
export const createCityElement = (cityInfo) => {
  const cityElement = createElement('li', 'city');
  const cityHeadingContainer = createCityHeading(cityInfo);
  const infoContainer = createCityInfo(cityInfo);
  const forecastButton = createElement('button', 'view-forecast-button', 'Ver previsão');
  forecastButton.addEventListener('click', async () => {
    try {
      const forecastResult = await fetchForecastData(cityInfo.url);
      showForecast(forecastResult);
    } catch (error) {
      alert(error.message);
    }
  });
  cityElement.appendChild(cityHeadingContainer);
  cityElement.appendChild(infoContainer);
  cityElement.appendChild(forecastButton);
  return cityElement;
};

/**
 * Event submit form
 */
export const handleSearch = async (event) => {
  event.preventDefault();
  clearChildrenById('cities');
  const searchInput = document.getElementById('search-input').value;
  const cityData = await searchCities(searchInput);
  const weatherPromises = cityData.map(async (city) => {
    const weather = await getWeatherByCity(city.url);
    return { ...city, ...weather };
  });
  const weatherData = await Promise.all(weatherPromises);
  return weatherData;
};
