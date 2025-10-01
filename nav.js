// Laadt de centrale nav en past links aan voor de juiste persoon-map
document.addEventListener("DOMContentLoaded", function () {
  // Pad opschonen en segmenten bepalen
  const clean = window.location.pathname.replace(/\/+$/, "");
  const parts = clean.split("/").filter(Boolean);
  // Voor GitHub Pages: /<repo>/<persoon>/...
  const repo = parts[0] || "";            // bv "fitness"
  const person = parts[1] || "";          // bv "mitchell"
  const rootPrefix = repo ? `/${repo}` : "";

  // nav.html staat in de root van de repo
  fetch(`${rootPrefix}/nav.html`)
    .then(r => r.text())
    .then(html => {
      const holder = document.getElementById("navbar");
      if (!holder) return;
      holder.innerHTML = html;

      // Links herschrijven: maak ze absoluut naar /<repo>/<persoon>/...
      // ./ (Home) → /<repo>/<persoon>/    |  schema.html → /<repo>/<persoon>/schema.html
      if (person) {
        holder.querySelectorAll("a[href]").forEach(a => {
          const href = a.getAttribute("href");
          if (!href) return;

          // Laat absolute URLs met http(s) of leading slash met rust als ze al goed zijn
          if (/^(https?:)?\/\//i.test(href)) return;

          // Home
          if (href === "./") {
            a.setAttribute("href", `${rootPrefix}/${person}/`);
            return;
          }

          // Als het geen leading slash heeft, maak 'm absoluut binnen de persoon-map
          if (!href.startsWith("/")) {
            a.setAttribute("href", `${rootPrefix}/${person}/${href}`);
            return;
          }
        });
      }
    })
    .catch(console.error);
});
