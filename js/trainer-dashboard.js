
import { db } from './firebase.js';
import { state } from './state.js';

import {
  collection,
  getDocs,
  doc,
  setDoc,
  query,
  where
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

export async function renderTrainerDashboard(){

  if(!state.user) return "<div class='app-shell'><div class='card'>Niet ingelogd</div></div>";

  if(state.role !== "trainer" && state.role !== "admin"){
    return "<div class='app-shell'><div class='card'>Geen toegang</div></div>";
  }

  let html = "<div class='app-shell'>";
  html += "<div class='card'><h2>Trainer Dashboard</h2><div id='clientList'></div></div>";
  html += "<div class='card'><h3>Client koppelen</h3><input id='clientUidInput' placeholder='Client UID'><button onclick='linkClient()'>Koppelen</button></div>";
  html += "</div>";

  setTimeout(loadClients, 100);

  return html;
}

async function loadClients(){

  const q = query(collection(db, "clients"), where("trainerUid", "==", state.user.uid));
  const snap = await getDocs(q);

  const container = document.getElementById("clientList");
  if(!container) return;

  container.innerHTML = "";

  snap.forEach(docSnap=>{
    const data = docSnap.data();
    container.innerHTML += `
      <div class='card'>
        Client UID: ${data.clientUid}
      </div>
    `;
  });
}

window.linkClient = async function(){

  const clientUid = document.getElementById("clientUidInput").value;
  if(!clientUid) return;

  await setDoc(doc(db, "clients", state.user.uid + "_" + clientUid), {
    trainerUid: state.user.uid,
    clientUid: clientUid,
    createdAt: new Date()
  });

  alert("Client gekoppeld");
  location.reload();
};
