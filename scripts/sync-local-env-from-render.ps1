# Pull Stripe (and optional) env vars from Render into .env.local for local dev.
# Usage:
#   $env:RENDER_API_KEY = "rnd_..."
#   .\scripts\sync-local-env-from-render.ps1
#   npm run dev

param(
    [string]$ServiceName = "gautex-web-staging",
    [string]$RenderApiKey = $env:RENDER_API_KEY
)

$ErrorActionPreference = "Stop"

if (-not $RenderApiKey) {
    Write-Error "Set RENDER_API_KEY (Render -> Account Settings -> API Keys)."
    exit 1
}

$headers = @{
    Authorization = "Bearer $RenderApiKey"
    Accept        = "application/json"
}

$services = Invoke-RestMethod -Uri "https://api.render.com/v1/services?limit=100" -Headers $headers
$match = $services | Where-Object { $_.service.name -eq $ServiceName } | Select-Object -First 1
if (-not $match) {
    Write-Error "Service not found: $ServiceName"
    exit 1
}

$serviceId = $match.service.id
$envs = Invoke-RestMethod -Uri "https://api.render.com/v1/services/$serviceId/env-vars?limit=100" -Headers $headers
$map = @{}
foreach ($e in $envs) {
    $map[$e.envVar.key] = $e.envVar.value
}

$pullKeys = @(
    "STRIPE_SECRET_KEY",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "PAYPAL_CLIENT_ID",
    "PAYPAL_CLIENT_SECRET",
    "PAYPAL_MODE"
)

$outFile = Join-Path $PSScriptRoot ".." ".env.local"
$existing = @{}
if (Test-Path $outFile) {
    Get-Content $outFile | ForEach-Object {
        if ($_ -match '^\s*([^#=]+)=(.*)$') {
            $existing[$matches[1].Trim()] = $matches[2]
        }
    }
}

$existing["NEXT_PUBLIC_SITE_URL"] = "http://localhost:3000"
foreach ($key in $pullKeys) {
    if ($map[$key]) {
        $existing[$key] = $map[$key]
    }
}

$lines = $existing.GetEnumerator() | Sort-Object Name | ForEach-Object { "$($_.Key)=$($_.Value)" }
Set-Content -Path $outFile -Value $lines -Encoding UTF8

Write-Host "Updated $outFile from $ServiceName ($serviceId)."
Write-Host "Restart dev server: npm run dev"
