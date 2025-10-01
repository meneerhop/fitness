// nav.js — werkt met custom domain (www.moffel.fit) en submappen (bijv. /mitchell/)
// Laadt nav.html vanaf de root en regelt alleen de hamburger; geen pad-herschrijving nodig.
document.addEventListener("DOMContentLoaded", function () {
  fetch("/nav.html")
    .then(r => {
      if (!r.ok) throw new Error("Kon /nav.html niet laden (" + r.status + ")");
      return r.text();
    })
    .then(html => {
      const holder = document.getElementById("navbar");
      if (!holder) return;
      holder.innerHTML = html;

      // Als nav.html een link heeft met href="./", laat de browser die zelf
      // relatief oplossen (dat is per map al correct). Eventueel kun je onderstaand
      // blokje gebruiken om './' op de root-pagina expliciet naar '/' te zetten.
      const isRootFile = window.location.pathname.replace(/\/+$/, "") === "" ||
                         window.location.pathname.replace(/\/+$/, "") === "/";
      if (isRootFile) {
        holder.querySelectorAll('a[href="./"]').forEach(a => a.setAttribute("href", "/"));
      }

      // Hamburger/menu toggle
      const toggle = holder.querySelector(".nav-toggle");
      const links = holder.querySelector(".nav-links");
      if (!toggle || !links) return;

      function closeMenu() {
        links.classList.remove("show");
        toggle.setAttribute("aria-expanded", "false");
      }
      function openMenu() {
        links.classList.add("show");
        toggle.setAttribute("aria-expanded", "true");
      }
      toggle.addEventListener("click", () => {
        links.classList.contains("show") ? closeMenu() : openMenu();
      });

      // Sluit menu bij klik op link of buiten het menu
      links.addEventListener("click", e => {
        if (e.target.closest("a")) closeMenu();
      });
      document.addEventListener("click", e => {
        if (!e.target.closest(".navbar")) closeMenu();
      });
      document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeMenu();
      });
    })
    .catch(err => {
      console.error(err);
    });
});
