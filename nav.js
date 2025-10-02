// Load nav, rewrite links per person folder, and handle hamburger
document.addEventListener("DOMContentLoaded", function () {
  const clean = window.location.pathname.replace(/\/+$/, "");
  const parts = clean.split("/").filter(Boolean);
  // GitHub Pages layout: /<repo>/<person>/...
  const repo = parts[0] || "";
  const person = parts[1] || "";
  const rootPrefix = repo ? `/${repo}` : "";

  fetch(`${rootPrefix}/nav.html`)
    .then(r => r.text())
    .then(html => {
      const holder = document.getElementById("navbar");
      if (!holder) return;
      holder.innerHTML = html;

      const links = holder.querySelector(".nav-links");
      if (!links) return;

      links.querySelectorAll("a[href]").forEach(a => {
        const href = a.getAttribute("href");
        if (!href || /^(https?:)?\/\//i.test(href)) return; // external
        if (person) {
          if (href === "./") a.href = `${rootPrefix}/${person}/`;
          else if (!href.startsWith("/")) a.href = `${rootPrefix}/${person}/${href}`;
        } else {
          if (href === "./") a.href = `${rootPrefix}/`;
          else if (!href.startsWith("/")) a.href = `${rootPrefix}/${href}`;
        }
      });

      const toggle = holder.querySelector(".nav-toggle");
      if (toggle && links) {
        const open  = () => { links.classList.add("show");  toggle.setAttribute("aria-expanded","true"); };
        const close = () => { links.classList.remove("show"); toggle.setAttribute("aria-expanded","false"); };
        toggle.addEventListener("click", () => links.classList.contains("show") ? close() : open());
        links.addEventListener("click", e => { if (e.target.closest("a")) close(); });
        document.addEventListener("click", e => { if (!e.target.closest(".navbar")) close(); });
        document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
      }
    })
    .catch(console.error);
});
