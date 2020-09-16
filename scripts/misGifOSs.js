window.onload = () => {
    loadPage();
}

function loadPage() {
    changeMode();
    createGifos();
    dropDownMenuModes();
    getModeInStorage();
    setDisplayValues();
    activateCamera();
    gifsByIdToGifosSecction();
}

function dropDownMenuModes() {
    let button = document.getElementById('dropDownButton');

    button.addEventListener('click', () => {
        let modeContainer = document.getElementById('shiftModeContainer');
        let display = getContainerDisplay('shiftModeContainer');
        let myGifosSecction = document.getElementById('myGifosSecction');

        if (display === 'none') {
            modeContainer.setAttribute('class', 'shiftModeContainer');

        } else {
            modeContainer.setAttribute('class', 'hidden');
        }
    });
}

function getContainerDisplay(idContainer) {
    let container = document.getElementById(idContainer);
    let containerStyle = window.getComputedStyle(container);
    let display = containerStyle.getPropertyValue('display');

    return display;
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
    document.getElementById('camera').setAttribute('src', './assets/camera.svg');
}

function changeToNight(){
    document.getElementById('modeSelectorContainer').setAttribute('class', 'nightMode');
    document.getElementById('logo').setAttribute('src', './assets/gifOF_logo_dark.png');
    document.getElementById('camera').setAttribute('src', './assets/camera_light.svg');
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

function setDisplayValues(){
    let classTutorial = localStorage.getItem('classTutorial');
    let classContainerButtons = localStorage.getItem('classContainerButtons');

    let buttonsContainer = document.getElementById('buttonsContainer');
    let createGifOsContainer = document.getElementById('createGifOsContainer');

    if (classTutorial === 'true' && classContainerButtons === 'false'){
        buttonsContainer.setAttribute('class', 'hidden');
        createGifOsContainer.setAttribute('class', 'createGifOsContainer');
    }
    if (classTutorial === 'false' && classContainerButtons === 'true'){
        buttonsContainer.setAttribute('class', 'buttonsContainer');
        createGifOsContainer.setAttribute('class', 'hidden');
    }
}

function createGifos(){

    let button = document.getElementById('createGifo');

    button.addEventListener('click', () => {
        let buttonsContainer = document.getElementById('buttonsContainer');
        let createGifOsContainer = document.getElementById('createGifOsContainer');

        buttonsContainer.setAttribute('class', 'hidden');
        createGifOsContainer.setAttribute('class', 'createGifOsContainer');
    });
}

function activateCamera(){
    let button = document.getElementById('start');

    button.addEventListener('click', () => {
        let buttonsContainer = document.getElementById('buttonsContainer');
        let createGifOsContainer = document.getElementById('createGifOsContainer');
        let myGifos = document.getElementById('myGifosSecction');
        let videoContainer = document.getElementById('videoContainer');

        buttonsContainer.setAttribute('class', 'hidden');
        createGifOsContainer.setAttribute('class', 'hidden');
        myGifos.setAttribute('class', 'hidden');
        videoContainer.setAttribute('class', 'videoContainer');
        getStreamAndRecord();
    });
}

function start(){
        document.getElementById('cameraIconContainer').setAttribute('class', 'hidden'); 
        document.getElementById('captureButton').setAttribute('class', 'hidden');
        document.getElementById('recodingIconContainer').setAttribute('class', 'recodingIconContainer');
        document.getElementById('readyButton').setAttribute('class', 'readyButton');
}

function stop(){
    document.getElementById('recodingIconContainer').setAttribute('class', 'hidden');
    document.getElementById('readyButton').setAttribute('class', 'hidden');
    document.getElementById('replayButton').setAttribute('class', 'replayButton');
    document.getElementById('uploadButton').setAttribute('class', 'uploadButton');
}

function repetir(recorder){
    let replay = document.getElementById('replay');

    replay.addEventListener('click', () => {
        showPreview(recorder);
    });
}

function getStreamAndRecord() {
    createVideoTag();
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
    })
    .then(function(stream){
        video.srcObject = stream;
        video.play();
        rec(stream);
    })
}

function rec(stream) {
    let startButton = document.getElementById('startRecording');
    let stopButton = document.getElementById('stopRecording');
    let saveButton = document.getElementById('upload');
    let replayButton = document.getElementById('replay');
    let downloadButton = document.getElementById('download');

    startButton.addEventListener('click', function (){
        recorder = RecordRTC(stream, {
            type: 'gif',
            frameRate: 1,
            quality: 10,
            width: 360,
            hidden: 240,
            onGifRecordingStarted: function () {
                console.log('started');
            }
        });

        recorder.startRecording();
        start();

        stopButton.addEventListener('click', () => {
            recorder.stopRecording();
            stop();

            replayButton.addEventListener('click', () => {
                showPreview(recorder);
            });
            saveButton.addEventListener('click', () => {
                showUploadingGifoContainer();
                uploadGif(recorder);
                downloadButton.addEventListener('click', () => {
                    download(recorder);
                })
            });
        })
    })
}

function showPreview(recorder){
    let preview = document.getElementById('gifPreview');
    let video = document.getElementById('video');
    preview.setAttribute('src', URL.createObjectURL(recorder.getBlob()));
    video.remove();
    preview.setAttribute('id', 'video');
}

async function uploadGif(recorder){
    let form = new FormData();
    form.append('file', recorder.getBlob(), 'myGif.gif');
    console.log(form.get('file'));

    let urlGiphyUpload = 'https://upload.giphy.com/v1/gifs';
    let apiKey = '8qTXMoRphHAHM6gMRcC2YVMaTYLoOJIu'
    
    const upGifo = await fetch (`${urlGiphyUpload}?api_key=${apiKey}`, {
        method: 'POST',
        mode: 'cors',
        body: form
    })

    const datos = await upGifo.json();
    let id = datos.data.id;
    console.log(id);
    saveList(id);
    uploadedSuccessfully(id);
}

function saveList(id) {
    let list = localStorage.getItem('idListStorage');

    if (list !== null) {
        let newLista = JSON.parse(list);
        newLista.push(id);
        localStorage.setItem('idListStorage', JSON.stringify(newLista));
    } else {
        let newLista = [];
        newLista.push(id);
        localStorage.setItem('idListStorage', JSON.stringify(newLista));
    }
}

async function uploadedSuccessfully(id) {
    let uploadingGifoContainer = document.getElementById('uploadingGifoContainer');
    let uploadedSuccessfullyContainer = document.getElementById('uploadedSuccessfullyContainer');
    
    uploadingGifoContainer.setAttribute('class', 'hidden');
    uploadedSuccessfullyContainer.setAttribute('class', 'uploadedSuccessfullyContainer');    

    let gifo = await gifsById(id);

    let btnLink = document.getElementById('link');
    let lastPreview = document.getElementById('lastPreview');
    btnLink.setAttribute('href', gifo.data.url);
    lastPreview.setAttribute('src', gifo.data.images.downsized_large.url);
} 

function download(recorder) {
    const video = recorder.getBlob();
    const blob = new Blob ([video], {type: 'gif'});
    downloadFile(blob, 'gifo.gif');
}

function downloadFile(blob, fileName) {
    const url = window.URL.createObjectURL(blob);
    const a = document.getElementById('download');
    a.setAttribute('href', url);
    a.setAttribute('download', fileName);
}

async function gifsById(id) {
    let list = JSON.parse(localStorage.getItem('idListStorage'));
    let urlById = 'https://api.giphy.com/v1/gifs/'
    let apiKey = '8qTXMoRphHAHM6gMRcC2YVMaTYLoOJIu'

    const resp = await fetch(`${urlById}${id}?api_key=${apiKey}`)
    const datos = await resp.json();

    return datos;
}

function showUploadingGifoContainer() {
    let videoContainer = document.getElementById('videoContainer');
    let uploadingGifoContainer = document.getElementById('uploadingGifoContainer');

    videoContainer.setAttribute('class', 'hidden');
    uploadingGifoContainer.setAttribute('class', 'uploadingGifoContainer');
}

async function gifsByIdToGifosSecction() {
    let list = JSON.parse(localStorage.getItem('idListStorage'));

    if (list !== null) {
        let urlById = 'https://api.giphy.com/v1/gifs/'
        let apiKey = '8qTXMoRphHAHM6gMRcC2YVMaTYLoOJIu'

        for (i = 0; i < list.length; i++) {
            let id = list[i];
            const resp = await fetch(`${urlById}${id}?api_key=${apiKey}`)
            const datos = await resp.json();

            let imgUrl = datos.data.images.downsized_large.url;
            containerPlusUrl(imgUrl);
        }
    } else {
        console.log('NO GIFOS.');
    }
}

function containerPlusUrl(url) {
    let container = document.getElementById('gifosViewContainer');
    let img = document.createElement('img');
    img.setAttribute('src', url);
    container.appendChild(img);
}

function createVideoTag(){
    let video = document.createElement('video');
    video.setAttribute('id', 'video');
    let container = document.getElementById('gif');

    container.appendChild(video);
}

function cleanScreen(){
    let gifPreview = document.getElementById('video');
    gifPreview.setAttribute('id', 'gifPreview');
    gifPreview.setAttribute('src', ' ');
}

function showMyGifOS(gifsInStorage){
    if(gifsInStorage.length > 0){
        let myGifos = document.getElementById('myGifos');
        for(i = 0; i < gifsInStorage.length; i++){
            let gifoContainer = document.createElement('div');
            gifoContainer.setAttribute('src', URL.createObjectURL(gifsInStorage.getBlob()));
            myGifos.appendChild(gifoContainer);
        }
    }
}