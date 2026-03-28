import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import type * as THREE from 'three'
import { productMeshNames } from '../data/products'

const MODEL_URL = '/UpdatedGlb.glb'

interface KitchenModelProps {
  onMeshClick?: (meshName: string) => void
}

export function KitchenModel({ onMeshClick }: KitchenModelProps) {
  const { scene } = useGLTF(MODEL_URL)

  // Expose scene for debugging
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__KITCHEN_SCENE__ = scene
  }, [scene])

  return (
    <primitive
      object={scene}
      onClick={(e: { object: THREE.Object3D; stopPropagation: () => void }) => {
        e.stopPropagation()
        if (!onMeshClick) return
        // Walk up the parent chain to find a recognized product mesh name
        let current: THREE.Object3D | null = e.object
        while (current) {
          if (current.name && current.name in productMeshNames) {
            onMeshClick(current.name)
            return
          }
          current = current.parent
        }
      }}
    />
  )
}

useGLTF.preload(MODEL_URL)
