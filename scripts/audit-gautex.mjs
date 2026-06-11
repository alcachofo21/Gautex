const pages = [
  "https://gautex.com/ES/Inicio/",
  "https://gautex.com/ES/Productos/",
  "https://gautex.com/ES/Productos/Material-preventivo-y-uso-sexual/",
  "https://gautex.com/ES/Productos/Ginecolog-a/",
  "https://gautex.com/ES/Productos/Tests-COVID-19/",
  "https://gautex.com/ES/Campanyas/",
  "https://gautex.com/ES/Tienda-online/1/",
  "https://gautex.com/ES/Calidad/",
  "https://gautex.com/ES/Colaboradores/",
  "https://gautex.com/ES/Contacto/",
  "https://gautex.com/ES/Nosotros/",
];

const allImages = new Set();
const allLinks = new Set();
const pageTitles = [];

for (const page of pages) {
  try {
    const res = await fetch(page);
    if (!res.ok) { pageTitles.push({ page, status: res.status }); continue; }
    const html = await res.text();
    const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim();
    pageTitles.push({ page, title, status: res.status });

    const imgRe = /(?:src|href|data-src)=["']([^"']+\.(?:jpg|jpeg|png|gif|webp|svg)[^"']*)["']/gi;
    let m;
    while ((m = imgRe.exec(html)) !== null) {
      let u = m[1];
      if (u.startsWith("/")) u = "https://gautex.com" + u;
      else if (!u.startsWith("http")) u = "https://gautex.com/" + u;
      if (u.includes("gautex.com") && !u.includes("pixel") && !u.includes("favicon")) {
        allImages.add(u.split("?")[0]);
      }
    }
    const iprocRe = /\/\.cm4all\/(?:iproc|uproc)\.php\/[^"'\s>]+/gi;
    while ((m = iprocRe.exec(html)) !== null) {
      allImages.add("https://gautex.com" + m[0]);
    }

    const linkRe = /href=["'](\/ES\/[^"']+)["']/gi;
    while ((m = linkRe.exec(html)) !== null) allLinks.add(m[1]);
  } catch (e) {
    pageTitles.push({ page, error: e.message });
  }
}

console.log("=== PAGES ===");
pageTitles.forEach((p) => console.log(JSON.stringify(p)));

console.log("\n=== UNIQUE ES LINKS ===");
[...allLinks].sort().forEach((l) => console.log(l));

console.log("\n=== ALL IMAGES (" + allImages.size + ") ===");
[...allImages].sort().forEach((u) => console.log(u));
