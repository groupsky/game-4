import { useState, useEffect } from 'react'
import './ChallengePanel.css'

/**
 * ChallengePanel - Displays active challenge and validation feedback
 */
export function ChallengePanel({ challengeSystem, circuit }) {
  const [activeChallenge, setActiveChallenge] = useState(null)
  const [validationResult, setValidationResult] = useState(null)
  const [showAllChallenges, setShowAllChallenges] = useState(false)
  const [, forceUpdate] = useState({})

  useEffect(() => {
    const challenge = challengeSystem.getActiveChallenge()
    setActiveChallenge(challenge)
  }, [challengeSystem])

  // Force re-render every 100ms to update timer display and check for challenge completion
  useEffect(() => {
    const interval = setInterval(() => {
      const currentChallenge = challengeSystem.getActiveChallenge()
      if (currentChallenge?.id !== activeChallenge?.id) {
        setActiveChallenge(currentChallenge)
        setValidationResult(null) // Clear validation result on challenge change
      }
      forceUpdate({})
    }, 100)

    return () => clearInterval(interval)
  }, [activeChallenge, challengeSystem])

  const handleCheckSolution = () => {
    if (!activeChallenge) return

    const result = challengeSystem.validate(activeChallenge.id, circuit)
    setValidationResult(result)

    // For manual-start time challenges, start timer on successful validation
    if (activeChallenge.requiresManualStart && result.success) {
      challengeSystem.getTimeTracker().start()
    }

    // Update active challenge after validation
    setTimeout(() => {
      setActiveChallenge(challengeSystem.getActiveChallenge())
    }, 100)
  }

  const challenges = challengeSystem.getChallenges()
  const completedCount = challenges.filter(c => c.completed).length

  // Format goal time as MM:SS
  const formatGoalTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  if (!activeChallenge) {
    return (
      <div className="challenge-panel">
        <div className="challenge-header">
          <h2>🎉 All Challenges Complete!</h2>
        </div>
        <div className="challenge-content">
          <p>You've completed all Act 1 challenges.</p>
          <p className="challenge-stats">
            {completedCount} / {challenges.length} challenges completed
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="challenge-panel">
      <div className="challenge-header">
        <h2>🎯 Current Challenge</h2>
        <button
          className="toggle-all-btn"
          onClick={() => setShowAllChallenges(!showAllChallenges)}
        >
          {showAllChallenges ? 'Hide' : 'Show All'} ({completedCount}/{challenges.length})
        </button>
      </div>

      {!showAllChallenges ? (
        <div className="challenge-content">
          <h3>{activeChallenge.title}</h3>
          <p className="challenge-description">{activeChallenge.description}</p>

          {activeChallenge.requiresTime && (
            <div className="time-display">
              <div className="timer">
                ⏱️ {challengeSystem.getTimeTracker().getFormattedTime()} / {formatGoalTime(activeChallenge.goalTime)}
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${challengeSystem.getTimeTracker().getProgress(activeChallenge.goalTime) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Show Check Solution button for non-time challenges OR time challenges requiring manual start (before timer running) */}
          {(!activeChallenge.requiresTime || (activeChallenge.requiresManualStart && !challengeSystem.getTimeTracker().running)) && (
            <button className="check-solution-btn" onClick={handleCheckSolution}>
              Check Solution
            </button>
          )}

          {validationResult && (
            <div className={`validation-result ${validationResult.success ? 'success' : 'failure'}`}>
              <span className="result-icon">{validationResult.success ? '✅' : '❌'}</span>
              <span className="result-message">{validationResult.message}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="all-challenges-list">
          {challenges.map((challenge, index) => (
            <div
              key={challenge.id}
              className={`challenge-item ${challenge.completed ? 'completed' : ''} ${!challenge.unlocked ? 'locked' : ''}`}
            >
              <span className="challenge-number">{index + 1}.</span>
              <span className="challenge-title">{challenge.title}</span>
              <span className="challenge-status">
                {challenge.completed ? '✅' : challenge.unlocked ? '🔓' : '🔒'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
