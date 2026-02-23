
export function renderAdminPanel(users){
  return users.map(u=>`<div class="card">${u.name} (${u.role})</div>`).join("");
}
