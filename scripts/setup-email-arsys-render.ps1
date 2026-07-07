# ============================================================================
#  Configurar correo Arsys (SMTP) en Render - Gautex
# ----------------------------------------------------------------------------
#  Producción: SMTP Arsys (info@gautex.com) - requiere Render Starter ($7/mes)
#  Staging:    notificaciones a gautexmedica@gmail.com (Resend en plan free)
#
#  USO:
#    $env:RENDER_API_KEY = "rnd_..."
#    .\scripts\setup-email-arsys-render.ps1 -SmtpPass "tu_contraseña"
#
#  O con todos los parámetros:
#    .\scripts\setup-email-arsys-render.ps1 `
#        -SmtpUser "info@gautex.com" `
#        -SmtpPass "..." `
#        -ContactEmail "info@gautex.com" `
#        -StagingContactEmail "gautexmedica@gmail.com"
# ============================================================================

param(
    [string]$SmtpHost = "smtp.serviciodecorreo.es",
    [string]$SmtpPort = "465",
    [string]$SmtpUser = "info@gautex.com",
    [string]$SmtpPass,
    [string]$SmtpFrom = "Gautex Medica <info@gautex.com>",
    [string]$ContactEmail = "info@gautex.com",
    [string]$StagingContactEmail = "gautexmedica@gmail.com",
    [string]$RenderApiKey = $env:RENDER_API_KEY,
    [switch]$SkipStaging
)

$ErrorActionPreference = "Stop"

if (-not $SmtpPass) {
    $SmtpPass = Read-Host "Contraseña SMTP de $SmtpUser" -AsSecureString
    $SmtpPass = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SmtpPass)
    )
}
if (-not $SmtpPass) { Write-Error "Falta contraseña SMTP."; exit 1 }

if (-not $RenderApiKey) {
    $RenderApiKey = Read-Host "Pega tu RENDER_API_KEY (Render -> Account Settings -> API Keys)"
}
if (-not $RenderApiKey) { Write-Error "Falta RENDER_API_KEY."; exit 1 }

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

function Configure-ProductionEmail($serviceName) {
    $id = Get-ServiceId $serviceName
    Write-Host "$serviceName ($id) - SMTP producción"
    Set-Var $id "EMAIL_TRANSPORT" "smtp"
    Set-Var $id "SMTP_HOST" $SmtpHost
    Set-Var $id "SMTP_PORT" $SmtpPort
    Set-Var $id "SMTP_USER" $SmtpUser
    Set-Var $id "SMTP_PASS" $SmtpPass
    Set-Var $id "SMTP_FROM" $SmtpFrom
    Set-Var $id "CONTACT_EMAIL" $ContactEmail
    Deploy $id
}

function Configure-StagingEmail($serviceName) {
    $id = Get-ServiceId $serviceName
    Write-Host "$serviceName ($id) - pruebas a $StagingContactEmail"
    Set-Var $id "EMAIL_TRANSPORT" "resend"
    Set-Var $id "CONTACT_EMAIL" $StagingContactEmail
    Set-Var $id "SMTP_HOST" $SmtpHost
    Set-Var $id "SMTP_PORT" $SmtpPort
    Set-Var $id "SMTP_USER" $SmtpUser
    Set-Var $id "SMTP_PASS" $SmtpPass
    Set-Var $id "SMTP_FROM" $SmtpFrom
    Deploy $id
}

Write-Host "`nConfigurando correo en Render...`n"
Configure-ProductionEmail "gautex-web"

if (-not $SkipStaging) {
    Configure-StagingEmail "gautex-web-staging"
}

Write-Host "`nListo. Producción envía vía SMTP a $ContactEmail."
Write-Host "Staging envía notificaciones a $StagingContactEmail (Resend en plan free).`n"
