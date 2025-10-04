// nav.js — laadt nav.html en herschrijft links voor clean URLs per persoon
document.addEventListener("DOMContentLoaded", function () {
  const holder = document.getElementById("navbar");
  if (!holder) return;

  fetch("/nav.html")
    .then(r => {
      if (!r.ok) throw new Error("Kon nav.html niet laden (" + r.status + ")");
      return r.text();
    })
    .then(async html => {
      holder.innerHTML = html;

      // --- Rewriting per persoon ---
      const parts = window.location.pathname.split("/").filter(Boolean);
      const person = parts.length ? parts[0] : "";

      holder.querySelectorAll(".nav-links a[href]").forEach(a => {
        const href = a.getAttribute("href");
        if (!href || /^(https?:)?\/\//i.test(href)) return;

        if (href === "./") {
          a.setAttribute("href", person ? `/${person}/` : "/");
        } else if (href.endsWith(".html")) {
          const base = href.replace(/\.html$/, "");
          a.setAttribute("href", person ? `/${person}/${base}/` : `/${base}/`);
        }
      });

      // --- Hamburger toggle ---
      const toggle = holder.querySelector(".nav-toggle");
      const links  = holder.querySelector(".nav-links");
      if (toggle && links) {
        const setExpanded = v => toggle.setAttribute("aria-expanded", v ? "true" : "false");
        const closeMenu = () => { links.classList.remove("show"); setExpanded(false); document.body.classList.remove("no-scroll"); };
        const openMenu  = () => { links.classList.add("show");    setExpanded(true);  document.body.classList.add("no-scroll"); };

        toggle.addEventListener("click", () => {
          links.classList.contains("show") ? closeMenu() : openMenu();
        });
        links.addEventListener("click", e => { if (e.target.closest("a")) closeMenu(); });
        document.addEventListener("click", e => { if (!e.target.closest(".navbar")) closeMenu(); });
        document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
      }

      // --- Spotify icoon inline laden ---
      const spotHolder = holder.querySelector(".nav-spotify-icon");
      const spotLink   = holder.querySelector(".nav-spotify");
      if (spotHolder && spotLink) {
        try {
          const svgText = await fetch("/assets/icons/spotify-icon.svg").then(r => r.text());
          const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
          const svg = doc.querySelector("svg");
          if (svg) {
            svg.setAttribute("width", "20");
            svg.setAttribute("height", "20");
            svg.setAttribute("aria-hidden", "true");
            // verwijder vaste kleur
            svg.querySelectorAll("[fill]").forEach(el => el.removeAttribute("fill"));
            svg.style.fill = "currentColor";
            spotHolder.replaceWith(svg);
          }
        } catch (e) {
          console.warn("Kon spotify-icon.svg niet laden:", e);
        }

        // Deeplink naar app met web fallback
        const playlistId = "6yaHkYnJdPvZiowQv83aNs";
        const webUrl = "https://open.spotify.com/playlist/6yaHkYnJdPvZiowQv83aNs?si=0fe6b51d3b1d483c";
        const appUrl = `spotify:playlist:${playlistId}`;
        spotLink.addEventListener("click", (e) => {
          e.preventDefault();
          const start = Date.now();
          window.location.href = appUrl;
          setTimeout(() => {
            if (Date.now() - start < 1400) window.location.href = webUrl;
          }, 800);
        }, { passive: false });
      }
    })
    .catch(console.error);
});
