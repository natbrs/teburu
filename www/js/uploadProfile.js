import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';
import { app } from './firebase.js';

const storage = getStorage(app);

let selectedFile = null;

function uploadAndPreviewImage(event) {
    selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = function() {
        const imgElement = document.getElementById('perfil');
        imgElement.src = reader.result;
    };
    reader.readAsDataURL(selectedFile);
}

async function uploadImage(file) {
    const storageRef = ref(storage, 'profile_pic/' + file.name);
    try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading file:', error);
        return null;
    }
}

window.uploadAndPreviewImage = uploadAndPreviewImage;
export { uploadAndPreviewImage, uploadImage, selectedFile };