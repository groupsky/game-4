import { useState, useEffect } from 'react'
import './ChallengePanel.css'

/**
 * ChallengePanel - Displays active challenge and validation feedback
 */
export function ChallengePanel({ challengeSystem, circuit }) {
  const [activeChallenge, setActiveChallenge] = useState(null)
  const [validationResult, setValidationResult] = useState(null)
  const [showAllChallenges, setShowAllChallenges] = useState(false)

  useEffect(() => {
    const challenge = challengeSystem.getActiveChallenge()
    setActiveChallenge(challenge)
  }, [challengeSystem])

  const handleCheckSolution = () => {
    if (!activeChallenge) return

    const result = challengeSystem.validate(activeChallenge.id, circuit)
    setValidationResult(result)

    // Update active challenge after validation
    setTimeout(() => {
      setActiveChallenge(challengeSystem.getActiveChallenge())
    }, 100)
  }

  const challenges = challengeSystem.getChallenges()
  const completedCount = challenges.filter(c => c.completed).length

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
                ⏱️ {challengeSystem.getTimeTracker().getFormattedTime()} / {Math.floor(activeChallenge.goalTime / 60)}:00
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${challengeSystem.getTimeTracker().getProgress(activeChallenge.goalTime) * 100}%` }}
                />
              </div>
            </div>
          )}

          {!activeChallenge.requiresTime && (
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
