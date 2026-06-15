import { mkdir, stat, copyFile } from "node:fs/promises";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const marketingDir = join(root, "marketing");
const assetsDir =
  process.env.ASSETS_DIR ||
  "C:/Users/victo/.cursor/projects/c-Users-victo-OneDrive-Documentos-GitHub-Gautex/assets";

/** Marketing ad → web product image (square catalog) */
const productFromMarketing = [
  ["ad-matrix-condoms.png", "matrix-condoms.png"],
  ["ad-viva-condoms-cyan.png", "viva-condoms.png"],
  ["ad-viva-condoms-silver.png", "viva-condoms-2.png"],
  ["ad-sexydam.png", "sexydam.png"],
  ["ad-maxgel-lubricante.png", "max-gel.png"],
  ["ad-gecofun-cubresonda.png", "gecofun.png"],
  ["ad-ultra-gecogel.png", "ultra-gecogel.png"],
  ["ad-covid-test-nadal.png", "nadal-covid.png"],
  ["ad-mascarilla-quirurgica.png", "mascarilla-quirurgica.png"],
  ["ad-mascarilla-ffp2.png", "mascarilla-ffp2.png"],
  ["ad-preservativo-femenino.png", "preservativo-femenino.png"],
];

/** Category hero images */
const categories = [
  ["ad-matrix-condoms.png", "preventivo.png"],
  ["ad-gecofun-cubresonda.png", "ginecologia.png"],
  ["ad-covid-test-nadal.png", "covid-19.png"],
];

/** Campaign format images */
const campaigns = [
  ["ad-campaign-estuche.png", "estuche.png"],
  ["ad-campaign-funda-pvc.png", "funda-pvc.png"],
  ["ad-matrix-condoms.png", "condoms-custom.png"],
  ["ad-viva-condoms-cyan.png", "flow-pack.png"],
];

async function ensureSquarePng(input, output, size = 1000) {
  await mkdir(dirname(output), { recursive: true });
  await sharp(input)
    .resize(size, size, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .sharpen({ sigma: 0.8 })
    .png({ compressionLevel: 9, quality: 90 })
    .toFile(output);
  const s = await stat(output);
  console.log(`✓ ${basename(output)} (${Math.round(s.size / 1024)} KB)`);
}

async function ensureLandscapePng(input, output, w = 1200, h = 900) {
  await mkdir(dirname(output), { recursive: true });
  await sharp(input)
    .resize(w, h, {
      fit: "cover",
      position: "centre",
    })
    .sharpen({ sigma: 0.6 })
    .png({ compressionLevel: 9, quality: 90 })
    .toFile(output);
  const s = await stat(output);
  console.log(`✓ ${basename(output)} (${Math.round(s.size / 1024)} KB)`);
}

async function ensureHero(input, output) {
  await mkdir(dirname(output), { recursive: true });
  await sharp(input)
    .resize(1920, 1080, { fit: "cover", position: "centre" })
    .sharpen({ sigma: 0.5 })
    .png({ compressionLevel: 9, quality: 90 })
    .toFile(output);
  const s = await stat(output);
  console.log(`✓ hero ${basename(output)} (${Math.round(s.size / 1024)} KB)`);
}

async function copyToMarketing(name) {
  const fromAssets = join(assetsDir, name);
  const toMarketing = join(marketingDir, name);
  try {
    await copyFile(fromAssets, toMarketing);
    console.log(`→ marketing/${name}`);
  } catch {
    /* already in marketing */
  }
}

console.log("=== Copiando nuevos assets a marketing/ ===");
for (const file of [
  "ad-mascarilla-quirurgica.png",
  "ad-mascarilla-ffp2.png",
  "ad-preservativo-femenino.png",
  "ad-hero-gautex.png",
  "ad-campaign-estuche.png",
  "ad-campaign-funda-pvc.png",
]) {
  await copyToMarketing(file);
}

console.log("\n=== Productos (1000×1000 PNG) ===");
for (const [ad, out] of productFromMarketing) {
  const input = join(marketingDir, ad);
  await ensureSquarePng(input, join(root, "public", "images", "products", out));
}

console.log("\n=== Categorías (1200×900 PNG) ===");
for (const [ad, out] of categories) {
  await ensureLandscapePng(
    join(marketingDir, ad),
    join(root, "public", "images", "categories", out)
  );
}

console.log("\n=== Campañas (1200×900 PNG) ===");
for (const [ad, out] of campaigns) {
  await ensureLandscapePng(
    join(marketingDir, ad),
    join(root, "public", "images", "campaigns", out)
  );
}

console.log("\n=== Hero ===");
await ensureHero(
  join(marketingDir, "ad-hero-gautex.png"),
  join(root, "public", "images", "hero", "condones-seguro.png")
);

console.log("\n=== Catálogo marketing (copias HD) ===");
const catalogDir = join(root, "public", "images", "marketing");
await mkdir(catalogDir, { recursive: true });
const { readdir } = await import("node:fs/promises");
for (const file of await readdir(marketingDir)) {
  if (!file.endsWith(".png")) continue;
  await copyFile(join(marketingDir, file), join(catalogDir, file));
  console.log(`✓ marketing catalog/${file}`);
}

console.log("\nDone.");
