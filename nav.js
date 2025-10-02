document.addEventListener("DOMContentLoaded", function () {
  fetch("/nav.html")
    .then(r=>r.text())
    .then(html=>{
      const holder=document.getElementById("navbar");
      if(holder) holder.innerHTML=html;
      const toggle=document.querySelector(".nav-toggle");
      const menu=document.querySelector(".nav-links");
      if(toggle && menu){
        toggle.addEventListener("click",()=>menu.classList.toggle("show"));
      }
    });
});