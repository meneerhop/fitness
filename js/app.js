import { initAuth } from './auth.js';
import { state } from './state.js';
import { navigate } from './router.js';

import { dashboardView, settingsView } from './views.js';
import { calendarView } from './calendar.js';
import { progressView } from './progress.js';
import { adminView } from './admin.js';
import { adminRoleView } from './admin-role-manager.js';
import { renderTrainerDashboard } from './trainer-dashboard.js';
import { renderProfile } from './profile.js';

const app = document.getElementById('app');

window.renderApp = async function(){

  let content = "";

  // Fallback route
  if(!state.route) state.route = "dashboard";

  if(state.route === "dashboard") content = dashboardView();
  if(state.route === "settings") content = settingsView();
  if(state.route === "calendar") content = await calendarView();
  if(state.route === "progress") content = await progressView();
  if(state.route === "admin") content = await adminView();
  if(state.route === "adminRoles") content = await adminRoleView();
  if(state.route === "trainer") content = await renderTrainerDashboard();
  if(state.route === "profile") content = await renderProfile();

  // Safety fallback
  if(!content){
    content = `<div class="app-shell">
                 <div class="card">Pagina niet gevonden</div>
               </div>`;
  }

  app.innerHTML = content + renderNav();
};

function renderNav(){
  return `
  <div class="navbar">
    <button class="${state.route==='dashboard'?'active':''}" onclick="nav('dashboard')">Home</button>
    <button class="${state.route==='settings'?'active':''}" onclick="nav('settings')">Settings</button>
    <button onclick="nav('calendar')">Kalender</button>
    <button onclick="nav('progress')">Progress</button>
    <button onclick="nav('admin')">Admin</button>
    <button onclick="nav('adminRoles')">Rollen</button>
    <button onclick="nav('trainer')">Trainer</button>
    <button onclick="nav('profile')">Profiel</button>
  </div>`;
}

window.nav = (r)=>navigate(r);

initAuth();