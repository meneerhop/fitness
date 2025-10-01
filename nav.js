document.addEventListener("DOMContentLoaded", function(){
  // Kijk in welke map we zitten (na je domein)
  let path = window.location.pathname;
  // Voorbeeld: /fitness/mitchell/schema.html → splitten
  let parts = path.split("/").filter(p => p.length > 0);

  // Default: geen map → root
  let base = "";

  // Als er een 2e deel is (na je repo-naam fitness), dat is de mapnaam
  // Bij GitHub Pages is parts[0] = "fitness", parts[1] = "mitchell"
  if(parts.length >= 2){
    base = parts[1]; // "mitchell" of "kas" of ...
  }

  fetch("/fitness/nav.html")  // nav.html staat in de root van je repo
    .then(r => r.text())
    .then(html => {
      let container = document.getElementById("navbar");
      container.innerHTML = html;

      // Pas alle links aan met de juiste map (behalve ./ → blijft ./)
      container.querySelectorAll("a").forEach(a => {
        if(a.getAttribute("href") !== "./"){
          a.setAttribute("href", base + "/" + a.getAttribute("href"));
        }
      });
    });
});
