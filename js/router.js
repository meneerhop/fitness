import { state } from './state.js';

export function navigate(route){
  state.route = route;
  window.renderApp();
}
