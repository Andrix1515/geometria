import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

export default function DynamicNarrativePanel({ conicType, params }) {
  const narrative = useMemo(() => {
    const computeNarrative = () => {
      if (conicType === 'parabola') {
        const p = params?.p || 1
        const focus = p
        const directrix = -p

        let explanation =
          'Una parábola es el lugar geométrico de puntos equidistantes del foco y la directriz.'
        let insight = ''

        if (p < 0.5) {
          insight =
            'Con p pequeña, el foco está muy cerca del vértice. La parábola es muy "abierta" y dispersa la energía EM más ampliamente. No ideal para concentración.'
        } else if (p < 2) {
          insight =
            'Parámetro moderado: buena concentración de rayos en el foco. Típico en antenas parabólicas de satélite.'
        } else if (p < 4) {
          insight =
            'Parámetro grande: foco distante. La parábola es más "cerrada" y concentra energía muy fuertemente. Útil para telescopios de alta ganancia.'
        } else {
          insight =
            'p muy grande: parábola casi plana. El foco está muy lejos. Comportamiento casi lineal, mínima concentración.'
        }

        return {
          title: '📡 Parábola Electromagnética',
          equation: `y² = 4px (con p = ${p.toFixed(2)})`,
          focus: `Foco en (0, ${focus.toFixed(2)})`,
          directrix: `Directriz en y = ${directrix.toFixed(2)}`,
          explanation,
          insight,
          application:
            'Antenas parabólicas, telescopios ópticos, hornos solares, faros de vehículos.',
          efficiency:
            'Concentra rayos paralelos en un punto focal único. Ganancia teórica: ∞',
        }
      } else if (conicType === 'ellipse') {
        const a = params?.a || 3
        const b = params?.b || 2
        const c = Math.sqrt(Math.max(0, a * a - b * b))
        const eccentricity = a > 0 ? c / a : 0

        let explanation =
          'Una elipse es el lugar geométrico de puntos cuya suma de distancias a dos focos es constante (= 2a).'
        let insight = ''

        if (eccentricity < 0.3) {
          insight =
            'Baja excentricidad: la elipse es casi circular. Los focos están muy próximos. Reflexión dual muy simétrica.'
        } else if (eccentricity < 0.6) {
          insight =
            'Excentricidad moderada: elipse claramente alargada. Excelente para sistemas de reflexión dual como litotriptores médicos.'
        } else {
          insight =
            'Alta excentricidad: elipse muy alargada. Los focos están separados. Reflexión menos simétrica, propicia múltiples reflexiones.'
        }

        return {
          title: '🔵 Elipse Electromagnética',
          equation: `(x/a)² + (y/b)² = 1 (a=${a.toFixed(2)}, b=${b.toFixed(2)})`,
          foci: `Focos en (±${c.toFixed(2)}, 0)`,
          eccentricity: `e = ${eccentricity.toFixed(3)}`,
          explanation,
          insight,
          application:
            'Litotriptores médicos, sistemas de reflexión acústica, órbitas planetarias.',
          efficiency:
            'Propiedad: Rayo desde foco → Reflexión → otro foco. Distribución dual de energía.',
        }
      } else {
        // Hipérbola
        const a = params?.a || 3
        const b = params?.b || 2
        const c = Math.sqrt(a * a + b * b)
        const eccentricity = a > 0 ? c / a : 0

        let explanation =
          'Una hipérbola es el lugar geométrico de puntos cuya diferencia de distancias a dos focos es constante (= 2a).'
        let insight = ''

        if (a < 1) {
          insight =
            'Parámetro a pequeño: las ramas están muy separadas. Diferencia de distancias pequeña. Útil para localización muy precisa (TDOA).'
        } else if (a < 3) {
          insight =
            'Parámetro moderado: separación estándar para localización. Típico en sistemas de navegación LORAN y GPS diferencial.'
        } else {
          insight =
            'Parámetro grande: ramas más cercanas entre sí. Diferencia de distancias grande. Localización de baja precisión pero amplio rango.'
        }

        return {
          title: '⚡ Hipérbola Electromagnética',
          equation: `(x/a)² - (y/b)² = 1 (a=${a.toFixed(2)}, b=${b.toFixed(2)})`,
          foci: `Focos en (±${c.toFixed(2)}, 0)`,
          eccentricity: `e = ${eccentricity.toFixed(3)}`,
          explanation,
          insight,
          application:
            'Navegación TDOA (diferencia de tiempos), LORAN, GPS diferencial, localización de fuentes EM.',
          efficiency:
            'Diferencia constante de distancias. Excelente para triangulación e localización multisensor.',
        }
      }
    }

    return computeNarrative()
  }, [conicType, params])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-[#1e293b] to-[#0b1220] border border-[#334155] p-4 rounded-lg space-y-3"
    >
      {/* Title */}
      <h3 className="text-lg font-bold text-[#38bdf8] mb-3">{narrative.title}</h3>

      {/* Equations */}
      <div className="grid grid-cols-1 gap-2 text-xs">
        <div className="bg-[#0f172a] p-2 rounded border-l-2 border-[#fbbf24]">
          <span className="text-[#94a3b8]">Ecuación:</span>
          <div className="text-[#38bdf8] font-mono mt-1">{narrative.equation}</div>
        </div>

        {narrative.focus && (
          <div className="bg-[#0f172a] p-2 rounded border-l-2 border-[#ec4899]">
            <span className="text-[#94a3b8]">Parámetro Focal:</span>
            <div className="text-[#f472b6] font-mono mt-1">{narrative.focus}</div>
          </div>
        )}

        {narrative.foci && (
          <div className="bg-[#0f172a] p-2 rounded border-l-2 border-[#ec4899]">
            <span className="text-[#94a3b8]">Focos:</span>
            <div className="text-[#f472b6] font-mono mt-1">{narrative.foci}</div>
          </div>
        )}

        {narrative.directrix && (
          <div className="bg-[#0f172a] p-2 rounded border-l-2 border-[#8b5cf6]">
            <span className="text-[#94a3b8]">Directriz:</span>
            <div className="text-[#d8b4fe] font-mono mt-1">{narrative.directrix}</div>
          </div>
        )}

        {narrative.eccentricity && (
          <div className="bg-[#0f172a] p-2 rounded border-l-2 border-[#06b6d4]">
            <span className="text-[#94a3b8]">Excentricidad:</span>
            <div className="text-[#67e8f9] font-mono mt-1">{narrative.eccentricity}</div>
          </div>
        )}
      </div>

      {/* Explanation */}
      <div className="bg-[#0f172a]/50 p-3 rounded border border-[#334155]">
        <p className="text-xs text-[#cbd5e1] leading-relaxed">
          <span className="font-semibold text-[#38bdf8]">Definición:</span> {narrative.explanation}
        </p>
      </div>

      {/* Dynamic Insight */}
      <motion.div
        key={conicType + JSON.stringify(params)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-[#1e293b]/60 to-[#334155]/20 p-3 rounded border-l-4 border-[#fbbf24]"
      >
        <p className="text-xs text-[#fde047] leading-relaxed">
          <span className="font-semibold">💡 Análisis Dinámico:</span> {narrative.insight}
        </p>
      </motion.div>

      {/* Application */}
      <div className="bg-[#0b1220] p-3 rounded border border-[#1e293b]">
        <p className="text-xs text-[#cbd5e1]">
          <span className="font-semibold text-[#22d3ee]">🚀 Aplicaciones:</span> {narrative.application}
        </p>
      </div>

      {/* Efficiency */}
      <div className="bg-[#0b1220] p-3 rounded border border-[#1e293b]">
        <p className="text-xs text-[#cbd5e1]">
          <span className="font-semibold text-[#a78bfa]">⚙️ Características:</span>{' '}
          {narrative.efficiency}
        </p>
      </div>
    </motion.div>
  )
}
