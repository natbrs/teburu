document.addEventListener('DOMContentLoaded', function () {
  const eyeIcon = document.getElementById('olho');
  const passwordField = document.getElementById('pass');

  const eyeIconConfirm = document.getElementById('olho-confirm');
  const confirmPasswordField = document.getElementById('pass-confirm');

  const eyeIconEdit = document.getElementById('olho-edit');
  const passwordFieldEdit = document.getElementById('pass-edit');

  const eyeIconConfirmEdit = document.getElementById('olho-confirm-edit');
  const confirmPasswordFieldEdit = document.getElementById('pass-confirm-edit');

  const eyeIconConfirmNewEdit = document.getElementById('olho-confirm-new-edit');
  const confirmNewPasswordFieldEdit = document.getElementById('pass-confirm-new-edit');

  function toggleEyeIconVisibility(inputField, eyeIcon) {
    if (inputField.value) {
      eyeIcon.style.opacity = 1;
    } else {
      eyeIcon.style.opacity = 0;
    }
  }

  function addInputEventListeners(inputField, eyeIcon) {
    inputField.addEventListener('input', function () {
      toggleEyeIconVisibility(inputField, eyeIcon);
    });

    inputField.addEventListener('focus', function () {
      toggleEyeIconVisibility(inputField, eyeIcon);
    });

    inputField.addEventListener('blur', function () {
      toggleEyeIconVisibility(inputField, eyeIcon);
    });
  }

  if (eyeIcon && passwordField) {
    addInputEventListeners(passwordField, eyeIcon);
    eyeIcon.addEventListener('click', function () {
      if (passwordField.type === 'password') {
        passwordField.type = 'text';
        eyeIcon.classList.remove('bx-low-vision');
        eyeIcon.classList.add('bx-show-alt');
      } else {
        passwordField.type = 'password';
        eyeIcon.classList.remove('bx-show-alt');
        eyeIcon.classList.add('bx-low-vision');
      }
    });
  }

  if (eyeIconConfirm && confirmPasswordField) {
    addInputEventListeners(confirmPasswordField, eyeIconConfirm);
    eyeIconConfirm.addEventListener('click', function () {
      if (confirmPasswordField.type === 'password') {
        confirmPasswordField.type = 'text';
        eyeIconConfirm.classList.remove('bx-low-vision');
        eyeIconConfirm.classList.add('bx-show-alt');
      } else {
        confirmPasswordField.type = 'password';
        eyeIconConfirm.classList.remove('bx-show-alt');
        eyeIconConfirm.classList.add('bx-low-vision');
      }
    });
  }

  if (eyeIconEdit && passwordFieldEdit) {
    addInputEventListeners(passwordFieldEdit, eyeIconEdit);
    eyeIconEdit.addEventListener('click', function () {
      if (passwordFieldEdit.type === 'password') {
        passwordFieldEdit.type = 'text';
        eyeIconEdit.classList.remove('bx-low-vision');
        eyeIconEdit.classList.add('bx-show-alt');
      } else {
        passwordFieldEdit.type = 'password';
        eyeIconEdit.classList.remove('bx-show-alt');
        eyeIconEdit.classList.add('bx-low-vision');
      }
    });
  }

  if (eyeIconConfirmEdit && confirmPasswordFieldEdit) {
    addInputEventListeners(confirmPasswordFieldEdit, eyeIconConfirmEdit);
    eyeIconConfirmEdit.addEventListener('click', function () {
      if (confirmPasswordFieldEdit.type === 'password') {
        confirmPasswordFieldEdit.type = 'text';
        eyeIconConfirmEdit.classList.remove('bx-low-vision');
        eyeIconConfirmEdit.classList.add('bx-show-alt');
      } else {
        confirmPasswordFieldEdit.type = 'password';
        eyeIconConfirmEdit.classList.remove('bx-show-alt');
        eyeIconConfirmEdit.classList.add('bx-low-vision');
      }
    });
  }

  if (eyeIconConfirmNewEdit && confirmNewPasswordFieldEdit) {
    addInputEventListeners(confirmNewPasswordFieldEdit, eyeIconConfirmNewEdit);
    eyeIconConfirmNewEdit.addEventListener('click', function () {
      if (confirmNewPasswordFieldEdit.type === 'password') {
        confirmNewPasswordFieldEdit.type = 'text';
        eyeIconConfirmNewEdit.classList.remove('bx-low-vision');
        eyeIconConfirmNewEdit.classList.add('bx-show-alt');
      } else {
        confirmNewPasswordFieldEdit.type = 'password';
        eyeIconConfirmNewEdit.classList.remove('bx-show-alt');
        eyeIconConfirmNewEdit.classList.add('bx-low-vision');
      }
    });
  }
});