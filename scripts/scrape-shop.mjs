import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "images", "products");
const base = "https://gautex.com";

const categories = [
  { id: "preventivo", categoryId: "37380" },
  { id: "ginecologia", categoryId: "37381" },
  { id: "covid-19", categoryId: "37382" },
];

const shopUrl = (categoryId) =>
  `${base}/ES/Tienda-online/1/index.php/;focus=ARSPRO_cm4all_com_widgets_Shop_9857633&path=?subAction=showCategory&categoryId=${categoryId}`;

function parsePrice(text) {
  const m = text.match(/(\d+),(\d+)/);
  if (!m) return null;
  return parseFloat(`${m[1]}.${m[2]}`);
}

function formatPriceLabel(price) {
  const [whole, frac] = price.toFixed(2).split(".");
  return `${whole},${frac} €`;
}

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/®/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseProducts(html, category) {
  const items = [];
  const chunks = [...html.matchAll(/<div class="cm-widget-shop-items">([\s\S]*?)<\/div><\/div>/g)];

  for (const [, chunk] of chunks) {
    const priceMatch = chunk.match(/<span class="cm-widget-shop-price">([^<]+)<\/span>/);
    const nameMatch = chunk.match(/<\/span>([^<]+(?:<[^>]+>[^<]*)*?)(?:<div class="cm-widget-shop-short-description">|$)/);
    const imageMatch = chunk.match(/background-image:\s*url\('([^']+)'\)/);
    const productIdMatch = chunk.match(/productId=(\d+)/);

    if (!priceMatch) continue;

    const rawName = (nameMatch?.[1] || "")
      .replace(/<[^>]+>/g, "")
      .replace(/®/g, "")
      .trim();
    const price = parsePrice(priceMatch[1]);
    const imagePath = imageMatch?.[1] || null;
    const legacyProductId = productIdMatch?.[1] || null;

    items.push({
      legacyProductId,
      name: rawName,
      slug: slugify(rawName),
      category,
      price,
      priceLabel: price != null ? formatPriceLabel(price) : "Consultar precio",
      imagePath,
    });
  }

  return items;
}

async function downloadImage(imagePath, filename) {
  if (!imagePath) return false;
  const url = imagePath.startsWith("http") ? imagePath : `${base}${imagePath}`;
  const dest = path.join(outDir, filename);
  fs.mkdirSync(outDir, { recursive: true });
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log("OK", filename, buf.length, "bytes");
    return true;
  } catch (e) {
    console.error("FAIL", filename, e.message);
    return false;
  }
}

const imageMap = {
  sexydam: "sexydam-shop.jpg",
  "matrix-condoms": "matrix-condoms-shop.jpg",
  "viva-condoms": "viva-condoms-shop.jpg",
  "viva-condoms-xl": "viva-condoms-xl.jpg",
  "viva-condoms-extra-fuerte": "viva-condoms-extra-fuerte.jpg",
  "max-gel": "max-gel-shop.jpg",
  "max-gel-35": "max-gel-35.jpg",
  "body-ars": "body-ars.jpg",
  "viva-condoms-manzana": "viva-condoms-manzana.jpg",
  "viva-condoms-banana": "viva-condoms-banana.jpg",
  "viva-condoms-fresa": "viva-condoms-fresa.jpg",
  gecofun: "gecofun-shop.jpg",
};

const idMap = {
  "barrera-de-latex-sexy-dam-para-sexo-oral": "sexydam",
  "preservativo-natural-matrix-condoms": "matrix-condoms",
  "preservativo-natural-viva-condoms": "viva-condoms",
  "preservativo-xl-viva-condoms": "viva-condoms-xl",
  "preservativo-extra-fuerte-viva-condoms": "viva-condoms-extra-fuerte",
  "lubricante-monodosis-max-gel-6-ml": "max-gel",
  "lubricante-monodosis-max-gel-3-5-ml": "max-gel-35",
  "lubricante-monodosis-body-ars-4-ml": "body-ars",
  "preservativo-sabor-color-manzana-viva-condoms": "viva-condoms-manzana",
  "preservativo-sabor-color-banana-viva-condoms": "viva-condoms-banana",
  "preservativo-sabor-color-fresa-viva-condoms": "viva-condoms-fresa",
  "cubresonda-para-sonda-ecografica-gecofun": "gecofun",
};

const allProducts = [];

for (const cat of categories) {
  const res = await fetch(shopUrl(cat.categoryId));
  const html = await res.text();
  const products = parseProducts(html, cat.id);
  console.log(`\n${cat.id}: ${products.length} products`);
  for (const p of products) {
    const id = idMap[p.slug] || p.slug;
    const imageFile = imageMap[id];
    if (imageFile && p.imagePath) {
      await downloadImage(p.imagePath, imageFile);
    }
    allProducts.push({ ...p, id, imageFile: imageFile ? `/images/products/${imageFile}` : null });
    console.log(`  ${p.priceLabel} - ${p.name}`);
  }
}

const reportPath = path.join(__dirname, "..", "content", "scraped-shop.json");
fs.writeFileSync(reportPath, JSON.stringify(allProducts, null, 2));
console.log(`\nWrote ${reportPath}`);
