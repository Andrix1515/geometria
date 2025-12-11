import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdvancedControlPanel({
  conicType,
  setConicType,
  params,
  setParams,
  showDirectrix,
  setShowDirectrix,
  canvasMode,
  setCanvasMode,
  canvasStyle,
  setCanvasStyle,
  show3D,
  setShow3D,
}) {
  const [expanded, setExpanded] = useState({
    conic: true,
    display: true,
    advanced: false,
  })

  function updateParam(k, v) {
    setParams((prev) => ({ ...prev, [k]: parseFloat(v) }))
  }

  const toggleSection = (section) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-3 max-h-[calc(100vh-100px)] overflow-y-auto"
    >
      {/* Conic Selection */}
      <ControlSection
        title="🔷 Tipo de Cónica"
        expanded={expanded.conic}
        onToggle={() => toggleSection('conic')}
      >
        <div className="space-y-2">
          {[
            { value: 'parabola', label: '📡 Parábola', color: 'from-blue-500' },
            { value: 'ellipse', label: '🔵 Elipse', color: 'from-pink-500' },
            { value: 'hyperbola', label: '⚡ Hipérbola', color: 'from-purple-500' },
          ].map((opt) => (
            <motion.button
              key={opt.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setConicType(opt.value)}
              className={`w-full p-3 rounded border transition ${
                conicType === opt.value
                  ? `bg-gradient-to-r ${opt.color} to-transparent border-[#38bdf8]`
                  : 'bg-[#0f172a] border-[#334155] hover:border-[#38bdf8]'
              }`}
            >
              <span className="text-sm font-semibold text-[#cbd5e1]">{opt.label}</span>
            </motion.button>
          ))}
        </div>
      </ControlSection>

      {/* Parameters */}
      <ControlSection
        title="📐 Parámetros"
        expanded={expanded.conic}
        onToggle={() => toggleSection('conic')}
      >
        <div className="bg-[#0b1220] p-3 rounded space-y-3">
          {conicType === 'parabola' && (
            <>
              <ParameterSlider
                label="p (foco)"
                value={params.p || 1}
                min={0.2}
                max={5}
                step={0.1}
                onChange={(v) => updateParam('p', v)}
              />
              <label className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-[#1e293b] transition">
                <input
                  type="checkbox"
                  checked={showDirectrix}
                  onChange={(e) => setShowDirectrix(e.target.checked)}
                  className="w-4 h-4 accent-[#38bdf8]"
                />
                <span className="text-sm text-[#cbd5e1]">Mostrar Directriz</span>
              </label>
            </>
          )}

          {conicType === 'ellipse' && (
            <>
              <ParameterSlider
                label="a (semi-eje mayor)"
                value={params.a || 3}
                min={1}
                max={6}
                step={0.1}
                onChange={(v) => updateParam('a', v)}
              />
              <ParameterSlider
                label="b (semi-eje menor)"
                value={params.b || 2}
                min={0.5}
                max={5}
                step={0.1}
                onChange={(v) => updateParam('b', v)}
              />
            </>
          )}

          {conicType === 'hyperbola' && (
            <>
              <ParameterSlider
                label="a (eje transversal)"
                value={params.a || 3}
                min={1}
                max={6}
                step={0.1}
                onChange={(v) => updateParam('a', v)}
              />
              <ParameterSlider
                label="b (eje conjugado)"
                value={params.b || 2}
                min={0.5}
                max={5}
                step={0.1}
                onChange={(v) => updateParam('b', v)}
              />
            </>
          )}
        </div>
      </ControlSection>

      {/* Display Settings */}
      <ControlSection
        title="🎨 Visualización"
        expanded={expanded.display}
        onToggle={() => toggleSection('display')}
      >
        <div className="bg-[#0b1220] p-3 rounded space-y-3">
          {/* Mode selector */}
          <div>
            <label className="text-xs font-semibold text-[#94a3b8] mb-2 block">Modo</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'standard', label: 'Estándar' },
                { value: 'scientific', label: 'Científico' },
                { value: 'artistic', label: 'Artístico' },
              ].map((mode) => (
                <motion.button
                  key={mode.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCanvasMode(mode.value)}
                  className={`text-xs font-medium py-2 rounded border transition ${
                    canvasMode === mode.value
                      ? 'bg-[#38bdf8] text-[#0f172a] border-[#38bdf8]'
                      : 'bg-[#1e293b] text-[#cbd5e1] border-[#334155]'
                  }`}
                >
                  {mode.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Style selector (artistic mode) */}
          {canvasMode === 'artistic' && (
            <div>
              <label className="text-xs font-semibold text-[#94a3b8] mb-2 block">Estilo</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'minimal', label: '⚪ Minimal', color: 'from-blue-500' },
                  { value: 'neon', label: '🟢 Neon', color: 'from-green-500' },
                  { value: 'galaxy', label: '🌌 Galaxy', color: 'from-pink-500' },
                  { value: 'blueprint', label: '📋 Blueprint', color: 'from-cyan-500' },
                ].map((style) => (
                  <motion.button
                    key={style.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCanvasStyle(style.value)}
                    className={`text-xs font-medium py-2 rounded border transition ${
                      canvasStyle === style.value
                        ? `bg-gradient-to-r ${style.color} to-transparent border-white`
                        : 'bg-[#1e293b] text-[#cbd5e1] border-[#334155]'
                    }`}
                  >
                    {style.label}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* 3D Toggle */}
          <label className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-[#1e293b] transition">
            <input
              type="checkbox"
              checked={show3D}
              onChange={(e) => setShow3D(e.target.checked)}
              className="w-4 h-4 accent-[#38bdf8]"
            />
            <span className="text-sm text-[#cbd5e1]">Vista 3D (Parábola)</span>
          </label>
        </div>
      </ControlSection>

      {/* Advanced Settings */}
      <ControlSection
        title="⚙️ Avanzado"
        expanded={expanded.advanced}
        onToggle={() => toggleSection('advanced')}
      >
        <div className="bg-[#0b1220] p-3 rounded space-y-2 text-xs text-[#cbd5e1]">
          <p className="text-[#94a3b8]">
            <strong>Ciencia Aplicada:</strong> Parábolas en antenas, elipses en medicina, hipérbolas en GPS.
          </p>
          <p className="text-[#94a3b8] mt-2">
            <strong>Interactividad:</strong> Arrastra focos en modo interactivo. Exporta datos con JSON.
          </p>
        </div>
      </ControlSection>

      {/* Legend */}
      <motion.div className="bg-[#0b1220] border border-[#334155] p-3 rounded mt-auto">
        <h4 className="text-xs font-bold text-[#38bdf8] mb-2">Leyenda Visual</h4>
        <div className="space-y-1 text-xs text-[#cbd5e1]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#38bdf8] rounded"></div>
            <span>Curva</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white rounded"></div>
            <span>Rayos entrantes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#22c5ff] rounded"></div>
            <span>Rayos reflejados</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#fbbf24] rounded-full border border-[#fbbf24]"></div>
            <span>Focos</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function ControlSection({ title, expanded, onToggle, children }) {
  return (
    <motion.div className="bg-[#0b1220] border border-[#334155] rounded overflow-hidden">
      <motion.button
        onClick={onToggle}
        className="w-full px-4 py-3 bg-[#0b1220] hover:bg-[#1e293b] transition flex justify-between items-center"
      >
        <span className="font-semibold text-[#38bdf8] text-sm">{title}</span>
        <motion.span
          initial={false}
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ▼
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-[#071126] p-3"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ParameterSlider({ label, value, min, max, step, onChange }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs font-medium text-[#cbd5e1]">{label}</label>
        <span className="text-xs font-semibold text-[#fbbf24]">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-2 bg-[#334155] rounded-lg appearance-none cursor-pointer accent-[#38bdf8]"
      />
    </div>
  )
}
