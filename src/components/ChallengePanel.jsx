import { useState, useEffect } from 'react'
import { WinEffect } from './WinEffect'
import { CompletionModal } from './CompletionModal'
import { StarRating } from '../challenges/StarRating'
import './ChallengePanel.css'

/**
 * ChallengePanel - Displays active challenge and validation feedback
 */
export function ChallengePanel({ challengeSystem, circuit, isRunning, onChallengeChange }) {
  const [activeChallenge, setActiveChallenge] = useState(null)
  const [validationResult, setValidationResult] = useState(null)
  const [showAllChallenges, setShowAllChallenges] = useState(false)
  const [, forceUpdate] = useState({})
  const [showWinEffect, setShowWinEffect] = useState(false)
  const [completedChallengeTitle, setCompletedChallengeTitle] = useState('')
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [completionStars, setCompletionStars] = useState(0)

  useEffect(() => {
    const challenge = challengeSystem.getActiveChallenge()
    setActiveChallenge(challenge)
  }, [challengeSystem])

  const handleSelectChallenge = (challengeId) => {
    const challenge = challengeSystem.getChallenges().find(c => c.id === challengeId)
    if (challenge && challenge.unlocked) {
      challengeSystem.setActiveChallenge(challengeId)
      setActiveChallenge(challenge)
      setValidationResult(null) // Clear previous validation
      setShowAllChallenges(false) // Close challenge list
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Space: Check Solution (when not typing and simulation running)
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault()
        if (isRunning && activeChallenge && (!activeChallenge.requiresTime || (activeChallenge.requiresManualStart && !challengeSystem.getTimeTracker().running))) {
          handleCheckSolution()
        }
      }
      // H: Toggle Show All Challenges
      if (e.code === 'KeyH' && e.target === document.body) {
        e.preventDefault()
        setShowAllChallenges(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [activeChallenge, challengeSystem, showAllChallenges, isRunning])

  // Force re-render every 100ms to update timer display and check for challenge completion
  useEffect(() => {
    const interval = setInterval(() => {
      const currentChallenge = challengeSystem.getActiveChallenge()

      // Check if current challenge just became completed (time-based challenges)
      if (activeChallenge && !activeChallenge.completed && currentChallenge?.completed && currentChallenge.id === activeChallenge.id) {
        // Challenge just completed - show completion modal
        setCompletedChallengeTitle(currentChallenge.title)
        setShowWinEffect(true)

        // Calculate star rating
        const timeElapsed = challengeSystem.getTimeTracker().getConditionTime()
        const stars = currentChallenge.stars
          ? StarRating.calculate(currentChallenge, circuit, timeElapsed)
          : 3

        setCompletionStars(stars)
        setShowCompletionModal(true)
        setActiveChallenge(currentChallenge) // Update to completed state
      } else if (currentChallenge?.id !== activeChallenge?.id) {
        setActiveChallenge(currentChallenge)
        setValidationResult(null) // Clear validation result on challenge change
      }

      forceUpdate({})
    }, 100)

    return () => clearInterval(interval)
  }, [activeChallenge, challengeSystem])

  const handleCheckSolution = () => {
    if (!activeChallenge) return
    // Only validate when simulation is running
    if (!isRunning) return

    const result = challengeSystem.validate(activeChallenge.id, circuit)
    setValidationResult(result)

    // Show win effect and completion modal if challenge completed
    if (result.success) {
      setCompletedChallengeTitle(activeChallenge.title)
      setShowWinEffect(true)

      // Calculate star rating
      const timeElapsed = challengeSystem.getTimeTracker().getConditionTime()
      const stars = activeChallenge.stars
        ? StarRating.calculate(activeChallenge, circuit, timeElapsed)
        : 3 // Default to 3 stars if no star criteria defined

      setCompletionStars(stars)

      // Show modal immediately
      setShowCompletionModal(true)
    }

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

  const handleNextChallenge = () => {
    setShowCompletionModal(false)

    // Find the sequential next challenge (N → N+1)
    const allChallenges = challengeSystem.getChallenges()
    const currentIndex = allChallenges.findIndex(c => c.id === activeChallenge?.id)

    if (currentIndex >= 0 && currentIndex < allChallenges.length - 1) {
      const nextChallenge = allChallenges[currentIndex + 1]

      // Set this as the active challenge
      challengeSystem.setActiveChallenge(nextChallenge.id)
      setActiveChallenge(nextChallenge)
      setValidationResult(null)

      // Notify parent to reload circuit (will load saved or empty)
      if (onChallengeChange) {
        onChallengeChange()
      }
    }
  }

  const handleRetryChallenge = () => {
    setShowCompletionModal(false)
    // Clear the current circuit to start fresh
    // This will be handled by parent component
  }

  const handleCloseModal = () => {
    setShowCompletionModal(false)
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
    <>
      <WinEffect
        show={showWinEffect}
        challengeTitle={completedChallengeTitle}
        onComplete={() => setShowWinEffect(false)}
      />
      <CompletionModal
        show={showCompletionModal}
        challengeTitle={completedChallengeTitle}
        stars={completionStars}
        onNext={handleNextChallenge}
        onRetry={completionStars < 3 ? handleRetryChallenge : null}
        onClose={handleCloseModal}
      />
      <div className="challenge-panel">
        <div className="challenge-header">
          <h2>🎯 Current Challenge</h2>
        <button
          className="toggle-all-btn"
          onClick={() => setShowAllChallenges(!showAllChallenges)}
          title="Press H to toggle"
        >
          {showAllChallenges ? 'Hide' : 'Show All'} ({completedCount}/{challenges.length}) <kbd>H</kbd>
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
          {/* Only show when simulation is running */}
          {isRunning && (!activeChallenge.requiresTime || (activeChallenge.requiresManualStart && !challengeSystem.getTimeTracker().running)) && (
            <button className="check-solution-btn" onClick={handleCheckSolution} title="Press Space to check">
              Check Solution <kbd>Space</kbd>
            </button>
          )}

          {/* Show message when simulation is stopped */}
          {!isRunning && (
            <div className="validation-result" style={{ background: '#FEF3C7', borderColor: '#F59E0B', color: '#92400E' }}>
              <span className="result-icon">ℹ️</span>
              <span className="result-message">Start the simulation to test your circuit</span>
            </div>
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
          {/* Basics (1-10) */}
          <div className="challenge-tier">
            <div className="tier-header">⭐ Basics (1-10)</div>
            {challenges.slice(0, 10).map((challenge, index) => (
              <div
                key={challenge.id}
                className={`challenge-item ${challenge.completed ? 'completed' : ''} ${!challenge.unlocked ? 'locked' : ''} ${activeChallenge?.id === challenge.id ? 'active' : ''}`}
                onClick={() => handleSelectChallenge(challenge.id)}
                style={{ cursor: challenge.unlocked ? 'pointer' : 'not-allowed' }}
              >
                <span className="challenge-number">{index + 1}.</span>
                <span className="challenge-title">{challenge.title}</span>
                <span className="challenge-status">
                  {challenge.completed ? '✅' : challenge.unlocked ? '🔓' : '🔒'}
                </span>
              </div>
            ))}
          </div>

          {/* Intermediate (11-20) */}
          <div className="challenge-tier">
            <div className="tier-header">⭐⭐ Intermediate (11-20)</div>
            {challenges.slice(10, 20).map((challenge, index) => (
              <div
                key={challenge.id}
                className={`challenge-item ${challenge.completed ? 'completed' : ''} ${!challenge.unlocked ? 'locked' : ''} ${activeChallenge?.id === challenge.id ? 'active' : ''}`}
                onClick={() => handleSelectChallenge(challenge.id)}
                style={{ cursor: challenge.unlocked ? 'pointer' : 'not-allowed' }}
              >
                <span className="challenge-number">{index + 11}.</span>
                <span className="challenge-title">{challenge.title}</span>
                <span className="challenge-status">
                  {challenge.completed ? '✅' : challenge.unlocked ? '🔓' : '🔒'}
                </span>
              </div>
            ))}
          </div>

          {/* Advanced (21-30) */}
          <div className="challenge-tier">
            <div className="tier-header">⭐⭐⭐ Advanced (21-30)</div>
            {challenges.slice(20, 30).map((challenge, index) => (
              <div
                key={challenge.id}
                className={`challenge-item ${challenge.completed ? 'completed' : ''} ${!challenge.unlocked ? 'locked' : ''} ${activeChallenge?.id === challenge.id ? 'active' : ''}`}
                onClick={() => handleSelectChallenge(challenge.id)}
                style={{ cursor: challenge.unlocked ? 'pointer' : 'not-allowed' }}
              >
                <span className="challenge-number">{index + 21}.</span>
                <span className="challenge-title">{challenge.title}</span>
                <span className="challenge-status">
                  {challenge.completed ? '✅' : challenge.unlocked ? '🔓' : '🔒'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </>
  )
}
