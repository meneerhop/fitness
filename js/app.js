import { initAuth } from './auth.js';
import { state } from './state.js';
import { navigate } from './router.js';

import {
  dashboardView,
  authView,
  settingsView
} from './views.js';

import { calendarView } from './calendar.js';
import { progressView } from './progress.js';
import { adminView } from './admin.js';
import { adminRoleView } from './admin-role-manager.js';
import { trainerView } from './trainer-dashboard.js';
import { profileView } from './profile.js';

const app = document.getElementById('app');

window.renderApp = async function(){

  // 🔒 Wacht tot auth klaar is
  if(!state.initialized){
    app.innerHTML = "";
    return;
  }

  let content = "";

  switch(state.route){

    case "auth":
      content = authView();
      break;

    case "dashboard":
      content = dashboardView();
      break;

    case "settings":
      content = settingsView();
      break;

    case "calendar":
      content = await calendarView();
      break;

    case "progress":
      content = await progressView();
      break;

    case "admin":
      content = await adminView();
      break;

    case "adminRoles":
      content = await adminRoleView();
      break;

    case "trainer":
      content = await trainerView();
      break;

    case "profile":
      content = await profileView();
      break;

    default:
      content = authView();
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
      <button onclick="nav('profile')">Profiel</button>
      ${state.role === "admin" ? `<button onclick="nav('admin')">Admin</button>` : ""}
      <button onclick="nav('settings')">Settings</button>
    </div>
  `;
}

window.nav = (r)=>navigate(r);

initAuth();