
import { db } from './firebase.js';
import { state } from './state.js';

import {
  doc,
  updateDoc,
  getDoc
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js';

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';

export async function renderProfile(){

  if(!state.user) return "<div class='app-shell'><div class='card'>Niet ingelogd</div></div>";

  const html = `
    <div class='app-shell'>
      <div class='card'>
        <h2>Profiel</h2>
        <img id="profileImage" src="${state.user.photoURL || ''}" 
             style="width:120px;height:120px;border-radius:50%;object-fit:cover;background:#222;margin-bottom:15px;" />
        <input id="nameInput" value="${state.user.name || ''}" placeholder="Naam" />
        <input type="file" id="photoInput" />
        <button onclick="saveProfile()">Opslaan</button>
      </div>
    </div>
  `;

  return html;
}

window.saveProfile = async function(){

  const newName = document.getElementById("nameInput").value;
  const fileInput = document.getElementById("photoInput");
  const file = fileInput.files[0];

  let photoURL = state.user.photoURL || null;

  if(file){
    const app = getApp();
    const storage = getStorage(app);
    const storageRef = ref(storage, "profileImages/" + state.user.uid + ".jpg");
    await uploadBytes(storageRef, file);
    photoURL = await getDownloadURL(storageRef);
  }

  await updateDoc(doc(db, "users", state.user.uid), {
    name: newName,
    photoURL: photoURL
  });

  alert("Profiel bijgewerkt");
  location.reload();
};
