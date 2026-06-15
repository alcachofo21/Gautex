import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "images", "products");
const BASE = "https://gautex.com";
const FOCUS = "ARSPRO_cm4all_com_widgets_Shop_9857633";
const CATEGORY_IDS = ["37380", "37381", "37382"];

function categoryUrl(categoryId) {
  return `${BASE}/ES/Tienda-online/1/index.php/;focus=${FOCUS}&path=?subAction=showCategory&categoryId=${categoryId}`;
}

function decodeHtml(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function slugify(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const SLUG_OVERRIDES = {
  "160495": "sexydam",
  "166200": "matrix-condoms",
  "160228": "viva-condoms",
  "148560": "viva-condoms-xl",
  "148561": "viva-condoms-extra-fuerte",
  "173165": "max-gel",
  "173166": "max-gel-3-5ml",
  "160462": "body-ars-4ml",
  "148562": "viva-condoms-manzana",
  "148563": "viva-condoms-banana",
  "166202": "viva-condoms-fresa",
  "160463": "gecofun",
};

function extractProducts(html, categoryId) {
  const blocks = html.split('<div class="cm-widget-shop-items">').slice(1);
  const products = [];

  for (const block of blocks) {
    const aria = block.match(/aria-label="([^"]+)"/)?.[1];
    const productId =
      block.match(/productId=(\d+)/)?.[1] ||
      block.match(/cm-shop-widget-product-id="(\d+)"/)?.[1];
    const imgMatch = block.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/);
    let image = imgMatch?.[1];
    if (image?.startsWith("/")) image = BASE + image;

    if (!aria || !productId) continue;

    const parts = decodeHtml(aria).split(":");
    const name = parts[0]?.trim();
    let price = null;
    let pack = null;

    for (let i = 1; i < parts.length; i++) {
      const p = parts[i].trim();
      if (/^\d+[.,]\d{2}\s*€/.test(p)) {
        price = parseFloat(p.replace("€", "").trim().replace(",", "."));
      } else if (p && !/^precio$/i.test(p)) {
        pack = pack ? `${pack} · ${p}` : p;
      }
    }

    if (price == null && pack) {
      const m = pack.match(/^(\d+[.,]\d{2})\s*€\s*(?:·\s*)?(.*)$/);
      if (m) {
        price = parseFloat(m[1].replace(",", "."));
        pack = m[2] || null;
      }
    }

    products.push({
      productId,
      name,
      price,
      priceLabel: price != null ? `${price.toFixed(2).replace(".", ",")} €` : null,
      pack,
      categoryId,
      image,
      slug: SLUG_OVERRIDES[productId] || slugify(name),
    });
  }

  return products;
}

async function downloadImage(url, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; GautexMigration/1.0)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf)
    .resize(1000, 1000, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png({ compressionLevel: 9 })
    .toFile(dest);
}

const all = [];
const downloaded = [];
const failed = [];

for (const categoryId of CATEGORY_IDS) {
  const res = await fetch(categoryUrl(categoryId), {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; GautexMigration/1.0)" },
  });
  const html = await res.text();
  all.push(...extractProducts(html, categoryId));
}

for (const p of all) {
  if (!p.image) continue;
  const filename = `${p.slug}.png`;
  const dest = path.join(outDir, filename);
  try {
    await downloadImage(p.image, dest);
    downloaded.push({ slug: p.slug, file: filename, url: p.image });
    p.localImage = `/images/products/${filename}`;
    console.log("OK", filename);
  } catch (e) {
    failed.push({ slug: p.slug, error: e.message });
    console.error("FAIL", p.slug, e.message);
  }
}

const report = { scraped: all.length, downloaded, failed, products: all };
fs.mkdirSync(path.join(__dirname, "..", ".cache"), { recursive: true });
fs.writeFileSync(
  path.join(__dirname, "..", ".cache", "shop-scrape.json"),
  JSON.stringify(report, null, 2)
);
fs.writeFileSync(
  path.join(__dirname, "..", "content", "scraped-shop.json"),
  JSON.stringify(all, null, 2)
);
console.log(`\nScraped ${all.length}, downloaded ${downloaded.length}, failed ${failed.length}`);
