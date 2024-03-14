'use strict';

const countriesContainer = document.querySelector('.countries');

const renderCountry = (data, className = '') => {
  //console.log(data);
  const name = data.name.common;
  const currencies = Object.values(data.currencies);
  const language = Object.values(data.languages);

  const html = `
        <article class="country ${className}">
          <img class="country__img" src="${data.flags.png}" />
          <div class="country__data">
            <h3 class="country__name">${name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
              data.population / 1000000
            ).toFixed(1)} millions people</p>
            <p class="country__row"><span>🗣️</span>${language[0]}</p>
            <p class="country__row"><span>💰</span>${currencies[0].name} (${currencies[0].symbol})</p>
          </div>
        </article>
`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const renderError = (msg) => {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

// const getCountryData = (country) => {
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then((res) => res.json())
//     .then((data) => {
//       renderCountry(data);
//     });
// };

// getCountryData('chile');
// getCountryData('greece');

const getJSON = (url, errorMsg = 'Something went wrong') => {
  return fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(errorMsg);
    }
    return res.json();
  });
};

const getCountryDataAndNeighbour = (country) => {
  getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
    .then(([data]) => {
      renderCountry(data);

      const neighbours = data.borders;

      // Si le pays n'a pas de pays frontaliers
      // On bloque l'execution du code
      if (!neighbours) throw new Error('no neighbour, it is an island');

      return getJSON(
        `https://restcountries.com/v3.1/alpha?codes=${neighbours}`,
        'country not found'
      );
    })
    .then((data) => {
      data.forEach((country) => {
        renderCountry(country, 'neighbour');
      });
    })
    .catch((err) => {
      console.error(err);
      renderError(`Something went wrong, ${err.message}.`);
    });
};

// getCountryDataAndNeighbour('france');


// const getCountryData = (country) => {
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then((res) => res.json())
//     .then((data) => {
//     renderCountry(data)
//     })
// }

function recuperationpays() {
  const saisie = prompt("What is your favorite country?");
  if (saisie !== null) {
    getCountryDataAndNeighbour(saisie);
    document.querySelector('body').style.backgroundColor = 'bisque';
    
  }
}
recuperationpays()

// getCountryData("France");
// getCountryData("Portugal");
// getCountryData("Spain");
// getCountryData("Australia");
