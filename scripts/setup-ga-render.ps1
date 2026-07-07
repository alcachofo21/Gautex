# ============================================================================
#  Activar Google Analytics 4 en Render (staging + producción)
# ----------------------------------------------------------------------------
#  La web nueva vive en *.onrender.com hasta el corte DNS a www.gautex.com.
#  El mismo ID GA4 (G-V86Q4399E2) funciona en ambos entornos; filtra por
#  hostname en GA4 → Informes en tiempo real.
#
#  USO:
#    $env:RENDER_API_KEY = "rnd_..."
#    .\scripts\setup-ga-render.ps1
#
#  Tras el script, redeploy automático (~3-5 min). Prueba en staging:
#    https://gautex-web-staging.onrender.com → aceptar cookies → GA4 tiempo real
# ============================================================================

param(
    [string]$GaId = "G-V86Q4399E2",
    [string]$RenderApiKey = $env:RENDER_API_KEY,
    [switch]$SkipDeploy
)

$ErrorActionPreference = "Stop"

if (-not $RenderApiKey) {
    $RenderApiKey = Read-Host "Pega tu RENDER_API_KEY (Render -> Account Settings -> API Keys)"
}
if (-not $RenderApiKey) { Write-Error "Falta RENDER_API_KEY."; exit 1 }
if (-not $GaId) { Write-Error "Falta GaId."; exit 1 }

$headers = @{
    "Authorization" = "Bearer $RenderApiKey"
    "Content-Type"  = "application/json"
    "Accept"        = "application/json"
}

function Set-Var($serviceId, $key, $value) {
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

foreach ($svc in @("gautex-web", "gautex-web-staging")) {
    $id = Get-ServiceId $svc
    Write-Host "$svc ($id)"
    Set-Var $id "NEXT_PUBLIC_GA_ID" $GaId
    if ($svc -eq "gautex-web-staging") {
        Set-Var $id "NEXT_PUBLIC_GA_DEBUG" "true"
    }
    if (-not $SkipDeploy) {
        Deploy $id
    }
}

Write-Host ""
Write-Host "Listo. ID configurado: $GaId"
Write-Host "  Staging:  https://gautex-web-staging.onrender.com"
Write-Host "  Prod URL: https://gautex-web.onrender.com (DNS www.gautex.com = día del go-live)"
Write-Host "  GA4:      https://analytics.google.com → Informes en tiempo real"
