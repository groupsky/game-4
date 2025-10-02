# Star Rating System Design

## Overview
Efficiency-based 3-star rating system to encourage optimal solutions.

## Rating Criteria

### ⭐ 1 Star - Challenge Completed
**Requirement**: Solution works
- Challenge validation passes
- Time requirement met (if applicable)
- Any working solution earns 1 star

### ⭐⭐ 2 Stars - Efficient Solution
**Requirement**: Fewer components
- Uses ≤ optimal component count + 2
- Example: If optimal is 5 components, 2 stars for ≤7 components
- Encourages simpler designs

### ⭐⭐⭐ 3 Stars - Optimal Solution
**Requirement**: Minimal components + fast (if timed)
- Uses ≤ optimal component count
- For timed challenges: Completes ≤110% of goal time
- Example: 60s challenge, 3 stars if done in ≤66s with optimal components
- Demonstrates mastery

## Implementation

### 1. Challenge Metadata
Add star criteria to each challenge:

```javascript
{
  id: 'first-light',
  title: '1. First Light',
  description: '...',
  validator: (circuit) => ChallengeValidators.validateFirstLight(circuit),

  // Star criteria
  stars: {
    optimalComponents: 2,  // Battery + LED
    optimalTime: null,     // No time requirement
  }
}
```

### 2. Star Calculation Logic

```javascript
class StarRating {
  static calculate(challenge, circuit, timeElapsed) {
    const componentCount = circuit.components.length
    const { optimalComponents, optimalTime } = challenge.stars

    let stars = 1 // Always get 1 star for completion

    // Check for 2 stars (efficient)
    if (componentCount <= optimalComponents + 2) {
      stars = 2
    }

    // Check for 3 stars (optimal)
    const hasOptimalComponents = componentCount <= optimalComponents
    const hasOptimalTime = !optimalTime || timeElapsed <= optimalTime * 1.1

    if (hasOptimalComponents && hasOptimalTime) {
      stars = 3
    }

    return stars
  }
}
```

### 3. Example Star Criteria

#### Basics (1-10)

**Challenge 1: First Light**
- Optimal: 2 (battery + LED)
- 3⭐: ≤2 components
- 2⭐: ≤4 components
- 1⭐: Any working solution

**Challenge 2: Power Up**
- Optimal: 3 (2 batteries + LED)
- 3⭐: ≤3 components
- 2⭐: ≤5 components
- 1⭐: Any working solution

**Challenge 3: Current Control**
- Optimal: 4 (2 batteries + resistor + LED)
- 3⭐: ≤4 components
- 2⭐: ≤6 components
- 1⭐: Any working solution

**Challenge 5: Battery Blues (30s)**
- Optimal: 4 components, ≤33s
- 3⭐: ≤4 components AND ≤33s
- 2⭐: ≤6 components (time OK)
- 1⭐: Any working solution

**Challenge 6: Parallel Power (60s)**
- Optimal: 5 components (parallel battery bank + bulb), ≤66s
- 3⭐: ≤5 components AND ≤66s
- 2⭐: ≤7 components (time OK)
- 1⭐: Any working solution

#### Intermediate (11-20)

**Challenge 13: LED Array**
- Optimal: 12 (3 batteries + 9 LEDs)
- 3⭐: ≤12 components
- 2⭐: ≤14 components
- 1⭐: Any working solution

**Challenge 15: Endurance (90s)**
- Optimal: 6 components, ≤99s
- 3⭐: ≤6 components AND ≤99s
- 2⭐: ≤8 components (time OK)
- 1⭐: Any working solution

#### Advanced (21-30)

**Challenge 29: The Grand Circuit (60s)**
- Optimal: 10 components, ≤66s
- 3⭐: ≤10 components AND ≤66s
- 2⭐: ≤12 components (time OK)
- 1⭐: Any working solution

**Challenge 30: Master Inventor (90s)**
- Optimal: 8 components, ≤99s
- 3⭐: ≤8 components AND ≤99s
- 2⭐: ≤10 components (time OK)
- 1⭐: Any working solution (5+ components required)

### 4. UI Display

#### Challenge Panel
```javascript
<div className="star-rating">
  <span className={`star ${stars >= 1 ? 'earned' : ''}`}>⭐</span>
  <span className={`star ${stars >= 2 ? 'earned' : ''}`}>⭐</span>
  <span className={`star ${stars >= 3 ? 'earned' : ''}`}>⭐</span>
</div>

<div className="star-requirements">
  <div>⭐ Complete the challenge</div>
  <div>⭐⭐ Use ≤{optimalComponents + 2} components</div>
  <div>⭐⭐⭐ Use ≤{optimalComponents} components{optimalTime ? ` in ≤${Math.floor(optimalTime * 1.1)}s` : ''}</div>
</div>
```

#### Challenge List
Show stars earned per challenge:
```javascript
<div className="challenge-item">
  <span className="challenge-number">1.</span>
  <span className="challenge-title">First Light</span>
  <span className="challenge-stars">
    {challenge.starsEarned === 3 ? '⭐⭐⭐' :
     challenge.starsEarned === 2 ? '⭐⭐' :
     challenge.starsEarned === 1 ? '⭐' : '☆☆☆'}
  </span>
  <span className="challenge-status">✅</span>
</div>
```

#### Overall Progress
```javascript
<div className="total-stars">
  Total Stars: {totalStarsEarned} / {totalStarsPossible}
  ({Math.floor(totalStarsEarned / totalStarsPossible * 100)}%)
</div>
```

### 5. CSS Styling

```css
.star-rating {
  display: flex;
  gap: 4px;
  font-size: 20px;
  margin: 8px 0;
}

.star {
  opacity: 0.3;
  transition: opacity 0.3s;
}

.star.earned {
  opacity: 1;
  animation: star-shine 0.5s ease-out;
}

@keyframes star-shine {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.star-requirements {
  font-size: 12px;
  color: #78350F;
  background: #FEF3C7;
  padding: 8px;
  border-radius: 4px;
  margin-top: 8px;
}

.star-requirements div {
  margin: 2px 0;
}

.challenge-stars {
  font-size: 14px;
  margin-left: auto;
}

.total-stars {
  font-size: 16px;
  font-weight: bold;
  color: #F59E0B;
  margin-top: 12px;
  padding: 8px;
  background: linear-gradient(90deg, #FEF3C7, #FBBF24);
  border-radius: 4px;
  text-align: center;
}
```

### 6. Storage

Save star ratings to localStorage:
```javascript
{
  "first-light": { completed: true, stars: 3, bestTime: 5 },
  "power-up": { completed: true, stars: 2, bestTime: 8 },
  // ...
}
```

### 7. Replay Incentive

After completing a challenge with <3 stars:
- Show current stars and what's needed for next star
- "Try again for ⭐⭐⭐?" button
- Track best attempt (highest stars, fastest time)

## Benefits

✅ **Replayability**: Encourages optimization and replay
✅ **Skill Development**: Players learn efficient design
✅ **Clear Goals**: Visible targets for improvement
✅ **Progress Tracking**: Total stars metric shows mastery
✅ **Optional**: Not required to progress, but rewarding

## Priority: MEDIUM

Star ratings add depth but aren't critical for core gameplay. The challenge system works without them. They enhance the experience for players who want optimization challenges.

## Future Enhancements

- **Leaderboards**: Compare stars with friends
- **Achievements**: "Perfect Run" (all 3-star solutions)
- **Unlock Bonuses**: 3-star solutions unlock special components
- **Time Trials**: Dedicated speed-run mode
