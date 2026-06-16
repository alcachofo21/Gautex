/**
 * Generate lightweight WebP assets for the public site.
 * Usage: node scripts/optimize-web-images.mjs
 */
import { readdir, stat } from "node:fs/promises";
import { join, dirname, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagesRoot = join(__dirname, "..", "public", "images");

const PRESETS = {
  products: { width: 800, height: 800, fit: "contain", quality: 82, bg: "#ffffff" },
  categories: { width: 960, height: 640, fit: "cover", quality: 80 },
  campaigns: { width: 960, height: 720, fit: "cover", quality: 80 },
  hero: { width: 1920, height: 1080, fit: "cover", quality: 78 },
  partners: { width: 192, height: 192, fit: "contain", quality: 85, bg: "#ffffff" },
  marketing: { width: 800, height: 600, fit: "inside", quality: 80 },
  logo: { width: 512, height: 512, fit: "inside", quality: 88 },
  about: { width: 1024, height: 768, fit: "cover", quality: 80 },
  quality: { width: 800, height: 600, fit: "cover", quality: 80 },
};

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(full)));
    } else if (/\.(png|jpe?g)$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function presetFor(filePath) {
  const rel = filePath.replace(imagesRoot, "").replace(/\\/g, "/");
  const folder = rel.split("/").filter(Boolean)[0];
  return PRESETS[folder] || PRESETS.products;
}

async function toWebp(inputPath) {
  const ext = extname(inputPath);
  const outputPath = inputPath.slice(0, -ext.length) + ".webp";
  const preset = presetFor(inputPath);
  const inputStat = await stat(inputPath);

  try {
    const outputStat = await stat(outputPath);
    if (outputStat.mtimeMs >= inputStat.mtimeMs) {
      console.log(`↷ ${basename(outputPath)} (up to date)`);
      return outputPath;
    }
  } catch {
    /* generate */
  }

  let pipeline = sharp(inputPath).rotate();

  if (preset.fit === "contain") {
    pipeline = pipeline.resize(preset.width, preset.height, {
      fit: "contain",
      background: preset.bg || { r: 255, g: 255, b: 255, alpha: 1 },
    });
  } else if (preset.fit === "inside") {
    pipeline = pipeline.resize(preset.width, preset.height, { fit: "inside", withoutEnlargement: true });
  } else {
    pipeline = pipeline.resize(preset.width, preset.height, { fit: "cover", position: "centre" });
  }

  await pipeline.webp({ quality: preset.quality, effort: 4 }).toFile(outputPath);

  const outStat = await stat(outputPath);
  console.log(
    `✓ ${basename(outputPath)}  ${Math.round(inputStat.size / 1024)} KB → ${Math.round(outStat.size / 1024)} KB`
  );
  return outputPath;
}

const files = await listFiles(imagesRoot);
console.log(`Optimizing ${files.length} images...\n`);

for (const file of files) {
  if (file.endsWith(".webp")) continue;
  try {
    await toWebp(file);
  } catch (err) {
    console.error(`✗ ${file}: ${err.message}`);
  }
}

console.log("\nDone. Update app paths to .webp where generated.");
