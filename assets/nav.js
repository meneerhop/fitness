
function toggleProfile(){
  const menu = document.getElementById("profileMenu");
  menu.classList.toggle("show");
}

function toggleNav(){
  document.getElementById("drawer").classList.toggle("show");
  document.getElementById("overlay").classList.toggle("show");
}

function closeNav(){
  document.getElementById("drawer").classList.remove("show");
  document.getElementById("overlay").classList.remove("show");
}
