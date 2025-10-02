// nav.js — laadt nav.html en herschrijft links voor clean URLs per persoon
document.addEventListener("DOMContentLoaded", function () {
  const holder = document.getElementById("navbar");
  if (!holder) return; // niks doen op pagina's zonder navbar (bv. startpagina)

  fetch("/nav.html")
    .then(r => {
      if (!r.ok) throw new Error("Kon nav.html niet laden (" + r.status + ")");
      return r.text();
    })
    .then(html => {
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

      const setExpanded = v => toggle.setAttribute("aria-expanded", v ? "true" : "false");

      function closeMenu() {
        links.classList.remove("show");
        setExpanded(false);
        document.body.classList.remove("no-scroll");
      }
      function openMenu() {
        links.classList.add("show");
        setExpanded(true);
        document.body.classList.add("no-scroll");
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
