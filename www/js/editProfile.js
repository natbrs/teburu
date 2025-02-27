import { getFirestore, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { app } from './firebase.js';

const auth = getAuth();
const firestore = getFirestore(app);

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