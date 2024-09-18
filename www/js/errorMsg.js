document.getElementById('myForm').addEventListener('submit', function (event) {
  const emailInput = document.getElementById('email')
  const emailError = document.getElementById('email-error')
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(emailInput.value)) {
    emailError.style.display = 'block'
    event.preventDefault()
  } else {
    emailError.style.display = 'none'
  }
})
