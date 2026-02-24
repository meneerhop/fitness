import { db } from './firebase.js';
import { state } from './state.js';

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

export async function renderProgress(){

  if(!state.user) return "<div class='app-shell'><div class='card'>Niet ingelogd</div></div>";

  let html = `
    <div class='app-shell'>
      <div class='card'>
        <h2>Progress Tracking</h2>
        <input id="weightInput" type="number" placeholder="Gewicht (kg)" />
        <button onclick="addProgress()">Toevoegen</button>
      </div>
      <div class='card'>
        <canvas id="progressChart"></canvas>
      </div>
    </div>
  `;

  setTimeout(loadProgress, 100);

  return html;
}

window.addProgress = async function(){

  const weight = document.getElementById("weightInput").value;
  if(!weight) return;

  await addDoc(collection(db, "progress"), {
    uid: state.user.uid,
    weight: Number(weight),
    createdAt: new Date()
  });

  location.reload();
}

async function loadProgress(){

  const q = query(
    collection(db, "progress"),
    where("uid", "==", state.user.uid),
    orderBy("createdAt")
  );

  const snap = await getDocs(q);

  const labels = [];
  const data = [];

  snap.forEach(doc=>{
    const d = doc.data();
    const date = d.createdAt?.toDate ? d.createdAt.toDate() : new Date(d.createdAt);
    labels.push(date.toLocaleDateString());
    data.push(d.weight);
  });

  if(!window.Chart){
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    script.onload = () => drawChart(labels, data);
    document.body.appendChild(script);
  } else {
    drawChart(labels, data);
  }
}

function drawChart(labels, data){

  const ctx = document.getElementById('progressChart');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Gewicht',
        data: data,
        tension: 0.4
      }]
    }
  });
}
