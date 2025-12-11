@echo off
REM Script para arrancar el backend usando el python del venv (cmd)
SET HERE=%~dp0
REM Ejecutar desde la raíz del proyecto (parent de la carpeta backend)
cd /d "%HERE%.."
IF NOT EXIST ".venv\Scripts\python.exe" (
  echo No se encontro .venv\Scripts\python.exe. Por favor crea el venv: python -m venv .venv
  exit /b 1
)
.\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --reload --port 8000
