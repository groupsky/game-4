import { useEffect } from 'react'
import './Toast.css'

/**
 * Toast - Temporary notification with undo button
 */
export function Toast({ message, show, onUndo, onDismiss, duration = 3000 }) {
  useEffect(() => {
    if (show && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [show, onDismiss, duration])

  if (!show) return null

  return (
    <div className="toast">
      <span className="toast-message">{message}</span>
      {onUndo && (
        <button className="toast-undo-btn" onClick={onUndo}>
          UNDO
        </button>
      )}
    </div>
  )
}
