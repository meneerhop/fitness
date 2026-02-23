
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { spring } from "./modules/animations.js";

const appDiv = document.getElementById("app");

function renderHome(user){
  return `<div class="app-shell">
    <div class="card"><h2>Welkom ${user?.name || ''}</h2></div>
  </div>`;
}

function renderNav(){
  return `<div class="navbar">
    <button onclick="nav('home')">Home</button>
    <button onclick="nav('calendar')">Agenda</button>
    <button onclick="nav('progress')">Progress</button>
    <button onclick="nav('profile')">Profiel</button>
    <button onclick="logout()">Uit</button>
  </div>`;
}

window.nav = (route)=>{
  spring(document.body);
  appDiv.innerHTML = renderHome({name:"User"}) + renderNav();
};

window.logout = async ()=>{
  await auth.signOut();
};

onAuthStateChanged(auth, user=>{
  if(user){
    appDiv.innerHTML = renderHome({name:user.email}) + renderNav();
  } else {
    appDiv.innerHTML = `<div class="app-shell"><div class="card"><h2>Login vereist</h2></div></div>`;
  }
});
