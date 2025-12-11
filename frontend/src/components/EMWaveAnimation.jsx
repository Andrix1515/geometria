import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'

/**
 * EMWaveAnimation: Visualizador de ondas electromagnéticas propagándose
 * Anima la propagación de ondas EM según el tipo de cónica
 */
export default function EMWaveAnimation({ conicType = 'parabola', isActive = false }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const timeRef = useRef(0)

  useEffect(() => {
    if (!isActive) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const DPR = window.devicePixelRatio || 1

    const resizeCanvas = () => {
      const w = canvas.parentElement?.clientWidth || 300
      const h = canvas.parentElement?.clientHeight || 300
      canvas.width = w * DPR
      canvas.height = h * DPR
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }

    resizeCanvas()

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      timeRef.current += 0.02

      const w = canvas.width / DPR
      const h = canvas.height / DPR
      const cx = w / 2
      const cy = h / 2

      // Clear
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)'
      ctx.fillRect(0, 0, w, h)

      const t = timeRef.current

      if (conicType === 'parabola') {
        // Ondas irradiadas desde el foco (arriba)
        drawParabolaWaves(ctx, t, cx, cy - 60, w, h)
      } else if (conicType === 'ellipse') {
        // Ondas reflejadas entre dos focos
        drawEllipseWaves(ctx, t, cx, cy, w, h)
      } else {
        // Ondas divergentes
        drawHyperbolaWaves(ctx, t, cx, cy, w, h)
      }
    }

    animate()

    const handleResize = () => resizeCanvas()
    window.addEventListener('resize', handleResize)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [conicType, isActive])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '8px',
      }}
    />
  )
}

function drawParabolaWaves(ctx, t, cx, cy, w, h) {
  const maxRadius = Math.max(w, h) * 0.4
  const waveLength = 20
  const speed = 100

  for (let wave = 0; wave < 3; wave++) {
    const phase = (t * speed - wave * 30) % maxRadius
    const alpha = 1 - phase / maxRadius

    ctx.strokeStyle = `rgba(0, 234, 255, ${alpha * 0.6})`
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(cx, cy, phase, 0, 2 * Math.PI)
    ctx.stroke()

    // Wave interference pattern
    const innerAlpha = Math.max(0, 1 - (phase - 15) / 20)
    ctx.strokeStyle = `rgba(56, 189, 248, ${innerAlpha * 0.3})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(cx, cy, phase - 15, 0, 2 * Math.PI)
    ctx.stroke()
  }

  // Center glow
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30)
  grad.addColorStop(0, 'rgba(251, 191, 36, 0.8)')
  grad.addColorStop(1, 'rgba(251, 191, 36, 0)')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(cx, cy, 30, 0, 2 * Math.PI)
  ctx.fill()
}

function drawEllipseWaves(ctx, t, cx, cy, w, h) {
  const foci = [
    { x: cx - 50, y: cy },
    { x: cx + 50, y: cy },
  ]

  const speed = 60
  const maxDist = 150

  foci.forEach((focus, idx) => {
    const phase = (t * speed + idx * 180) % maxDist

    // Primary wave
    ctx.strokeStyle = `rgba(255, 105, 180, ${1 - phase / maxDist})`
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(focus.x, focus.y, phase, 0, 2 * Math.PI)
    ctx.stroke()

    // Secondary wave
    const secondaryPhase = (phase - 20) % maxDist
    if (secondaryPhase > 0) {
      ctx.strokeStyle = `rgba(255, 105, 180, ${(1 - secondaryPhase / maxDist) * 0.4})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(focus.x, focus.y, secondaryPhase, 0, 2 * Math.PI)
      ctx.stroke()
    }

    // Glow
    const grad = ctx.createRadialGradient(focus.x, focus.y, 0, focus.x, focus.y, 25)
    grad.addColorStop(0, `rgba(255, 105, 180, ${0.6 * (1 - phase / maxDist)})`)
    grad.addColorStop(1, 'rgba(255, 105, 180, 0)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(focus.x, focus.y, 25, 0, 2 * Math.PI)
    ctx.fill()
  })
}

function drawHyperbolaWaves(ctx, t, cx, cy, w, h) {
  const foci = [
    { x: cx - 60, y: cy },
    { x: cx + 60, y: cy },
  ]

  const speed = 70
  const maxRadius = 180

  foci.forEach((focus, idx) => {
    const phase = (t * speed - idx * 90) % maxRadius

    // Diverging waves
    const branches = 3
    for (let branch = 0; branch < branches; branch++) {
      const angle = (Math.PI / branches) * branch + (t * 0.5)

      ctx.strokeStyle = `rgba(34, 197, 255, ${(1 - phase / maxRadius) * 0.7})`
      ctx.lineWidth = 2

      // Hyperbolic curve approximation
      ctx.beginPath()
      for (let r = 0; r <= phase; r += 5) {
        const x = focus.x + r * Math.cos(angle)
        const y = focus.y + r * Math.sin(angle)
        if (r === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }

    // Center point
    ctx.fillStyle = `rgba(34, 197, 255, ${0.8 - phase / maxRadius})`
    ctx.beginPath()
    ctx.arc(focus.x, focus.y, 4, 0, 2 * Math.PI)
    ctx.fill()
  })

  // Connection line
  ctx.strokeStyle = 'rgba(34, 197, 255, 0.1)'
  ctx.lineWidth = 1
  ctx.setLineDash([5, 5])
  ctx.beginPath()
  ctx.moveTo(foci[0].x, foci[0].y)
  ctx.lineTo(foci[1].x, foci[1].y)
  ctx.stroke()
  ctx.setLineDash([])
}
