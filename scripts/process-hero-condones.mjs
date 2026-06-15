/**
 * Recolors the hero condom photo to Gautex brand blues (#1e4f7a, #3b8cc4).
 * Usage: node scripts/process-hero-condones.mjs [inputPath]
 */
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const defaultInput =
  "C:/Users/victo/.cursor/projects/c-Users-victo-OneDrive-Documentos-GitHub-Gautex/assets/c__Users_victo_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_condones-seguro-d6549217-123f-4082-8fe3-4776c8b2955d.png";

const input = process.argv[2] || defaultInput;
const output = join(root, "public", "images", "hero", "condones-seguro.png");

const PRIMARY = [0x1e, 0x4f, 0x7a];
const ACCENT = [0x3b, 0x8c, 0xc4];
const PRIMARY_DARK = [0x15, 0x3a, 0x5c];

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function mix3(a, b, t) {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

function luminance(r, g, b) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function saturation(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === 0) return 0;
  return (max - min) / max;
}

const { data, info } = await sharp(input)
  .resize(1920, 1080, { fit: "cover", position: "centre" })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const lum = luminance(r, g, b);
  const sat = saturation(r, g, b);

  // Keep white/near-white background
  if (lum > 0.92 && sat < 0.12) {
    data[i] = 248;
    data[i + 1] = 250;
    data[i + 2] = 252;
    continue;
  }

  // Low-saturation mid-tones → soft blue-grey surface
  if (sat < 0.08) {
    const t = lum;
    const [nr, ng, nb] = mix3(PRIMARY_DARK, [0xf4, 0xf8, 0xfc], t);
    data[i] = nr;
    data[i + 1] = ng;
    data[i + 2] = nb;
    continue;
  }

  // Map colored condoms: darker areas → primary, highlights → accent
  const highlight = Math.min(1, Math.max(0, (lum - 0.25) / 0.55));
  const depth = Math.min(1, Math.max(0, 1 - lum * 0.9));
  let [nr, ng, nb] = mix3(PRIMARY, ACCENT, highlight);

  // Preserve subtle shading from original luminance
  const shade = 0.55 + lum * 0.55;
  nr = Math.min(255, Math.round(nr * shade));
  ng = Math.min(255, Math.round(ng * shade));
  nb = Math.min(255, Math.round(nb * shade));

  // Deep shadows
  if (depth > 0.6) {
    [nr, ng, nb] = mix3([nr, ng, nb], PRIMARY_DARK, (depth - 0.6) * 2);
  }

  data[i] = nr;
  data[i + 1] = ng;
  data[i + 2] = nb;
}

await mkdir(dirname(output), { recursive: true });
await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
  .sharpen({ sigma: 0.4 })
  .png({ compressionLevel: 9 })
  .toFile(output);

console.log(`✓ Hero image saved: ${output}`);
