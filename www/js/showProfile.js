import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { app } from './firebase.js';

const auth = getAuth();
const firestore = getFirestore(app);

async function getProfilePicUrl(userId) {
  console.log('Fetching profile picture URL for user:', userId);
  const userDoc = await getDoc(doc(firestore, 'users', userId));
  if (userDoc.exists()) {
    console.log('User document data:', userDoc.data());
    return userDoc.data().profilePicUrl;
  } else {
    console.log('No such document!');
    return null;
  }
}

function initializeProfile() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDoc = await getDoc(doc(firestore, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const profileImg = document.getElementById("profile-img");
        const profileImgMini = document.getElementById("profile-img-mini");
        const profileImgMenu = document.getElementById("profile-img-menu");
        const profileNick = document.getElementById("profile-nick");
        const profileNickMenu = document.getElementById("profile-nick-menu");
        const userLevel = document.getElementById("user-level");
        if (userDoc.exists()) {
          profileImg.src = userData.profilePicUrl;
          profileImgMini.src = userData.profilePicUrl;
          profileImgMenu.src = userData.profilePicUrl;
          profileNick.textContent = userData.nick;
          profileNickMenu.textContent = userData.nick;
          userLevel.textContent = userData.level;
        }
      }
    }
  });
}

export { getProfilePicUrl, initializeProfile };