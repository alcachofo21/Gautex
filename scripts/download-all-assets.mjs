import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "images");

const images = [
  { url: "https://gautex.com/.cm4all/iproc.php/gautex123.png/scale_0_0/gautex123.png", file: "logo/gautex.png" },
  { url: "https://gautex.com/.cm4all/iproc.php/logo_Castellano-alta.jpg/downsize_1280_0/logo_Castellano-alta.jpg", file: "logo/gautex-alt.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/matrix%20condoms%20product.jpg/downsize_1280_0/matrix%20condoms%20product.jpg", file: "products/matrix-condoms.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/viva%20condoms%20product.jpg/downsize_1280_0/viva%20condoms%20product.jpg", file: "products/viva-condoms.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/viva%20condoms%20product2.jpg/downsize_1280_0/viva%20condoms%20product2.jpg", file: "products/viva-condoms-2.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/sexydam%20product.jpg/downsize_1280_0/sexydam%20product.jpg", file: "products/sexydam.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/maxgel%20product.jpg/downsize_1280_0/maxgel%20product.jpg", file: "products/max-gel.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/gecofun%20product.jpg/downsize_1280_0/gecofun%20product.jpg", file: "products/gecofun.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/ultragecogel%20product.jpg/downsize_1280_0/ultragecogel%20product.jpg", file: "products/ultra-gecogel.jpg" },
  { url: "https://gautex.com/.cm4all/uproc.php/0/.CON%20MARCO%20243001N-10-COVID-19_Test_group_1000x1000px_72dpi.jpg/picture-800", file: "products/nadal-covid.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/Sin%20nombre.jpg/downsize_1280_0/Sin%20nombre.jpg", file: "categories/preventivo.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/Sin%20nombre1.jpg/downsize_1280_0/Sin%20nombre1.jpg", file: "categories/ginecologia.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/certificaciones.jpg/downsize_1280_0/certificaciones.jpg", file: "quality/certificaciones.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/condoms%20campa%C3%B1a.jpg/downsize_1280_0/condoms%20campa%C3%B1a.jpg", file: "campaigns/condoms-custom.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/condoms%20campa%C3%B1a2.jpg/downsize_1280_0/condoms%20campa%C3%B1a2.jpg", file: "campaigns/condoms-custom-2.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/estucado%20campa%C3%B1a.jpg/downsize_1280_0/estucado%20campa%C3%B1a.jpg", file: "campaigns/estuche.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/pvc%20campa%C3%B1a2.jpg/downsize_1280_0/pvc%20campa%C3%B1a2.jpg", file: "campaigns/funda-pvc.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/flowpacksss.jpg/downsize_1280_0/flowpacksss.jpg", file: "campaigns/flow-pack.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/condones%2Bsexo%2Bseguro.jpg/scale_0_0/condones%2Bsexo%2Bseguro.jpg", file: "hero/condones-seguro.jpg" },
  { url: "https://gautex.com/.cm4all/uproc.php/0/IMG_20160928_124817.jpg?_=165a9349440/downsize_400_1000/", file: "about/equipo.jpg" },
  { url: "https://gautex.com/.cm4all/uproc.php/0/tlmd_condones_historia.jpg?_=165a9349440/downsize_400_1000/", file: "about/historia-condones.jpg" },
  { url: "https://gautex.com/.cm4all/uproc.php/0/.Logotipo%20UE.jpg/picture-400", file: "partners/union-europea.jpg" },
  { url: "https://gautex.com/.cm4all/uproc.php/0/.cambra-barcelona.jpg/picture-400", file: "partners/cambra-barcelona.jpg" },
  { url: "https://gautex.com/.cm4all/iproc.php/andalucia.png/downsize_1280_0/andalucia.png", file: "partners/andalucia.png" },
  { url: "https://gautex.com/.cm4all/iproc.php/aragon.png/downsize_1280_0/aragon.png", file: "partners/aragon.png" },
  { url: "https://gautex.com/.cm4all/iproc.php/asturias.png/downsize_1280_0/asturias.png", file: "partners/asturias.png" },
  { url: "https://gautex.com/.cm4all/iproc.php/balears.png/downsize_1280_0/balears.png", file: "partners/balears.png" },
  { url: "https://gautex.com/.cm4all/iproc.php/bayer.png/downsize_1280_0/bayer.png", file: "partners/bayer.png" },
  { url: "https://gautex.com/.cm4all/iproc.php/canarias.png/downsize_1280_0/canarias.png", file: "partners/canarias.png" },
  { url: "https://gautex.com/.cm4all/iproc.php/cantabria.png/downsize_1280_0/cantabria.png", file: "partners/cantabria.png" },
  { url: "https://gautex.com/.cm4all/iproc.php/catalunya.png/downsize_1280_0/catalunya.png", file: "partners/catalunya.png" },
  { url: "https://gautex.com/.cm4all/iproc.php/ccoo.png/downsize_1280_0/ccoo.png", file: "partners/ccoo.png" },
  { url: "https://gautex.com/.cm4all/iproc.php/cruzroja.png/downsize_1280_0/cruzroja.png", file: "partners/cruzroja.png" },
  { url: "https://gautex.com/.cm4all/iproc.php/espa%C3%B1a.png/downsize_1280_0/espa%C3%B1a.png", file: "partners/espana.png" },
  { url: "https://gautex.com/.cm4all/iproc.php/extremadura.png/downsize_1280_0/extremadura.png", file: "partners/extremadura.png" },
  { url: "https://gautex.com/.cm4all/iproc.php/galicia.png/downsize_1280_0/galicia.png", file: "partners/galicia.png" },
  { url: "https://gautex.com/.cm4all/iproc.php/interior.png/downsize_1280_0/interior.png", file: "partners/castilla-leon.png" },
  { url: "https://gautex.com/.cm4all/iproc.php/la%20mancha.png/downsize_1280_0/la%20mancha.png", file: "partners/la-mancha.png" },
  { url: "https://gautex.com/.cm4all/iproc.php/leon.png/downsize_1280_0/leon.png", file: "partners/leon.png" },
  { url: "https://gautex.com/.cm4all/iproc.php/madrid.png/downsize_1280_0/madrid.png", file: "partners/madrid.png" },
  { url: "https://gautex.com/.cm4all/iproc.php/navarrra.png/downsize_1280_0/navarrra.png", file: "partners/navarra.png" },
  { url: "https://gautex.com/.cm4all/iproc.php/rioja.png/downsize_1280_0/rioja.png", file: "partners/rioja.png" },
  { url: "https://gautex.com/.cm4all/iproc.php/sida.png/downsize_1280_0/sida.png", file: "partners/sida.png" },
  { url: "https://gautex.com/.cm4all/iproc.php/valencia.png/downsize_1280_0/valencia.png", file: "partners/valencia.png" },
  { url: "https://gautex.com/.cm4all/iproc.php/vasco.png/downsize_1280_0/vasco.png", file: "partners/pais-vasco.png" },
];

fs.mkdirSync(outDir, { recursive: true });
let ok = 0, fail = 0;
for (const img of images) {
  const dest = path.join(outDir, img.file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  try {
    const res = await fetch(img.url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    ok++;
  } catch (e) {
    console.error("FAIL", img.file, e.message);
    fail++;
  }
}
console.log(`Done: ${ok} ok, ${fail} failed`);
