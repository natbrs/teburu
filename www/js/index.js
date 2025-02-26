import { auth } from './firebase.js';

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
  console.log('Firebase Auth:', auth);
  console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
  const deviceReadyElement = document.getElementById('deviceready');
  if (deviceReadyElement) {
    deviceReadyElement.classList.add('ready');
  } else {
    console.error('Element with id "deviceready" not found.');
  }
}

function toggleProfileOptions() {
  const profileContainer = document.getElementById('profile-container');
  const profileOptions = document.getElementById('profile-options');
    
  if (profileOptions.style.display === 'block') {
    profileOptions.style.display = 'none';
    profileContainer.classList.remove('active-border');
  } else {
    profileOptions.style.display = 'block';
    profileContainer.classList.add('active-border');
  }
}