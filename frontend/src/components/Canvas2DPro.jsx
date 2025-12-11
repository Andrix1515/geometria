import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'

/**
 * Canvas2DPro: Versión mejorada con animaciones GSAP y efectos visuales
 * Soporta dos modos: Standard y Artistic
 */
export default function Canvas2DPro({
  simData,
  conicType,
  showDirectrix,
  params,
  mode = 'standard', // 'standard' | 'artistic'
  style = 'minimal',  // 'neon', 'galaxy', 'minimal', 'blueprint'
  onFocusClick = () => {},
}) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const rayAnimRef = useRef(null)
  const [tooltip, setTooltip] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [selectedFocus, setSelectedFocus] = useState(null)
  const [draggingFocus, setDraggingFocus] = useState(false)

  // Colores según estilo artístico
  const getColorScheme = () => {
    switch (style) {
      case 'neon':
        return {
          curve: '#00ff88',
          rayIn: '#ffff00',
          rayOut: '#ff00ff',
          focus: '#00ffff',
          bg: '#000011',
          grid: 'rgba(0,255,255,0.1)',
          glow: 'rgba(0,255,136,0.3)',
        }
      case 'galaxy':
        return {
          curve: '#ff69b4',
          rayIn: '#87ceeb',
          rayOut: '#ff1493',
          focus: '#ffd700',
          bg: '#0a0e27',
          grid: 'rgba(255,105,180,0.08)',
          glow: 'rgba(255,105,180,0.2)',
        }
      case 'blueprint':
        return {
          curve: '#00b4d8',
          rayIn: '#90e0ef',
          rayOut: '#0077b6',
          focus: '#ffd60a',
          bg: '#001f3f',
          grid: 'rgba(0,180,216,0.15)',
          glow: 'rgba(0,180,216,0.2)',
        }
      default: // minimal
        return {
          curve: '#38bdf8',
          rayIn: 'rgba(248,250,252,0.7)',
          rayOut: 'rgba(34,197,255,0.7)',
          focus: '#fbbf24',
          bg: '#0f172a',
          grid: 'rgba(51,65,85,0.3)',
          glow: 'rgba(248,250,252,0.15)',
        }
    }
  }

  const colors = getColorScheme()

  useEffect(() => {
    if (!simData || simData.rays?.length === 0) return
    
    // Animar rayos con GSAP
    if (rayAnimRef.current) {
      gsap.killTweensOf(rayAnimRef.current)
    }
    
    rayAnimRef.current = { progress: 0 }
    gsap.to(rayAnimRef.current, {
      progress: 1,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: () => drawCanvas(),
    })
  }, [simData, mode, style])

  function screenToLocal(pt) {
    const canvas = canvasRef.current
    if (!canvas) return [0, 0]
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    const pts = simData?.conic_points || []
    if (pts.length === 0) return [0, 0]
    let xs = pts.map((p) => p[0])
    let ys = pts.map((p) => p[1])
    const minx = Math.min(...xs),
      maxx = Math.max(...xs)
    const miny = Math.min(...ys),
      maxy = Math.max(...ys)
    const margin = 40
    const scaleX = (w - margin * 2) / (maxx - minx + 1e-6)
    const scaleY = (h - margin * 2) / (maxy - miny + 1e-6)
    const s = Math.min(scaleX, scaleY)
    const cx = (minx + maxx) / 2,
      cy = (miny + maxy) / 2
    return [(w / 2) + (pt[0] - cx) * s, (h / 2) - (pt[1] - cy) * s]
  }

  function getTransform() {
    const canvas = canvasRef.current
    if (!canvas) return { toScreen: (p) => p, transform: {} }
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    const pts = simData?.conic_points || []
    if (pts.length === 0) return { toScreen: (p) => p, transform: {} }
    let xs = pts.map((p) => p[0])
    let ys = pts.map((p) => p[1])
    const minx = Math.min(...xs),
      maxx = Math.max(...xs)
    const miny = Math.min(...ys),
      maxy = Math.max(...ys)
    const margin = 40
    const scaleX = (w - margin * 2) / (maxx - minx + 1e-6)
    const scaleY = (h - margin * 2) / (maxy - miny + 1e-6)
    const s = Math.min(scaleX, scaleY)
    const cx = (minx + maxx) / 2,
      cy = (miny + maxy) / 2

    return {
      toScreen: (pt) => [(w / 2) + (pt[0] - cx) * s, (h / 2) - (pt[1] - cy) * s],
      transform: { minx, maxx, miny, maxy, s, cx, cy, w, h },
    }
  }

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const DPR = window.devicePixelRatio || 1
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    canvas.width = Math.floor(w * DPR)
    canvas.height = Math.floor(h * DPR)
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0)

    // Clear
    ctx.fillStyle = colors.bg
    ctx.fillRect(0, 0, w, h)

    if (!simData) return
    const pts = simData.conic_points || []
    if (pts.length === 0) return

    const { toScreen, transform } = getTransform()

    // Draw grid (scientific mode)
    if (mode === 'scientific') {
      drawGrid(ctx, w, h, transform, colors.grid)
    }

    // Draw directrix
    if (showDirectrix && conicType === 'parabola' && params?.p) {
      const p = params.p
      const directrixY = -p
      const screen1 = toScreen([transform.minx, directrixY])
      const screen2 = toScreen([transform.maxx, directrixY])
      ctx.beginPath()
      ctx.lineWidth = 1.5
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)'
      ctx.setLineDash([5, 5])
      ctx.moveTo(screen1[0], screen1[1])
      ctx.lineTo(screen2[0], screen2[1])
      ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = 'rgba(168, 85, 247, 0.6)'
      ctx.font = 'bold 11px sans-serif'
      ctx.fillText('Directriz', screen1[0] + 8, screen1[1] - 8)
    }

    // Draw conic
    drawConic(ctx, pts, toScreen, colors, mode)

    // Draw rays with animation
    const rayProgress = rayAnimRef.current?.progress ?? 1
    drawRays(ctx, simData.rays || [], toScreen, colors, rayProgress, mode)

    // Draw focos
    drawFoci(ctx, simData.focus, simData.foci, toScreen, colors, selectedFocus, mode)

    // Draw labels
    if (mode === 'standard' || mode === 'scientific') {
      drawLabels(ctx, pts, simData.rays?.length || 0, toScreen, colors)
    }

    // Draw normals (scientific mode)
    if (mode === 'scientific') {
      drawNormals(ctx, pts, toScreen, colors)
    }
  }

  const handleCanvasMouseMove = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setMousePos({ x, y })

    if (draggingFocus && selectedFocus && mode === 'interactive') {
      // Actualizar foco arrastrado
      onFocusClick({ focus: selectedFocus, x: e.clientX, y: e.clientY })
      return
    }

    // Detectar hover sobre focos
    if (simData?.focus) {
      const f = screenToLocal(simData.focus)
      const dist = Math.sqrt((x - f[0]) ** 2 + (y - f[1]) ** 2)
      if (dist < 14) {
        setTooltip({ text: 'Foco Principal', x, y, color: colors.focus })
        return
      }
    }
    if (simData?.foci) {
      for (let i = 0; i < simData.foci.length; i++) {
        const ff = simData.foci[i]
        const f = screenToLocal(ff)
        const dist = Math.sqrt((x - f[0]) ** 2 + (y - f[1]) ** 2)
        if (dist < 14) {
          setTooltip({
            text: `Foco ${i + 1}`,
            x,
            y,
            color: colors.focus,
          })
          return
        }
      }
    }
    setTooltip(null)
  }

  const handleCanvasMouseDown = (e) => {
    if (mode !== 'interactive') return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (simData?.focus) {
      const f = screenToLocal(simData.focus)
      const dist = Math.sqrt((x - f[0]) ** 2 + (y - f[1]) ** 2)
      if (dist < 14) {
        setSelectedFocus('primary')
        setDraggingFocus(true)
      }
    }
  }

  const handleCanvasMouseUp = () => {
    setDraggingFocus(false)
  }

  const handleCanvasMouseLeave = () => {
    setTooltip(null)
    setDraggingFocus(false)
  }

  const downloadCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `conica-${Date.now()}.png`
    link.click()
  }

  const download4K = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const offCanvas = document.createElement('canvas')
    const scale = 4
    offCanvas.width = canvas.width * scale
    offCanvas.height = canvas.height * scale
    const ctx = offCanvas.getContext('2d')
    ctx.scale(scale, scale)
    ctx.drawImage(canvas, 0, 0)

    const link = document.createElement('a')
    link.href = offCanvas.toDataURL('image/png')
    link.download = `conica-4k-${Date.now()}.png`
    link.click()
  }

  const exportJSON = () => {
    const data = {
      type: conicType,
      params,
      conicPoints: simData?.conic_points || [],
      focus: simData?.focus,
      foci: simData?.foci,
      rays: simData?.rays || [],
      timestamp: new Date().toISOString(),
    }
    const link = document.createElement('a')
    link.href =
      'data:application/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(data, null, 2))
    link.download = `conica-data-${Date.now()}.json`
    link.click()
  }

  useEffect(() => {
    drawCanvas()
  }, [mode, style, colors])

  return (
    <div ref={containerRef} className="relative w-full h-full flex flex-col">
      <canvas
        ref={canvasRef}
        onMouseMove={handleCanvasMouseMove}
        onMouseDown={handleCanvasMouseDown}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseLeave}
        style={{
          width: '100%',
          flex: 1,
          borderRadius: 8,
          background: colors.bg,
          cursor: mode === 'interactive' ? 'grab' : 'crosshair',
        }}
      />

      {/* Tooltip */}
      {tooltip && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bg-[#1e293b] text-white text-xs px-3 py-1 rounded border border-[#334155] pointer-events-none"
          style={{
            left: tooltip.x + 12,
            top: tooltip.y - 28,
            borderColor: tooltip.color + '80',
          }}
        >
          {tooltip.text}
        </motion.div>
      )}

      {/* Control Buttons */}
      <div className="flex justify-end gap-2 mt-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={downloadCanvas}
          className="bg-[#38bdf8] text-[#0f172a] px-3 py-1 rounded text-xs font-medium hover:bg-[#22d3ee] transition"
        >
          📸 PNG
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={download4K}
          className="bg-[#60a5fa] text-white px-3 py-1 rounded text-xs font-medium hover:bg-[#3b82f6] transition"
        >
          🎬 4K
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportJSON}
          className="bg-[#8b5cf6] text-white px-3 py-1 rounded text-xs font-medium hover:bg-[#7c3aed] transition"
        >
          📊 JSON
        </motion.button>
      </div>
    </div>
  )
}

// ============= FUNCIONES DE DIBUJO =============

function drawConic(ctx, pts, toScreen, colors, mode) {
  ctx.beginPath()
  ctx.lineWidth = mode === 'artistic' ? 3 : 2.5
  ctx.strokeStyle = colors.curve
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  if (mode === 'artistic') {
    // Efecto glow para modo artístico
    ctx.shadowColor = colors.glow
    ctx.shadowBlur = 15
  }

  for (let i = 0; i < pts.length; i++) {
    const p = toScreen(pts[i])
    if (i === 0) ctx.moveTo(p[0], p[1])
    else ctx.lineTo(p[0], p[1])
  }
  ctx.stroke()
  ctx.shadowColor = 'transparent'
}

function drawRays(ctx, rays, toScreen, colors, progress, mode) {
  const numRays = rays.length
  const rayLineWidth = numRays > 40 ? 0.8 : numRays > 20 ? 1.2 : 1.8

  for (let rayIdx = 0; rayIdx < rays.length; rayIdx++) {
    const r = rays[rayIdx]
    ctx.beginPath()
    ctx.lineWidth = rayLineWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const isReflected = rayIdx % 2 === 1
    ctx.strokeStyle = isReflected ? colors.rayOut : colors.rayIn

    if (mode === 'artistic') {
      ctx.shadowColor = isReflected ? colors.rayOut + '60' : colors.rayIn + '60'
      ctx.shadowBlur = 8
    }

    const drawLength = Math.ceil(r.length * progress) || 1
    for (let i = 0; i < drawLength; i++) {
      const p = toScreen(r[i])
      if (i === 0) ctx.moveTo(p[0], p[1])
      else ctx.lineTo(p[0], p[1])
    }
    ctx.stroke()
  }
  ctx.shadowColor = 'transparent'
}

function drawFoci(ctx, focus, foci, toScreen, colors, selectedFocus, mode) {
  if (focus) {
    const f = toScreen(focus)
    const isSelected = selectedFocus === 'primary'
    const radius = isSelected ? 8 : 6

    if (mode === 'artistic') {
      ctx.shadowColor = colors.focus + '80'
      ctx.shadowBlur = 20
    }

    ctx.fillStyle = 'rgba(248, 250, 252, 0.2)'
    ctx.beginPath()
    ctx.arc(f[0], f[1], radius + 4, 0, 2 * Math.PI)
    ctx.fill()

    ctx.strokeStyle = colors.focus
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(f[0], f[1], radius, 0, 2 * Math.PI)
    ctx.stroke()

    ctx.fillStyle = colors.focus
    ctx.beginPath()
    ctx.arc(f[0], f[1], radius * 0.6, 0, 2 * Math.PI)
    ctx.fill()

    ctx.shadowColor = 'transparent'
  }

  if (foci) {
    for (let i = 0; i < foci.length; i++) {
      const ff = foci[i]
      const f = toScreen(ff)
      const isSelected = selectedFocus === `foci_${i}`
      const radius = isSelected ? 8 : 6

      if (mode === 'artistic') {
        ctx.shadowColor = colors.focus + '80'
        ctx.shadowBlur = 20
      }

      ctx.fillStyle = 'rgba(248, 250, 252, 0.2)'
      ctx.beginPath()
      ctx.arc(f[0], f[1], radius + 4, 0, 2 * Math.PI)
      ctx.fill()

      ctx.strokeStyle = colors.focus
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(f[0], f[1], radius, 0, 2 * Math.PI)
      ctx.stroke()

      ctx.fillStyle = colors.focus
      ctx.beginPath()
      ctx.arc(f[0], f[1], radius * 0.6, 0, 2 * Math.PI)
      ctx.fill()

      ctx.shadowColor = 'transparent'
    }
  }
}

function drawLabels(ctx, pts, numRays, toScreen, colors) {
  if (pts.length > 0) {
    const labelPt = pts[Math.floor(pts.length / 2)]
    const p = toScreen(labelPt)
    ctx.fillStyle = colors.curve
    ctx.font = 'bold 12px sans-serif'
    ctx.fillText('Curva', p[0] + 12, p[1] - 12)
  }

  if (numRays > 0) {
    ctx.fillStyle = colors.rayIn
    ctx.font = '11px sans-serif'
    ctx.fillText('Rayos EM', 20, 25)
  }
}

function drawGrid(ctx, w, h, transform, gridColor) {
  const step = 1
  const { minx, maxx, miny, maxy, s, cx, cy } = transform

  ctx.strokeStyle = gridColor
  ctx.lineWidth = 0.5
  ctx.setLineDash([2, 2])

  const startX = Math.ceil(minx / step) * step
  const endX = Math.floor(maxx / step) * step
  const startY = Math.ceil(miny / step) * step
  const endY = Math.floor(maxy / step) * step

  for (let x = startX; x <= endX; x += step) {
    const screenPt = [(w / 2) + (x - cx) * s, (h / 2) - (startY - cy) * s]
    ctx.beginPath()
    ctx.moveTo(screenPt[0], (h / 2) - (startY - cy) * s)
    ctx.lineTo(screenPt[0], (h / 2) - (endY - cy) * s)
    ctx.stroke()
  }

  for (let y = startY; y <= endY; y += step) {
    const screenPt = [(w / 2) + (startX - cx) * s, (h / 2) - (y - cy) * s]
    ctx.beginPath()
    ctx.moveTo((w / 2) + (startX - cx) * s, screenPt[1])
    ctx.lineTo((w / 2) + (endX - cx) * s, screenPt[1])
    ctx.stroke()
  }

  ctx.setLineDash([])
}

function drawNormals(ctx, pts, toScreen, colors) {
  const step = Math.floor(pts.length / 8) || 1
  ctx.strokeStyle = 'rgba(255, 200, 0, 0.5)'
  ctx.lineWidth = 1

  for (let i = 0; i < pts.length; i += step) {
    const p = pts[i]
    const prev = i > 0 ? pts[i - 1] : p
    const next = i < pts.length - 1 ? pts[i + 1] : p

    const dx = next[0] - prev[0]
    const dy = next[1] - prev[1]
    const len = Math.sqrt(dx * dx + dy * dy) || 1
    const nx = -dy / len
    const ny = dx / len

    const screenP = toScreen(p)
    const screenEnd = toScreen([p[0] + nx * 0.3, p[1] + ny * 0.3])

    ctx.beginPath()
    ctx.moveTo(screenP[0], screenP[1])
    ctx.lineTo(screenEnd[0], screenEnd[1])
    ctx.stroke()
  }
}
