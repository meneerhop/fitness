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

window.renderApp = async function () {

  try {

    let content = "";

    if (!state.route) state.route = "dashboard";

    switch (state.route) {

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
              <p>Je bent niet ingelogd.</p>
            </div>
          </div>
        `;
        break;

      default:
        content = `
          <div class="app-shell">
            <div class="card">
              <h2>Pagina niet gevonden</h2>
            </div>
          </div>
        `;
    }

    app.innerHTML = content + renderNav();

  } catch (error) {

    console.error("Render error:", error);

    app.innerHTML = `
      <div class="app-shell">
        <div class="card">
          <h2>Er ging iets mis</h2>
          <p>Bekijk de console voor details.</p>
        </div>
      </div>
    `;
  }
};

function renderNav() {

  if (!state.user) return "";

  return `
    <div class="navbar">
      <button class="${state.route === 'dashboard' ? 'active' : ''}" onclick="nav('dashboard')">Home</button>
      <button class="${state.route === 'calendar' ? 'active' : ''}" onclick="nav('calendar')">Kalender</button>
      <button class="${state.route === 'progress' ? 'active' : ''}" onclick="nav('progress')">Progress</button>

      ${state.role === "admin" ? `
        <button class="${state.route === 'admin' ? 'active' : ''}" onclick="nav('admin')">Admin</button>
        <button class="${state.route === 'adminRoles' ? 'active' : ''}" onclick="nav('adminRoles')">Rollen</button>
      ` : ""}

      ${(state.role === "trainer" || state.role === "admin") ? `
        <button class="${state.route === 'trainer' ? 'active' : ''}" onclick="nav('trainer')">Trainer</button>
      ` : ""}

      <button class="${state.route === 'profile' ? 'active' : ''}" onclick="nav('profile')">Profiel</button>
    </div>
  `;
}

window.nav = (route) => {
  navigate(route);
};

initAuth();