document.addEventListener('DOMContentLoaded', function (){
  const eyeIcon=document.getElementById('olho');
  const passwordField=document.getElementById('pass');

  const eyeIconConfirm=document.getElementById('olho-confirm');
  const confirmPasswordField=document.getElementById('pass-confirm');
  if(eyeIcon){
    eyeIcon.addEventListener('click', function(){
      if (passwordField.type==='password'){
        passwordField.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
      } else {
        passwordField.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
      }
    });
  }
  if(eyeIconConfirm && confirmPasswordField){
    eyeIconConfirm.addEventListener('click', function(){
      if(confirmPasswordField.type==='password'){
        confirmPasswordField.type='text';
        eyeIconConfirm.classList.remove('fa-eye');
        eyeIconConfirm.classList.add('fa-eye-slash');
      }else{
        confirmPasswordField.type='password';
        eyeIconConfirm.classList.remove('fa-eye-slash');
        eyeIconConfirm.classList.add('fa-eye');
      }
    });
  }
});