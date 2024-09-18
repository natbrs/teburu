import { auth } from './firebase.js'

document.addEventListener('deviceready', onDeviceReady, false)

function onDeviceReady() {
  console.log('Firebase Auth:', auth)
  console.log('Running cordova-' + cordova.platformId + '@' + cordova.version)
  document.getElementById('deviceready').classList.add('ready')
}
