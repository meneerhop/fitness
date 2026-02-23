
import { auth } from './firebase.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

window.login = async function(email, password){
    await signInWithEmailAndPassword(auth, email, password);
    alert("Ingelogd!");
}

window.register = async function(email, password){
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Account aangemaakt!");
}
