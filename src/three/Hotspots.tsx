import { Hotspot } from './Hotspot'
import { hotspots } from '../data/products'
import { getProductById } from '../data/products'

interface HotspotsProps {
  onHotspotClick: (hotspotId: string, productId: string) => void
}

export function Hotspots({ onHotspotClick }: HotspotsProps) {
  return (
    <>
      {hotspots.map((hs) => {
        const product = getProductById(hs.productId)
        if (!product) return null
        return (
          <Hotspot
            key={hs.id}
            position={hs.position}
            label={product.name}
            onClick={() => onHotspotClick(hs.id, hs.productId)}
          />
        )
      })}
    </>
  )
}
