
import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut }
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc, collection, getDocs }
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const appDiv = document.getElementById("app");
let currentUserData=null;

function renderNav(active){
  return `<div class="navbar">
    <button class="${active==='dashboard'?'active':''}" onclick="nav('dashboard')">Home</button>
    <button class="${active==='calendar'?'active':''}" onclick="nav('calendar')">Agenda</button>
    <button class="${active==='admin'?'active':''}" onclick="nav('admin')">Admin</button>
    <button onclick="logout()">Uit</button>
  </div>`;
}

window.logout = async ()=>{ await signOut(auth); }

window.nav = async (page)=>{
  if(page==='dashboard'){
    appDiv.innerHTML = `<div class="app-shell">
      <div class="card"><h2>Welkom ${currentUserData.name}</h2></div>
    </div>` + renderNav('dashboard');
  }

  if(page==='calendar'){
    let grid="";
    for(let i=1;i<=30;i++){
      grid+=`<div class="calendar-day">${i}</div>`;
    }
    appDiv.innerHTML = `<div class="app-shell">
      <h2>Maand Kalender</h2>
      <div class="calendar-grid">${grid}</div>
    </div>` + renderNav('calendar');
  }

  if(page==='admin' && currentUserData.role==='admin'){
    const snap = await getDocs(collection(db,"users"));
    let users="";
    snap.forEach(d=> users+=`<div class="card">${d.data().name} (${d.data().role})</div>`);
    appDiv.innerHTML = `<div class="app-shell">
      <h2>Admin Dashboard</h2>${users}
    </div>` + renderNav('admin');
  }
}

function renderAuthChoice(){
  appDiv.innerHTML=`
  <div class="app-shell">
    <div class="card">
      <h2>Moffel.fit</h2>
      <button class="primary" onclick="showLogin()">Inloggen</button>
      <button onclick="showRegister()">Registreren</button>
    </div>
  </div>`;
}

window.showLogin=()=>{
  appDiv.innerHTML=`
  <div class="app-shell">
    <div class="card">
      <h2>Inloggen</h2>
      <input id="email" placeholder="Email">
      <input id="password" type="password" placeholder="Wachtwoord">
      <button class="primary" onclick="login()">Inloggen</button>
    </div>
  </div>`;
}

window.showRegister=()=>{
  appDiv.innerHTML=`
  <div class="app-shell">
    <div class="card">
      <h2>Registreren</h2>
      <input id="name" placeholder="Naam">
      <input id="email" placeholder="Email">
      <input id="password" type="password" placeholder="Wachtwoord">
      <button class="primary" onclick="register()">Registreren</button>
    </div>
  </div>`;
}

window.login = async ()=>{
  await signInWithEmailAndPassword(auth,
    document.getElementById("email").value,
    document.getElementById("password").value);
};

window.register = async ()=>{
  const cred = await createUserWithEmailAndPassword(auth,
    document.getElementById("email").value,
    document.getElementById("password").value);
  await setDoc(doc(db,"users",cred.user.uid),{
    name:document.getElementById("name").value,
    role:"user"
  });
};

onAuthStateChanged(auth, async user=>{
  if(user){
    const snap = await getDoc(doc(db,"users",user.uid));
    currentUserData = snap.data();
    nav('dashboard');
  } else {
    renderAuthChoice();
  }
});
