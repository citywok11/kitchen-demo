import './MobileControls.css'

interface MobileControlsProps {
  onForwardStart: () => void
  onForwardEnd: () => void
  onBackwardStart: () => void
  onBackwardEnd: () => void
}

export function MobileControls({
  onForwardStart,
  onForwardEnd,
  onBackwardStart,
  onBackwardEnd,
}: MobileControlsProps) {
  return (
    <div className="mobile-controls">
      <button
        className="mobile-controls__btn"
        onPointerDown={onForwardStart}
        onPointerUp={onForwardEnd}
        onPointerLeave={onForwardEnd}
        aria-label="Move forward"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
      <button
        className="mobile-controls__btn"
        onPointerDown={onBackwardStart}
        onPointerUp={onBackwardEnd}
        onPointerLeave={onBackwardEnd}
        aria-label="Move backward"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>
  )
}
