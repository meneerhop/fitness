import { db } from './firebase.js';
import { collection, getDocs } 
from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

export async function renderAdmin(){

  const snap = await getDocs(collection(db, "users"));

  let html = `<div class="app-shell"><div class="card"><h2>Admin Dashboard</h2>`;

  snap.forEach(doc=>{
    const d = doc.data();
    html += `<p>${d.name || "Geen naam"} - ${d.role || "user"}</p>`;
  });

  html += `</div></div>`;
  return html;
}
