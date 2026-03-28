export interface Product {
  id: string
  name: string
  price: number
  description: string
  specs: Record<string, string>
  meshName: string
  imagePath: string
}

export interface HotspotConfig {
  id: string
  productId: string
  position: [number, number, number]
  cameraLookFrom: [number, number, number]
  cameraTarget: [number, number, number]
}

export const products: Product[] = [
  {
    id: 'knife-set',
    name: 'Knife Set',
    price: 89.99,
    description:
      'Premium chef knife set with ergonomic handles and precision-forged blades. Includes chef knife, santoku, paring knife, and utility knife.',
    specs: {
      Material: 'High-carbon stainless steel',
      'Handle Material': 'Pakkawood',
      'Number of Pieces': '4',
      Weight: '1.2 kg',
    },
    meshName: 'KnifeSet',
    imagePath: '/img/knifeset.PNG',
  },
  {
    id: 'coffee-cup',
    name: 'Coffee Cup',
    price: 24.99,
    description:
      'Hand-thrown ceramic coffee cup with a smooth matte glaze. Comfortable to hold, microwave and dishwasher safe.',
    specs: {
      Material: 'Ceramic',
      Capacity: '350 ml',
      Dimensions: '9 x 8 cm',
      Weight: '280 g',
    },
    meshName: 'CoffeeCup',
    imagePath: '/img/coffeeCup.PNG',
  },
  {
    id: 'toaster',
    name: 'Toaster',
    price: 59.99,
    description:
      'Two-slot toaster with adjustable browning control and defrost function. Sleek stainless steel body with cool-touch exterior.',
    specs: {
      Material: 'Stainless steel',
      Power: '800W',
      Slots: '2',
      Dimensions: '26 x 16 x 18 cm',
    },
    meshName: 'Toaster',
    imagePath: '/img/toaster.PNG',
  },
]

// Mesh names to match for click detection (includes the second coffee cup's Blender name)
export const productMeshNames: Record<string, string> = {
  KnifeSet: 'knife-set',
  CoffeeCup: 'coffee-cup',
  Cylinder102_Cylinder098: 'coffee-cup', // second coffee cup in the GLB
  Toaster: 'toaster',
}

// 4 hotspot instances: two CoffeeCup hotspots, one each for KnifeSet and Toaster
// Positions derived from GLB scene inspection
export const hotspots: HotspotConfig[] = [
  {
    id: 'knife-set-hotspot',
    productId: 'knife-set',
    // KnifeSet mesh at [3.73, 1.19, 3.27] on DiningTable
    position: [3.73, 1.55, 3.27],
    cameraLookFrom: [3.73, 1.6, 4.5],
    cameraTarget: [3.73, 1.19, 3.27],
  },
  {
    id: 'coffee-cup-1-hotspot',
    productId: 'coffee-cup',
    // CoffeeCup group at [2.18, 1.12, 3.16]
    position: [2.18, 1.48, 3.16],
    cameraLookFrom: [2.18, 1.6, 4.4],
    cameraTarget: [2.18, 1.12, 3.16],
  },
  {
    id: 'coffee-cup-2-hotspot',
    productId: 'coffee-cup',
    // Second cup (Cylinder102_Cylinder098) at [2.94, 1.12, 3.15]
    position: [2.94, 1.48, 3.15],
    cameraLookFrom: [2.94, 1.6, 4.4],
    cameraTarget: [2.94, 1.12, 3.15],
  },
  {
    id: 'toaster-hotspot',
    productId: 'toaster',
    // Toaster group at [5.25, 1.19, -0.39] on KitchenCounter
    position: [5.25, 1.55, -0.39],
    cameraLookFrom: [5.25, 1.6, 0.8],
    cameraTarget: [5.25, 1.19, -0.39],
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}
