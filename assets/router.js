
let currentPage = "dashboard";

export function navigate(page){
  currentPage = page;
  render();
}

export function initRouter(renderFn){
  window.render = renderFn;
}
