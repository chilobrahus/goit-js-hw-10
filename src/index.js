import './css/styles.css';
import { fetchCountries } from './fetchcountries';
import debounce from 'lodash.debounce'
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('input#search-box');
const countryList = document.querySelector('ul.country-list');
const countryInfo = document.querySelector('div.country-info');

Notify.init({
    width: '400px',
    position: 'center-top',
});

input.addEventListener('input', debounce(onInputFullfill, DEBOUNCE_DELAY));

function onInputFullfill(e) {
    const name = e.target.value.trim();

    if (!name) {
        return;
    };

    fetchCountries(name)
        .then(countries => createMarkup(countries))
        .catch(onErrorCatch);
}

function createMarkup(countries) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';

    if (!input.value) {
        return countryList.innerHTML = '';
    }

    if (countries.length >= 10) {
        return Notify.info('Too many matches found. Please enter a more specific name.');
    }

    countries.map(({ name, capital, population, flags, languages }) => {
        
        const shortCard = `<li class="js-country-item">
        <image src="${flags.svg}" width="30px" height="20px">
        <span>${name.official}</span>
        </li>`;

        const fullCard = `<li class="js-country-item">
        <ul class="js-fullcard-list">
        <div class="js-country-header-wrapper">
        <image src="${flags.svg}" width="30px" height="20px">
        <h2 class="js-country-item__header">${name.official}</h2>
        </div>
        <li class="js-fullcard-item"><span class="js-fullcard-item-bold">Capital: </span>${capital}</li>
        <li class="js-fullcard-item"><span class="js-fullcard-item-bold">Population: </span>${population}</li>
        <li class="js-fullcard-item"><span class="js-fullcard-item-bold">Languages: </span>${Object.values(languages).join(', ')}</li>
        </ul>
        </li>`;

    if (countries.length >= 2 && countries.length < 10) {
        return countryList.insertAdjacentHTML('beforeend', shortCard);
    }
        countryInfo.insertAdjacentHTML('beforeend', fullCard);
    })
}

function onErrorCatch(error) {
    return Notify.failure('Oops, there is no country with that name');
}