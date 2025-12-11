Backend FastAPI para el proyecto "Cónicas Electromagnéticas"

Instrucciones rápidas:

1. Crear y activar un entorno virtual (Windows PowerShell):

```powershell
# Desde la raíz del proyecto:
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

2. Ejecutar el servidor (desarrollo):

```powershell
# Ejecutar el servidor sin activar el script (recomendado):
.\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --reload --port 8000

# O bien, si prefieres activar el entorno (puede requerir cambiar ExecutionPolicy):
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
# .\.venv\Scripts\Activate.ps1
# uvicorn backend.app.main:app --reload --port 8000
```

Endpoints principales:
- POST `/api/conic` -> body: {"type":"parabola","params":{...}}
- POST `/api/simulate` -> body: {"type":"ellipse","params":{...}}
- GET `/api/export?type=parabola` -> PNG de muestra

Notas:
- Las funciones matemáticas están en `backend/app/conics.py`.
- Este backend está diseñado para ser sencillo y extensible; puede añadirse rendimiento numérico o GPU si se requiere.
