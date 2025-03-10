import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { app } from './firebase.js';

const auth = getAuth();
const firestore = getFirestore(app);

function initializeProfile() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDoc = await getDoc(doc(firestore, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const profileElements = {
          'profile-img': userData.profilePicUrl,
          'profile-img-mini': userData.profilePicUrl,
          'profile-img-menu': userData.profilePicUrl,
          'profile': userData.profilePicUrl,
          'profile-nick': userData.nick,
          'profile-nick-menu': userData.nick,
          'user-level': userData.level,
          'user-biography': userData.biography || 'Você ainda não adicionou uma biografia. <br>(Clique para adicionar)'
        };

        for (const [id, value] of Object.entries(profileElements)) {
          const element = document.getElementById(id);
          if (element) {
            if (element.tagName === 'IMG') {
              element.src = value;
            } else if (id === 'user-biography') {
              element.innerHTML = value;
            } else {
              element.textContent = value;
            }
          }
        }
        document.getElementById('nick-edit').value = userData.nick;
        document.getElementById('email-edit').value = userData.email;
      }
    }
  });
}

export { initializeProfile };