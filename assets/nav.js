
document.addEventListener("DOMContentLoaded", function(){

  document.querySelectorAll("a").forEach(link=>{
    link.addEventListener("click",function(e){
      if(this.hostname===window.location.hostname && !this.getAttribute("href").startsWith("#")){
        e.preventDefault();
        document.body.classList.add("fade-out");
        setTimeout(()=>{window.location=this.href},200);
      }
    });
  });

});

function toggleProfile(){
  document.getElementById("profileMenu").classList.toggle("show");
}

function toggleNav(){
  document.getElementById("drawer").classList.toggle("show");
  document.getElementById("overlay").classList.toggle("show");
}

function closeNav(){
  document.getElementById("drawer").classList.remove("show");
  document.getElementById("overlay").classList.remove("show");
}
