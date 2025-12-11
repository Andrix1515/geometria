import React from 'react'

export default function MathPanel({type, params}){
  function renderFormula(){
    if(type === 'parabola'){
      return `Ecuación (canónica): y = x² / (4p)\nFoco: (0, p)\nDirectriz: y = -p`;
    }else if(type === 'ellipse'){
      return `Ecuación: x²/a² + y²/b² = 1\nFocos: ±c, c = √(a² - b²)\nExcentricidad: e = c/a`;
    }else{
      return `Ecuación: x²/a² - y²/b² = 1\nFocos: ±c, c = √(a² + b²)\nExcentricidad: e = c/a`;
    }
  }

  function renderExplanation(){
    if(type === 'parabola'){
      return {
        title: '📡 Parábola en Aplicaciones EM',
        description: 'La parábola es fundamental en antenas parabólicas. Los rayos EM paralelos que inciden sobre una parábola se reflejan y convergen en el foco, permitiendo concentrar señales débiles. Este principio se usa en telescopios, satélites y comunicaciones.',
        keyPoints: ['Foco concentra energía', 'Rayos paralelos → foco', 'Eficiencia de captación']
      }
    }else if(type === 'ellipse'){
      return {
        title: '🌍 Elipse en Aplicaciones EM',
        description: 'La elipse tiene una propiedad especial: cualquier rayo que parte de un foco se refleja en la superficie y pasa por el otro foco. Esto se usa en medicina (litotriptores) y en sistemas de ubicación por reflexión multitrayecto.',
        keyPoints: ['Propiedad de reflexión dual', 'Energía distribuida', 'Dos focos']
      }
    }else{
      return {
        title: '🎯 Hipérbola en Aplicaciones EM',
        description: 'Las hipérbolas son cruciales en sistemas de navegación TDOA (Time Difference of Arrival). Las diferencias en tiempos de llegada de señales desde múltiples fuentes definen hipérbolas que localizan el transmisor. Se usa en LORAN, GPS diferencial y localización.',
        keyPoints: ['Diferencia de distancias constante', 'Ubicación por TDOA', 'Dos ramas']
      }
    }
  }

  const explanation = renderExplanation()

  return (
    <div className="bg-[#0b1220] p-4 rounded text-sm text-[#f8fafc] flex flex-col h-full overflow-auto">
      <h3 className="text-lg text-[#38bdf8] mb-3 font-semibold">📐 Panel Matemático</h3>
      
      <div className="bg-[#0f172a] p-2 rounded mb-4 border border-[#334155]">
        <pre className="whitespace-pre-wrap text-[#cbd5e1] text-xs font-mono">{renderFormula()}</pre>
      </div>

      <div className="mb-4 text-xs text-gray-400">
        <strong className="text-[#94a3b8]">Parámetros:</strong>
        <div className="text-[#64748b] mt-1"> {JSON.stringify(params).replace(/"/g, '').replace(/{|}/g, '')} </div>
      </div>

      <hr className="border-[#334155] my-3" />

      <div className="bg-gradient-to-b from-[#1e293b] to-[#0b1220] p-3 rounded border border-[#334155] flex-1">
        <h4 className="text-[#fbbf24] font-semibold text-sm mb-2">{explanation.title}</h4>
        <p className="text-[#cbd5e1] text-xs leading-relaxed mb-2">
          {explanation.description}
        </p>
        <div className="bg-[#0f172a] p-2 rounded text-xs">
          <strong className="text-[#60a5fa]">Características clave:</strong>
          <ul className="list-disc list-inside text-[#94a3b8] mt-1 space-y-1">
            {explanation.keyPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-xs text-[#64748b] mt-4 p-2 bg-[#0f172a] rounded border-l-2 border-[#38bdf8]">
        💡 <strong>Consejo:</strong> Usa los controles a la izquierda para ajustar parámetros y observa cómo cambia la forma y el comportamiento de los rayos.
      </div>
    </div>
  )
}
