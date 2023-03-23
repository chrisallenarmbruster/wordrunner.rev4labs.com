class Wordal {
  constructor(secretWord) {
    this.secretWord = secretWord.toUpperCase()
    this.guesses = []
    this.letterStatus = {}
    this.guessesRemaining = 6
    this.gameState = "PLAYING" //PLAYING, WON, LOST
    this.resetLetterStatus()
  }

  submitGuess(word) {
    if (this.gameState === "PLAYING") {
      this.guesses.push(word.toUpperCase())
      this.guessesRemaining--
      this.setLetterStatus(word.toUpperCase())
      this.calcGameState(word.toUpperCase())
      return [this.guessStatus(), this.letterStatus]
    }
  }

  calcGameState(word) {
    if (this.gameState === "PLAYING") {
      if (word.toUpperCase() === this.secretWord) {
        this.gameState = "WON"
      } else if (this.guessesRemaining === 0) {
        this.gameState = "LOST"
      } else {
        this.gameState = "PLAYING"
      }
    }
    return this.gameState
  }

  setLetterStatus(word) {
    for (let i = 0; i < word.length; i++) {
      if (word[i] === this.secretWord[i]) {
        this.letterStatus[this.secretWord[i]] = "G"
      } else if (
        this.secretWord.split("").includes(word[i]) &&
        this.letterStatus[word[i]] !== "G"
      ) {
        this.letterStatus[word[i]] = "Y"
      } else if (
        !this.secretWord.split("").includes(word[i]) &&
        this.letterStatus[word[i]] === "W"
      ) {
        this.letterStatus[word[i]] = "R"
      }
    }
    return this.letterStatus
  }

  resetLetterStatus() {
    for (let letter of "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")) {
      this.letterStatus[letter] = "W"
    }
    return this.letterStatus
  }

  guessStatus() {
    return this.guesses.map((guess) => {
      let guessStatArr = guess.split("").map((el) => {
        return { letter: el, status: "R" }
      })
      for (let i = 0; i < this.secretWord.length; i++) {
        if (this.secretWord[i] === guess[i]) {
          guessStatArr[i].status = "G"
        } else {
          for (let j = 0; j < guess.length; j++) {
            if (
              this.secretWord[i] === guess[j] &&
              guessStatArr[j].status === "R"
            ) {
              guessStatArr[j].status = "Y"
              break
            }
          }
        }
      }
      return guessStatArr
    })
  }
}

export { Wordal }
