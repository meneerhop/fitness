import { initAuth } from './auth.js';
import { state } from './state.js';
import { navigate } from './router.js';

import { renderAdmin } from './admin.js';
import { renderAdminRole } from './admin-role-manager.js';

const app = document.getElementById('app');

window.renderApp = async function(){

  if(!state.initialized){
    app.innerHTML = "";
    return;
  }

  let content = "";

  switch(state.route){

    case "auth":
      content = `<div class="app-shell">
                   <div class="card">
                     <h2>Login</h2>
                     <p>Gebruik je login gegevens</p>
                   </div>
                 </div>`;
      break;

    case "dashboard":
      content = `<div class="app-shell">
                   <div class="card">
                     <h2>Dashboard</h2>
                   </div>
                 </div>`;
      break;

    case "admin":
      content = await renderAdmin();
      break;

    case "adminRoles":
      content = await renderAdminRole();
      break;

    default:
      content = `<div class="app-shell"><div class="card">404</div></div>`;
  }

  app.innerHTML = content + renderNav();
};

function renderNav(){

  if(!state.user) return "";

  return `
    <div class="navbar">
      <button onclick="nav('dashboard')">Home</button>
      <button onclick="nav('admin')">Admin</button>
      <button onclick="nav('adminRoles')">Roles</button>
    </div>
  `;
}

window.nav = (r)=>navigate(r);

initAuth();
