const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const pokemonModal = document.getElementById('pokemonModal');
const closeModalButton = document.getElementById('closeModalButton');

const modalPokemonName = document.getElementById('modalPokemonName');
const modalPokemonNumber = document.getElementById('modalPokemonNumber');
const modalPokemonTypes = document.getElementById('modalPokemonTypes');
const modalPokemonImage = document.getElementById('modalPokemonImage');



const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function showModal(pokemon) {
    modalPokemonName.textContent = pokemon.name;
    modalPokemonNumber.textContent = `Number: #${pokemon.number}`;
    modalPokemonTypes.textContent = `Types: ${pokemon.types.join(', ')}`;
    modalPokemonImage.src = pokemon.photo;

    modalPokemonStats.innerHTML = '';

    pokemon.stats.forEach((stat) => {
        const progress = document.createElement('progress');
        progress.value = stat.base_stat;
        progress.max = 100; 
        progress.textContent = `${stat.name}: ${stat.base_stat}`;
        modalPokemonStats.appendChild(progress);
    });

    pokemonModal.style.display = 'block';
    closeModalButton.addEventListener('click', closeModal);

}

function closeModal() {
    pokemonModal.style.display = 'none';

    closeModalButton.removeEventListener('click', closeModal);
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) => {
            const li = document.createElement('li');
            li.classList.add('pokemon', ...pokemon.types);
            li.innerHTML = `
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>

                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>

                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
            `;
            li.addEventListener('click', () => {
                showModal(pokemon);
            });
            return li;
        });
        pokemonList.append(...newHtml);
    });
}


loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})