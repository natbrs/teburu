import { getFirestore, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { app } from './firebase.js';

const auth = getAuth();
const firestore = getFirestore(app);

window.editBiography = function() {
  const biographyText = document.getElementById('user-biography').innerText;
  document.getElementById('biography-input').value = biographyText;
  document.getElementById('user-biography').style.display = 'none';
  document.getElementById('biography-input').style.display = 'block';
  document.getElementById('save-biography-btn').style.display = 'block';
};

window.saveBiography = async function() {
  const newBiography = document.getElementById('biography-input').value;
  const user = auth.currentUser;
  if (user) {
    await updateDoc(doc(firestore, 'users', user.uid), {
      biography: newBiography
    });
    document.getElementById('user-biography').innerHTML = newBiography;
    document.getElementById('user-biography').style.display = 'block';
    document.getElementById('biography-input').style.display = 'none';
    document.getElementById('save-biography-btn').style.display = 'none';
  }
};