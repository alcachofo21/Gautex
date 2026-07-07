# ============================================================================
#  Go-live Gautex - configurar variables de producción en Render
# ----------------------------------------------------------------------------
#  Ejecutar el día D, antes o durante el corte DNS. Configura gautex-web
#  (producción) y opcionalmente pagos en staging.
#
#  USO:
#    $env:RENDER_API_KEY = "rnd_..."
#    .\scripts\setup-go-live-render.ps1 `
#        -PaypalClientId "..." -PaypalClientSecret "..." `
#        -StripeSecretKey "sk_live_..." `
#        -StripePublishableKey "pk_live_..." `
#        -StripeWebhookSecret "whsec_..." `
#        -ResendApiKey "re_..." `
#        -CloudinaryCloudName "..." `
#        -CloudinaryUploadPreset "..." `
#        -GaId "G-XXXXXXXXXX"
#
#  Solo pagos (delega en activar-pagos.ps1):
#    .\scripts\setup-go-live-render.ps1 -PaypalClientId "..." -PaypalClientSecret "..."
#
#  Ver guía completa: MIGRACION.md
# ============================================================================

param(
    [string]$PaypalClientId,
    [string]$PaypalClientSecret,
    [string]$PaypalClientIdSandbox,
    [string]$PaypalSecretSandbox,
    [string]$StripeSecretKey,
    [string]$StripePublishableKey,
    [string]$StripeWebhookSecret,
    [string]$ResendApiKey,
    [string]$ResendFrom = "Gautex Web <notificaciones@gautex.com>",
    [string]$ContactEmail = "info@gautex.com",
    [string]$StagingContactEmail = "gautexmedica@gmail.com",
    [string]$CloudinaryCloudName,
    [string]$CloudinaryUploadPreset,
    [string]$GaId,
    [string]$RenderApiKey = $env:RENDER_API_KEY,
    [switch]$SkipStaging
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

if (-not $RenderApiKey) {
    $RenderApiKey = Read-Host "Pega tu RENDER_API_KEY (Render -> Account Settings -> API Keys)"
}
if (-not $RenderApiKey) { Write-Error "Falta RENDER_API_KEY."; exit 1 }

$hasPayments = $PaypalClientId -or $StripeSecretKey
$hasOther = $ResendApiKey -or $CloudinaryCloudName -or $GaId

if (-not $hasPayments -and -not $hasOther) {
    Write-Error "Indica al menos credenciales de pago o variables de email/Cloudinary/GA."
    exit 1
}

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

# Pagos vía activar-pagos.ps1 (prod + staging)
if ($hasPayments) {
    $pagoArgs = @{
        RenderApiKey = $RenderApiKey
    }
    if ($PaypalClientId)     { $pagoArgs.PaypalClientId = $PaypalClientId }
    if ($PaypalClientSecret) { $pagoArgs.PaypalClientSecret = $PaypalClientSecret }
    if ($PaypalClientIdSandbox) { $pagoArgs.PaypalClientIdSandbox = $PaypalClientIdSandbox }
    if ($PaypalSecretSandbox)   { $pagoArgs.PaypalSecretSandbox = $PaypalSecretSandbox }
    if ($StripeSecretKey)         { $pagoArgs.StripeSecretKey = $StripeSecretKey }
    if ($StripePublishableKey)    { $pagoArgs.StripePublishableKey = $StripePublishableKey }
    if ($StripeWebhookSecret)     { $pagoArgs.StripeWebhookSecret = $StripeWebhookSecret }

    Write-Host "Configurando pagos (activar-pagos.ps1)..."
    & "$scriptDir\activar-pagos.ps1" @pagoArgs
}

# Email, Cloudinary, GA en producción
$prod = Get-ServiceId "gautex-web"
Write-Host "PRODUCCIÓN gautex-web ($prod) - email / cloudinary / GA"
Set-Var $prod "NEXT_PUBLIC_SITE_URL" "https://www.gautex.com"
Set-Var $prod "RESEND_API_KEY" $ResendApiKey
Set-Var $prod "RESEND_FROM" $ResendFrom
Set-Var $prod "CONTACT_EMAIL" $ContactEmail
Set-Var $prod "EMAIL_TRANSPORT" "smtp"
Set-Var $prod "CLOUDINARY_CLOUD_NAME" $CloudinaryCloudName
Set-Var $prod "CLOUDINARY_UPLOAD_PRESET" $CloudinaryUploadPreset
Set-Var $prod "NEXT_PUBLIC_GA_ID" $GaId

if ($hasOther) {
    Deploy $prod
}

# Staging: solo email/cloudinary si se pidió (sin tocar pagos si ya corrió activar-pagos)
if (-not $SkipStaging -and $hasOther) {
    $stag = Get-ServiceId "gautex-web-staging"
    Write-Host "STAGING gautex-web-staging ($stag) - email / cloudinary / GA"
    Set-Var $stag "RESEND_API_KEY" $ResendApiKey
    Set-Var $stag "RESEND_FROM" $ResendFrom
    Set-Var $stag "CONTACT_EMAIL" $StagingContactEmail
    Set-Var $stag "EMAIL_TRANSPORT" "resend"
    Set-Var $stag "CLOUDINARY_CLOUD_NAME" $CloudinaryCloudName
    Set-Var $stag "CLOUDINARY_UPLOAD_PRESET" $CloudinaryUploadPreset
    Set-Var $stag "NEXT_PUBLIC_GA_ID" $GaId
    Deploy $stag
}

Write-Host ""
Write-Host "Listo. Tras el redeploy (3-5 min):"
Write-Host "  1. Cambiar DNS en Arsys (ver MIGRACION.md)"
Write-Host "  2. node scripts/verify-migration.mjs"
Write-Host "  3. Probar checkout en https://www.gautex.com/checkout"
