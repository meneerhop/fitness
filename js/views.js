import { adminRoleView } from "./admin-role-manager.js";

export function authView(){
  return `
    <div class="card">
      <h2>Inloggen of Registreren</h2>
      <button onclick="nav('login')">Inloggen</button>
      <button onclick="nav('register')">Registreren</button>
    </div>
  `;
}

export async function renderRoute(route){

  switch(route){

    case "adminRoles":
      return await adminRoleView();

    default:
      return authView();
  }
}
