// nav.js — laadt nav.html en herschrijft links voor de juiste persoon-map
document.addEventListener("DOMContentLoaded", function () {
  fetch("/nav.html")
    .then(r => r.text())
    .then(html => {
      const holder = document.getElementById("navbar");
      if (!holder) return;
      holder.innerHTML = html;

      // Persoon bepalen uit eerste padsegment (bv. "mitchell" bij /mitchell/schema/)
      const parts = window.location.pathname.split("/").filter(Boolean);
      const person = parts.length ? parts[0] : "";

      holder.querySelectorAll(".nav-links a[href]").forEach(a => {
        const href = a.getAttribute("href");
        if (!href || /^(https?:)?\/\//i.test(href)) return; // externe links laten staan

        if (href === "./") {
          // Home → /persoon/ of /
          a.setAttribute("href", person ? `/${person}/` : "/");
        } else if (href.endsWith(".html")) {
          // schema.html → /persoon/schema.html
          a.setAttribute("href", person ? `/${person}/${href}` : `/${href}`);
        }
      });

      // Hamburger toggle
      const toggle = holder.querySelector(".nav-toggle");
      const links = holder.querySelector(".nav-links");
      if (toggle && links) {
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
        links.addEventListener("click", e => {
          if (e.target.closest("a")) closeMenu();
        });
        document.addEventListener("click", e => {
          if (!e.target.closest(".navbar")) closeMenu();
        });
        document.addEventListener("keydown", e => {
          if (e.key === "Escape") closeMenu();
        });
      }
    })
    .catch(err => console.error(err));
});
