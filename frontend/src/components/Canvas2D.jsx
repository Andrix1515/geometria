import React, {useRef, useEffect, useState} from 'react'

export default function Canvas2D({simData, conicType, showDirectrix, params}){
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [tooltip, setTooltip] = useState(null)
  const [mousePos, setMousePos] = useState({x: 0, y: 0})
  const [animProgress, setAnimProgress] = useState(0)

  // Animación suave para rayos
  useEffect(()=>{
    if(!simData || !simData.rays || simData.rays.length === 0) return
    let frame = 0
    const maxFrames = 30
    const interval = setInterval(()=>{
      frame++
      setAnimProgress(Math.min(frame / maxFrames, 1))
      if(frame >= maxFrames) clearInterval(interval)
    }, 16)
    return () => clearInterval(interval)
  }, [simData])

  const handleCanvasMouseMove = (e) => {
    const canvas = canvasRef.current
    if(!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setMousePos({x, y})

    // Detectar si está cerca de un foco
    if(simData?.focus) {
      const f = screenToLocal(simData.focus)
      const dist = Math.sqrt((x-f[0])**2 + (y-f[1])**2)
      if(dist < 12) {
        setTooltip({text: 'Foco', x, y})
        return
      }
    }
    if(simData?.foci) {
      for(const ff of simData.foci) {
        const f = screenToLocal(ff)
        const dist = Math.sqrt((x-f[0])**2 + (y-f[1])**2)
        if(dist < 12) {
          setTooltip({text: 'Foco', x, y})
          return
        }
      }
    }
    setTooltip(null)
  }

  const handleCanvasMouseLeave = () => {
    setTooltip(null)
  }

  function screenToLocal(pt) {
    const canvas = canvasRef.current
    if(!canvas) return [0, 0]
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    const pts = simData?.conic_points || []
    if(pts.length === 0) return [0, 0]
    let xs = pts.map(p=>p[0])
    let ys = pts.map(p=>p[1])
    const minx = Math.min(...xs), maxx = Math.max(...xs)
    const miny = Math.min(...ys), maxy = Math.max(...ys)
    const margin = 40
    const scaleX = (w - margin*2)/(maxx - minx + 1e-6)
    const scaleY = (h - margin*2)/(maxy - miny + 1e-6)
    const s = Math.min(scaleX, scaleY)
    const cx = (minx+maxx)/2, cy = (miny+maxy)/2
    return [(w/2) + (pt[0]-cx)*s, (h/2) - (pt[1]-cy)*s]
  }

  useEffect(()=>{
    const canvas = canvasRef.current
    if(!canvas) return
    const ctx = canvas.getContext('2d')
    const DPR = window.devicePixelRatio || 1
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    canvas.width = Math.floor(w * DPR)
    canvas.height = Math.floor(h * DPR)
    ctx.setTransform(DPR,0,0,DPR,0,0)
    
    // clear
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0,0,w,h)

    if(!simData) return
    const pts = simData.conic_points || []
    // compute bounds
    let xs = pts.map(p=>p[0])
    let ys = pts.map(p=>p[1])
    if(xs.length===0) return
    const minx = Math.min(...xs), maxx = Math.max(...xs)
    const miny = Math.min(...ys), maxy = Math.max(...ys)
    const margin = 40
    const scaleX = (w - margin*2)/(maxx - minx + 1e-6)
    const scaleY = (h - margin*2)/(maxy - miny + 1e-6)
    const s = Math.min(scaleX, scaleY)
    const cx = (minx+maxx)/2, cy = (miny+maxy)/2

    function toScreen(pt){
      return [ (w/2) + (pt[0]-cx)*s, (h/2) - (pt[1]-cy)*s ]
    }

    // draw directrix if enabled (parábola)
    if(showDirectrix && conicType === 'parabola' && params?.p) {
      const p = params.p
      const directrixY = -p
      const screen1 = toScreen([minx, directrixY])
      const screen2 = toScreen([maxx, directrixY])
      ctx.beginPath()
      ctx.lineWidth = 1
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)'
      ctx.setLineDash([4, 4])
      ctx.moveTo(screen1[0], screen1[1])
      ctx.lineTo(screen2[0], screen2[1])
      ctx.stroke()
      ctx.setLineDash([])
      // label directrix
      ctx.fillStyle = 'rgba(168, 85, 247, 0.6)'
      ctx.font = '11px sans-serif'
      ctx.fillText('Directriz', screen1[0] + 5, screen1[1] - 5)
    }

    // draw conic
    ctx.beginPath()
    ctx.lineWidth = 2.5
    ctx.strokeStyle = '#38bdf8'
    for(let i=0;i<pts.length;i++){
      const p = toScreen(pts[i])
      if(i===0) ctx.moveTo(p[0], p[1])
      else ctx.lineTo(p[0], p[1])
    }
    ctx.stroke()

    // draw label "Curva"
    if(pts.length > 0) {
      const labelPt = pts[Math.floor(pts.length/2)]
      const p = toScreen(labelPt)
      ctx.fillStyle = '#38bdf8'
      ctx.font = 'bold 12px sans-serif'
      ctx.fillText('Curva', p[0] + 8, p[1] - 8)
    }

    // draw rays with animation
    const rays = simData.rays || []
    const numRays = rays.length
    const rayLineWidth = numRays > 30 ? 0.8 : 1.2
    
    for(let rayIdx = 0; rayIdx < rays.length; rayIdx++){
      const r = rays[rayIdx]
      ctx.beginPath()
      ctx.lineWidth = rayLineWidth
      
      // Alternar colores: rayos entrantes blancos, reflejados azules
      const isReflected = rayIdx % 2 === 1
      ctx.strokeStyle = isReflected 
        ? 'rgba(34, 197, 255, ' + (0.6 + 0.4 * animProgress) + ')' 
        : 'rgba(248, 250, 252, ' + (0.6 + 0.4 * animProgress) + ')'
      
      const drawLength = Math.ceil(r.length * animProgress) || 1
      for(let i=0; i<drawLength; i++){
        const p = toScreen(r[i])
        if(i===0) ctx.moveTo(p[0], p[1])
        else ctx.lineTo(p[0], p[1])
      }
      ctx.stroke()
    }

    // draw "Rayos EM" label
    if(rays.length > 0) {
      ctx.fillStyle = '#f0f0f0'
      ctx.font = '11px sans-serif'
      ctx.fillText('Rayos EM', 20, h - 20)
    }

    // draw focus/foci with improved visualization
    if(simData.focus){
      const f = toScreen(simData.focus)
      // glow effect
      ctx.fillStyle = 'rgba(248, 250, 252, 0.15)'
      ctx.beginPath(); ctx.arc(f[0], f[1], 8, 0, 2*Math.PI); ctx.fill()
      // border
      ctx.strokeStyle = 'rgba(248, 250, 252, 0.5)'
      ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.arc(f[0], f[1], 6, 0, 2*Math.PI); ctx.stroke()
      // center
      ctx.fillStyle = '#f8fafc'
      ctx.beginPath(); ctx.arc(f[0], f[1], 4, 0, 2*Math.PI); ctx.fill()
      // label
      ctx.fillStyle = '#fbbf24'
      ctx.font = 'bold 11px sans-serif'
      ctx.fillText('Foco', f[0] + 8, f[1] - 8)
    }
    if(simData.foci){
      for(const ff of simData.foci){
        const f = toScreen(ff)
        // glow
        ctx.fillStyle = 'rgba(248, 250, 252, 0.15)'
        ctx.beginPath(); ctx.arc(f[0], f[1], 8, 0, 2*Math.PI); ctx.fill()
        // border
        ctx.strokeStyle = 'rgba(248, 250, 252, 0.5)'
        ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.arc(f[0], f[1], 6, 0, 2*Math.PI); ctx.stroke()
        // center
        ctx.fillStyle = '#f8fafc'
        ctx.beginPath(); ctx.arc(f[0], f[1], 4, 0, 2*Math.PI); ctx.fill()
        // label
        ctx.fillStyle = '#fbbf24'
        ctx.font = 'bold 11px sans-serif'
        ctx.fillText('Foco', f[0] + 8, f[1] - 8)
      }
    }

  }, [simData, conicType, showDirectrix, params, animProgress])

  // Captura de imagen
  const downloadCanvas = () => {
    const canvas = canvasRef.current
    if(!canvas) return
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `conica-${Date.now()}.png`
    link.click()
  }

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <canvas 
        ref={canvasRef}
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={handleCanvasMouseLeave}
        style={{width:'100%', height:'100%', borderRadius:8, background:'#071126', cursor: 'crosshair'}} 
      />
      {tooltip && (
        <div 
          className="absolute bg-[#1e293b] text-[#fbbf24] text-xs px-2 py-1 rounded border border-[#334155] pointer-events-none"
          style={{left: tooltip.x + 10, top: tooltip.y - 20}}
        >
          {tooltip.text}
        </div>
      )}
      <button 
        onClick={downloadCanvas}
        className="absolute bottom-2 right-2 bg-[#38bdf8] text-[#0f172a] px-3 py-1 rounded text-xs font-medium hover:bg-[#22d3ee] transition"
      >
        📸 Guardar
      </button>
    </div>
  )
}
