# Deploy Gautex to Render
# Prerequisites: git push to GitHub, RENDER_API_KEY env var set

$RENDER_API_KEY = $env:RENDER_API_KEY
if (-not $RENDER_API_KEY) {
    Write-Error "Set RENDER_API_KEY environment variable first"
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $RENDER_API_KEY"
    "Content-Type"  = "application/json"
}

# Get owner ID
$owners = Invoke-RestMethod -Uri "https://api.render.com/v1/owners" -Headers $headers
$ownerId = $owners[0].owner.id
Write-Host "Owner ID: $ownerId"

$body = @{
    type         = "web_service"
    name         = "gautex-web"
    repo         = "https://github.com/alcachofo21/Gautex"
    branch       = "main"
    runtime      = "node"
    buildCommand = "npm install && npm run build"
    startCommand = "npm start"
    plan         = "free"
    envVars      = @(
        @{ key = "NODE_ENV"; value = "production" }
        @{ key = "NEXT_PUBLIC_SITE_URL"; value = "https://gautex-web.onrender.com" }
    )
} | ConvertTo-Json -Depth 5

try {
    $service = Invoke-RestMethod -Method POST -Uri "https://api.render.com/v1/services" -Headers $headers -Body (@{
        ownerId = $ownerId
        repo    = "https://github.com/alcachofo21/Gautex"
        name    = "gautex-web"
        type    = "web_service"
    } | ConvertTo-Json)
    Write-Host "Service created: $($service.service.serviceDetails.url)"
} catch {
    Write-Host "Service may already exist. Check https://dashboard.render.com"
    Write-Host $_.Exception.Message
}
