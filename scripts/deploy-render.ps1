# Deploy Gautex to Render (requires GitHub connected in Render Dashboard)
# Usage: $env:RENDER_API_KEY = "rnd_..."; .\scripts\deploy-render.ps1

param(
    [string]$ServiceName = "gautex-web",
    [string]$Repo = "https://github.com/alcachofo21/Gautex",
    [string]$Branch = "main",
    [string]$SiteUrl = "https://gautex-web.onrender.com"
)

$RENDER_API_KEY = $env:RENDER_API_KEY
if (-not $RENDER_API_KEY) {
    Write-Error "Set RENDER_API_KEY environment variable first"
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $RENDER_API_KEY"
    "Content-Type"  = "application/json"
    "Accept"        = "application/json"
}

$owners = Invoke-RestMethod -Uri "https://api.render.com/v1/owners" -Headers $headers
$ownerId = $owners[0].owner.id
Write-Host "Owner: $($owners[0].owner.name) ($ownerId)"

$existing = Invoke-RestMethod -Uri "https://api.render.com/v1/services?limit=50" -Headers $headers
$match = $existing | Where-Object { $_.service.name -eq $ServiceName } | Select-Object -First 1

if ($match) {
    $serviceId = $match.service.id
    Write-Host "Service exists: $serviceId"
    $deploy = Invoke-RestMethod -Method POST -Uri "https://api.render.com/v1/services/$serviceId/deploys" -Headers $headers -Body (@{ clearCache = "do_not_clear" } | ConvertTo-Json)
    Write-Host "Deploy triggered: $($deploy.id)"
    Write-Host "URL: $($match.service.serviceDetails.url)"
    exit 0
}

$body = @{
    type       = "web_service"
    name       = $ServiceName
    ownerId    = $ownerId
    repo       = $Repo
    autoDeploy = "yes"
    branch     = $Branch
    serviceDetails = @{
        runtime          = "node"
        plan             = "free"
        region           = "frankfurt"
        healthCheckPath  = "/"
        envSpecificDetails = @{
            buildCommand = "NODE_ENV=development npm ci && npm run build"
            startCommand = "npm start"
        }
        envVars          = @(
            @{ key = "NODE_ENV"; value = "production" }
            @{ key = "NPM_CONFIG_PRODUCTION"; value = "false" }
            @{ key = "NEXT_PUBLIC_SITE_URL"; value = $SiteUrl }
        )
    }
} | ConvertTo-Json -Depth 6

try {
    $result = Invoke-RestMethod -Method POST -Uri "https://api.render.com/v1/services" -Headers $headers -Body $body
    Write-Host "Service created!"
    Write-Host "URL: $($result.service.serviceDetails.url)"
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
    if ($_.ErrorDetails.Message) { Write-Host $_.ErrorDetails.Message }
    Write-Host ""
    Write-Host "If repo is private, connect GitHub first:"
    Write-Host "  1. https://dashboard.render.com/web/new"
    Write-Host "  2. Sign in with GitHub"
    Write-Host "  3. https://github.com/apps/render/installations/new -> grant access to alcachofo21/Gautex"
    Write-Host "  4. Re-run this script"
    exit 1
}
