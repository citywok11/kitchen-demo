import { Canvas } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'
import { KitchenModel } from './KitchenModel'
import { CameraController } from './CameraController'
import { MoveIndicator } from './MoveIndicator'
import { Hotspots } from './Hotspots'
import { LoadingOverlay } from './LoadingOverlay'
import './KitchenScene.css'

interface KitchenSceneProps {
  focusTarget: {
    position: [number, number, number]
    lookAt: [number, number, number]
  } | null
  onFocusComplete: () => void
  onHotspotClick: (hotspotId: string, productId: string) => void
  onMeshClick: (meshName: string) => void
  resetKey?: number
}

/** Inner component that lives inside <Canvas> so useRef works with R3F context */
function SceneContents({
  focusTarget,
  onFocusComplete,
  onHotspotClick,
  onMeshClick,
  resetKey,
}: KitchenSceneProps) {
  // Shared refs between CameraController and MoveIndicator
  const isDraggingRef = useRef(false)
  const walkTargetRef = useRef<THREE.Vector3 | null>(null)

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 3]} intensity={0.8} />
      <Suspense fallback={null}>
        <KitchenModel onMeshClick={onMeshClick} />
        <Hotspots onHotspotClick={onHotspotClick} />
      </Suspense>
      <CameraController
        focusTarget={focusTarget}
        onFocusComplete={onFocusComplete}
        walkTargetRef={walkTargetRef}
        isDraggingRef={isDraggingRef}
        resetKey={resetKey}
      />
      <MoveIndicator
        isFocusing={!!focusTarget}
        isDraggingRef={isDraggingRef}
        walkTargetRef={walkTargetRef}
      />
    </>
  )
}

export function KitchenScene(props: KitchenSceneProps) {
  return (
    <div className="kitchen-scene">
      <Canvas
        camera={{ fov: 60, near: 0.1, far: 100, position: [3.5, 1.6, 5.5] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <SceneContents {...props} />
      </Canvas>
      <LoadingOverlay />
    </div>
  )
}
