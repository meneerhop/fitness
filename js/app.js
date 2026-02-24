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
  content = `
    <div class="app-shell">
      <div class="card">
        <h2>Welkom bij Moffel.fit</h2>

        <div id="authButtons">
          <button onclick="showLogin()">Inloggen</button>
          <button onclick="showRegister()">Registreren</button>
        </div>

        <div id="authForm"></div>

      </div>
    </div>
  `;
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

import { login, register } from './auth.js';

window.showLogin = function(){
  document.getElementById("authForm").innerHTML = `
    <input id="loginEmail" placeholder="Email" />
    <input id="loginPass" type="password" placeholder="Wachtwoord" />
    <button onclick="doLogin()">Inloggen</button>
  `;
};

window.showRegister = function(){
  document.getElementById("authForm").innerHTML = `
    <input id="regName" placeholder="Naam" />
    <input id="regEmail" placeholder="Email" />
    <input id="regPass" type="password" placeholder="Wachtwoord" />
    <button onclick="doRegister()">Registreren</button>
  `;
};

window.doLogin = async function(){
  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPass").value;
  await login(email, pass);
};

window.doRegister = async function(){
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const pass = document.getElementById("regPass").value;
  await register(name, email, pass);
};