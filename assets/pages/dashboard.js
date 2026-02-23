
export function dashboard(user){
  return `<div class="container">
    <h1>Welkom ${user.name}</h1>
    <div class="card">Rol: ${user.role}</div>
  </div>`;
}
