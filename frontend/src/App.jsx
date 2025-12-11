import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Canvas2DPro from './components/Canvas2DPro'
import AdvancedControlPanel from './components/AdvancedControlPanel'
import DynamicNarrativePanel from './components/DynamicNarrativePanel'
import TimelineScenarios from './components/TimelineScenarios'
import Paraboloid3D from './components/Paraboloid3D'
import HelpModal from './components/HelpModal'

export default function App() {
  const [conicType, setConicType] = useState('parabola')
  const [params, setParams] = useState({ p: 1.0 })
  const [simData, setSimData] = useState(null)
  const [showDirectrix, setShowDirectrix] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [canvasMode, setCanvasMode] = useState('standard') // standard | scientific | artistic
  const [canvasStyle, setCanvasStyle] = useState('minimal') // minimal | neon | galaxy | blueprint
  const [show3D, setShow3D] = useState(false)
  const [activeTab, setActiveTab] = useState('canvas') // canvas | scenarios

  useEffect(() => {
    fetchSim()
  }, [conicType, params])

  async function fetchSim() {
    try {
      const res = await fetch('http://localhost:8000/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: conicType, params }),
      })
      const j = await res.json()
      setSimData(j)
    } catch (err) {
      console.error('Error fetching simulation', err)
    }
  }

  const handleScenarioSelect = (scenario) => {
    setConicType(scenario.conic)
    setParams(scenario.params)
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-[#0f172a] via-[#1a2332] to-[#0d1b2a] overflow-hidden">
      {/* Animated Background */}
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute inset-0 bg-gradient-to-tr from-[#00eaff]/10 to-transparent pointer-events-none"
      />

      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-20 border-b border-[#334155] bg-[#0f172a]/80 backdrop-blur-sm px-6 py-4"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00eaff] to-[#38bdf8] bg-clip-text text-transparent">
              🌐 Cónicas EM Pro
            </h1>
            <p className="text-xs text-[#64748b] mt-1">
              Simulador Profesional de Cónicas Electromagnéticas • Versión 2.0
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowHelp(true)}
            className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#00eaff] text-[#0f172a] flex items-center justify-center font-bold hover:shadow-lg hover:shadow-[#38bdf8]/50 transition"
          >
            ?
          </motion.button>
        </div>
      </motion.div>

      {/* Help Modal */}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Left Panel - Controls */}
        <motion.aside
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-72 bg-gradient-to-b from-[#0f172a] to-[#0b1220] border-r border-[#334155] p-4 overflow-y-auto"
        >
          <AdvancedControlPanel
            conicType={conicType}
            setConicType={setConicType}
            params={params}
            setParams={setParams}
            showDirectrix={showDirectrix}
            setShowDirectrix={setShowDirectrix}
            canvasMode={canvasMode}
            setCanvasMode={setCanvasMode}
            canvasStyle={canvasStyle}
            setCanvasStyle={setCanvasStyle}
            show3D={show3D}
            setShow3D={setShow3D}
          />
        </motion.aside>

        {/* Center - Canvas */}
        <motion.main
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex-1 flex flex-col p-4 min-w-0"
        >
          {show3D && conicType === 'parabola' ? (
            <Paraboloid3D p={params.p} visible={true} />
          ) : (
            <Canvas2DPro
              simData={simData}
              conicType={conicType}
              showDirectrix={showDirectrix}
              params={params}
              mode={canvasMode}
              style={canvasStyle}
            />
          )}
        </motion.main>

        {/* Right Panel - Narrative & Scenarios */}
        <motion.aside
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-96 bg-gradient-to-b from-[#0f172a] to-[#0b1220] border-l border-[#334155] p-4 overflow-y-auto flex flex-col gap-4"
        >
          {/* Tab Navigation */}
          <div className="flex gap-2 bg-[#0b1220] p-1 rounded border border-[#334155]">
            {[
              { id: 'canvas', label: '📊 Análisis' },
              { id: 'scenarios', label: '📽️ Escenarios' },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 rounded text-xs font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#38bdf8] to-[#00eaff] text-[#0f172a]'
                    : 'text-[#cbd5e1] hover:text-[#38bdf8]'
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'canvas' && <DynamicNarrativePanel conicType={conicType} params={params} />}

          {activeTab === 'scenarios' && (
            <TimelineScenarios onScenarioSelect={handleScenarioSelect} />
          )}
        </motion.aside>
      </div>

      {/* Status Bar */}
      <motion.footer
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-20 border-t border-[#334155] bg-[#0f172a]/80 backdrop-blur-sm px-6 py-2 text-xs text-[#64748b]"
      >
        <div className="flex justify-between items-center">
          <div>
            Modo: <span className="text-[#38bdf8]">{canvasMode}</span>
            {canvasMode === 'artistic' && (
              <>
                {' '}
                | Estilo: <span className="text-[#38bdf8]">{canvasStyle}</span>
              </>
            )}
          </div>
          <div>
            {conicType.toUpperCase()} • Parámetros: {JSON.stringify(params).replace(/"/g, '').slice(1, -1)}
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
