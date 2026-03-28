import { Html } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'
import './Hotspot.css'

interface HotspotProps {
  position: [number, number, number]
  label: string
  onClick: () => void
}

export function Hotspot({ position, label, onClick }: HotspotProps) {
  const { camera } = useThree()
  const [opacity, setOpacity] = useState(1)
  const posVec = useRef(new THREE.Vector3(...position))

  useFrame(() => {
    const dist = camera.position.distanceTo(posVec.current)
    // Fade out when very close or very far
    const fadeNear = dist < 1.5 ? dist / 1.5 : 1
    const fadeFar = dist > 12 ? Math.max(0, 1 - (dist - 12) / 6) : 1
    setOpacity(fadeNear * fadeFar)
  })

  return (
    <Html
      position={position}
      center
      style={{
        opacity,
        pointerEvents: opacity > 0.1 ? 'auto' : 'none',
        transition: 'opacity 0.15s',
      }}
      // Prevent hotspot click from also triggering canvas click-to-move
      occlude={false}
    >
      <button
        className="hotspot"
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        aria-label={`View ${label}`}
      >
        <span className="hotspot__pulse" />
        <span className="hotspot__icon">+</span>
      </button>
      <span className="hotspot__label">{label}</span>
    </Html>
  )
}
