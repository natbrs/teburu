import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { auth } from './firebase.js';

function login() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('pass').value.trim();
  const loginMessage = document.getElementById('loginMessage');

  loginMessage.innerHTML = '';
  loginMessage.style.opacity = 0;
  loginMessage.style.display = 'none';

  if (email === '' || password === '') {
    loginMessage.innerHTML =
      '<i class="fa fa-exclamation-circle"></i> Por favor, preencha todos os campos.';
    loginMessage.className = 'login-message error';
    loginMessage.style.display = 'block';

    setTimeout(() => {
      loginMessage.style.opacity = 1;
    }, 10);
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      loginMessage.innerHTML =
        '<i class="fa fa-check-circle"></i> Login bem-sucedido!';
      loginMessage.className = 'login-message success';
      loginMessage.style.display = 'block';

      setTimeout(() => {
        loginMessage.style.opacity = 1;
      }, 10);

      setTimeout(() => {
        window.location.href = 'menuPrincipal.html';
      }, 2000);
    })
    .catch((error) => {
      const errorMessage = error.message;
      loginMessage.innerHTML =
        '<i class="fa fa-exclamation-circle"></i> Erro de autenticação: ' +
        errorMessage;
      loginMessage.className = 'login-message error';
      loginMessage.style.display = 'block';

      setTimeout(() => {
        loginMessage.style.opacity = 1;
      }, 10);
    });
}

document.querySelector('.loginBtn').addEventListener('click', login);
