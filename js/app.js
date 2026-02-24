import { initAuth, login, register, logout } from './auth.js';
import { state } from './state.js';
import { navigate } from './router.js';
import { renderAdmin } from './admin.js';
import { renderAdminRole } from './admin-role-manager.js';

const app = document.getElementById("app");

window.renderApp = async function(){

  if(!state.initialized){
    app.innerHTML = "";
    return;
  }

  let content = "";

  switch(state.route){

    case "auth":
      content = renderAuth();
      break;

    case "dashboard":
      content = `
        <div class="app-shell">
          <div class="card">
            <h2>Dashboard</h2>
            <p>Welkom ${state.userData?.name || ""}</p>
            <button onclick="logoutUser()">Uitloggen</button>
          </div>
        </div>
      `;
      break;

    case "admin":
      content = await renderAdmin();
      break;

    case "adminRoles":
      content = await renderAdminRole();
      break;

    default:
      content = renderAuth();
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
      <button onclick="logoutUser()">Uit</button>
    </div>
  `;
}

function renderAuth(){
  return `
    <div class="app-shell">
      <div class="auth-card">
        <div class="auth-title">Welkom bij Moffel.fit</div>

        <div class="segmented">
          <button id="loginTab" class="active" onclick="switchAuth('login')">Inloggen</button>
          <button id="registerTab" onclick="switchAuth('register')">Registreren</button>
        </div>

        <div id="authForm"></div>
      </div>
    </div>
  `;
}

window.switchAuth = function(type){

  document.getElementById("loginTab").classList.remove("active");
  document.getElementById("registerTab").classList.remove("active");

  if(type === "login"){
    document.getElementById("loginTab").classList.add("active");

    document.getElementById("authForm").innerHTML = `
      <input class="auth-input" id="loginEmail" placeholder="Email">
      <input class="auth-input" id="loginPass" type="password" placeholder="Wachtwoord">
      <button class="auth-button" onclick="doLogin()">Inloggen</button>
    `;
  } else {

    document.getElementById("registerTab").classList.add("active");

    document.getElementById("authForm").innerHTML = `
      <input class="auth-input" id="regName" placeholder="Naam">
      <input class="auth-input" id="regEmail" placeholder="Email">
      <input class="auth-input" id="regPass" type="password" placeholder="Wachtwoord">
      <button class="auth-button" onclick="doRegister()">Registreren</button>
    `;
  }
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

window.logoutUser = async function(){
  await logout();
};

window.nav = (r)=>navigate(r);

initAuth();