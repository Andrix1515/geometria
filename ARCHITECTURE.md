# 🏗️ ARQUITECTURA - Cónicas EM Pro v2.0

## Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                        APP.jsx (Root)                           │
│                    (Orquestador Principal)                      │
└─────────────────────────────────────────────────────────────────┘
         │
         ├── Hooks de Estado
         │   ├── conicType
         │   ├── params
         │   ├── canvasMode
         │   ├── canvasStyle
         │   └── show3D
         │
         ├── Fetch de simulación a backend
         │   └── POST /api/simulate
         │
         └── Render de 3 Paneles Principales
            │
            ├─────────────────────────────────────────────────────
            │ PANEL IZQUIERDO
            ├─────────────────────────────────────────────────────
            │
            └─→ AdvancedControlPanel.jsx
                ├── ControlSection (Collapsible)
                │   ├── Selector de Cónica (Parábola/Elipse/Hipérbola)
                │   ├── Sliders de Parámetros
                │   ├── Selector de Modo (Standard/Scientific/Artistic)
                │   ├── Selector de Estilo (Minimal/Neon/Galaxy/Blueprint)
                │   ├── Toggle 3D
                │   └── Leyenda Visual
                │
                └── onchange → setConicType, setParams, etc.


            ├─────────────────────────────────────────────────────
            │ PANEL CENTRAL
            ├─────────────────────────────────────────────────────
            │
            ├─→ Canvas2DPro.jsx (Modo 2D)
            │   ├── useRef + useEffect (setup canvas)
            │   ├── GSAP animaciones rayos
            │   ├── getColorScheme() según style
            │   ├── drawConic()
            │   ├── drawRays()
            │   ├── drawFoci()
            │   ├── drawGrid() [Scientific mode]
            │   ├── drawNormals() [Scientific mode]
            │   ├── Tooltips interactivos
            │   ├── Botones exportación
            │   │   ├── downloadCanvas() → PNG
            │   │   ├── download4K() → 4x resolución PNG
            │   │   └── exportJSON() → Datos matemáticos
            │   │
            │   └── Modos de renderizado
            │       ├── Standard (limpio)
            │       ├── Scientific (malla+ejes+normales)
            │       └── Artistic (colores+glow+sombras)
            │
            └─→ Paraboloid3D.jsx (Modo 3D)
                ├── Three.js Scene
                ├── PerspectiveCamera
                ├── WebGLRenderer
                ├── Geometry (Paraboloide procedural)
                ├── Material (MeshStandardMaterial)
                ├── Lighting
                │   ├── AmbientLight (0.4)
                │   ├── DirectionalLight (0.8)
                │   └── PointLight (0.5) en foco
                ├── Focus (SphereGeometry)
                ├── Glow animado
                ├── Rayos EM (LineSegments)
                └── Animation loop (requestAnimationFrame)


            ├─────────────────────────────────────────────────────
            │ PANEL DERECHO
            ├─────────────────────────────────────────────────────
            │
            └─→ Tab Navigation
                │
                ├── Tab "Análisis"
                │   └─→ DynamicNarrativePanel.jsx
                │       ├── useMemo computeNarrative()
                │       ├── Ecuación matemática
                │       ├── Parámetros (focus, foci, directrix, e)
                │       ├── Definición científica
                │       ├── Análisis dinámico (insight)
                │       ├── Aplicaciones
                │       └── Características técnicas
                │
                └── Tab "Escenarios"
                    └─→ TimelineScenarios.jsx
                        ├── scenarios[] (3 escenarios)
                        │   ├── 1. Reflexión Parabólica
                        │   ├── 2. Reflexión Dual Elíptica
                        │   └── 3. Localización Hiperbólica
                        │
                        ├── handlePlayScenario()
                        │   ├── Animation progress (0→1)
                        │   ├── onScenarioSelect → setConicType
                        │   └── Narración textual
                        │
                        └── Botón Reproducir
                            └── Actualiza App.jsx params


            ├─────────────────────────────────────────────────────
            │ HEADER
            ├─────────────────────────────────────────────────────
            │
            └─→ Título + Botón Ayuda
                └─→ HelpModal.jsx (Modal)
                    ├── Tabs temáticos
                    │   ├── Overview
                    │   ├── Controls
                    │   ├── Modes
                    │   └── Scientific
                    │
                    └── Transiciones suaves (Framer Motion)


            ├─────────────────────────────────────────────────────
            │ FOOTER
            ├─────────────────────────────────────────────────────
            │
            └─→ Status Bar
                └── Modo actual + Estilo + Parámetros
```

---

## Flujo de Datos

```
Usuario interactúa
        ↓
AdvancedControlPanel captura cambio
        ↓
setState en App.jsx (conicType, params)
        ↓
useEffect dispara fetchSim()
        ↓
Backend devuelve {conic_points, rays, focus, foci}
        ↓
setSimData(respuesta)
        ↓
Canvas2DPro / Paraboloid3D reciben props
        ↓
useEffect dispara renderizado
        ↓
GSAP anima suavemente los rayos
        ↓
DynamicNarrativePanel actualiza análisis
        ↓
Usuario ve cambios en tiempo real ✨
```

---

## Stack Tecnológico

```
Frontend:
├── React 18.2.0 (framework principal)
├── Vite 4.5 (bundler)
├── Tailwind CSS 3.4 (estilos)
├── Framer Motion (animaciones UI)
├── GSAP (animaciones canvas)
├── Three.js 0.160 (3D)
├── D3 7.8.5 (para futuro)
└── React Spring (física opcional)

Backend:
├── Python FastAPI
├── NumPy (cálculos matemáticos)
└── (ver backend/requirements.txt)

Build:
├── Vite config con code-splitting
├── Rollup manual chunks (Three, GSAP, React)
└── Tailwind JIT compilation
```

---

## Flujo de Compilación

```
src/
├── App.jsx (root)
├── components/
│   ├── Canvas2DPro.jsx (570 líneas)
│   ├── DynamicNarrativePanel.jsx (160 líneas)
│   ├── Paraboloid3D.jsx (200 líneas)
│   ├── TimelineScenarios.jsx (180 líneas)
│   ├── AdvancedControlPanel.jsx (350 líneas)
│   ├── EMWaveAnimation.jsx (220 líneas)
│   ├── HelpModal.jsx (280 líneas)
│   ├── MathPanel.jsx (v1, deprecated)
│   ├── Sidebar.jsx (v1, deprecated)
│   └── Canvas2D.jsx (v1, deprecated)
│
├── index.css (Tailwind)
└── main.jsx (entry point)

    ↓ (vite build)

dist/
├── index.html (0.44 kB)
├── assets/
│   ├── index.css (20.58 kB → 4.26 kB gzip)
│   └── index.js (829.32 kB → 240.82 kB gzip)
└── (chunks separados para Three, GSAP, etc.)
```

---

## Patrones de Código

### 1. Canvas Rendering (Canvas2DPro)
```javascript
useEffect(() => {
  const canvas = canvasRef.current
  const ctx = canvas.getContext('2d')
  
  // Setup DPR-aware rendering
  const DPR = window.devicePixelRatio || 1
  canvas.width = Math.floor(w * DPR)
  canvas.height = Math.floor(h * DPR)
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
  
  // Draw operations
  drawConic(ctx, ...)
  drawRays(ctx, ...) // animated with GSAP
  drawFoci(ctx, ...)
}, [simData, mode, style])
```

### 2. 3D Rendering (Paraboloid3D)
```javascript
useEffect(() => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(...)
  const renderer = new THREE.WebGLRenderer(...)
  
  // Create geometry + material
  const geometry = new THREE.BufferGeometry()
  const material = new THREE.MeshStandardMaterial(...)
  
  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate)
    mesh.rotation.y += 0.005
    renderer.render(scene, camera)
  }
}, [visible])
```

### 3. Dynamic Narratives
```javascript
const narrative = useMemo(() => {
  const computeNarrative = () => {
    if (conicType === 'parabola') {
      const p = params?.p || 1
      
      // Generar insight dinámico
      let insight = p < 0.5 
        ? "Parámetro pequeño..." 
        : "Parámetro moderado..."
        
      return { title, equation, insight, ... }
    }
  }
  return computeNarrative()
}, [conicType, params])
```

### 4. State Management
```javascript
// App.jsx
const [conicType, setConicType] = useState('parabola')
const [params, setParams] = useState({ p: 1.0 })
const [canvasMode, setCanvasMode] = useState('standard')

// Props hacia abajo
<Canvas2DPro mode={canvasMode} style={canvasStyle} ... />

// Callbacks hacia arriba (si necesario)
// onFocusClick, onScenarioSelect, etc.
```

---

## Performance Optimizations

```
1. Code Splitting
   ├── three.js → chunks separado
   ├── gsap → chunk separado
   └── react-vendor → chunk base

2. Canvas Rendering
   ├── requestAnimationFrame para animaciones
   ├── GSAP onUpdate para eficiencia
   └── Reduce grosor rayos si > 30

3. Memory
   ├── Cleanup en useEffect return
   ├── Cancel animations on unmount
   └── Dispose Three.js resources

4. Rendering
   ├── Conditional rendering (3D vs 2D)
   ├── useMemo para cálculos costosos
   └── useCallback para funciones estables
```

---

## Testing Points

```
✅ Componentes que verificar:

1. Canvas2DPro
   ├── Renderiza correctamente en 3 modos
   ├── Animaciones GSAP funcionan
   └── Exportación PNG/4K/JSON

2. Paraboloid3D
   ├── Three.js carga correctamente
   ├── Iluminación renderiza
   └── Sin memory leaks

3. DynamicNarrativePanel
   ├── Texto cambia con parámetros
   └── Transiciones suaves

4. TimelineScenarios
   ├── Reproducción fluida
   ├── Cambios de escenario
   └── onScenarioSelect llama correctamente

5. AdvancedControlPanel
   ├── Controles responden
   ├── Tabs abren/cierran
   └── Valores se envían a App

6. Backend API
   ├── /api/simulate responde
   └── Datos son correctos
```

---

## Extensibilidad Futura

```
Puntos de extensión:

1. Nuevos Modos
   - Agregar en Canvas2DPro: mode === 'custom'
   
2. Nuevos Estilos
   - Agregar en getColorScheme()
   
3. Nuevos Escenarios
   - Array scenarios[] en TimelineScenarios
   
4. Interactividad Focus
   - Implementar drag handlers en Canvas2DPro
   
5. Partículas
   - Nuevo componente ParticleSystem
   
6. Comparación
   - Dual Canvas side-by-side
```

---

Este documento sirve como referencia arquitectónica completa del proyecto.

*Última actualización: Diciembre 2025*
