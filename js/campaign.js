class Campaign {
  constructor() {
    this.gamesPlayed = 0
    this.gamesWon = 0
    this.highScore = 0
    this.bestStreak = 0
    this.curStreak = 0
    this.gameDetails = []
    this.version = 1
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
    Math.round(
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

  createCampaignSummary(gameDetails) {
    let statStr = "<hr><table class='statTable'>"

    function statRow(statKey, statValue) {
      return `<tr><td>${statKey}</td><td class="statNum">${statValue}</td></tr>`
    }

    if (gameDetails) {
      statStr += statRow("Word", gameDetails.word)
      statStr += statRow("Attempts", gameDetails.attempts)
      statStr += statRow("Round Score", gameDetails.score)
    }

    statStr += statRow("Average Score", this.averageScore())
    statStr += statRow("High Score", this.highScore)
    statStr += statRow("Winning %", this.winPercentage())
    statStr += statRow("Slugging %", this.sluggingPercentage())
    statStr += statRow("Best Streak", this.bestStreak)
    statStr += statRow("Current Streak", this.curStreak)
    statStr += statRow("Attempts/Rnd", this.averageAttempts())
    statStr += statRow("Rounds Played", this.gamesPlayed)

    return statStr + "</table><hr>"
  }
}
