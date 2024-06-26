const API_URL = 'https://pokeapi.co/api/v2';

const searchButton = document.querySelector('.buttonSearch');
const inputTag = document.getElementById('in1');
const buttonEvolution = document.querySelector('.buttonEvolution');
const containerError = document.querySelector('.containerError');
let evolutionName, currentName;


async function readData(url){
    try{
        const response = await fetch(url);
        const data = await response.json();
    
        return data;
    }catch(error){
        console.error('An error occurred ', error);
        return null;
    }
}

function showMainInfo(data){
    
    const pokemonName = document.querySelector('.pokemonName');
    const pokemonImg = document.querySelector('.pokemonImg');
    const pokemonType = document.querySelector('.pokemonType');

    const pokemonAbilities = document.querySelector('.pokemonAbilities');
    const abilitiesList = [];

    pokemonName.textContent = data.name;
    pokemonType.textContent = data.types[0].type.name;
    pokemonImg.src=data.sprites.other["official-artwork"].front_default;
    
    data.abilities.forEach(element => {
        abilitiesList.push(element.ability.name);
    });
    pokemonAbilities.textContent = abilitiesList.join(', ');

    readData(data.species.url)
        .then(data => showDescription(data))
        .catch(error => console.error('Failed to fetch data ',error))
    
    
}

function showDescription(data){
    const pokemonDescription = document.querySelector('.pokemonDescription');
    const containerInfo = document.querySelector('.containerInfo');

    pokemonDescription.textContent = data.flavor_text_entries[6].flavor_text;
    containerInfo.style.display = 'block';

    console.log(data.evolution_chain.url);
    readData(data.evolution_chain.url)
        .then(data => validateIfThereIsNextEvolution(data))
        .catch(error => console.error(`Failed to fetch data ${data.evolution_chain.url}`,error))

}

function validateIfThereIsNextEvolution(data){
    if(data.chain.evolves_to[0]){
        const containerEvolution = document.querySelector('.containerEvolution');
        console.log(currentName);
        if(currentName === data.chain.evolves_to[0].species.name){
            if(data.chain.evolves_to[0].evolves_to[0]){
                evolutionName = data.chain.evolves_to[0].evolves_to[0].species.name;
                containerEvolution.style.display = 'block';  
            }
        }else{
            evolutionName = data.chain.evolves_to[0].species.name;  
            containerEvolution.style.display = 'block';
        }
    }
}


searchButton.addEventListener("click",
    (event)=>{
        event.preventDefault();
        if(inputTag.value){
            containerError.style.display = 'none';
            readData(`${API_URL}/pokemon/${inputTag.value.toLowerCase()}`)
                .then(data => {
                    currentName = inputTag.value.toLowerCase();
                    showMainInfo(data)
                })
                .catch(error => containerError.style.display = 'block');
        }
    }
);

buttonEvolution.addEventListener("click",
    (event)=>{
        event.preventDefault();
        readData(`${API_URL}/pokemon/${evolutionName}`)
                    .then(data => {
                        currentName = evolutionName;
                        showMainInfo(data)
                    })
                    .catch(error => console.log('Failed fetch the data ',error));
    }
)




