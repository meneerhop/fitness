
import { initAuth } from './auth.js';
import { state } from './state.js';
import { navigate } from './router.js';
import { dashboardView, settingsView } from './views.js';
import { calendarView } from './views.js';
import { progressView } from './views.js';
import { adminView } from './views.js';
import { adminRoleView } from './views.js';

const app = document.getElementById('app');

window.renderApp = function(){
let content = "";

if(state.route === "dashboard") content = dashboardView();
if(state.route === "settings") content = settingsView();
if(state.route === "calendar") content = await calendarView();
if(state.route === "progress") content = await progressView();
if(state.route === "admin") content = await adminView();
if(state.route === "adminRoles") content = await adminRoleView();
if(state.route === "trainer") content = await trainerView();
if(state.route === "profile") content = await profileView();

app.innerHTML = content + renderNav();
};

function renderNav(){
return `<div class="navbar">
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
