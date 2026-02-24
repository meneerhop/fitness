import { state } from './state.js';

const publicRoutes = ["auth"];

const protectedRoutes = [
  "dashboard",
  "calendar",
  "progress",
  "profile",
  "settings",
  "trainer"
];

const adminRoutes = [
  "admin",
  "adminRoles"
];

export function navigate(route){

  // 🚫 Niet ingelogd
  if(!state.user && !publicRoutes.includes(route)){
      state.route = "auth";
      window.renderApp();
      return;
  }

  // 🔒 Admin beveiliging
  if(adminRoutes.includes(route) && state.role !== "admin"){
      state.route = "dashboard";
      window.renderApp();
      return;
  }

  state.route = route;
  window.renderApp();
}