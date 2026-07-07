#!/usr/bin/env node
/**
 * Validates content/inventory.json and prints shop catalog summary.
 * Usage: node scripts/sync-inventory.mjs
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const inventory = JSON.parse(readFileSync(join(root, "content/inventory.json"), "utf8"));
const products = JSON.parse(readFileSync(join(root, "content/products.json"), "utf8"));

const stockById = new Map();
for (const row of inventory.skus) {
  if (!row.productId || row.channel === "public_entity" || !row.webVisible) continue;
  stockById.set(row.productId, (stockById.get(row.productId) ?? 0) + row.stockBoxes);
}

const hiddenPublic = inventory.skus.filter((r) => r.channel === "public_entity");
const shopIds = new Set(stockById.keys());

console.log(`Inventory updated: ${inventory.updatedAt}`);
console.log(`Public-entity SKUs excluded from web: ${hiddenPublic.length}`);
hiddenPublic.forEach((r) => console.log(`  - ${r.sku} ${r.name} (${r.stockBoxes} cajas)`));

console.log(`\nB2C catalog with stock (${shopIds.size} product IDs):`);
for (const [id, stock] of [...stockById.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const p = products.find((x) => x.id === id);
  console.log(`  ${id}: ${stock} cajas${p ? ` - ${p.name}` : " (missing in products.json!)"}`);
}

const missing = products.filter((p) => p.price && !shopIds.has(p.id) && !inventory.productOverrides[p.id]);
if (missing.length) {
  console.log(`\nWarning: priced products without inventory row (hidden from shop):`);
  missing.forEach((p) => console.log(`  - ${p.id}`));
}
