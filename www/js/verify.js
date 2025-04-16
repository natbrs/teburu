import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getAuth, applyActionCode } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';

async function fetchFirebaseConfig() {
  try {
    const response = await fetch('http://localhost:4000/firebase-config', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao obter as configurações do Firebase');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar configurações do Firebase:', error);
    document.getElementById('message').innerText =
      'Erro ao carregar configurações. Tente novamente mais tarde.';
    return null;
  }
}

async function initializeFirebase() {
  if (window.firebaseApp) {
    console.log('Firebase já inicializado.');
    return window.firebaseApp;
  }

  const firebaseConfig = await fetchFirebaseConfig();
  if (!firebaseConfig) {
    console.error('Configurações do Firebase não carregadas.');
    document.getElementById('message').innerText =
      'Erro ao carregar configurações do Firebase.';
    return null;
  }

  try {
    const app = initializeApp(firebaseConfig);
    window.firebaseApp = app;
    console.log('Firebase inicializado com sucesso.');
    return app;
  } catch (error) {
    console.error('Erro ao inicializar o Firebase:', error);
    document.getElementById('message').innerText =
      'Erro ao inicializar o Firebase. Tente novamente mais tarde.';
    return null;
  }
}

async function processVerification() {
  console.log('Iniciando verificação...');
  const appInstance = await initializeFirebase();
  if (!appInstance) {
    return;
  }

  const auth = getAuth(appInstance);
  console.log('Auth obtido com sucesso.');

  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  const oobCode = urlParams.get('oobCode');

  if (mode === 'verifyEmail' && oobCode) {
    try {
      await applyActionCode(auth, oobCode);
      document.getElementById('message').innerText =
        'E-mail verificado com sucesso!';
      console.log('E-mail verificado com sucesso.');
    } catch (error) {
      document.getElementById('message').innerText =
        'Erro ao verificar o e-mail.';
      console.error('Erro ao verificar o e-mail:', error);
    }
  } else {
    document.getElementById('message').innerText = 'Parâmetros inválidos.';
  }
}

async function generateToken() {
  try {
    const response = await fetch('http://localhost:4000/generate-token', {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Erro ao gerar token de autenticação');
    }
    const data = await response.json();
    localStorage.setItem('authToken', data.token); // Salva o token no localStorage
    return data.token;
  } catch (error) {
    console.error('Erro ao gerar token de autenticação:', error);
    document.getElementById('message').innerText =
      'Erro ao gerar token de autenticação. Tente novamente mais tarde.';
    return null;
  }
}

window.onload = async () => {
  let authToken = localStorage.getItem('authToken');
  if (!authToken) {
    console.log('Token não encontrado. Gerando um novo token...');
    authToken = await generateToken();
    if (!authToken) {
      document.getElementById('message').innerText =
        'Erro ao gerar token de autenticação. Tente novamente mais tarde.';
      return; // Não prossiga se o token não puder ser gerado
    }
  }

  await processVerification();
};
