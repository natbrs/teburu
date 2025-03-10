import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getFirestore, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';
import { app } from './firebase.js';

import { uploadAndPreviewImage } from './uploadProfile.js';

const auth = getAuth();
const firestore = getFirestore(app);
const storage = getStorage(app);

window.editBiography = function() {
  const biographyText = document.getElementById('user-biography').innerText;
  const biographyInput = document.getElementById('biography-input');
  if (biographyText.includes('Você ainda não adicionou uma biografia.')) {
    biographyInput.value = '';
  } else {
    biographyInput.value = biographyText;
  }
  document.getElementById('user-biography').style.display = 'none';
  document.querySelector('.biography-edit-container').style.display = 'flex';
};

window.saveBiography = async function() {
  let newBiography = document.getElementById('biography-input').value.trim();
  const user = auth.currentUser;
  if (newBiography === '') {
    newBiography = 'Você ainda não adicionou uma biografia. <br>(Clique para adicionar)';
  }
  if (user) {
    await updateDoc(doc(firestore, 'users', user.uid), {
      biography: newBiography
    });
    document.getElementById('user-biography').innerHTML = newBiography;
    document.getElementById('user-biography').style.display = 'block';
    document.querySelector('.biography-edit-container').style.display = 'none';
  }
};

window.cancelBiography = function() {
  document.getElementById('user-biography').style.display = 'block';
  document.querySelector('.biography-edit-container').style.display = 'none';
};

window.saveProfile = async function() {
    const user = auth.currentUser;
    const nick = document.getElementById('nick-edit').value.trim();
    const email = document.getElementById('email-edit').value.trim();
    const pass = document.getElementById('pass-edit').value.trim();
    const passConfirm = document.getElementById('pass-confirm-new-edit').value.trim();
    const currentPass = document.getElementById('pass-confirm-edit').value.trim();
    const fileInput = document.getElementById('fileInputEdit');
    const file = fileInput.files[0];
    const profileMessage = document.getElementById('profileMessage');

    profileMessage.innerHTML = '';
    profileMessage.style.opacity = 0;
    profileMessage.style.display = 'none';
    if (!currentPass) {
        profileMessage.innerHTML =
            '<i class="bx bxs-error-circle"></i> Por favor, forneça a senha atual.';
        profileMessage.className = 'edit-message error';
        profileMessage.style.display = 'block';

        setTimeout(() => {
            profileMessage.style.opacity = 1;
        }, 10);
        return;
    }
    if (pass && pass !== passConfirm) {
        profileMessage.innerHTML =
            '<i class="bx bxs-error-circle"></i> As senhas não coincidem.';
        profileMessage.className = 'edit-message error';
        profileMessage.style.display = 'block';

        setTimeout(() => {
            profileMessage.style.opacity = 1;
        }, 10);
        return;
    }
    try {
        const credential = EmailAuthProvider.credential(user.email, currentPass);
        await reauthenticateWithCredential(user, credential);

        if (file) {
            const storageRef = ref(storage, 'profile_pic/' + file.name);
            const snapshot = await uploadBytes(storageRef, file);
            const profilePicUrl = await getDownloadURL(snapshot.ref);
            await updateDoc(doc(firestore, 'users', user.uid), { profilePicUrl });
        }

        if (nick) {
            await updateDoc(doc(firestore, 'users', user.uid), { nick });
        }

        if (email) {
            await updateEmail(user, email);
            await updateDoc(doc(firestore, 'users', user.uid), { email });
        }

        if (pass) {
            await updatePassword(user, pass);
        }

        profileMessage.innerHTML =
            '<i class="bx bxs-check-circle"></i> Perfil atualizado com sucesso!';
        profileMessage.className = 'edit-message success';
        profileMessage.style.display = 'block';

        setTimeout(() => {
            profileMessage.style.opacity = 1;
        }, 10);
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    } catch (error) {
        profileMessage.innerHTML =
            '<i class="bx bxs-error-circle"></i> Erro ao atualizar perfil: ' + error.message;
        profileMessage.className = 'edit-message error';
        profileMessage.style.display = 'block';

        setTimeout(() => {
            profileMessage.style.opacity = 1;
        }, 10);
    }
};