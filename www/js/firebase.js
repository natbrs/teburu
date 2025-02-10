import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-analytics.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

async function getToken() {
  const response = await fetch('http://localhost:4000/generate-token', {
    method: 'POST'
  });
  if (!response.ok) {
    throw new Error('Network response was not ok ' + response.statusText);
  }
  const data = await response.json();
  return data.token;
}

async function getFirebaseConfig(token) {
  const response = await fetch('http://localhost:4000/firebase-config', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  if (!response.ok) {
    throw new Error('Network response was not ok ' + response.statusText);
  }
  return response.json();
}

const token = await getToken();
const firebaseConfig = await getFirebaseConfig(token);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { auth, firestore, storage, analytics, database };