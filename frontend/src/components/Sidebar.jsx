import React from 'react'

export default function Sidebar({conicType, setConicType, params, setParams, showDirectrix, setShowDirectrix}){
  function updateParam(k, v){
    setParams(prev => ({...prev, [k]: parseFloat(v)}))
  }
  return (
    <aside className="w-72 bg-[#0f172a] border-r border-[#1e293b] p-4 overflow-auto max-h-screen flex flex-col">
      <h2 className="text-xl font-semibold text-[#38bdf8] mb-4">⚙️ Control</h2>
      
      <div className="flex-1 space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#cbd5e1] mb-2">Tipo de Cónica</label>
          <select 
            value={conicType} 
            onChange={(e)=>setConicType(e.target.value)} 
            className="w-full bg-[#0f172a] border border-[#334155] text-[#f8fafc] p-2 rounded hover:border-[#38bdf8] transition"
          >
            <option value="parabola">📡 Parábola</option>
            <option value="ellipse">🔵 Elipse</option>
            <option value="hyperbola">⚡ Hipérbola</option>
          </select>
        </div>

        {conicType === 'parabola' && (
          <div className="bg-[#0b1220] border border-[#334155] p-3 rounded space-y-3">
            <div>
              <label className="block text-sm text-[#cbd5e1] font-medium mb-2">
                Parámetro p (foco)
              </label>
              <input 
                type="range" 
                min="0.2" 
                max="5" 
                step="0.1" 
                value={params.p||1} 
                onChange={(e)=>updateParam('p', e.target.value)}
                className="w-full accent-[#38bdf8]"
              />
              <div className="text-sm text-[#fbbf24] font-semibold mt-1">p = {(params.p||1).toFixed(1)}</div>
            </div>

            <label className="flex items-center space-x-2 cursor-pointer bg-[#1e293b] p-2 rounded hover:bg-[#334155] transition">
              <input 
                type="checkbox" 
                checked={showDirectrix}
                onChange={(e) => setShowDirectrix(e.target.checked)}
                className="w-4 h-4 accent-[#38bdf8]"
              />
              <span className="text-sm text-[#cbd5e1]">Mostrar Directriz</span>
            </label>
          </div>
        )}

        {conicType === 'ellipse' && (
          <div className="bg-[#0b1220] border border-[#334155] p-3 rounded space-y-3">
            <div>
              <label className="block text-sm text-[#cbd5e1] font-medium mb-2">Semi-eje mayor (a)</label>
              <input 
                type="number"
                defaultValue={params.a||3} 
                onBlur={(e)=>updateParam('a', e.target.value)} 
                className="w-full p-2 bg-[#0f172a] border border-[#334155] text-[#f8fafc] rounded hover:border-[#38bdf8] transition"
              />
              <div className="text-sm text-[#fbbf24] font-semibold mt-1">a = {(params.a||3).toFixed(1)}</div>
            </div>
            <div>
              <label className="block text-sm text-[#cbd5e1] font-medium mb-2">Semi-eje menor (b)</label>
              <input 
                type="number"
                defaultValue={params.b||2} 
                onBlur={(e)=>updateParam('b', e.target.value)} 
                className="w-full p-2 bg-[#0f172a] border border-[#334155] text-[#f8fafc] rounded hover:border-[#38bdf8] transition"
              />
              <div className="text-sm text-[#fbbf24] font-semibold mt-1">b = {(params.b||2).toFixed(1)}</div>
            </div>
          </div>
        )}

        {conicType === 'hyperbola' && (
          <div className="bg-[#0b1220] border border-[#334155] p-3 rounded space-y-3">
            <div>
              <label className="block text-sm text-[#cbd5e1] font-medium mb-2">Eje transversal (a)</label>
              <input 
                type="number"
                defaultValue={params.a||3} 
                onBlur={(e)=>updateParam('a', e.target.value)} 
                className="w-full p-2 bg-[#0f172a] border border-[#334155] text-[#f8fafc] rounded hover:border-[#38bdf8] transition"
              />
              <div className="text-sm text-[#fbbf24] font-semibold mt-1">a = {(params.a||3).toFixed(1)}</div>
            </div>
            <div>
              <label className="block text-sm text-[#cbd5e1] font-medium mb-2">Eje conjugado (b)</label>
              <input 
                type="number"
                defaultValue={params.b||2} 
                onBlur={(e)=>updateParam('b', e.target.value)} 
                className="w-full p-2 bg-[#0f172a] border border-[#334155] text-[#f8fafc] rounded hover:border-[#38bdf8] transition"
              />
              <div className="text-sm text-[#fbbf24] font-semibold mt-1">b = {(params.b||2).toFixed(1)}</div>
            </div>
          </div>
        )}

        <div className="bg-[#1e293b]/30 border border-[#334155] p-3 rounded">
          <h3 className="text-sm font-semibold text-[#38bdf8] mb-2">📋 Leyenda</h3>
          <div className="space-y-1 text-xs text-[#cbd5e1]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#38bdf8] rounded"></div>
              <span>Curva cónica</span>
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
              <span>Foco</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-2 pt-4 border-t border-[#334155]">
        <button 
          onClick={()=>window.location.reload()}
          className="w-full bg-[#38bdf8] text-[#0f172a] px-3 py-2 rounded font-semibold hover:bg-[#22d3ee] transition"
        >
          🔄 Reset
        </button>
      </div>
    </aside>
  )
}
