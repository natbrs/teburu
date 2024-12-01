import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const firebaseConfig={
  apiKey: "AIzaSyCy-2HMoESAn7pxAb5WuOKF7ocjB0uo42k",
  authDomain: "appteburu-87775.firebaseapp.com",
  databaseURL: "https://appteburu-87775-default-rtdb.firebaseio.com",
  projectId: "appteburu-87775",
  storageBucket: "appteburu-87775.appspot.com",
  messagingSenderId: "393098834565",
  appId: "1:393098834565:web:61cb771a9d4f7741d56fec",
  measurementId: "G-ZQSLHW5T74"
};
const app=initializeApp(firebaseConfig);
const auth=getAuth(app);
export { auth };