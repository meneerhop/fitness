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

export function initAuth(){

  onAuthStateChanged(auth, async (user) => {

    if(user){

      const snap = await getDoc(doc(db, 'users', user.uid));
      const data = snap.exists() ? snap.data() : null;

      state.user = data;
      state.role = data?.role || 'user';

      navigate('dashboard');

    } else {

      state.user = null;
      state.role = null;

      navigate('auth');

    }

  });

}

export async function login(email, password){
  await signInWithEmailAndPassword(auth, email, password);
}

export async function register(name, email, password){

  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, 'users', cred.user.uid), {
    name: name,
    role: 'user',
    createdAt: new Date()
  });

}

export async function logout(){
  await signOut(auth);
}
