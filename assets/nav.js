
document.addEventListener("DOMContentLoaded", function(){

  document.querySelectorAll("a[href]").forEach(link => {
    const href = link.getAttribute("href");

    if(href && href.endsWith(".html")){
      link.addEventListener("click", function(e){
        e.preventDefault();
        document.body.classList.add("fade-out");
        setTimeout(() => {
          window.location.href = href;
        }, 180);
      });
    }
  });

});

function toggleProfile(){
  document.getElementById("profileMenu").classList.toggle("show");
}

function toggleNav(){
  document.getElementById("drawer").classList.toggle("show");
  document.getElementById("overlay").classList.toggle("show");
  document.body.classList.toggle("nav-open");
}

function closeNav(){
  document.getElementById("drawer").classList.remove("show");
  document.getElementById("overlay").classList.remove("show");
  document.body.classList.remove("nav-open");
}
