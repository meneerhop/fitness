// nav.js — laadt nav.html en herschrijft links voor clean URLs per persoon
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

      const parts = window.location.pathname.split("/").filter(Boolean);
      const person = parts.length ? parts[0] : "";

      holder.querySelectorAll(".nav-links a[href]").forEach(a => {
        const href = a.getAttribute("href");
        if (!href || /^(https?:)?\/\//i.test(href)) return;

        if (href === "./") {
          a.setAttribute("href", person ? `/${person}/` : "/");
        } else if (href.endsWith(".html")) {
          const base = href.replace(/\.html$/,"");
          a.setAttribute("href", person ? `/${person}/${base}/` : `/${base}/`);
        }
      });

      // Hamburger toggle
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
    .catch(console.error);
});
