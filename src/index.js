import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import countryCardTemplate from './templates/country-card.hbs';
import countriesListTemplate from './templates/countries-list.hbs';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputValueFetch, DEBOUNCE_DELAY));

function onInputValueFetch(e) {
  e.preventDefault();

  const nameCountry = e.target.value.trim();

  clearSearchResult();

  if (nameCountry === '') {
    return;
  }

  fetchCountries(nameCountry)
    .then(countries => {
      if (countries.length >= 10) {
        tooManyCountries();

        return clearSearchResult();
      }

      if (countries.length >= 2 && countries.length < 10) {
        //clearSearchResult();

        return markupListCountry;
      }

      if (countries.length === 1) {
        //clearSearchResult();

        return markupCardCountry();
      }
    })

    .catch(error => {
      onFetchCatch();

      clearSearchResult();
    });
}

function markupCardCountry(countries) {
  const cardCountryEl = countryCardTemplate(countries);
  refs.countryInfo.insertAdjacentHTML('beforeend', cardCountryEl);
}

function markupListCountry(countries) {
  const nameCountryEl = countriesListTemplate(countries);
  refs.countryList.insertAdjacentHTML('beforeend', nameCountryEl);
}

function tooManyCountries() {
  Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
}

function onFetchCatch(error) {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function clearSearchResult() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
