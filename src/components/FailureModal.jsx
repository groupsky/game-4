import { useEffect } from 'react'
import './FailureModal.css'

/**
 * FailureModal - Shows when challenge fails with helpful hints
 */
export function FailureModal({ show, challengeTitle, reason, hint, onRetry, onClose }) {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [show])

  if (!show) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content failure-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header failure-header">
          <h2>❌ Challenge Failed</h2>
        </div>

        <div className="modal-body">
          <h3>{challengeTitle}</h3>

          <div className="failure-reason">
            <p><strong>What went wrong:</strong></p>
            <p>{reason}</p>
          </div>

          {hint && (
            <div className="failure-hint">
              <p><strong>💡 Hint:</strong></p>
              <p>{hint}</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-retry" onClick={onRetry}>
            🔄 Try Again
          </button>
          <button className="btn-close" onClick={onClose}>
            ✖ Close
          </button>
        </div>
      </div>
    </div>
  )
}
