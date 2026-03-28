import { useState, useEffect, useRef } from 'react'
import { useProgress } from '@react-three/drei'
import './LoadingScreen.css'

export function LoadingOverlay() {
  const { progress, active } = useProgress()
  const [visible, setVisible] = useState(true)
  const [fadingOut, setFadingOut] = useState(false)
  const hasStartedLoading = useRef(false)

  // Track if loading ever became active
  if (active) hasStartedLoading.current = true

  useEffect(() => {
    if (fadingOut || !visible) return

    // Two scenarios:
    // 1. Fresh load: active becomes true, then false when done (progress=100)
    // 2. Cached/instant: active is never true, progress jumps to 100
    const isDone = !active && (progress >= 100 || !hasStartedLoading.current)

    if (isDone) {
      // Brief delay so the scene can render its first frame
      const showTimer = setTimeout(() => {
        setFadingOut(true)
        const removeTimer = setTimeout(() => setVisible(false), 400)
        return () => clearTimeout(removeTimer)
      }, hasStartedLoading.current ? 300 : 500)
      return () => clearTimeout(showTimer)
    }
  }, [active, progress, fadingOut, visible])

  if (!visible) return null

  return (
    <div className={`loading-screen${fadingOut ? ' loading-screen--fading' : ''}`}>
      <div className="loading-screen__content">
        <h1 className="loading-screen__title">Kitchen Demo</h1>
        <div className="loading-screen__bar-track">
          <div
            className="loading-screen__bar-fill"
            style={{ width: `${hasStartedLoading.current ? progress : 100}%` }}
          />
        </div>
        {hasStartedLoading.current && (
          <span className="loading-screen__percent">
            {Math.round(progress)}%
          </span>
        )}
      </div>
    </div>
  )
}
