import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { auth } from './firebase.js';

const firestore = getFirestore();

function getDeviceInfo() {
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
}

async function saveSecuritySettings() {
    const emailConfirmationCheckbox = document.getElementById('email-confirmation');
    const securityMessage = document.getElementById('securityMessage');
    const isEnabled = emailConfirmationCheckbox.checked;

    const user = auth.currentUser;
    if (user) {
        const deviceInfo = getDeviceInfo();
        await setDoc(doc(firestore, 'users', user.uid, 'security', 'deviceInfo'), deviceInfo);
        await setDoc(doc(firestore, 'users', user.uid, 'security', 'settings'), { emailConfirmationEnabled: isEnabled });
    }

    securityMessage.innerHTML = '<i class="bx bxs-check-circle"></i> Configurações salvas com sucesso!';
    securityMessage.className = 'security-message success';
    securityMessage.style.display = 'block';
    setTimeout(() => {
        securityMessage.style.opacity = 1;
    }, 10);
    setTimeout(() => {
        securityMessage.style.opacity = 0;
        setTimeout(() => {
            securityMessage.style.display = 'none';
        }, 500);
    }, 3000);
}

window.saveSecuritySettings = saveSecuritySettings;

document.addEventListener('DOMContentLoaded', () => {
    const emailConfirmationCheckbox = document.getElementById('email-confirmation');
    const securityMessage = document.getElementById('securityMessage');

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const settingsRef = doc(firestore, 'users', user.uid, 'security', 'settings');
            const settingsSnap = await getDoc(settingsRef);

            if (settingsSnap.exists()) {
                const emailConfirmationEnabled = settingsSnap.data().emailConfirmationEnabled;
                emailConfirmationCheckbox.checked = emailConfirmationEnabled;
            }

            if (emailConfirmationCheckbox.checked && !user.emailVerified) {
                const deviceInfo = getDeviceInfo();
                const docRef = doc(firestore, 'users', user.uid, 'security', 'deviceInfo');
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists() || JSON.stringify(docSnap.data()) !== JSON.stringify(deviceInfo)) {
                    await user.sendEmailVerification();
                    console.log('Email de confirmação enviado.');
                }
            }
        }
    });
});