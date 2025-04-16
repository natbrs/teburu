import {
  getAuth,
  onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js'
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js'
import { auth } from './firebase.js'

const firestore = getFirestore()

export function getDeviceInfo() {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

function showSecurityMessage(message, isSuccess) {
  const securityMessage = document.getElementById('securityMessage')
  securityMessage.innerHTML = `<i class="bx bxs-${
    isSuccess ? 'check' : 'error'
  }-circle"></i> ${message}`
  securityMessage.className = `security-message ${
    isSuccess ? 'success' : 'error'
  }`

  securityMessage.style.display = 'block'
  setTimeout(() => {
    securityMessage.style.opacity = 1
  }, 10)

  setTimeout(() => {
    securityMessage.style.opacity = 0
    setTimeout(() => {
      securityMessage.style.display = 'none'
    }, 500)
  }, 3000)
}

async function saveSecuritySettings() {
  const emailConfirmationToggle = document.getElementById('email-confirmation')
  const isEnabled = emailConfirmationToggle.checked

  try {
    const user = auth.currentUser
    if (user) {
      const settingsRef = doc(
        firestore,
        'users',
        user.uid,
        'security',
        'settings',
      )
      const settingsSnap = await getDoc(settingsRef)

      if (settingsSnap.exists()) {
        const currentSetting = settingsSnap.data().emailConfirmationEnabled

        if (currentSetting === isEnabled) {
          showSecurityMessage('Nenhuma alteração foi feita.', false)
          return
        }
      }

      console.log('Salvando configurações no Firestore:', {
        emailConfirmationEnabled: isEnabled,
      })
      await setDoc(settingsRef, {
        emailConfirmationEnabled: isEnabled,
      })

      showSecurityMessage('Configurações salvas com sucesso!', true)

      // Enviar email de verificação apenas se a opção estiver habilitada
      if (isEnabled && !user.emailVerified) {
        const deviceInfo = getDeviceInfo()
        const docRef = doc(
          firestore,
          'users',
          user.uid,
          'security',
          'deviceInfo',
        )
        const docSnap = await getDoc(docRef)

        if (
          !docSnap.exists() ||
          JSON.stringify(docSnap.data()) !== JSON.stringify(deviceInfo)
        ) {
          await user.sendEmailVerification()
          console.log('Email de confirmação enviado.')
        }
      }
    }
  } catch (error) {
    console.error('Erro ao salvar configurações:', error)
    showSecurityMessage('Erro ao salvar configurações', false)
  }
}

window.saveSecuritySettings = saveSecuritySettings

document.addEventListener('DOMContentLoaded', () => {
  const emailConfirmationToggle = document.getElementById('email-confirmation')

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const settingsRef = doc(
          firestore,
          'users',
          user.uid,
          'security',
          'settings',
        )
        const settingsSnap = await getDoc(settingsRef)

        if (settingsSnap.exists()) {
          const emailConfirmationEnabled =
            settingsSnap.data().emailConfirmationEnabled

          console.log(
            'Valor recuperado do Firestore:',
            emailConfirmationEnabled,
          )

          emailConfirmationToggle.checked = Boolean(emailConfirmationEnabled)
        } else {
          console.log(
            'Nenhum dado encontrado no Firestore. Definindo como false.',
          )
          emailConfirmationToggle.checked = false
        }
      } catch (error) {
        console.error('Erro ao recuperar configurações:', error)
        emailConfirmationToggle.checked = false
        showSecurityMessage('Erro ao carregar configurações', false)
      }
    } else {
      console.log('Usuário não autenticado. Definindo como false.')
      emailConfirmationToggle.checked = false
    }
  })

  emailConfirmationToggle.addEventListener('change', saveSecuritySettings)
})
