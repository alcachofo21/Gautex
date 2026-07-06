# Push Stripe env vars from .env.local to Render (requires RENDER_API_KEY)
# Usage: $env:RENDER_API_KEY = "rnd_..."; .\scripts\setup-stripe-render.ps1 -ServiceName gautex-web-staging

param(
    [string]$ServiceName = "gautex-web-staging"
)

$RENDER_API_KEY = $env:RENDER_API_KEY
if (-not $RENDER_API_KEY) {
    Write-Error "Set RENDER_API_KEY first (Render Dashboard → Account Settings → API Keys)"
    exit 1
}

$envFile = Join-Path $PSScriptRoot ".." ".env.local"
if (-not (Test-Path $envFile)) {
    Write-Error ".env.local not found. Copy .env.example and add your Stripe test keys."
    exit 1
}

$vars = @{}
Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([^#=]+)=(.*)$') {
        $vars[$matches[1].Trim()] = $matches[2].Trim()
    }
}

$stripeKeys = @("STRIPE_SECRET_KEY", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "STRIPE_WEBHOOK_SECRET", "STRIPE_PAYPAL_ENABLED")
$headers = @{
    "Authorization" = "Bearer $RENDER_API_KEY"
    "Content-Type"  = "application/json"
}

$services = Invoke-RestMethod -Uri "https://api.render.com/v1/services?limit=50" -Headers $headers
$match = $services | Where-Object { $_.service.name -eq $ServiceName } | Select-Object -First 1
if (-not $match) {
    Write-Error "Service not found: $ServiceName"
    exit 1
}

$serviceId = $match.service.id
Write-Host "Updating $ServiceName ($serviceId)..."

foreach ($key in $stripeKeys) {
    if (-not $vars[$key]) { continue }
    $body = @{ envVar = @{ key = $key; value = $vars[$key] } } | ConvertTo-Json -Depth 3
    Invoke-RestMethod -Method PUT -Uri "https://api.render.com/v1/services/$serviceId/env-vars/$key" -Headers $headers -Body $body | Out-Null
    Write-Host "  OK $key"
}

$deploy = Invoke-RestMethod -Method POST -Uri "https://api.render.com/v1/services/$serviceId/deploys" -Headers $headers -Body (@{ clearCache = "do_not_clear" } | ConvertTo-Json)
Write-Host "Deploy triggered: $($deploy.id)"
