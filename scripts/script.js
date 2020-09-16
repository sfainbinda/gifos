window.onload = () => {
    loadPage();
}

function loadPage() {
    changeMode();
    getModeInStorage();
    getTrendResults();
    dropDownMenuModes();
    showRandomGifs();
    showSearchResults();
    goToMyGifos();
    goToCreateGifos();
    setData();
    btnStyle();
    reoloadPage();
    othersSearchs();
    seeMore();
}

function reoloadPage() {
    let logo = document.getElementById('logo');

    logo.addEventListener('click', () => {
        location.reload(); 
    });
}

function enableButtons(nightMode) {
    let modo = localStorage.getItem('nightMode');

    if (nightMode === 'true') {
        lens.setAttribute('src', './assets/lupa_light.svg');
        let searchButton = document.getElementById('searchButton');
        searchButton.setAttribute('class', 'searchButtonActive');
    } else {
        lens.setAttribute('src', './assets/lupa.svg');
        let searchButton = document.getElementById('searchButton');
        searchButton.setAttribute('class', 'searchButtonActive');
    }
}

function disableButtons(nightMode) {
    if (nightMode === 'true') {
        lens.setAttribute('src', './assets/combined_shape.svg');
        let searchButton = document.getElementById('searchButton');
        searchButton.setAttribute('class', 'searchButton');
    } else {
        lens.setAttribute('src', './assets/lupa_inactive.svg');
        let searchButton = document.getElementById('searchButton');
        searchButton.setAttribute('class', 'searchButton');
    }
}

function btnStyle() {
    let search = document.getElementById('search');
    
    search.addEventListener('keyup', (event) => {
        let term = search.value;
        let nightMode = localStorage.getItem('nightMode');
        let button = document.getElementById('goSearch');

        if (term !== null && term !== '') {
            enableButtons(nightMode);
        } else {
            disableButtons(nightMode);
        }
    });
}

function saveSearchTerm (searchTerm) {
    let list = localStorage.getItem('searchTerms');

    if (list !== null) {
        let newLista = JSON.parse(list);
        newLista.push(searchTerm);
        localStorage.setItem('searchTerms', JSON.stringify(newLista));
    } else {
        let newLista = [];
        newLista.push(searchTerm);
        localStorage.setItem('searchTerms', JSON.stringify(newLista));
    }
}

function showSearchTerm (searchTerm) {
    let father = document.getElementById('searchTermsContainer');
    let child = document.createElement('div');
    let text = document.createElement('p');

    child.setAttribute('class', 'searchTerm');
    text.innerHTML = '#' + searchTerm;
    child.appendChild(text);
    father.appendChild(child);
}

function getContainerDisplay(idContainer) {
    let container = document.getElementById(idContainer);
    let containerStyle = window.getComputedStyle(container);
    let display = containerStyle.getPropertyValue('display');

    return display;
}

function dropDownMenuModes() {
    let button = document.getElementById('dropDownButton');

    button.addEventListener('click', () => {
        let modeContainer = document.getElementById('shiftModeContainer');
        let display = getContainerDisplay('shiftModeContainer');

        if (display === 'none') {
            modeContainer.setAttribute('class', 'shiftModeContainer');
        } else {
            modeContainer.setAttribute('class', 'hidden');
        }
    });
}

function setModeInStorage(){
    let mode = document.getElementById('modeSelectorContainer').getAttribute('class');
    let valueInStorage;

    if (mode === 'dayMode'){
        valueInStorage = 'false';
    } else {
        valueInStorage = 'true';
    }
    localStorage.setItem('nightMode', valueInStorage);
}

function changeToDay(){
    document.getElementById('modeSelectorContainer').setAttribute('class', 'dayMode');
    document.getElementById('logo').setAttribute('src', './assets/gifOF_logo.png');
    document.getElementById('lens').setAttribute('src', './assets/lupa_inactive.svg'); 
    document.getElementById('icon').setAttribute('href', './assets/gifOF_logo.png');
}

function changeToNight(){
    document.getElementById('modeSelectorContainer').setAttribute('class', 'nightMode');
    document.getElementById('logo').setAttribute('src', './assets/gifOF_logo_dark.png');
    document.getElementById('lens').setAttribute('src', './assets/combined_shape.svg');
    document.getElementById('icon').setAttribute('href', './assets/gifOF_logo_dark.png');
}

function getModeInStorage(){
    let value = localStorage.getItem('nightMode');
    
    if (value === null){
        setModeInStorage();
    } else {
        if (value === 'false'){
            changeToDay();
        } else {
            changeToNight();
        }
    }
}
function changeMode(){
    let dayButton = document.getElementById('dayModeButton');
    let nightButton = document.getElementById('nightModeButton');
    let value = localStorage.getItem('nightMode');

    dayButton.addEventListener('click', () => {
        if (localStorage.getItem('nightMode') === 'true'){
            changeToDay();
            localStorage.setItem('nightMode', 'false');
        }
    });

    nightButton.addEventListener('click', () => {
        if (localStorage.getItem('nightMode') === 'false'){
            changeToNight();
            localStorage.setItem('nightMode', 'true');
        }
    });
}

function showRandomGifs() {
    Promise.all(getRandomGifs())
        .then(lodingRandomGifs)
        .catch((error) => {
            console.log('Algo salió mal.');
            console.log(error);
        });
}

async function searchResult(gifs) {
    let search = await fetch(gifs);
    let jsonFormat = await search.json();

    return jsonFormat;
}

function getRandomGifs() {
    let apiRandom = 'https://api.giphy.com/v1/gifs/random?api_key=8qTXMoRphHAHM6gMRcC2YVMaTYLoOJIu&tag=&rating=G';
    let arrayOfPromises = new Array();

    for (i = 0; i < 20; i++) {
        arrayOfPromises[i] = searchResult(apiRandom);
    }
    return arrayOfPromises;
}

function filterGifWithTitle(arrayOfPromises) {
    let gifsWithTitle = new Array();
    for (i = 0; i < arrayOfPromises.length; i++) {
        if (arrayOfPromises[i].data.title.length > 2) {
            gifsWithTitle.push(arrayOfPromises[i]);
        }
    }
    return gifsWithTitle;
}

function lodingRandomGifs(arrayOfPromises) {
    let randomSuggestions = document.getElementsByClassName('gifSuggestion');
    let gifsTitles = document.getElementsByClassName('randomSuggestionTitle')
    let gifSource = document.getElementsByClassName('seeMore');

    let listOfGifs = arrayOfPromises;
    let gifsWithTitle = filterGifWithTitle(listOfGifs);
    let titlesInStorage = new Array();
    
    for (i = 0; i < 4; i++) {
        randomSuggestions[i].setAttribute('src', gifsWithTitle[i].data.images.downsized_large.url);
        gifsTitles[i].innerHTML = gifsWithTitle[i].data.title;
        titlesInStorage.push(gifsWithTitle[i].data.title)
        console.log(gifsWithTitle[i].data.title.length);
    }

    localStorage.setItem('suggestionTitles', JSON.stringify(titlesInStorage));
}

function seeMore () {
    let seeMore1 = document.getElementById('seeMore1');
    let seeMore2 = document.getElementById('seeMore2');
    let seeMore3 = document.getElementById('seeMore3');
    let seeMore4 = document.getElementById('seeMore4');
    let searchTerm = null;
    
    seeMore1.addEventListener('click', () => {
        let suggestionTitles = JSON.parse(localStorage.getItem('suggestionTitles'));
        searchTerm = suggestionTitles[0];
        hideOtherElements();
        toogleClassSearchResultContainer();
        validateEmptySearchContainer(searchTerm);
        saveSearchTerm(searchTerm);
    });

    seeMore2.addEventListener('click', () => {
        let suggestionTitles = JSON.parse(localStorage.getItem('suggestionTitles'));
        searchTerm = suggestionTitles[1];
        hideOtherElements();
        toogleClassSearchResultContainer();
        validateEmptySearchContainer(searchTerm);
        saveSearchTerm(searchTerm);
    });

    seeMore3.addEventListener('click', () => {
        let suggestionTitles = JSON.parse(localStorage.getItem('suggestionTitles'));
        searchTerm = suggestionTitles[2];
        hideOtherElements();
        toogleClassSearchResultContainer();
        validateEmptySearchContainer(searchTerm);
        saveSearchTerm(searchTerm);
    });

    seeMore4.addEventListener('click', () => {
        let suggestionTitles = JSON.parse(localStorage.getItem('suggestionTitles'));
        searchTerm = suggestionTitles[3];
        hideOtherElements();
        toogleClassSearchResultContainer();
        validateEmptySearchContainer(searchTerm);
        saveSearchTerm(searchTerm);
    });
}

function hideOtherElements() {
    document.getElementById('todaySuggestion').setAttribute('class', 'hidden');
    document.getElementById('randomSuggestionsContainer').setAttribute('class', 'hidden');
    document.getElementById('trends').setAttribute('class', 'hidden');
    document.getElementById('trendGifsContainer').setAttribute('class', 'hidden');
}
function showSearchResults() {
    let button = document.getElementById('searchButton');
    let searchTerm = '';
    button.addEventListener('click', () => {
        searchTerm = document.getElementById('search').value;

        if (searchTerm !== ' ' && searchTerm.length > 0) {
            toogleClassSearchResultContainer();
            validateEmptySearchContainer(searchTerm);
            saveSearchTerm(searchTerm);
            showSearchTerm(searchTerm);
            document.getElementById('todaySuggestion').setAttribute('class', 'hidden');
            document.getElementById('randomSuggestionsContainer').setAttribute('class', 'hidden');
            document.getElementById('trends').setAttribute('class', 'hidden');
            document.getElementById('trendGifsContainer').setAttribute('class', 'hidden');
        }
    });
}

async function getSearchResults(searchTerm) {
    const apiTrending = await fetch('https://api.giphy.com/v1/gifs/search?api_key=8qTXMoRphHAHM6gMRcC2YVMaTYLoOJIu&q=' + searchTerm + '&limit=12&offset=0&rating=G&lang=en');
    let json = await apiTrending.json();

    for (i = 0; i < json.data.length; i++) {
        let parentContainer = document.getElementsByClassName('searchResultsContainer');
        let childContainer = document.createElement('img');
        let parrafo = document.getElementById('paragraphResult');

        childContainer.setAttribute('src', json.data[i].images.downsized_large.url)
        childContainer.setAttribute('class', 'searchGif')
        parentContainer[0].appendChild(childContainer);
        parrafo.innerHTML = 'Resultados de busqueda: "' + searchTerm + '"';
    };
}

function toogleClassSearchResultContainer() {
    let container = document.getElementById('searchContainer');
    let styleContainer = window.getComputedStyle(container).getPropertyValue('display');

    if (styleContainer == 'none') {
        container.setAttribute('class', 'searchContainer');
    }
}

function validateEmptySearchContainer(searchTerm) {
    let container = document.getElementsByClassName('searchGif');
    let fatherContainer = document.getElementById('searchResultsContainer');

    if (container !== null) {
        fatherContainer.innerHTML = '';
        getSearchResults(searchTerm);
    } else {
        getSearchResults(searchTerm);
    }
}


//-----------

function othersSearchs() {
    let retrowave = document.getElementById('retrowave');
    let dancing = document.getElementById('dancing');
    let yeah = document.getElementById('yeah');

    retrowave.addEventListener('click', () => {
        validateEmptySearchContainer('retrowave');
    });

    dancing.addEventListener('click', () => {
        validateEmptySearchContainer('dancing');
    });

    yeah.addEventListener('click', () => {
        validateEmptySearchContainer('yeah');
    });
}

//-----------
async function getTrendResults() {
    const apiTrending = await fetch('https://api.giphy.com/v1/gifs/trending?api_key=8qTXMoRphHAHM6gMRcC2YVMaTYLoOJIu&limit=20&rating=G');
    let json = await apiTrending.json();

    for (i = 0; i < json.data.length; i++) {
        let parentContainer = document.getElementsByClassName('trendGifsContainer');
        let childContainer = document.createElement('img');

        childContainer.setAttribute('src', json.data[i].images.downsized_large.url);
        childContainer.setAttribute('class', 'trendGif');
        parentContainer[0].appendChild(childContainer);
    };
}

function goToMyGifos(){
    let button = document.getElementById('myGifos');

    button.addEventListener('click', () => {
        localStorage.setItem('classTutorial', 'false');
        localStorage.setItem('classContainerButtons', 'true');
    });
}

function goToCreateGifos(){

    let button = document.getElementById('createGifo');

    button.addEventListener('click', () => {
        localStorage.setItem('classTutorial', 'true');
        localStorage.setItem('classContainerButtons', 'false');
    });
}

function setData(){
    localStorage.setItem('classTutorial', 'false');   
    localStorage.setItem('classContainerButtons', 'false');
}