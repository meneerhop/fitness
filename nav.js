// nav.js — werkt met custom domain www.moffel.fit
// Zorgt dat nav.html geladen wordt en past "Home" aan naar de juiste persoon-map.
document.addEventListener("DOMContentLoaded", function () {
  fetch("/nav.html")
    .then(r => {
      if (!r.ok) throw new Error("Kon nav.html niet laden (" + r.status + ")");
      return r.text();
    })
    .then(html => {
      const holder = document.getElementById("navbar");
      if (!holder) return;
      holder.innerHTML = html;

      // Persoon bepalen (eerste mapsegment, bijv. "mitchell")
      const parts = window.location.pathname.split("/").filter(Boolean);
      const person = parts.length ? parts[0] : "";

      // Zet de Home-link naar /persoon/ of root
      holder.querySelectorAll('.nav-links a[href="./"]').forEach(a => {
        a.setAttribute("href", person ? `/${person}/` : "/");
      });

      // Hamburger toggle functionaliteit
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
    .catch(err => console.error(err));
});
