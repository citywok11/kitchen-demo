import * as THREE from 'three'

const _raycaster = new THREE.Raycaster()
const _direction = new THREE.Vector3()

/**
 * Check if movement in a given direction is blocked by scene geometry.
 * Casts a horizontal ray from the camera position at hip height
 * and returns true if the path is clear.
 */
export function isPathClear(
  origin: THREE.Vector3,
  yaw: number,
  angleOffset: number,
  sceneChildren: THREE.Object3D[],
  distance: number = 1.2,
  rayHeight: number = 0.8
): boolean {
  const totalAngle = yaw + angleOffset
  _direction.set(-Math.sin(totalAngle), 0, -Math.cos(totalAngle))

  // Cast from hip height to catch tables, counters, chairs
  const rayOrigin = new THREE.Vector3(origin.x, rayHeight, origin.z)

  _raycaster.set(rayOrigin, _direction)
  _raycaster.far = distance

  const hits = _raycaster.intersectObjects(sceneChildren, true)

  // Filter out very thin/small hits (hotspot HTML elements etc)
  for (const hit of hits) {
    if (hit.object.type === 'Mesh') {
      return false // blocked
    }
  }
  return true // clear
}

/**
 * Check clearance at multiple heights to catch both low and high obstacles.
 */
export function isMovementClear(
  origin: THREE.Vector3,
  yaw: number,
  angleOffset: number,
  sceneChildren: THREE.Object3D[],
  stepDistance: number = 1.2
): boolean {
  // Check at knee height, hip height, and chest height
  const heights = [0.4, 0.8, 1.2]
  return heights.every((h) =>
    isPathClear(origin, yaw, angleOffset, sceneChildren, stepDistance, h)
  )
}
