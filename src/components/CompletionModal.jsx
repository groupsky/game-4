import { useEffect } from 'react'
import './CompletionModal.css'

/**
 * CompletionModal - Shows completion celebration with star rating
 */
export function CompletionModal({ show, challengeTitle, stars, onNext, onRetry, onClose }) {
  useEffect(() => {
    if (show) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [show])

  if (!show) return null

  const renderStars = () => {
    const starIcons = []
    for (let i = 0; i < 3; i++) {
      if (i < stars) {
        starIcons.push(<span key={i} className="star filled">⭐</span>)
      } else {
        starIcons.push(<span key={i} className="star empty">☆</span>)
      }
    }
    return starIcons
  }

  const getStarMessage = () => {
    if (stars === 3) {
      return 'Perfect! Optimal solution!'
    } else if (stars === 2) {
      return 'Great! Efficient solution!'
    } else {
      return 'Challenge completed!'
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✅ Challenge Complete!</h2>
        </div>

        <div className="modal-body">
          <h3>{challengeTitle}</h3>

          <div className="stars-display">
            {renderStars()}
          </div>

          <p className="star-message">{getStarMessage()}</p>

          {stars < 3 && (
            <div className="improvement-hint">
              <p>💡 Try using fewer components or finishing faster for more stars!</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {onRetry && (
            <button className="btn-retry" onClick={onRetry}>
              🔄 Retry for 3 Stars
            </button>
          )}
          {onNext && (
            <button className="btn-next" onClick={onNext}>
              ➡️ Next Challenge
            </button>
          )}
          <button className="btn-close" onClick={onClose}>
            ✖ Close
          </button>
        </div>
      </div>
    </div>
  )
}
