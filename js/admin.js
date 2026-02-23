import { db } from './firebase.js';
import { state } from './state.js';

import {
  collection,
  getDocs,
  doc,
  getDoc
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

export async function renderAdmin(){

  if(!state.user) return "<div class='app-shell'><div class='card'>Niet ingelogd</div></div>";

  if(state.role !== "admin"){
    return "<div class='app-shell'><div class='card'>Geen toegang</div></div>";
  }

  let html = "<div class='app-shell'>";
  html += "<div class='card'><h2>Admin Dashboard</h2><div id='userList'></div></div>";
  html += "</div>";

  setTimeout(loadUsers, 100);

  return html;
}

async function loadUsers(){

  const snap = await getDocs(collection(db, "users"));

  const container = document.getElementById("userList");
  if(!container) return;

  container.innerHTML = "";

  snap.forEach(docSnap=>{
    const data = docSnap.data();
    container.innerHTML += `
      <div class='card'>
        <strong>${data.name || "Geen naam"}</strong><br/>
        UID: ${docSnap.id}<br/>
        Rol: ${data.role || "user"}
      </div>
    `;
  });
}
