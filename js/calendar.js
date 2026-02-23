import { db } from './firebase.js';
import { state } from './state.js';

import {
  collection,
  addDoc,
  getDocs,
  query,
  where
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

export async function renderCalendar(){

  if(!state.user) return "<div class='app-shell'><div class='card'>Niet ingelogd</div></div>";

  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();

  let daysInMonth = new Date(year, month+1, 0).getDate();

  let html = "<div class='app-shell'>";
  html += "<div class='card'><h2>Kalender</h2>";
  html += "<div class='calendar'>";

  for(let d=1; d<=daysInMonth; d++){
    html += `<div class='day' onclick="addEventPrompt(${d})">${d}</div>`;
  }

  html += "</div></div>";

  html += "<div class='card'><h3>Events deze maand</h3><div id='eventList'></div></div>";
  html += "</div>";

  loadEvents(month, year);

  return html;
}

async function loadEvents(month, year){

  const q = query(
    collection(db, "events"),
    where("uid", "==", state.user.uid),
    where("month", "==", month),
    where("year", "==", year)
  );

  const snap = await getDocs(q);

  const list = document.getElementById("eventList");
  if(!list) return;

  list.innerHTML = "";

  snap.forEach(doc=>{
    const e = doc.data();
    list.innerHTML += `<div class='card'>${e.day}: ${e.title}</div>`;
  });

}

window.addEventPrompt = async function(day){

  const title = prompt("Event titel?");
  if(!title) return;

  const now = new Date();

  await addDoc(collection(db, "events"), {
    uid: state.user.uid,
    day: day,
    month: now.getMonth(),
    year: now.getFullYear(),
    title: title,
    createdAt: new Date()
  });

  location.reload();
}
