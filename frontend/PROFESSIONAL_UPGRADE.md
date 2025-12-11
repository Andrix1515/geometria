# 🌐 Cónicas EM Pro - Upgrade Profesional v2.0

## Resumen General

**Cónicas EM Pro** es un simulador electromagnético profesional que visualiza de manera elegante, clara e interactiva el comportamiento de ondas EM interactuando con cónicas (parábola, elipse, hipérbola).

### Cambios Principales del Upgrade 2.0

#### ✨ Nuevos Componentes
1. **Canvas2DPro** - Canvas mejorado con GSAP, múltiples modos y estilos artísticos
2. **DynamicNarrativePanel** - Explicaciones inteligentes que cambian con los parámetros
3. **Paraboloid3D** - Visualización 3D del paraboloide con iluminación realista
4. **TimelineScenarios** - Reproductor de escenarios educativos animados
5. **AdvancedControlPanel** - Panel de control moderno con tabs y controles suavizados
6. **EMWaveAnimation** - Animación de propagación de ondas EM (bonus)
7. **HelpModal Mejorado** - Guía interactiva con tabs temáticos

#### 🎨 Modos de Visualización
- **Standard**: Visualización clara y minimalista
- **Scientific**: Con malla, ejes, vectores normales
- **Artistic**: Efectos glow, colores vibrantes, presets (Minimal, Neon, Galaxy, Blueprint)

#### 📊 Características Avanzadas
- **Análisis Dinámico**: Explicaciones que se actualizan según parámetros
- **Exportación 4K**: Descarga en ultra alta resolución
- **Exportación JSON**: Datos matemáticos completos de la simulación
- **Escenarios Guiados**: Aprende con simulaciones animadas paso a paso
- **Modo 3D**: Visualiza paraboloides con reflexión simulada

#### 🎭 Estilos Artísticos (Modo Artistic)
- **Minimal**: Colores suave y minimalistas
- **Neon**: Colores fluorescentes, efecto cyberpunk
- **Galaxy**: Colores cálidos, tema espacio
- **Blueprint**: Azul técnico, estilo ingeniería

---

## Instalación & Configuración

### Librerías Agregadas
```bash
npm install gsap framer-motion react-tooltip react-spring leva --legacy-peer-deps
```

### Ejecutar en Desarrollo
```bash
npm run dev
```

---

## Estructura de Componentes

```
src/components/
├── Canvas2DPro.jsx              # Canvas principal con GSAP y animaciones
├── DynamicNarrativePanel.jsx    # Panel de análisis dinámico
├── Paraboloid3D.jsx             # Visualización 3D (Three.js)
├── TimelineScenarios.jsx        # Reproductor de escenarios
├── AdvancedControlPanel.jsx     # Panel de control profesional
├── EMWaveAnimation.jsx          # Animación de ondas EM
├── HelpModal.jsx                # Guía interactiva
└── ...otros componentes
```

---

## Guía de Uso

### Panel Izquierdo (Control)
- **Tipo de Cónica**: Parábola, Elipse, Hipérbola
- **Parámetros**: Sliders para ajustar dimensiones
- **Visualización**: Selecciona modo (Standard, Científico, Artístico)
- **Opciones**: Mostrar directriz, activar 3D

### Panel Central (Canvas)
- **Botón PNG**: Descarga en resolución estándar
- **Botón 4K**: Descarga en ultra HD
- **Botón JSON**: Exporta datos matemáticos

### Panel Derecho (Análisis & Escenarios)
- **Tab Análisis**: Ecuaciones, focos, propiedades dinámicas
- **Tab Escenarios**: Simulaciones guiadas educativas

---

## Modos Detallados

### Standard
Visualización clásica: curva, rayos, focos. Ideal para aprendizaje básico.

### Scientific
Incluye:
- Malla de coordenadas
- Ejes X-Y
- Vectores normales en puntos de la curva
- Etiquetas de coordenadas

Perfecto para análisis detallado.

### Artistic
Efectos visuales mejorados:
- Glow y sombras
- Colores vibrantes
- 4 presets diferentes
- Bordes suavizados

---

## Escenarios Educativos

### 1. Reflexión Parabólica
- **Concepto**: Rayos paralelos convergen en el foco
- **Aplicación**: Antenas parabólicas
- **Duración**: 3 segundos

### 2. Reflexión Dual Elíptica
- **Concepto**: Rayo desde un foco → otro foco
- **Aplicación**: Litotriptores médicos
- **Duración**: 4 segundos

### 3. Localización Hiperbólica (TDOA)
- **Concepto**: Diferencia de distancias constante
- **Aplicación**: LORAN, GPS diferencial
- **Duración**: 4 segundos

---

## Exportación de Datos

### PNG (Estándar)
- Resolución: Según el tamaño del canvas
- Formato: PNG transparente
- Botón: "📸 PNG"

### 4K
- Resolución: 4x escala
- Formato: PNG de ultra alta calidad
- Botón: "🎬 4K"

### JSON
Exporta:
```json
{
  "type": "parabola",
  "params": { "p": 1.5 },
  "conicPoints": [...],
  "focus": [...],
  "rays": [...],
  "timestamp": "2025-12-04T..."
}
```
Botón: "📊 JSON"

---

## Ciencia Aplicada

### 📡 Parábola
- **Ecuación**: y = x² / (4p)
- **Propiedad**: Rayos paralelos → Foco único
- **Aplicaciones**: Antenas parabólicas, telescopios, hornos solares, faros
- **EM**: Concentración de señales débiles en comunicaciones por satélite

### 🔵 Elipse
- **Ecuación**: x²/a² + y²/b² = 1
- **Propiedad**: Suma de distancias a focos = constante
- **Aplicaciones**: Litotriptores, acústica, órbitas
- **EM**: Reflexión dual en sistemas de recepción

### ⚡ Hipérbola
- **Ecuación**: x²/a² - y²/b² = 1
- **Propiedad**: Diferencia de distancias a focos = constante
- **Aplicaciones**: LORAN, GPS diferencial, localización
- **EM**: Triangulación TDOA (Time Difference of Arrival)

---

## Características Técnicas

- **Animaciones**: GSAP + Framer Motion
- **Gráficos 3D**: Three.js (paraboloide)
- **Canvas**: HTML5 Canvas con cálculo de rayos
- **Interactividad**: Estados React + Hooks
- **Estilos**: Tailwind CSS + Gradientes CSS

---

## Optimizaciones

- **Reducción de grosor de rayos**: Automática cuando hay >30 rayos
- **Animación suave**: GSAP con ease personalizada
- **Renderizado eficiente**: requestAnimationFrame en 3D
- **Memory**: Limpieza de animaciones al desmontar componentes

---

## Próximas Mejoras (Roadmap)

- [ ] Focus Interaction - Arrastrar focos en tiempo real
- [ ] Particle Simulation - Fotones viajando por rayos
- [ ] Sound Reflection Mode - Visualización de reflexión acústica
- [ ] Comparison View - Dos cónicas lado a lado
- [ ] Export to PDF - Reportes profesionales
- [ ] Dark/Light Theme - Temas alternos
- [ ] Mobile Responsive - Versión táctil

---

## Créditos

Desarrollado como herramienta educativa y científica.
Inspiración en software profesional de laboratorio.

**Versión**: 2.0 Profesional  
**Última actualización**: Diciembre 2025  
**Stack**: React + Canvas + Three.js + GSAP + Tailwind CSS
