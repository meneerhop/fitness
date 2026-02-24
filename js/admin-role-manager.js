import { db } from './firebase.js';
import { collection, getDocs, doc, updateDoc }
from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

export async function renderAdminRole(){

  const snap = await getDocs(collection(db, "users"));

  let html = `<div class="app-shell"><div class="card"><h2>Role Manager</h2>`;

  snap.forEach(userDoc=>{
    const data = userDoc.data();
    const role = data.role || "user";

    html += `
      <div>
        ${data.name || "No name"}
        <select onchange="changeRole('${userDoc.id}', this.value)">
          <option value="user" ${role==="user"?"selected":""}>User</option>
          <option value="admin" ${role==="admin"?"selected":""}>Admin</option>
        </select>
      </div>
    `;
  });

  html += `</div></div>`;
  return html;
}

window.changeRole = async function(uid, role){
  await updateDoc(doc(db,"users",uid),{ role });
  alert("Role updated");
};
