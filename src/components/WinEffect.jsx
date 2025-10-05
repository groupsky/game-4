import { useEffect, useState, useRef } from 'react'
import './WinEffect.css'

/**
 * WinEffect - Victory celebration animation
 * Shows confetti and banner when challenge is completed
 */
export function WinEffect({ show, challengeTitle, onComplete }) {
  const [confetti, setConfetti] = useState([])
  const [showBanner, setShowBanner] = useState(false)
  const onCompleteRef = useRef(onComplete)

  // Keep onComplete ref updated without triggering effect
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (!show) {
      setConfetti([])
      setShowBanner(false)
      return
    }

    // Show banner immediately
    setShowBanner(true)

    // Generate confetti
    const pieces = []
    const colors = ['#FBBF24', '#F59E0B', '#16A34A', '#1E3A8A', '#DC2626', '#F97316']

    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2
      })
    }

    setConfetti(pieces)

    // Hide banner after 3 seconds
    const bannerTimer = setTimeout(() => {
      setShowBanner(false)
    }, 3000)

    // Call onComplete after animation finishes
    const completeTimer = setTimeout(() => {
      if (onCompleteRef.current) onCompleteRef.current()
    }, 3500)

    return () => {
      clearTimeout(bannerTimer)
      clearTimeout(completeTimer)
    }
  }, [show])

  if (!show) return null

  return (
    <div className="win-effect-overlay">
      {/* Confetti */}
      {confetti.map(piece => (
        <div
          key={piece.id}
          className="confetti"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`
          }}
        />
      ))}

      {/* Win Banner */}
      {showBanner && (
        <div className="win-banner glow-pulse">
          <h2>🎉 Challenge Complete! 🎉</h2>
          <p>{challengeTitle}</p>
        </div>
      )}
    </div>
  )
}
