
function toggleProfile(){
  const menu = document.getElementById("profileMenu");

  if(menu.classList.contains("show")){
    menu.classList.remove("show");
  } else {
    menu.style.display = "flex";
    requestAnimationFrame(() => {
      menu.classList.add("show");
    });
  }
}

function toggleNav(){
  document.getElementById("drawer").classList.toggle("show");
  document.getElementById("overlay").classList.toggle("show");
}

function closeNav(){
  document.getElementById("drawer").classList.remove("show");
  document.getElementById("overlay").classList.remove("show");
}
