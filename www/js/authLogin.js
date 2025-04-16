import {
  signInWithEmailAndPassword,
  getAuth,
  signOut,
  sendEmailVerification,
} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js'
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js'
import { auth } from './firebase.js'
import { getDeviceInfo } from './security.js'

const authInstance = getAuth()
const firestore = getFirestore()

authInstance.onAuthStateChanged(async (user) => {
  if (user) {
    await user.reload();
    if (user.emailVerified) {
      console.log('Email verificado. Atualizando dispositivo...');
      await verifyDevice(user);
    } else {
      console.log('Email não verificado. Dispositivo não será atualizado.');
    }
  }
});

async function saveDeviceInfo(user) {
  const deviceInfo = getDeviceInfo();
  const docRef = doc(firestore, 'users', user.uid, 'security', 'deviceInfo');
  const docSnap = await getDoc(docRef);
  let registeredDevices = [];
  let isNewDevice = false;

  if (!docSnap.exists()) {
    console.log('Nenhum dispositivo registrado encontrado. Registrando novo dispositivo.');
    registeredDevices = [{ ...deviceInfo, verified: false, emailSentAt: null }];
    await setDoc(docRef, { devices: registeredDevices });
    isNewDevice = true;
  } else {
    registeredDevices = docSnap.data().devices || [];
    const existingDevice = registeredDevices.find(
      (d) => d.userAgent === deviceInfo.userAgent && d.platform === deviceInfo.platform
    );

    if (!existingDevice) {
      console.log('Dispositivo não registrado. Adicionando novo dispositivo.');
      registeredDevices.push({ ...deviceInfo, verified: false, emailSentAt: null });
      await updateDoc(docRef, { devices: registeredDevices });
      isNewDevice = true;
    }
  }

  console.log('Dispositivos registrados:', registeredDevices);
  console.log('Dispositivo atual:', deviceInfo);

  const currentDevice = registeredDevices.find(
    (d) => d.userAgent === deviceInfo.userAgent && d.platform === deviceInfo.platform
  );

  // Retorne false se o dispositivo for novo ou não estiver verificado
  if (isNewDevice || !currentDevice?.verified) {
    return { isTrustedDevice: false, emailSentAt: currentDevice?.emailSentAt || null };
  }

  return { isTrustedDevice: true };
}

async function verifyDevice(user) {
  await user.reload(); // Atualiza o status do usuário
  const deviceInfo = getDeviceInfo();
  const docRef = doc(firestore, 'users', user.uid, 'security', 'deviceInfo');
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    console.error('Nenhum dispositivo registrado encontrado.');
    return;
  }

  const registeredDevices = docSnap.data().devices || [];
  const currentDevice = registeredDevices.find(
    (d) => d.userAgent === deviceInfo.userAgent && d.platform === deviceInfo.platform
  );

  if (!currentDevice) {
    console.error('Dispositivo atual não encontrado na lista de dispositivos registrados.');
    return;
  }

  if (!currentDevice.verified) {
    if (user.emailVerified) {
      currentDevice.verified = true;
      await updateDoc(docRef, { devices: registeredDevices });
      console.log('Dispositivo verificado com sucesso:', currentDevice);
    } else {
      console.error('Email do usuário não está verificado. Dispositivo não será marcado como verificado.');
    }
  } else {
    console.log('Dispositivo já está verificado.');
  }
}

let lastVerificationEmailSentAt = localStorage.getItem('lastVerificationEmailSentAt')
  ? parseInt(localStorage.getItem('lastVerificationEmailSentAt'), 10)
  : null; // Recupera o timestamp do localStorage ou define como null

async function login() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('pass').value.trim();
  const loginMessage = document.getElementById('loginMessage');
  const loginButton = document.querySelector('#btnLogin');

  loginMessage.innerHTML = '';
  loginMessage.style.opacity = 0;
  loginMessage.style.display = 'none';

  if (email === '' || password === '') {
    showMessage(
      '<i class="bx bxs-error-circle"></i> Preencha todos os campos.',
      'error',
    );
    return;
  }

  loginButton.disabled = true;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await user.reload();

    const { isTrustedDevice, emailSentAt } = await saveDeviceInfo(user);

    if (!isTrustedDevice) {
      const now = Date.now();

      if (!emailSentAt || now - emailSentAt >= 10 * 60 * 1000) {
        console.log('Enviando email de verificação para o usuário...');
        await sendEmailVerification(user);

        // Atualize o timestamp de envio no Firestore
        const docRef = doc(firestore, 'users', user.uid, 'security', 'deviceInfo');
        const docSnap = await getDoc(docRef);
        const registeredDevices = docSnap.data().devices || [];
        const currentDevice = registeredDevices.find(
          (d) => d.userAgent === getDeviceInfo().userAgent && d.platform === getDeviceInfo().platform
        );

        if (currentDevice) {
          currentDevice.emailSentAt = now;
          await updateDoc(docRef, { devices: registeredDevices });
        }

        showMessage(
          '<i class="bx bxs-check-circle"></i> Email de verificação enviado. Verifique seu email para confirmar o dispositivo.',
          'success',
        );
      } else {
        showMessage(
          '<i class="bx bxs-error-circle"></i> Aguarde antes de solicitar outro email de verificação.',
          'error',
        );
      }
      loginButton.disabled = false;
      return;
    }

    if (!user.emailVerified) {
      showMessage(
        '<i class="bx bxs-error-circle"></i> Verifique seu email antes de continuar.',
        'error',
      );
      loginButton.disabled = false;
      return;
    }

    showMessage('<i class="bx bxs-check-circle"></i> Login bem-sucedido!', 'success');
    setTimeout(() => (window.location.href = 'menuPrincipal.html'), 2000);
  } catch (error) {
    showMessage(`<i class="bx bxs-error-circle"></i> Erro: ${error.message}`, 'error');
  } finally {
    loginButton.disabled = false;
  }
}

function showMessage(message, type) {
  const loginMessage = document.getElementById('loginMessage')
  loginMessage.innerHTML = message
  loginMessage.className = `login-message ${type}`
  loginMessage.style.display = 'block'
  setTimeout(() => (loginMessage.style.opacity = 1), 10)
}

document.querySelector('#btnLogin').addEventListener('click', login)

document.getElementById('logout').addEventListener('click', async () => {
  try {
    await signOut(authInstance)
    console.log('User signed out.')
    window.location.href = 'index.html'
  } catch (error) {
    console.error('Sign out error:', error)
  }
})
