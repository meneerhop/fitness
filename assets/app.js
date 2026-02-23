
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, getDocs } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAa1DzEnexvARCeZixcN0JRTpheRY5WKZM",
  authDomain: "moffel-fit.firebaseapp.com",
  projectId: "moffel-fit",
  storageBucket: "moffel-fit.firebasestorage.app",
  messagingSenderId: "766711451730",
  appId: "1:766711451730:web:006be1b47507a9fc394f8b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const appDiv = document.getElementById("app");
let currentUserData = null;

function renderLogin(){
  appDiv.innerHTML = `
    <div class="container">
      <h1>Moffel.fit</h1>
      <input id="name" placeholder="Naam">
      <input id="email" placeholder="Email">
      <input id="password" type="password" placeholder="Wachtwoord">
      <button onclick="login()">Inloggen</button>
      <button onclick="register()">Registreren</button>
    </div>
  `;
}

function renderNav(){
  return `
  <div class="navbar">
    <button onclick="renderDashboard()">Dashboard</button>
    <button onclick="renderCalendar()">Agenda</button>
    <button onclick="renderProgress()">Progress</button>
    ${currentUserData.role === 'admin' ? '<button onclick="renderAdmin()">Admin</button>' : ''}
    <button onclick="logout()">Logout</button>
  </div>`;
}

function renderDashboard(){
  appDiv.innerHTML = `
    <div class="container">
      <h1>Welkom ${currentUserData.name}</h1>
      <div class="card">Rol: ${currentUserData.role}</div>
    </div>
    ${renderNav()}
  `;
}

async function renderCalendar(){
  const snap = await getDocs(collection(db,"users",auth.currentUser.uid,"agenda"));
  let items = "";
  snap.forEach(doc => { items += `<div class="card">${doc.data().text}</div>`; });
  appDiv.innerHTML = `
    <div class="container">
      <h1>Agenda</h1>
      <input id="newEvent" placeholder="Nieuwe afspraak">
      <button onclick="addEvent()">Toevoegen</button>
      ${items}
    </div>
    ${renderNav()}
  `;
}

window.addEvent = async function(){
  const text = document.getElementById("newEvent").value;
  await addDoc(collection(db,"users",auth.currentUser.uid,"agenda"),{text});
  renderCalendar();
}

async function renderProgress(){
  const snap = await getDocs(collection(db,"users",auth.currentUser.uid,"progress"));
  let items = "";
  snap.forEach(doc => { items += `<div class="card">${doc.data().value}</div>`; });
  appDiv.innerHTML = `
    <div class="container">
      <h1>Progress</h1>
      <input id="newProgress" placeholder="Nieuwe waarde">
      <button onclick="addProgress()">Toevoegen</button>
      ${items}
    </div>
    ${renderNav()}
  `;
}

window.addProgress = async function(){
  const value = document.getElementById("newProgress").value;
  await addDoc(collection(db,"users",auth.currentUser.uid,"progress"),{value});
  renderProgress();
}

async function renderAdmin(){
  const snap = await getDocs(collection(db,"users"));
  let users = "";
  snap.forEach(doc => {
    users += `<div class="card">${doc.data().name} (${doc.data().role})</div>`;
  });
  appDiv.innerHTML = `
    <div class="container">
      <h1>Admin Dashboard</h1>
      ${users}
    </div>
    ${renderNav()}
  `;
}

window.login = async function(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  await signInWithEmailAndPassword(auth, email, password);
}

window.register = async function(){
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db,"users",cred.user.uid),{name,role:"user"});
}

window.logout = async function(){
  await signOut(auth);
}

onAuthStateChanged(auth, async user => {
  if(user){
    const snap = await getDoc(doc(db,"users",user.uid));
    currentUserData = snap.data();
    renderDashboard();
  } else {
    renderLogin();
  }
});
