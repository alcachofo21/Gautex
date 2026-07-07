# Despliegue en Render

> **Migración a gautex.com:** ver [MIGRACION.md](MIGRACION.md) para el runbook completo (preparación + go-live con DNS Arsys). El corte DNS se hace **solo cuando la web esté terminada**.

## 1. Subir código a GitHub

Desde GitHub Desktop o terminal:

```bash
git add .
git commit -m "Rediseño completo Gautex Medica - escaparate e-commerce"
git push origin main
```

Repositorio: https://github.com/alcachofo21/Gautex

## 2. Crear servicio en Render

### Opción A — Dashboard (recomendado)

1. Ir a https://dashboard.render.com
2. **New +** → **Web Service**
3. Conectar repo `alcachofo21/Gautex`
4. Configuración:
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free
5. Variables de entorno:
   - `NODE_ENV` = `production`
   - `NEXT_PUBLIC_SITE_URL` = `https://TU-SERVICIO.onrender.com`
6. Deploy

### Opción B — Blueprint

Render detectará `render.yaml` automáticamente al importar el repo.

### Opción C — API

```powershell
$env:RENDER_API_KEY = "tu_token_aqui"
.\scripts\deploy-render.ps1
```

**Importante:** Rota tu API key de Render si la compartiste en chat.

## 3. Variables de entorno en producción

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Sí | URL pública del servicio |
| `RESEND_API_KEY` | Recomendada | Envío de emails (contacto, presupuesto) |
| `RESEND_FROM` | Recomendada | Remitente verificado, ej. `Gautex <notificaciones@gautex.com>` |
| `CONTACT_EMAIL` | Recomendada | Destino, default `info@gautex.com` |
| `STRIPE_SECRET_KEY` | Pagos online | Clave secreta (`sk_test_…` o `sk_live_…`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Pagos online | Clave publicable (`pk_test_…` o `pk_live_…`) |
| `STRIPE_WEBHOOK_SECRET` | Recomendada | Firma webhook (`whsec_…`) para confirmar pagos |
| `NEXT_PUBLIC_GA_ID` | Opcional | Google Analytics 4 — `G-V86Q4399E2` (ya en `render.yaml`) |
| `NEXT_PUBLIC_GA_DEBUG` | Staging | `true` en staging para depurar en consola del navegador |
| `CLOUDINARY_CLOUD_NAME` | Producción | Obligatorio para uploads de campañas |
| `CLOUDINARY_UPLOAD_PRESET` | Producción | Preset unsigned de Cloudinary |
| `PAYPAL_CLIENT_ID` | Pagos online | Client ID de PayPal Developer |
| `PAYPAL_CLIENT_SECRET` | Pagos online | Secret de PayPal |
| `PAYPAL_MODE` | Pagos online | `sandbox` o `live` |

## 3b. Stripe Checkout (pagos instantáneos)

La tienda usa **Stripe Checkout** (redirección segura). Solo productos con `price` en `content/products.json` son pagables online; el resto sigue como presupuesto B2B.

### Modo prueba (test)

1. En [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) copia las claves de prueba.
2. En **Render** → servicio `gautex-web` o `gautex-web-staging` → **Environment**:
   - `STRIPE_SECRET_KEY` = `sk_test_…`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_test_…`
   - `STRIPE_PAYPAL_ENABLED` = `false` (hasta activar PayPal en Dashboard)
3. **Redeploy** tras guardar variables.
4. Prueba en `/checkout` con tarjeta `4242 4242 4242 4242`, fecha futura y CVC cualquiera.

### Webhook (email de confirmación)

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**
2. URL: `https://TU-DOMINIO/api/stripe/webhook`
3. Evento: `checkout.session.completed`
4. Signing secret → `STRIPE_WEBHOOK_SECRET` en Render.

### Local

```bash
# Copia .env.example → .env.local y rellena STRIPE_* de test
npm run dev
```

### Producción (live)

Sustituye claves `test` por **live** y configura el webhook en modo live.

## 4. Apuntar gautex.com

**No ejecutar hasta el go-live.** Detalle completo en [MIGRACION.md](MIGRACION.md).

1. En Render → Settings → Custom Domains → añadir `www.gautex.com` y `gautex.com` (redirect to www)
2. En DNS Arsys: CNAME `www` → `gautex-web.onrender.com`
3. Apex `gautex.com` → registro A/ALIAS que indique Render
4. `NEXT_PUBLIC_SITE_URL` = `https://www.gautex.com` (ya en `render.yaml`)
5. Tras el corte: `node scripts/verify-migration.mjs`

## 5. Verificar

- URL pública: `https://gautex-web.onrender.com` (o el nombre que elijas)
- Redirects legacy: `/ES/Productos/` → `/productos`
- Sitio inglés: `/en`
- Primer arranque free tier: ~30s cold start
- Probar en móvil y desktop

## Desarrollo local

```bash
npm install
npm run dev
```

Build producción: `npm run build` (verificado OK)

## 6. Seguridad

### Headers HTTP (`src/middleware.ts`)

- Content-Security-Policy, X-Frame-Options, X-Content-Type-Options
- Referrer-Policy, Permissions-Policy
- Strict-Transport-Security (solo producción)

### APIs públicas

- Validación Zod en contacto, presupuesto y checkout
- Rate limiting en memoria por IP (contacto: 10/min, upload/checkout: 5/min)
- Verificación de origen (`Origin`/`Referer`) en POST
- Límite de body JSON: 100 KB
- Honeypot anti-spam en formularios
- HTML escapado en emails (anti-XSS)
- Uploads: magic bytes (`file-type`), máx. 5 MB, solo PNG/JPG/PDF

### Limitaciones conocidas

- **Rate limit en memoria:** no se sincroniza entre instancias Render ni workers serverless. Suficiente para tráfico moderado; para alto volumen considerar Redis/Upstash.
- **Cloudinary obligatorio en producción** para subidas de campañas (`CLOUDINARY_*`).

### Tests de seguridad

```bash
npm run test:coverage   # incluye tests de validación, upload, api-guard, rate-limit
```
