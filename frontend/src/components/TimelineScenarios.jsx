import React, { useState } from 'react'
import { motion } from 'framer-motion'

const scenarios = [
  {
    id: 'parabola-reflection',
    title: 'Reflexión Parabólica',
    description: 'Rayos paralelos convergen en el foco de una parábola',
    conic: 'parabola',
    params: { p: 1.5 },
    narrative:
      'Los rayos EM paralelos (como ondas de satélite) impactan la superficie parabólica y se reflejan hacia el foco único, donde se concentra toda la energía. Este es el principio detrás de las antenas parabólicas y telescopios.',
    duration: 3000,
  },
  {
    id: 'ellipse-dual',
    title: 'Reflexión Dual Elíptica',
    description: 'Rayo desde un foco se refleja hacia el otro foco',
    conic: 'ellipse',
    params: { a: 3.5, b: 2 },
    narrative:
      'En una elipse, un rayo originado en un foco siempre se refleja hacia el otro foco. Esta propiedad se explota en los litotriptores médicos para concentrar ondas de choque.',
    duration: 4000,
  },
  {
    id: 'hyperbola-tdoa',
    title: 'Localización Hiperbólica (TDOA)',
    description: 'La diferencia de distancias a dos focos define la ubicación',
    conic: 'hyperbola',
    params: { a: 2.5, b: 2 },
    narrative:
      'En sistemas de navegación como LORAN o GPS diferencial, las hipérbolas son loci de diferencia constante de distancias. Múltiples hipérbolas convergen en la ubicación exacta del transmisor.',
    duration: 4000,
  },
]

export default function TimelineScenarios({ onScenarioSelect }) {
  const [activeScenario, setActiveScenario] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  const handlePlayScenario = (index) => {
    setActiveScenario(index)
    setIsPlaying(true)
    setProgress(0)

    const scenario = scenarios[index]
    if (onScenarioSelect) {
      onScenarioSelect(scenario)
    }

    // Simulate playback
    const startTime = Date.now()
    const duration = scenario.duration
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min(elapsed / duration, 1)
      setProgress(newProgress)

      if (newProgress >= 1) {
        clearInterval(interval)
        setIsPlaying(false)
      }
    }, 30)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-b from-[#1e293b] to-[#0b1220] rounded-lg p-4 border border-[#334155]"
    >
      <h3 className="text-lg font-bold text-[#38bdf8] mb-4">📽️ Escenarios de Aprendizaje</h3>

      {/* Scenario Display */}
      <div className="bg-[#0f172a] p-4 rounded mb-4 border border-[#334155]">
        <div className="mb-3">
          <h4 className="text-lg font-semibold text-[#fbbf24] mb-2">
            {scenarios[activeScenario].title}
          </h4>
          <p className="text-xs text-[#cbd5e1] leading-relaxed mb-3">
            {scenarios[activeScenario].narrative}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#334155] rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            className="h-full bg-gradient-to-r from-[#38bdf8] to-[#22d3ee]"
            transition={{ ease: 'linear' }}
          />
        </div>

        {/* Play button */}
        <div className="flex justify-center mt-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePlayScenario(activeScenario)}
            disabled={isPlaying}
            className="bg-[#38bdf8] text-[#0f172a] px-6 py-2 rounded font-semibold disabled:opacity-50"
          >
            {isPlaying ? '⏸️ Reproduciendo' : '▶️ Reproducir'}
          </motion.button>
        </div>
      </div>

      {/* Scenario selector */}
      <div className="space-y-2">
        {scenarios.map((scenario, idx) => (
          <motion.button
            key={scenario.id}
            whileHover={{ x: 4 }}
            onClick={() => {
              setActiveScenario(idx)
              handlePlayScenario(idx)
            }}
            className={`w-full text-left p-3 rounded border transition ${
              idx === activeScenario
                ? 'bg-[#38bdf8]/20 border-[#38bdf8]'
                : 'bg-[#0b1220] border-[#334155] hover:border-[#38bdf8]'
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-lg">
                {idx === 0 ? '🔴' : idx === 1 ? '🟣' : '🔵'}
              </span>
              <div>
                <p className="text-sm font-semibold text-[#cbd5e1]">{scenario.title}</p>
                <p className="text-xs text-[#94a3b8]">{scenario.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

export { scenarios }
