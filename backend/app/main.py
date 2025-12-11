"""FastAPI backend para cálculo y simulación de cónicas.
Endpoints:
- POST /api/conic -> genera puntos de la cónica
- POST /api/simulate -> ejecuta simulaciones de rayos según modo
- GET  /api/export -> genera PNG simple de la simulación
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict
import numpy as np
import io
from fastapi.responses import StreamingResponse
from fastapi.responses import RedirectResponse
import matplotlib.pyplot as plt

from .conics import (
    parabola_points, ellipse_points, hyperbola_points,
    simulate_parabola_rays, simulate_ellipse_rays, simulate_hyperbola_rays
)

app = FastAPI(title="Cónicas Electromagnéticas API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConicRequest(BaseModel):
    type: str
    params: Dict[str, Any] = {}

@app.post('/api/conic')
async def generate_conic(req: ConicRequest):
    t = req.type.lower()
    p = req.params
    if t == 'parabola':
        pts = parabola_points(p.get('p', 1.0), tuple(p.get('vertex', (0,0))), p.get('axis_angle', 0.0), p.get('samples', 400))
        return {"points": pts.tolist()}
    elif t == 'ellipse':
        pts = ellipse_points(p.get('a', 3.0), p.get('b', 2.0), tuple(p.get('center', (0,0))), p.get('axis_angle', 0.0), p.get('samples', 400))
        return {"points": pts.tolist()}
    elif t == 'hyperbola':
        pts = hyperbola_points(p.get('a', 3.0), p.get('b', 2.0), tuple(p.get('center', (0,0))), p.get('axis_angle', 0.0), p.get('samples', 400), p.get('branch_limit', 3.0))
        return {"points": pts.tolist()}
    else:
        raise HTTPException(status_code=400, detail="Tipo de cónica no soportado")

@app.post('/api/simulate')
async def simulate(req: ConicRequest):
    t = req.type.lower()
    p = req.params
    if t == 'parabola':
        return simulate_parabola_rays(p.get('p',1.0), tuple(p.get('vertex',(0,0))), p.get('axis_angle',0.0), p.get('samples',400), p.get('num_rays',20))
    elif t == 'ellipse':
        return simulate_ellipse_rays(p.get('a',3.0), p.get('b',2.0), tuple(p.get('center',(0,0))), p.get('axis_angle',0.0), p.get('samples',400), p.get('num_rays',40))
    elif t == 'hyperbola':
        return simulate_hyperbola_rays(p.get('a',3.0), p.get('b',2.0), tuple(p.get('center',(0,0))), p.get('axis_angle',0.0), p.get('samples',400), p.get('num_rays',40))
    else:
        raise HTTPException(status_code=400, detail="Tipo de simulación no soportado")

@app.get('/api/export')
async def export_png(type: str = 'parabola'):
    # Genera una imagen PNG simple de ejemplo (sólo demostración)
    fig, ax = plt.subplots(figsize=(6,6), facecolor='#0f172a')
    ax.set_facecolor('#0f172a')
    if type == 'parabola':
        pts = parabola_points(p=1.0)
        xs, ys = np.array(pts).T
        ax.plot(xs, ys, color='#38bdf8')
    elif type == 'ellipse':
        pts = ellipse_points()
        xs, ys = np.array(pts).T
        ax.plot(xs, ys, color='#38bdf8')
    elif type == 'hyperbola':
        pts = hyperbola_points()
        xs, ys = np.array(pts).T
        ax.plot(xs, ys, color='#38bdf8')
    ax.axis('equal')
    ax.axis('off')
    buf = io.BytesIO()
    plt.savefig(buf, dpi=150, bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close(fig)
    buf.seek(0)
    return StreamingResponse(buf, media_type='image/png')


@app.get('/', include_in_schema=False)
async def root():
    """Redirige la raíz hacia la documentación interactiva de FastAPI."""
    return RedirectResponse(url='/docs')

# Run instructions in backend/README.md
