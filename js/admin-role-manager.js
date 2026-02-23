
import { db } from './firebase.js';
import { state } from './state.js';

import {
  collection,
  getDocs,
  doc,
  updateDoc
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

export async function renderAdminRoleManager(){

  if(!state.user) return "<div class='app-shell'><div class='card'>Niet ingelogd</div></div>";

  if(state.role !== "admin"){
    return "<div class='app-shell'><div class='card'>Geen toegang</div></div>";
  }

  let html = "<div class='app-shell'>";
  html += "<div class='card'><h2>Admin – Rollen Beheer</h2><div id='roleUserList'></div></div>";
  html += "</div>";

  setTimeout(loadUsers, 100);

  return html;
}

async function loadUsers(){

  const snap = await getDocs(collection(db, "users"));
  const container = document.getElementById("roleUserList");
  if(!container) return;

  container.innerHTML = "";

  snap.forEach(docSnap=>{
    const data = docSnap.data();
    container.innerHTML += `
      <div class='card'>
        <strong>${data.name || "Geen naam"}</strong><br/>
        UID: ${docSnap.id}<br/>
        Huidige rol: ${data.role || "user"}<br/>
        <select onchange="changeRole('${docSnap.id}', this.value)">
          <option value="user" ${data.role==="user"?"selected":""}>User</option>
          <option value="trainer" ${data.role==="trainer"?"selected":""}>Trainer</option>
          <option value="admin" ${data.role==="admin"?"selected":""}>Admin</option>
        </select>
      </div>
    `;
  });
}

window.changeRole = async function(uid, newRole){

  if(!confirm("Weet je zeker dat je de rol wilt wijzigen?")) return;

  await updateDoc(doc(db, "users", uid), {
    role: newRole
  });

  alert("Rol bijgewerkt");
};
