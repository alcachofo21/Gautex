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
| `STRIPE_SECRET_KEY` | Opcional | Solo si activas pagos Stripe |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Opcional | Clave pública Stripe |

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
