# Despliegue en Render

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
| `STRIPE_PAYPAL_ENABLED` | Opcional | `true` solo si activaste PayPal en Stripe Dashboard |

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

1. En Render → Settings → Custom Domains → añadir `gautex.com` y `www.gautex.com`
2. En tu DNS (Arsys/registrador), crear CNAME `www` → tu servicio `.onrender.com`
3. Para apex `gautex.com`, usar registro A/ALIAS que indique Render
4. Actualizar `NEXT_PUBLIC_SITE_URL=https://gautex.com` y redeploy

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
