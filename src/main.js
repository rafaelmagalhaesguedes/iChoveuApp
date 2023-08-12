import { handleSearch, createCityElement } from './services/scripts';
import './style.css';

/*
* Main
*/
const main = () => {
  // Get elements
  const form = document.getElementById('search-form');
  const buttonCloseForecast = document.getElementById('close-forecast');

  // Event submit form
  form.addEventListener('submit', async (event) => {
    const citiesContainer = document.getElementById('cities');
    const citiesInfo = await handleSearch(event);
    citiesInfo.forEach((cityInfo) => {
      const cityElement = createCityElement(cityInfo);
      citiesContainer.appendChild(cityElement);
    });
  });

  // Event click buttonCloseForecast
  buttonCloseForecast.addEventListener('click', () => {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.classList.add('hidden');
  });

};

window.onload = () => {
  main();
};
