
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAa1DzEnexvARCeZixcN0JRTpheRY5WKZM",
  authDomain: "moffel-fit.firebaseapp.com",
  projectId: "moffel-fit",
  storageBucket: "moffel-fit.firebasestorage.app",
  messagingSenderId: "766711451730",
  appId: "1:766711451730:web:006be1b47507a9fc394f8b"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
