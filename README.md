# Cónicas Electromagnéticas — Simulador

Proyecto: aplicación para modelar cónicas (parábola, elipse e hipérbola) y simular reflexiones electromagnéticas.

Estructura:
- `backend/`: servidor Python FastAPI con motor matemático (NumPy/SymPy)
- `frontend/`: aplicación React + Tailwind para visualización 2D/3D
- `docs/`: manual de usuario y documentación técnica
- `assets/`: capturas simuladas y recursos

Siguientes pasos rápidos (desarrollo):

1. Backend:
```powershell
# Desde la raíz del proyecto (recomendado):
cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --reload --port 8000

# Alternativa — activar el entorno (puede requerir cambiar ExecutionPolicy):
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
# .\.venv\Scripts\Activate.ps1
# uvicorn backend.app.main:app --reload --port 8000
```

2. Frontend:
```powershell
cd frontend
npm install
npm run dev
```

Contacto: documentación en `docs/`.
