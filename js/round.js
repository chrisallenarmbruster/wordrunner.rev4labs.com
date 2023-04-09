const LETTER_VALUES = {
  a: 1,
  b: 3,
  c: 3,
  d: 2,
  e: 1,
  f: 4,
  g: 2,
  h: 4,
  i: 1,
  j: 8,
  k: 5,
  l: 1,
  m: 3,
  n: 1,
  o: 1,
  p: 3,
  q: 10,
  r: 1,
  s: 1,
  t: 1,
  u: 1,
  v: 4,
  w: 4,
  x: 8,
  y: 4,
  z: 10,
}

export class Round {
  constructor(secretWord = "guess") {
    this.secretWord = secretWord.toUpperCase()
    this.wordDefinition = []
    this.guesses = []
    this.letterStatus = {}
    this.guessesRemaining = 6
    this.gameState = "PLAYING" //PLAYING, WON, LOST
    this.resetLetterStatus()
    this.getDefinition()
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

  async getDefinition() {
    let definitionArr = []
    try {
      let response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${this.secretWord.toLowerCase()}`
      )
      if (response.ok) {
        let json = await response.json()
        definitionArr = this.unpackDefinition(json)
      } else {
        throw new Error("Definition Fetch Failed")
      }
    } catch (error) {
      definitionArr = ["Dictionary or definition not available at this time."]
    } finally {
      this.wordDefinition = definitionArr
      return definitionArr
    }
  }

  unpackDefinition(json) {
    let definitionArr = []
    for (let entry of json) {
      for (let meaning of entry.meanings) {
        for (let definition of meaning.definitions) {
          definitionArr.push(
            `<i>${meaning.partOfSpeech}:</i>&nbsp;&nbsp;${definition.definition}`
          )
        }
      }
    }
    if (definitionArr.length === 0) {
      definitionArr.push("Dictionary or definition not available at this time.")
    }
    return definitionArr
  }

  wordBasePointValue() {
    let wordBaseScore = this.secretWord
      .toLowerCase()
      .split("")
      .reduce((acc, cv) => {
        return acc + LETTER_VALUES[cv]
      }, 0)

    return wordBaseScore
  }
}
