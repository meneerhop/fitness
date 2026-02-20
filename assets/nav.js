function toggleMenu(){
  const menu = document.getElementById("dropdownMenu");
  menu.classList.toggle("show");
}

// Sluit menu als je buiten klikt
document.addEventListener("click", function(e){
  const menu = document.getElementById("dropdownMenu");
  const btn = document.querySelector(".menu-btn");

  if(menu && !menu.contains(e.target) && !btn.contains(e.target)){
    menu.classList.remove("show");
  }
});

function toggleProfileSelect(){
  const menu = document.getElementById("profileSelectMenu");
  menu.classList.toggle("show");
}