import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';
import { auth, firestore, storage } from './firebase.js';
import { uploadImage, selectedFile } from './uploadProfile.js';

document.getElementById('confirmar').addEventListener('click', async function () {
  const nick = document.getElementById('nick').value.trim();
  const email = document.getElementById('email').value.trim();
  const pass = document.getElementById('pass').value.trim();
  const passConfirm = document.getElementById('pass-confirm').value.trim();
  const registerMessage = document.getElementById('registerMessage');

  registerMessage.innerHTML = '';
  registerMessage.style.opacity = 0;
  registerMessage.style.display = 'none';

  if (nick === '' || email === '' || pass === '' || passConfirm === '') {
    registerMessage.innerHTML =
      '<i class="fa fa-exclamation-circle"></i> Por favor, preencha todos os campos.';
    registerMessage.className = 'login-message error';
    registerMessage.style.display = 'block';

    setTimeout(() => {
      registerMessage.style.opacity = 1;
    }, 10);
    return;
  }
  if (pass !== passConfirm) {
    registerMessage.innerHTML =
      '<i class="fa fa-exclamation-circle"></i> As senhas não coincidem.';
    registerMessage.className = 'login-message error';
    registerMessage.style.display = 'block';

    setTimeout(() => {
      registerMessage.style.opacity = 1;
    }, 10);
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    let profilePicUrl = '';
    if (selectedFile) {
      profilePicUrl = await uploadImage(selectedFile);
    }

    await setDoc(doc(firestore, 'users', user.uid), {
      nick: nick,
      email: email,
      profilePicUrl: profilePicUrl,
      level: 0,
      biography: ''
    });

    registerMessage.innerHTML =
      '<i class="fa fa-check-circle"></i> Usuário cadastrado com sucesso!';
    registerMessage.className = 'login-message success';
    registerMessage.style.display = 'block';

    setTimeout(() => {
      registerMessage.style.opacity = 1;
    }, 10);

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  } catch (error) {
    const errorMessage = error.message;
    registerMessage.innerHTML =
      '<i class="fa fa-exclamation-circle"></i> Erro: ' + errorMessage;
    registerMessage.className = 'login-message error';
    registerMessage.style.display = 'block';

    setTimeout(() => {
      registerMessage.style.opacity = 1;
    }, 10);
  }
});
