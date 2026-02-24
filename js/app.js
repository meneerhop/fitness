import { initAuth } from './auth.js';
import { state } from './state.js';
import { navigate } from './router.js';

import { dashboardView, settingsView } from './views.js';
import { renderCalendar } from './calendar.js';
import { renderProgress } from './progress.js';
import { renderAdmin } from './admin.js';
import { renderAdminRoleManager } from './admin-role-manager.js';
import { renderTrainerDashboard } from './trainer-dashboard.js';
import { renderProfile } from './profile.js';

const app = document.getElementById('app');

window.renderApp = async function(){

  let content = "";

  if(!state.route) state.route = "dashboard";

  switch(state.route){

    case "dashboard":
      content = dashboardView();
      break;

    case "settings":
      content = settingsView();
      break;

    case "calendar":
      content = await renderCalendar();
      break;

    case "progress":
      content = await renderProgress();
      break;

    case "admin":
      content = await renderAdmin();
      break;

    case "adminRoles":
      content = await renderAdminRoleManager();
      break;

    case "trainer":
      content = await renderTrainerDashboard();
      break;

    case "profile":
      content = await renderProfile();
      break;

    case "auth":
      content = `
        <div class="app-shell">
          <div class="card">
            <h2>Login vereist</h2>
            <button onclick="location.reload()">Terug</button>
          </div>
        </div>
      `;
      break;

    default:
      content = `
        <div class="app-shell">
          <div class="card">Pagina niet gevonden</div>
        </div>
      `;
  }

  app.innerHTML = content + renderNav();
};

function renderNav(){
  if(!state.user) return "";

  return `
  <div class="navbar">
    <button onclick="nav('dashboard')">Home</button>
    <button onclick="nav('calendar')">Kalender</button>
    <button onclick="nav('progress')">Progress</button>
    ${state.role === "admin" ? `<button onclick="nav('admin')">Admin</button>` : ""}
    ${state.role === "admin" ? `<button onclick="nav('adminRoles')">Rollen</button>` : ""}
    ${state.role === "trainer" || state.role === "admin" ? `<button onclick="nav('trainer')">Trainer</button>` : ""}
    <button onclick="nav('profile')">Profiel</button>
  </div>`;
}

window.nav = (r)=>navigate(r);

initAuth();