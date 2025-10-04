import { describe, it, expect } from 'vitest'
import { StarRating } from '../StarRating.js'

describe('StarRating', () => {
  describe('Non-timed challenges', () => {
    it('should award 1 star for any working solution', () => {
      const challenge = {
        stars: {
          optimalComponents: 2
        }
      }

      const circuit = {
        components: [1, 2, 3, 4, 5, 6, 7, 8] // 8 components (way over optimal)
      }

      const stars = StarRating.calculate(challenge, circuit)
      expect(stars).toBe(1)
    })

    it('should award 2 stars for efficient solution (optimal + 2)', () => {
      const challenge = {
        stars: {
          optimalComponents: 2
        }
      }

      const circuit = {
        components: [1, 2, 3, 4] // 4 components (optimal + 2)
      }

      const stars = StarRating.calculate(challenge, circuit)
      expect(stars).toBe(2)
    })

    it('should award 3 stars for optimal components', () => {
      const challenge = {
        stars: {
          optimalComponents: 2
        }
      }

      const circuit = {
        components: [1, 2] // 2 components (optimal)
      }

      const stars = StarRating.calculate(challenge, circuit)
      expect(stars).toBe(3)
    })

    it('should award 3 stars when at or below optimal', () => {
      const challenge = {
        stars: {
          optimalComponents: 4
        }
      }

      const circuit = {
        components: [1, 2, 3] // 3 components (below optimal)
      }

      const stars = StarRating.calculate(challenge, circuit)
      expect(stars).toBe(3)
    })
  })

  describe('Timed challenges', () => {
    it('should award 1 star if time over 110% and too many components', () => {
      const challenge = {
        stars: {
          optimalComponents: 4,
          optimalTime: 60 // 60 seconds
        }
      }

      const circuit = {
        components: [1, 2, 3, 4, 5, 6, 7] // 7 components (over optimal+2)
      }

      const timeElapsed = 70 // Over 110% of goal (66s)

      const stars = StarRating.calculate(challenge, circuit, timeElapsed)
      expect(stars).toBe(1)
    })

    it('should award 2 stars for efficient components but slow time', () => {
      const challenge = {
        stars: {
          optimalComponents: 4,
          optimalTime: 60
        }
      }

      const circuit = {
        components: [1, 2, 3, 4, 5] // optimal + 1 (within +2)
      }

      const timeElapsed = 70 // Over 110%

      const stars = StarRating.calculate(challenge, circuit, timeElapsed)
      expect(stars).toBe(2)
    })

    it('should award 3 stars for optimal components and fast time', () => {
      const challenge = {
        stars: {
          optimalComponents: 4,
          optimalTime: 60
        }
      }

      const circuit = {
        components: [1, 2, 3, 4] // optimal
      }

      const timeElapsed = 65 // Within 110% (66s)

      const stars = StarRating.calculate(challenge, circuit, timeElapsed)
      expect(stars).toBe(3)
    })

    it('should award 3 stars when exactly at 110% time threshold', () => {
      const challenge = {
        stars: {
          optimalComponents: 4,
          optimalTime: 60
        }
      }

      const circuit = {
        components: [1, 2, 3, 4]
      }

      const timeElapsed = 66 // Exactly 110%

      const stars = StarRating.calculate(challenge, circuit, timeElapsed)
      expect(stars).toBe(3)
    })

    it('should not award 3 stars if components optimal but time too slow', () => {
      const challenge = {
        stars: {
          optimalComponents: 4,
          optimalTime: 60
        }
      }

      const circuit = {
        components: [1, 2, 3, 4] // optimal components
      }

      const timeElapsed = 67 // Just over 110%

      const stars = StarRating.calculate(challenge, circuit, timeElapsed)
      expect(stars).toBe(2)
    })
  })

  describe('Edge cases', () => {
    it('should handle missing timeElapsed for non-timed challenge', () => {
      const challenge = {
        stars: {
          optimalComponents: 3
        }
      }

      const circuit = {
        components: [1, 2, 3]
      }

      const stars = StarRating.calculate(challenge, circuit)
      expect(stars).toBe(3)
    })

    it('should handle zero components (edge case)', () => {
      const challenge = {
        stars: {
          optimalComponents: 2
        }
      }

      const circuit = {
        components: []
      }

      const stars = StarRating.calculate(challenge, circuit)
      expect(stars).toBe(3) // 0 is below optimal
    })
  })
})
