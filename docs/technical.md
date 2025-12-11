# Documentación técnica

Arquitectura:
- Backend: FastAPI microservicio que expone endpoints REST para generación de puntos y simulaciones. Las funciones matemáticas están en `backend/app/conics.py`.
- Frontend: React + Tailwind con componentes separados (`Sidebar`, `Canvas2D`, `Viewer3D`, `MathPanel`).
- Comunicación: JSON sobre HTTP. El backend devuelve listas de puntos y trayectorias para dibujar en el cliente.

Funciones matemáticas:
- `parabola_points(p, vertex, axis_angle, samples)`: genera puntos paramétricos de la parábola.
- `ellipse_points(a,b,center,axis_angle,samples)`: puntos de la elipse.
- `hyperbola_points(a,b,center,axis_angle,samples)`: puntos de la hipérbola.
- `simulate_*_rays`: funciones que generan trayectorias de rayos usando aproximaciones sobre muestras discretas y la ley de reflexión.

Extensiones futuras:
- Añadir cálculo exacto de intersección rayo-cónica (resolución algebraica con SymPy) para mayor precisión.
- Añadir WebGL/Three.js para visualización 3D y animación eficiente (instanciación de muchos rayos con BufferGeometry).
- Optimizar simulaciones con numba o C/CPP si se requiere alto rendimiento.

API endpoints:
- POST `/api/conic` -> {"type": "parabola"|"ellipse"|"hyperbola", "params": {...}}
- POST `/api/simulate` -> igual que /api/conic pero devuelve "rays" y auxiliares
- GET `/api/export?type=...` -> PNG

