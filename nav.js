document.addEventListener("DOMContentLoaded", () => {
  const holder = document.getElementById("navbar");
  if (!holder) return;

  fetch("/nav.html?v=3")
    .then(r => r.ok ? r.text() : Promise.reject(r.status))
    .then(html => {
      holder.innerHTML = html;

      const parts = location.pathname.split("/").filter(Boolean);
      const person = parts.length ? parts[0] : "";

      holder.querySelectorAll(".nav-links a[href]").forEach(a => {
        const href = a.getAttribute("href");
        if (!href || /^(https?:)?\/\//i.test(href)) return;
        if (href === "./") a.href = person ? `/${person}/` : "/";
        else if (href.endsWith(".html")) a.href = person ? `/${person}/${href.replace(/\.html$/,"")}/` : `/${href.replace(/\.html$/,"")}/`;
      });

      const toggle = holder.querySelector(".nav-toggle");
      const links  = holder.querySelector(".nav-links");
      if (!toggle || !links) return;

      const setExpanded = v => toggle.setAttribute("aria-expanded", v ? "true" : "false");
      const closeMenu = () => { links.classList.remove("show"); setExpanded(false); };
      const openMenu  = () => { links.classList.add("show");    setExpanded(true);  };

      toggle.addEventListener("click", () => links.classList.contains("show") ? closeMenu() : openMenu());
      links.addEventListener("click", e => { if (e.target.closest("a")) closeMenu(); });
      document.addEventListener("click", e => { if (!e.target.closest(".navbar")) closeMenu(); });
      document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
    })
    .catch(console.error);
});
