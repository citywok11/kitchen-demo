export function clampPitch(pitch: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, pitch))
}

export function lerpValue(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function lerpVec3(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [
    lerpValue(a[0], b[0], t),
    lerpValue(a[1], b[1], t),
    lerpValue(a[2], b[2], t),
  ]
}

/**
 * Convert yaw (horizontal) and pitch (vertical) angles to a unit direction vector.
 * yaw=0, pitch=0 points along -Z (three.js convention).
 */
export function yawPitchToDirection(
  yaw: number,
  pitch: number
): [number, number, number] {
  const cosPitch = Math.cos(pitch)
  return [
    -Math.sin(yaw) * cosPitch,
    Math.sin(pitch),
    -Math.cos(yaw) * cosPitch,
  ]
}

export interface Bounds {
  min: [number, number, number]
  max: [number, number, number]
}

export function clampPosition(
  pos: [number, number, number],
  bounds: Bounds
): [number, number, number] {
  return [
    Math.min(bounds.max[0], Math.max(bounds.min[0], pos[0])),
    Math.min(bounds.max[1], Math.max(bounds.min[1], pos[1])),
    Math.min(bounds.max[2], Math.max(bounds.min[2], pos[2])),
  ]
}
