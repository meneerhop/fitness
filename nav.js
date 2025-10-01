// Laadt de centrale nav en herschrijft links per map (/mitchell/, /kas/, ...)
// Werkt op GitHub Pages (pad: /<repo>/<persoon>/...).
document.addEventListener("DOMContentLoaded", function () {
  const clean = window.location.pathname.replace(/\/+$/, "");
  const parts = clean.split("/").filter(Boolean);
  // Voor GitHub Pages: parts[0]=<repo>, parts[1]=<persoon> (mitchell/kas/eloy/jari)
  const repo = parts[0] || "";
  const person = parts[1] || "";
  const rootPrefix = repo ? `/${repo}` : "";

  fetch(`${rootPrefix}/nav.html`)
    .then(r => r.text())
    .then(html => {
      const holder = document.getElementById("navbar");
      if (!holder) return;
      holder.innerHTML = html;

      // Links herschrijven naar /<repo>/<person>/... (Home -> map-root)
      if (person) {
        holder.querySelectorAll(".nav-links a[href]").forEach(a => {
          const href = a.getAttribute("href");
          if (!href) return;
          if (/^(https?:)?\/\//i.test(href)) return; // externe link: laat met rust

          if (href === "./") {
            a.setAttribute("href", `${rootPrefix}/${person}/`);
          } else if (!href.startsWith("/")) {
            a.setAttribute("href", `${rootPrefix}/${person}/${href}`);
          }
        });
      } else {
        // Op root (bijv. /<repo>/index) verwijzen links naar root
        holder.querySelectorAll(".nav-links a[href]").forEach(a => {
          const href = a.getAttribute("href");
          if (!href || /^(https?:)?\/\//i.test(href)) return;
          if (href === "./") a.setAttribute("href", `${rootPrefix}/`);
          else if (!href.startsWith("/")) a.setAttribute("href", `${rootPrefix}/${href}`);
        });
      }

      // Hamburger toggle
      const toggle = holder.querySelector(".nav-toggle");
      const links = holder.querySelector(".nav-links");

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
        const inside = e.target.closest(".navbar");
        if (!inside) closeMenu();
      });
      // Sluit bij Escape
      document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeMenu();
      });
    })
    .catch(console.error);
});
