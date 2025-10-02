// nav.js — custom domain friendly + per-persoon links
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

      // Bepaal persoon uit eerste padsegment: /mitchell/..., /kas/...
      const parts = window.location.pathname.replace(/\/+$/,"").split("/").filter(Boolean);
      const person = parts.length ? parts[0] : "";

      holder.querySelectorAll(".nav-links a[href]").forEach(a => {
        const href = a.getAttribute("href");
        if (!href || /^(https?:)?\/\//i.test(href)) return; // externe link
        if (href === "./") {
          a.setAttribute("href", person ? `/${person}/` : `/`);
        } else if (!href.startsWith("/")) {
          a.setAttribute("href", person ? `/${person}/${href}` : `/${href}`);
        }
      });

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
