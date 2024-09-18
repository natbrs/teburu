function saveCredentials() {
  const email = document.getElementById('email').value
  const pass = document.getElementById('pass').value
  const rememberMe = document.getElementById('rememberMe').checked

  if (rememberMe) {
    localStorage.setItem('email', email)
    localStorage.setItem('password', pass)
  } else {
    localStorage.removeItem('email')
    localStorage.removeItem('password')
  }
}
function loadCredentials() {
  const savedEmail = localStorage.getItem('email')
  const savedPassword = localStorage.getItem('password')

  if (savedEmail) {
    document.getElementById('email').value = savedEmail
  }

  if (savedPassword) {
    document.getElementById('pass').value = savedPassword
    document.getElementById('rememberMe').checked = true
  }
}

window.onload = function () {
  loadCredentials()
}
document.querySelector('.loginBtn').addEventListener('click', function () {
  saveCredentials()
})
