// estado da aplicação (state)
let tabCountruies = null;
let tabFavorites = null;

let allCountries = [];
let favoritesCountries = [];

let countCountries = 0;
let countFavorites = 0;

let totalPopulationList = 0;
let totalPopulationFavorites = 0;

let numberFormat = null;

addEventListener('load', () => {
  tabCountruies = document.querySelector('#tabCountries');
  countCountries = document.querySelector('#countCountries');
  tabFavorites = document.querySelector('#tabFavorites');
  countFavorites = document.querySelector('#countFavorites');
  totalPopulationList = document.querySelector('#totalPopulationList');
  totalPopulationFavorites = document.querySelector(
    '#totalPopulationFavorites'
  );
  numberFormat = Intl.NumberFormat('pt-BR');
  fetchCountries();
});

//buscando todos os paises
async function fetchCountries() {
  const res = await fetch('https://restcountries.eu/rest/v2/all');
  const json = await res.json();
  allCountries = json.map((country) => {
    //desestruturando os dados para trazer apenas oque precisa
    const { numericCode, translations, population, flag } = country;
    // "apelidando" os dados para trabalhar melhor com eles
    return {
      id: numericCode,
      name: translations.br,
      population,
      formatedPopulation: formatNumber(population),
      flag,
    };
  });

  render();
}
function render() {
  renderCountryList();
  renderFavorites();
  renderSumary();
  handleCountySummary();
}
//renderizar lista de paises no HTML da pagina
function renderCountryList() {
  let countriesHTML = '<div>';
  allCountries.forEach((country) => {
    const { name, flag, id, population, formatedPopulation } = country;
    const countryHTML = `
      <div class='country'>
        <div>
          <a id='${id}' class='waves-effect waves-ligth btn'>+</a>
        </div>
        <div>
        <img src='${flag}' alt='${name}'>
        </div>
        <div>
        <ul>
          <li>${name}</li>
          <li>${formatedPopulation}</li>
        </ul>
        </div>
      </div>  
    `;
    countriesHTML += countryHTML;
  });

  tabCountruies.innerHTML = countriesHTML;
}
//renderizar os paizes selecionados na lista de favoritos
function renderFavorites() {
  let favoritesHTML = '<div>';
  favoritesCountries.forEach((country) => {
    const { name, flag, id, population, formatedPopulation } = country;
    const favoritescountryHTML = `
      <div class='country'>
        <div>
          <a id='${id}' class='waves-effect waves-ligth btn red darken-4'>-</a>
        </div>
        <div>
        <img src='${flag}' alt='${name}'>
        </div>
        <div>
        <ul>
          <li>${name}</li>
          <li>${formatedPopulation}</li>
        </ul>
        </div>
      </div>  
    `;
    favoritesHTML += favoritescountryHTML;
  });
  favoritesHTML += '</div>';
  tabFavorites.innerHTML = favoritesHTML;
}
//sumario de total de população
function renderSumary() {
  countCountries.textContent = allCountries.length;
  countFavorites.textContent = favoritesCountries.length;

  const totalPopulation = allCountries.reduce((acc, curr) => {
    return acc + curr.population;
  }, 0);
  totalPopulationList.textContent = formatNumber(totalPopulation);

  const favotiresPopulatio = favoritesCountries.reduce((acc, curr) => {
    return acc + curr.population;
  }, 0);
  totalPopulationFavorites.textContent = formatNumber(favotiresPopulatio);
}
//adicionar evento de click em todoso os button e chamando a respectiva função
function handleCountySummary() {
  const countryButtons = Array.from(tabCountruies.querySelectorAll('.btn'));
  countryButtons.forEach((button) => {
    button.addEventListener('click', () => addToFavorites(button.id));
  });

  const favoritesButtons = Array.from(tabFavorites.querySelectorAll('.btn'));
  favoritesButtons.forEach((button) => {
    button.addEventListener('click', () => removeFromFavorites(button.id));
  });
}
function addToFavorites(id) {
  //adicionando o pais selecionado na lista de favoritos
  const countryToAdd = allCountries.find((country) => country.id === id);
  favoritesCountries = [...favoritesCountries, countryToAdd];
  favoritesCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  //remover o pais selecinado da lista de paises
  allCountries = allCountries.filter((country) => {
    return country.id !== id;
  });
  render();
}
function removeFromFavorites(id) {
  //remover o pais selecionado na lista de favoritos
  const countryToRemove = favoritesCountries.find(
    (country) => country.id === id
  );
  allCountries = [...allCountries, countryToRemove];
  allCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  //adicionar o pais selecinado da lista de paises
  favoritesCountries = favoritesCountries.filter((country) => {
    return country.id !== id;
  });
  render();
}
function formatNumber(number) {
  return numberFormat.format(number);
}
