/**
 * StarRating - Calculates efficiency-based star rating for challenge completions
 *
 * ⭐ 1 Star: Any working solution
 * ⭐⭐ 2 Stars: Efficient solution (≤ optimal + 2 components)
 * ⭐⭐⭐ 3 Stars: Optimal solution (≤ optimal components AND ≤110% time if timed)
 */

export class StarRating {
  /**
   * Calculate star rating for a challenge completion
   * @param {Object} challenge - Challenge with stars metadata
   * @param {Object} circuit - Circuit with components array
   * @param {number} timeElapsed - Time taken (seconds), optional
   * @returns {number} Star rating (1-3)
   */
  static calculate(challenge, circuit, timeElapsed = null) {
    const componentCount = circuit.components.length
    const { optimalComponents, optimalTime } = challenge.stars

    let stars = 1 // Always get 1 star for completion

    // Check for 2 stars (efficient solution)
    if (componentCount <= optimalComponents + 2) {
      stars = 2
    }

    // Check for 3 stars (optimal solution)
    const hasOptimalComponents = componentCount <= optimalComponents
    const hasOptimalTime = !optimalTime || (timeElapsed !== null && timeElapsed <= optimalTime * 1.1)

    if (hasOptimalComponents && hasOptimalTime) {
      stars = 3
    }

    return stars
  }
}
