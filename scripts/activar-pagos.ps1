# ============================================================================
#  Activar pagos en Render (Gautex) — PayPal y/o Stripe live
# ----------------------------------------------------------------------------
#  Configura las credenciales en PRODUCCIÓN (gautex-web) y STAGING
#  (gautex-web-staging) y redespliega ambos servicios automáticamente.
#
#  USO MÍNIMO (solo PayPal):
#    .\scripts\activar-pagos.ps1 `
#        -PaypalClientId     "TU_CLIENT_ID_LIVE" `
#        -PaypalClientSecret "TU_SECRET_LIVE"
#
#  Con credenciales sandbox distintas para staging (opcional):
#    .\scripts\activar-pagos.ps1 `
#        -PaypalClientId        "CLIENT_ID_LIVE" `
#        -PaypalClientSecret    "SECRET_LIVE" `
#        -PaypalClientIdSandbox "CLIENT_ID_SANDBOX" `
#        -PaypalSecretSandbox   "SECRET_SANDBOX"
#
#  Añadir también claves Stripe live (opcional):
#    ... -StripeSecretKey "sk_live_..." -StripePublishableKey "pk_live_..."
#
#  Requiere la API key de Render. Si no la pones con -RenderApiKey, el script
#  la pedirá. (Panel Render → Account Settings → API Keys)
# ============================================================================

param(
    [string]$PaypalClientId,
    [string]$PaypalClientSecret,
    [string]$PaypalClientIdSandbox,
    [string]$PaypalSecretSandbox,
    [string]$StripeSecretKey,
    [string]$StripePublishableKey,
    [string]$StripeWebhookSecret,
    [string]$RenderApiKey = $env:RENDER_API_KEY
)

$ErrorActionPreference = "Stop"

if (-not $RenderApiKey) {
    $RenderApiKey = Read-Host "Pega tu RENDER_API_KEY (Render -> Account Settings -> API Keys)"
}
if (-not $RenderApiKey) { Write-Error "Falta RENDER_API_KEY."; exit 1 }

if (-not $PaypalClientId -and -not $StripeSecretKey) {
    Write-Error "Debes indicar al menos las credenciales de PayPal (-PaypalClientId / -PaypalClientSecret)."
    exit 1
}

# Si no se dan credenciales sandbox propias, se reutilizan las live en staging.
if (-not $PaypalClientIdSandbox) { $PaypalClientIdSandbox = $PaypalClientId }
if (-not $PaypalSecretSandbox)   { $PaypalSecretSandbox   = $PaypalClientSecret }

$headers = @{
    "Authorization" = "Bearer $RenderApiKey"
    "Content-Type"  = "application/json"
    "Accept"        = "application/json"
}

function Set-Var($serviceId, $key, $value) {
    if (-not $value) { return }
    $body = @{ value = $value } | ConvertTo-Json
    Invoke-RestMethod -Method PUT -Uri "https://api.render.com/v1/services/$serviceId/env-vars/$key" -Headers $headers -Body $body | Out-Null
    Write-Host "    OK $key"
}

function Get-ServiceId($name) {
    $services = Invoke-RestMethod -Uri "https://api.render.com/v1/services?limit=100" -Headers $headers
    $m = $services | Where-Object { $_.service.name -eq $name } | Select-Object -First 1
    if (-not $m) { Write-Error "Servicio no encontrado en Render: $name"; exit 1 }
    return $m.service.id
}

function Deploy($serviceId) {
    $d = Invoke-RestMethod -Method POST -Uri "https://api.render.com/v1/services/$serviceId/deploys" -Headers $headers -Body (@{ clearCache = "clear" } | ConvertTo-Json)
    Write-Host "    Deploy lanzado: $($d.id)"
}

# ---------------- PRODUCCIÓN (gautex-web) — PayPal en modo live ----------------
$prod = Get-ServiceId "gautex-web"
Write-Host "PRODUCCIÓN gautex-web ($prod)"
Set-Var $prod "PAYPAL_CLIENT_ID"     $PaypalClientId
Set-Var $prod "PAYPAL_CLIENT_SECRET" $PaypalClientSecret
if ($PaypalClientId) { Set-Var $prod "PAYPAL_MODE" "live" }
Set-Var $prod "STRIPE_SECRET_KEY"              $StripeSecretKey
Set-Var $prod "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" $StripePublishableKey
Set-Var $prod "STRIPE_WEBHOOK_SECRET"          $StripeWebhookSecret
Deploy $prod

# ---------------- STAGING (gautex-web-staging) — PayPal en sandbox ------------
$stag = Get-ServiceId "gautex-web-staging"
Write-Host "STAGING gautex-web-staging ($stag)"
Set-Var $stag "PAYPAL_CLIENT_ID"     $PaypalClientIdSandbox
Set-Var $stag "PAYPAL_CLIENT_SECRET" $PaypalSecretSandbox
if ($PaypalClientIdSandbox) { Set-Var $stag "PAYPAL_MODE" "sandbox" }
Deploy $stag

Write-Host ""
Write-Host "Listo. Espera 3-5 min al redeploy y prueba el checkout:"
Write-Host "  Producción: https://gautex-web-zzbo.onrender.com/checkout"
Write-Host "  Staging:    https://gautex-web-staging-dcib.onrender.com/checkout"
