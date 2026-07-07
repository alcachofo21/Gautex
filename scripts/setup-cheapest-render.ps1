# ============================================================================
#  Configuración económica Render — staging (test) vs producción (live)
# ----------------------------------------------------------------------------
#  Estrategia $0/mes en Render Free:
#    - Email: Resend API (HTTPS) — NO SMTP Arsys (bloqueado en free)
#    - Pagos staging: Stripe test + PayPal sandbox
#    - Pagos prod: claves live (sin usar hasta go-live DNS)
#    - Cloudinary: plan free (misma cuenta en ambos)
#
#  USO:
#    $env:RENDER_API_KEY = "rnd_..."
#    .\scripts\setup-cheapest-render.ps1 `
#        -ResendApiKey "re_..." `
#        -CloudinaryCloudName "..." `
#        -CloudinaryUploadPreset "gautex_campaigns"
# ============================================================================

param(
    [string]$RenderApiKey = $env:RENDER_API_KEY,
    [string]$ResendApiKey,
    [string]$ResendFrom = "Gautex Medica <onboarding@resend.dev>",
    [string]$ContactEmail = "info@gautex.com",
    [string]$CloudinaryCloudName,
    [string]$CloudinaryUploadPreset,
    [string]$StagingUrl = "https://gautex-web-staging-dcib.onrender.com",
    [string]$ProdUrl = "https://gautex-web-zzbo.onrender.com",
    [string]$CanonicalProdUrl = "https://www.gautex.com"
)

$ErrorActionPreference = "Stop"

if (-not $RenderApiKey) {
    $RenderApiKey = Read-Host "RENDER_API_KEY (Render -> Account Settings -> API Keys)"
}
if (-not $RenderApiKey) { Write-Error "Falta RENDER_API_KEY."; exit 1 }

$headers = @{
    "Authorization" = "Bearer $RenderApiKey"
    "Content-Type"  = "application/json"
    "Accept"        = "application/json"
}

function Set-Var($serviceId, $key, $value) {
    if ($null -eq $value -or $value -eq "") { return }
    $body = @{ value = $value } | ConvertTo-Json
    Invoke-RestMethod -Method PUT -Uri "https://api.render.com/v1/services/$serviceId/env-vars/$key" -Headers $headers -Body $body | Out-Null
    Write-Host "    OK $key"
}

function Get-ServiceId($name) {
    $services = Invoke-RestMethod -Uri "https://api.render.com/v1/services?limit=100" -Headers $headers
    $m = $services | Where-Object { $_.service.name -eq $name } | Select-Object -First 1
    if (-not $m) { Write-Error "Servicio no encontrado: $name"; exit 1 }
    return $m.service.id
}

function Deploy($serviceId) {
    $d = Invoke-RestMethod -Method POST -Uri "https://api.render.com/v1/services/$serviceId/deploys" -Headers $headers -Body (@{ clearCache = "clear" } | ConvertTo-Json)
    Write-Host "    Deploy: $($d.id)"
}

function Configure-Common($serviceId) {
    Set-Var $serviceId "NODE_ENV" "production"
    Set-Var $serviceId "NPM_CONFIG_PRODUCTION" "false"
    Set-Var $serviceId "CONTACT_EMAIL" $ContactEmail
    Set-Var $serviceId "NEXT_PUBLIC_GA_ID" "G-V86Q4399E2"
    Set-Var $serviceId "EMAIL_TRANSPORT" "resend"
    Set-Var $serviceId "RESEND_FROM" $ResendFrom
    if ($ResendApiKey) { Set-Var $serviceId "RESEND_API_KEY" $ResendApiKey }
    if ($CloudinaryCloudName) { Set-Var $serviceId "CLOUDINARY_CLOUD_NAME" $CloudinaryCloudName }
    if ($CloudinaryUploadPreset) { Set-Var $serviceId "CLOUDINARY_UPLOAD_PRESET" $CloudinaryUploadPreset }
}

Write-Host "`n=== STAGING (test) ==="
$stagingId = Get-ServiceId "gautex-web-staging"
Configure-Common $stagingId
Set-Var $stagingId "NEXT_PUBLIC_SITE_URL" $StagingUrl
Set-Var $stagingId "NEXT_PUBLIC_GA_DEBUG" "true"
Set-Var $stagingId "PAYPAL_MODE" "sandbox"
Set-Var $stagingId "STRIPE_PAYPAL_ENABLED" "false"
Deploy $stagingId

Write-Host "`n=== PRODUCCIÓN (live vars, DNS pendiente) ==="
$prodId = Get-ServiceId "gautex-web"
Configure-Common $prodId
Set-Var $prodId "NEXT_PUBLIC_SITE_URL" $CanonicalProdUrl
Set-Var $prodId "PAYPAL_MODE" "live"
Set-Var $prodId "STRIPE_PAYPAL_ENABLED" "false"
# SMTP Arsys listo para cuando subas a Starter ($7/mes); hasta entonces Resend
Set-Var $prodId "SMTP_HOST" "smtp.serviciodecorreo.es"
Set-Var $prodId "SMTP_PORT" "465"
Set-Var $prodId "SMTP_USER" "info@gautex.com"
Set-Var $prodId "SMTP_FROM" "Gautex Medica <info@gautex.com>"
Deploy $prodId

Write-Host "`nListo. Webhooks Stripe (crear en dashboard test/live):"
Write-Host "  Staging: $StagingUrl/api/stripe/webhook"
Write-Host "  Prod:    $CanonicalProdUrl/api/stripe/webhook (o $ProdUrl hasta DNS)"
Write-Host ""
