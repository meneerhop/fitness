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

      // ====== Per-persoon link rewriting ======
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

      // ====== Hamburger toggle ======
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

      // ====== Spotify icoon laden uit assets en stylen ======
      const spotHolder = holder.querySelector(".nav-spotify-icon");
      if (spotHolder) {
        try {
          const svgText = await fetch("/assets/icons/spotify-icon.svg").then(r => r.text());
          spotHolder.innerHTML = svgText;
          const svg = spotHolder.querySelector("svg");
          if (svg) {
            svg.setAttribute("width", "20");
            svg.setAttribute("height", "20");
            // Zelfde kleur als huisje (styles.css zet nav-brand svg { fill: var(--text); })
            svg.style.fill = "var(--text)";
            svg.setAttribute("aria-hidden","true");
            svg.removeAttribute("title");
          }
        } catch (e) {
          console.warn("Kon spotify-icon.svg niet laden:", e);
        }
      }

      // ====== Spotify deeplink (app eerst, web fallback) ======
      const playlistId = "6yaHkYnJdPvZiowQv83aNs";
      const webUrl = "https://open.spotify.com/playlist/6yaHkYnJdPvZiowQv83aNs?si=0fe6b51d3b1d483c";
      const appUrl = `spotify:playlist:${playlistId}`;

      const spotifyLink = holder.querySelector("#spotifyLink");
      if (spotifyLink) {
        spotifyLink.addEventListener("click", (e) => {
          e.preventDefault();
          const start = Date.now();
          // Probeer app
          window.location.href = appUrl;
          // Fallback naar web als app niet opent
          setTimeout(() => {
            if (Date.now() - start < 1400) {
              window.location.href = webUrl;
            }
          }, 800);
        }, { passive: false });
      }
    })
    .catch(console.error);
});
