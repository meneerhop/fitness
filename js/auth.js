import { auth, db } from './firebase.js';
import { state } from './state.js';
import { navigate } from './router.js';

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

import {
  doc,
  getDoc,
  setDoc
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';



/* ===========================
   INIT AUTH LISTENER
=========================== */

export function initAuth(){

  onAuthStateChanged(auth, async (user) => {

    try {

      if(user){

        // 🔹 Haal Firestore profiel op
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);

        let userData = null;

        if(snap.exists()){
          userData = snap.data();
        } else {
          // 🔥 Als user document ontbreekt → automatisch aanmaken
          userData = {
            name: user.email || "Gebruiker",
            role: "user",
            createdAt: new Date()
          };

          await setDoc(userRef, userData);
        }

        // 🔹 State correct zetten
        state.user = user;
        state.userData = userData;
        state.role = userData.role || "user";

        // 🔹 Alleen navigeren als nog niet op route
        if(!state.route || state.route === "auth"){
          navigate("dashboard");
        }

      } else {

        state.user = null;
        state.userData = null;
        state.role = null;

        navigate("auth");
      }

    } catch(error){

      console.error("Auth init error:", error);

      state.user = null;
      state.role = null;
      navigate("auth");
    }

  });

}



/* ===========================
   LOGIN
=========================== */

export async function login(email, password){

  try{
    await signInWithEmailAndPassword(auth, email, password);
  } catch(error){
    console.error("Login error:", error);
    alert("Login mislukt: " + error.message);
  }

}



/* ===========================
   REGISTER
=========================== */

export async function register(name, email, password){

  try{

    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, 'users', cred.user.uid), {
      name: name,
      role: "user",
      createdAt: new Date()
    });

  } catch(error){

    console.error("Register error:", error);
    alert("Registratie mislukt: " + error.message);
  }

}



/* ===========================
   LOGOUT
=========================== */

export async function logout(){

  try{
    await signOut(auth);
  } catch(error){
    console.error("Logout error:", error);
  }

}