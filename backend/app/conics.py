"""Funciones matemáticas para generar puntos de cónicas y simular reflexiones.
Uso: devolver arrays de puntos (x,y) y trayectorias de rayos para visualización.
"""
from typing import Dict, Any, List, Tuple
import numpy as np

# Generadores de puntos

def parabola_points(p: float = 1.0, vertex: Tuple[float,float]=(0.0,0.0),
                    axis_angle: float = 0.0, samples: int = 400) -> np.ndarray:
    """Genera puntos (x,y) de una parábola con parámetro focal p (dist. vértice->foco).
    Forma canónica: y = (1/(4p)) x^2 si el eje es vertical y vértice en (0,0).
    """
    t = np.linspace(-10, 10, samples)
    x = t
    y = (1.0/(4.0*p)) * t**2
    pts = np.stack([x, y], axis=1)
    # Translate and rotate
    theta = axis_angle
    R = np.array([[np.cos(theta), -np.sin(theta)],[np.sin(theta), np.cos(theta)]])
    pts = (pts @ R.T) + np.array(vertex)
    return pts


def ellipse_points(a: float=3.0, b: float=2.0, center: Tuple[float,float]=(0.0,0.0),
                   axis_angle: float = 0.0, samples: int = 400) -> np.ndarray:
    t = np.linspace(0, 2*np.pi, samples)
    x = a * np.cos(t)
    y = b * np.sin(t)
    pts = np.stack([x, y], axis=1)
    theta = axis_angle
    R = np.array([[np.cos(theta), -np.sin(theta)],[np.sin(theta), np.cos(theta)]])
    pts = (pts @ R.T) + np.array(center)
    return pts


def hyperbola_points(a: float=3.0, b: float=2.0, center: Tuple[float,float]=(0.0,0.0),
                     axis_angle: float = 0.0, samples: int = 400, branch_limit: float = 3.0) -> np.ndarray:
    t = np.linspace(-branch_limit, branch_limit, samples)
    x = a * np.cosh(t)
    y = b * np.sinh(t)
    pts1 = np.stack([x, y], axis=1)
    pts2 = np.stack([-x, -y], axis=1)
    pts = np.vstack([pts1, pts2])
    theta = axis_angle
    R = np.array([[np.cos(theta), -np.sin(theta)],[np.sin(theta), np.cos(theta)]])
    pts = (pts @ R.T) + np.array(center)
    return pts

# Utilidades de reflexión (método aproximado sobre puntos discretizados)

def compute_normals_from_samples(pts: np.ndarray) -> np.ndarray:
    """Calcula aproximación de normales en cada punto (2D)."""
    # derivadas por diferencias centradas
    dp = np.gradient(pts, axis=0)
    tangents = dp
    # normals = rotate tangent by +90 deg and normalize
    normals = np.empty_like(tangents)
    normals[:,0] = -tangents[:,1]
    normals[:,1] = tangents[:,0]
    norms = np.linalg.norm(normals, axis=1, keepdims=True) + 1e-12
    normals = normals / norms
    return normals


def reflect_vector(v: np.ndarray, n: np.ndarray) -> np.ndarray:
    """Refleja el vector incidente v respecto a la normal n (ambos normalizados)."""
    v = v / (np.linalg.norm(v) + 1e-12)
    n = n / (np.linalg.norm(n) + 1e-12)
    return v - 2.0 * np.dot(v, n) * n


def simulate_parabola_rays(p: float=1.0, vertex=(0,0), axis_angle: float=0.0,
                           samples: int=200, num_rays: int=20) -> Dict[str, Any]:
    """Simula rayos paralelos (ej. entrada desde arriba) que inciden en la parábola y se reflejan hacia el foco.
    Devuelve puntos de la cónica y lista de trayectorias de rayos (cada trayectoria: lista de puntos).
    """
    pts = parabola_points(p=p, vertex=vertex, axis_angle=axis_angle, samples=samples)
    normals = compute_normals_from_samples(pts)
    # foco en coordenadas locales antes de rot/trans
    # Para la parábola canónica y p>0, foco=(0,p)
    # Pero como rotamos/trasladamos la curva, calculamos foco transformado
    # Para simplicity, compute focus by rotating and translating
    focus_local = np.array([0.0, p])
    theta = axis_angle
    R = np.array([[np.cos(theta), -np.sin(theta)],[np.sin(theta), np.cos(theta)]])
    focus = focus_local @ R.T + np.array(vertex)

    ray_paths = []
    # sample indices across the central part
    idxs = np.linspace(0, pts.shape[0]-1, num_rays, dtype=int)
    for i in idxs:
        hit = pts[i]
        n = normals[i]
        # ray direction: incoming parallel to axis (from +y toward -y if axis vertical), compute world-space
        # choose incident direction as -axis unit vector
        axis_dir = np.array([0.0, 1.0]) @ R.T  # local +y rotated
        inc = -axis_dir / (np.linalg.norm(axis_dir)+1e-12)
        refl = reflect_vector(inc, n)
        # Construct simple polyline: start point far along -inc, hit, then extend along refl
        start = hit + inc * 10.0
        after = hit + refl * 20.0
        ray_paths.append([tuple(start.tolist()), tuple(hit.tolist()), tuple(after.tolist())])

    return {
        "conic_points": pts.tolist(),
        "focus": tuple(focus.tolist()),
        "rays": ray_paths
    }


def simulate_ellipse_rays(a: float=3.0, b: float=2.0, center=(0,0), axis_angle: float=0.0,
                          samples: int=400, num_rays: int=40) -> Dict[str, Any]:
    pts = ellipse_points(a=a, b=b, center=center, axis_angle=axis_angle, samples=samples)
    normals = compute_normals_from_samples(pts)
    # focos para elipse: c = sqrt(a^2 - b^2)
    c = np.sqrt(max(a*a - b*b, 0.0))
    # focos en marco local: (±c,0)
    f1_local = np.array([-c, 0.0]); f2_local = np.array([c, 0.0])
    theta = axis_angle
    R = np.array([[np.cos(theta), -np.sin(theta)],[np.sin(theta), np.cos(theta)]])
    f1 = f1_local @ R.T + np.array(center)
    f2 = f2_local @ R.T + np.array(center)

    ray_paths = []
    idxs = np.linspace(0, pts.shape[0]-1, num_rays, dtype=int)
    for i in idxs:
        hit = pts[i]
        # Empezar en f1 y trazar a hit, luego reflejar hacia f2 (idealmente law of reflection ensures it goes to f2)
        ray_paths.append([tuple(f1.tolist()), tuple(hit.tolist()), tuple(f2.tolist())])

    return {
        "conic_points": pts.tolist(),
        "foci": [tuple(f1.tolist()), tuple(f2.tolist())],
        "rays": ray_paths
    }


def simulate_hyperbola_rays(a: float=3.0, b: float=2.0, center=(0,0), axis_angle: float=0.0,
                            samples: int=400, num_rays: int=40) -> Dict[str, Any]:
    pts = hyperbola_points(a=a, b=b, center=center, axis_angle=axis_angle, samples=samples)
    # For hyperbola, foci at ±c with c = sqrt(a^2 + b^2)
    c = np.sqrt(a*a + b*b)
    f1_local = np.array([-c, 0.0]); f2_local = np.array([c, 0.0])
    theta = axis_angle
    R = np.array([[np.cos(theta), -np.sin(theta)],[np.sin(theta), np.cos(theta)]])
    f1 = f1_local @ R.T + np.array(center)
    f2 = f2_local @ R.T + np.array(center)
    ray_paths = []
    # muestra rayos saliendo desde cerca del foco y trazando hacia fuera
    idxs = np.linspace(0, pts.shape[0]-1, num_rays, dtype=int)
    for i in idxs:
        hit = pts[i]
        # Build a conceptual ray from f1 to hit and then continue
        ray_paths.append([tuple(f1.tolist()), tuple(hit.tolist()), (hit + (hit - f1)).tolist()])
    return {
        "conic_points": pts.tolist(),
        "foci": [tuple(f1.tolist()), tuple(f2.tolist())],
        "rays": ray_paths
    }
