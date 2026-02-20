
document.addEventListener("DOMContentLoaded", function(){

  // Page fade
  document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", function(e){
      if(this.hostname === window.location.hostname){
        e.preventDefault();
        document.body.classList.add("fade-out");
        setTimeout(()=>{ window.location = this.href; }, 200);
      }
    });
  });

});

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

// Close dropdown if clicking outside
document.addEventListener("click", function(e){
  const menu = document.getElementById("profileMenu");
  const btn = document.querySelector(".profile-select-btn");

  if(menu && !menu.contains(e.target) && !btn.contains(e.target)){
    menu.classList.remove("show");
  }
});
