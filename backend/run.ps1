# Script para arrancar el backend usando el Python del venv (PowerShell)
Set-StrictMode -Version Latest
$here = Split-Path -Parent $MyInvocation.MyCommand.Definition
# Ejecutar desde la raíz del proyecto (parent de la carpeta backend)
$projectRoot = Split-Path -Parent $here
Push-Location $projectRoot
if (-Not (Test-Path ".venv\Scripts\python.exe")) {
  Write-Host "No se encontró .venv\Scripts\python.exe. Por favor crea el venv: python -m venv .venv" -ForegroundColor Yellow
  Pop-Location
  exit 1
}
.\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --reload --port 8000
Pop-Location
