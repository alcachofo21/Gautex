#!/usr/bin/env node
/**
 * Verifica que la migración a www.gautex.com fue correcta.
 * Uso: node scripts/verify-migration.mjs [--base https://www.gautex.com]
 */

const DEFAULT_BASE = "https://www.gautex.com";

const args = process.argv.slice(2);
const baseIdx = args.indexOf("--base");
const base = (baseIdx >= 0 ? args[baseIdx + 1] : DEFAULT_BASE).replace(/\/$/, "");

const REDIRECT_CHECKS = [
  { path: "/ES/Contacto/", expectLocation: "/contacto" },
  { path: "/ES/Productos/", expectLocation: "/productos" },
  { path: "/ES/inicio/", expectLocation: "/" },
  { path: "/ES/Productos/Material-preventivo-y-uso-sexual/Viva-Condoms/", expectLocation: "/productos/preventivo/viva-condoms" },
  { path: "/EN/Contact/", expectLocation: "/en/contacto" },
  { path: "/EN/Campaigns/", expectLocation: "/en/campanas" },
];

const results = [];

function pass(name, detail = "") {
  results.push({ ok: true, name, detail });
  console.log(`  OK  ${name}${detail ? ` - ${detail}` : ""}`);
}

function fail(name, detail = "") {
  results.push({ ok: false, name, detail });
  console.log(`  FAIL ${name}${detail ? ` - ${detail}` : ""}`);
}

async function fetchHead(url, opts = {}) {
  const res = await fetch(url, { redirect: "manual", ...opts });
  return res;
}

async function checkNextJsHome() {
  const name = "Home es Next.js (no CM4all)";
  try {
    const res = await fetchHead(`${base}/`);
    const server = res.headers.get("server") || "";
    const powered = res.headers.get("x-powered-by") || "";
    if (server.toLowerCase().includes("cm4all")) {
      fail(name, `Server: ${server} - DNS aún apunta a CM4all`);
      return;
    }
    if (powered.toLowerCase().includes("next")) {
      pass(name, `x-powered-by: ${powered}`);
      return;
    }
    if (res.ok) {
      pass(name, `HTTP ${res.status} (sin header CM4all)`);
      return;
    }
    fail(name, `HTTP ${res.status}`);
  } catch (e) {
    fail(name, e.message);
  }
}

async function checkApexRedirect() {
  const name = "Apex gautex.com → www";
  if (!base.includes("www.gautex.com")) {
    pass(name, "omitido (base no es www.gautex.com)");
    return;
  }
  try {
    const res = await fetchHead("https://gautex.com/");
    const loc = res.headers.get("location") || "";
    if (res.status >= 301 && res.status <= 308 && loc.includes("www.gautex.com")) {
      pass(name, `${res.status} → ${loc}`);
      return;
    }
    fail(name, `status=${res.status} location=${loc || "(vacío)"}`);
  } catch (e) {
    fail(name, e.message);
  }
}

async function checkSsl() {
  const name = "HTTPS responde";
  try {
    const res = await fetchHead(`${base}/`);
    if (res.ok || res.status === 301 || res.status === 302) {
      pass(name);
      return;
    }
    fail(name, `HTTP ${res.status}`);
  } catch (e) {
    fail(name, e.message);
  }
}

async function resolveRedirectChain(startUrl, maxHops = 5) {
  let url = startUrl;
  for (let i = 0; i < maxHops; i++) {
    const res = await fetchHead(url);
    if (res.status < 301 || res.status > 308) {
      return { status: res.status, finalUrl: url };
    }
    const loc = res.headers.get("location");
    if (!loc) {
      return { status: res.status, finalUrl: url };
    }
    url = new URL(loc, url).href;
  }
  return { status: 308, finalUrl: url };
}

async function checkRedirect({ path, expectLocation }) {
  const name = `Redirect ${path}`;
  try {
    const { finalUrl } = await resolveRedirectChain(`${base}${path}`);
    if (finalUrl.includes(expectLocation)) {
      pass(name, `→ ${finalUrl}`);
      return;
    }
    fail(name, `destino final ${finalUrl} (esperaba ${expectLocation})`);
  } catch (e) {
    fail(name, e.message);
  }
}

async function checkSitemap() {
  const name = "sitemap.xml";
  try {
    const res = await fetch(`${base}/sitemap.xml`);
    const text = await res.text();
    if (res.ok && text.includes("<urlset") && text.includes(base)) {
      pass(name);
      return;
    }
    fail(name, `HTTP ${res.status}`);
  } catch (e) {
    fail(name, e.message);
  }
}

async function checkRobots() {
  const name = "robots.txt";
  try {
    const res = await fetch(`${base}/robots.txt`);
    const text = await res.text();
    if (res.ok && text.includes("sitemap")) {
      pass(name);
      return;
    }
    fail(name, `HTTP ${res.status}`);
  } catch (e) {
    fail(name, e.message);
  }
}

async function checkApiReachable() {
  const name = "API contacto rechaza sin origen (esperado 403)";
  try {
    const res = await fetch(`${base}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    if (res.status === 403 || res.status === 400) {
      pass(name, `HTTP ${res.status}`);
      return;
    }
    fail(name, `HTTP ${res.status} (esperaba 403 o 400)`);
  } catch (e) {
    fail(name, e.message);
  }
}

async function main() {
  console.log(`\nVerificación migración - base: ${base}\n`);

  await checkSsl();
  await checkNextJsHome();
  await checkApexRedirect();

  for (const check of REDIRECT_CHECKS) {
    await checkRedirect(check);
  }

  await checkSitemap();
  await checkRobots();
  await checkApiReachable();

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} comprobaciones OK`);

  if (failed.length > 0) {
    console.log("\nFallos:");
    failed.forEach((f) => console.log(`  - ${f.name}: ${f.detail}`));
    process.exit(1);
  }

  console.log("\nMigración verificada correctamente.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
