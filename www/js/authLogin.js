import { signInWithEmailAndPassword, getAuth, signOut, sendEmailVerification } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { auth } from './firebase.js';

const authInstance = getAuth();
const firestore = getFirestore();

function getDeviceInfo() {
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
}

async function login() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('pass').value.trim();
    const loginMessage = document.getElementById('loginMessage');

    loginMessage.innerHTML = '';
    loginMessage.style.opacity = 0;
    loginMessage.style.display = 'none';

    if (email === '' || password === '') {
        loginMessage.innerHTML =
            '<i class="bx bxs-error-circle"></i> Por favor, preencha todos os campos.';
        loginMessage.className = 'login-message error';
        loginMessage.style.display = 'block';

        setTimeout(() => {
            loginMessage.style.opacity = 1;
        }, 10);
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
        const user = userCredential.user;

        const settingsRef = doc(firestore, 'users', user.uid, 'security', 'settings');
        const settingsSnap = await getDoc(settingsRef);

        if (settingsSnap.exists() && settingsSnap.data().emailConfirmationEnabled) {
            const deviceInfo = getDeviceInfo();
            const docRef = doc(firestore, 'users', user.uid, 'security', 'deviceInfo');
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists() || JSON.stringify(docSnap.data()) !== JSON.stringify(deviceInfo)) {
                if (!user.emailVerified) {
                    await sendEmailVerification(user);
                    loginMessage.innerHTML =
                        '<i class="bx bxs-check-circle"></i> Email de confirmação enviado. Verifique seu email.';
                    loginMessage.className = 'login-message success';
                    loginMessage.style.display = 'block';

                    setTimeout(() => {
                        loginMessage.style.opacity = 1;
                    }, 10);
                    return;
                } else {
                    // Save the device info if the email is verified
                    await setDoc(doc(firestore, 'users', user.uid, 'security', 'deviceInfo'), deviceInfo);
                }
            }
        }

        // Load the email confirmation setting and update the checkbox if it exists
        const emailConfirmationCheckbox = document.getElementById('email-confirmation');
        if (emailConfirmationCheckbox && settingsSnap.exists()) {
            const emailConfirmationEnabled = settingsSnap.data().emailConfirmationEnabled;
            emailConfirmationCheckbox.checked = emailConfirmationEnabled;
        }

        loginMessage.innerHTML =
            '<i class="bx bxs-check-circle"></i> Login bem-sucedido!';
        loginMessage.className = 'login-message success';
        loginMessage.style.display = 'block';

        setTimeout(() => {
            loginMessage.style.opacity = 1;
        }, 10);
        setTimeout(() => {
            window.location.href = 'menuPrincipal.html';
        }, 2000);
    } catch (error) {
        const errorMessage = error.message;
        loginMessage.innerHTML =
            '<i class="bx bxs-error-circle"></i> Erro de autenticação: ' +
            errorMessage;
        loginMessage.className = 'login-message error';
        loginMessage.style.display = 'block';

        setTimeout(() => {
            loginMessage.style.opacity = 1;
        }, 10);
    }
}

document.querySelector('#btnLogin').addEventListener('click', login);

document.getElementById('logout').addEventListener('click', async () => {
    try {
        await signOut(authInstance);
        console.log('User signed out.');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Sign out error:', error);
    }
});