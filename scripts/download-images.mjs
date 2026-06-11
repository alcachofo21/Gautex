import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "images");

const images = [
  { url: "https://gautex.com/.cm4all/iproc.php/gautex123.png/scale_0_0/gautex123.png", file: "logo/gautex.png" },
  { url: "https://gautex.com/.cm4all/iproc.php/matrix%20condoms%20product.jpg/downsize_1280_0/matrix%20condoms%20product.jpg", file: "products/matrix-condoms.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/viva%20condoms%20product.jpg/downsize_1280_0/viva%20condoms%20product.jpg", file: "products/viva-condoms.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/sexydam%20product.jpg/downsize_1280_0/sexydam%20product.jpg", file: "products/sexydam.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/maxgel%20product.jpg/downsize_1280_0/maxgel%20product.jpg", file: "products/max-gel.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/gecofun%20product.jpg/downsize_1280_0/gecofun%20product.jpg", file: "products/gecofun.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/ultragecogel%20product.jpg/downsize_1280_0/ultragecogel%20product.jpg", file: "products/ultra-gecogel.jpg" },
  { url: "https://gautex.com/.cm4all/uproc.php/0/.CON%20MARCO%20243001N-10-COVID-19_Test_group_1000x1000px_72dpi.jpg/picture-200", file: "products/nadal-covid.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/Sin%20nombre.jpg/downsize_1280_0/Sin%20nombre.jpg", file: "categories/preventivo.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/Sin%20nombre1.jpg/downsize_1280_0/Sin%20nombre1.jpg", file: "categories/ginecologia.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/condoms%20campa%C3%B1a.jpg/downsize_1280_0/condoms%20campa%C3%B1a.jpg", file: "campaigns/condoms-custom.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/estucado%20campa%C3%B1a.jpg/downsize_1280_0/estucado%20campa%C3%B1a.jpg", file: "campaigns/estuche.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/pvc%20campa%C3%B1a2.jpg/downsize_1280_0/pvc%20campa%C3%B1a2.jpg", file: "campaigns/funda-pvc.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/flowpacksss.jpg/downsize_1280_0/flowpacksss.jpg", file: "campaigns/flow-pack.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/condones%2Bsexo%2Bseguro.jpg/scale_0_0/condones%2Bsexo%2Bseguro.jpg", file: "hero/condones-seguro.jpg" },
];

fs.mkdirSync(outDir, { recursive: true });

for (const img of images) {
  const dest = path.join(outDir, img.file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  try {
    const res = await fetch(img.url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log("OK", img.file, buf.length, "bytes");
  } catch (e) {
    console.error("FAIL", img.file, e.message);
  }
}
