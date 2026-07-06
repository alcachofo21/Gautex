# Activar los pagos (PayPal + Stripe)

El código ya está listo y desplegado. El checkout muestra automáticamente los
métodos de pago que tengan credenciales en Render. Solo falta **PayPal**.

---

## Lo único que tienes que hacer: obtener 2 datos de PayPal

1. Entra en <https://developer.paypal.com/dashboard/applications/live> con tu
   cuenta PayPal de empresa.
2. Pulsa **Create App**, ponle un nombre (p. ej. `Gautex Web`) y créala.
3. Copia estos dos valores:
   - **Client ID**
   - **Secret** (pulsa "Show" para verlo)

> Para pruebas sin cobrar de verdad, usa la pestaña **Sandbox** en lugar de Live.

---

## Activarlo (elige UNA opción)

### Opción A — Me pasas las credenciales y lo hago yo
Pégame aquí el **Client ID** y el **Secret** y yo los configuro en Render
(producción en modo `live`, staging en `sandbox`) y redespliego. No tienes que
hacer nada más.

### Opción B — Lo haces tú con un solo comando
En PowerShell, desde la carpeta del proyecto:

```powershell
.\scripts\activar-pagos.ps1 -PaypalClientId "TU_CLIENT_ID" -PaypalClientSecret "TU_SECRET"
```

El script te pedirá la **API key de Render** (Panel Render → Account Settings →
API Keys), configura producción y staging y lanza el redeploy. En 3–5 minutos el
botón de PayPal aparecerá junto al de tarjeta.

### Opción C — A mano en Render
En <https://dashboard.render.com> → servicio `gautex-web` → **Environment**,
añade:

| Clave | Valor |
|-------|-------|
| `PAYPAL_CLIENT_ID` | tu Client ID |
| `PAYPAL_CLIENT_SECRET` | tu Secret |
| `PAYPAL_MODE` | `live` |

Repite en `gautex-web-staging` pero con `PAYPAL_MODE` = `sandbox`. Guarda y deja
que redespliegue.

---

## Nota sobre Stripe

Stripe ya está activo con claves de **prueba** (`sk_test_…`). Para **cobrar de
verdad** con tarjeta, sustituye por las claves **live** desde
<https://dashboard.stripe.com/apikeys>:

```powershell
.\scripts\activar-pagos.ps1 `
  -PaypalClientId "..." -PaypalClientSecret "..." `
  -StripeSecretKey "sk_live_..." -StripePublishableKey "pk_live_..."
```

O añádelas a mano en Render (`STRIPE_SECRET_KEY`,
`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`).

---

## Comprobar que funciona

- Producción: <https://gautex-web.onrender.com/checkout>
- Staging: <https://gautex-web-staging.onrender.com/checkout>

Añade un producto al carrito y, en el checkout, verás el selector con **Tarjeta
(Stripe)** y **PayPal**.
