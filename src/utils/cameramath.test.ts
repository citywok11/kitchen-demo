import { describe, it, expect } from 'vitest'
import { clampPitch, lerpValue, yawPitchToDirection, clampPosition } from './cameramath'

describe('clampPitch', () => {
  it('returns pitch within bounds unchanged', () => {
    expect(clampPitch(0.5, -1, 1)).toBe(0.5)
  })

  it('clamps pitch above max', () => {
    expect(clampPitch(2, -1, 1)).toBe(1)
  })

  it('clamps pitch below min', () => {
    expect(clampPitch(-2, -1, 1)).toBe(-1)
  })
})

describe('lerpValue', () => {
  it('returns start at t=0', () => {
    expect(lerpValue(0, 10, 0)).toBe(0)
  })

  it('returns end at t=1', () => {
    expect(lerpValue(0, 10, 1)).toBe(10)
  })

  it('returns midpoint at t=0.5', () => {
    expect(lerpValue(0, 10, 0.5)).toBe(5)
  })
})

describe('yawPitchToDirection', () => {
  it('returns forward vector for yaw=0, pitch=0', () => {
    const [x, y, z] = yawPitchToDirection(0, 0)
    expect(x).toBeCloseTo(0)
    expect(y).toBeCloseTo(0)
    expect(z).toBeCloseTo(-1)
  })

  it('returns right vector for yaw=PI/2', () => {
    const [x, y, z] = yawPitchToDirection(Math.PI / 2, 0)
    expect(x).toBeCloseTo(-1)
    expect(y).toBeCloseTo(0)
    expect(z).toBeCloseTo(0)
  })

  it('applies pitch to y component', () => {
    const [, y] = yawPitchToDirection(0, Math.PI / 4)
    expect(y).toBeCloseTo(Math.sin(Math.PI / 4))
  })
})

describe('clampPosition', () => {
  it('returns position within bounds unchanged', () => {
    const result = clampPosition([1, 1.6, 2], { min: [-5, 0, -5], max: [5, 3, 5] })
    expect(result).toEqual([1, 1.6, 2])
  })

  it('clamps position outside bounds', () => {
    const result = clampPosition([10, 1.6, -10], { min: [-5, 0, -5], max: [5, 3, 5] })
    expect(result).toEqual([5, 1.6, -5])
  })
})
