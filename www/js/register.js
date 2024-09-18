import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js'
import { auth } from './firebase.js'

document.getElementById('confirmar').addEventListener('click', function () {
  const nick = document.getElementById('nick').value.trim()
  const email = document.getElementById('email').value.trim()
  const pass = document.getElementById('pass').value.trim()
  const passConfirm = document.getElementById('pass-confirm').value.trim()
  const registerMessage = document.getElementById('registerMessage')

  registerMessage.innerHTML = ''
  registerMessage.style.opacity = 0
  registerMessage.style.display = 'none'

  if (nick === '' || email === '' || pass === '' || passConfirm === '') {
    registerMessage.innerHTML =
      '<i class="fa fa-exclamation-circle"></i> Por favor, preencha todos os campos.'
    registerMessage.className = 'login-message error'
    registerMessage.style.display = 'block'

    setTimeout(() => {
      registerMessage.style.opacity = 1
    }, 10)
    return
  }
  if (pass !== passConfirm) {
    registerMessage.innerHTML =
      '<i class="fa fa-exclamation-circle"></i> As senhas não coincidem.'
    registerMessage.className = 'login-message error'

    registerMessage.style.display = 'block'

    setTimeout(() => {
      registerMessage.style.opacity = 1
    }, 10)
    return
  }
  createUserWithEmailAndPassword(auth, email, pass)
    .then((userCredential) => {
      registerMessage.innerHTML =
        '<i class="fa fa-check-circle"></i> Usuário cadastrado com sucesso!'
      registerMessage.className = 'login-message success'
      registerMessage.style.display = 'block'

      setTimeout(() => {
        registerMessage.style.opacity = 1
      }, 10)

      setTimeout(() => {
        window.location.href = 'index.html'
      }, 2000)
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
