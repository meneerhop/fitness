
import { renderAdmin } from './admin.js';
import { renderProgress } from './progress.js';
import { renderCalendar } from './calendar.js';
import { renderAdminRoleManager } from './admin-role-manager.js';
import { renderTrainerDashboard } from './trainer-dashboard.js';
import { renderProfile } from './profile.js';

export function dashboardView(){
return `<div class="app-shell">
<div class="card"><h2>Dashboard</h2><p>Core SPA actief.</p></div>
</div>`;
}

export function settingsView(){
return `<div class="app-shell">
<div class="card"><h2>Instellingen</h2><p>Settings view placeholder.</p></div>
</div>`;
}

export function calendarView(){
  return renderCalendar();
}

export function progressView(){
  return renderProgress();
}


export function adminView(){
  return renderAdmin();
}

export function adminRoleView(){
  return renderAdminRoleManager();
}

export function trainerView(){
  return renderTrainerDashboard();
}

export function profileView(){
  return renderProfile();
}