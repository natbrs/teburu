import {
  getAuth,
  sendPasswordResetEmail,
} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js'
import { auth } from './firebase.js'

document.getElementById('confirmar').addEventListener('click', function () {
  const email = document.getElementById('email').value.trim()
  const registerMessage = document.getElementById('registerMessage')

  registerMessage.innerHTML = ''
  registerMessage.style.opacity = 0
  registerMessage.style.display = 'none'

  if (email === '') {
    registerMessage.innerHTML =
      '<i class="fa fa-exclamation-circle"></i> Por favor, forneça um email válido.'
    registerMessage.className = 'login-message error'
    registerMessage.style.display = 'block'

    setTimeout(() => {
      registerMessage.style.opacity = 1
    }, 10)
    return
  }

  sendPasswordResetEmail(auth, email)
    .then(() => {
      registerMessage.innerHTML =
        '<i class="fa fa-check-circle"></i> Link de recuperação enviado! Verifique seu email.'
      registerMessage.className = 'login-message success'
      registerMessage.style.display = 'block'

      setTimeout(() => {
        registerMessage.style.opacity = 1
      }, 10)
    })
    .catch((error) => {
      const errorMessage = error.message
      registerMessage.innerHTML =
        '<i class="fa fa-exclamation-circle"></i> Erro: ' + errorMessage
      registerMessage.className = 'login-message error'
      registerMessage.style.display = 'block'

      setTimeout(() => {
        registerMessage.style.opacity = 1
      }, 10)
    })
})
