import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { state } from "./state.js";

export function initAuth(){

  onAuthStateChanged(auth, async (user) => {

    if(user){
      state.user = user;

      const snap = await getDoc(doc(db, "users", user.uid));

      if(snap.exists()){
        state.userData = snap.data();
        state.role = snap.data().role || "user";
      }

      state.route = "dashboard";
    } 
    else {
      state.user = null;
      state.userData = null;
      state.role = null;
      state.route = "auth";
    }

    state.initialized = true;
    window.renderApp();
  });
}

export async function login(email, password){
  await signInWithEmailAndPassword(auth, email, password);
}

export async function register(name, email, password){
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", cred.user.uid), {
    name,
    role: "user",
    createdAt: new Date()
  });
}

export async function logout(){
  await signOut(auth);
}