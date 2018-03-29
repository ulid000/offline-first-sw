const MESSAGE_URL = 'http://localhost:8080/message';
var moment = require("moment");

function init() {
  let title = document.createElement('h1');
  title.textContent = 'Offline Demo';
  document.body.appendChild(title);
  let messageDisplay = document.createElement('div');
  messageDisplay.id = 'messageDisplay'
  document.body.appendChild(messageDisplay);
  let timeDisplay = document.createElement('div');
  timeDisplay.id = 'timeDisplay'
  document.body.appendChild(timeDisplay);
  let nowDisplay = document.createElement('div');
  nowDisplay.id = 'nowDisplay'
  document.body.appendChild(nowDisplay);
  fetchMessage().then(json => renderJson(json));
  
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').then(registration => {
        console.log('service worker registered: ', registration);
      }).catch(registrationError => {
        console.log('service worker registration failed: ', registrationError);
      });
    });
  }

  const updatesChannel = new BroadcastChannel('message-update-channel');
  updatesChannel.addEventListener('message', async (event) => {
    const {cacheName, updatedUrl} = event.data.payload;
    console.log('updating from broadcast channel');
    const cache = await caches.open(cacheName);
    const updatedResponse = await cache.match(updatedUrl);
    const updatedJson = await updatedResponse.json();
    renderJson(updatedJson);
  });
}

function fetchMessage() {
  renderJson({'message':'...', 'timestamp':'...'})
  console.log('fetching message');
  return fetch(MESSAGE_URL).then(response => {
    return response.json();
  })
  .catch(error => console.error('Fetch Error:', error));
}

function renderJson(json) {
  console.log('rendering message');
  let messageDisplay = document.querySelector('#messageDisplay');
  messageDisplay.innerHTML = json.message;
  let timeDisplay = document.querySelector('#timeDisplay');
  timeDisplay.innerHTML = json.timestamp + " (content)";
  let nowDisplay = document.querySelector('#nowDisplay');
  nowDisplay.innerHTML = moment().format('DD.MM.YY HH.mm.SS') + " (rendering)";
}

init();