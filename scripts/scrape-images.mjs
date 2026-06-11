const pages = [
  "https://gautex.com/ES/Inicio/",
  "https://gautex.com/ES/Productos/",
  "https://gautex.com/ES/Productos/Material-preventivo-y-uso-sexual/",
  "https://gautex.com/ES/Productos/Ginecolog-a/",
  "https://gautex.com/ES/Productos/Tests-COVID-19/",
  "https://gautex.com/ES/Campanyas/",
  "https://gautex.com/ES/Tienda-online/1/",
];

const urls = new Set();

for (const page of pages) {
  try {
    const res = await fetch(page);
    const html = await res.text();
    const imgRe = /(?:src|href)=["']([^"']+\.(?:jpg|jpeg|png|gif|webp)[^"']*)["']/gi;
    let m;
    while ((m = imgRe.exec(html)) !== null) {
      let u = m[1];
      if (u.startsWith("/")) u = "https://gautex.com" + u;
      else if (!u.startsWith("http")) u = "https://gautex.com/" + u;
      urls.add(u.split("?")[0]);
    }
    const iprocRe = /\/\.cm4all\/iproc\.php\/[^"'\s>]+\.(?:jpg|jpeg|png)/gi;
    while ((m = iprocRe.exec(html)) !== null) {
      urls.add("https://gautex.com" + m[0]);
    }
  } catch (e) {
    console.error(page, e.message);
  }
}

console.log([...urls].sort().join("\n"));
