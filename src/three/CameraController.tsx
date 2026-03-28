import { useRef, useEffect, useCallback } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { clampPitch, lerpValue, clampPosition } from '../utils/cameramath'
import type { Bounds } from '../utils/cameramath'

const EYE_HEIGHT = 1.6
const LOOK_SENSITIVITY = 0.003
const DRAG_THRESHOLD_MOUSE = 3   // px before mouse counts as drag
const DRAG_THRESHOLD_TOUCH = 1   // nearly instant for touch
const PITCH_MIN = -Math.PI / 3
const PITCH_MAX = Math.PI / 3
const FOCUS_LERP_SPEED = 0.04
const WALK_LERP_SPEED = 0.08

// Scene bounds — room roughly spans x:[0,7] z:[-1,8]
const DEFAULT_BOUNDS: Bounds = {
  min: [-0.5, 0, -1.5],
  max: [7.5, 3, 8.5],
}

const START_POSITION: [number, number, number] = [3.5, EYE_HEIGHT, 5.5]
const START_YAW = 0
const START_PITCH = -0.15

interface CameraControllerProps {
  focusTarget?: {
    position: [number, number, number]
    lookAt: [number, number, number]
  } | null
  onFocusComplete?: () => void
  bounds?: Bounds
  /** Shared ref: set by MoveIndicator when user clicks floor */
  walkTargetRef: React.MutableRefObject<THREE.Vector3 | null>
  /** Shared ref: read by MoveIndicator to know if user is dragging */
  isDraggingRef: React.MutableRefObject<boolean>
  /** Change this value to reset camera to starting position */
  resetKey?: number
}

export function CameraController({
  focusTarget,
  onFocusComplete,
  bounds = DEFAULT_BOUNDS,
  walkTargetRef,
  isDraggingRef,
  resetKey = 0,
}: CameraControllerProps) {
  const { camera, gl } = useThree()

  const yawRef = useRef(START_YAW)
  const pitchRef = useRef(START_PITCH)
  const posRef = useRef(new THREE.Vector3(...START_POSITION))
  const lastPointer = useRef({ x: 0, y: 0 })
  const isTouchInput = useRef(false)
  const isFocusing = useRef(false)
  const focusProgress = useRef(0)
  const focusStartPos = useRef(new THREE.Vector3())
  const focusStartYaw = useRef(0)
  const focusStartPitch = useRef(0)

  // Current walk animation target (clamped)
  const activeWalkTarget = useRef<THREE.Vector3 | null>(null)
  // Flag: animating back to start position
  const resetTarget = useRef(false)

  // Initialize camera on first mount
  const initialMount = useRef(true)
  useEffect(() => {
    camera.rotation.order = 'YXZ'
    camera.position.copy(posRef.current)
    camera.rotation.set(START_PITCH, START_YAW, 0, 'YXZ')
  }, [camera])

  // Animate camera back to starting position when resetKey changes
  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false
      return
    }
    // Trigger a focus animation toward the start position
    activeWalkTarget.current = null
    walkTargetRef.current = null
    isFocusing.current = true
    focusProgress.current = 0
    focusStartPos.current.copy(posRef.current)
    focusStartYaw.current = yawRef.current
    focusStartPitch.current = pitchRef.current
    resetTarget.current = true
  }, [resetKey, walkTargetRef])

  // Drag-to-look
  const handlePointerDown = useCallback((e: PointerEvent) => {
    isDraggingRef.current = false
    isTouchInput.current = e.pointerType === 'touch'
    lastPointer.current = { x: e.clientX, y: e.clientY }
  }, [isDraggingRef])

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (e.buttons === 0) {
      // No button held — this is a hover, clear any previous drag state
      isDraggingRef.current = false
      return
    }

    const dx = e.clientX - lastPointer.current.x
    const dy = e.clientY - lastPointer.current.y

    const threshold = isTouchInput.current ? DRAG_THRESHOLD_TOUCH : DRAG_THRESHOLD_MOUSE
    if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
      isDraggingRef.current = true
    }

    if (isDraggingRef.current && !isFocusing.current) {
      if (isTouchInput.current) {
        // 1:1 finger tracking — compute sensitivity from canvas size & FOV
        // so dragging across the full screen width ≈ rotates by the horizontal FOV
        const canvas = gl.domElement
        const vFov = (camera.fov * Math.PI) / 180
        const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect)
        const sensX = hFov / canvas.clientWidth
        const sensY = vFov / canvas.clientHeight
        yawRef.current -= dx * sensX
        pitchRef.current = clampPitch(
          pitchRef.current - dy * sensY,
          PITCH_MIN,
          PITCH_MAX
        )
      } else {
        yawRef.current -= dx * LOOK_SENSITIVITY
        pitchRef.current = clampPitch(
          pitchRef.current - dy * LOOK_SENSITIVITY,
          PITCH_MIN,
          PITCH_MAX
        )
      }
    }

    lastPointer.current = { x: e.clientX, y: e.clientY }
  }, [isDraggingRef, gl, camera])

  // pointerup — keep isDraggingRef as-is so MoveIndicator can check it
  // It gets reset on the next pointermove (hover) or pointerdown
  const handlePointerUp = useCallback(() => {}, [])

  useEffect(() => {
    const el = gl.domElement
    el.addEventListener('pointerdown', handlePointerDown)
    el.addEventListener('pointermove', handlePointerMove)
    el.addEventListener('pointerup', handlePointerUp)
    return () => {
      el.removeEventListener('pointerdown', handlePointerDown)
      el.removeEventListener('pointermove', handlePointerMove)
      el.removeEventListener('pointerup', handlePointerUp)
    }
  }, [gl, handlePointerDown, handlePointerMove, handlePointerUp])

  // Handle focus target changes
  useEffect(() => {
    if (focusTarget) {
      isFocusing.current = true
      focusProgress.current = 0
      focusStartPos.current.copy(posRef.current)
      focusStartYaw.current = yawRef.current
      focusStartPitch.current = pitchRef.current
    }
  }, [focusTarget])

  useFrame(() => {
    // Reset animation — smoothly return to starting position
    if (isFocusing.current && resetTarget.current) {
      focusProgress.current = Math.min(1, focusProgress.current + FOCUS_LERP_SPEED)
      const t = easeInOutCubic(focusProgress.current)

      posRef.current.set(
        lerpValue(focusStartPos.current.x, START_POSITION[0], t),
        lerpValue(focusStartPos.current.y, START_POSITION[1], t),
        lerpValue(focusStartPos.current.z, START_POSITION[2], t)
      )
      yawRef.current = lerpValue(focusStartYaw.current, START_YAW, t)
      pitchRef.current = lerpValue(focusStartPitch.current, START_PITCH, t)

      if (focusProgress.current >= 1) {
        isFocusing.current = false
        resetTarget.current = false
      }
    }

    // Focus animation — move toward a product hotspot
    if (isFocusing.current && !resetTarget.current && focusTarget) {
      focusProgress.current = Math.min(1, focusProgress.current + FOCUS_LERP_SPEED)
      const t = easeInOutCubic(focusProgress.current)

      posRef.current.set(
        lerpValue(focusStartPos.current.x, focusTarget.position[0], t),
        lerpValue(focusStartPos.current.y, focusTarget.position[1], t),
        lerpValue(focusStartPos.current.z, focusTarget.position[2], t)
      )

      const dx = focusTarget.lookAt[0] - focusTarget.position[0]
      const dy = focusTarget.lookAt[1] - focusTarget.position[1]
      const dz = focusTarget.lookAt[2] - focusTarget.position[2]
      const targetYaw = Math.atan2(-dx, -dz)
      const targetPitch = Math.atan2(dy, Math.sqrt(dx * dx + dz * dz))

      yawRef.current = lerpValue(focusStartYaw.current, targetYaw, t)
      pitchRef.current = lerpValue(focusStartPitch.current, targetPitch, t)

      if (focusProgress.current >= 1) {
        isFocusing.current = false
        onFocusComplete?.()
      }
    }

    // Pick up walk target from MoveIndicator
    if (walkTargetRef.current && !isFocusing.current) {
      const raw = walkTargetRef.current
      const clamped = clampPosition([raw.x, EYE_HEIGHT, raw.z], bounds)
      activeWalkTarget.current = new THREE.Vector3(clamped[0], clamped[1], clamped[2])
      walkTargetRef.current = null // consumed
    }

    // Smooth walk animation
    if (!isFocusing.current && activeWalkTarget.current) {
      const target = activeWalkTarget.current
      posRef.current.x += (target.x - posRef.current.x) * WALK_LERP_SPEED
      posRef.current.z += (target.z - posRef.current.z) * WALK_LERP_SPEED
      posRef.current.y = EYE_HEIGHT

      const dx = target.x - posRef.current.x
      const dz = target.z - posRef.current.z
      if (Math.sqrt(dx * dx + dz * dz) < 0.05) {
        posRef.current.set(target.x, EYE_HEIGHT, target.z)
        activeWalkTarget.current = null
      }
    }

    // Apply to camera
    camera.position.copy(posRef.current)
    camera.rotation.set(pitchRef.current, yawRef.current, 0, 'YXZ')
  })

  return null
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export { EYE_HEIGHT }
