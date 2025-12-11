import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function HelpModal({ onClose }) {
  const [tab, setTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: '📘 Descripción General', icon: '🌐' },
    { id: 'controls', label: '🎮 Controles', icon: '⚙️' },
    { id: 'modes', label: '🎨 Modos', icon: '✨' },
    { id: 'scientific', label: '🔬 Ciencia', icon: '📊' },
  ]

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-[#0b1220] to-[#071126] border border-[#334155] rounded-lg max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1e293b] to-[#0b1220] px-8 py-6 border-b border-[#334155] flex justify-between items-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#00eaff] to-[#38bdf8] bg-clip-text text-transparent">
            🌐 Guía Profesional - Cónicas EM
          </h2>
          <button
            onClick={onClose}
            className="text-[#94a3b8] hover:text-white text-3xl font-bold transition"
          >
            ×
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Tabs */}
          <div className="w-56 bg-[#0f172a] border-r border-[#334155] p-3 space-y-2 overflow-y-auto">
            {tabs.map((tab_item) => (
              <motion.button
                key={tab_item.id}
                whileHover={{ x: 4 }}
                onClick={() => setTab(tab_item.id)}
                className={`w-full text-left px-4 py-3 rounded border transition ${
                  tab === tab_item.id
                    ? 'bg-gradient-to-r from-[#38bdf8] to-[#00eaff] text-[#0f172a] border-[#38bdf8]'
                    : 'bg-[#0b1220] border-[#334155] text-[#cbd5e1] hover:border-[#38bdf8]'
                }`}
              >
                <div className="font-semibold text-sm">{tab_item.label}</div>
              </motion.button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <motion.div
              key={tab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-[#cbd5e1] space-y-4"
            >
              {tab === 'overview' && (
                <>
                  <h3 className="text-xl font-bold text-[#38bdf8] mb-4">Bienvenido a Cónicas EM Pro</h3>
                  <p className="text-sm leading-relaxed">
                    Este simulador profesional visualiza el comportamiento de ondas electromagnéticas
                    interactuando con diferentes cónicas (parábola, elipse, hipérbola).
                  </p>

                  <div className="bg-[#0f172a] p-4 rounded border border-[#334155] mt-4">
                    <h4 className="font-semibold text-[#38bdf8] mb-3">✨ Características Principales:</h4>
                    <ul className="space-y-2 text-sm">
                      <li>✓ <strong>Análisis Dinámico:</strong> Explicaciones que cambian según tus parámetros</li>
                      <li>✓ <strong>Múltiples Modos:</strong> Standard, Científico, Artístico</li>
                      <li>✓ <strong>Visualización 3D:</strong> Paraboloide con iluminación realista</li>
                      <li>✓ <strong>Escenarios Educativos:</strong> Aprende con simulaciones guiadas</li>
                      <li>✓ <strong>Exportación de Datos:</strong> PNG 4K y JSON de datos matemáticos</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-[#1e293b] to-[#0b1220] p-4 rounded border border-[#334155] mt-4">
                    <p className="text-xs text-[#94a3b8]">
                      💡 <strong>Consejo:</strong> Empieza explorando los "Escenarios" para entender
                      cómo funcionan las cónicas en aplicaciones reales.
                    </p>
                  </div>
                </>
              )}

              {tab === 'controls' && (
                <>
                  <h3 className="text-xl font-bold text-[#38bdf8] mb-4">Cómo Usar los Controles</h3>

                  <div className="space-y-3">
                    <div className="bg-[#0f172a] p-3 rounded border-l-4 border-[#38bdf8]">
                      <h4 className="font-semibold text-[#38bdf8]">Panel Izquierdo - Control</h4>
                      <ul className="text-sm mt-2 space-y-1 text-[#cbd5e1]">
                        <li>• <strong>Tipo de Cónica:</strong> Selecciona Parábola, Elipse o Hipérbola</li>
                        <li>• <strong>Parámetros:</strong> Ajusta con sliders para ver cambios en tiempo real</li>
                        <li>• <strong>Modo:</strong> Cambia entre Standard, Científico o Artístico</li>
                        <li>• <strong>Mostrar Directriz:</strong> Visualiza la línea de referencia (parábola)</li>
                        <li>• <strong>Vista 3D:</strong> Activa la visualización tridimensional</li>
                      </ul>
                    </div>

                    <div className="bg-[#0f172a] p-3 rounded border-l-4 border-[#fbbf24]">
                      <h4 className="font-semibold text-[#fbbf24]">Panel Derecho - Análisis</h4>
                      <ul className="text-sm mt-2 space-y-1 text-[#cbd5e1]">
                        <li>• <strong>Análisis:</strong> Ecuaciones, focos y propiedades dinámicas</li>
                        <li>• <strong>Escenarios:</strong> Simulaciones guiadas paso a paso</li>
                      </ul>
                    </div>

                    <div className="bg-[#0f172a] p-3 rounded border-l-4 border-[#22d3ee]">
                      <h4 className="font-semibold text-[#22d3ee]">Centro - Canvas</h4>
                      <ul className="text-sm mt-2 space-y-1 text-[#cbd5e1]">
                        <li>• <strong>Botón PNG:</strong> Descarga en resolución estándar</li>
                        <li>• <strong>Botón 4K:</strong> Descarga en ultra alta resolución</li>
                        <li>• <strong>Botón JSON:</strong> Exporta datos matemáticos</li>
                      </ul>
                    </div>
                  </div>
                </>
              )}

              {tab === 'modes' && (
                <>
                  <h3 className="text-xl font-bold text-[#38bdf8] mb-4">Modos de Visualización</h3>

                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-[#38bdf8]/20 to-transparent p-4 rounded border border-[#38bdf8]/50">
                      <h4 className="font-semibold text-[#38bdf8] mb-2">🔵 Modo Standard</h4>
                      <p className="text-sm text-[#cbd5e1]">
                        La visualización clásica, clara y minimalista. Ideal para entender los conceptos básicos.
                        Muestra la curva, rayos y focos sin distracciones.
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-[#60a5fa]/20 to-transparent p-4 rounded border border-[#60a5fa]/50">
                      <h4 className="font-semibold text-[#60a5fa] mb-2">📊 Modo Científico</h4>
                      <p className="text-sm text-[#cbd5e1]">
                        Muestra una malla de coordenadas, ejes y vectores normales en puntos de la curva.
                        Perfecto para análisis detallado y trabajos académicos.
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-[#d946ef]/20 to-transparent p-4 rounded border border-[#d946ef]/50">
                      <h4 className="font-semibold text-[#d946ef] mb-2">✨ Modo Artístico</h4>
                      <p className="text-sm text-[#cbd5e1]">
                        Efectos visuales con colores vibrantes, glow y sombras. Selecciona entre:
                        Minimal, Neon, Galaxy, Blueprint.
                      </p>
                    </div>
                  </div>
                </>
              )}

              {tab === 'scientific' && (
                <>
                  <h3 className="text-xl font-bold text-[#38bdf8] mb-4">Fundamentos Científicos</h3>

                  <div className="bg-[#0f172a] p-4 rounded border border-[#334155] space-y-3">
                    <div>
                      <h4 className="font-semibold text-[#fbbf24] mb-2">📡 Parábola</h4>
                      <p className="text-xs text-[#cbd5e1] mb-2">
                        Lugar de puntos equidistantes del foco y la directriz. Los rayos paralelos convergen
                        en el foco. Se usa en: antenas parabólicas, telescopios, hornos solares.
                      </p>
                      <p className="text-xs text-[#94a3b8]">Ecuación: y² = 4px</p>
                    </div>

                    <hr className="border-[#334155]" />

                    <div>
                      <h4 className="font-semibold text-[#ec4899] mb-2">🔵 Elipse</h4>
                      <p className="text-xs text-[#cbd5e1] mb-2">
                        Lugar de puntos cuya suma de distancias a dos focos es constante. Propiedad:
                        rayo desde un foco se refleja hacia el otro. Usada en: litotriptores, acústica.
                      </p>
                      <p className="text-xs text-[#94a3b8]">Ecuación: x²/a² + y²/b² = 1</p>
                    </div>

                    <hr className="border-[#334155]" />

                    <div>
                      <h4 className="font-semibold text-[#0ea5e9] mb-2">⚡ Hipérbola</h4>
                      <p className="text-xs text-[#cbd5e1] mb-2">
                        Lugar de puntos cuya diferencia de distancias a dos focos es constante.
                        Se usa en: LORAN, GPS diferencial, localización TDOA.
                      </p>
                      <p className="text-xs text-[#94a3b8]">Ecuación: x²/a² - y²/b² = 1</p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#334155] bg-[#0b1220] px-8 py-4 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="bg-gradient-to-r from-[#38bdf8] to-[#00eaff] text-[#0f172a] px-6 py-2 rounded font-semibold"
          >
            Entendido 👍
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

