export class Campaign {
  constructor() {
    this.gamesPlayed = 0
    this.gamesWon = 0
    this.highScore = 0
    this.bestStreak = 0
    this.curStreak = 0
    this.gameDetails = []
    this.version = 1
    this.restoreFromLocalStorage()
  }

  updateCampaign(gameDetails) {
    this.gameDetails.push(gameDetails)
    this.gamesPlayed++

    if (gameDetails.outcome === "won") {
      this.gamesWon++
      this.curStreak++
    } else {
      this.curStreak = 0
    }

    if (this.curStreak > this.bestStreak) {
      this.bestStreak = this.curStreak
    }

    if (gameDetails.score > this.highScore) {
      this.highScore = gameDetails.score
    }
    this.saveToLocalStorage()
  }

  averageAttempts() {
    if (this.gamesPlayed === 0) return 0
    return parseFloat(
      (
        this.gameDetails.reduce((acc, cv) => {
          return acc + cv.attempts
        }, 0) / this.gamesPlayed
      ).toFixed(1)
    )
  }

  winPercentage() {
    if (this.gamesPlayed === 0) return 0
    return Math.round((100 * this.gamesWon) / this.gamesPlayed)
  }

  sluggingPercentage() {
    if (this.gamesPlayed === 0) return 0
    return Math.round(
      (100 *
        this.gameDetails
          .filter((el) => el.outcome === "won")
          .reduce((acc, cv) => acc + 7 - cv.attempts, 0)) /
        this.gamesPlayed
    )
  }

  averageScore() {
    if (this.gamesPlayed === 0) return 0
    return Math.round(
      this.gameDetails.reduce((acc, cv) => acc + cv.score, 0) / this.gamesPlayed
    )
  }

  saveToLocalStorage() {
    let campaignCopy = Object.assign({}, this)
    localStorage.clear()
    localStorage.setItem("campaign", JSON.stringify(campaignCopy))
  }

  restoreFromLocalStorage() {
    if (localStorage.getItem("campaign")) {
      let campaignCopy = JSON.parse(localStorage.getItem("campaign"))
      Object.assign(this, campaignCopy)
    }
  }

  campaignSummary() {
    let summary = []
    summary.push({ label: "Average Score", value: this.averageScore() })
    summary.push({ label: "High Score", value: this.highScore })
    summary.push({ label: "Winning %", value: this.winPercentage() })
    summary.push({ label: "Slugging %", value: this.sluggingPercentage() })
    summary.push({ label: "Best Streak", value: this.bestStreak })
    summary.push({ label: "Current Streak", value: this.curStreak })
    summary.push({ label: "Attempts/Rnd", value: this.averageAttempts() })
    summary.push({ label: "Rounds Played", value: this.gamesPlayed })
    return summary
  }
}
