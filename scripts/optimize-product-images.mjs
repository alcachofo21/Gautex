import { mkdir, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir =
  process.env.ASSETS_DIR ||
  "C:/Users/victo/.cursor/projects/c-Users-victo-Documents-GitHub-Gautex/assets";
const outDir = join(__dirname, "..", "public", "images", "products");

const files = [
  "matrix-condoms.png",
  "nadal-covid.png",
  "max-gel.png",
  "sexydam.png",
  "viva-condoms.png",
  "gecofun.png",
  "ultra-gecogel.png",
  "viva-condoms-2.png",
];

await mkdir(outDir, { recursive: true });

for (const file of files) {
  const input = join(srcDir, file);
  const output = join(outDir, file);
  await sharp(input)
    .resize(1000, 1000, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png({ compressionLevel: 9, quality: 85 })
    .toFile(output);
  const s = await stat(output);
  console.log(`${file}: ${Math.round(s.size / 1024)} KB`);
}
