# Manual de usuario — Simulador de Cónicas Electromagnéticas

Visión general:
La aplicación permite visualizar parábola, elipse e hipérbola en 2D/3D, manipular parámetros y ver simulaciones de reflexión de ondas electromagnéticas.

Interfaz:
- `Sidebar`: escoger tipo de cónica y parámetros editables (p, a, b, etc.).
- `Área de simulación`: visualización principal (canvas 2D por defecto) con control de zoom y rotación (pendiente de implementar avanzado 3D).
- `Panel matemático`: fórmulas dinámicas que se actualizan según parámetros.

Modos principales:
- Modo Antena Parabólica: rayos paralelos que se concentran en el foco.
- Modo Elipse Reflexiva: rayos desde un foco llegan al otro después de reflejar.
- Modo Hipérbola Geométrica: trayectorias relativas a diferencia constante de distancias.

Exportar imagen:
Usar endpoint backend `/api/export?type=parabola` para obtener PNG de muestra. En el futuro proporcionaremos botón directo en el frontend para exportar PNG desde el canvas.

Requisitos mínimos:
- Python 3.10+
- Node 18+ para el frontend

