import { useRef, useMemo, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { productMeshNames } from '../data/products'

const INDICATOR_Y = 0.08
const MAX_MOVE_DISTANCE = 5.0
const MIN_MOVE_DISTANCE = 0.5
const WALK_LERP_SPEED = 0.08
const EYE_HEIGHT = 1.6

/** Create a chevron arrow shape */
function createChevronGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape()
  const w = 0.45
  const h = 0.5
  const t = 0.13

  shape.moveTo(0, h)
  shape.lineTo(w, 0)
  shape.lineTo(w - t, 0)
  shape.lineTo(0, h - t * 1.4)
  shape.lineTo(-(w - t), 0)
  shape.lineTo(-w, 0)
  shape.closePath()

  const geo = new THREE.ShapeGeometry(shape)
  geo.rotateX(-Math.PI / 2)
  geo.scale(0.55, 0.55, 0.55)
  return geo
}

function isProductMesh(obj: THREE.Object3D): boolean {
  let current: THREE.Object3D | null = obj
  while (current) {
    if (current.name && current.name in productMeshNames) return true
    current = current.parent
  }
  return false
}

function isFloorHit(hit: THREE.Intersection): boolean {
  // Must be near floor level — reject counter tops, tables, shelves etc.
  if (hit.point.y > 0.3) return false

  if (hit.face) {
    const worldNormal = hit.face.normal.clone()
    hit.object.updateWorldMatrix(true, false)
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(hit.object.matrixWorld)
    worldNormal.applyMatrix3(normalMatrix).normalize()
    return worldNormal.y > 0.7
  }
  return true
}

interface MoveIndicatorProps {
  isFocusing: boolean
  /** Shared drag state from CameraController */
  isDraggingRef: React.RefObject<boolean>
  /** Shared walk target — set by this component, read by CameraController */
  walkTargetRef: React.MutableRefObject<THREE.Vector3 | null>
}

export function MoveIndicator({ isFocusing, isDraggingRef, walkTargetRef }: MoveIndicatorProps) {
  const { camera, scene, gl } = useThree()

  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshBasicMaterial>(null)
  const raycaster = useRef(new THREE.Raycaster())
  const pointerNDC = useRef(new THREE.Vector2())
  const currentOpacity = useRef(0)
  const targetOpacity = useRef(0)
  const floorHitPoint = useRef<THREE.Vector3 | null>(null)
  const isValidTarget = useRef(false)
  const pointerActive = useRef(false)

  const geometry = useMemo(() => createChevronGeometry(), [])

  // Pointer move — just update NDC for raycasting each frame
  useEffect(() => {
    const el = gl.domElement

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      pointerNDC.current.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      )
      pointerActive.current = true
    }

    const onUp = () => {
      // Only move if CameraController says it wasn't a drag
      if (!isDraggingRef.current && isValidTarget.current && floorHitPoint.current && !isFocusing) {
        walkTargetRef.current = floorHitPoint.current.clone()
      }
    }

    const onLeave = () => {
      pointerActive.current = false
      targetOpacity.current = 0
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [gl, isFocusing, isDraggingRef, walkTargetRef])

  useFrame(() => {
    if (!meshRef.current || !matRef.current) return

    // Raycast from pointer to find floor
    if (pointerActive.current && !isFocusing && !isDraggingRef.current) {
      raycaster.current.setFromCamera(pointerNDC.current, camera)
      const intersects = raycaster.current.intersectObjects(scene.children, true)

      isValidTarget.current = false
      floorHitPoint.current = null

      for (const hit of intersects) {
        // Skip our own indicator mesh
        if (hit.object === meshRef.current) continue

        // If hovering over a product mesh, don't show move indicator
        if (isProductMesh(hit.object)) break

        // Only treat low, upward-facing surfaces as walkable floor
        if (isFloorHit(hit)) {
          const dx = hit.point.x - camera.position.x
          const dz = hit.point.z - camera.position.z
          const dist = Math.sqrt(dx * dx + dz * dz)

          if (dist >= MIN_MOVE_DISTANCE && dist <= MAX_MOVE_DISTANCE) {
            floorHitPoint.current = hit.point.clone()
            isValidTarget.current = true
          }
        }

        // Whether it was floor or not, stop at the first real surface hit —
        // don't look through counters/walls/furniture to find floor behind them
        break
      }
    } else if (isDraggingRef.current) {
      // While dragging, hide the indicator
      isValidTarget.current = false
      floorHitPoint.current = null
    }

    // Position and orient the chevron
    if (isValidTarget.current && floorHitPoint.current) {
      const target = floorHitPoint.current
      const angle = Math.atan2(
        target.x - camera.position.x,
        target.z - camera.position.z
      )
      meshRef.current.position.set(target.x, INDICATOR_Y, target.z)
      meshRef.current.rotation.set(0, angle + Math.PI, 0)
      targetOpacity.current = 0.75
      gl.domElement.style.cursor = 'pointer'
    } else {
      targetOpacity.current = 0
      gl.domElement.style.cursor = ''
    }

    // Smooth opacity transition
    currentOpacity.current += (targetOpacity.current - currentOpacity.current) * 0.2
    matRef.current.opacity = currentOpacity.current
    meshRef.current.visible = currentOpacity.current > 0.01
  })

  return (
    <mesh ref={meshRef} geometry={geometry} visible={false} renderOrder={999}>
      <meshBasicMaterial
        ref={matRef}
        color="#ffffff"
        transparent
        opacity={0}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

export { EYE_HEIGHT, WALK_LERP_SPEED }
