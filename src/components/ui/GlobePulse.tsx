// src/components/ui/GlobePulse.tsx
// Globe interactivo — Sección de mercados LATAM+USA
// Para activar el globe 3D real: npm install cobe
// Sin cobe, muestra un mapa SVG de fallback automáticamente

import { useEffect, useRef, useCallback, useState } from "react"

interface PulseMarker {
  id: string
  location: [number, number]  // [lat, lng]
  delay: number
  label?: string
}

// Mercados principales de CloserAI
export const CLOSER_AI_MARKERS: PulseMarker[] = [
  { id: "buenos-aires", location: [-34.6, -58.4],  delay: 0,   label: "Argentina" },
  { id: "new-york",     location: [40.71, -74.01],  delay: 0.5, label: "USA" },
  { id: "mexico-city",  location: [19.43, -99.13],  delay: 1,   label: "México" },
  { id: "miami",        location: [25.77, -80.19],  delay: 1.5, label: "Miami" },
  { id: "bogota",       location: [4.71, -74.07],   delay: 0.8, label: "Colombia" },
  { id: "sao-paulo",    location: [-23.55, -46.63], delay: 1.2, label: "Brasil" },
]

interface GlobePulseProps {
  markers?: PulseMarker[]
  className?: string
  speed?: number
}

export function GlobePulse({ markers = CLOSER_AI_MARKERS, className = "", speed = 0.003 }: GlobePulseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)
  const [cobeAvailable, setCobeAvailable] = useState(true)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY }
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
    isPausedRef.current = true
  }, [])

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        }
      }
    }
    window.addEventListener("pointermove", move, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    return () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerUp])

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    let globe: any = null
    let animationId: number
    let phi = 0

    async function init() {
      const width = canvas.offsetWidth
      if (width === 0 || globe) return
      try {
        const { default: createGlobe } = await import("cobe" as any)
        globe = createGlobe(canvas, {
          devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
          width, height: width,
          phi: 0, theta: 0.3, dark: 1, diffuse: 1.5,
          mapSamples: 16000, mapBrightness: 8,
          baseColor: [0.3, 0.25, 0.15],
          markerColor: [0.784, 0.659, 0.298], // #C9A84C
          glowColor: [0.2, 0.15, 0.05],
          markerElevation: 0,
          markers: markers.map(m => ({ location: m.location, size: 0.04, id: m.id })),
          arcs: [], arcColor: [0.784, 0.659, 0.298],
          arcWidth: 0.5, arcHeight: 0.25, opacity: 0.7,
        })
        const animate = () => {
          if (!isPausedRef.current) phi += speed
          globe.update({
            phi: phi + phiOffsetRef.current + dragOffset.current.phi,
            theta: 0.3 + thetaOffsetRef.current + dragOffset.current.theta,
          })
          animationId = requestAnimationFrame(animate)
        }
        animate()
        setTimeout(() => canvas && (canvas.style.opacity = "1"))
      } catch {
        setCobeAvailable(false)
      }
    }

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      const ro = new ResizeObserver(entries => {
        if (entries[0]?.contentRect.width > 0) { ro.disconnect(); init() }
      })
      ro.observe(canvas)
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      if (globe) globe.destroy()
    }
  }, [markers, speed])

  // Fallback elegante si cobe no está instalado
  if (!cobeAvailable) {
    return (
      <div className={`relative aspect-square flex items-center justify-center ${className}`}
        style={{ background: "radial-gradient(circle, rgba(201,168,76,.08) 0%, transparent 70%)", borderRadius: "50%" }}>
        <div className="text-center space-y-3">
          {markers.map(m => (
            <div key={m.id} className="flex items-center gap-2 justify-center">
              <span style={{ width: 8, height: 8, background: "#C9A84C", borderRadius: "50%", display: "inline-block" }} />
              <span style={{ color: "#C9A84C", fontSize: 12, fontFamily: "'DM Mono',monospace" }}>{m.label}</span>
            </div>
          ))}
          <p style={{ color: "#6B6860", fontSize: 10, fontFamily: "'DM Mono',monospace", marginTop: 12 }}>
            npm install cobe
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <style>{`
        @keyframes closerAI-pulse {
          0% { transform: scale(0.3); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{ width: "100%", height: "100%", cursor: "grab", opacity: 0, transition: "opacity 1.2s ease", borderRadius: "50%", touchAction: "none" }}
      />
    </div>
  )
}
