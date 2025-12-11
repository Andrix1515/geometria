import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function Paraboloid3D({ p = 1, visible = true }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const animationIdRef = useRef(null)

  useEffect(() => {
    if (!visible || !containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0f172a)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(4, 3, 4)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Paraboloid geometry
    const geometry = new THREE.BufferGeometry()
    const vertices = []
    const indices = []

    const resolution = 32
    const height = 3

    for (let theta = 0; theta <= 2 * Math.PI; theta += (2 * Math.PI) / resolution) {
      for (let h = 0; h <= height; h += height / 20) {
        const r = Math.sqrt(h / p) // paraboloid equation: z = r²/(4p) => r = sqrt(4pz)
        vertices.push(r * Math.cos(theta), h - height / 2, r * Math.sin(theta))
      }
    }

    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < 20; j++) {
        const a = i * 21 + j
        const b = ((i + 1) % resolution) * 21 + j
        const c = i * 21 + j + 1
        const d = ((i + 1) % resolution) * 21 + j + 1

        indices.push(a, c, b)
        indices.push(b, c, d)
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))
    geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1))
    geometry.computeVertexNormals()

    // Material
    const material = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.6,
      roughness: 0.4,
      emissive: 0x0f172a,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.camera.left = -10
    directionalLight.shadow.camera.right = 10
    directionalLight.shadow.camera.top = 10
    directionalLight.shadow.camera.bottom = -10
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0x00ff88, 0.5)
    pointLight.position.set(0, p + 1, 0)
    scene.add(pointLight)

    // Focus point (animated)
    const focusGeometry = new THREE.SphereGeometry(0.15, 32, 32)
    const focusMaterial = new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
    const focusMesh = new THREE.Mesh(focusGeometry, focusMaterial)
    focusMesh.position.y = p
    scene.add(focusMesh)

    // Glow effect for focus
    const glowGeometry = new THREE.SphereGeometry(0.3, 32, 32)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.2,
    })
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial)
    glowMesh.position.copy(focusMesh.position)
    scene.add(glowMesh)

    // Sample rays (incoming and reflected)
    const rayGeometry = new THREE.BufferGeometry()
    const rayVertices = []

    // Incoming rays (from top)
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * 2 * Math.PI
      const distance = 1.5
      const x = distance * Math.cos(angle)
      const z = distance * Math.sin(angle)
      rayVertices.push(x, 2, z) // start
      rayVertices.push(x * 0.3, p - 0.3, z * 0.3) // point on paraboloid
    }

    // Reflected rays (to focus)
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * 2 * Math.PI
      const distance = 1.5 * 0.3
      const x = distance * Math.cos(angle)
      const z = distance * Math.sin(angle)
      rayVertices.push(x, p - 0.3, z) // point on paraboloid
      rayVertices.push(0, p + 0.2, 0) // focus
    }

    rayGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(rayVertices), 3))

    const rayMaterial = new THREE.LineBasicMaterial({ color: 0x00ff88, linewidth: 2 })
    const rays = new THREE.LineSegments(rayGeometry, rayMaterial)
    scene.add(rays)

    // Animation loop
    let time = 0
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)

      time += 0.005
      mesh.rotation.y += 0.005

      // Animate focus glow
      glowMesh.scale.set(
        1 + 0.3 * Math.sin(time * 2),
        1 + 0.3 * Math.sin(time * 2),
        1 + 0.3 * Math.sin(time * 2)
      )
      glowMesh.material.opacity = 0.2 + 0.1 * Math.sin(time * 2)

      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [p, visible])

  if (!visible) return null

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    />
  )
}
