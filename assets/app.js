
import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut }
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc }
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { dashboard } from "./pages/dashboard.js";
import { schema } from "./pages/schema.js";
import { agenda } from "./pages/agenda.js";
import { progress } from "./pages/progress.js";
import { admin } from "./pages/admin.js";

let currentUser = null;
const appDiv = document.getElementById("app");

function renderNav(user){
  return `<div class="navbar">
    <button onclick="go('dashboard')">Dashboard</button>
    <button onclick="go('schema')">Schema</button>
    <button onclick="go('agenda')">Agenda</button>
    <button onclick="go('progress')">Progress</button>
    ${user.role==="admin" ? '<button onclick="go(\'admin\')">Admin</button>' : ''}
    <button onclick="logout()">Logout</button>
  </div>`;
}

window.go = function(page){
  renderPage(page);
}

async function renderPage(page){
  let content = "";
  if(page==="dashboard") content = dashboard(currentUser);
  if(page==="schema") content = schema();
  if(page==="agenda") content = agenda();
  if(page==="progress") content = progress();
  if(page==="admin" && currentUser.role==="admin") content = admin();

  appDiv.innerHTML = content + renderNav(currentUser);
}

function renderAuthChoice(){
  appDiv.innerHTML = `<div class="container">
    <h1>Moffel.fit</h1>
    <button onclick="showLogin()">Inloggen</button>
    <button onclick="showRegister()">Registreren</button>
  </div>`;
}

window.showLogin = function(){
  appDiv.innerHTML = `<div class="container">
    <h1>Inloggen</h1>
    <input id="email" placeholder="Email">
    <input id="password" type="password" placeholder="Wachtwoord">
    <button onclick="login()">Inloggen</button>
    <button onclick="renderAuthChoice()">Terug</button>
  </div>`;
}

window.showRegister = function(){
  appDiv.innerHTML = `<div class="container">
    <h1>Registreren</h1>
    <input id="name" placeholder="Naam">
    <input id="email" placeholder="Email">
    <input id="password" type="password" placeholder="Wachtwoord">
    <button onclick="register()">Account aanmaken</button>
    <button onclick="renderAuthChoice()">Terug</button>
  </div>`;
}

window.login = async function(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  await signInWithEmailAndPassword(auth,email,password);
}

window.register = async function(){
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const cred = await createUserWithEmailAndPassword(auth,email,password);
  await setDoc(doc(db,"users",cred.user.uid),{name,role:"user"});
}

window.logout = async function(){
  await signOut(auth);
}

onAuthStateChanged(auth, async user=>{
  if(user){
    const snap = await getDoc(doc(db,"users",user.uid));
    currentUser = snap.data();
    renderPage("dashboard");
  }else{
    renderAuthChoice();
  }
});
