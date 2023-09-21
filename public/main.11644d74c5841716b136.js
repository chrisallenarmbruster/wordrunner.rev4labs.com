/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./client/js/campaign.js":
/*!*******************************!*\
  !*** ./client/js/campaign.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Campaign: () => (/* binding */ Campaign)
/* harmony export */ });
class Campaign {
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


/***/ }),

/***/ "./client/js/round.js":
/*!****************************!*\
  !*** ./client/js/round.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Round: () => (/* binding */ Round)
/* harmony export */ });
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

class Round {
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
      definitionArr = [
        {
          partOfSpeech: null,
          definition: "Dictionary or definition not available at this time.",
        },
      ]
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
          definitionArr.push({
            partOfSpeech: meaning.partOfSpeech,
            definition: definition.definition,
          })
        }
      }
    }
    if (definitionArr.length === 0) {
      definitionArr.push({
        partOfSpeech: null,
        definition: "Dictionary or definition not available at this time.",
      })
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


/***/ }),

/***/ "./client/js/ui.js":
/*!*************************!*\
  !*** ./client/js/ui.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UI: () => (/* binding */ UI)
/* harmony export */ });
/* harmony import */ var _audio_click_mp3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../audio/click.mp3 */ "./client/audio/click.mp3");
/* harmony import */ var _audio_comp_mp3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../audio/comp.mp3 */ "./client/audio/comp.mp3");
/* harmony import */ var _audio_fight_mp3__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../audio/fight.mp3 */ "./client/audio/fight.mp3");
/* harmony import */ var _audio_regret_mp3__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../audio/regret.mp3 */ "./client/audio/regret.mp3");
/* harmony import */ var _audio_invalid_mp3__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../audio/invalid.mp3 */ "./client/audio/invalid.mp3");
/* harmony import */ var _audio_ratchet_mp3__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../audio/ratchet.mp3 */ "./client/audio/ratchet.mp3");
/* harmony import */ var _style_main_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../style/main.css */ "./client/style/main.css");








class UI {
  constructor(container) {
    this.initialUiSetup(container)
    this.audioSetup()
    this.curRow = 0
    this.curCol = 0
    this.board = [
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ]
    this.busy = false
  }

  initialUiSetup(container) {
    const header = document.createElement("div")
    header.id = "header"
    header.className = "header"
    header.textContent = "WordBrunner"
    container.appendChild(header)

    const gameContainer = document.createElement("div")
    gameContainer.id = "gameContainer"
    gameContainer.className = "gameContainer"
    this.drawTileGrid(gameContainer)
    container.appendChild(gameContainer)

    const keyboardContainer = document.createElement("div")
    keyboardContainer.id = "keyboardContainer"
    keyboardContainer.className = "keyboardContainer"
    this.drawKeyboard(keyboardContainer)
    container.appendChild(keyboardContainer)

    const modalContainer = document.createElement("div")
    modalContainer.id = "modalContainer"
    modalContainer.className = "modalContainer"
    container.appendChild(modalContainer)
  }

  audioSetup() {
    this.clickAudio = new Audio()
    this.clickAudio.src = _audio_click_mp3__WEBPACK_IMPORTED_MODULE_0__
    this.compAudio = new Audio()
    this.compAudio.src = _audio_comp_mp3__WEBPACK_IMPORTED_MODULE_1__
    this.successAudio = new Audio()
    this.successAudio.src = _audio_fight_mp3__WEBPACK_IMPORTED_MODULE_2__
    this.failAudio = new Audio()
    this.failAudio.src = _audio_regret_mp3__WEBPACK_IMPORTED_MODULE_3__
    this.invalidAudio = new Audio()
    this.invalidAudio.src = _audio_invalid_mp3__WEBPACK_IMPORTED_MODULE_4__
    this.ratchetAudio = new Audio()
    this.ratchetAudio.src = _audio_ratchet_mp3__WEBPACK_IMPORTED_MODULE_5__
  }

  reset() {
    this.curRow = 0
    this.curCol = 0
    this.board = [
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ]
    this.busy = false
    ENTER.classList.remove("gameOver")
    ENTER.textContent = "ENTER"
    header.className = "header"
    header.textContent = "wordBrunner"
    this.flipAndResetTiles()
    for (let letter of "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")) {
      let key = document.getElementById(letter)
      key.className = "key"
    }
  }

  iterateTiles(callback) {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        callback(document.getElementById(`tile-${row}-${col}`))
      }
    }
  }

  flipAndResetTiles() {
    this.clickAudio.pause()
    this.ratchetAudio.play().catch((error) => {
      /*do nothing - it's just audio*/
    })

    setTimeout(() => {
      this.iterateTiles((tile) => {
        tile.classList.remove("tileHit", "tileClose", "tileMiss")
        tile.innerHTML = '<span class="tileWaterMark">B</span>'
      })
    }, 500)

    setTimeout(() => {
      this.iterateTiles((tile) => {
        tile.classList.remove("reset")
      })
    }, 1000)

    this.iterateTiles((tile) => {
      tile.classList.add("reset")
    })
  }

  drawTile(container, row, col, value = "") {
    const tile = document.createElement("div")
    tile.id = `tile-${row}-${col}`
    tile.className = "tile"
    tile.textContent = value
    container.appendChild(tile)
    // return tile
  }

  drawTileGrid(container, rows = 6, cols = 5) {
    const tileGrid = document.createElement("div")
    tileGrid.className = "tileGrid"

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        this.drawTile(tileGrid, row, col, "")
      }
    }
    container.appendChild(tileGrid)
  }

  drawKey(key) {
    const keyButton = document.createElement("span")
    keyButton.id = key === "⌫" ? "BACKSPACE" : key === "ENTER" ? "ENTER" : key
    keyButton.role = "button"
    keyButton.className = key === " " ? "keySpacer" : "key"
    keyButton.textContent = key
    return keyButton
  }

  drawKeyboardRow(container, row, keys) {
    const keyboardRow = document.createElement("div")
    keyboardRow.className = "keyboardRowContainer"

    const keyboardRowGrid = document.createElement("div")
    keyboardRowGrid.id = `keyboardRow${row}`
    //Following 3 rows added to prevent webpack PurgeCSS from removing the classes from CSS,
    //as it is not smart enough to interpret the template literal that follows.
    keyboardRowGrid.className = `keyboardRow1`
    keyboardRowGrid.className = `keyboardRow2`
    keyboardRowGrid.className = `keyboardRow3`
    keyboardRowGrid.className = `keyboardRow${row}`

    for (let key of keys) {
      const keyButton = this.drawKey(key)
      keyboardRowGrid.append(keyButton)
    }

    keyboardRow.append(keyboardRowGrid)
    container.append(keyboardRow)
  }

  drawKeyboard(container) {
    const keys = [
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      [" ", "A", "S", "D", "F", "G", "H", "J", "K", "L", " "],
      ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
    ]
    const keyboardGrid = document.createElement("div")
    keyboardGrid.className = "keyboardGrid"
    keyboardGrid.id = "keyboardGrid"

    container.append(keyboardGrid)

    this.drawKeyboardRow(keyboardGrid, 1, keys[0])
    this.drawKeyboardRow(keyboardGrid, 2, keys[1])
    this.drawKeyboardRow(keyboardGrid, 3, keys[2])
  }

  appendLetter(letter) {
    if (this.curCol < 5 && this.curRow < 6) {
      const tile = document.getElementById(`tile-${this.curRow}-${this.curCol}`)
      tile.textContent = letter
      this.board[this.curRow][this.curCol] = letter
      this.curCol++
    }
  }

  deleteLetter() {
    if (this.curCol > 0) {
      this.curCol--
      const tile = document.getElementById(`tile-${this.curRow}-${this.curCol}`)
      tile.innerHTML = '<span class="tileWaterMark">B</span>'
      this.board[this.curRow][this.curCol] = ""
    }
  }

  displayMessage(message, time = 3500) {
    header.className = "message"
    header.textContent = message
    setTimeout(() => {
      header.className = "header"
      header.textContent = "wordBrunner"
    }, time)
  }

  updateKeyboard(letterStatus) {
    for (let [letter, status] of Object.entries(letterStatus)) {
      let key = document.getElementById(letter)
      key.classList.add(
        status === "G"
          ? "tileHit"
          : status === "Y"
          ? "tileClose"
          : status === "R"
          ? "tileMiss"
          : "key"
      )
    }
  }

  async revealGuess(guessStatus) {
    return new Promise(async (resolve, reject) => {
      this.busy = true
      let gArr = guessStatus
      this.compAudio.play().catch((error) => {
        /*do nothing - it's just audio*/
      })
      let word = gArr[this.curRow]
      let interval = setInterval(() => this.scrambleEffect(), 30)
      await new Promise((resolve, reject) => {
        setTimeout(resolve, 1000)
      })
      clearInterval(interval)
      this.colorTiles(word)
      this.busy = false
      resolve()
    })
  }

  scrambleEffect() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    for (let col = 0; col < 5; col++) {
      let tile = document.getElementById(`tile-${this.curRow}-${col}`)
      tile.textContent = letters[Math.floor(Math.random() * 26)]
    }
  }

  colorTiles(word) {
    for (let [idx, letter] of word.entries()) {
      let tile = document.getElementById(`tile-${this.curRow}-${idx}`)
      tile.textContent = word[idx]["letter"]
      tile.classList.add(
        letter.status === "G"
          ? "tileHit"
          : letter.status === "Y"
          ? "tileClose"
          : "tileMiss"
      )
    }
  }

  showModal(title = "Title", content = ["lorem ipsum"], gameState) {
    const modalCloseHandler = (event) => {
      if (event.type === "touchstart") {
        event.preventDefault()
      }
      modalContainer.style.display = "none"
      this.successAudio.pause()
      this.successAudio.currentTime = 0
      this.failAudio.pause()
      this.failAudio.currentTime = 0
      if (gameState !== "PLAYING") {
        ENTER.classList.add("gameOver")
        ENTER.textContent = "RESET"
      }
    }

    let modalContent = document.createElement("div")
    modalContent.id = "modalContent"
    modalContent.className = "modalContent"

    let closeButton = document.createElement("span")
    closeButton.id = "closeButton"
    closeButton.className = "close"
    closeButton.textContent = `x`
    closeButton.addEventListener("click", modalCloseHandler)
    closeButton.addEventListener("touchstart", modalCloseHandler)
    modalContent.appendChild(closeButton)

    let modalTitle = document.createElement("h4")
    modalTitle.className = "modalTitle"
    modalTitle.textContent = title
    modalContent.appendChild(modalTitle)

    for (let item of content) {
      let modalContentItem = document.createElement("p")
      modalContentItem.className = "modalContentItem"
      modalContentItem.innerHTML = item
      modalContent.appendChild(modalContentItem)
    }

    modalContainer.replaceChildren()
    modalContainer.appendChild(modalContent)
    modalContainer.style.display = "block"
  }
}


/***/ }),

/***/ "./client/js/words-supplement.js":
/*!***************************************!*\
  !*** ./client/js/words-supplement.js ***!
  \***************************************/
/***/ ((module) => {

const WORDS_SUPPLEMENT = [
  "ABACI",
  "ABEND",
  "ACHOO",
  "ACNED",
  "AGARS",
  "AGONE",
  "AHOLD",
  "AIDER",
  "ALGIN",
  "ALTHO",
  "AMMOS",
  "AMUCK",
  "AMYLS",
  "ANDED",
  "ANILE",
  "ANNUM",
  "APERS",
  "APORT",
  "APSOS",
  "AQUAE",
  "AQUAS",
  "AREAL",
  "ARITY",
  "ASKER",
  "ASSED",
  "ASTRO",
  "AXLED",
  "AYINS",
  "BAHTS",
  "BALDS",
  "BARIC",
  "BARKY",
  "BARMS",
  "BAZAR",
  "BEBUG",
  "BELLI",
  "BESOT",
  "BHOYS",
  "BIDER",
  "BIGGY",
  "BILES",
  "BILGY",
  "BITSY",
  "BLASH",
  "BOOKY",
  "BOSSA",
  "BRANS",
  "BRAVA",
  "BRENT",
  "BRIES",
  "BRUNG",
  "BRUSK",
  "BUFFA",
  "BURRY",
  "CAGER",
  "CANER",
  "CARNE",
  "CARON",
  "CARPY",
  "CASUS",
  "CEDER",
  "CHIFF",
  "CHOOS",
  "COOKY",
  "COQUI",
  "CORDY",
  "CORER",
  "CRINK",
  "CUBER",
  "CUING",
  "CUPID",
  "CURDY",
  "CURER",
  "CURIA",
  "CUSPY",
  "DARER",
  "DASHY",
  "DEADS",
  "DEARY",
  "DEFOG",
  "DEFUN",
  "DEGUM",
  "DEICE",
  "DEIST",
  "DEQUE",
  "DEWEY",
  "DICER",
  "DICUT",
  "DIDOT",
  "DIEMS",
  "DIEST",
  "DIETH",
  "DIRTS",
  "DIXIT",
  "DOPER",
  "DOSED",
  "DOSER",
  "DOSES",
  "DOTER",
  "DOVEY",
  "DOXIE",
  "DRABS",
  "DRIBS",
  "DUDDY",
  "DUNGY",
  "DUNKS",
  "EARED",
  "EASTS",
  "ECHOS",
  "EDGER",
  "ELANS",
  "ENDER",
  "EPSOM",
  "EVERY",
  "EYERS",
  "FACIE",
  "FACTO",
  "FAIRE",
  "FAMES",
  "FANIN",
  "FATLY",
  "FAWNY",
  "FAXER",
  "FEIST",
  "FENNY",
  "FERNY",
  "FEUAR",
  "FEWER",
  "FILAR",
  "FILER",
  "FINIF",
  "FIRER",
  "FISTY",
  "FITLY",
  "FIXIT",
  "FLABS",
  "FLAKS",
  "FLAPS",
  "FOLIC",
  "FORES",
  "FORKY",
  "FORMA",
  "FUMER",
  "GAMIC",
  "GAPPY",
  "GARDE",
  "GAYLY",
  "GAZER",
  "GHOTI",
  "GIBER",
  "GIGAS",
  "GIMEL",
  "GIMPY",
  "GINNY",
  "GLARY",
  "GLUER",
  "GOONY",
  "GOOPY",
  "GORGE",
  "GRAPY",
  "GRATA",
  "GUNKS",
  "GUTTA",
  "GWINE",
  "GYVED",
  "HAPAX",
  "HARUM",
  "HAUTE",
  "HAWED",
  "HAYED",
  "HAYER",
  "HAYEY",
  "HEERD",
  "HELLS",
  "HEMPS",
  "HEMPY",
  "HEREM",
  "HEROS",
  "HEXER",
  "HIDER",
  "HIRER",
  "HIVER",
  "HOARS",
  "HODAD",
  "HOERS",
  "HOLER",
  "HOLEY",
  "HOLON",
  "HOMME",
  "HONER",
  "HOPER",
  "HOPPY",
  "HULKY",
  "HURLY",
  "ICERS",
  "ICILY",
  "IMMIX",
  "INKER",
  "INODE",
  "IODIC",
  "JAKES",
  "JIBER",
  "JOWLY",
  "JUDOS",
  "JUSTE",
  "KAIAK",
  "KALES",
  "KEBOB",
  "KELLY",
  "KELPY",
  "KEYER",
  "KILTY",
  "KITED",
  "KITES",
  "KLUNK",
  "LACER",
  "LACEY",
  "LAPIN",
  "LARDY",
  "LATUS",
  "LAUDE",
  "LAWNY",
  "LAWZY",
  "LAXLY",
  "LIERS",
  "LIEST",
  "LIETH",
  "LIGNE",
  "LIKER",
  "LILTY",
  "LIMBY",
  "LINTS",
  "LINTY",
  "LIRAS",
  "LITES",
  "LIVES",
  "LIVRE",
  "LOAMS",
  "LOBED",
  "LOGGY",
  "LOPER",
  "LOTTA",
  "LOXES",
  "LULAB",
  "LURER",
  "LUVYA",
  "LUXES",
  "MANED",
  "MASHY",
  "MASSE",
  "MEBBE",
  "MECCA",
  "MECUM",
  "MERSE",
  "MICAS",
  "MIMER",
  "MINAS",
  "MODUS",
  "MOLTO",
  "MOPER",
  "MOSTS",
  "MRADS",
  "MUJIK",
  "MUMBO",
  "MUNGY",
  "MURKS",
  "MUSER",
  "MUSSY",
  "MUTER",
  "NABLA",
  "NAMER",
  "NERTS",
  "NIHIL",
  "NITTY",
  "NOBBY",
  "NOIRE",
  "NONNY",
  "NOTER",
  "NUDER",
  "NURBS",
  "OFFEN",
  "OGLER",
  "OHMIC",
  "OKRAS",
  "OLEOS",
  "ONCET",
  "OODLE",
  "ORBED",
  "ORING",
  "ORLON",
  "OUTEN",
  "OWEST",
  "OWETH",
  "PAMPA",
  "PANED",
  "PARER",
  "PAWER",
  "PEATY",
  "PENDS",
  "PERDU",
  "PETRI",
  "PFFFT",
  "PHASE",
  "PIING",
  "PISMO",
  "PLEIN",
  "PLENA",
  "PLYER",
  "POLLY",
  "POLOS",
  "PONES",
  "POOEY",
  "POSET",
  "POSTE",
  "POXED",
  "PREST",
  "PRIER",
  "PRIMA",
  "PRUTA",
  "PRYER",
  "PUPAL",
  "PUPAS",
  "PYXIE",
  "QOPHS",
  "QUAIS",
  "QUALS",
  "RAKER",
  "RAPED",
  "RAPES",
  "RASAE",
  "RATER",
  "RAWLY",
  "RAZER",
  "REBOX",
  "REDIP",
  "REDLY",
  "REEKY",
  "REFLY",
  "REFRY",
  "RENTE",
  "RESAW",
  "RESAY",
  "RESEW",
  "REWED",
  "RIDGY",
  "RIFER",
  "RIMER",
  "ROBLE",
  "ROOKY",
  "ROOTY",
  "RUNIC",
  "RUNTY",
  "RUSSE",
  "RUTTY",
  "SAGER",
  "SATES",
  "SAWER",
  "SAYER",
  "SCOPS",
  "SCUSE",
  "SEDGY",
  "SEEST",
  "SHIER",
  "SHIKI",
  "SHISH",
  "SHNOR",
  "SHOED",
  "SHOER",
  "SHUTE",
  "SIFTS",
  "SILTY",
  "SIZER",
  "SKYED",
  "SLAWS",
  "SLIER",
  "SLUFF",
  "SOFTS",
  "SOLON",
  "SOLUM",
  "SONLY",
  "SOWER",
  "SOYAS",
  "SPIER",
  "SPINA",
  "SPINY",
  "SPUMY",
  "SPUTA",
  "STOAE",
  "SUDSY",
  "SUERS",
  "SUETS",
  "SUETY",
  "SUPES",
  "TACET",
  "TACTS",
  "TAGUA",
  "TARED",
  "TAXER",
  "TECUM",
  "TEXAS",
  "THEIR",
  "THENS",
  "THOUS",
  "THWAP",
  "TIGHT",
  "TOKER",
  "TOPER",
  "TORAH",
  "TOTER",
  "TOUCH",
  "TOVES",
  "TOWED",
  "TOYER",
  "TREAP",
  "TRIBS",
  "TUFAS",
  "TUFTY",
  "TURDY",
  "TYPAL",
  "ULNAR",
  "UMPTY",
  "UNARC",
  "UNATE",
  "UNFIX",
  "UNHIT",
  "UNJAM",
  "UNMAP",
  "UNSEW",
  "UNWON",
  "UREAS",
  "UTERO",
  "VACUO",
  "VAGUS",
  "VANED",
  "VARIA",
  "VEALS",
  "VEINY",
  "VERSA",
  "VIERS",
  "VILLE",
  "VINED",
  "VIRES",
  "VISED",
  "VITAE",
  "VITAM",
  "VITRO",
  "VOWER",
  "WAKER",
  "WALED",
  "WANLY",
  "WARTY",
  "WAXER",
  "WEALD",
  "WEANS",
  "WEBBY",
  "WEDGY",
  "WESTS",
  "WETLY",
  "WHATS",
  "WHEEE",
  "WHENS",
  "WHEWS",
  "WHEYS",
  "WHISH",
  "WHOAS",
  "WHOOO",
  "WINEY",
  "WIRER",
  "WISTS",
  "WITHS",
  "WOOER",
  "YOGAS",
  "YOGIC",
  "YOLKY",
  "YORES",
  "YULES",
  "ZEALS",
  "ZESTY",
  "ZINGY",
  "ZOMBI",
  "ZOOKS",
]

module.exports = { WORDS_SUPPLEMENT }


/***/ }),

/***/ "./client/js/words.js":
/*!****************************!*\
  !*** ./client/js/words.js ***!
  \****************************/
/***/ ((module) => {

const WORDS = [
  "AARGH",
  "ABACA",
  "ABACK",
  "ABAFT",
  "ABASE",
  "ABASH",
  "ABATE",
  "ABBEY",
  "ABBOT",
  "ABEAM",
  "ABETS",
  "ABHOR",
  "ABIDE",
  "ABLED",
  "ABLER",
  "ABODE",
  "ABORT",
  "ABOUT",
  "ABOVE",
  "ABUSE",
  "ABUTS",
  "ABUZZ",
  "ABYSS",
  "ACHED",
  "ACHES",
  "ACIDS",
  "ACING",
  "ACMES",
  "ACORN",
  "ACRES",
  "ACRID",
  "ACTED",
  "ACTIN",
  "ACTOR",
  "ACUTE",
  "ADAGE",
  "ADAPT",
  "ADDED",
  "ADDER",
  "ADDLE",
  "ADEPT",
  "ADIEU",
  "ADIOS",
  "ADLIB",
  "ADMAN",
  "ADMEN",
  "ADMIT",
  "ADMIX",
  "ADOBE",
  "ADOPT",
  "ADORE",
  "ADORN",
  "ADULT",
  "ADZES",
  "AEGIS",
  "AERIE",
  "AFFIX",
  "AFIRE",
  "AFOOT",
  "AFORE",
  "AFOUL",
  "AFTER",
  "AGAIN",
  "AGAPE",
  "AGATE",
  "AGAVE",
  "AGENT",
  "AGILE",
  "AGING",
  "AGLEY",
  "AGLOW",
  "AGONY",
  "AGORA",
  "AGREE",
  "AGUES",
  "AHEAD",
  "AIDED",
  "AIDES",
  "AILED",
  "AIMED",
  "AIOLI",
  "AIRED",
  "AIRER",
  "AISLE",
  "AITCH",
  "AJUGA",
  "ALACK",
  "ALARM",
  "ALBUM",
  "ALDER",
  "ALEPH",
  "ALERT",
  "ALGAE",
  "ALGAL",
  "ALIAS",
  "ALIBI",
  "ALIEN",
  "ALIGN",
  "ALIKE",
  "ALIVE",
  "ALKYD",
  "ALKYL",
  "ALLAY",
  "ALLEY",
  "ALLOT",
  "ALLOW",
  "ALLOY",
  "ALOES",
  "ALOFT",
  "ALOHA",
  "ALONE",
  "ALONG",
  "ALOOF",
  "ALOUD",
  "ALPHA",
  "ALTAR",
  "ALTER",
  "ALTOS",
  "ALUMS",
  "ALWAY",
  "AMAHS",
  "AMASS",
  "AMAZE",
  "AMBER",
  "AMBIT",
  "AMBLE",
  "AMEBA",
  "AMEND",
  "AMENS",
  "AMIDE",
  "AMIGO",
  "AMINE",
  "AMINO",
  "AMISS",
  "AMITY",
  "AMONG",
  "AMOUR",
  "AMPED",
  "AMPLE",
  "AMPLY",
  "AMUSE",
  "ANENT",
  "ANGEL",
  "ANGER",
  "ANGLE",
  "ANGRY",
  "ANGST",
  "ANIMA",
  "ANION",
  "ANISE",
  "ANKHS",
  "ANKLE",
  "ANNAS",
  "ANNEX",
  "ANNOY",
  "ANNUL",
  "ANODE",
  "ANOLE",
  "ANTED",
  "ANTES",
  "ANTIC",
  "ANTIS",
  "ANTSY",
  "ANVIL",
  "AORTA",
  "APACE",
  "APART",
  "APHID",
  "APHIS",
  "APIAN",
  "APING",
  "APISH",
  "APNEA",
  "APPLE",
  "APPLY",
  "APRON",
  "APSES",
  "APTLY",
  "ARBOR",
  "ARCED",
  "ARDOR",
  "AREAS",
  "ARENA",
  "ARGON",
  "ARGOT",
  "ARGUE",
  "ARIAS",
  "ARISE",
  "ARMED",
  "ARMOR",
  "AROMA",
  "AROSE",
  "ARRAS",
  "ARRAY",
  "ARROW",
  "ARSES",
  "ARSON",
  "ARTSY",
  "ARUMS",
  "ASANA",
  "ASCOT",
  "ASHEN",
  "ASHES",
  "ASIDE",
  "ASKED",
  "ASKEW",
  "ASPEN",
  "ASPIC",
  "ASSAI",
  "ASSAY",
  "ASSES",
  "ASSET",
  "ASTER",
  "ASTIR",
  "ATILT",
  "ATLAS",
  "ATOLL",
  "ATOMS",
  "ATONE",
  "ATRIA",
  "ATTAR",
  "ATTIC",
  "AUDIO",
  "AUDIT",
  "AUGER",
  "AUGHT",
  "AUGUR",
  "AUNTS",
  "AURAE",
  "AURAL",
  "AURAS",
  "AURIC",
  "AUTOS",
  "AVAIL",
  "AVANT",
  "AVAST",
  "AVERS",
  "AVERT",
  "AVIAN",
  "AVOID",
  "AVOWS",
  "AWAIT",
  "AWAKE",
  "AWARD",
  "AWARE",
  "AWASH",
  "AWAYS",
  "AWFUL",
  "AWING",
  "AWOKE",
  "AXELS",
  "AXIAL",
  "AXING",
  "AXIOM",
  "AXLES",
  "AXMAN",
  "AXMEN",
  "AXONS",
  "AZINE",
  "AZOIC",
  "AZURE",
  "BABEL",
  "BABES",
  "BACKS",
  "BACON",
  "BADDY",
  "BADGE",
  "BADLY",
  "BAGEL",
  "BAGGY",
  "BAILS",
  "BAIRN",
  "BAITS",
  "BAIZE",
  "BAKED",
  "BAKER",
  "BAKES",
  "BALDY",
  "BALED",
  "BALER",
  "BALES",
  "BALKS",
  "BALKY",
  "BALLS",
  "BALLY",
  "BALMS",
  "BALMY",
  "BALSA",
  "BANAL",
  "BANDS",
  "BANDY",
  "BANES",
  "BANGS",
  "BANJO",
  "BANKS",
  "BANNS",
  "BARBS",
  "BARDS",
  "BARED",
  "BARER",
  "BARES",
  "BARFS",
  "BARFY",
  "BARGE",
  "BARKS",
  "BARMY",
  "BARNS",
  "BARON",
  "BASAL",
  "BASED",
  "BASER",
  "BASES",
  "BASIC",
  "BASIL",
  "BASIN",
  "BASIS",
  "BASKS",
  "BASSI",
  "BASSO",
  "BASTE",
  "BATCH",
  "BATED",
  "BATES",
  "BATHE",
  "BATHS",
  "BATIK",
  "BATON",
  "BATTY",
  "BAUDS",
  "BAULK",
  "BAWDY",
  "BAWLS",
  "BAYED",
  "BAYOU",
  "BEACH",
  "BEADS",
  "BEADY",
  "BEAKS",
  "BEAKY",
  "BEAMS",
  "BEAMY",
  "BEANO",
  "BEANS",
  "BEARD",
  "BEARS",
  "BEAST",
  "BEATS",
  "BEAUS",
  "BEAUT",
  "BEAUX",
  "BEBOP",
  "BECKS",
  "BEDEW",
  "BEDIM",
  "BEECH",
  "BEEFS",
  "BEEFY",
  "BEEPS",
  "BEERS",
  "BEERY",
  "BEETS",
  "BEFIT",
  "BEFOG",
  "BEGAN",
  "BEGAT",
  "BEGET",
  "BEGIN",
  "BEGOT",
  "BEGUN",
  "BEIGE",
  "BEING",
  "BELAY",
  "BELCH",
  "BELIE",
  "BELLE",
  "BELLS",
  "BELLY",
  "BELOW",
  "BELTS",
  "BENCH",
  "BENDS",
  "BENTS",
  "BERET",
  "BERGS",
  "BERMS",
  "BERRY",
  "BERTH",
  "BERYL",
  "BESET",
  "BESTS",
  "BETAS",
  "BETEL",
  "BETHS",
  "BEVEL",
  "BEZEL",
  "BHANG",
  "BIBBS",
  "BIBLE",
  "BIDDY",
  "BIDED",
  "BIDES",
  "BIDET",
  "BIERS",
  "BIFFS",
  "BIFFY",
  "BIGHT",
  "BIGLY",
  "BIGOT",
  "BIKED",
  "BIKER",
  "BIKES",
  "BILGE",
  "BILKS",
  "BILLS",
  "BILLY",
  "BIMBO",
  "BINDS",
  "BINGE",
  "BINGO",
  "BIOME",
  "BIPED",
  "BIPOD",
  "BIRCH",
  "BIRDS",
  "BIRTH",
  "BISON",
  "BITCH",
  "BITER",
  "BITES",
  "BITTY",
  "BLABS",
  "BLACK",
  "BLADE",
  "BLAHS",
  "BLAME",
  "BLAND",
  "BLANK",
  "BLARE",
  "BLAST",
  "BLATS",
  "BLAZE",
  "BLEAK",
  "BLEAR",
  "BLEAT",
  "BLEBS",
  "BLEED",
  "BLEND",
  "BLESS",
  "BLEST",
  "BLIMP",
  "BLIND",
  "BLINI",
  "BLINK",
  "BLIPS",
  "BLISS",
  "BLITZ",
  "BLOAT",
  "BLOBS",
  "BLOCK",
  "BLOCS",
  "BLOKE",
  "BLOND",
  "BLOOD",
  "BLOOM",
  "BLOTS",
  "BLOWN",
  "BLOWS",
  "BLOWY",
  "BLUED",
  "BLUER",
  "BLUES",
  "BLUFF",
  "BLUNT",
  "BLURB",
  "BLURS",
  "BLURT",
  "BLUSH",
  "BOARD",
  "BOARS",
  "BOAST",
  "BOATS",
  "BOBBY",
  "BOCCE",
  "BOCCI",
  "BOCKS",
  "BODED",
  "BODES",
  "BODGE",
  "BOFFO",
  "BOFFS",
  "BOGEY",
  "BOGGY",
  "BOGIE",
  "BOGUS",
  "BOILS",
  "BOLAS",
  "BOLLS",
  "BOLOS",
  "BOLTS",
  "BOMBE",
  "BOMBS",
  "BONDS",
  "BONED",
  "BONER",
  "BONES",
  "BONGO",
  "BONGS",
  "BONKS",
  "BONNE",
  "BONNY",
  "BONUS",
  "BOOBS",
  "BOOBY",
  "BOOED",
  "BOOKS",
  "BOOMS",
  "BOOMY",
  "BOONS",
  "BOORS",
  "BOOST",
  "BOOTH",
  "BOOTS",
  "BOOTY",
  "BOOZE",
  "BOOZY",
  "BORAX",
  "BORED",
  "BORER",
  "BORES",
  "BORIC",
  "BORNE",
  "BORON",
  "BOSKY",
  "BOSOM",
  "BOSON",
  "BOSSY",
  "BOSUN",
  "BOTCH",
  "BOUGH",
  "BOULE",
  "BOUND",
  "BOUTS",
  "BOWED",
  "BOWEL",
  "BOWER",
  "BOWIE",
  "BOWLS",
  "BOXED",
  "BOXER",
  "BOXES",
  "BOZOS",
  "BRACE",
  "BRACK",
  "BRACT",
  "BRADS",
  "BRAES",
  "BRAGS",
  "BRAID",
  "BRAIN",
  "BRAKE",
  "BRAND",
  "BRANT",
  "BRASH",
  "BRASS",
  "BRATS",
  "BRAVE",
  "BRAVO",
  "BRAWL",
  "BRAWN",
  "BRAYS",
  "BRAZE",
  "BREAD",
  "BREAK",
  "BREAM",
  "BREED",
  "BREVE",
  "BREWS",
  "BRIAR",
  "BRIBE",
  "BRICK",
  "BRIDE",
  "BRIEF",
  "BRIER",
  "BRIGS",
  "BRIMS",
  "BRINE",
  "BRING",
  "BRINK",
  "BRINY",
  "BRISK",
  "BROAD",
  "BROIL",
  "BROKE",
  "BROMO",
  "BRONC",
  "BROOD",
  "BROOK",
  "BROOM",
  "BROTH",
  "BROWN",
  "BROWS",
  "BRUIN",
  "BRUIT",
  "BRUNT",
  "BRUSH",
  "BRUTE",
  "BUBBA",
  "BUCKS",
  "BUDDY",
  "BUDGE",
  "BUFFO",
  "BUFFS",
  "BUGGY",
  "BUGLE",
  "BUILD",
  "BUILT",
  "BULBS",
  "BULGE",
  "BULGY",
  "BULKS",
  "BULKY",
  "BULLS",
  "BULLY",
  "BUMPH",
  "BUMPS",
  "BUMPY",
  "BUNCH",
  "BUNCO",
  "BUNDS",
  "BUNGS",
  "BUNKO",
  "BUNKS",
  "BUNNY",
  "BUNTS",
  "BUOYS",
  "BURET",
  "BURGS",
  "BURLS",
  "BURLY",
  "BURNS",
  "BURNT",
  "BURPS",
  "BURRO",
  "BURRS",
  "BURST",
  "BUSBY",
  "BUSED",
  "BUSES",
  "BUSHY",
  "BUSKS",
  "BUSTS",
  "BUSTY",
  "BUTCH",
  "BUTTE",
  "BUTTS",
  "BUTYL",
  "BUXOM",
  "BUYER",
  "BUZZY",
  "BWANA",
  "BYLAW",
  "BYRES",
  "BYTES",
  "BYWAY",
  "CABAL",
  "CABBY",
  "CABIN",
  "CABLE",
  "CACAO",
  "CACHE",
  "CACTI",
  "CADDY",
  "CADET",
  "CADGE",
  "CADRE",
  "CAFES",
  "CAGED",
  "CAGES",
  "CAGEY",
  "CAIRN",
  "CAKED",
  "CAKES",
  "CALIX",
  "CALKS",
  "CALLA",
  "CALLS",
  "CALMS",
  "CALVE",
  "CALYX",
  "CAMEL",
  "CAMEO",
  "CAMPO",
  "CAMPS",
  "CAMPY",
  "CANAL",
  "CANDY",
  "CANED",
  "CANES",
  "CANNA",
  "CANNY",
  "CANOE",
  "CANON",
  "CANST",
  "CANTO",
  "CANTS",
  "CAPED",
  "CAPER",
  "CAPES",
  "CAPON",
  "CAPOS",
  "CARAT",
  "CARDS",
  "CARED",
  "CARER",
  "CARES",
  "CARET",
  "CARGO",
  "CARNY",
  "CAROB",
  "CAROL",
  "CAROM",
  "CARPS",
  "CARRY",
  "CARTE",
  "CARTS",
  "CARVE",
  "CASAS",
  "CASED",
  "CASES",
  "CASKS",
  "CASTE",
  "CASTS",
  "CATCH",
  "CATER",
  "CATTY",
  "CAULK",
  "CAULS",
  "CAUSE",
  "CAVED",
  "CAVES",
  "CAVIL",
  "CAWED",
  "CEASE",
  "CEDAR",
  "CEDED",
  "CEDES",
  "CEILS",
  "CELEB",
  "CELLO",
  "CELLS",
  "CENTO",
  "CENTS",
  "CHAFE",
  "CHAFF",
  "CHAIN",
  "CHAIR",
  "CHALK",
  "CHAMP",
  "CHANT",
  "CHAOS",
  "CHAPS",
  "CHARD",
  "CHARM",
  "CHARS",
  "CHART",
  "CHARY",
  "CHASE",
  "CHASM",
  "CHATS",
  "CHAWS",
  "CHEAP",
  "CHEAT",
  "CHECK",
  "CHEEK",
  "CHEEP",
  "CHEER",
  "CHEFS",
  "CHERT",
  "CHESS",
  "CHEST",
  "CHEWS",
  "CHEWY",
  "CHICK",
  "CHIDE",
  "CHIEF",
  "CHILD",
  "CHILE",
  "CHILI",
  "CHILL",
  "CHIME",
  "CHIMP",
  "CHINA",
  "CHINE",
  "CHINK",
  "CHINO",
  "CHINS",
  "CHIPS",
  "CHIRP",
  "CHITS",
  "CHIVE",
  "CHOCK",
  "CHOIR",
  "CHOKE",
  "CHOMP",
  "CHOPS",
  "CHORD",
  "CHORE",
  "CHOSE",
  "CHOWS",
  "CHUCK",
  "CHUFF",
  "CHUGS",
  "CHUMP",
  "CHUMS",
  "CHUNK",
  "CHURL",
  "CHURN",
  "CHUTE",
  "CIDER",
  "CIGAR",
  "CILIA",
  "CILLS",
  "CINCH",
  "CIRCA",
  "CIRRI",
  "CITED",
  "CITES",
  "CIVET",
  "CIVIC",
  "CIVIL",
  "CIVVY",
  "CLACK",
  "CLADS",
  "CLAIM",
  "CLAMP",
  "CLAMS",
  "CLANG",
  "CLANK",
  "CLANS",
  "CLAPS",
  "CLASH",
  "CLASP",
  "CLASS",
  "CLAVE",
  "CLAWS",
  "CLAYS",
  "CLEAN",
  "CLEAR",
  "CLEAT",
  "CLEFS",
  "CLEFT",
  "CLERK",
  "CLEWS",
  "CLICK",
  "CLIFF",
  "CLIMB",
  "CLIME",
  "CLING",
  "CLINK",
  "CLIPS",
  "CLOAK",
  "CLOCK",
  "CLODS",
  "CLOGS",
  "CLOMP",
  "CLONE",
  "CLOPS",
  "CLOSE",
  "CLOTH",
  "CLOTS",
  "CLOUD",
  "CLOUT",
  "CLOVE",
  "CLOWN",
  "CLOYS",
  "CLUBS",
  "CLUCK",
  "CLUED",
  "CLUES",
  "CLUMP",
  "CLUNG",
  "CLUNK",
  "COACH",
  "COALS",
  "COAST",
  "COATI",
  "COATS",
  "COBRA",
  "COCAS",
  "COCCI",
  "COCKS",
  "COCKY",
  "COCOA",
  "COCOS",
  "CODAS",
  "CODED",
  "CODER",
  "CODES",
  "CODEX",
  "CODON",
  "COEDS",
  "COHOS",
  "COIFS",
  "COILS",
  "COINS",
  "COKED",
  "COKES",
  "COLAS",
  "COLDS",
  "COLIC",
  "COLON",
  "COLOR",
  "COLTS",
  "COMAS",
  "COMBO",
  "COMBS",
  "COMER",
  "COMES",
  "COMET",
  "COMFY",
  "COMIC",
  "COMMA",
  "COMPS",
  "CONCH",
  "CONDO",
  "CONED",
  "CONES",
  "CONEY",
  "CONGA",
  "CONIC",
  "CONKS",
  "COOCH",
  "COOED",
  "COOKS",
  "COOLS",
  "COONS",
  "COOPS",
  "COOTS",
  "COPED",
  "COPER",
  "COPES",
  "COPRA",
  "COPSE",
  "CORAL",
  "CORDS",
  "CORED",
  "CORES",
  "CORGI",
  "CORKS",
  "CORKY",
  "CORMS",
  "CORNS",
  "CORNU",
  "CORNY",
  "CORPS",
  "COSET",
  "COSTA",
  "COSTS",
  "COTES",
  "COTTA",
  "COUCH",
  "COUGH",
  "COULD",
  "COUNT",
  "COUPE",
  "COUPS",
  "COURT",
  "COUTH",
  "COVEN",
  "COVER",
  "COVES",
  "COVET",
  "COVEY",
  "COWED",
  "COWER",
  "COWLS",
  "COWRY",
  "COXED",
  "COXES",
  "COYER",
  "COYLY",
  "COYPU",
  "COZEN",
  "CRABS",
  "CRACK",
  "CRAFT",
  "CRAGS",
  "CRAMP",
  "CRAMS",
  "CRANE",
  "CRANK",
  "CRAPS",
  "CRASH",
  "CRASS",
  "CRATE",
  "CRAVE",
  "CRAWL",
  "CRAWS",
  "CRAZE",
  "CRAZY",
  "CREAK",
  "CREAM",
  "CREDO",
  "CREED",
  "CREEK",
  "CREEL",
  "CREEP",
  "CREME",
  "CREPE",
  "CREPT",
  "CRESS",
  "CREST",
  "CREWS",
  "CRIBS",
  "CRICK",
  "CRIED",
  "CRIER",
  "CRIES",
  "CRIME",
  "CRIMP",
  "CRISP",
  "CRITS",
  "CROAK",
  "CROCK",
  "CROCS",
  "CROFT",
  "CRONE",
  "CRONY",
  "CROOK",
  "CROON",
  "CROPS",
  "CROSS",
  "CROUP",
  "CROWD",
  "CROWN",
  "CROWS",
  "CRUDE",
  "CRUDS",
  "CRUEL",
  "CRUET",
  "CRUFT",
  "CRUMB",
  "CRUMP",
  "CRUSE",
  "CRUSH",
  "CRUST",
  "CRYPT",
  "CUBBY",
  "CUBED",
  "CUBES",
  "CUBIC",
  "CUBIT",
  "CUFFS",
  "CUKES",
  "CULLS",
  "CULPA",
  "CULTS",
  "CUMIN",
  "CUNTS",
  "CUPPA",
  "CUPPY",
  "CURBS",
  "CURDS",
  "CURED",
  "CURES",
  "CURIE",
  "CURIO",
  "CURLS",
  "CURLY",
  "CURRY",
  "CURSE",
  "CURVE",
  "CURVY",
  "CUSHY",
  "CUSPS",
  "CUTER",
  "CUTIE",
  "CUTUP",
  "CYCAD",
  "CYCLE",
  "CYNIC",
  "CYSTS",
  "CZARS",
  "DACHA",
  "DADDY",
  "DADOS",
  "DAFFY",
  "DAILY",
  "DAIRY",
  "DAISY",
  "DALES",
  "DALLY",
  "DAMES",
  "DAMNS",
  "DAMPS",
  "DANCE",
  "DANDY",
  "DARED",
  "DARES",
  "DARKS",
  "DARKY",
  "DARNS",
  "DARTS",
  "DATED",
  "DATER",
  "DATES",
  "DATUM",
  "DAUBS",
  "DAUNT",
  "DAVIT",
  "DAWNS",
  "DAZED",
  "DAZES",
  "DEALS",
  "DEALT",
  "DEANS",
  "DEARS",
  "DEATH",
  "DEBAR",
  "DEBIT",
  "DEBTS",
  "DEBUG",
  "DEBUT",
  "DECAF",
  "DECAL",
  "DECAY",
  "DECKS",
  "DECOR",
  "DECOY",
  "DECRY",
  "DEEDS",
  "DEEMS",
  "DEEPS",
  "DEFER",
  "DEGAS",
  "DEIFY",
  "DEIGN",
  "DEISM",
  "DEITY",
  "DELAY",
  "DELFT",
  "DELIS",
  "DELLS",
  "DELTA",
  "DELVE",
  "DEMIT",
  "DEMON",
  "DEMOS",
  "DEMUR",
  "DENIM",
  "DENSE",
  "DENTS",
  "DEPOT",
  "DEPTH",
  "DERBY",
  "DESEX",
  "DESKS",
  "DETER",
  "DEUCE",
  "DEVIL",
  "DEWED",
  "DHOWS",
  "DIALS",
  "DIARY",
  "DIAZO",
  "DICED",
  "DICES",
  "DICEY",
  "DICKS",
  "DICKY",
  "DICOT",
  "DICTA",
  "DIDDY",
  "DIDOS",
  "DIDST",
  "DIETS",
  "DIGIT",
  "DIKED",
  "DIKES",
  "DILDO",
  "DILLS",
  "DILLY",
  "DIMER",
  "DIMES",
  "DIMLY",
  "DINAR",
  "DINED",
  "DINER",
  "DINES",
  "DINGO",
  "DINGS",
  "DINGY",
  "DINKS",
  "DINKY",
  "DINTS",
  "DIODE",
  "DIPPY",
  "DIPSO",
  "DIRER",
  "DIRGE",
  "DIRKS",
  "DIRTY",
  "DISCO",
  "DISCS",
  "DISHY",
  "DISKS",
  "DITCH",
  "DITTO",
  "DITTY",
  "DIVAN",
  "DIVAS",
  "DIVED",
  "DIVER",
  "DIVES",
  "DIVOT",
  "DIVVY",
  "DIZZY",
  "DJINN",
  "DOCKS",
  "DODGE",
  "DODGY",
  "DODOS",
  "DOERS",
  "DOEST",
  "DOETH",
  "DOFFS",
  "DOGES",
  "DOGGO",
  "DOGGY",
  "DOGIE",
  "DOGMA",
  "DOILY",
  "DOING",
  "DOLCE",
  "DOLED",
  "DOLES",
  "DOLLS",
  "DOLLY",
  "DOLOR",
  "DOLTS",
  "DOMED",
  "DOMES",
  "DONEE",
  "DONNA",
  "DONOR",
  "DONUT",
  "DOOMS",
  "DOORS",
  "DOOZY",
  "DOPED",
  "DOPES",
  "DOPEY",
  "DORKS",
  "DORKY",
  "DORMS",
  "DOTED",
  "DOTES",
  "DOTTY",
  "DOUBT",
  "DOUGH",
  "DOUSE",
  "DOVES",
  "DOWDY",
  "DOWEL",
  "DOWER",
  "DOWNS",
  "DOWNY",
  "DOWRY",
  "DOWSE",
  "DOYEN",
  "DOZED",
  "DOZEN",
  "DOZER",
  "DOZES",
  "DRAFT",
  "DRAGS",
  "DRAIN",
  "DRAKE",
  "DRAMA",
  "DRAMS",
  "DRANK",
  "DRAPE",
  "DRAWL",
  "DRAWN",
  "DRAWS",
  "DRAYS",
  "DREAD",
  "DREAM",
  "DREAR",
  "DRECK",
  "DREGS",
  "DRESS",
  "DRIED",
  "DRIER",
  "DRIES",
  "DRIFT",
  "DRILL",
  "DRILY",
  "DRINK",
  "DRIPS",
  "DRIVE",
  "DROID",
  "DROLL",
  "DRONE",
  "DROOL",
  "DROOP",
  "DROPS",
  "DROSS",
  "DROVE",
  "DROWN",
  "DRUBS",
  "DRUGS",
  "DRUID",
  "DRUMS",
  "DRUNK",
  "DRYAD",
  "DRYER",
  "DRYLY",
  "DUALS",
  "DUCAL",
  "DUCAT",
  "DUCES",
  "DUCHY",
  "DUCKS",
  "DUCKY",
  "DUCTS",
  "DUDES",
  "DUELS",
  "DUETS",
  "DUFFS",
  "DUKES",
  "DULLS",
  "DULLY",
  "DULSE",
  "DUMMY",
  "DUMPS",
  "DUMPY",
  "DUNCE",
  "DUNES",
  "DUNGS",
  "DUNNO",
  "DUOMO",
  "DUPED",
  "DUPER",
  "DUPES",
  "DUPLE",
  "DURST",
  "DUSKS",
  "DUSKY",
  "DUSTS",
  "DUSTY",
  "DUTCH",
  "DUVET",
  "DWARF",
  "DWEEB",
  "DWELL",
  "DWELT",
  "DYADS",
  "DYERS",
  "DYING",
  "DYKES",
  "DYNES",
  "EAGER",
  "EAGLE",
  "EARLS",
  "EARLY",
  "EARNS",
  "EARTH",
  "EASED",
  "EASEL",
  "EASES",
  "EATEN",
  "EATER",
  "EAVES",
  "EBBED",
  "EBONY",
  "ECLAT",
  "EDEMA",
  "EDGED",
  "EDGES",
  "EDICT",
  "EDIFY",
  "EDITS",
  "EDUCE",
  "EERIE",
  "EGADS",
  "EGGED",
  "EGGER",
  "EGRET",
  "EIDER",
  "EIGHT",
  "EJECT",
  "EKING",
  "ELAND",
  "ELATE",
  "ELBOW",
  "ELDER",
  "ELECT",
  "ELEGY",
  "ELFIN",
  "ELIDE",
  "ELITE",
  "ELOPE",
  "ELUDE",
  "ELVES",
  "EMAIL",
  "EMBED",
  "EMBER",
  "EMCEE",
  "EMEND",
  "EMERY",
  "EMIRS",
  "EMITS",
  "EMOTE",
  "EMPTY",
  "ENACT",
  "ENDED",
  "ENDOW",
  "ENDUE",
  "ENEMA",
  "ENEMY",
  "ENJOY",
  "ENNUI",
  "ENROL",
  "ENSUE",
  "ENTER",
  "ENTRY",
  "ENVOI",
  "ENVOY",
  "EPACT",
  "EPEES",
  "EPHAH",
  "EPHOD",
  "EPICS",
  "EPOCH",
  "EPOXY",
  "EQUAL",
  "EQUIP",
  "ERASE",
  "ERECT",
  "ERODE",
  "ERRED",
  "ERROR",
  "ERUCT",
  "ERUPT",
  "ESSAY",
  "ESSES",
  "ESTER",
  "ESTOP",
  "ETHER",
  "ETHIC",
  "ETHOS",
  "ETHYL",
  "ETUDE",
  "EVADE",
  "EVENS",
  "EVENT",
  "EVICT",
  "EVILS",
  "EVOKE",
  "EXACT",
  "EXALT",
  "EXAMS",
  "EXCEL",
  "EXEAT",
  "EXECS",
  "EXERT",
  "EXILE",
  "EXIST",
  "EXITS",
  "EXPAT",
  "EXPEL",
  "EXPOS",
  "EXTOL",
  "EXTRA",
  "EXUDE",
  "EXULT",
  "EXURB",
  "EYING",
  "EYRIE",
  "FABLE",
  "FACED",
  "FACER",
  "FACES",
  "FACET",
  "FACTS",
  "FADDY",
  "FADED",
  "FADER",
  "FADES",
  "FAERY",
  "FAGOT",
  "FAILS",
  "FAINT",
  "FAIRS",
  "FAIRY",
  "FAITH",
  "FAKED",
  "FAKER",
  "FAKES",
  "FAKIR",
  "FALLS",
  "FALSE",
  "FAMED",
  "FANCY",
  "FANGS",
  "FANNY",
  "FARAD",
  "FARCE",
  "FARED",
  "FARES",
  "FARMS",
  "FARTS",
  "FASTS",
  "FATAL",
  "FATED",
  "FATES",
  "FATSO",
  "FATTY",
  "FATWA",
  "FAULT",
  "FAUNA",
  "FAUNS",
  "FAVOR",
  "FAWNS",
  "FAXED",
  "FAXES",
  "FAZED",
  "FAZES",
  "FEARS",
  "FEAST",
  "FEATS",
  "FECAL",
  "FECES",
  "FEEDS",
  "FEELS",
  "FEIGN",
  "FEINT",
  "FELLA",
  "FELLS",
  "FELON",
  "FELTS",
  "FEMME",
  "FEMUR",
  "FENCE",
  "FENDS",
  "FERAL",
  "FERMI",
  "FERNS",
  "FERRY",
  "FETAL",
  "FETCH",
  "FETED",
  "FETES",
  "FETID",
  "FETOR",
  "FETUS",
  "FEUDS",
  "FEUED",
  "FEVER",
  "FIATS",
  "FIBER",
  "FIBRE",
  "FICHE",
  "FICHU",
  "FIEFS",
  "FIELD",
  "FIEND",
  "FIERY",
  "FIFES",
  "FIFTH",
  "FIFTY",
  "FIGHT",
  "FILCH",
  "FILED",
  "FILES",
  "FILET",
  "FILLS",
  "FILLY",
  "FILMS",
  "FILMY",
  "FILTH",
  "FINAL",
  "FINCH",
  "FINDS",
  "FINED",
  "FINER",
  "FINES",
  "FINIS",
  "FINKS",
  "FINNY",
  "FIORD",
  "FIRED",
  "FIRES",
  "FIRMS",
  "FIRST",
  "FIRTH",
  "FISHY",
  "FISTS",
  "FIVER",
  "FIVES",
  "FIXED",
  "FIXER",
  "FIXES",
  "FIZZY",
  "FJORD",
  "FLACK",
  "FLAGS",
  "FLAIL",
  "FLAIR",
  "FLAKE",
  "FLAKY",
  "FLAME",
  "FLAMS",
  "FLANK",
  "FLARE",
  "FLASH",
  "FLASK",
  "FLATS",
  "FLAWS",
  "FLAYS",
  "FLEAS",
  "FLECK",
  "FLEES",
  "FLEET",
  "FLESH",
  "FLICK",
  "FLICS",
  "FLIED",
  "FLIER",
  "FLIES",
  "FLING",
  "FLINT",
  "FLIPS",
  "FLIRT",
  "FLITS",
  "FLOAT",
  "FLOCK",
  "FLOES",
  "FLOGS",
  "FLOOD",
  "FLOOR",
  "FLOPS",
  "FLORA",
  "FLOSS",
  "FLOUR",
  "FLOUT",
  "FLOWN",
  "FLOWS",
  "FLUBS",
  "FLUES",
  "FLUFF",
  "FLUID",
  "FLUKE",
  "FLUKY",
  "FLUME",
  "FLUNG",
  "FLUNK",
  "FLUSH",
  "FLUTE",
  "FLYBY",
  "FLYER",
  "FOALS",
  "FOAMS",
  "FOAMY",
  "FOCAL",
  "FOCUS",
  "FOGEY",
  "FOGGY",
  "FOILS",
  "FOIST",
  "FOLDS",
  "FOLIA",
  "FOLIO",
  "FOLKS",
  "FOLKY",
  "FOLLY",
  "FONDU",
  "FONTS",
  "FOODS",
  "FOOLS",
  "FOOTS",
  "FORAY",
  "FORCE",
  "FORDS",
  "FORGE",
  "FORGO",
  "FORKS",
  "FORMS",
  "FORTE",
  "FORTH",
  "FORTS",
  "FORTY",
  "FORUM",
  "FOSSA",
  "FOSSE",
  "FOULS",
  "FOUND",
  "FOUNT",
  "FOURS",
  "FOVEA",
  "FOWLS",
  "FOXED",
  "FOXES",
  "FOYER",
  "FRAIL",
  "FRAME",
  "FRANC",
  "FRANK",
  "FRATS",
  "FRAUD",
  "FRAYS",
  "FREAK",
  "FREED",
  "FREER",
  "FREES",
  "FRESH",
  "FRETS",
  "FRIAR",
  "FRIED",
  "FRIER",
  "FRIES",
  "FRIGS",
  "FRILL",
  "FRISK",
  "FRIZZ",
  "FROCK",
  "FROGS",
  "FROND",
  "FRONT",
  "FROSH",
  "FROST",
  "FROTH",
  "FROWN",
  "FROZE",
  "FRUIT",
  "FRUMP",
  "FRYER",
  "FUCKS",
  "FUDGE",
  "FUELS",
  "FUGAL",
  "FUGUE",
  "FULLS",
  "FULLY",
  "FUMED",
  "FUMES",
  "FUNDS",
  "FUNGI",
  "FUNGO",
  "FUNKS",
  "FUNKY",
  "FUNNY",
  "FURLS",
  "FUROR",
  "FURRY",
  "FURZE",
  "FUSED",
  "FUSEE",
  "FUSES",
  "FUSSY",
  "FUSTY",
  "FUTON",
  "FUZED",
  "FUZES",
  "FUZZY",
  "GABBY",
  "GABLE",
  "GAFFE",
  "GAFFS",
  "GAGES",
  "GAILY",
  "GAINS",
  "GAITS",
  "GALAS",
  "GALES",
  "GALLS",
  "GAMBA",
  "GAMED",
  "GAMER",
  "GAMES",
  "GAMEY",
  "GAMIN",
  "GAMMA",
  "GAMUT",
  "GANEF",
  "GANGS",
  "GAOLS",
  "GAPED",
  "GAPER",
  "GAPES",
  "GARBS",
  "GASES",
  "GASPS",
  "GASSY",
  "GATED",
  "GATES",
  "GATOR",
  "GAUDY",
  "GAUGE",
  "GAUNT",
  "GAUSS",
  "GAUZE",
  "GAUZY",
  "GAVEL",
  "GAWKS",
  "GAWKY",
  "GAYER",
  "GAZED",
  "GAZES",
  "GEARS",
  "GECKO",
  "GEEKS",
  "GEESE",
  "GELDS",
  "GENES",
  "GENET",
  "GENIE",
  "GENII",
  "GENRE",
  "GENTS",
  "GENUS",
  "GEODE",
  "GEOID",
  "GERMS",
  "GESSO",
  "GETUP",
  "GHOST",
  "GHOUL",
  "GIANT",
  "GIBED",
  "GIBES",
  "GIDDY",
  "GIFTS",
  "GIGUE",
  "GILDS",
  "GILLS",
  "GILTS",
  "GIMME",
  "GIMPS",
  "GIPSY",
  "GIRDS",
  "GIRLS",
  "GIRLY",
  "GIROS",
  "GIRTH",
  "GIRTS",
  "GISMO",
  "GISTS",
  "GIVEN",
  "GIVER",
  "GIVES",
  "GIZMO",
  "GLADE",
  "GLADS",
  "GLAND",
  "GLANS",
  "GLARE",
  "GLASS",
  "GLAZE",
  "GLEAM",
  "GLEAN",
  "GLEBE",
  "GLEES",
  "GLENS",
  "GLIDE",
  "GLINT",
  "GLITZ",
  "GLOAT",
  "GLOBE",
  "GLOBS",
  "GLOMS",
  "GLOOM",
  "GLORY",
  "GLOSS",
  "GLOVE",
  "GLOWS",
  "GLUED",
  "GLUES",
  "GLUEY",
  "GLUON",
  "GLUTS",
  "GLYPH",
  "GNARL",
  "GNASH",
  "GNATS",
  "GNAWS",
  "GNOME",
  "GOADS",
  "GOALS",
  "GOATS",
  "GODLY",
  "GOERS",
  "GOEST",
  "GOETH",
  "GOFER",
  "GOING",
  "GOLDS",
  "GOLEM",
  "GOLFS",
  "GOLLY",
  "GONAD",
  "GONER",
  "GONGS",
  "GONZO",
  "GOODS",
  "GOODY",
  "GOOEY",
  "GOOFS",
  "GOOFY",
  "GOOKS",
  "GOONS",
  "GOOSE",
  "GOOSY",
  "GORED",
  "GORES",
  "GORSE",
  "GOTHS",
  "GOUDA",
  "GOUGE",
  "GOURD",
  "GOUTS",
  "GOUTY",
  "GOWNS",
  "GOYIM",
  "GRABS",
  "GRACE",
  "GRADE",
  "GRADS",
  "GRAFT",
  "GRAIL",
  "GRAIN",
  "GRAMS",
  "GRAND",
  "GRANT",
  "GRAPE",
  "GRAPH",
  "GRASP",
  "GRASS",
  "GRATE",
  "GRAVE",
  "GRAVY",
  "GRAYS",
  "GRAZE",
  "GREAT",
  "GREBE",
  "GREED",
  "GREEK",
  "GREEN",
  "GREET",
  "GREYS",
  "GRIDS",
  "GRIEF",
  "GRIFT",
  "GRILL",
  "GRIME",
  "GRIMY",
  "GRIND",
  "GRINS",
  "GRIPE",
  "GRIPS",
  "GRIST",
  "GRITS",
  "GROAN",
  "GROAT",
  "GRODY",
  "GROGS",
  "GROIN",
  "GROKS",
  "GROOM",
  "GROPE",
  "GROSS",
  "GROUP",
  "GROUT",
  "GROVE",
  "GROWL",
  "GROWN",
  "GROWS",
  "GRUBS",
  "GRUEL",
  "GRUFF",
  "GRUMP",
  "GRUNT",
  "GUANO",
  "GUARD",
  "GUAVA",
  "GUESS",
  "GUEST",
  "GUIDE",
  "GUILD",
  "GUILE",
  "GUILT",
  "GUISE",
  "GULAG",
  "GULCH",
  "GULES",
  "GULFS",
  "GULLS",
  "GULLY",
  "GULPS",
  "GUMBO",
  "GUMMY",
  "GUNKY",
  "GUNNY",
  "GUPPY",
  "GURUS",
  "GUSHY",
  "GUSTO",
  "GUSTS",
  "GUSTY",
  "GUTSY",
  "GUTTY",
  "GUYED",
  "GYPSY",
  "GYROS",
  "GYVES",
  "HABIT",
  "HACKS",
  "HADES",
  "HADST",
  "HAFTS",
  "HAIKU",
  "HAILS",
  "HAIRS",
  "HAIRY",
  "HALED",
  "HALER",
  "HALES",
  "HALLO",
  "HALLS",
  "HALMA",
  "HALOS",
  "HALTS",
  "HALVE",
  "HAMES",
  "HAMMY",
  "HAMZA",
  "HANDS",
  "HANDY",
  "HANGS",
  "HANKS",
  "HANKY",
  "HAPLY",
  "HAPPY",
  "HARDY",
  "HAREM",
  "HARES",
  "HARKS",
  "HARMS",
  "HARPS",
  "HARPY",
  "HARRY",
  "HARSH",
  "HARTS",
  "HASPS",
  "HASTE",
  "HASTY",
  "HATCH",
  "HATED",
  "HATER",
  "HATES",
  "HAULS",
  "HAUNT",
  "HAVEN",
  "HAVES",
  "HAVOC",
  "HAWKS",
  "HAZED",
  "HAZEL",
  "HAZER",
  "HAZES",
  "HEADS",
  "HEADY",
  "HEALS",
  "HEAPS",
  "HEARD",
  "HEARS",
  "HEART",
  "HEATH",
  "HEATS",
  "HEAVE",
  "HEAVY",
  "HEDGE",
  "HEEDS",
  "HEELS",
  "HEFTS",
  "HEFTY",
  "HEIGH",
  "HEIRS",
  "HEIST",
  "HELIX",
  "HELLO",
  "HELMS",
  "HELPS",
  "HENCE",
  "HENGE",
  "HENNA",
  "HENRY",
  "HERBS",
  "HERBY",
  "HERDS",
  "HERON",
  "HERTZ",
  "HEWED",
  "HEWER",
  "HEXAD",
  "HEXED",
  "HEXES",
  "HICKS",
  "HIDES",
  "HIGHS",
  "HIKED",
  "HIKER",
  "HIKES",
  "HILAR",
  "HILLS",
  "HILLY",
  "HILTS",
  "HILUM",
  "HIMBO",
  "HINDS",
  "HINGE",
  "HINTS",
  "HIPPO",
  "HIPPY",
  "HIRED",
  "HIRES",
  "HITCH",
  "HIVED",
  "HIVES",
  "HOAGY",
  "HOARD",
  "HOARY",
  "HOBBY",
  "HOBOS",
  "HOCKS",
  "HOCUS",
  "HOGAN",
  "HOIST",
  "HOKEY",
  "HOKUM",
  "HOLDS",
  "HOLED",
  "HOLES",
  "HOLLY",
  "HOMED",
  "HOMER",
  "HOMES",
  "HOMEY",
  "HOMOS",
  "HONED",
  "HONES",
  "HONEY",
  "HONKS",
  "HONKY",
  "HONOR",
  "HOOCH",
  "HOODS",
  "HOOEY",
  "HOOFS",
  "HOOKS",
  "HOOKY",
  "HOOPS",
  "HOOTS",
  "HOPED",
  "HOPES",
  "HORDE",
  "HORNS",
  "HORNY",
  "HORSE",
  "HORSY",
  "HOSED",
  "HOSES",
  "HOSTS",
  "HOTEL",
  "HOTLY",
  "HOUND",
  "HOURI",
  "HOURS",
  "HOUSE",
  "HOVEL",
  "HOVER",
  "HOWDY",
  "HOWLS",
  "HUBBY",
  "HUFFS",
  "HUFFY",
  "HUGER",
  "HULAS",
  "HULKS",
  "HULLO",
  "HULLS",
  "HUMAN",
  "HUMID",
  "HUMOR",
  "HUMPH",
  "HUMPS",
  "HUMPY",
  "HUMUS",
  "HUNCH",
  "HUNKS",
  "HUNKY",
  "HUNTS",
  "HURLS",
  "HURRY",
  "HURTS",
  "HUSKS",
  "HUSKY",
  "HUSSY",
  "HUTCH",
  "HUZZA",
  "HYDRA",
  "HYDRO",
  "HYENA",
  "HYING",
  "HYMEN",
  "HYMNS",
  "HYPED",
  "HYPER",
  "HYPES",
  "HYPOS",
  "IAMBS",
  "ICHOR",
  "ICIER",
  "ICING",
  "ICONS",
  "IDEAL",
  "IDEAS",
  "IDIOM",
  "IDIOT",
  "IDLED",
  "IDLER",
  "IDLES",
  "IDOLS",
  "IDYLL",
  "IDYLS",
  "IGLOO",
  "IKATS",
  "IKONS",
  "ILEUM",
  "ILEUS",
  "ILIAC",
  "ILIUM",
  "IMAGE",
  "IMAGO",
  "IMAMS",
  "IMBED",
  "IMBUE",
  "IMPEL",
  "IMPLY",
  "IMPRO",
  "INANE",
  "INAPT",
  "INCUR",
  "INDEX",
  "INDIE",
  "INEPT",
  "INERT",
  "INFER",
  "INFIX",
  "INFRA",
  "INGOT",
  "INJUN",
  "INKED",
  "INLAY",
  "INLET",
  "INNER",
  "INPUT",
  "INSET",
  "INTER",
  "INTRO",
  "INURE",
  "IONIC",
  "IOTAS",
  "IRATE",
  "IRKED",
  "IRONS",
  "IRONY",
  "ISLES",
  "ISLET",
  "ISSUE",
  "ITCHY",
  "ITEMS",
  "IVIED",
  "IVIES",
  "IVORY",
  "IXNAY",
  "JACKS",
  "JADED",
  "JADES",
  "JAGGY",
  "JAILS",
  "JAMBS",
  "JAMMY",
  "JANES",
  "JAPAN",
  "JAUNT",
  "JAWED",
  "JAZZY",
  "JEANS",
  "JEEPS",
  "JEERS",
  "JELLO",
  "JELLS",
  "JELLY",
  "JENNY",
  "JERKS",
  "JERKY",
  "JERRY",
  "JESTS",
  "JETTY",
  "JEWEL",
  "JIBED",
  "JIBES",
  "JIFFS",
  "JIFFY",
  "JIHAD",
  "JILTS",
  "JIMMY",
  "JINGO",
  "JINGS",
  "JINKS",
  "JINNS",
  "JIVED",
  "JIVES",
  "JOCKS",
  "JOEYS",
  "JOHNS",
  "JOINS",
  "JOINT",
  "JOIST",
  "JOKED",
  "JOKER",
  "JOKES",
  "JOLLY",
  "JOLTS",
  "JOULE",
  "JOUST",
  "JOWLS",
  "JOYED",
  "JUDGE",
  "JUICE",
  "JUICY",
  "JUJUS",
  "JUKES",
  "JULEP",
  "JUMBO",
  "JUMPS",
  "JUMPY",
  "JUNCO",
  "JUNKS",
  "JUNKY",
  "JUNTA",
  "JUROR",
  "JUTES",
  "KABOB",
  "KAPOK",
  "KAPPA",
  "KAPUT",
  "KARAT",
  "KARMA",
  "KAYAK",
  "KAYOS",
  "KAZOO",
  "KEBAB",
  "KEELS",
  "KEENS",
  "KEEPS",
  "KEFIR",
  "KELPS",
  "KENAF",
  "KEPIS",
  "KERBS",
  "KERFS",
  "KERNS",
  "KETCH",
  "KEYED",
  "KHAKI",
  "KHANS",
  "KICKS",
  "KICKY",
  "KIDDO",
  "KIKES",
  "KILLS",
  "KILNS",
  "KILOS",
  "KILTS",
  "KINDA",
  "KINDS",
  "KINGS",
  "KINKS",
  "KINKY",
  "KIOSK",
  "KIRKS",
  "KITHS",
  "KITTY",
  "KIVAS",
  "KIWIS",
  "KLIEG",
  "KLUGE",
  "KLUTZ",
  "KNACK",
  "KNAVE",
  "KNEAD",
  "KNEED",
  "KNEEL",
  "KNEES",
  "KNELL",
  "KNELT",
  "KNIFE",
  "KNISH",
  "KNITS",
  "KNOBS",
  "KNOCK",
  "KNOLL",
  "KNOPS",
  "KNOTS",
  "KNOUT",
  "KNOWN",
  "KNOWS",
  "KNURL",
  "KOALA",
  "KOINE",
  "KOOKS",
  "KOOKY",
  "KOPEK",
  "KRAAL",
  "KRAUT",
  "KRILL",
  "KRONA",
  "KRONE",
  "KUDOS",
  "KUDZU",
  "KULAK",
  "KYRIE",
  "LABEL",
  "LABIA",
  "LABOR",
  "LACED",
  "LACES",
  "LACKS",
  "LADED",
  "LADEN",
  "LADES",
  "LADLE",
  "LAGER",
  "LAIRD",
  "LAIRS",
  "LAITY",
  "LAKER",
  "LAKES",
  "LAMAS",
  "LAMBS",
  "LAMED",
  "LAMER",
  "LAMES",
  "LAMPS",
  "LANAI",
  "LANCE",
  "LANDS",
  "LANES",
  "LANKY",
  "LAPEL",
  "LAPIS",
  "LAPSE",
  "LARCH",
  "LARDS",
  "LARGE",
  "LARGO",
  "LARKS",
  "LARVA",
  "LASED",
  "LASER",
  "LASES",
  "LASSO",
  "LASTS",
  "LATCH",
  "LATER",
  "LATEX",
  "LATHE",
  "LATHS",
  "LAUDS",
  "LAUGH",
  "LAVAS",
  "LAVED",
  "LAVER",
  "LAVES",
  "LAWNS",
  "LAXER",
  "LAYER",
  "LAYUP",
  "LAZED",
  "LAZES",
  "LEACH",
  "LEADS",
  "LEAFS",
  "LEAFY",
  "LEAKS",
  "LEAKY",
  "LEANS",
  "LEANT",
  "LEAPS",
  "LEAPT",
  "LEARN",
  "LEASE",
  "LEASH",
  "LEAST",
  "LEAVE",
  "LEDGE",
  "LEECH",
  "LEEKS",
  "LEERS",
  "LEERY",
  "LEFTS",
  "LEFTY",
  "LEGAL",
  "LEGGY",
  "LEGIT",
  "LEMMA",
  "LEMON",
  "LEMUR",
  "LENDS",
  "LENTO",
  "LEPER",
  "LEPTA",
  "LETUP",
  "LEVEE",
  "LEVEL",
  "LEVER",
  "LIARS",
  "LIBEL",
  "LIBRA",
  "LICIT",
  "LICKS",
  "LIEGE",
  "LIENS",
  "LIFER",
  "LIFTS",
  "LIGHT",
  "LIKED",
  "LIKEN",
  "LIKES",
  "LILAC",
  "LILTS",
  "LIMBO",
  "LIMBS",
  "LIMED",
  "LIMEN",
  "LIMES",
  "LIMEY",
  "LIMIT",
  "LIMNS",
  "LIMOS",
  "LIMPS",
  "LINED",
  "LINEN",
  "LINER",
  "LINES",
  "LINGO",
  "LINGS",
  "LINKS",
  "LIONS",
  "LIPID",
  "LIPPY",
  "LISLE",
  "LISPS",
  "LISTS",
  "LITER",
  "LITHE",
  "LITHO",
  "LITRE",
  "LIVED",
  "LIVEN",
  "LIVER",
  "LIVID",
  "LLAMA",
  "LOADS",
  "LOAFS",
  "LOAMY",
  "LOANS",
  "LOATH",
  "LOBAR",
  "LOBBY",
  "LOBES",
  "LOCAL",
  "LOCHS",
  "LOCKS",
  "LOCOS",
  "LOCUS",
  "LODES",
  "LODGE",
  "LOESS",
  "LOFTS",
  "LOFTY",
  "LOGES",
  "LOGIC",
  "LOGIN",
  "LOGOS",
  "LOINS",
  "LOLLS",
  "LOLLY",
  "LONER",
  "LONGS",
  "LOOKS",
  "LOOKY",
  "LOOMS",
  "LOONS",
  "LOONY",
  "LOOPS",
  "LOOPY",
  "LOOSE",
  "LOOTS",
  "LOPED",
  "LOPES",
  "LOPPY",
  "LORDS",
  "LORDY",
  "LORES",
  "LORRY",
  "LOSER",
  "LOSES",
  "LOSSY",
  "LOTSA",
  "LOTTO",
  "LOTUS",
  "LOUIS",
  "LOUSE",
  "LOUSY",
  "LOUTS",
  "LOVED",
  "LOVER",
  "LOVES",
  "LOWED",
  "LOWER",
  "LOWLY",
  "LOYAL",
  "LUAUS",
  "LUBES",
  "LUBRA",
  "LUCID",
  "LUCKS",
  "LUCKY",
  "LUCRE",
  "LULLS",
  "LULUS",
  "LUMEN",
  "LUMPS",
  "LUMPY",
  "LUNAR",
  "LUNCH",
  "LUNES",
  "LUNGE",
  "LUNGS",
  "LUPUS",
  "LURCH",
  "LURED",
  "LURES",
  "LURID",
  "LURKS",
  "LUSTS",
  "LUSTY",
  "LUTED",
  "LUTES",
  "LYCRA",
  "LYING",
  "LYMPH",
  "LYNCH",
  "LYRES",
  "LYRIC",
  "MACAW",
  "MACED",
  "MACER",
  "MACES",
  "MACHO",
  "MACRO",
  "MADAM",
  "MADLY",
  "MAFIA",
  "MAGIC",
  "MAGMA",
  "MAGUS",
  "MAHUA",
  "MAIDS",
  "MAILS",
  "MAIMS",
  "MAINS",
  "MAIZE",
  "MAJOR",
  "MAKER",
  "MAKES",
  "MALES",
  "MALLS",
  "MALTS",
  "MALTY",
  "MAMAS",
  "MAMBO",
  "MAMMA",
  "MAMMY",
  "MANES",
  "MANGE",
  "MANGO",
  "MANGY",
  "MANIA",
  "MANIC",
  "MANLY",
  "MANNA",
  "MANOR",
  "MANSE",
  "MANTA",
  "MAPLE",
  "MARCH",
  "MARES",
  "MARGE",
  "MARIA",
  "MARKS",
  "MARLS",
  "MARRY",
  "MARSH",
  "MARTS",
  "MASER",
  "MASKS",
  "MASON",
  "MASTS",
  "MATCH",
  "MATED",
  "MATER",
  "MATES",
  "MATEY",
  "MATHS",
  "MATTE",
  "MATZO",
  "MAULS",
  "MAUVE",
  "MAVEN",
  "MAVIS",
  "MAXIM",
  "MAXIS",
  "MAYBE",
  "MAYOR",
  "MAYST",
  "MAZED",
  "MAZER",
  "MAZES",
  "MEADS",
  "MEALS",
  "MEALY",
  "MEANS",
  "MEANT",
  "MEANY",
  "MEATS",
  "MEATY",
  "MEDAL",
  "MEDIA",
  "MEDIC",
  "MEETS",
  "MELBA",
  "MELDS",
  "MELEE",
  "MELON",
  "MELTS",
  "MEMES",
  "MEMOS",
  "MENDS",
  "MENUS",
  "MEOWS",
  "MERCY",
  "MERGE",
  "MERIT",
  "MERRY",
  "MESAS",
  "MESNE",
  "MESON",
  "MESSY",
  "METAL",
  "METED",
  "METER",
  "METES",
  "METRE",
  "METRO",
  "MEWED",
  "MEZZO",
  "MIAOW",
  "MICKS",
  "MICRO",
  "MIDDY",
  "MIDIS",
  "MIDST",
  "MIENS",
  "MIFFS",
  "MIGHT",
  "MIKED",
  "MIKES",
  "MILCH",
  "MILER",
  "MILES",
  "MILKS",
  "MILKY",
  "MILLS",
  "MIMED",
  "MIMEO",
  "MIMES",
  "MIMIC",
  "MIMSY",
  "MINCE",
  "MINDS",
  "MINED",
  "MINER",
  "MINES",
  "MINIM",
  "MINIS",
  "MINKS",
  "MINOR",
  "MINTS",
  "MINUS",
  "MIRED",
  "MIRES",
  "MIRTH",
  "MISER",
  "MISSY",
  "MISTS",
  "MISTY",
  "MITER",
  "MITES",
  "MITRE",
  "MITTS",
  "MIXED",
  "MIXER",
  "MIXES",
  "MIXUP",
  "MOANS",
  "MOATS",
  "MOCHA",
  "MOCKS",
  "MODAL",
  "MODEL",
  "MODEM",
  "MODES",
  "MOGUL",
  "MOHEL",
  "MOIRE",
  "MOIST",
  "MOLAL",
  "MOLAR",
  "MOLAS",
  "MOLDS",
  "MOLDY",
  "MOLES",
  "MOLLS",
  "MOLLY",
  "MOLTS",
  "MOMMA",
  "MOMMY",
  "MONAD",
  "MONDO",
  "MONEY",
  "MONIC",
  "MONKS",
  "MONTE",
  "MONTH",
  "MOOCH",
  "MOODS",
  "MOODY",
  "MOOED",
  "MOOLA",
  "MOONS",
  "MOONY",
  "MOORS",
  "MOOSE",
  "MOOTS",
  "MOPED",
  "MOPES",
  "MORAL",
  "MORAY",
  "MOREL",
  "MORES",
  "MORNS",
  "MORON",
  "MORPH",
  "MORTS",
  "MOSEY",
  "MOSSY",
  "MOTEL",
  "MOTES",
  "MOTET",
  "MOTHS",
  "MOTHY",
  "MOTIF",
  "MOTOR",
  "MOTTO",
  "MOULD",
  "MOULT",
  "MOUND",
  "MOUNT",
  "MOURN",
  "MOUSE",
  "MOUSY",
  "MOUTH",
  "MOVED",
  "MOVER",
  "MOVES",
  "MOVIE",
  "MOWED",
  "MOWER",
  "MOXIE",
  "MUCHO",
  "MUCKS",
  "MUCKY",
  "MUCUS",
  "MUDDY",
  "MUFFS",
  "MUFTI",
  "MUGGY",
  "MULCH",
  "MULCT",
  "MULES",
  "MULEY",
  "MULLS",
  "MUMMY",
  "MUMPS",
  "MUNCH",
  "MUNGE",
  "MUNGS",
  "MUONS",
  "MURAL",
  "MURKY",
  "MUSED",
  "MUSES",
  "MUSHY",
  "MUSIC",
  "MUSKS",
  "MUSKY",
  "MUSOS",
  "MUSTS",
  "MUSTY",
  "MUTED",
  "MUTES",
  "MUTTS",
  "MUXES",
  "MYLAR",
  "MYNAH",
  "MYNAS",
  "MYRRH",
  "MYTHS",
  "NABOB",
  "NACHO",
  "NADIR",
  "NAIAD",
  "NAILS",
  "NAIVE",
  "NAKED",
  "NAMED",
  "NAMES",
  "NANNY",
  "NAPES",
  "NAPPY",
  "NARCO",
  "NARCS",
  "NARDS",
  "NARES",
  "NASAL",
  "NASTY",
  "NATAL",
  "NATCH",
  "NATES",
  "NATTY",
  "NAVAL",
  "NAVEL",
  "NAVES",
  "NEARS",
  "NEATH",
  "NECKS",
  "NEEDS",
  "NEEDY",
  "NEGRO",
  "NEIGH",
  "NEONS",
  "NERDS",
  "NERDY",
  "NERFS",
  "NERVE",
  "NERVY",
  "NESTS",
  "NEVER",
  "NEWEL",
  "NEWER",
  "NEWLY",
  "NEWSY",
  "NEWTS",
  "NEXUS",
  "NICAD",
  "NICER",
  "NICHE",
  "NICKS",
  "NIECE",
  "NIFTY",
  "NIGHT",
  "NIMBI",
  "NINES",
  "NINJA",
  "NINNY",
  "NINTH",
  "NIPPY",
  "NISEI",
  "NITER",
  "NITRO",
  "NIXED",
  "NIXES",
  "NIXIE",
  "NOBLE",
  "NOBLY",
  "NODAL",
  "NODDY",
  "NODES",
  "NOELS",
  "NOHOW",
  "NOISE",
  "NOISY",
  "NOMAD",
  "NONCE",
  "NONES",
  "NOOKS",
  "NOOKY",
  "NOONS",
  "NOOSE",
  "NORMS",
  "NORTH",
  "NOSED",
  "NOSES",
  "NOSEY",
  "NOTCH",
  "NOTED",
  "NOTES",
  "NOUNS",
  "NOVAE",
  "NOVAS",
  "NOVEL",
  "NOWAY",
  "NUDES",
  "NUDGE",
  "NUDIE",
  "NUKED",
  "NUKES",
  "NULLS",
  "NUMBS",
  "NURSE",
  "NUTSY",
  "NUTTY",
  "NYLON",
  "NYMPH",
  "OAKEN",
  "OAKUM",
  "OARED",
  "OASES",
  "OASIS",
  "OATEN",
  "OATHS",
  "OBEAH",
  "OBESE",
  "OBEYS",
  "OBITS",
  "OBOES",
  "OCCUR",
  "OCEAN",
  "OCHER",
  "OCHRE",
  "OCTAL",
  "OCTET",
  "ODDER",
  "ODDLY",
  "ODIUM",
  "ODORS",
  "ODOUR",
  "OFFAL",
  "OFFED",
  "OFFER",
  "OFTEN",
  "OGLED",
  "OGLES",
  "OGRES",
  "OILED",
  "OILER",
  "OINKS",
  "OKAPI",
  "OKAYS",
  "OLDEN",
  "OLDER",
  "OLDIE",
  "OLIOS",
  "OLIVE",
  "OMBRE",
  "OMEGA",
  "OMENS",
  "OMITS",
  "ONION",
  "ONSET",
  "OOMPH",
  "OOZED",
  "OOZES",
  "OPALS",
  "OPENS",
  "OPERA",
  "OPINE",
  "OPIUM",
  "OPTED",
  "OPTIC",
  "ORALS",
  "ORATE",
  "ORBIT",
  "ORCAS",
  "ORDER",
  "ORGAN",
  "ORTHO",
  "OSIER",
  "OTHER",
  "OTTER",
  "OUGHT",
  "OUNCE",
  "OUSEL",
  "OUSTS",
  "OUTDO",
  "OUTER",
  "OUTGO",
  "OUTTA",
  "OUZEL",
  "OVALS",
  "OVARY",
  "OVATE",
  "OVENS",
  "OVERS",
  "OVERT",
  "OVOID",
  "OVULE",
  "OWING",
  "OWLET",
  "OWNED",
  "OWNER",
  "OXBOW",
  "OXEYE",
  "OXIDE",
  "OXLIP",
  "OZONE",
  "PACED",
  "PACER",
  "PACES",
  "PACKS",
  "PACTS",
  "PADDY",
  "PADRE",
  "PAEAN",
  "PAGAN",
  "PAGED",
  "PAGER",
  "PAGES",
  "PAILS",
  "PAINS",
  "PAINT",
  "PAIRS",
  "PALED",
  "PALER",
  "PALES",
  "PALLS",
  "PALLY",
  "PALMS",
  "PALMY",
  "PALSY",
  "PANDA",
  "PANEL",
  "PANES",
  "PANGA",
  "PANGS",
  "PANIC",
  "PANSY",
  "PANTS",
  "PANTY",
  "PAPAL",
  "PAPAS",
  "PAPAW",
  "PAPER",
  "PAPPY",
  "PARAS",
  "PARCH",
  "PARDS",
  "PARED",
  "PAREN",
  "PARES",
  "PARKA",
  "PARKS",
  "PARRY",
  "PARSE",
  "PARTS",
  "PARTY",
  "PASHA",
  "PASSE",
  "PASTA",
  "PASTE",
  "PASTS",
  "PASTY",
  "PATCH",
  "PATEN",
  "PATER",
  "PATES",
  "PATHS",
  "PATIO",
  "PATSY",
  "PATTY",
  "PAUSE",
  "PAVAN",
  "PAVED",
  "PAVER",
  "PAVES",
  "PAWED",
  "PAWKY",
  "PAWLS",
  "PAWNS",
  "PAYED",
  "PAYEE",
  "PAYER",
  "PEACE",
  "PEACH",
  "PEAKS",
  "PEAKY",
  "PEALS",
  "PEARL",
  "PEARS",
  "PEASE",
  "PEATS",
  "PECAN",
  "PECKS",
  "PEDAL",
  "PEEKS",
  "PEELS",
  "PEENS",
  "PEEPS",
  "PEERS",
  "PEEVE",
  "PEKOE",
  "PELTS",
  "PENAL",
  "PENCE",
  "PENES",
  "PENGO",
  "PENIS",
  "PENNY",
  "PEONS",
  "PEONY",
  "PEPPY",
  "PERCH",
  "PERIL",
  "PERKS",
  "PERKY",
  "PERMS",
  "PESKY",
  "PESOS",
  "PESTO",
  "PESTS",
  "PETAL",
  "PETER",
  "PETIT",
  "PETTY",
  "PEWEE",
  "PEWIT",
  "PHAGE",
  "PHIAL",
  "PHLOX",
  "PHONE",
  "PHONY",
  "PHOTO",
  "PHYLA",
  "PIANO",
  "PICAS",
  "PICKS",
  "PICKY",
  "PICOT",
  "PIECE",
  "PIERS",
  "PIETA",
  "PIETY",
  "PIGGY",
  "PIGMY",
  "PIKER",
  "PIKES",
  "PILAF",
  "PILAU",
  "PILED",
  "PILES",
  "PILLS",
  "PILOT",
  "PIMPS",
  "PINCH",
  "PINED",
  "PINES",
  "PINEY",
  "PINGS",
  "PINKO",
  "PINKS",
  "PINKY",
  "PINTO",
  "PINTS",
  "PINUP",
  "PIONS",
  "PIOUS",
  "PIPED",
  "PIPER",
  "PIPES",
  "PIPET",
  "PIQUE",
  "PITAS",
  "PITCH",
  "PITHS",
  "PITHY",
  "PITON",
  "PIVOT",
  "PIXEL",
  "PIXIE",
  "PIZZA",
  "PLACE",
  "PLAID",
  "PLAIN",
  "PLAIT",
  "PLANE",
  "PLANK",
  "PLANS",
  "PLANT",
  "PLASH",
  "PLASM",
  "PLATE",
  "PLATS",
  "PLAYA",
  "PLAYS",
  "PLAZA",
  "PLEAD",
  "PLEAS",
  "PLEAT",
  "PLEBE",
  "PLEBS",
  "PLIED",
  "PLIES",
  "PLINK",
  "PLODS",
  "PLONK",
  "PLOPS",
  "PLOTS",
  "PLOWS",
  "PLOYS",
  "PLUCK",
  "PLUGS",
  "PLUMB",
  "PLUME",
  "PLUMP",
  "PLUMS",
  "PLUMY",
  "PLUNK",
  "PLUSH",
  "POACH",
  "POCKS",
  "POCKY",
  "PODGY",
  "PODIA",
  "POEMS",
  "POESY",
  "POETS",
  "POINT",
  "POISE",
  "POKED",
  "POKER",
  "POKES",
  "POKEY",
  "POLAR",
  "POLED",
  "POLER",
  "POLES",
  "POLIO",
  "POLIS",
  "POLKA",
  "POLLS",
  "POLYP",
  "POMPS",
  "PONDS",
  "POOCH",
  "POOHS",
  "POOLS",
  "POOPS",
  "POPES",
  "POPPY",
  "PORCH",
  "PORED",
  "PORES",
  "PORGY",
  "PORKS",
  "PORKY",
  "PORNO",
  "PORTS",
  "POSED",
  "POSER",
  "POSES",
  "POSIT",
  "POSSE",
  "POSTS",
  "POTTY",
  "POUCH",
  "POUFS",
  "POUND",
  "POURS",
  "POUTS",
  "POWER",
  "POXES",
  "PRAMS",
  "PRANK",
  "PRATE",
  "PRATS",
  "PRAWN",
  "PRAYS",
  "PREEN",
  "PREPS",
  "PRESS",
  "PREXY",
  "PREYS",
  "PRICE",
  "PRICK",
  "PRIDE",
  "PRIED",
  "PRIES",
  "PRIGS",
  "PRIME",
  "PRIMO",
  "PRIMP",
  "PRIMS",
  "PRINK",
  "PRINT",
  "PRIOR",
  "PRISE",
  "PRISM",
  "PRIVY",
  "PRIZE",
  "PROBE",
  "PRODS",
  "PROEM",
  "PROFS",
  "PROMO",
  "PROMS",
  "PRONE",
  "PRONG",
  "PROOF",
  "PROPS",
  "PROSE",
  "PROSY",
  "PROUD",
  "PROVE",
  "PROWL",
  "PROWS",
  "PROXY",
  "PRUDE",
  "PRUNE",
  "PSALM",
  "PSEUD",
  "PSHAW",
  "PSOAS",
  "PSYCH",
  "PUBES",
  "PUBIC",
  "PUBIS",
  "PUCKS",
  "PUDGY",
  "PUFFS",
  "PUFFY",
  "PUKED",
  "PUKES",
  "PUKKA",
  "PULLS",
  "PULPS",
  "PULPY",
  "PULSE",
  "PUMAS",
  "PUMPS",
  "PUNCH",
  "PUNKS",
  "PUNKY",
  "PUNNY",
  "PUNTS",
  "PUPAE",
  "PUPIL",
  "PUPPY",
  "PUREE",
  "PURER",
  "PURGE",
  "PURLS",
  "PURRS",
  "PURSE",
  "PURTY",
  "PUSHY",
  "PUSSY",
  "PUTTS",
  "PUTTY",
  "PYGMY",
  "PYLON",
  "PYRES",
  "QUACK",
  "QUADS",
  "QUAFF",
  "QUAIL",
  "QUAKE",
  "QUALM",
  "QUARK",
  "QUART",
  "QUASH",
  "QUASI",
  "QUAYS",
  "QUEEN",
  "QUEER",
  "QUELL",
  "QUERY",
  "QUEST",
  "QUEUE",
  "QUICK",
  "QUIDS",
  "QUIET",
  "QUIFF",
  "QUILL",
  "QUILT",
  "QUINT",
  "QUIPS",
  "QUIPU",
  "QUIRE",
  "QUIRK",
  "QUIRT",
  "QUITE",
  "QUITS",
  "QUOIN",
  "QUOIT",
  "QUOTA",
  "QUOTE",
  "QUOTH",
  "RABBI",
  "RABID",
  "RACED",
  "RACER",
  "RACES",
  "RACKS",
  "RADAR",
  "RADII",
  "RADIO",
  "RADIX",
  "RADON",
  "RAFTS",
  "RAGED",
  "RAGES",
  "RAIDS",
  "RAILS",
  "RAINS",
  "RAINY",
  "RAISE",
  "RAJAH",
  "RAJAS",
  "RAKED",
  "RAKES",
  "RALLY",
  "RAMPS",
  "RANCH",
  "RANDS",
  "RANDY",
  "RANGE",
  "RANGY",
  "RANKS",
  "RANTS",
  "RAPER",
  "RAPID",
  "RARER",
  "RASPS",
  "RASPY",
  "RATED",
  "RATES",
  "RATHS",
  "RATIO",
  "RATTY",
  "RAVED",
  "RAVEL",
  "RAVEN",
  "RAVER",
  "RAVES",
  "RAWER",
  "RAYED",
  "RAYON",
  "RAZED",
  "RAZES",
  "RAZOR",
  "REACH",
  "REACT",
  "READS",
  "READY",
  "REALM",
  "REALS",
  "REAMS",
  "REAPS",
  "REARM",
  "REARS",
  "REBAR",
  "REBEL",
  "REBID",
  "REBUS",
  "REBUT",
  "RECAP",
  "RECTA",
  "RECTO",
  "RECUR",
  "RECUT",
  "REDID",
  "REDOX",
  "REDUX",
  "REEDS",
  "REEDY",
  "REEFS",
  "REEKS",
  "REELS",
  "REEVE",
  "REFER",
  "REFIT",
  "REFIX",
  "REGAL",
  "REHAB",
  "REIFY",
  "REIGN",
  "REINS",
  "RELAX",
  "RELAY",
  "RELET",
  "RELIC",
  "REMAN",
  "REMAP",
  "REMIT",
  "REMIX",
  "RENAL",
  "RENDS",
  "RENEW",
  "RENTS",
  "REPAY",
  "REPEL",
  "REPLY",
  "REPRO",
  "RERAN",
  "RERUN",
  "RESET",
  "RESIN",
  "RESTS",
  "RETCH",
  "RETRO",
  "RETRY",
  "REUSE",
  "REVEL",
  "REVET",
  "REVUE",
  "RHEAS",
  "RHEUM",
  "RHINO",
  "RHUMB",
  "RHYME",
  "RIALS",
  "RIBBY",
  "RICED",
  "RICER",
  "RICES",
  "RIDER",
  "RIDES",
  "RIDGE",
  "RIFLE",
  "RIFTS",
  "RIGHT",
  "RIGID",
  "RIGOR",
  "RILED",
  "RILES",
  "RILLE",
  "RILLS",
  "RIMED",
  "RIMES",
  "RINDS",
  "RINGS",
  "RINKS",
  "RINSE",
  "RIOTS",
  "RIPEN",
  "RIPER",
  "RISEN",
  "RISER",
  "RISES",
  "RISKS",
  "RISKY",
  "RITES",
  "RITZY",
  "RIVAL",
  "RIVED",
  "RIVEN",
  "RIVER",
  "RIVES",
  "RIVET",
  "ROACH",
  "ROADS",
  "ROAMS",
  "ROANS",
  "ROARS",
  "ROAST",
  "ROBED",
  "ROBES",
  "ROBIN",
  "ROBOT",
  "ROCKS",
  "ROCKY",
  "RODEO",
  "ROGER",
  "ROGUE",
  "ROIDS",
  "ROILS",
  "ROILY",
  "ROLES",
  "ROLLS",
  "ROMAN",
  "ROMPS",
  "RONDO",
  "ROODS",
  "ROOFS",
  "ROOKS",
  "ROOMS",
  "ROOMY",
  "ROOST",
  "ROOTS",
  "ROPED",
  "ROPER",
  "ROPES",
  "ROSES",
  "ROSIN",
  "ROTOR",
  "ROUGE",
  "ROUGH",
  "ROUND",
  "ROUSE",
  "ROUST",
  "ROUTE",
  "ROUTS",
  "ROVED",
  "ROVER",
  "ROVES",
  "ROWAN",
  "ROWDY",
  "ROWED",
  "ROWER",
  "ROYAL",
  "RUBES",
  "RUBLE",
  "RUCHE",
  "RUDDY",
  "RUDER",
  "RUFFS",
  "RUGBY",
  "RUING",
  "RUINS",
  "RULED",
  "RULER",
  "RULES",
  "RUMBA",
  "RUMEN",
  "RUMMY",
  "RUMOR",
  "RUMPS",
  "RUNES",
  "RUNGS",
  "RUNNY",
  "RUNTS",
  "RUPEE",
  "RURAL",
  "RUSES",
  "RUSKS",
  "RUSTS",
  "RUSTY",
  "SABER",
  "SABLE",
  "SABRA",
  "SABRE",
  "SACKS",
  "SADLY",
  "SAFER",
  "SAFES",
  "SAGAS",
  "SAGES",
  "SAHIB",
  "SAILS",
  "SAINT",
  "SAITH",
  "SAKES",
  "SALAD",
  "SALES",
  "SALLY",
  "SALON",
  "SALSA",
  "SALTS",
  "SALTY",
  "SALVE",
  "SALVO",
  "SAMBA",
  "SANDS",
  "SANDY",
  "SANER",
  "SAPPY",
  "SARAN",
  "SARGE",
  "SARIS",
  "SASSY",
  "SATED",
  "SATIN",
  "SATYR",
  "SAUCE",
  "SAUCY",
  "SAUNA",
  "SAUTE",
  "SAVED",
  "SAVER",
  "SAVES",
  "SAVOR",
  "SAVVY",
  "SAWED",
  "SAXES",
  "SCABS",
  "SCADS",
  "SCALD",
  "SCALE",
  "SCALP",
  "SCALY",
  "SCAMP",
  "SCAMS",
  "SCANS",
  "SCANT",
  "SCARE",
  "SCARF",
  "SCARP",
  "SCARS",
  "SCARY",
  "SCATS",
  "SCENE",
  "SCENT",
  "SCHMO",
  "SCHWA",
  "SCION",
  "SCOFF",
  "SCOLD",
  "SCONE",
  "SCOOP",
  "SCOOT",
  "SCOPE",
  "SCORE",
  "SCORN",
  "SCOUR",
  "SCOUT",
  "SCOWL",
  "SCOWS",
  "SCRAM",
  "SCRAP",
  "SCREW",
  "SCRIM",
  "SCRIP",
  "SCROD",
  "SCRUB",
  "SCRUM",
  "SCUBA",
  "SCUDI",
  "SCUDO",
  "SCUDS",
  "SCUFF",
  "SCULL",
  "SCUMS",
  "SCURF",
  "SCUZZ",
  "SEALS",
  "SEAMS",
  "SEAMY",
  "SEARS",
  "SEATS",
  "SEBUM",
  "SECCO",
  "SECTS",
  "SEDAN",
  "SEDER",
  "SEDGE",
  "SEDUM",
  "SEEDS",
  "SEEDY",
  "SEEKS",
  "SEEMS",
  "SEEPS",
  "SEERS",
  "SEGUE",
  "SEINE",
  "SEIZE",
  "SELAH",
  "SELFS",
  "SELLS",
  "SEMEN",
  "SEMIS",
  "SENDS",
  "SENSE",
  "SEPAL",
  "SEPIA",
  "SEPOY",
  "SEPTA",
  "SERFS",
  "SERGE",
  "SERIF",
  "SERUM",
  "SERVE",
  "SERVO",
  "SETUP",
  "SEVEN",
  "SEVER",
  "SEWED",
  "SEWER",
  "SEXED",
  "SEXES",
  "SHACK",
  "SHADE",
  "SHADS",
  "SHADY",
  "SHAFT",
  "SHAGS",
  "SHAHS",
  "SHAKE",
  "SHAKO",
  "SHAKY",
  "SHALE",
  "SHALL",
  "SHALT",
  "SHAME",
  "SHAMS",
  "SHANK",
  "SHAPE",
  "SHARD",
  "SHARE",
  "SHARK",
  "SHARP",
  "SHAVE",
  "SHAWL",
  "SHAWM",
  "SHAYS",
  "SHEAF",
  "SHEAR",
  "SHEDS",
  "SHEEN",
  "SHEEP",
  "SHEER",
  "SHEET",
  "SHEIK",
  "SHELF",
  "SHELL",
  "SHERD",
  "SHEWS",
  "SHIED",
  "SHIES",
  "SHIFT",
  "SHILL",
  "SHIMS",
  "SHINE",
  "SHINS",
  "SHINY",
  "SHIPS",
  "SHIRE",
  "SHIRK",
  "SHIRR",
  "SHIRT",
  "SHITS",
  "SHLEP",
  "SHOAL",
  "SHOAT",
  "SHOCK",
  "SHOES",
  "SHOJI",
  "SHONE",
  "SHOOK",
  "SHOOS",
  "SHOOT",
  "SHOPS",
  "SHORE",
  "SHORN",
  "SHORT",
  "SHOTS",
  "SHOUT",
  "SHOVE",
  "SHOWN",
  "SHOWS",
  "SHOWY",
  "SHRED",
  "SHREW",
  "SHRUB",
  "SHRUG",
  "SHUCK",
  "SHUNS",
  "SHUNT",
  "SHUSH",
  "SHUTS",
  "SHYER",
  "SHYLY",
  "SIBYL",
  "SICKO",
  "SICKS",
  "SIDED",
  "SIDES",
  "SIDLE",
  "SIEGE",
  "SIEVE",
  "SIGHS",
  "SIGHT",
  "SIGMA",
  "SIGNS",
  "SILKS",
  "SILKY",
  "SILLS",
  "SILLY",
  "SILOS",
  "SILTS",
  "SINCE",
  "SINES",
  "SINEW",
  "SINGE",
  "SINGS",
  "SINKS",
  "SINUS",
  "SIRED",
  "SIREE",
  "SIREN",
  "SIRES",
  "SIRUP",
  "SISAL",
  "SISSY",
  "SITAR",
  "SITED",
  "SITES",
  "SITUS",
  "SIXES",
  "SIXTH",
  "SIXTY",
  "SIZED",
  "SIZES",
  "SKATE",
  "SKEET",
  "SKEIN",
  "SKEWS",
  "SKIDS",
  "SKIED",
  "SKIER",
  "SKIES",
  "SKIFF",
  "SKILL",
  "SKIMP",
  "SKIMS",
  "SKINS",
  "SKINT",
  "SKIPS",
  "SKIRT",
  "SKITS",
  "SKOAL",
  "SKULK",
  "SKULL",
  "SKUNK",
  "SLABS",
  "SLACK",
  "SLAGS",
  "SLAIN",
  "SLAKE",
  "SLAMS",
  "SLANG",
  "SLANT",
  "SLAPS",
  "SLASH",
  "SLATE",
  "SLATS",
  "SLAVE",
  "SLAYS",
  "SLEDS",
  "SLEEK",
  "SLEEP",
  "SLEET",
  "SLEPT",
  "SLEWS",
  "SLICE",
  "SLICK",
  "SLIDE",
  "SLILY",
  "SLIME",
  "SLIMS",
  "SLIMY",
  "SLING",
  "SLINK",
  "SLIPS",
  "SLITS",
  "SLOBS",
  "SLOES",
  "SLOGS",
  "SLOMO",
  "SLOOP",
  "SLOPE",
  "SLOPS",
  "SLOSH",
  "SLOTH",
  "SLOTS",
  "SLOWS",
  "SLUED",
  "SLUES",
  "SLUGS",
  "SLUMP",
  "SLUMS",
  "SLUNG",
  "SLUNK",
  "SLURP",
  "SLURS",
  "SLUSH",
  "SLUTS",
  "SLYER",
  "SLYLY",
  "SMACK",
  "SMALL",
  "SMART",
  "SMASH",
  "SMEAR",
  "SMELL",
  "SMELT",
  "SMILE",
  "SMIRK",
  "SMITE",
  "SMITH",
  "SMOCK",
  "SMOGS",
  "SMOKE",
  "SMOKY",
  "SMOTE",
  "SMUTS",
  "SNACK",
  "SNAFU",
  "SNAGS",
  "SNAIL",
  "SNAKE",
  "SNAKY",
  "SNAPS",
  "SNARE",
  "SNARF",
  "SNARK",
  "SNARL",
  "SNEAK",
  "SNEER",
  "SNIDE",
  "SNIFF",
  "SNIPE",
  "SNIPS",
  "SNITS",
  "SNOBS",
  "SNOOD",
  "SNOOK",
  "SNOOP",
  "SNOOT",
  "SNORE",
  "SNORT",
  "SNOTS",
  "SNOUT",
  "SNOWS",
  "SNOWY",
  "SNUBS",
  "SNUCK",
  "SNUFF",
  "SNUGS",
  "SOAKS",
  "SOAPS",
  "SOAPY",
  "SOARS",
  "SOBER",
  "SOCKO",
  "SOCKS",
  "SOCLE",
  "SODAS",
  "SOFAS",
  "SOFTY",
  "SOGGY",
  "SOILS",
  "SOLAR",
  "SOLED",
  "SOLES",
  "SOLID",
  "SOLOS",
  "SOLVE",
  "SOMAS",
  "SONAR",
  "SONGS",
  "SONIC",
  "SONNY",
  "SOOTH",
  "SOOTS",
  "SOOTY",
  "SOPPY",
  "SORER",
  "SORES",
  "SORRY",
  "SORTA",
  "SORTS",
  "SOULS",
  "SOUND",
  "SOUPS",
  "SOUPY",
  "SOURS",
  "SOUSE",
  "SOUTH",
  "SOWED",
  "SPACE",
  "SPACY",
  "SPADE",
  "SPAKE",
  "SPANG",
  "SPANK",
  "SPANS",
  "SPARE",
  "SPARK",
  "SPARS",
  "SPASM",
  "SPATE",
  "SPATS",
  "SPAWN",
  "SPAYS",
  "SPAZZ",
  "SPEAK",
  "SPEAR",
  "SPECK",
  "SPECS",
  "SPEED",
  "SPELL",
  "SPELT",
  "SPEND",
  "SPENT",
  "SPERM",
  "SPEWS",
  "SPICE",
  "SPICS",
  "SPICY",
  "SPIED",
  "SPIEL",
  "SPIES",
  "SPIFF",
  "SPIKE",
  "SPIKY",
  "SPILL",
  "SPILT",
  "SPINE",
  "SPINS",
  "SPIRE",
  "SPITE",
  "SPITS",
  "SPITZ",
  "SPIVS",
  "SPLAT",
  "SPLAY",
  "SPLIT",
  "SPOIL",
  "SPOKE",
  "SPOOF",
  "SPOOK",
  "SPOOL",
  "SPOON",
  "SPOOR",
  "SPORE",
  "SPORT",
  "SPOTS",
  "SPOUT",
  "SPRAT",
  "SPRAY",
  "SPREE",
  "SPRIG",
  "SPRIT",
  "SPROG",
  "SPRUE",
  "SPUDS",
  "SPUED",
  "SPUME",
  "SPUNK",
  "SPURN",
  "SPURS",
  "SPURT",
  "SQUAB",
  "SQUAD",
  "SQUAT",
  "SQUAW",
  "SQUIB",
  "SQUID",
  "STABS",
  "STACK",
  "STAFF",
  "STAGE",
  "STAGS",
  "STAGY",
  "STAID",
  "STAIN",
  "STAIR",
  "STAKE",
  "STALE",
  "STALK",
  "STALL",
  "STAMP",
  "STAND",
  "STANK",
  "STAPH",
  "STARE",
  "STARK",
  "STARS",
  "START",
  "STASH",
  "STATE",
  "STATS",
  "STAVE",
  "STAYS",
  "STEAD",
  "STEAK",
  "STEAL",
  "STEAM",
  "STEED",
  "STEEL",
  "STEEP",
  "STEER",
  "STEIN",
  "STELA",
  "STELE",
  "STEMS",
  "STENO",
  "STEPS",
  "STERN",
  "STETS",
  "STEWS",
  "STICK",
  "STIED",
  "STIES",
  "STIFF",
  "STILE",
  "STILL",
  "STILT",
  "STING",
  "STINK",
  "STINT",
  "STIRS",
  "STOAS",
  "STOAT",
  "STOCK",
  "STOGY",
  "STOIC",
  "STOKE",
  "STOLE",
  "STOMA",
  "STOMP",
  "STONE",
  "STONY",
  "STOOD",
  "STOOL",
  "STOOP",
  "STOPS",
  "STORE",
  "STORK",
  "STORM",
  "STORY",
  "STOUP",
  "STOUT",
  "STOVE",
  "STOWS",
  "STRAP",
  "STRAW",
  "STRAY",
  "STREP",
  "STREW",
  "STRIP",
  "STROP",
  "STRUM",
  "STRUT",
  "STUBS",
  "STUCK",
  "STUDS",
  "STUDY",
  "STUFF",
  "STUMP",
  "STUNG",
  "STUNK",
  "STUNS",
  "STUNT",
  "STYES",
  "STYLE",
  "STYLI",
  "SUAVE",
  "SUCKS",
  "SUEDE",
  "SUGAR",
  "SUING",
  "SUITE",
  "SUITS",
  "SULFA",
  "SULKS",
  "SULKY",
  "SULLY",
  "SUMAC",
  "SUMMA",
  "SUMPS",
  "SUNNY",
  "SUNUP",
  "SUPER",
  "SUPRA",
  "SURAS",
  "SURDS",
  "SURER",
  "SURFS",
  "SURGE",
  "SURLY",
  "SUSHI",
  "SUTRA",
  "SWABS",
  "SWAGS",
  "SWAIN",
  "SWAMI",
  "SWAMP",
  "SWANK",
  "SWANS",
  "SWAPS",
  "SWARD",
  "SWARE",
  "SWARF",
  "SWARM",
  "SWART",
  "SWASH",
  "SWATH",
  "SWATS",
  "SWAYS",
  "SWEAR",
  "SWEAT",
  "SWEDE",
  "SWEEP",
  "SWEET",
  "SWELL",
  "SWEPT",
  "SWIFT",
  "SWIGS",
  "SWILL",
  "SWIMS",
  "SWINE",
  "SWING",
  "SWIPE",
  "SWIRL",
  "SWISH",
  "SWISS",
  "SWIVE",
  "SWOON",
  "SWOOP",
  "SWORD",
  "SWORE",
  "SWORN",
  "SWUNG",
  "SYLPH",
  "SYNCH",
  "SYNCS",
  "SYNOD",
  "SYRUP",
  "TABBY",
  "TABLE",
  "TABOO",
  "TABOR",
  "TABUS",
  "TACIT",
  "TACKS",
  "TACKY",
  "TACOS",
  "TAELS",
  "TAFFY",
  "TAILS",
  "TAINT",
  "TAKEN",
  "TAKER",
  "TAKES",
  "TALCS",
  "TALES",
  "TALKS",
  "TALKY",
  "TALLY",
  "TALON",
  "TALUS",
  "TAMED",
  "TAMER",
  "TAMES",
  "TAMPS",
  "TANGO",
  "TANGS",
  "TANGY",
  "TANKS",
  "TANSY",
  "TAPED",
  "TAPER",
  "TAPES",
  "TAPIR",
  "TAPIS",
  "TARDY",
  "TARES",
  "TARNS",
  "TAROS",
  "TAROT",
  "TARPS",
  "TARRY",
  "TARTS",
  "TASKS",
  "TASTE",
  "TASTY",
  "TATER",
  "TATTY",
  "TAUNT",
  "TAUPE",
  "TAWNY",
  "TAXED",
  "TAXES",
  "TAXIS",
  "TAXOL",
  "TAXON",
  "TEACH",
  "TEAKS",
  "TEALS",
  "TEAMS",
  "TEARS",
  "TEARY",
  "TEASE",
  "TEATS",
  "TECHS",
  "TECHY",
  "TEDDY",
  "TEEMS",
  "TEENS",
  "TEENY",
  "TEETH",
  "TELEX",
  "TELLS",
  "TELLY",
  "TEMPI",
  "TEMPO",
  "TEMPS",
  "TEMPT",
  "TENCH",
  "TENDS",
  "TENET",
  "TENON",
  "TENOR",
  "TENSE",
  "TENTH",
  "TENTS",
  "TEPEE",
  "TEPID",
  "TERCE",
  "TERMS",
  "TERNS",
  "TERRA",
  "TERRY",
  "TERSE",
  "TESLA",
  "TESTS",
  "TESTY",
  "TETRA",
  "TEXTS",
  "THANE",
  "THANK",
  "THANX",
  "THAWS",
  "THEFT",
  "THEME",
  "THERE",
  "THERM",
  "THESE",
  "THETA",
  "THEWS",
  "THICK",
  "THIEF",
  "THIGH",
  "THINE",
  "THING",
  "THINK",
  "THINS",
  "THIRD",
  "THONG",
  "THORN",
  "THOSE",
  "THREE",
  "THREW",
  "THROB",
  "THROE",
  "THROW",
  "THRUM",
  "THUDS",
  "THUGS",
  "THUMB",
  "THUMP",
  "THUNK",
  "THYME",
  "TIARA",
  "TIBIA",
  "TICKS",
  "TIDAL",
  "TIDED",
  "TIDES",
  "TIERS",
  "TIFFS",
  "TIGER",
  "TIKES",
  "TIKIS",
  "TILDE",
  "TILED",
  "TILER",
  "TILES",
  "TILLS",
  "TILTH",
  "TILTS",
  "TIMED",
  "TIMER",
  "TIMES",
  "TIMID",
  "TINES",
  "TINGE",
  "TINGS",
  "TINNY",
  "TINTS",
  "TIPPY",
  "TIPSY",
  "TIRED",
  "TIRES",
  "TIROS",
  "TITAN",
  "TITER",
  "TITHE",
  "TITLE",
  "TITRE",
  "TITTY",
  "TIZZY",
  "TOADS",
  "TOADY",
  "TOAST",
  "TODAY",
  "TODDY",
  "TOFFS",
  "TOFFY",
  "TOGAS",
  "TOILE",
  "TOILS",
  "TOKED",
  "TOKEN",
  "TOKES",
  "TOLLS",
  "TOMBS",
  "TOMES",
  "TOMMY",
  "TONAL",
  "TONED",
  "TONER",
  "TONES",
  "TONGS",
  "TONIC",
  "TOOLS",
  "TOONS",
  "TOOTH",
  "TOOTS",
  "TOPAZ",
  "TOPED",
  "TOPES",
  "TOPIC",
  "TOPOI",
  "TOPOS",
  "TOQUE",
  "TORCH",
  "TORIC",
  "TORSI",
  "TORSO",
  "TORTE",
  "TORTS",
  "TORUS",
  "TOTAL",
  "TOTED",
  "TOTEM",
  "TOTES",
  "TOTTY",
  "TOUGH",
  "TOURS",
  "TOUTS",
  "TOWEL",
  "TOWER",
  "TOWNS",
  "TOXIC",
  "TOXIN",
  "TOYED",
  "TOYON",
  "TRACE",
  "TRACK",
  "TRACT",
  "TRADE",
  "TRAIL",
  "TRAIN",
  "TRAIT",
  "TRAMP",
  "TRAMS",
  "TRANS",
  "TRAPS",
  "TRASH",
  "TRAWL",
  "TRAYS",
  "TREAD",
  "TREAT",
  "TREED",
  "TREES",
  "TREKS",
  "TREND",
  "TRESS",
  "TREWS",
  "TREYS",
  "TRIAD",
  "TRIAL",
  "TRIBE",
  "TRICE",
  "TRICK",
  "TRIED",
  "TRIER",
  "TRIES",
  "TRIKE",
  "TRILL",
  "TRIMS",
  "TRIOS",
  "TRIPE",
  "TRIPS",
  "TRITE",
  "TROLL",
  "TROMP",
  "TROOP",
  "TROTH",
  "TROTS",
  "TROUT",
  "TROVE",
  "TROWS",
  "TRUCE",
  "TRUCK",
  "TRUED",
  "TRUER",
  "TRUES",
  "TRULY",
  "TRUMP",
  "TRUNK",
  "TRUSS",
  "TRUST",
  "TRUTH",
  "TRYST",
  "TSARS",
  "TUANS",
  "TUBAL",
  "TUBAS",
  "TUBBY",
  "TUBED",
  "TUBER",
  "TUBES",
  "TUCKS",
  "TUFTS",
  "TULIP",
  "TULLE",
  "TUMMY",
  "TUMOR",
  "TUNAS",
  "TUNED",
  "TUNER",
  "TUNES",
  "TUNIC",
  "TUNNY",
  "TUPLE",
  "TURBO",
  "TURDS",
  "TURFS",
  "TURFY",
  "TURNS",
  "TURPS",
  "TUSKS",
  "TUSKY",
  "TUTOR",
  "TUTTI",
  "TUTUS",
  "TUXES",
  "TWAIN",
  "TWANG",
  "TWATS",
  "TWEAK",
  "TWEED",
  "TWEET",
  "TWERP",
  "TWICE",
  "TWIGS",
  "TWILL",
  "TWINE",
  "TWINK",
  "TWINS",
  "TWINY",
  "TWIRL",
  "TWIRP",
  "TWIST",
  "TWITS",
  "TWIXT",
  "TYING",
  "TYKES",
  "TYPED",
  "TYPES",
  "TYPOS",
  "TYRES",
  "TYROS",
  "TZARS",
  "UDDER",
  "UKASE",
  "ULCER",
  "ULNAS",
  "ULTRA",
  "UMBEL",
  "UMBER",
  "UMBRA",
  "UMIAK",
  "UMPED",
  "UNAPT",
  "UNARM",
  "UNARY",
  "UNBAN",
  "UNBAR",
  "UNBOX",
  "UNCAP",
  "UNCLE",
  "UNCUT",
  "UNDER",
  "UNDID",
  "UNDUE",
  "UNFED",
  "UNFIT",
  "UNHIP",
  "UNIFY",
  "UNION",
  "UNITE",
  "UNITS",
  "UNITY",
  "UNLIT",
  "UNMAN",
  "UNMET",
  "UNPEG",
  "UNPIN",
  "UNRIG",
  "UNSAY",
  "UNSEE",
  "UNSET",
  "UNSEX",
  "UNTIE",
  "UNTIL",
  "UNWED",
  "UNZIP",
  "UPEND",
  "UPPED",
  "UPPER",
  "UPSET",
  "URBAN",
  "URGED",
  "URGER",
  "URGES",
  "URINE",
  "USAGE",
  "USERS",
  "USHER",
  "USING",
  "USUAL",
  "USURP",
  "USURY",
  "UTERI",
  "UTTER",
  "UVULA",
  "VACUA",
  "VAGUE",
  "VAILS",
  "VALES",
  "VALET",
  "VALID",
  "VALOR",
  "VALUE",
  "VALVE",
  "VAMPS",
  "VANES",
  "VAPES",
  "VAPID",
  "VAPOR",
  "VASES",
  "VAULT",
  "VAUNT",
  "VEEPS",
  "VEERS",
  "VEGAN",
  "VEILS",
  "VEINS",
  "VELAR",
  "VELDS",
  "VELDT",
  "VENAL",
  "VENDS",
  "VENOM",
  "VENTS",
  "VENUE",
  "VERBS",
  "VERGE",
  "VERSE",
  "VERSO",
  "VERST",
  "VERVE",
  "VESTS",
  "VETCH",
  "VEXED",
  "VEXES",
  "VIALS",
  "VIAND",
  "VIBES",
  "VICAR",
  "VICES",
  "VIDEO",
  "VIEWS",
  "VIGIL",
  "VIGOR",
  "VILER",
  "VILLA",
  "VILLI",
  "VINCA",
  "VINES",
  "VINYL",
  "VIOLA",
  "VIOLS",
  "VIPER",
  "VIRAL",
  "VIREO",
  "VIRUS",
  "VISAS",
  "VISES",
  "VISIT",
  "VISOR",
  "VISTA",
  "VITAL",
  "VITAS",
  "VIVAS",
  "VIVID",
  "VIXEN",
  "VIZOR",
  "VOCAL",
  "VODKA",
  "VOGUE",
  "VOICE",
  "VOIDS",
  "VOILA",
  "VOILE",
  "VOLTS",
  "VOMIT",
  "VOTED",
  "VOTER",
  "VOTES",
  "VOUCH",
  "VOWED",
  "VOWEL",
  "VOXEL",
  "VROOM",
  "VULVA",
  "VYING",
  "WACKO",
  "WACKY",
  "WADED",
  "WADER",
  "WADES",
  "WADIS",
  "WAFER",
  "WAFTS",
  "WAGED",
  "WAGER",
  "WAGES",
  "WAGON",
  "WAHOO",
  "WAIFS",
  "WAILS",
  "WAIST",
  "WAITS",
  "WAIVE",
  "WAKED",
  "WAKEN",
  "WAKES",
  "WALES",
  "WALKS",
  "WALLS",
  "WALTZ",
  "WANDS",
  "WANED",
  "WANES",
  "WANTS",
  "WARDS",
  "WARES",
  "WARMS",
  "WARNS",
  "WARPS",
  "WARTS",
  "WASHY",
  "WASPS",
  "WASPY",
  "WASTE",
  "WATCH",
  "WATER",
  "WATTS",
  "WAVED",
  "WAVER",
  "WAVES",
  "WAXED",
  "WAXEN",
  "WAXES",
  "WAZOO",
  "WEALS",
  "WEARS",
  "WEARY",
  "WEAVE",
  "WEBER",
  "WEDGE",
  "WEEDS",
  "WEEDY",
  "WEEKS",
  "WEENY",
  "WEEPS",
  "WEEPY",
  "WEEST",
  "WEFTS",
  "WEIGH",
  "WEIRD",
  "WEIRS",
  "WELCH",
  "WELDS",
  "WELLS",
  "WELSH",
  "WELTS",
  "WENCH",
  "WENDS",
  "WHACK",
  "WHALE",
  "WHAMS",
  "WHANG",
  "WHARF",
  "WHEAL",
  "WHEAT",
  "WHEEL",
  "WHELK",
  "WHELM",
  "WHELP",
  "WHERE",
  "WHETS",
  "WHICH",
  "WHIFF",
  "WHILE",
  "WHIMS",
  "WHINE",
  "WHINY",
  "WHIPS",
  "WHIRL",
  "WHIRR",
  "WHIRS",
  "WHISK",
  "WHIST",
  "WHITE",
  "WHITS",
  "WHIZZ",
  "WHOLE",
  "WHOMP",
  "WHOOP",
  "WHOPS",
  "WHORE",
  "WHORL",
  "WHOSE",
  "WHOSO",
  "WHUMP",
  "WICKS",
  "WIDEN",
  "WIDER",
  "WIDOW",
  "WIDTH",
  "WIELD",
  "WIFEY",
  "WILCO",
  "WILDS",
  "WILED",
  "WILES",
  "WILLS",
  "WILTS",
  "WIMPS",
  "WIMPY",
  "WINCE",
  "WINCH",
  "WINDS",
  "WINDY",
  "WINED",
  "WINES",
  "WINGS",
  "WINKS",
  "WINOS",
  "WIPED",
  "WIPER",
  "WIPES",
  "WIRED",
  "WIRES",
  "WISED",
  "WISER",
  "WISES",
  "WISPS",
  "WISPY",
  "WITCH",
  "WITTY",
  "WIVES",
  "WIZEN",
  "WOKEN",
  "WOLDS",
  "WOMAN",
  "WOMBS",
  "WOMEN",
  "WONKS",
  "WONKY",
  "WONTS",
  "WOODS",
  "WOODY",
  "WOOED",
  "WOOFS",
  "WOOLS",
  "WOOLY",
  "WOOSH",
  "WOOZY",
  "WORDS",
  "WORDY",
  "WORKS",
  "WORLD",
  "WORMS",
  "WORMY",
  "WORRY",
  "WORSE",
  "WORST",
  "WORTH",
  "WORTS",
  "WOULD",
  "WOUND",
  "WOVEN",
  "WOWED",
  "WOWEE",
  "WRACK",
  "WRAPS",
  "WRATH",
  "WREAK",
  "WRECK",
  "WRENS",
  "WREST",
  "WRIER",
  "WRING",
  "WRIST",
  "WRITE",
  "WRITS",
  "WRONG",
  "WROTE",
  "WROTH",
  "WRUNG",
  "WRYER",
  "WRYLY",
  "WURST",
  "XENON",
  "XEROX",
  "XYLEM",
  "YACHT",
  "YAHOO",
  "YANKS",
  "YARDS",
  "YARNS",
  "YAWED",
  "YAWLS",
  "YAWNS",
  "YAWNY",
  "YAWPS",
  "YEARN",
  "YEARS",
  "YEAST",
  "YECCH",
  "YELLS",
  "YELPS",
  "YENTA",
  "YERBA",
  "YESES",
  "YIELD",
  "YIKES",
  "YIPES",
  "YOBBO",
  "YODEL",
  "YOGIS",
  "YOKED",
  "YOKEL",
  "YOKES",
  "YOLKS",
  "YOUNG",
  "YOURN",
  "YOURS",
  "YOUSE",
  "YOUTH",
  "YOWLS",
  "YOYOS",
  "YUCCA",
  "YUCKY",
  "YUKKY",
  "YUMMY",
  "YURTS",
  "ZAPPY",
  "ZAYIN",
  "ZEBRA",
  "ZEBUS",
  "ZEROS",
  "ZESTS",
  "ZETAS",
  "ZILCH",
  "ZINCS",
  "ZINGS",
  "ZIPPY",
  "ZLOTY",
  "ZONAL",
  "ZONED",
  "ZONES",
  "ZONKS",
  "ZOOMS",
  "ZOWIE",
]

module.exports = { WORDS }


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js!./client/style/main.css":
/*!**********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js!./client/style/main.css ***!
  \**********************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ../fonts/BLADRMF_.TTF */ "./client/fonts/BLADRMF_.TTF"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(/*! ../fonts/Oxanium-VariableFont_wght.ttf */ "./client/fonts/Oxanium-VariableFont_wght.ttf"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `:root {
  --default: #121213;
  --text: #ffffff;
  --gray1: #4a4a4c;
  --gray2: #2a2a2c;
  --brBlue1: #17aad8;
  --brBlue2: #017cb0;
  --brBlue3: #0b61a8;
  --brOrange1: #fe9200;
  /*ee610a*/
  --brOrange2: #ee610a;
  --brOrange3: #ea410b;
}

@font-face {
  font-family: "Blade Runner";
  src: url(${___CSS_LOADER_URL_REPLACEMENT_0___});
}
@font-face {
  font-family: "Oxanium";
  font-style: normal;
  font-weight: normal;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_1___});
}
html,
body {
  background-color: var(--default);
  font-family: "Oxanium", cursive;
  margin: 0;
  padding: 0;
  text-align: center;
}

div {
  margin: 0;
  padding: 0;
}

.supercontainer {
  display: flex;
  min-width: 320px;
  max-width: 540px;
  margin: 1cqw auto;
  container-type: inline-size;
}

.pageContainer {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  text-align: center;
  /*margin: 1cqw auto;
  min-width: 320px;
  max-width: 540px;*/
  width: 100%;
  justify-content: space-between;
  /*grid-template-columns: 1fr;*/
  /*grid-template-rows: auto auto 1fr;*/
  /*grid-auto-rows: auto;*/
  container-type: inline-size;
  height: 155cqw;
}

.header {
  display: flex;
  flex: 0 1 auto;
  justify-content: center;
  color: var(--brOrange2);
  font-family: "Blade Runner";
  font-size: 8cqw;
  padding: 2cqw 0;
  margin: 1cqw;
  border-bottom: 0.5cqw solid var(--gray1);
  height: 8cqw;
  border-top: 0.5cqw solid var(--default);
  pointer-events: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.message {
  color: var(--brOrange2);
  font-family: "Oxanium", cursive;
  font-size: 6cqw;
  padding: 2cqw 0;
  margin: 1cqw;
  height: 8cqw;
  border-bottom: 0.5cqw solid var(--brOrange2);
  border-top: 0.5cqw solid var(--brOrange2);
  background-color: var(--default);
}

.gameContainer {
  display: flex;
  justify-content: center;
  flex: 0 1 auto;
  width: 100cqw;
  margin: auto;
  pointer-events: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.tileGrid {
  display: grid;
  width: 75cqw;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 1.5cqw;
  margin: 0.5cqw 0;
}

.tile {
  aspect-ratio: 1/1;
  border: 0.5cqw solid var(--gray1);
  box-sizing: border-box;
  color: var(--text);
  text-transform: uppercase;
  display: grid;
  place-items: center;
  font-family: "Oxanium", cursive;
  font-size: 7cqw;
}

.tileWaterMark {
  font-family: "Blade Runner";
  color: var(--gray2);
}

.keyboardContainer {
  display: flex;
  flex: 0 1 auto;
  justify-content: center;
  margin: auto;
  margin-top: 2cqw;
  width: 100cqw;
}

.keyboardGrid {
  display: grid;
  width: 98cqw;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr;
  grid-row-gap: 1.5cqw;
}

.keyboardRow1 {
  display: grid;
  width: 98cqw;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-column-gap: 1.5cqw;
}

.keyboardRow2 {
  display: grid;
  width: 98cqw;
  grid-template-rows: 1fr;
  grid-template-columns: 0.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 0.5fr;
  grid-column-gap: 1.5cqw;
}

.keyboardRow3 {
  display: grid;
  width: 98cqw;
  grid-template-rows: 1fr;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1.5fr;
  grid-column-gap: 1.5cqw;
}

.key,
.keySpacer {
  display: grid;
  border: 0.25cqw solid var(--text);
  box-sizing: border-box;
  text-align: center;
  font-family: "Oxanium", cursive;
  font-size: 3.5cqw;
  font-weight: bolder;
  place-items: center;
  padding: 0 0;
  border-radius: 1.5cqw;
  color: var(--text);
  aspect-ratio: 1/1.2;
  background-color: var(--default);
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.keySpacer {
  visibility: hidden;
  aspect-ratio: 1/2.4;
}

#BACKSPACE,
#ENTER {
  aspect-ratio: 3/2.4;
  font-size: 2.5cqw;
}

.tileClose {
  color: var(--brOrange2);
  border: 0.5cqw solid var(--brOrange2);
}

.tileHit {
  color: var(--brBlue1);
  border: 0.5cqw solid var(--brBlue1);
}

.tileMiss {
  color: var(--gray1);
  border: 0.5cqw solid var(--gray1);
}

.gameOver {
  background-color: var(--brBlue1);
  color: var(--default);
  border: 0.25cqw solid var(--brBlue1);
}

.reset {
  animation: 1s linear resetting;
}

@keyframes resetting {
  0% {
    transform: rotateX(0deg);
  }
  50% {
    transform: rotateX(90deg);
  }
  100% {
    transform: rotateX(0deg);
  }
}
.modalContainer {
  display: none;
  position: fixed;
  z-index: 1;
  padding-top: 15cqw;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100cqw;
  overflow: auto;
  background-color: rgba(18, 18, 19, 0.6);
}

.modalContent {
  font-family: "Oxanium", cursive;
  background-color: rgba(254, 146, 0, 0.3);
  color: var(--brOrange1);
  margin: auto;
  padding: 1.5cqw;
  padding-top: 0;
  width: 80cqw;
  max-width: 80cqw;
  max-height: 90cqw;
  font-size: 6cqw;
  overflow: auto;
}

.modalContent hr {
  border: 0.25cqw solid var(--brOrange1);
  margin-top: 3cqw;
}

.modalTitle {
  font-family: "Oxanium", cursive;
  margin: 2cqw 0 0cqw;
  padding: 2cqw 0 1cqw;
}

.modalContentItem {
  font-family: "Oxanium", cursive;
  margin: 0 0;
  padding: 1cqw 2cqw;
  font-size: 5cqw;
  text-align: left;
}

.close {
  color: var(--brOrange1);
  float: right;
  margin-right: 1.5cqw;
  font-size: 6cqw;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: var(--brOrange3);
  text-decoration: none;
  cursor: pointer;
}

.statTable {
  margin: 0 auto 1.5cqw;
}

.statTable td {
  padding: 0 4cqw;
}

.statNum {
  text-align: right;
}

::-webkit-scrollbar {
  width: 2cqw;
}

::-webkit-scrollbar-track {
  background: rgba(254, 146, 0, 0.2);
}

::-webkit-scrollbar-thumb {
  background: rgba(254, 146, 0, 0.4);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--brOrange1);
}

.modalContent {
  scrollbar-color: rgba(254, 146, 0, 0.6) rgba(254, 146, 0, 0.1);
}`, "",{"version":3,"sources":["webpack://./client/style/main.css"],"names":[],"mappings":"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","sourcesContent":[":root {\n  --default: #121213;\n  --text: #ffffff;\n  --gray1: #4a4a4c;\n  --gray2: #2a2a2c;\n  --brBlue1: #17aad8;\n  --brBlue2: #017cb0;\n  --brBlue3: #0b61a8;\n  --brOrange1: #fe9200;\n  /*ee610a*/\n  --brOrange2: #ee610a;\n  --brOrange3: #ea410b;\n}\n\n@font-face {\n  font-family: \"Blade Runner\";\n  src: url(../fonts/BLADRMF_.TTF);\n}\n\n@font-face {\n  font-family: \"Oxanium\";\n  font-style: normal;\n  font-weight: normal;\n  src: url(\"../fonts/Oxanium-VariableFont_wght.ttf\");\n}\n\nhtml,\nbody {\n  background-color: var(--default);\n  font-family: \"Oxanium\", cursive;\n  margin: 0;\n  padding: 0;\n  text-align: center;\n}\n\ndiv {\n  margin: 0;\n  padding: 0;\n}\n\n.supercontainer {\n  display: flex;\n  min-width: 320px;\n  max-width: 540px;\n  margin: 1cqw auto;\n  container-type: inline-size;\n}\n\n.pageContainer {\n  display: flex;\n  flex-direction: column;\n  flex-shrink: 0;\n  text-align: center;\n  /*margin: 1cqw auto;\n  min-width: 320px;\n  max-width: 540px;*/\n  width: 100%;\n  justify-content: space-between;\n  /*grid-template-columns: 1fr;*/\n  /*grid-template-rows: auto auto 1fr;*/\n  /*grid-auto-rows: auto;*/\n  container-type: inline-size;\n  height: 155cqw;\n}\n\n.header {\n  display: flex;\n  flex: 0 1 auto;\n  justify-content: center;\n  color: var(--brOrange2);\n  font-family: \"Blade Runner\";\n  font-size: 8cqw;\n  padding: 2cqw 0;\n  margin: 1cqw;\n  border-bottom: 0.5cqw solid var(--gray1);\n  height: 8cqw;\n  border-top: 0.5cqw solid var(--default);\n  pointer-events: none;\n  -webkit-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.message {\n  color: var(--brOrange2);\n  font-family: \"Oxanium\", cursive;\n  font-size: 6cqw;\n  padding: 2cqw 0;\n  margin: 1cqw;\n  height: 8cqw;\n  border-bottom: 0.5cqw solid var(--brOrange2);\n  border-top: 0.5cqw solid var(--brOrange2);\n  background-color: var(--default);\n}\n\n.gameContainer {\n  display: flex;\n  justify-content: center;\n  flex: 0 1 auto;\n  width: 100cqw;\n  margin: auto;\n  pointer-events: none;\n  -webkit-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.tileGrid {\n  display: grid;\n  width: 75cqw;\n  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;\n  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;\n  grid-gap: 1.5cqw;\n  margin: 0.5cqw 0;\n}\n\n.tile {\n  aspect-ratio: 1 / 1;\n  border: 0.5cqw solid var(--gray1);\n  box-sizing: border-box;\n  color: var(--text);\n  text-transform: uppercase;\n  display: grid;\n  place-items: center;\n  font-family: \"Oxanium\", cursive;\n  font-size: 7cqw;\n}\n\n.tileWaterMark {\n  font-family: \"Blade Runner\";\n  color: var(--gray2);\n}\n\n.keyboardContainer {\n  display: flex;\n  flex: 0 1 auto;\n  justify-content: center;\n  margin: auto;\n  margin-top: 2cqw;\n  width: 100cqw;\n}\n\n.keyboardGrid {\n  display: grid;\n  width: 98cqw;\n  grid-template-rows: 1fr 1fr 1fr;\n  grid-template-columns: 1fr;\n  grid-row-gap: 1.5cqw;\n}\n\n.keyboardRow1 {\n  display: grid;\n  width: 98cqw;\n  grid-template-rows: 1fr;\n  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;\n  grid-column-gap: 1.5cqw;\n}\n.keyboardRow2 {\n  display: grid;\n  width: 98cqw;\n  grid-template-rows: 1fr;\n  grid-template-columns: 0.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 0.5fr;\n  grid-column-gap: 1.5cqw;\n}\n.keyboardRow3 {\n  display: grid;\n  width: 98cqw;\n  grid-template-rows: 1fr;\n  grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1.5fr;\n  grid-column-gap: 1.5cqw;\n}\n\n.key,\n.keySpacer {\n  display: grid;\n  border: 0.25cqw solid var(--text);\n  box-sizing: border-box;\n  text-align: center;\n  font-family: \"Oxanium\", cursive;\n  font-size: 3.5cqw;\n  font-weight: bolder;\n  place-items: center;\n  padding: 0 0;\n  border-radius: 1.5cqw;\n  color: var(--text);\n  aspect-ratio: 1 / 1.2;\n  background-color: var(--default);\n  -webkit-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.keySpacer {\n  visibility: hidden;\n  aspect-ratio: 1 / 2.4;\n}\n\n#BACKSPACE,\n#ENTER {\n  aspect-ratio: 3 / 2.4;\n  font-size: 2.5cqw;\n}\n\n.tileClose {\n  color: var(--brOrange2);\n  border: 0.5cqw solid var(--brOrange2);\n}\n\n.tileHit {\n  color: var(--brBlue1);\n  border: 0.5cqw solid var(--brBlue1);\n}\n.tileMiss {\n  color: var(--gray1);\n  border: 0.5cqw solid var(--gray1);\n}\n\n.gameOver {\n  background-color: var(--brBlue1);\n  color: var(--default);\n  border: 0.25cqw solid var(--brBlue1);\n}\n\n.reset {\n  animation: 1s linear resetting;\n}\n\n@keyframes resetting {\n  0% {\n    transform: rotateX(0deg);\n  }\n  50% {\n    transform: rotateX(90deg);\n  }\n  100% {\n    transform: rotateX(0deg);\n  }\n}\n\n.modalContainer {\n  display: none;\n  position: fixed;\n  z-index: 1;\n  padding-top: 15cqw;\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n  width: 100cqw;\n  overflow: auto;\n  background-color: rgba(18, 18, 19, 0.6);\n}\n\n.modalContent {\n  font-family: \"Oxanium\", cursive;\n  background-color: rgba(254, 146, 0, 0.3);\n  color: var(--brOrange1);\n  margin: auto;\n  padding: 1.5cqw;\n  padding-top: 0;\n  width: 80cqw;\n  max-width: 80cqw;\n  max-height: 90cqw;\n  font-size: 6cqw;\n  overflow: auto;\n}\n\n.modalContent hr {\n  border: 0.25cqw solid var(--brOrange1);\n  margin-top: 3cqw;\n}\n\n.modalTitle {\n  font-family: \"Oxanium\", cursive;\n  margin: 2cqw 0 0cqw;\n  padding: 2cqw 0 1cqw;\n}\n\n.modalContentItem {\n  font-family: \"Oxanium\", cursive;\n  margin: 0 0;\n  padding: 1cqw 2cqw;\n  font-size: 5cqw;\n  text-align: left;\n}\n\n.close {\n  color: var(--brOrange1);\n  float: right;\n  margin-right: 1.5cqw;\n  font-size: 6cqw;\n  font-weight: bold;\n}\n\n.close:hover,\n.close:focus {\n  color: var(--brOrange3);\n  text-decoration: none;\n  cursor: pointer;\n}\n\n.statTable {\n  margin: 0 auto 1.5cqw;\n}\n.statTable td {\n  padding: 0 4cqw;\n}\n\n.statNum {\n  text-align: right;\n}\n\n::-webkit-scrollbar {\n  width: 2cqw;\n}\n\n::-webkit-scrollbar-track {\n  background: rgba(254, 146, 0, 0.2);\n}\n\n::-webkit-scrollbar-thumb {\n  background: rgba(254, 146, 0, 0.4);\n}\n\n::-webkit-scrollbar-thumb:hover {\n  background: var(--brOrange1);\n}\n\n.modalContent {\n  scrollbar-color: rgba(254, 146, 0, 0.6) rgba(254, 146, 0, 0.1);\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (url, options) {
  if (!options) {
    options = {};
  }
  if (!url) {
    return url;
  }
  url = String(url.__esModule ? url.default : url);

  // If url is already wrapped in quotes, remove them
  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }
  if (options.hash) {
    url += options.hash;
  }

  // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls
  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }
  return url;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./node_modules/js-confetti/dist/es/index.js":
/*!***************************************************!*\
  !*** ./node_modules/js-confetti/dist/es/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function normalizeComputedStyleValue(string) {
  // "250px" --> 250
  return +string.replace(/px/, '');
}

function fixDPR(canvas) {
  var dpr = window.devicePixelRatio;
  var computedStyles = getComputedStyle(canvas);
  var width = normalizeComputedStyleValue(computedStyles.getPropertyValue('width'));
  var height = normalizeComputedStyleValue(computedStyles.getPropertyValue('height'));
  canvas.setAttribute('width', (width * dpr).toString());
  canvas.setAttribute('height', (height * dpr).toString());
}

function generateRandomNumber(min, max) {
  var fractionDigits = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var randomNumber = Math.random() * (max - min) + min;
  return Math.floor(randomNumber * Math.pow(10, fractionDigits)) / Math.pow(10, fractionDigits);
}

function generateRandomArrayElement(arr) {
  return arr[generateRandomNumber(0, arr.length)];
}

var FREE_FALLING_OBJECT_ACCELERATION = 0.00125;
var MIN_DRAG_FORCE_COEFFICIENT = 0.0005;
var MAX_DRAG_FORCE_COEFFICIENT = 0.0009;
var ROTATION_SLOWDOWN_ACCELERATION = 0.00001;
var INITIAL_SHAPE_RADIUS = 6;
var INITIAL_EMOJI_SIZE = 80;
var MIN_INITIAL_CONFETTI_SPEED = 0.9;
var MAX_INITIAL_CONFETTI_SPEED = 1.7;
var MIN_FINAL_X_CONFETTI_SPEED = 0.2;
var MAX_FINAL_X_CONFETTI_SPEED = 0.6;
var MIN_INITIAL_ROTATION_SPEED = 0.03;
var MAX_INITIAL_ROTATION_SPEED = 0.07;
var MIN_CONFETTI_ANGLE = 15;
var MAX_CONFETTI_ANGLE = 82;
var MAX_CONFETTI_POSITION_SHIFT = 150;
var SHAPE_VISIBILITY_TRESHOLD = 100;
var DEFAULT_CONFETTI_NUMBER = 250;
var DEFAULT_EMOJIS_NUMBER = 40;
var DEFAULT_CONFETTI_COLORS = ['#fcf403', '#62fc03', '#f4fc03', '#03e7fc', '#03fca5', '#a503fc', '#fc03ad', '#fc03c2'];

function getWindowWidthCoefficient(canvasWidth) {
  var HD_SCREEN_WIDTH = 1920;
  return Math.log(canvasWidth) / Math.log(HD_SCREEN_WIDTH);
}

var ConfettiShape = /*#__PURE__*/function () {
  function ConfettiShape(args) {
    _classCallCheck(this, ConfettiShape);

    var initialPosition = args.initialPosition,
        direction = args.direction,
        confettiRadius = args.confettiRadius,
        confettiColors = args.confettiColors,
        emojis = args.emojis,
        emojiSize = args.emojiSize,
        canvasWidth = args.canvasWidth;
    var randomConfettiSpeed = generateRandomNumber(MIN_INITIAL_CONFETTI_SPEED, MAX_INITIAL_CONFETTI_SPEED, 3);
    var initialSpeed = randomConfettiSpeed * getWindowWidthCoefficient(canvasWidth);
    this.confettiSpeed = {
      x: initialSpeed,
      y: initialSpeed
    };
    this.finalConfettiSpeedX = generateRandomNumber(MIN_FINAL_X_CONFETTI_SPEED, MAX_FINAL_X_CONFETTI_SPEED, 3);
    this.rotationSpeed = emojis.length ? 0.01 : generateRandomNumber(MIN_INITIAL_ROTATION_SPEED, MAX_INITIAL_ROTATION_SPEED, 3) * getWindowWidthCoefficient(canvasWidth);
    this.dragForceCoefficient = generateRandomNumber(MIN_DRAG_FORCE_COEFFICIENT, MAX_DRAG_FORCE_COEFFICIENT, 6);
    this.radius = {
      x: confettiRadius,
      y: confettiRadius
    };
    this.initialRadius = confettiRadius;
    this.rotationAngle = direction === 'left' ? generateRandomNumber(0, 0.2, 3) : generateRandomNumber(-0.2, 0, 3);
    this.emojiSize = emojiSize;
    this.emojiRotationAngle = generateRandomNumber(0, 2 * Math.PI);
    this.radiusYUpdateDirection = 'down';
    var angle = direction === 'left' ? generateRandomNumber(MAX_CONFETTI_ANGLE, MIN_CONFETTI_ANGLE) * Math.PI / 180 : generateRandomNumber(-MIN_CONFETTI_ANGLE, -MAX_CONFETTI_ANGLE) * Math.PI / 180;
    this.absCos = Math.abs(Math.cos(angle));
    this.absSin = Math.abs(Math.sin(angle));
    var positionShift = generateRandomNumber(-MAX_CONFETTI_POSITION_SHIFT, 0);
    var shiftedInitialPosition = {
      x: initialPosition.x + (direction === 'left' ? -positionShift : positionShift) * this.absCos,
      y: initialPosition.y - positionShift * this.absSin
    };
    this.currentPosition = Object.assign({}, shiftedInitialPosition);
    this.initialPosition = Object.assign({}, shiftedInitialPosition);
    this.color = emojis.length ? null : generateRandomArrayElement(confettiColors);
    this.emoji = emojis.length ? generateRandomArrayElement(emojis) : null;
    this.createdAt = new Date().getTime();
    this.direction = direction;
  }

  _createClass(ConfettiShape, [{
    key: "draw",
    value: function draw(canvasContext) {
      var currentPosition = this.currentPosition,
          radius = this.radius,
          color = this.color,
          emoji = this.emoji,
          rotationAngle = this.rotationAngle,
          emojiRotationAngle = this.emojiRotationAngle,
          emojiSize = this.emojiSize;
      var dpr = window.devicePixelRatio;

      if (color) {
        canvasContext.fillStyle = color;
        canvasContext.beginPath();
        canvasContext.ellipse(currentPosition.x * dpr, currentPosition.y * dpr, radius.x * dpr, radius.y * dpr, rotationAngle, 0, 2 * Math.PI);
        canvasContext.fill();
      } else if (emoji) {
        canvasContext.font = "".concat(emojiSize, "px serif");
        canvasContext.save();
        canvasContext.translate(dpr * currentPosition.x, dpr * currentPosition.y);
        canvasContext.rotate(emojiRotationAngle);
        canvasContext.textAlign = 'center';
        canvasContext.fillText(emoji, 0, 0);
        canvasContext.restore();
      }
    }
  }, {
    key: "updatePosition",
    value: function updatePosition(iterationTimeDelta, currentTime) {
      var confettiSpeed = this.confettiSpeed,
          dragForceCoefficient = this.dragForceCoefficient,
          finalConfettiSpeedX = this.finalConfettiSpeedX,
          radiusYUpdateDirection = this.radiusYUpdateDirection,
          rotationSpeed = this.rotationSpeed,
          createdAt = this.createdAt,
          direction = this.direction;
      var timeDeltaSinceCreation = currentTime - createdAt;
      if (confettiSpeed.x > finalConfettiSpeedX) this.confettiSpeed.x -= dragForceCoefficient * iterationTimeDelta;
      this.currentPosition.x += confettiSpeed.x * (direction === 'left' ? -this.absCos : this.absCos) * iterationTimeDelta;
      this.currentPosition.y = this.initialPosition.y - confettiSpeed.y * this.absSin * timeDeltaSinceCreation + FREE_FALLING_OBJECT_ACCELERATION * Math.pow(timeDeltaSinceCreation, 2) / 2;
      this.rotationSpeed -= this.emoji ? 0.0001 : ROTATION_SLOWDOWN_ACCELERATION * iterationTimeDelta;
      if (this.rotationSpeed < 0) this.rotationSpeed = 0; // no need to update rotation radius for emoji

      if (this.emoji) {
        this.emojiRotationAngle += this.rotationSpeed * iterationTimeDelta % (2 * Math.PI);
        return;
      }

      if (radiusYUpdateDirection === 'down') {
        this.radius.y -= iterationTimeDelta * rotationSpeed;

        if (this.radius.y <= 0) {
          this.radius.y = 0;
          this.radiusYUpdateDirection = 'up';
        }
      } else {
        this.radius.y += iterationTimeDelta * rotationSpeed;

        if (this.radius.y >= this.initialRadius) {
          this.radius.y = this.initialRadius;
          this.radiusYUpdateDirection = 'down';
        }
      }
    }
  }, {
    key: "getIsVisibleOnCanvas",
    value: function getIsVisibleOnCanvas(canvasHeight) {
      return this.currentPosition.y < canvasHeight + SHAPE_VISIBILITY_TRESHOLD;
    }
  }]);

  return ConfettiShape;
}();

function createCanvas() {
  var canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '1000';
  canvas.style.pointerEvents = 'none';
  document.body.appendChild(canvas);
  return canvas;
}

function normalizeConfettiConfig(confettiConfig) {
  var _confettiConfig$confe = confettiConfig.confettiRadius,
      confettiRadius = _confettiConfig$confe === void 0 ? INITIAL_SHAPE_RADIUS : _confettiConfig$confe,
      _confettiConfig$confe2 = confettiConfig.confettiNumber,
      confettiNumber = _confettiConfig$confe2 === void 0 ? confettiConfig.confettiesNumber || (confettiConfig.emojis ? DEFAULT_EMOJIS_NUMBER : DEFAULT_CONFETTI_NUMBER) : _confettiConfig$confe2,
      _confettiConfig$confe3 = confettiConfig.confettiColors,
      confettiColors = _confettiConfig$confe3 === void 0 ? DEFAULT_CONFETTI_COLORS : _confettiConfig$confe3,
      _confettiConfig$emoji = confettiConfig.emojis,
      emojis = _confettiConfig$emoji === void 0 ? confettiConfig.emojies || [] : _confettiConfig$emoji,
      _confettiConfig$emoji2 = confettiConfig.emojiSize,
      emojiSize = _confettiConfig$emoji2 === void 0 ? INITIAL_EMOJI_SIZE : _confettiConfig$emoji2; // deprecate wrong plural forms, used in early releases

  if (confettiConfig.emojies) console.error("emojies argument is deprecated, please use emojis instead");
  if (confettiConfig.confettiesNumber) console.error("confettiesNumber argument is deprecated, please use confettiNumber instead");
  return {
    confettiRadius: confettiRadius,
    confettiNumber: confettiNumber,
    confettiColors: confettiColors,
    emojis: emojis,
    emojiSize: emojiSize
  };
}

var ConfettiBatch = /*#__PURE__*/function () {
  function ConfettiBatch(canvasContext) {
    var _this = this;

    _classCallCheck(this, ConfettiBatch);

    this.canvasContext = canvasContext;
    this.shapes = [];
    this.promise = new Promise(function (completionCallback) {
      return _this.resolvePromise = completionCallback;
    });
  }

  _createClass(ConfettiBatch, [{
    key: "getBatchCompletePromise",
    value: function getBatchCompletePromise() {
      return this.promise;
    }
  }, {
    key: "addShapes",
    value: function addShapes() {
      var _this$shapes;

      (_this$shapes = this.shapes).push.apply(_this$shapes, arguments);
    }
  }, {
    key: "complete",
    value: function complete() {
      var _a;

      if (this.shapes.length) {
        return false;
      }

      (_a = this.resolvePromise) === null || _a === void 0 ? void 0 : _a.call(this);
      return true;
    }
  }, {
    key: "processShapes",
    value: function processShapes(time, canvasHeight, cleanupInvisibleShapes) {
      var _this2 = this;

      var timeDelta = time.timeDelta,
          currentTime = time.currentTime;
      this.shapes = this.shapes.filter(function (shape) {
        // Render the shapes in this batch
        shape.updatePosition(timeDelta, currentTime);
        shape.draw(_this2.canvasContext); // Only cleanup the shapes if we're being asked to

        if (!cleanupInvisibleShapes) {
          return true;
        }

        return shape.getIsVisibleOnCanvas(canvasHeight);
      });
    }
  }]);

  return ConfettiBatch;
}();

var JSConfetti = /*#__PURE__*/function () {
  function JSConfetti() {
    var jsConfettiConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, JSConfetti);

    this.activeConfettiBatches = [];
    this.canvas = jsConfettiConfig.canvas || createCanvas();
    this.canvasContext = this.canvas.getContext('2d');
    this.requestAnimationFrameRequested = false;
    this.lastUpdated = new Date().getTime();
    this.iterationIndex = 0;
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  _createClass(JSConfetti, [{
    key: "loop",
    value: function loop() {
      this.requestAnimationFrameRequested = false;
      fixDPR(this.canvas);
      var currentTime = new Date().getTime();
      var timeDelta = currentTime - this.lastUpdated;
      var canvasHeight = this.canvas.offsetHeight;
      var cleanupInvisibleShapes = this.iterationIndex % 10 === 0;
      this.activeConfettiBatches = this.activeConfettiBatches.filter(function (batch) {
        batch.processShapes({
          timeDelta: timeDelta,
          currentTime: currentTime
        }, canvasHeight, cleanupInvisibleShapes); // Do not remove invisible shapes on every iteration

        if (!cleanupInvisibleShapes) {
          return true;
        }

        return !batch.complete();
      });
      this.iterationIndex++;
      this.queueAnimationFrameIfNeeded(currentTime);
    }
  }, {
    key: "queueAnimationFrameIfNeeded",
    value: function queueAnimationFrameIfNeeded(currentTime) {
      if (this.requestAnimationFrameRequested) {
        // We already have a pended animation frame, so there is no more work
        return;
      }

      if (this.activeConfettiBatches.length < 1) {
        // No shapes to animate, so don't queue another frame
        return;
      }

      this.requestAnimationFrameRequested = true; // Capture the last updated time for animation

      this.lastUpdated = currentTime || new Date().getTime();
      requestAnimationFrame(this.loop);
    }
  }, {
    key: "addConfetti",
    value: function addConfetti() {
      var confettiConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var _normalizeConfettiCon = normalizeConfettiConfig(confettiConfig),
          confettiRadius = _normalizeConfettiCon.confettiRadius,
          confettiNumber = _normalizeConfettiCon.confettiNumber,
          confettiColors = _normalizeConfettiCon.confettiColors,
          emojis = _normalizeConfettiCon.emojis,
          emojiSize = _normalizeConfettiCon.emojiSize; // Use the bounding rect rather tahn the canvas width / height, because
      // .width / .height are unset until a layout pass has been completed. Upon
      // confetti being immediately queued on a page load, this hasn't happened so
      // the default of 300x150 will be returned, causing an improper source point
      // for the confetti animation.


      var canvasRect = this.canvas.getBoundingClientRect();
      var canvasWidth = canvasRect.width;
      var canvasHeight = canvasRect.height;
      var yPosition = canvasHeight * 5 / 7;
      var leftConfettiPosition = {
        x: 0,
        y: yPosition
      };
      var rightConfettiPosition = {
        x: canvasWidth,
        y: yPosition
      };
      var confettiGroup = new ConfettiBatch(this.canvasContext);

      for (var i = 0; i < confettiNumber / 2; i++) {
        var confettiOnTheRight = new ConfettiShape({
          initialPosition: leftConfettiPosition,
          direction: 'right',
          confettiRadius: confettiRadius,
          confettiColors: confettiColors,
          confettiNumber: confettiNumber,
          emojis: emojis,
          emojiSize: emojiSize,
          canvasWidth: canvasWidth
        });
        var confettiOnTheLeft = new ConfettiShape({
          initialPosition: rightConfettiPosition,
          direction: 'left',
          confettiRadius: confettiRadius,
          confettiColors: confettiColors,
          confettiNumber: confettiNumber,
          emojis: emojis,
          emojiSize: emojiSize,
          canvasWidth: canvasWidth
        });
        confettiGroup.addShapes(confettiOnTheRight, confettiOnTheLeft);
      }

      this.activeConfettiBatches.push(confettiGroup);
      this.queueAnimationFrameIfNeeded();
      return confettiGroup.getBatchCompletePromise();
    }
  }, {
    key: "clearCanvas",
    value: function clearCanvas() {
      this.activeConfettiBatches = [];
    }
  }]);

  return JSConfetti;
}();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (JSConfetti);


/***/ }),

/***/ "./client/style/main.css":
/*!*******************************!*\
  !*** ./client/style/main.css ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!../../node_modules/sass-loader/dist/cjs.js!./main.css */ "./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js!./client/style/main.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./client/audio/click.mp3":
/*!********************************!*\
  !*** ./client/audio/click.mp3 ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "audio/click.a7da3e325af4ef54cbfa.mp3";

/***/ }),

/***/ "./client/audio/comp.mp3":
/*!*******************************!*\
  !*** ./client/audio/comp.mp3 ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "audio/comp.31e8f6aeb7f9818b8ef2.mp3";

/***/ }),

/***/ "./client/audio/fight.mp3":
/*!********************************!*\
  !*** ./client/audio/fight.mp3 ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "audio/fight.c5c92cb67047b3b9fa5a.mp3";

/***/ }),

/***/ "./client/audio/invalid.mp3":
/*!**********************************!*\
  !*** ./client/audio/invalid.mp3 ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "audio/invalid.ef36f01f4578df16c3c8.mp3";

/***/ }),

/***/ "./client/audio/ratchet.mp3":
/*!**********************************!*\
  !*** ./client/audio/ratchet.mp3 ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "audio/ratchet.4af1877823e1cc0fbb17.mp3";

/***/ }),

/***/ "./client/audio/regret.mp3":
/*!*********************************!*\
  !*** ./client/audio/regret.mp3 ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "audio/regret.c85b4fda9ed45d9e28c4.mp3";

/***/ }),

/***/ "./client/fonts/BLADRMF_.TTF":
/*!***********************************!*\
  !*** ./client/fonts/BLADRMF_.TTF ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "fonts/BLADRMF_.0c7e2ce28555cce80449.TTF";

/***/ }),

/***/ "./client/fonts/Oxanium-VariableFont_wght.ttf":
/*!****************************************************!*\
  !*** ./client/fonts/Oxanium-VariableFont_wght.ttf ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "fonts/Oxanium-VariableFont_wght.d26645d688bccd49b28b.ttf";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "./";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**************************!*\
  !*** ./client/js/app.js ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_main_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../style/main.css */ "./client/style/main.css");
/* harmony import */ var _campaign_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./campaign.js */ "./client/js/campaign.js");
/* harmony import */ var _round_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./round.js */ "./client/js/round.js");
/* harmony import */ var _ui_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ui.js */ "./client/js/ui.js");
/* harmony import */ var _words_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./words.js */ "./client/js/words.js");
/* harmony import */ var _words_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_words_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _words_supplement_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./words-supplement.js */ "./client/js/words-supplement.js");
/* harmony import */ var _words_supplement_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_words_supplement_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var js_confetti__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! js-confetti */ "./node_modules/js-confetti/dist/es/index.js");


;







let game, ui, campaign
const jsConfetti = new js_confetti__WEBPACK_IMPORTED_MODULE_6__["default"]()

async function checkRow() {
  const guess = ui.board[ui.curRow].join("")
  ui.clickAudio.pause()
  if (
    !_words_js__WEBPACK_IMPORTED_MODULE_4__.WORDS.includes(guess.toUpperCase()) &&
    !_words_supplement_js__WEBPACK_IMPORTED_MODULE_5__.WORDS_SUPPLEMENT.includes(guess.toUpperCase())
  ) {
    ui.invalidAudio.play().catch((error) => {
      /*do nothing - it's just audio*/
    })
    ui.displayMessage(`${guess} is not a word`)
    return
  }
  game.submitGuess(guess)
  await ui.revealGuess(game.guessStatus())
  ui.updateKeyboard(game.letterStatus)
  if (game.secretWord === guess) {
    winRoutine()
    return
  }
  if (ui.curRow >= 5) {
    loseRoutine()
    return
  }

  ui.curRow++
  ui.curCol = 0
}

function winRoutine() {
  ui.curRow++
  let gameDetails = {
    outcome: "won",
    attempts: ui.curRow,
    word: game.secretWord,
    score: game.wordBasePointValue() * 10 ** (6 - ui.curRow),
  }
  ui.busy = true
  ui.successAudio.play().catch((error) => {
    /*do nothing - it's just audio*/
  })
  jsConfetti.addConfetti({
    confettiColors: [
      "#17aad8",
      "#017cb0",
      "#0b61a8",
      "#fe9200",
      "#ee610a",
      "#ea410b",
    ],
  })
  campaign.updateCampaign(gameDetails)
  setTimeout(() => {
    ui.showModal(
      "Success",
      [
        tablizeStats(gameDetails),
        "<i>What it means:</>",
        ...formatDefinition(game.wordDefinition),
      ],
      game.gameState
    )
    ui.busy = false
  }, 1500)
}

function loseRoutine() {
  ui.curRow++
  let gameDetails = {
    outcome: "lost",
    attempts: ui.curRow,
    word: game.secretWord,
    score:
      campaign.averageScore() > 0
        ? -1 * campaign.averageScore()
        : campaign.averageScore(),
  }
  campaign.updateCampaign(gameDetails)
  ui.failAudio.play().catch((error) => {
    /*do nothing - it's just audio*/
  })
  ui.showModal(
    "Failure",
    [
      tablizeStats(gameDetails),
      "<i>What it means:</>",
      ...formatDefinition(game.wordDefinition),
    ],
    game.gameState
  )
}

function formatDefinition(packedDefinition) {
  return packedDefinition.map((el) => {
    let htmlString = ""
    if (el.partOfSpeech) htmlString = `<i>${el.partOfSpeech}:</i>&nbsp;&nbsp;`
    return `${htmlString}${el.definition}`
  })
}

function tablizeStats(gameDetails) {
  let statStr = "<hr><table class='statTable'>"

  function statRow(statKey, statValue) {
    return `<tr><td>${statKey}</td><td class="statNum">${statValue}</td></tr>`
  }

  if (gameDetails) {
    statStr = `${statStr}${statRow("Word", gameDetails.word)}`
    statStr = `${statStr}${statRow("Attempts", gameDetails.attempts)}`
    statStr = `${statStr}${statRow("Round Score", gameDetails.score)}`
  }
  for (let el of campaign.campaignSummary()) {
    statStr = `${statStr}${statRow(el.label, el.value)}`
  }
  return `${statStr}</table><hr>`
}

function instructions() {
  ui.showModal(
    "Mission Briefing",
    [
      "Decrypt the code.",
      "Each code is a 5 letter word.",
      "Blue indicates right letter in right position.",
      "Orange indicates right letter in wrong position.",
      "You have 6 attempts before lockout.",
      "Good Luck!",
      // "&nbsp;&nbsp;",
      tablizeStats(),
      "The score calculation starts with the raw scrabble word " +
        "value and is then multiplied by 10 for every unused attempt. " +
        "For example, if the word was SMART and it was solved on the " +
        "fourth attempt, the score would be the raw word value of 7 multiplied " +
        "by 10 twice, once for each of the two unused attempts: 7 x 10 x 10 = 700.",
    ],
    game.gameState
  )
}

window.addEventListener("keydown", function (event) {
  if (ui.busy) return
  if (event.key === "Enter" && modalContainer.style.display !== "none") {
    closeButton.click()
    return
  }

  document.getElementById(event.key.toUpperCase()) &&
    document.getElementById(event.key.toUpperCase()).click()

  if (event.key === "Delete") document.getElementById("BACKSPACE").click()
})

pageContainer.addEventListener("touchstart", touchAndClickHandler)

pageContainer.addEventListener("click", touchAndClickHandler)

function touchAndClickHandler(event) {
  if (!(event.target.nodeName === "SPAN")) return
  if (ui.busy) return

  if (event.type === "touchstart") {
    event.preventDefault()
  }

  ui.clickAudio.currentTime = 0
  ui.clickAudio.play().catch((error) => {
    /*do nothing - it's just audio*/
  })

  let key = event.target.id
  if (game.gameState === "PLAYING") {
    if (key === "BACKSPACE") ui.deleteLetter()
    if (key === "ENTER" && ui.curCol > 4) checkRow()
    if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").includes(key))
      ui.appendLetter(key)
    return
  }

  if (game.gameState !== "PLAYING" && key === "ENTER") newRound()
}

function newRound() {
  game = new _round_js__WEBPACK_IMPORTED_MODULE_2__.Round(_words_js__WEBPACK_IMPORTED_MODULE_4__.WORDS[Math.floor(Math.random() * _words_js__WEBPACK_IMPORTED_MODULE_4__.WORDS.length)])
  console.log(game.secretWord)
  ui.reset()
}

function main() {
  // localStorage.clear()
  campaign = new _campaign_js__WEBPACK_IMPORTED_MODULE_1__.Campaign()
  ui = new _ui_js__WEBPACK_IMPORTED_MODULE_3__.UI(pageContainer)
  newRound()
  instructions()
}

window.onload = function () {
  main()
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbURBQW1ELFlBQVksR0FBRyxZQUFZO0FBQzlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbURBQW1ELFlBQVksR0FBRyxZQUFZO0FBQzlFO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0Esc0JBQXNCLFNBQVM7QUFDL0IsaURBQWlELFlBQVksR0FBRyxJQUFJO0FBQ3BFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaURBQWlELFlBQVksR0FBRyxJQUFJO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDNVRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUI7Ozs7Ozs7Ozs7O0FDcGVuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFtQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3BtS25CO0FBQzZHO0FBQ2pCO0FBQ087QUFDbkcsNENBQTRDLHlIQUF3QztBQUNwRiw0Q0FBNEMsMkpBQXlEO0FBQ3JHLDhCQUE4QixtRkFBMkIsQ0FBQyw0RkFBcUM7QUFDL0YseUNBQXlDLHNGQUErQjtBQUN4RSx5Q0FBeUMsc0ZBQStCO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsbUNBQW1DO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLG1DQUFtQztBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBLCtCQUErQjtBQUMvQixzQ0FBc0M7QUFDdEMseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUMsT0FBTyx3RkFBd0YsV0FBVyxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFVBQVUsV0FBVyxXQUFXLE1BQU0sS0FBSyxXQUFXLFdBQVcsS0FBSyxLQUFLLFdBQVcsV0FBVyxXQUFXLFdBQVcsS0FBSyxNQUFNLFdBQVcsV0FBVyxVQUFVLFVBQVUsV0FBVyxNQUFNLEtBQUssVUFBVSxVQUFVLE1BQU0sS0FBSyxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsTUFBTSxLQUFLLFVBQVUsV0FBVyxVQUFVLFdBQVcsTUFBTSxNQUFNLFVBQVUsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFVBQVUsTUFBTSxLQUFLLFVBQVUsVUFBVSxXQUFXLFdBQVcsV0FBVyxVQUFVLFVBQVUsVUFBVSxXQUFXLFVBQVUsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLE1BQU0sS0FBSyxXQUFXLFdBQVcsVUFBVSxVQUFVLFVBQVUsVUFBVSxXQUFXLFdBQVcsV0FBVyxNQUFNLEtBQUssVUFBVSxXQUFXLFVBQVUsVUFBVSxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsTUFBTSxLQUFLLFVBQVUsVUFBVSxXQUFXLFdBQVcsV0FBVyxXQUFXLE1BQU0sS0FBSyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsVUFBVSxXQUFXLFdBQVcsVUFBVSxNQUFNLEtBQUssV0FBVyxXQUFXLE1BQU0sS0FBSyxVQUFVLFVBQVUsV0FBVyxVQUFVLFdBQVcsVUFBVSxNQUFNLEtBQUssVUFBVSxVQUFVLFdBQVcsV0FBVyxXQUFXLE1BQU0sS0FBSyxVQUFVLFVBQVUsV0FBVyxXQUFXLFdBQVcsTUFBTSxLQUFLLFVBQVUsVUFBVSxXQUFXLFdBQVcsV0FBVyxNQUFNLEtBQUssVUFBVSxVQUFVLFdBQVcsV0FBVyxXQUFXLE1BQU0sTUFBTSxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsVUFBVSxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLE1BQU0sS0FBSyxXQUFXLFdBQVcsTUFBTSxNQUFNLFdBQVcsV0FBVyxNQUFNLEtBQUssV0FBVyxXQUFXLE1BQU0sS0FBSyxXQUFXLFdBQVcsTUFBTSxLQUFLLFdBQVcsV0FBVyxNQUFNLEtBQUssV0FBVyxXQUFXLFdBQVcsTUFBTSxLQUFLLFdBQVcsTUFBTSxLQUFLLEtBQUssV0FBVyxLQUFLLEtBQUssV0FBVyxLQUFLLEtBQUssV0FBVyxLQUFLLEtBQUssS0FBSyxVQUFVLFVBQVUsVUFBVSxXQUFXLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUFVLFdBQVcsTUFBTSxLQUFLLFdBQVcsV0FBVyxXQUFXLFVBQVUsVUFBVSxVQUFVLFVBQVUsV0FBVyxXQUFXLFVBQVUsVUFBVSxNQUFNLEtBQUssV0FBVyxXQUFXLE1BQU0sS0FBSyxXQUFXLFdBQVcsV0FBVyxNQUFNLEtBQUssV0FBVyxVQUFVLFdBQVcsVUFBVSxXQUFXLE1BQU0sS0FBSyxXQUFXLFVBQVUsV0FBVyxVQUFVLFdBQVcsTUFBTSxNQUFNLFdBQVcsV0FBVyxVQUFVLE1BQU0sS0FBSyxXQUFXLE1BQU0sS0FBSyxVQUFVLE1BQU0sS0FBSyxXQUFXLE1BQU0sS0FBSyxVQUFVLE1BQU0sS0FBSyxXQUFXLE1BQU0sS0FBSyxXQUFXLE1BQU0sS0FBSyxXQUFXLE1BQU0sS0FBSyxXQUFXLGdDQUFnQyx1QkFBdUIsb0JBQW9CLHFCQUFxQixxQkFBcUIsdUJBQXVCLHVCQUF1Qix1QkFBdUIseUJBQXlCLHVDQUF1Qyx5QkFBeUIsR0FBRyxnQkFBZ0Isa0NBQWtDLG9DQUFvQyxHQUFHLGdCQUFnQiw2QkFBNkIsdUJBQXVCLHdCQUF3Qix5REFBeUQsR0FBRyxpQkFBaUIscUNBQXFDLHNDQUFzQyxjQUFjLGVBQWUsdUJBQXVCLEdBQUcsU0FBUyxjQUFjLGVBQWUsR0FBRyxxQkFBcUIsa0JBQWtCLHFCQUFxQixxQkFBcUIsc0JBQXNCLGdDQUFnQyxHQUFHLG9CQUFvQixrQkFBa0IsMkJBQTJCLG1CQUFtQix1QkFBdUIsd0JBQXdCLHFCQUFxQixxQkFBcUIsa0JBQWtCLG1DQUFtQyxpQ0FBaUMsMENBQTBDLDZCQUE2QixrQ0FBa0MsbUJBQW1CLEdBQUcsYUFBYSxrQkFBa0IsbUJBQW1CLDRCQUE0Qiw0QkFBNEIsa0NBQWtDLG9CQUFvQixvQkFBb0IsaUJBQWlCLDZDQUE2QyxpQkFBaUIsNENBQTRDLHlCQUF5Qiw4QkFBOEIsMEJBQTBCLHNCQUFzQixHQUFHLGNBQWMsNEJBQTRCLHNDQUFzQyxvQkFBb0Isb0JBQW9CLGlCQUFpQixpQkFBaUIsaURBQWlELDhDQUE4QyxxQ0FBcUMsR0FBRyxvQkFBb0Isa0JBQWtCLDRCQUE0QixtQkFBbUIsa0JBQWtCLGlCQUFpQix5QkFBeUIsOEJBQThCLDBCQUEwQixzQkFBc0IsR0FBRyxlQUFlLGtCQUFrQixpQkFBaUIsZ0RBQWdELCtDQUErQyxxQkFBcUIscUJBQXFCLEdBQUcsV0FBVyx3QkFBd0Isc0NBQXNDLDJCQUEyQix1QkFBdUIsOEJBQThCLGtCQUFrQix3QkFBd0Isc0NBQXNDLG9CQUFvQixHQUFHLG9CQUFvQixrQ0FBa0Msd0JBQXdCLEdBQUcsd0JBQXdCLGtCQUFrQixtQkFBbUIsNEJBQTRCLGlCQUFpQixxQkFBcUIsa0JBQWtCLEdBQUcsbUJBQW1CLGtCQUFrQixpQkFBaUIsb0NBQW9DLCtCQUErQix5QkFBeUIsR0FBRyxtQkFBbUIsa0JBQWtCLGlCQUFpQiw0QkFBNEIsbUVBQW1FLDRCQUE0QixHQUFHLGlCQUFpQixrQkFBa0IsaUJBQWlCLDRCQUE0QiwyRUFBMkUsNEJBQTRCLEdBQUcsaUJBQWlCLGtCQUFrQixpQkFBaUIsNEJBQTRCLG1FQUFtRSw0QkFBNEIsR0FBRyx1QkFBdUIsa0JBQWtCLHNDQUFzQywyQkFBMkIsdUJBQXVCLHNDQUFzQyxzQkFBc0Isd0JBQXdCLHdCQUF3QixpQkFBaUIsMEJBQTBCLHVCQUF1QiwwQkFBMEIscUNBQXFDLDhCQUE4QiwwQkFBMEIsc0JBQXNCLEdBQUcsZ0JBQWdCLHVCQUF1QiwwQkFBMEIsR0FBRyx5QkFBeUIsMEJBQTBCLHNCQUFzQixHQUFHLGdCQUFnQiw0QkFBNEIsMENBQTBDLEdBQUcsY0FBYywwQkFBMEIsd0NBQXdDLEdBQUcsYUFBYSx3QkFBd0Isc0NBQXNDLEdBQUcsZUFBZSxxQ0FBcUMsMEJBQTBCLHlDQUF5QyxHQUFHLFlBQVksbUNBQW1DLEdBQUcsMEJBQTBCLFFBQVEsK0JBQStCLEtBQUssU0FBUyxnQ0FBZ0MsS0FBSyxVQUFVLCtCQUErQixLQUFLLEdBQUcscUJBQXFCLGtCQUFrQixvQkFBb0IsZUFBZSx1QkFBdUIsV0FBVyxhQUFhLFlBQVksY0FBYyxrQkFBa0IsbUJBQW1CLDRDQUE0QyxHQUFHLG1CQUFtQixzQ0FBc0MsNkNBQTZDLDRCQUE0QixpQkFBaUIsb0JBQW9CLG1CQUFtQixpQkFBaUIscUJBQXFCLHNCQUFzQixvQkFBb0IsbUJBQW1CLEdBQUcsc0JBQXNCLDJDQUEyQyxxQkFBcUIsR0FBRyxpQkFBaUIsc0NBQXNDLHdCQUF3Qix5QkFBeUIsR0FBRyx1QkFBdUIsc0NBQXNDLGdCQUFnQix1QkFBdUIsb0JBQW9CLHFCQUFxQixHQUFHLFlBQVksNEJBQTRCLGlCQUFpQix5QkFBeUIsb0JBQW9CLHNCQUFzQixHQUFHLGlDQUFpQyw0QkFBNEIsMEJBQTBCLG9CQUFvQixHQUFHLGdCQUFnQiwwQkFBMEIsR0FBRyxpQkFBaUIsb0JBQW9CLEdBQUcsY0FBYyxzQkFBc0IsR0FBRyx5QkFBeUIsZ0JBQWdCLEdBQUcsK0JBQStCLHVDQUF1QyxHQUFHLCtCQUErQix1Q0FBdUMsR0FBRyxxQ0FBcUMsaUNBQWlDLEdBQUcsbUJBQW1CLG1FQUFtRSxHQUFHLHFCQUFxQjtBQUMxeFI7QUFDQSxpRUFBZSx1QkFBdUIsRUFBQzs7Ozs7Ozs7Ozs7O0FDdlYxQjs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFEO0FBQ3JEO0FBQ0E7QUFDQSxnREFBZ0Q7QUFDaEQ7QUFDQTtBQUNBLHFGQUFxRjtBQUNyRjtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsaUJBQWlCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixxQkFBcUI7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Ysc0ZBQXNGLHFCQUFxQjtBQUMzRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YsaURBQWlELHFCQUFxQjtBQUN0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Ysc0RBQXNELHFCQUFxQjtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ3BGYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ3pCYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVELGNBQWM7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQixrQkFBa0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0MsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMERBQTBEOztBQUUxRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1HQUFtRzs7QUFFbkc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7O0FBRTFDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE9BQU87QUFDUDtBQUNBLEdBQUc7O0FBRUg7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLHlDQUF5Qzs7QUFFbEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNB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Qzs7QUFFRDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSw0Q0FBSyxDQUFDLDRDQUFLLDRCQUE0Qiw0Q0FBSztBQUN6RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixrREFBUTtBQUN6QixXQUFXLHNDQUFFO0FBQ2I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3dvcmRhbC13ZWIvLi9jbGllbnQvanMvY2FtcGFpZ24uanMiLCJ3ZWJwYWNrOi8vd29yZGFsLXdlYi8uL2NsaWVudC9qcy9yb3VuZC5qcyIsIndlYnBhY2s6Ly93b3JkYWwtd2ViLy4vY2xpZW50L2pzL3VpLmpzIiwid2VicGFjazovL3dvcmRhbC13ZWIvLi9jbGllbnQvanMvd29yZHMtc3VwcGxlbWVudC5qcyIsIndlYnBhY2s6Ly93b3JkYWwtd2ViLy4vY2xpZW50L2pzL3dvcmRzLmpzIiwid2VicGFjazovL3dvcmRhbC13ZWIvLi9jbGllbnQvc3R5bGUvbWFpbi5jc3MiLCJ3ZWJwYWNrOi8vd29yZGFsLXdlYi8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vd29yZGFsLXdlYi8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanMiLCJ3ZWJwYWNrOi8vd29yZGFsLXdlYi8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL3dvcmRhbC13ZWIvLi9ub2RlX21vZHVsZXMvanMtY29uZmV0dGkvZGlzdC9lcy9pbmRleC5qcyIsIndlYnBhY2s6Ly93b3JkYWwtd2ViLy4vY2xpZW50L3N0eWxlL21haW4uY3NzPzhlZjkiLCJ3ZWJwYWNrOi8vd29yZGFsLXdlYi8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly93b3JkYWwtd2ViLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly93b3JkYWwtd2ViLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL3dvcmRhbC13ZWIvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vd29yZGFsLXdlYi8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL3dvcmRhbC13ZWIvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly93b3JkYWwtd2ViL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dvcmRhbC13ZWIvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vd29yZGFsLXdlYi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd29yZGFsLXdlYi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dvcmRhbC13ZWIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93b3JkYWwtd2ViL3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL3dvcmRhbC13ZWIvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vd29yZGFsLXdlYi93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vd29yZGFsLXdlYi8uL2NsaWVudC9qcy9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIENhbXBhaWduIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5nYW1lc1BsYXllZCA9IDBcbiAgICB0aGlzLmdhbWVzV29uID0gMFxuICAgIHRoaXMuaGlnaFNjb3JlID0gMFxuICAgIHRoaXMuYmVzdFN0cmVhayA9IDBcbiAgICB0aGlzLmN1clN0cmVhayA9IDBcbiAgICB0aGlzLmdhbWVEZXRhaWxzID0gW11cbiAgICB0aGlzLnZlcnNpb24gPSAxXG4gICAgdGhpcy5yZXN0b3JlRnJvbUxvY2FsU3RvcmFnZSgpXG4gIH1cblxuICB1cGRhdGVDYW1wYWlnbihnYW1lRGV0YWlscykge1xuICAgIHRoaXMuZ2FtZURldGFpbHMucHVzaChnYW1lRGV0YWlscylcbiAgICB0aGlzLmdhbWVzUGxheWVkKytcblxuICAgIGlmIChnYW1lRGV0YWlscy5vdXRjb21lID09PSBcIndvblwiKSB7XG4gICAgICB0aGlzLmdhbWVzV29uKytcbiAgICAgIHRoaXMuY3VyU3RyZWFrKytcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXJTdHJlYWsgPSAwXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY3VyU3RyZWFrID4gdGhpcy5iZXN0U3RyZWFrKSB7XG4gICAgICB0aGlzLmJlc3RTdHJlYWsgPSB0aGlzLmN1clN0cmVha1xuICAgIH1cblxuICAgIGlmIChnYW1lRGV0YWlscy5zY29yZSA+IHRoaXMuaGlnaFNjb3JlKSB7XG4gICAgICB0aGlzLmhpZ2hTY29yZSA9IGdhbWVEZXRhaWxzLnNjb3JlXG4gICAgfVxuICAgIHRoaXMuc2F2ZVRvTG9jYWxTdG9yYWdlKClcbiAgfVxuXG4gIGF2ZXJhZ2VBdHRlbXB0cygpIHtcbiAgICBpZiAodGhpcy5nYW1lc1BsYXllZCA9PT0gMCkgcmV0dXJuIDBcbiAgICByZXR1cm4gcGFyc2VGbG9hdChcbiAgICAgIChcbiAgICAgICAgdGhpcy5nYW1lRGV0YWlscy5yZWR1Y2UoKGFjYywgY3YpID0+IHtcbiAgICAgICAgICByZXR1cm4gYWNjICsgY3YuYXR0ZW1wdHNcbiAgICAgICAgfSwgMCkgLyB0aGlzLmdhbWVzUGxheWVkXG4gICAgICApLnRvRml4ZWQoMSlcbiAgICApXG4gIH1cblxuICB3aW5QZXJjZW50YWdlKCkge1xuICAgIGlmICh0aGlzLmdhbWVzUGxheWVkID09PSAwKSByZXR1cm4gMFxuICAgIHJldHVybiBNYXRoLnJvdW5kKCgxMDAgKiB0aGlzLmdhbWVzV29uKSAvIHRoaXMuZ2FtZXNQbGF5ZWQpXG4gIH1cblxuICBzbHVnZ2luZ1BlcmNlbnRhZ2UoKSB7XG4gICAgaWYgKHRoaXMuZ2FtZXNQbGF5ZWQgPT09IDApIHJldHVybiAwXG4gICAgcmV0dXJuIE1hdGgucm91bmQoXG4gICAgICAoMTAwICpcbiAgICAgICAgdGhpcy5nYW1lRGV0YWlsc1xuICAgICAgICAgIC5maWx0ZXIoKGVsKSA9PiBlbC5vdXRjb21lID09PSBcIndvblwiKVxuICAgICAgICAgIC5yZWR1Y2UoKGFjYywgY3YpID0+IGFjYyArIDcgLSBjdi5hdHRlbXB0cywgMCkpIC9cbiAgICAgICAgdGhpcy5nYW1lc1BsYXllZFxuICAgIClcbiAgfVxuXG4gIGF2ZXJhZ2VTY29yZSgpIHtcbiAgICBpZiAodGhpcy5nYW1lc1BsYXllZCA9PT0gMCkgcmV0dXJuIDBcbiAgICByZXR1cm4gTWF0aC5yb3VuZChcbiAgICAgIHRoaXMuZ2FtZURldGFpbHMucmVkdWNlKChhY2MsIGN2KSA9PiBhY2MgKyBjdi5zY29yZSwgMCkgLyB0aGlzLmdhbWVzUGxheWVkXG4gICAgKVxuICB9XG5cbiAgc2F2ZVRvTG9jYWxTdG9yYWdlKCkge1xuICAgIGxldCBjYW1wYWlnbkNvcHkgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzKVxuICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJjYW1wYWlnblwiLCBKU09OLnN0cmluZ2lmeShjYW1wYWlnbkNvcHkpKVxuICB9XG5cbiAgcmVzdG9yZUZyb21Mb2NhbFN0b3JhZ2UoKSB7XG4gICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiY2FtcGFpZ25cIikpIHtcbiAgICAgIGxldCBjYW1wYWlnbkNvcHkgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiY2FtcGFpZ25cIikpXG4gICAgICBPYmplY3QuYXNzaWduKHRoaXMsIGNhbXBhaWduQ29weSlcbiAgICB9XG4gIH1cblxuICBjYW1wYWlnblN1bW1hcnkoKSB7XG4gICAgbGV0IHN1bW1hcnkgPSBbXVxuICAgIHN1bW1hcnkucHVzaCh7IGxhYmVsOiBcIkF2ZXJhZ2UgU2NvcmVcIiwgdmFsdWU6IHRoaXMuYXZlcmFnZVNjb3JlKCkgfSlcbiAgICBzdW1tYXJ5LnB1c2goeyBsYWJlbDogXCJIaWdoIFNjb3JlXCIsIHZhbHVlOiB0aGlzLmhpZ2hTY29yZSB9KVxuICAgIHN1bW1hcnkucHVzaCh7IGxhYmVsOiBcIldpbm5pbmcgJVwiLCB2YWx1ZTogdGhpcy53aW5QZXJjZW50YWdlKCkgfSlcbiAgICBzdW1tYXJ5LnB1c2goeyBsYWJlbDogXCJTbHVnZ2luZyAlXCIsIHZhbHVlOiB0aGlzLnNsdWdnaW5nUGVyY2VudGFnZSgpIH0pXG4gICAgc3VtbWFyeS5wdXNoKHsgbGFiZWw6IFwiQmVzdCBTdHJlYWtcIiwgdmFsdWU6IHRoaXMuYmVzdFN0cmVhayB9KVxuICAgIHN1bW1hcnkucHVzaCh7IGxhYmVsOiBcIkN1cnJlbnQgU3RyZWFrXCIsIHZhbHVlOiB0aGlzLmN1clN0cmVhayB9KVxuICAgIHN1bW1hcnkucHVzaCh7IGxhYmVsOiBcIkF0dGVtcHRzL1JuZFwiLCB2YWx1ZTogdGhpcy5hdmVyYWdlQXR0ZW1wdHMoKSB9KVxuICAgIHN1bW1hcnkucHVzaCh7IGxhYmVsOiBcIlJvdW5kcyBQbGF5ZWRcIiwgdmFsdWU6IHRoaXMuZ2FtZXNQbGF5ZWQgfSlcbiAgICByZXR1cm4gc3VtbWFyeVxuICB9XG59XG4iLCJjb25zdCBMRVRURVJfVkFMVUVTID0ge1xuICBhOiAxLFxuICBiOiAzLFxuICBjOiAzLFxuICBkOiAyLFxuICBlOiAxLFxuICBmOiA0LFxuICBnOiAyLFxuICBoOiA0LFxuICBpOiAxLFxuICBqOiA4LFxuICBrOiA1LFxuICBsOiAxLFxuICBtOiAzLFxuICBuOiAxLFxuICBvOiAxLFxuICBwOiAzLFxuICBxOiAxMCxcbiAgcjogMSxcbiAgczogMSxcbiAgdDogMSxcbiAgdTogMSxcbiAgdjogNCxcbiAgdzogNCxcbiAgeDogOCxcbiAgeTogNCxcbiAgejogMTAsXG59XG5cbmV4cG9ydCBjbGFzcyBSb3VuZCB7XG4gIGNvbnN0cnVjdG9yKHNlY3JldFdvcmQgPSBcImd1ZXNzXCIpIHtcbiAgICB0aGlzLnNlY3JldFdvcmQgPSBzZWNyZXRXb3JkLnRvVXBwZXJDYXNlKClcbiAgICB0aGlzLndvcmREZWZpbml0aW9uID0gW11cbiAgICB0aGlzLmd1ZXNzZXMgPSBbXVxuICAgIHRoaXMubGV0dGVyU3RhdHVzID0ge31cbiAgICB0aGlzLmd1ZXNzZXNSZW1haW5pbmcgPSA2XG4gICAgdGhpcy5nYW1lU3RhdGUgPSBcIlBMQVlJTkdcIiAvL1BMQVlJTkcsIFdPTiwgTE9TVFxuICAgIHRoaXMucmVzZXRMZXR0ZXJTdGF0dXMoKVxuICAgIHRoaXMuZ2V0RGVmaW5pdGlvbigpXG4gIH1cblxuICBzdWJtaXRHdWVzcyh3b3JkKSB7XG4gICAgaWYgKHRoaXMuZ2FtZVN0YXRlID09PSBcIlBMQVlJTkdcIikge1xuICAgICAgdGhpcy5ndWVzc2VzLnB1c2god29yZC50b1VwcGVyQ2FzZSgpKVxuICAgICAgdGhpcy5ndWVzc2VzUmVtYWluaW5nLS1cbiAgICAgIHRoaXMuc2V0TGV0dGVyU3RhdHVzKHdvcmQudG9VcHBlckNhc2UoKSlcbiAgICAgIHRoaXMuY2FsY0dhbWVTdGF0ZSh3b3JkLnRvVXBwZXJDYXNlKCkpXG4gICAgICByZXR1cm4gW3RoaXMuZ3Vlc3NTdGF0dXMoKSwgdGhpcy5sZXR0ZXJTdGF0dXNdXG4gICAgfVxuICB9XG5cbiAgY2FsY0dhbWVTdGF0ZSh3b3JkKSB7XG4gICAgaWYgKHRoaXMuZ2FtZVN0YXRlID09PSBcIlBMQVlJTkdcIikge1xuICAgICAgaWYgKHdvcmQudG9VcHBlckNhc2UoKSA9PT0gdGhpcy5zZWNyZXRXb3JkKSB7XG4gICAgICAgIHRoaXMuZ2FtZVN0YXRlID0gXCJXT05cIlxuICAgICAgfSBlbHNlIGlmICh0aGlzLmd1ZXNzZXNSZW1haW5pbmcgPT09IDApIHtcbiAgICAgICAgdGhpcy5nYW1lU3RhdGUgPSBcIkxPU1RcIlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5nYW1lU3RhdGUgPSBcIlBMQVlJTkdcIlxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5nYW1lU3RhdGVcbiAgfVxuXG4gIHNldExldHRlclN0YXR1cyh3b3JkKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3b3JkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAod29yZFtpXSA9PT0gdGhpcy5zZWNyZXRXb3JkW2ldKSB7XG4gICAgICAgIHRoaXMubGV0dGVyU3RhdHVzW3RoaXMuc2VjcmV0V29yZFtpXV0gPSBcIkdcIlxuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgdGhpcy5zZWNyZXRXb3JkLnNwbGl0KFwiXCIpLmluY2x1ZGVzKHdvcmRbaV0pICYmXG4gICAgICAgIHRoaXMubGV0dGVyU3RhdHVzW3dvcmRbaV1dICE9PSBcIkdcIlxuICAgICAgKSB7XG4gICAgICAgIHRoaXMubGV0dGVyU3RhdHVzW3dvcmRbaV1dID0gXCJZXCJcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICF0aGlzLnNlY3JldFdvcmQuc3BsaXQoXCJcIikuaW5jbHVkZXMod29yZFtpXSkgJiZcbiAgICAgICAgdGhpcy5sZXR0ZXJTdGF0dXNbd29yZFtpXV0gPT09IFwiV1wiXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5sZXR0ZXJTdGF0dXNbd29yZFtpXV0gPSBcIlJcIlxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5sZXR0ZXJTdGF0dXNcbiAgfVxuXG4gIHJlc2V0TGV0dGVyU3RhdHVzKCkge1xuICAgIGZvciAobGV0IGxldHRlciBvZiBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaXCIuc3BsaXQoXCJcIikpIHtcbiAgICAgIHRoaXMubGV0dGVyU3RhdHVzW2xldHRlcl0gPSBcIldcIlxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5sZXR0ZXJTdGF0dXNcbiAgfVxuXG4gIGd1ZXNzU3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLmd1ZXNzZXMubWFwKChndWVzcykgPT4ge1xuICAgICAgbGV0IGd1ZXNzU3RhdEFyciA9IGd1ZXNzLnNwbGl0KFwiXCIpLm1hcCgoZWwpID0+IHtcbiAgICAgICAgcmV0dXJuIHsgbGV0dGVyOiBlbCwgc3RhdHVzOiBcIlJcIiB9XG4gICAgICB9KVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNlY3JldFdvcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMuc2VjcmV0V29yZFtpXSA9PT0gZ3Vlc3NbaV0pIHtcbiAgICAgICAgICBndWVzc1N0YXRBcnJbaV0uc3RhdHVzID0gXCJHXCJcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGd1ZXNzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIHRoaXMuc2VjcmV0V29yZFtpXSA9PT0gZ3Vlc3Nbal0gJiZcbiAgICAgICAgICAgICAgZ3Vlc3NTdGF0QXJyW2pdLnN0YXR1cyA9PT0gXCJSXCJcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBndWVzc1N0YXRBcnJbal0uc3RhdHVzID0gXCJZXCJcbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBndWVzc1N0YXRBcnJcbiAgICB9KVxuICB9XG5cbiAgYXN5bmMgZ2V0RGVmaW5pdGlvbigpIHtcbiAgICBsZXQgZGVmaW5pdGlvbkFyciA9IFtdXG4gICAgdHJ5IHtcbiAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgICBgaHR0cHM6Ly9hcGkuZGljdGlvbmFyeWFwaS5kZXYvYXBpL3YyL2VudHJpZXMvZW4vJHt0aGlzLnNlY3JldFdvcmQudG9Mb3dlckNhc2UoKX1gXG4gICAgICApXG4gICAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgICAgbGV0IGpzb24gPSBhd2FpdCByZXNwb25zZS5qc29uKClcbiAgICAgICAgZGVmaW5pdGlvbkFyciA9IHRoaXMudW5wYWNrRGVmaW5pdGlvbihqc29uKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGVmaW5pdGlvbiBGZXRjaCBGYWlsZWRcIilcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZGVmaW5pdGlvbkFyciA9IFtcbiAgICAgICAge1xuICAgICAgICAgIHBhcnRPZlNwZWVjaDogbnVsbCxcbiAgICAgICAgICBkZWZpbml0aW9uOiBcIkRpY3Rpb25hcnkgb3IgZGVmaW5pdGlvbiBub3QgYXZhaWxhYmxlIGF0IHRoaXMgdGltZS5cIixcbiAgICAgICAgfSxcbiAgICAgIF1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy53b3JkRGVmaW5pdGlvbiA9IGRlZmluaXRpb25BcnJcbiAgICAgIHJldHVybiBkZWZpbml0aW9uQXJyXG4gICAgfVxuICB9XG5cbiAgdW5wYWNrRGVmaW5pdGlvbihqc29uKSB7XG4gICAgbGV0IGRlZmluaXRpb25BcnIgPSBbXVxuICAgIGZvciAobGV0IGVudHJ5IG9mIGpzb24pIHtcbiAgICAgIGZvciAobGV0IG1lYW5pbmcgb2YgZW50cnkubWVhbmluZ3MpIHtcbiAgICAgICAgZm9yIChsZXQgZGVmaW5pdGlvbiBvZiBtZWFuaW5nLmRlZmluaXRpb25zKSB7XG4gICAgICAgICAgZGVmaW5pdGlvbkFyci5wdXNoKHtcbiAgICAgICAgICAgIHBhcnRPZlNwZWVjaDogbWVhbmluZy5wYXJ0T2ZTcGVlY2gsXG4gICAgICAgICAgICBkZWZpbml0aW9uOiBkZWZpbml0aW9uLmRlZmluaXRpb24sXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZGVmaW5pdGlvbkFyci5sZW5ndGggPT09IDApIHtcbiAgICAgIGRlZmluaXRpb25BcnIucHVzaCh7XG4gICAgICAgIHBhcnRPZlNwZWVjaDogbnVsbCxcbiAgICAgICAgZGVmaW5pdGlvbjogXCJEaWN0aW9uYXJ5IG9yIGRlZmluaXRpb24gbm90IGF2YWlsYWJsZSBhdCB0aGlzIHRpbWUuXCIsXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gZGVmaW5pdGlvbkFyclxuICB9XG5cbiAgd29yZEJhc2VQb2ludFZhbHVlKCkge1xuICAgIGxldCB3b3JkQmFzZVNjb3JlID0gdGhpcy5zZWNyZXRXb3JkXG4gICAgICAudG9Mb3dlckNhc2UoKVxuICAgICAgLnNwbGl0KFwiXCIpXG4gICAgICAucmVkdWNlKChhY2MsIGN2KSA9PiB7XG4gICAgICAgIHJldHVybiBhY2MgKyBMRVRURVJfVkFMVUVTW2N2XVxuICAgICAgfSwgMClcblxuICAgIHJldHVybiB3b3JkQmFzZVNjb3JlXG4gIH1cbn1cbiIsImltcG9ydCBhdWRpb0ZpbGVDbGljayBmcm9tIFwiLi4vYXVkaW8vY2xpY2subXAzXCJcbmltcG9ydCBhdWRpb0ZpbGVDb21wIGZyb20gXCIuLi9hdWRpby9jb21wLm1wM1wiXG5pbXBvcnQgYXVkaW9GaWxlU3VjY2VzcyBmcm9tIFwiLi4vYXVkaW8vZmlnaHQubXAzXCJcbmltcG9ydCBhdWRpb0ZpbGVGYWlsIGZyb20gXCIuLi9hdWRpby9yZWdyZXQubXAzXCJcbmltcG9ydCBhdWRpb0ZpbGVJbnZhbGlkIGZyb20gXCIuLi9hdWRpby9pbnZhbGlkLm1wM1wiXG5pbXBvcnQgYXVkaW9GaWxlUmF0Y2hldCBmcm9tIFwiLi4vYXVkaW8vcmF0Y2hldC5tcDNcIlxuaW1wb3J0IFwiLi4vc3R5bGUvbWFpbi5jc3NcIlxuXG5leHBvcnQgY2xhc3MgVUkge1xuICBjb25zdHJ1Y3Rvcihjb250YWluZXIpIHtcbiAgICB0aGlzLmluaXRpYWxVaVNldHVwKGNvbnRhaW5lcilcbiAgICB0aGlzLmF1ZGlvU2V0dXAoKVxuICAgIHRoaXMuY3VyUm93ID0gMFxuICAgIHRoaXMuY3VyQ29sID0gMFxuICAgIHRoaXMuYm9hcmQgPSBbXG4gICAgICBbXCJcIiwgXCJcIiwgXCJcIiwgXCJcIiwgXCJcIl0sXG4gICAgICBbXCJcIiwgXCJcIiwgXCJcIiwgXCJcIiwgXCJcIl0sXG4gICAgICBbXCJcIiwgXCJcIiwgXCJcIiwgXCJcIiwgXCJcIl0sXG4gICAgICBbXCJcIiwgXCJcIiwgXCJcIiwgXCJcIiwgXCJcIl0sXG4gICAgICBbXCJcIiwgXCJcIiwgXCJcIiwgXCJcIiwgXCJcIl0sXG4gICAgICBbXCJcIiwgXCJcIiwgXCJcIiwgXCJcIiwgXCJcIl0sXG4gICAgXVxuICAgIHRoaXMuYnVzeSA9IGZhbHNlXG4gIH1cblxuICBpbml0aWFsVWlTZXR1cChjb250YWluZXIpIHtcbiAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG4gICAgaGVhZGVyLmlkID0gXCJoZWFkZXJcIlxuICAgIGhlYWRlci5jbGFzc05hbWUgPSBcImhlYWRlclwiXG4gICAgaGVhZGVyLnRleHRDb250ZW50ID0gXCJXb3JkQnJ1bm5lclwiXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGhlYWRlcilcblxuICAgIGNvbnN0IGdhbWVDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG4gICAgZ2FtZUNvbnRhaW5lci5pZCA9IFwiZ2FtZUNvbnRhaW5lclwiXG4gICAgZ2FtZUNvbnRhaW5lci5jbGFzc05hbWUgPSBcImdhbWVDb250YWluZXJcIlxuICAgIHRoaXMuZHJhd1RpbGVHcmlkKGdhbWVDb250YWluZXIpXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGdhbWVDb250YWluZXIpXG5cbiAgICBjb25zdCBrZXlib2FyZENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICBrZXlib2FyZENvbnRhaW5lci5pZCA9IFwia2V5Ym9hcmRDb250YWluZXJcIlxuICAgIGtleWJvYXJkQ29udGFpbmVyLmNsYXNzTmFtZSA9IFwia2V5Ym9hcmRDb250YWluZXJcIlxuICAgIHRoaXMuZHJhd0tleWJvYXJkKGtleWJvYXJkQ29udGFpbmVyKVxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChrZXlib2FyZENvbnRhaW5lcilcblxuICAgIGNvbnN0IG1vZGFsQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICAgIG1vZGFsQ29udGFpbmVyLmlkID0gXCJtb2RhbENvbnRhaW5lclwiXG4gICAgbW9kYWxDb250YWluZXIuY2xhc3NOYW1lID0gXCJtb2RhbENvbnRhaW5lclwiXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKG1vZGFsQ29udGFpbmVyKVxuICB9XG5cbiAgYXVkaW9TZXR1cCgpIHtcbiAgICB0aGlzLmNsaWNrQXVkaW8gPSBuZXcgQXVkaW8oKVxuICAgIHRoaXMuY2xpY2tBdWRpby5zcmMgPSBhdWRpb0ZpbGVDbGlja1xuICAgIHRoaXMuY29tcEF1ZGlvID0gbmV3IEF1ZGlvKClcbiAgICB0aGlzLmNvbXBBdWRpby5zcmMgPSBhdWRpb0ZpbGVDb21wXG4gICAgdGhpcy5zdWNjZXNzQXVkaW8gPSBuZXcgQXVkaW8oKVxuICAgIHRoaXMuc3VjY2Vzc0F1ZGlvLnNyYyA9IGF1ZGlvRmlsZVN1Y2Nlc3NcbiAgICB0aGlzLmZhaWxBdWRpbyA9IG5ldyBBdWRpbygpXG4gICAgdGhpcy5mYWlsQXVkaW8uc3JjID0gYXVkaW9GaWxlRmFpbFxuICAgIHRoaXMuaW52YWxpZEF1ZGlvID0gbmV3IEF1ZGlvKClcbiAgICB0aGlzLmludmFsaWRBdWRpby5zcmMgPSBhdWRpb0ZpbGVJbnZhbGlkXG4gICAgdGhpcy5yYXRjaGV0QXVkaW8gPSBuZXcgQXVkaW8oKVxuICAgIHRoaXMucmF0Y2hldEF1ZGlvLnNyYyA9IGF1ZGlvRmlsZVJhdGNoZXRcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuY3VyUm93ID0gMFxuICAgIHRoaXMuY3VyQ29sID0gMFxuICAgIHRoaXMuYm9hcmQgPSBbXG4gICAgICBbXCJcIiwgXCJcIiwgXCJcIiwgXCJcIiwgXCJcIl0sXG4gICAgICBbXCJcIiwgXCJcIiwgXCJcIiwgXCJcIiwgXCJcIl0sXG4gICAgICBbXCJcIiwgXCJcIiwgXCJcIiwgXCJcIiwgXCJcIl0sXG4gICAgICBbXCJcIiwgXCJcIiwgXCJcIiwgXCJcIiwgXCJcIl0sXG4gICAgICBbXCJcIiwgXCJcIiwgXCJcIiwgXCJcIiwgXCJcIl0sXG4gICAgICBbXCJcIiwgXCJcIiwgXCJcIiwgXCJcIiwgXCJcIl0sXG4gICAgXVxuICAgIHRoaXMuYnVzeSA9IGZhbHNlXG4gICAgRU5URVIuY2xhc3NMaXN0LnJlbW92ZShcImdhbWVPdmVyXCIpXG4gICAgRU5URVIudGV4dENvbnRlbnQgPSBcIkVOVEVSXCJcbiAgICBoZWFkZXIuY2xhc3NOYW1lID0gXCJoZWFkZXJcIlxuICAgIGhlYWRlci50ZXh0Q29udGVudCA9IFwid29yZEJydW5uZXJcIlxuICAgIHRoaXMuZmxpcEFuZFJlc2V0VGlsZXMoKVxuICAgIGZvciAobGV0IGxldHRlciBvZiBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaXCIuc3BsaXQoXCJcIikpIHtcbiAgICAgIGxldCBrZXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChsZXR0ZXIpXG4gICAgICBrZXkuY2xhc3NOYW1lID0gXCJrZXlcIlxuICAgIH1cbiAgfVxuXG4gIGl0ZXJhdGVUaWxlcyhjYWxsYmFjaykge1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDY7IHJvdysrKSB7XG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCA1OyBjb2wrKykge1xuICAgICAgICBjYWxsYmFjayhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgdGlsZS0ke3Jvd30tJHtjb2x9YCkpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZmxpcEFuZFJlc2V0VGlsZXMoKSB7XG4gICAgdGhpcy5jbGlja0F1ZGlvLnBhdXNlKClcbiAgICB0aGlzLnJhdGNoZXRBdWRpby5wbGF5KCkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAvKmRvIG5vdGhpbmcgLSBpdCdzIGp1c3QgYXVkaW8qL1xuICAgIH0pXG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuaXRlcmF0ZVRpbGVzKCh0aWxlKSA9PiB7XG4gICAgICAgIHRpbGUuY2xhc3NMaXN0LnJlbW92ZShcInRpbGVIaXRcIiwgXCJ0aWxlQ2xvc2VcIiwgXCJ0aWxlTWlzc1wiKVxuICAgICAgICB0aWxlLmlubmVySFRNTCA9ICc8c3BhbiBjbGFzcz1cInRpbGVXYXRlck1hcmtcIj5CPC9zcGFuPidcbiAgICAgIH0pXG4gICAgfSwgNTAwKVxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLml0ZXJhdGVUaWxlcygodGlsZSkgPT4ge1xuICAgICAgICB0aWxlLmNsYXNzTGlzdC5yZW1vdmUoXCJyZXNldFwiKVxuICAgICAgfSlcbiAgICB9LCAxMDAwKVxuXG4gICAgdGhpcy5pdGVyYXRlVGlsZXMoKHRpbGUpID0+IHtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LmFkZChcInJlc2V0XCIpXG4gICAgfSlcbiAgfVxuXG4gIGRyYXdUaWxlKGNvbnRhaW5lciwgcm93LCBjb2wsIHZhbHVlID0gXCJcIikge1xuICAgIGNvbnN0IHRpbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG4gICAgdGlsZS5pZCA9IGB0aWxlLSR7cm93fS0ke2NvbH1gXG4gICAgdGlsZS5jbGFzc05hbWUgPSBcInRpbGVcIlxuICAgIHRpbGUudGV4dENvbnRlbnQgPSB2YWx1ZVxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aWxlKVxuICAgIC8vIHJldHVybiB0aWxlXG4gIH1cblxuICBkcmF3VGlsZUdyaWQoY29udGFpbmVyLCByb3dzID0gNiwgY29scyA9IDUpIHtcbiAgICBjb25zdCB0aWxlR3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICB0aWxlR3JpZC5jbGFzc05hbWUgPSBcInRpbGVHcmlkXCJcblxuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHJvd3M7IHJvdysrKSB7XG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBjb2xzOyBjb2wrKykge1xuICAgICAgICB0aGlzLmRyYXdUaWxlKHRpbGVHcmlkLCByb3csIGNvbCwgXCJcIilcbiAgICAgIH1cbiAgICB9XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRpbGVHcmlkKVxuICB9XG5cbiAgZHJhd0tleShrZXkpIHtcbiAgICBjb25zdCBrZXlCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKVxuICAgIGtleUJ1dHRvbi5pZCA9IGtleSA9PT0gXCLijKtcIiA/IFwiQkFDS1NQQUNFXCIgOiBrZXkgPT09IFwiRU5URVJcIiA/IFwiRU5URVJcIiA6IGtleVxuICAgIGtleUJ1dHRvbi5yb2xlID0gXCJidXR0b25cIlxuICAgIGtleUJ1dHRvbi5jbGFzc05hbWUgPSBrZXkgPT09IFwiIFwiID8gXCJrZXlTcGFjZXJcIiA6IFwia2V5XCJcbiAgICBrZXlCdXR0b24udGV4dENvbnRlbnQgPSBrZXlcbiAgICByZXR1cm4ga2V5QnV0dG9uXG4gIH1cblxuICBkcmF3S2V5Ym9hcmRSb3coY29udGFpbmVyLCByb3csIGtleXMpIHtcbiAgICBjb25zdCBrZXlib2FyZFJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICBrZXlib2FyZFJvdy5jbGFzc05hbWUgPSBcImtleWJvYXJkUm93Q29udGFpbmVyXCJcblxuICAgIGNvbnN0IGtleWJvYXJkUm93R3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICBrZXlib2FyZFJvd0dyaWQuaWQgPSBga2V5Ym9hcmRSb3cke3Jvd31gXG4gICAgLy9Gb2xsb3dpbmcgMyByb3dzIGFkZGVkIHRvIHByZXZlbnQgd2VicGFjayBQdXJnZUNTUyBmcm9tIHJlbW92aW5nIHRoZSBjbGFzc2VzIGZyb20gQ1NTLFxuICAgIC8vYXMgaXQgaXMgbm90IHNtYXJ0IGVub3VnaCB0byBpbnRlcnByZXQgdGhlIHRlbXBsYXRlIGxpdGVyYWwgdGhhdCBmb2xsb3dzLlxuICAgIGtleWJvYXJkUm93R3JpZC5jbGFzc05hbWUgPSBga2V5Ym9hcmRSb3cxYFxuICAgIGtleWJvYXJkUm93R3JpZC5jbGFzc05hbWUgPSBga2V5Ym9hcmRSb3cyYFxuICAgIGtleWJvYXJkUm93R3JpZC5jbGFzc05hbWUgPSBga2V5Ym9hcmRSb3czYFxuICAgIGtleWJvYXJkUm93R3JpZC5jbGFzc05hbWUgPSBga2V5Ym9hcmRSb3cke3Jvd31gXG5cbiAgICBmb3IgKGxldCBrZXkgb2Yga2V5cykge1xuICAgICAgY29uc3Qga2V5QnV0dG9uID0gdGhpcy5kcmF3S2V5KGtleSlcbiAgICAgIGtleWJvYXJkUm93R3JpZC5hcHBlbmQoa2V5QnV0dG9uKVxuICAgIH1cblxuICAgIGtleWJvYXJkUm93LmFwcGVuZChrZXlib2FyZFJvd0dyaWQpXG4gICAgY29udGFpbmVyLmFwcGVuZChrZXlib2FyZFJvdylcbiAgfVxuXG4gIGRyYXdLZXlib2FyZChjb250YWluZXIpIHtcbiAgICBjb25zdCBrZXlzID0gW1xuICAgICAgW1wiUVwiLCBcIldcIiwgXCJFXCIsIFwiUlwiLCBcIlRcIiwgXCJZXCIsIFwiVVwiLCBcIklcIiwgXCJPXCIsIFwiUFwiXSxcbiAgICAgIFtcIiBcIiwgXCJBXCIsIFwiU1wiLCBcIkRcIiwgXCJGXCIsIFwiR1wiLCBcIkhcIiwgXCJKXCIsIFwiS1wiLCBcIkxcIiwgXCIgXCJdLFxuICAgICAgW1wiRU5URVJcIiwgXCJaXCIsIFwiWFwiLCBcIkNcIiwgXCJWXCIsIFwiQlwiLCBcIk5cIiwgXCJNXCIsIFwi4oyrXCJdLFxuICAgIF1cbiAgICBjb25zdCBrZXlib2FyZEdyaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG4gICAga2V5Ym9hcmRHcmlkLmNsYXNzTmFtZSA9IFwia2V5Ym9hcmRHcmlkXCJcbiAgICBrZXlib2FyZEdyaWQuaWQgPSBcImtleWJvYXJkR3JpZFwiXG5cbiAgICBjb250YWluZXIuYXBwZW5kKGtleWJvYXJkR3JpZClcblxuICAgIHRoaXMuZHJhd0tleWJvYXJkUm93KGtleWJvYXJkR3JpZCwgMSwga2V5c1swXSlcbiAgICB0aGlzLmRyYXdLZXlib2FyZFJvdyhrZXlib2FyZEdyaWQsIDIsIGtleXNbMV0pXG4gICAgdGhpcy5kcmF3S2V5Ym9hcmRSb3coa2V5Ym9hcmRHcmlkLCAzLCBrZXlzWzJdKVxuICB9XG5cbiAgYXBwZW5kTGV0dGVyKGxldHRlcikge1xuICAgIGlmICh0aGlzLmN1ckNvbCA8IDUgJiYgdGhpcy5jdXJSb3cgPCA2KSB7XG4gICAgICBjb25zdCB0aWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYHRpbGUtJHt0aGlzLmN1clJvd30tJHt0aGlzLmN1ckNvbH1gKVxuICAgICAgdGlsZS50ZXh0Q29udGVudCA9IGxldHRlclxuICAgICAgdGhpcy5ib2FyZFt0aGlzLmN1clJvd11bdGhpcy5jdXJDb2xdID0gbGV0dGVyXG4gICAgICB0aGlzLmN1ckNvbCsrXG4gICAgfVxuICB9XG5cbiAgZGVsZXRlTGV0dGVyKCkge1xuICAgIGlmICh0aGlzLmN1ckNvbCA+IDApIHtcbiAgICAgIHRoaXMuY3VyQ29sLS1cbiAgICAgIGNvbnN0IHRpbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgdGlsZS0ke3RoaXMuY3VyUm93fS0ke3RoaXMuY3VyQ29sfWApXG4gICAgICB0aWxlLmlubmVySFRNTCA9ICc8c3BhbiBjbGFzcz1cInRpbGVXYXRlck1hcmtcIj5CPC9zcGFuPidcbiAgICAgIHRoaXMuYm9hcmRbdGhpcy5jdXJSb3ddW3RoaXMuY3VyQ29sXSA9IFwiXCJcbiAgICB9XG4gIH1cblxuICBkaXNwbGF5TWVzc2FnZShtZXNzYWdlLCB0aW1lID0gMzUwMCkge1xuICAgIGhlYWRlci5jbGFzc05hbWUgPSBcIm1lc3NhZ2VcIlxuICAgIGhlYWRlci50ZXh0Q29udGVudCA9IG1lc3NhZ2VcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGhlYWRlci5jbGFzc05hbWUgPSBcImhlYWRlclwiXG4gICAgICBoZWFkZXIudGV4dENvbnRlbnQgPSBcIndvcmRCcnVubmVyXCJcbiAgICB9LCB0aW1lKVxuICB9XG5cbiAgdXBkYXRlS2V5Ym9hcmQobGV0dGVyU3RhdHVzKSB7XG4gICAgZm9yIChsZXQgW2xldHRlciwgc3RhdHVzXSBvZiBPYmplY3QuZW50cmllcyhsZXR0ZXJTdGF0dXMpKSB7XG4gICAgICBsZXQga2V5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobGV0dGVyKVxuICAgICAga2V5LmNsYXNzTGlzdC5hZGQoXG4gICAgICAgIHN0YXR1cyA9PT0gXCJHXCJcbiAgICAgICAgICA/IFwidGlsZUhpdFwiXG4gICAgICAgICAgOiBzdGF0dXMgPT09IFwiWVwiXG4gICAgICAgICAgPyBcInRpbGVDbG9zZVwiXG4gICAgICAgICAgOiBzdGF0dXMgPT09IFwiUlwiXG4gICAgICAgICAgPyBcInRpbGVNaXNzXCJcbiAgICAgICAgICA6IFwia2V5XCJcbiAgICAgIClcbiAgICB9XG4gIH1cblxuICBhc3luYyByZXZlYWxHdWVzcyhndWVzc1N0YXR1cykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLmJ1c3kgPSB0cnVlXG4gICAgICBsZXQgZ0FyciA9IGd1ZXNzU3RhdHVzXG4gICAgICB0aGlzLmNvbXBBdWRpby5wbGF5KCkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgIC8qZG8gbm90aGluZyAtIGl0J3MganVzdCBhdWRpbyovXG4gICAgICB9KVxuICAgICAgbGV0IHdvcmQgPSBnQXJyW3RoaXMuY3VyUm93XVxuICAgICAgbGV0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4gdGhpcy5zY3JhbWJsZUVmZmVjdCgpLCAzMClcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKVxuICAgICAgfSlcbiAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpXG4gICAgICB0aGlzLmNvbG9yVGlsZXMod29yZClcbiAgICAgIHRoaXMuYnVzeSA9IGZhbHNlXG4gICAgICByZXNvbHZlKClcbiAgICB9KVxuICB9XG5cbiAgc2NyYW1ibGVFZmZlY3QoKSB7XG4gICAgY29uc3QgbGV0dGVycyA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpcIlxuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IDU7IGNvbCsrKSB7XG4gICAgICBsZXQgdGlsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGB0aWxlLSR7dGhpcy5jdXJSb3d9LSR7Y29sfWApXG4gICAgICB0aWxlLnRleHRDb250ZW50ID0gbGV0dGVyc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNildXG4gICAgfVxuICB9XG5cbiAgY29sb3JUaWxlcyh3b3JkKSB7XG4gICAgZm9yIChsZXQgW2lkeCwgbGV0dGVyXSBvZiB3b3JkLmVudHJpZXMoKSkge1xuICAgICAgbGV0IHRpbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgdGlsZS0ke3RoaXMuY3VyUm93fS0ke2lkeH1gKVxuICAgICAgdGlsZS50ZXh0Q29udGVudCA9IHdvcmRbaWR4XVtcImxldHRlclwiXVxuICAgICAgdGlsZS5jbGFzc0xpc3QuYWRkKFxuICAgICAgICBsZXR0ZXIuc3RhdHVzID09PSBcIkdcIlxuICAgICAgICAgID8gXCJ0aWxlSGl0XCJcbiAgICAgICAgICA6IGxldHRlci5zdGF0dXMgPT09IFwiWVwiXG4gICAgICAgICAgPyBcInRpbGVDbG9zZVwiXG4gICAgICAgICAgOiBcInRpbGVNaXNzXCJcbiAgICAgIClcbiAgICB9XG4gIH1cblxuICBzaG93TW9kYWwodGl0bGUgPSBcIlRpdGxlXCIsIGNvbnRlbnQgPSBbXCJsb3JlbSBpcHN1bVwiXSwgZ2FtZVN0YXRlKSB7XG4gICAgY29uc3QgbW9kYWxDbG9zZUhhbmRsZXIgPSAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC50eXBlID09PSBcInRvdWNoc3RhcnRcIikge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICB9XG4gICAgICBtb2RhbENvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCJcbiAgICAgIHRoaXMuc3VjY2Vzc0F1ZGlvLnBhdXNlKClcbiAgICAgIHRoaXMuc3VjY2Vzc0F1ZGlvLmN1cnJlbnRUaW1lID0gMFxuICAgICAgdGhpcy5mYWlsQXVkaW8ucGF1c2UoKVxuICAgICAgdGhpcy5mYWlsQXVkaW8uY3VycmVudFRpbWUgPSAwXG4gICAgICBpZiAoZ2FtZVN0YXRlICE9PSBcIlBMQVlJTkdcIikge1xuICAgICAgICBFTlRFUi5jbGFzc0xpc3QuYWRkKFwiZ2FtZU92ZXJcIilcbiAgICAgICAgRU5URVIudGV4dENvbnRlbnQgPSBcIlJFU0VUXCJcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgbW9kYWxDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICAgIG1vZGFsQ29udGVudC5pZCA9IFwibW9kYWxDb250ZW50XCJcbiAgICBtb2RhbENvbnRlbnQuY2xhc3NOYW1lID0gXCJtb2RhbENvbnRlbnRcIlxuXG4gICAgbGV0IGNsb3NlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIilcbiAgICBjbG9zZUJ1dHRvbi5pZCA9IFwiY2xvc2VCdXR0b25cIlxuICAgIGNsb3NlQnV0dG9uLmNsYXNzTmFtZSA9IFwiY2xvc2VcIlxuICAgIGNsb3NlQnV0dG9uLnRleHRDb250ZW50ID0gYHhgXG4gICAgY2xvc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG1vZGFsQ2xvc2VIYW5kbGVyKVxuICAgIGNsb3NlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIG1vZGFsQ2xvc2VIYW5kbGVyKVxuICAgIG1vZGFsQ29udGVudC5hcHBlbmRDaGlsZChjbG9zZUJ1dHRvbilcblxuICAgIGxldCBtb2RhbFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImg0XCIpXG4gICAgbW9kYWxUaXRsZS5jbGFzc05hbWUgPSBcIm1vZGFsVGl0bGVcIlxuICAgIG1vZGFsVGl0bGUudGV4dENvbnRlbnQgPSB0aXRsZVxuICAgIG1vZGFsQ29udGVudC5hcHBlbmRDaGlsZChtb2RhbFRpdGxlKVxuXG4gICAgZm9yIChsZXQgaXRlbSBvZiBjb250ZW50KSB7XG4gICAgICBsZXQgbW9kYWxDb250ZW50SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpXG4gICAgICBtb2RhbENvbnRlbnRJdGVtLmNsYXNzTmFtZSA9IFwibW9kYWxDb250ZW50SXRlbVwiXG4gICAgICBtb2RhbENvbnRlbnRJdGVtLmlubmVySFRNTCA9IGl0ZW1cbiAgICAgIG1vZGFsQ29udGVudC5hcHBlbmRDaGlsZChtb2RhbENvbnRlbnRJdGVtKVxuICAgIH1cblxuICAgIG1vZGFsQ29udGFpbmVyLnJlcGxhY2VDaGlsZHJlbigpXG4gICAgbW9kYWxDb250YWluZXIuYXBwZW5kQ2hpbGQobW9kYWxDb250ZW50KVxuICAgIG1vZGFsQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCJcbiAgfVxufVxuIiwiY29uc3QgV09SRFNfU1VQUExFTUVOVCA9IFtcbiAgXCJBQkFDSVwiLFxuICBcIkFCRU5EXCIsXG4gIFwiQUNIT09cIixcbiAgXCJBQ05FRFwiLFxuICBcIkFHQVJTXCIsXG4gIFwiQUdPTkVcIixcbiAgXCJBSE9MRFwiLFxuICBcIkFJREVSXCIsXG4gIFwiQUxHSU5cIixcbiAgXCJBTFRIT1wiLFxuICBcIkFNTU9TXCIsXG4gIFwiQU1VQ0tcIixcbiAgXCJBTVlMU1wiLFxuICBcIkFOREVEXCIsXG4gIFwiQU5JTEVcIixcbiAgXCJBTk5VTVwiLFxuICBcIkFQRVJTXCIsXG4gIFwiQVBPUlRcIixcbiAgXCJBUFNPU1wiLFxuICBcIkFRVUFFXCIsXG4gIFwiQVFVQVNcIixcbiAgXCJBUkVBTFwiLFxuICBcIkFSSVRZXCIsXG4gIFwiQVNLRVJcIixcbiAgXCJBU1NFRFwiLFxuICBcIkFTVFJPXCIsXG4gIFwiQVhMRURcIixcbiAgXCJBWUlOU1wiLFxuICBcIkJBSFRTXCIsXG4gIFwiQkFMRFNcIixcbiAgXCJCQVJJQ1wiLFxuICBcIkJBUktZXCIsXG4gIFwiQkFSTVNcIixcbiAgXCJCQVpBUlwiLFxuICBcIkJFQlVHXCIsXG4gIFwiQkVMTElcIixcbiAgXCJCRVNPVFwiLFxuICBcIkJIT1lTXCIsXG4gIFwiQklERVJcIixcbiAgXCJCSUdHWVwiLFxuICBcIkJJTEVTXCIsXG4gIFwiQklMR1lcIixcbiAgXCJCSVRTWVwiLFxuICBcIkJMQVNIXCIsXG4gIFwiQk9PS1lcIixcbiAgXCJCT1NTQVwiLFxuICBcIkJSQU5TXCIsXG4gIFwiQlJBVkFcIixcbiAgXCJCUkVOVFwiLFxuICBcIkJSSUVTXCIsXG4gIFwiQlJVTkdcIixcbiAgXCJCUlVTS1wiLFxuICBcIkJVRkZBXCIsXG4gIFwiQlVSUllcIixcbiAgXCJDQUdFUlwiLFxuICBcIkNBTkVSXCIsXG4gIFwiQ0FSTkVcIixcbiAgXCJDQVJPTlwiLFxuICBcIkNBUlBZXCIsXG4gIFwiQ0FTVVNcIixcbiAgXCJDRURFUlwiLFxuICBcIkNISUZGXCIsXG4gIFwiQ0hPT1NcIixcbiAgXCJDT09LWVwiLFxuICBcIkNPUVVJXCIsXG4gIFwiQ09SRFlcIixcbiAgXCJDT1JFUlwiLFxuICBcIkNSSU5LXCIsXG4gIFwiQ1VCRVJcIixcbiAgXCJDVUlOR1wiLFxuICBcIkNVUElEXCIsXG4gIFwiQ1VSRFlcIixcbiAgXCJDVVJFUlwiLFxuICBcIkNVUklBXCIsXG4gIFwiQ1VTUFlcIixcbiAgXCJEQVJFUlwiLFxuICBcIkRBU0hZXCIsXG4gIFwiREVBRFNcIixcbiAgXCJERUFSWVwiLFxuICBcIkRFRk9HXCIsXG4gIFwiREVGVU5cIixcbiAgXCJERUdVTVwiLFxuICBcIkRFSUNFXCIsXG4gIFwiREVJU1RcIixcbiAgXCJERVFVRVwiLFxuICBcIkRFV0VZXCIsXG4gIFwiRElDRVJcIixcbiAgXCJESUNVVFwiLFxuICBcIkRJRE9UXCIsXG4gIFwiRElFTVNcIixcbiAgXCJESUVTVFwiLFxuICBcIkRJRVRIXCIsXG4gIFwiRElSVFNcIixcbiAgXCJESVhJVFwiLFxuICBcIkRPUEVSXCIsXG4gIFwiRE9TRURcIixcbiAgXCJET1NFUlwiLFxuICBcIkRPU0VTXCIsXG4gIFwiRE9URVJcIixcbiAgXCJET1ZFWVwiLFxuICBcIkRPWElFXCIsXG4gIFwiRFJBQlNcIixcbiAgXCJEUklCU1wiLFxuICBcIkRVRERZXCIsXG4gIFwiRFVOR1lcIixcbiAgXCJEVU5LU1wiLFxuICBcIkVBUkVEXCIsXG4gIFwiRUFTVFNcIixcbiAgXCJFQ0hPU1wiLFxuICBcIkVER0VSXCIsXG4gIFwiRUxBTlNcIixcbiAgXCJFTkRFUlwiLFxuICBcIkVQU09NXCIsXG4gIFwiRVZFUllcIixcbiAgXCJFWUVSU1wiLFxuICBcIkZBQ0lFXCIsXG4gIFwiRkFDVE9cIixcbiAgXCJGQUlSRVwiLFxuICBcIkZBTUVTXCIsXG4gIFwiRkFOSU5cIixcbiAgXCJGQVRMWVwiLFxuICBcIkZBV05ZXCIsXG4gIFwiRkFYRVJcIixcbiAgXCJGRUlTVFwiLFxuICBcIkZFTk5ZXCIsXG4gIFwiRkVSTllcIixcbiAgXCJGRVVBUlwiLFxuICBcIkZFV0VSXCIsXG4gIFwiRklMQVJcIixcbiAgXCJGSUxFUlwiLFxuICBcIkZJTklGXCIsXG4gIFwiRklSRVJcIixcbiAgXCJGSVNUWVwiLFxuICBcIkZJVExZXCIsXG4gIFwiRklYSVRcIixcbiAgXCJGTEFCU1wiLFxuICBcIkZMQUtTXCIsXG4gIFwiRkxBUFNcIixcbiAgXCJGT0xJQ1wiLFxuICBcIkZPUkVTXCIsXG4gIFwiRk9SS1lcIixcbiAgXCJGT1JNQVwiLFxuICBcIkZVTUVSXCIsXG4gIFwiR0FNSUNcIixcbiAgXCJHQVBQWVwiLFxuICBcIkdBUkRFXCIsXG4gIFwiR0FZTFlcIixcbiAgXCJHQVpFUlwiLFxuICBcIkdIT1RJXCIsXG4gIFwiR0lCRVJcIixcbiAgXCJHSUdBU1wiLFxuICBcIkdJTUVMXCIsXG4gIFwiR0lNUFlcIixcbiAgXCJHSU5OWVwiLFxuICBcIkdMQVJZXCIsXG4gIFwiR0xVRVJcIixcbiAgXCJHT09OWVwiLFxuICBcIkdPT1BZXCIsXG4gIFwiR09SR0VcIixcbiAgXCJHUkFQWVwiLFxuICBcIkdSQVRBXCIsXG4gIFwiR1VOS1NcIixcbiAgXCJHVVRUQVwiLFxuICBcIkdXSU5FXCIsXG4gIFwiR1lWRURcIixcbiAgXCJIQVBBWFwiLFxuICBcIkhBUlVNXCIsXG4gIFwiSEFVVEVcIixcbiAgXCJIQVdFRFwiLFxuICBcIkhBWUVEXCIsXG4gIFwiSEFZRVJcIixcbiAgXCJIQVlFWVwiLFxuICBcIkhFRVJEXCIsXG4gIFwiSEVMTFNcIixcbiAgXCJIRU1QU1wiLFxuICBcIkhFTVBZXCIsXG4gIFwiSEVSRU1cIixcbiAgXCJIRVJPU1wiLFxuICBcIkhFWEVSXCIsXG4gIFwiSElERVJcIixcbiAgXCJISVJFUlwiLFxuICBcIkhJVkVSXCIsXG4gIFwiSE9BUlNcIixcbiAgXCJIT0RBRFwiLFxuICBcIkhPRVJTXCIsXG4gIFwiSE9MRVJcIixcbiAgXCJIT0xFWVwiLFxuICBcIkhPTE9OXCIsXG4gIFwiSE9NTUVcIixcbiAgXCJIT05FUlwiLFxuICBcIkhPUEVSXCIsXG4gIFwiSE9QUFlcIixcbiAgXCJIVUxLWVwiLFxuICBcIkhVUkxZXCIsXG4gIFwiSUNFUlNcIixcbiAgXCJJQ0lMWVwiLFxuICBcIklNTUlYXCIsXG4gIFwiSU5LRVJcIixcbiAgXCJJTk9ERVwiLFxuICBcIklPRElDXCIsXG4gIFwiSkFLRVNcIixcbiAgXCJKSUJFUlwiLFxuICBcIkpPV0xZXCIsXG4gIFwiSlVET1NcIixcbiAgXCJKVVNURVwiLFxuICBcIktBSUFLXCIsXG4gIFwiS0FMRVNcIixcbiAgXCJLRUJPQlwiLFxuICBcIktFTExZXCIsXG4gIFwiS0VMUFlcIixcbiAgXCJLRVlFUlwiLFxuICBcIktJTFRZXCIsXG4gIFwiS0lURURcIixcbiAgXCJLSVRFU1wiLFxuICBcIktMVU5LXCIsXG4gIFwiTEFDRVJcIixcbiAgXCJMQUNFWVwiLFxuICBcIkxBUElOXCIsXG4gIFwiTEFSRFlcIixcbiAgXCJMQVRVU1wiLFxuICBcIkxBVURFXCIsXG4gIFwiTEFXTllcIixcbiAgXCJMQVdaWVwiLFxuICBcIkxBWExZXCIsXG4gIFwiTElFUlNcIixcbiAgXCJMSUVTVFwiLFxuICBcIkxJRVRIXCIsXG4gIFwiTElHTkVcIixcbiAgXCJMSUtFUlwiLFxuICBcIkxJTFRZXCIsXG4gIFwiTElNQllcIixcbiAgXCJMSU5UU1wiLFxuICBcIkxJTlRZXCIsXG4gIFwiTElSQVNcIixcbiAgXCJMSVRFU1wiLFxuICBcIkxJVkVTXCIsXG4gIFwiTElWUkVcIixcbiAgXCJMT0FNU1wiLFxuICBcIkxPQkVEXCIsXG4gIFwiTE9HR1lcIixcbiAgXCJMT1BFUlwiLFxuICBcIkxPVFRBXCIsXG4gIFwiTE9YRVNcIixcbiAgXCJMVUxBQlwiLFxuICBcIkxVUkVSXCIsXG4gIFwiTFVWWUFcIixcbiAgXCJMVVhFU1wiLFxuICBcIk1BTkVEXCIsXG4gIFwiTUFTSFlcIixcbiAgXCJNQVNTRVwiLFxuICBcIk1FQkJFXCIsXG4gIFwiTUVDQ0FcIixcbiAgXCJNRUNVTVwiLFxuICBcIk1FUlNFXCIsXG4gIFwiTUlDQVNcIixcbiAgXCJNSU1FUlwiLFxuICBcIk1JTkFTXCIsXG4gIFwiTU9EVVNcIixcbiAgXCJNT0xUT1wiLFxuICBcIk1PUEVSXCIsXG4gIFwiTU9TVFNcIixcbiAgXCJNUkFEU1wiLFxuICBcIk1VSklLXCIsXG4gIFwiTVVNQk9cIixcbiAgXCJNVU5HWVwiLFxuICBcIk1VUktTXCIsXG4gIFwiTVVTRVJcIixcbiAgXCJNVVNTWVwiLFxuICBcIk1VVEVSXCIsXG4gIFwiTkFCTEFcIixcbiAgXCJOQU1FUlwiLFxuICBcIk5FUlRTXCIsXG4gIFwiTklISUxcIixcbiAgXCJOSVRUWVwiLFxuICBcIk5PQkJZXCIsXG4gIFwiTk9JUkVcIixcbiAgXCJOT05OWVwiLFxuICBcIk5PVEVSXCIsXG4gIFwiTlVERVJcIixcbiAgXCJOVVJCU1wiLFxuICBcIk9GRkVOXCIsXG4gIFwiT0dMRVJcIixcbiAgXCJPSE1JQ1wiLFxuICBcIk9LUkFTXCIsXG4gIFwiT0xFT1NcIixcbiAgXCJPTkNFVFwiLFxuICBcIk9PRExFXCIsXG4gIFwiT1JCRURcIixcbiAgXCJPUklOR1wiLFxuICBcIk9STE9OXCIsXG4gIFwiT1VURU5cIixcbiAgXCJPV0VTVFwiLFxuICBcIk9XRVRIXCIsXG4gIFwiUEFNUEFcIixcbiAgXCJQQU5FRFwiLFxuICBcIlBBUkVSXCIsXG4gIFwiUEFXRVJcIixcbiAgXCJQRUFUWVwiLFxuICBcIlBFTkRTXCIsXG4gIFwiUEVSRFVcIixcbiAgXCJQRVRSSVwiLFxuICBcIlBGRkZUXCIsXG4gIFwiUEhBU0VcIixcbiAgXCJQSUlOR1wiLFxuICBcIlBJU01PXCIsXG4gIFwiUExFSU5cIixcbiAgXCJQTEVOQVwiLFxuICBcIlBMWUVSXCIsXG4gIFwiUE9MTFlcIixcbiAgXCJQT0xPU1wiLFxuICBcIlBPTkVTXCIsXG4gIFwiUE9PRVlcIixcbiAgXCJQT1NFVFwiLFxuICBcIlBPU1RFXCIsXG4gIFwiUE9YRURcIixcbiAgXCJQUkVTVFwiLFxuICBcIlBSSUVSXCIsXG4gIFwiUFJJTUFcIixcbiAgXCJQUlVUQVwiLFxuICBcIlBSWUVSXCIsXG4gIFwiUFVQQUxcIixcbiAgXCJQVVBBU1wiLFxuICBcIlBZWElFXCIsXG4gIFwiUU9QSFNcIixcbiAgXCJRVUFJU1wiLFxuICBcIlFVQUxTXCIsXG4gIFwiUkFLRVJcIixcbiAgXCJSQVBFRFwiLFxuICBcIlJBUEVTXCIsXG4gIFwiUkFTQUVcIixcbiAgXCJSQVRFUlwiLFxuICBcIlJBV0xZXCIsXG4gIFwiUkFaRVJcIixcbiAgXCJSRUJPWFwiLFxuICBcIlJFRElQXCIsXG4gIFwiUkVETFlcIixcbiAgXCJSRUVLWVwiLFxuICBcIlJFRkxZXCIsXG4gIFwiUkVGUllcIixcbiAgXCJSRU5URVwiLFxuICBcIlJFU0FXXCIsXG4gIFwiUkVTQVlcIixcbiAgXCJSRVNFV1wiLFxuICBcIlJFV0VEXCIsXG4gIFwiUklER1lcIixcbiAgXCJSSUZFUlwiLFxuICBcIlJJTUVSXCIsXG4gIFwiUk9CTEVcIixcbiAgXCJST09LWVwiLFxuICBcIlJPT1RZXCIsXG4gIFwiUlVOSUNcIixcbiAgXCJSVU5UWVwiLFxuICBcIlJVU1NFXCIsXG4gIFwiUlVUVFlcIixcbiAgXCJTQUdFUlwiLFxuICBcIlNBVEVTXCIsXG4gIFwiU0FXRVJcIixcbiAgXCJTQVlFUlwiLFxuICBcIlNDT1BTXCIsXG4gIFwiU0NVU0VcIixcbiAgXCJTRURHWVwiLFxuICBcIlNFRVNUXCIsXG4gIFwiU0hJRVJcIixcbiAgXCJTSElLSVwiLFxuICBcIlNISVNIXCIsXG4gIFwiU0hOT1JcIixcbiAgXCJTSE9FRFwiLFxuICBcIlNIT0VSXCIsXG4gIFwiU0hVVEVcIixcbiAgXCJTSUZUU1wiLFxuICBcIlNJTFRZXCIsXG4gIFwiU0laRVJcIixcbiAgXCJTS1lFRFwiLFxuICBcIlNMQVdTXCIsXG4gIFwiU0xJRVJcIixcbiAgXCJTTFVGRlwiLFxuICBcIlNPRlRTXCIsXG4gIFwiU09MT05cIixcbiAgXCJTT0xVTVwiLFxuICBcIlNPTkxZXCIsXG4gIFwiU09XRVJcIixcbiAgXCJTT1lBU1wiLFxuICBcIlNQSUVSXCIsXG4gIFwiU1BJTkFcIixcbiAgXCJTUElOWVwiLFxuICBcIlNQVU1ZXCIsXG4gIFwiU1BVVEFcIixcbiAgXCJTVE9BRVwiLFxuICBcIlNVRFNZXCIsXG4gIFwiU1VFUlNcIixcbiAgXCJTVUVUU1wiLFxuICBcIlNVRVRZXCIsXG4gIFwiU1VQRVNcIixcbiAgXCJUQUNFVFwiLFxuICBcIlRBQ1RTXCIsXG4gIFwiVEFHVUFcIixcbiAgXCJUQVJFRFwiLFxuICBcIlRBWEVSXCIsXG4gIFwiVEVDVU1cIixcbiAgXCJURVhBU1wiLFxuICBcIlRIRUlSXCIsXG4gIFwiVEhFTlNcIixcbiAgXCJUSE9VU1wiLFxuICBcIlRIV0FQXCIsXG4gIFwiVElHSFRcIixcbiAgXCJUT0tFUlwiLFxuICBcIlRPUEVSXCIsXG4gIFwiVE9SQUhcIixcbiAgXCJUT1RFUlwiLFxuICBcIlRPVUNIXCIsXG4gIFwiVE9WRVNcIixcbiAgXCJUT1dFRFwiLFxuICBcIlRPWUVSXCIsXG4gIFwiVFJFQVBcIixcbiAgXCJUUklCU1wiLFxuICBcIlRVRkFTXCIsXG4gIFwiVFVGVFlcIixcbiAgXCJUVVJEWVwiLFxuICBcIlRZUEFMXCIsXG4gIFwiVUxOQVJcIixcbiAgXCJVTVBUWVwiLFxuICBcIlVOQVJDXCIsXG4gIFwiVU5BVEVcIixcbiAgXCJVTkZJWFwiLFxuICBcIlVOSElUXCIsXG4gIFwiVU5KQU1cIixcbiAgXCJVTk1BUFwiLFxuICBcIlVOU0VXXCIsXG4gIFwiVU5XT05cIixcbiAgXCJVUkVBU1wiLFxuICBcIlVURVJPXCIsXG4gIFwiVkFDVU9cIixcbiAgXCJWQUdVU1wiLFxuICBcIlZBTkVEXCIsXG4gIFwiVkFSSUFcIixcbiAgXCJWRUFMU1wiLFxuICBcIlZFSU5ZXCIsXG4gIFwiVkVSU0FcIixcbiAgXCJWSUVSU1wiLFxuICBcIlZJTExFXCIsXG4gIFwiVklORURcIixcbiAgXCJWSVJFU1wiLFxuICBcIlZJU0VEXCIsXG4gIFwiVklUQUVcIixcbiAgXCJWSVRBTVwiLFxuICBcIlZJVFJPXCIsXG4gIFwiVk9XRVJcIixcbiAgXCJXQUtFUlwiLFxuICBcIldBTEVEXCIsXG4gIFwiV0FOTFlcIixcbiAgXCJXQVJUWVwiLFxuICBcIldBWEVSXCIsXG4gIFwiV0VBTERcIixcbiAgXCJXRUFOU1wiLFxuICBcIldFQkJZXCIsXG4gIFwiV0VER1lcIixcbiAgXCJXRVNUU1wiLFxuICBcIldFVExZXCIsXG4gIFwiV0hBVFNcIixcbiAgXCJXSEVFRVwiLFxuICBcIldIRU5TXCIsXG4gIFwiV0hFV1NcIixcbiAgXCJXSEVZU1wiLFxuICBcIldISVNIXCIsXG4gIFwiV0hPQVNcIixcbiAgXCJXSE9PT1wiLFxuICBcIldJTkVZXCIsXG4gIFwiV0lSRVJcIixcbiAgXCJXSVNUU1wiLFxuICBcIldJVEhTXCIsXG4gIFwiV09PRVJcIixcbiAgXCJZT0dBU1wiLFxuICBcIllPR0lDXCIsXG4gIFwiWU9MS1lcIixcbiAgXCJZT1JFU1wiLFxuICBcIllVTEVTXCIsXG4gIFwiWkVBTFNcIixcbiAgXCJaRVNUWVwiLFxuICBcIlpJTkdZXCIsXG4gIFwiWk9NQklcIixcbiAgXCJaT09LU1wiLFxuXVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgV09SRFNfU1VQUExFTUVOVCB9XG4iLCJjb25zdCBXT1JEUyA9IFtcbiAgXCJBQVJHSFwiLFxuICBcIkFCQUNBXCIsXG4gIFwiQUJBQ0tcIixcbiAgXCJBQkFGVFwiLFxuICBcIkFCQVNFXCIsXG4gIFwiQUJBU0hcIixcbiAgXCJBQkFURVwiLFxuICBcIkFCQkVZXCIsXG4gIFwiQUJCT1RcIixcbiAgXCJBQkVBTVwiLFxuICBcIkFCRVRTXCIsXG4gIFwiQUJIT1JcIixcbiAgXCJBQklERVwiLFxuICBcIkFCTEVEXCIsXG4gIFwiQUJMRVJcIixcbiAgXCJBQk9ERVwiLFxuICBcIkFCT1JUXCIsXG4gIFwiQUJPVVRcIixcbiAgXCJBQk9WRVwiLFxuICBcIkFCVVNFXCIsXG4gIFwiQUJVVFNcIixcbiAgXCJBQlVaWlwiLFxuICBcIkFCWVNTXCIsXG4gIFwiQUNIRURcIixcbiAgXCJBQ0hFU1wiLFxuICBcIkFDSURTXCIsXG4gIFwiQUNJTkdcIixcbiAgXCJBQ01FU1wiLFxuICBcIkFDT1JOXCIsXG4gIFwiQUNSRVNcIixcbiAgXCJBQ1JJRFwiLFxuICBcIkFDVEVEXCIsXG4gIFwiQUNUSU5cIixcbiAgXCJBQ1RPUlwiLFxuICBcIkFDVVRFXCIsXG4gIFwiQURBR0VcIixcbiAgXCJBREFQVFwiLFxuICBcIkFEREVEXCIsXG4gIFwiQURERVJcIixcbiAgXCJBRERMRVwiLFxuICBcIkFERVBUXCIsXG4gIFwiQURJRVVcIixcbiAgXCJBRElPU1wiLFxuICBcIkFETElCXCIsXG4gIFwiQURNQU5cIixcbiAgXCJBRE1FTlwiLFxuICBcIkFETUlUXCIsXG4gIFwiQURNSVhcIixcbiAgXCJBRE9CRVwiLFxuICBcIkFET1BUXCIsXG4gIFwiQURPUkVcIixcbiAgXCJBRE9STlwiLFxuICBcIkFEVUxUXCIsXG4gIFwiQURaRVNcIixcbiAgXCJBRUdJU1wiLFxuICBcIkFFUklFXCIsXG4gIFwiQUZGSVhcIixcbiAgXCJBRklSRVwiLFxuICBcIkFGT09UXCIsXG4gIFwiQUZPUkVcIixcbiAgXCJBRk9VTFwiLFxuICBcIkFGVEVSXCIsXG4gIFwiQUdBSU5cIixcbiAgXCJBR0FQRVwiLFxuICBcIkFHQVRFXCIsXG4gIFwiQUdBVkVcIixcbiAgXCJBR0VOVFwiLFxuICBcIkFHSUxFXCIsXG4gIFwiQUdJTkdcIixcbiAgXCJBR0xFWVwiLFxuICBcIkFHTE9XXCIsXG4gIFwiQUdPTllcIixcbiAgXCJBR09SQVwiLFxuICBcIkFHUkVFXCIsXG4gIFwiQUdVRVNcIixcbiAgXCJBSEVBRFwiLFxuICBcIkFJREVEXCIsXG4gIFwiQUlERVNcIixcbiAgXCJBSUxFRFwiLFxuICBcIkFJTUVEXCIsXG4gIFwiQUlPTElcIixcbiAgXCJBSVJFRFwiLFxuICBcIkFJUkVSXCIsXG4gIFwiQUlTTEVcIixcbiAgXCJBSVRDSFwiLFxuICBcIkFKVUdBXCIsXG4gIFwiQUxBQ0tcIixcbiAgXCJBTEFSTVwiLFxuICBcIkFMQlVNXCIsXG4gIFwiQUxERVJcIixcbiAgXCJBTEVQSFwiLFxuICBcIkFMRVJUXCIsXG4gIFwiQUxHQUVcIixcbiAgXCJBTEdBTFwiLFxuICBcIkFMSUFTXCIsXG4gIFwiQUxJQklcIixcbiAgXCJBTElFTlwiLFxuICBcIkFMSUdOXCIsXG4gIFwiQUxJS0VcIixcbiAgXCJBTElWRVwiLFxuICBcIkFMS1lEXCIsXG4gIFwiQUxLWUxcIixcbiAgXCJBTExBWVwiLFxuICBcIkFMTEVZXCIsXG4gIFwiQUxMT1RcIixcbiAgXCJBTExPV1wiLFxuICBcIkFMTE9ZXCIsXG4gIFwiQUxPRVNcIixcbiAgXCJBTE9GVFwiLFxuICBcIkFMT0hBXCIsXG4gIFwiQUxPTkVcIixcbiAgXCJBTE9OR1wiLFxuICBcIkFMT09GXCIsXG4gIFwiQUxPVURcIixcbiAgXCJBTFBIQVwiLFxuICBcIkFMVEFSXCIsXG4gIFwiQUxURVJcIixcbiAgXCJBTFRPU1wiLFxuICBcIkFMVU1TXCIsXG4gIFwiQUxXQVlcIixcbiAgXCJBTUFIU1wiLFxuICBcIkFNQVNTXCIsXG4gIFwiQU1BWkVcIixcbiAgXCJBTUJFUlwiLFxuICBcIkFNQklUXCIsXG4gIFwiQU1CTEVcIixcbiAgXCJBTUVCQVwiLFxuICBcIkFNRU5EXCIsXG4gIFwiQU1FTlNcIixcbiAgXCJBTUlERVwiLFxuICBcIkFNSUdPXCIsXG4gIFwiQU1JTkVcIixcbiAgXCJBTUlOT1wiLFxuICBcIkFNSVNTXCIsXG4gIFwiQU1JVFlcIixcbiAgXCJBTU9OR1wiLFxuICBcIkFNT1VSXCIsXG4gIFwiQU1QRURcIixcbiAgXCJBTVBMRVwiLFxuICBcIkFNUExZXCIsXG4gIFwiQU1VU0VcIixcbiAgXCJBTkVOVFwiLFxuICBcIkFOR0VMXCIsXG4gIFwiQU5HRVJcIixcbiAgXCJBTkdMRVwiLFxuICBcIkFOR1JZXCIsXG4gIFwiQU5HU1RcIixcbiAgXCJBTklNQVwiLFxuICBcIkFOSU9OXCIsXG4gIFwiQU5JU0VcIixcbiAgXCJBTktIU1wiLFxuICBcIkFOS0xFXCIsXG4gIFwiQU5OQVNcIixcbiAgXCJBTk5FWFwiLFxuICBcIkFOTk9ZXCIsXG4gIFwiQU5OVUxcIixcbiAgXCJBTk9ERVwiLFxuICBcIkFOT0xFXCIsXG4gIFwiQU5URURcIixcbiAgXCJBTlRFU1wiLFxuICBcIkFOVElDXCIsXG4gIFwiQU5USVNcIixcbiAgXCJBTlRTWVwiLFxuICBcIkFOVklMXCIsXG4gIFwiQU9SVEFcIixcbiAgXCJBUEFDRVwiLFxuICBcIkFQQVJUXCIsXG4gIFwiQVBISURcIixcbiAgXCJBUEhJU1wiLFxuICBcIkFQSUFOXCIsXG4gIFwiQVBJTkdcIixcbiAgXCJBUElTSFwiLFxuICBcIkFQTkVBXCIsXG4gIFwiQVBQTEVcIixcbiAgXCJBUFBMWVwiLFxuICBcIkFQUk9OXCIsXG4gIFwiQVBTRVNcIixcbiAgXCJBUFRMWVwiLFxuICBcIkFSQk9SXCIsXG4gIFwiQVJDRURcIixcbiAgXCJBUkRPUlwiLFxuICBcIkFSRUFTXCIsXG4gIFwiQVJFTkFcIixcbiAgXCJBUkdPTlwiLFxuICBcIkFSR09UXCIsXG4gIFwiQVJHVUVcIixcbiAgXCJBUklBU1wiLFxuICBcIkFSSVNFXCIsXG4gIFwiQVJNRURcIixcbiAgXCJBUk1PUlwiLFxuICBcIkFST01BXCIsXG4gIFwiQVJPU0VcIixcbiAgXCJBUlJBU1wiLFxuICBcIkFSUkFZXCIsXG4gIFwiQVJST1dcIixcbiAgXCJBUlNFU1wiLFxuICBcIkFSU09OXCIsXG4gIFwiQVJUU1lcIixcbiAgXCJBUlVNU1wiLFxuICBcIkFTQU5BXCIsXG4gIFwiQVNDT1RcIixcbiAgXCJBU0hFTlwiLFxuICBcIkFTSEVTXCIsXG4gIFwiQVNJREVcIixcbiAgXCJBU0tFRFwiLFxuICBcIkFTS0VXXCIsXG4gIFwiQVNQRU5cIixcbiAgXCJBU1BJQ1wiLFxuICBcIkFTU0FJXCIsXG4gIFwiQVNTQVlcIixcbiAgXCJBU1NFU1wiLFxuICBcIkFTU0VUXCIsXG4gIFwiQVNURVJcIixcbiAgXCJBU1RJUlwiLFxuICBcIkFUSUxUXCIsXG4gIFwiQVRMQVNcIixcbiAgXCJBVE9MTFwiLFxuICBcIkFUT01TXCIsXG4gIFwiQVRPTkVcIixcbiAgXCJBVFJJQVwiLFxuICBcIkFUVEFSXCIsXG4gIFwiQVRUSUNcIixcbiAgXCJBVURJT1wiLFxuICBcIkFVRElUXCIsXG4gIFwiQVVHRVJcIixcbiAgXCJBVUdIVFwiLFxuICBcIkFVR1VSXCIsXG4gIFwiQVVOVFNcIixcbiAgXCJBVVJBRVwiLFxuICBcIkFVUkFMXCIsXG4gIFwiQVVSQVNcIixcbiAgXCJBVVJJQ1wiLFxuICBcIkFVVE9TXCIsXG4gIFwiQVZBSUxcIixcbiAgXCJBVkFOVFwiLFxuICBcIkFWQVNUXCIsXG4gIFwiQVZFUlNcIixcbiAgXCJBVkVSVFwiLFxuICBcIkFWSUFOXCIsXG4gIFwiQVZPSURcIixcbiAgXCJBVk9XU1wiLFxuICBcIkFXQUlUXCIsXG4gIFwiQVdBS0VcIixcbiAgXCJBV0FSRFwiLFxuICBcIkFXQVJFXCIsXG4gIFwiQVdBU0hcIixcbiAgXCJBV0FZU1wiLFxuICBcIkFXRlVMXCIsXG4gIFwiQVdJTkdcIixcbiAgXCJBV09LRVwiLFxuICBcIkFYRUxTXCIsXG4gIFwiQVhJQUxcIixcbiAgXCJBWElOR1wiLFxuICBcIkFYSU9NXCIsXG4gIFwiQVhMRVNcIixcbiAgXCJBWE1BTlwiLFxuICBcIkFYTUVOXCIsXG4gIFwiQVhPTlNcIixcbiAgXCJBWklORVwiLFxuICBcIkFaT0lDXCIsXG4gIFwiQVpVUkVcIixcbiAgXCJCQUJFTFwiLFxuICBcIkJBQkVTXCIsXG4gIFwiQkFDS1NcIixcbiAgXCJCQUNPTlwiLFxuICBcIkJBRERZXCIsXG4gIFwiQkFER0VcIixcbiAgXCJCQURMWVwiLFxuICBcIkJBR0VMXCIsXG4gIFwiQkFHR1lcIixcbiAgXCJCQUlMU1wiLFxuICBcIkJBSVJOXCIsXG4gIFwiQkFJVFNcIixcbiAgXCJCQUlaRVwiLFxuICBcIkJBS0VEXCIsXG4gIFwiQkFLRVJcIixcbiAgXCJCQUtFU1wiLFxuICBcIkJBTERZXCIsXG4gIFwiQkFMRURcIixcbiAgXCJCQUxFUlwiLFxuICBcIkJBTEVTXCIsXG4gIFwiQkFMS1NcIixcbiAgXCJCQUxLWVwiLFxuICBcIkJBTExTXCIsXG4gIFwiQkFMTFlcIixcbiAgXCJCQUxNU1wiLFxuICBcIkJBTE1ZXCIsXG4gIFwiQkFMU0FcIixcbiAgXCJCQU5BTFwiLFxuICBcIkJBTkRTXCIsXG4gIFwiQkFORFlcIixcbiAgXCJCQU5FU1wiLFxuICBcIkJBTkdTXCIsXG4gIFwiQkFOSk9cIixcbiAgXCJCQU5LU1wiLFxuICBcIkJBTk5TXCIsXG4gIFwiQkFSQlNcIixcbiAgXCJCQVJEU1wiLFxuICBcIkJBUkVEXCIsXG4gIFwiQkFSRVJcIixcbiAgXCJCQVJFU1wiLFxuICBcIkJBUkZTXCIsXG4gIFwiQkFSRllcIixcbiAgXCJCQVJHRVwiLFxuICBcIkJBUktTXCIsXG4gIFwiQkFSTVlcIixcbiAgXCJCQVJOU1wiLFxuICBcIkJBUk9OXCIsXG4gIFwiQkFTQUxcIixcbiAgXCJCQVNFRFwiLFxuICBcIkJBU0VSXCIsXG4gIFwiQkFTRVNcIixcbiAgXCJCQVNJQ1wiLFxuICBcIkJBU0lMXCIsXG4gIFwiQkFTSU5cIixcbiAgXCJCQVNJU1wiLFxuICBcIkJBU0tTXCIsXG4gIFwiQkFTU0lcIixcbiAgXCJCQVNTT1wiLFxuICBcIkJBU1RFXCIsXG4gIFwiQkFUQ0hcIixcbiAgXCJCQVRFRFwiLFxuICBcIkJBVEVTXCIsXG4gIFwiQkFUSEVcIixcbiAgXCJCQVRIU1wiLFxuICBcIkJBVElLXCIsXG4gIFwiQkFUT05cIixcbiAgXCJCQVRUWVwiLFxuICBcIkJBVURTXCIsXG4gIFwiQkFVTEtcIixcbiAgXCJCQVdEWVwiLFxuICBcIkJBV0xTXCIsXG4gIFwiQkFZRURcIixcbiAgXCJCQVlPVVwiLFxuICBcIkJFQUNIXCIsXG4gIFwiQkVBRFNcIixcbiAgXCJCRUFEWVwiLFxuICBcIkJFQUtTXCIsXG4gIFwiQkVBS1lcIixcbiAgXCJCRUFNU1wiLFxuICBcIkJFQU1ZXCIsXG4gIFwiQkVBTk9cIixcbiAgXCJCRUFOU1wiLFxuICBcIkJFQVJEXCIsXG4gIFwiQkVBUlNcIixcbiAgXCJCRUFTVFwiLFxuICBcIkJFQVRTXCIsXG4gIFwiQkVBVVNcIixcbiAgXCJCRUFVVFwiLFxuICBcIkJFQVVYXCIsXG4gIFwiQkVCT1BcIixcbiAgXCJCRUNLU1wiLFxuICBcIkJFREVXXCIsXG4gIFwiQkVESU1cIixcbiAgXCJCRUVDSFwiLFxuICBcIkJFRUZTXCIsXG4gIFwiQkVFRllcIixcbiAgXCJCRUVQU1wiLFxuICBcIkJFRVJTXCIsXG4gIFwiQkVFUllcIixcbiAgXCJCRUVUU1wiLFxuICBcIkJFRklUXCIsXG4gIFwiQkVGT0dcIixcbiAgXCJCRUdBTlwiLFxuICBcIkJFR0FUXCIsXG4gIFwiQkVHRVRcIixcbiAgXCJCRUdJTlwiLFxuICBcIkJFR09UXCIsXG4gIFwiQkVHVU5cIixcbiAgXCJCRUlHRVwiLFxuICBcIkJFSU5HXCIsXG4gIFwiQkVMQVlcIixcbiAgXCJCRUxDSFwiLFxuICBcIkJFTElFXCIsXG4gIFwiQkVMTEVcIixcbiAgXCJCRUxMU1wiLFxuICBcIkJFTExZXCIsXG4gIFwiQkVMT1dcIixcbiAgXCJCRUxUU1wiLFxuICBcIkJFTkNIXCIsXG4gIFwiQkVORFNcIixcbiAgXCJCRU5UU1wiLFxuICBcIkJFUkVUXCIsXG4gIFwiQkVSR1NcIixcbiAgXCJCRVJNU1wiLFxuICBcIkJFUlJZXCIsXG4gIFwiQkVSVEhcIixcbiAgXCJCRVJZTFwiLFxuICBcIkJFU0VUXCIsXG4gIFwiQkVTVFNcIixcbiAgXCJCRVRBU1wiLFxuICBcIkJFVEVMXCIsXG4gIFwiQkVUSFNcIixcbiAgXCJCRVZFTFwiLFxuICBcIkJFWkVMXCIsXG4gIFwiQkhBTkdcIixcbiAgXCJCSUJCU1wiLFxuICBcIkJJQkxFXCIsXG4gIFwiQklERFlcIixcbiAgXCJCSURFRFwiLFxuICBcIkJJREVTXCIsXG4gIFwiQklERVRcIixcbiAgXCJCSUVSU1wiLFxuICBcIkJJRkZTXCIsXG4gIFwiQklGRllcIixcbiAgXCJCSUdIVFwiLFxuICBcIkJJR0xZXCIsXG4gIFwiQklHT1RcIixcbiAgXCJCSUtFRFwiLFxuICBcIkJJS0VSXCIsXG4gIFwiQklLRVNcIixcbiAgXCJCSUxHRVwiLFxuICBcIkJJTEtTXCIsXG4gIFwiQklMTFNcIixcbiAgXCJCSUxMWVwiLFxuICBcIkJJTUJPXCIsXG4gIFwiQklORFNcIixcbiAgXCJCSU5HRVwiLFxuICBcIkJJTkdPXCIsXG4gIFwiQklPTUVcIixcbiAgXCJCSVBFRFwiLFxuICBcIkJJUE9EXCIsXG4gIFwiQklSQ0hcIixcbiAgXCJCSVJEU1wiLFxuICBcIkJJUlRIXCIsXG4gIFwiQklTT05cIixcbiAgXCJCSVRDSFwiLFxuICBcIkJJVEVSXCIsXG4gIFwiQklURVNcIixcbiAgXCJCSVRUWVwiLFxuICBcIkJMQUJTXCIsXG4gIFwiQkxBQ0tcIixcbiAgXCJCTEFERVwiLFxuICBcIkJMQUhTXCIsXG4gIFwiQkxBTUVcIixcbiAgXCJCTEFORFwiLFxuICBcIkJMQU5LXCIsXG4gIFwiQkxBUkVcIixcbiAgXCJCTEFTVFwiLFxuICBcIkJMQVRTXCIsXG4gIFwiQkxBWkVcIixcbiAgXCJCTEVBS1wiLFxuICBcIkJMRUFSXCIsXG4gIFwiQkxFQVRcIixcbiAgXCJCTEVCU1wiLFxuICBcIkJMRUVEXCIsXG4gIFwiQkxFTkRcIixcbiAgXCJCTEVTU1wiLFxuICBcIkJMRVNUXCIsXG4gIFwiQkxJTVBcIixcbiAgXCJCTElORFwiLFxuICBcIkJMSU5JXCIsXG4gIFwiQkxJTktcIixcbiAgXCJCTElQU1wiLFxuICBcIkJMSVNTXCIsXG4gIFwiQkxJVFpcIixcbiAgXCJCTE9BVFwiLFxuICBcIkJMT0JTXCIsXG4gIFwiQkxPQ0tcIixcbiAgXCJCTE9DU1wiLFxuICBcIkJMT0tFXCIsXG4gIFwiQkxPTkRcIixcbiAgXCJCTE9PRFwiLFxuICBcIkJMT09NXCIsXG4gIFwiQkxPVFNcIixcbiAgXCJCTE9XTlwiLFxuICBcIkJMT1dTXCIsXG4gIFwiQkxPV1lcIixcbiAgXCJCTFVFRFwiLFxuICBcIkJMVUVSXCIsXG4gIFwiQkxVRVNcIixcbiAgXCJCTFVGRlwiLFxuICBcIkJMVU5UXCIsXG4gIFwiQkxVUkJcIixcbiAgXCJCTFVSU1wiLFxuICBcIkJMVVJUXCIsXG4gIFwiQkxVU0hcIixcbiAgXCJCT0FSRFwiLFxuICBcIkJPQVJTXCIsXG4gIFwiQk9BU1RcIixcbiAgXCJCT0FUU1wiLFxuICBcIkJPQkJZXCIsXG4gIFwiQk9DQ0VcIixcbiAgXCJCT0NDSVwiLFxuICBcIkJPQ0tTXCIsXG4gIFwiQk9ERURcIixcbiAgXCJCT0RFU1wiLFxuICBcIkJPREdFXCIsXG4gIFwiQk9GRk9cIixcbiAgXCJCT0ZGU1wiLFxuICBcIkJPR0VZXCIsXG4gIFwiQk9HR1lcIixcbiAgXCJCT0dJRVwiLFxuICBcIkJPR1VTXCIsXG4gIFwiQk9JTFNcIixcbiAgXCJCT0xBU1wiLFxuICBcIkJPTExTXCIsXG4gIFwiQk9MT1NcIixcbiAgXCJCT0xUU1wiLFxuICBcIkJPTUJFXCIsXG4gIFwiQk9NQlNcIixcbiAgXCJCT05EU1wiLFxuICBcIkJPTkVEXCIsXG4gIFwiQk9ORVJcIixcbiAgXCJCT05FU1wiLFxuICBcIkJPTkdPXCIsXG4gIFwiQk9OR1NcIixcbiAgXCJCT05LU1wiLFxuICBcIkJPTk5FXCIsXG4gIFwiQk9OTllcIixcbiAgXCJCT05VU1wiLFxuICBcIkJPT0JTXCIsXG4gIFwiQk9PQllcIixcbiAgXCJCT09FRFwiLFxuICBcIkJPT0tTXCIsXG4gIFwiQk9PTVNcIixcbiAgXCJCT09NWVwiLFxuICBcIkJPT05TXCIsXG4gIFwiQk9PUlNcIixcbiAgXCJCT09TVFwiLFxuICBcIkJPT1RIXCIsXG4gIFwiQk9PVFNcIixcbiAgXCJCT09UWVwiLFxuICBcIkJPT1pFXCIsXG4gIFwiQk9PWllcIixcbiAgXCJCT1JBWFwiLFxuICBcIkJPUkVEXCIsXG4gIFwiQk9SRVJcIixcbiAgXCJCT1JFU1wiLFxuICBcIkJPUklDXCIsXG4gIFwiQk9STkVcIixcbiAgXCJCT1JPTlwiLFxuICBcIkJPU0tZXCIsXG4gIFwiQk9TT01cIixcbiAgXCJCT1NPTlwiLFxuICBcIkJPU1NZXCIsXG4gIFwiQk9TVU5cIixcbiAgXCJCT1RDSFwiLFxuICBcIkJPVUdIXCIsXG4gIFwiQk9VTEVcIixcbiAgXCJCT1VORFwiLFxuICBcIkJPVVRTXCIsXG4gIFwiQk9XRURcIixcbiAgXCJCT1dFTFwiLFxuICBcIkJPV0VSXCIsXG4gIFwiQk9XSUVcIixcbiAgXCJCT1dMU1wiLFxuICBcIkJPWEVEXCIsXG4gIFwiQk9YRVJcIixcbiAgXCJCT1hFU1wiLFxuICBcIkJPWk9TXCIsXG4gIFwiQlJBQ0VcIixcbiAgXCJCUkFDS1wiLFxuICBcIkJSQUNUXCIsXG4gIFwiQlJBRFNcIixcbiAgXCJCUkFFU1wiLFxuICBcIkJSQUdTXCIsXG4gIFwiQlJBSURcIixcbiAgXCJCUkFJTlwiLFxuICBcIkJSQUtFXCIsXG4gIFwiQlJBTkRcIixcbiAgXCJCUkFOVFwiLFxuICBcIkJSQVNIXCIsXG4gIFwiQlJBU1NcIixcbiAgXCJCUkFUU1wiLFxuICBcIkJSQVZFXCIsXG4gIFwiQlJBVk9cIixcbiAgXCJCUkFXTFwiLFxuICBcIkJSQVdOXCIsXG4gIFwiQlJBWVNcIixcbiAgXCJCUkFaRVwiLFxuICBcIkJSRUFEXCIsXG4gIFwiQlJFQUtcIixcbiAgXCJCUkVBTVwiLFxuICBcIkJSRUVEXCIsXG4gIFwiQlJFVkVcIixcbiAgXCJCUkVXU1wiLFxuICBcIkJSSUFSXCIsXG4gIFwiQlJJQkVcIixcbiAgXCJCUklDS1wiLFxuICBcIkJSSURFXCIsXG4gIFwiQlJJRUZcIixcbiAgXCJCUklFUlwiLFxuICBcIkJSSUdTXCIsXG4gIFwiQlJJTVNcIixcbiAgXCJCUklORVwiLFxuICBcIkJSSU5HXCIsXG4gIFwiQlJJTktcIixcbiAgXCJCUklOWVwiLFxuICBcIkJSSVNLXCIsXG4gIFwiQlJPQURcIixcbiAgXCJCUk9JTFwiLFxuICBcIkJST0tFXCIsXG4gIFwiQlJPTU9cIixcbiAgXCJCUk9OQ1wiLFxuICBcIkJST09EXCIsXG4gIFwiQlJPT0tcIixcbiAgXCJCUk9PTVwiLFxuICBcIkJST1RIXCIsXG4gIFwiQlJPV05cIixcbiAgXCJCUk9XU1wiLFxuICBcIkJSVUlOXCIsXG4gIFwiQlJVSVRcIixcbiAgXCJCUlVOVFwiLFxuICBcIkJSVVNIXCIsXG4gIFwiQlJVVEVcIixcbiAgXCJCVUJCQVwiLFxuICBcIkJVQ0tTXCIsXG4gIFwiQlVERFlcIixcbiAgXCJCVURHRVwiLFxuICBcIkJVRkZPXCIsXG4gIFwiQlVGRlNcIixcbiAgXCJCVUdHWVwiLFxuICBcIkJVR0xFXCIsXG4gIFwiQlVJTERcIixcbiAgXCJCVUlMVFwiLFxuICBcIkJVTEJTXCIsXG4gIFwiQlVMR0VcIixcbiAgXCJCVUxHWVwiLFxuICBcIkJVTEtTXCIsXG4gIFwiQlVMS1lcIixcbiAgXCJCVUxMU1wiLFxuICBcIkJVTExZXCIsXG4gIFwiQlVNUEhcIixcbiAgXCJCVU1QU1wiLFxuICBcIkJVTVBZXCIsXG4gIFwiQlVOQ0hcIixcbiAgXCJCVU5DT1wiLFxuICBcIkJVTkRTXCIsXG4gIFwiQlVOR1NcIixcbiAgXCJCVU5LT1wiLFxuICBcIkJVTktTXCIsXG4gIFwiQlVOTllcIixcbiAgXCJCVU5UU1wiLFxuICBcIkJVT1lTXCIsXG4gIFwiQlVSRVRcIixcbiAgXCJCVVJHU1wiLFxuICBcIkJVUkxTXCIsXG4gIFwiQlVSTFlcIixcbiAgXCJCVVJOU1wiLFxuICBcIkJVUk5UXCIsXG4gIFwiQlVSUFNcIixcbiAgXCJCVVJST1wiLFxuICBcIkJVUlJTXCIsXG4gIFwiQlVSU1RcIixcbiAgXCJCVVNCWVwiLFxuICBcIkJVU0VEXCIsXG4gIFwiQlVTRVNcIixcbiAgXCJCVVNIWVwiLFxuICBcIkJVU0tTXCIsXG4gIFwiQlVTVFNcIixcbiAgXCJCVVNUWVwiLFxuICBcIkJVVENIXCIsXG4gIFwiQlVUVEVcIixcbiAgXCJCVVRUU1wiLFxuICBcIkJVVFlMXCIsXG4gIFwiQlVYT01cIixcbiAgXCJCVVlFUlwiLFxuICBcIkJVWlpZXCIsXG4gIFwiQldBTkFcIixcbiAgXCJCWUxBV1wiLFxuICBcIkJZUkVTXCIsXG4gIFwiQllURVNcIixcbiAgXCJCWVdBWVwiLFxuICBcIkNBQkFMXCIsXG4gIFwiQ0FCQllcIixcbiAgXCJDQUJJTlwiLFxuICBcIkNBQkxFXCIsXG4gIFwiQ0FDQU9cIixcbiAgXCJDQUNIRVwiLFxuICBcIkNBQ1RJXCIsXG4gIFwiQ0FERFlcIixcbiAgXCJDQURFVFwiLFxuICBcIkNBREdFXCIsXG4gIFwiQ0FEUkVcIixcbiAgXCJDQUZFU1wiLFxuICBcIkNBR0VEXCIsXG4gIFwiQ0FHRVNcIixcbiAgXCJDQUdFWVwiLFxuICBcIkNBSVJOXCIsXG4gIFwiQ0FLRURcIixcbiAgXCJDQUtFU1wiLFxuICBcIkNBTElYXCIsXG4gIFwiQ0FMS1NcIixcbiAgXCJDQUxMQVwiLFxuICBcIkNBTExTXCIsXG4gIFwiQ0FMTVNcIixcbiAgXCJDQUxWRVwiLFxuICBcIkNBTFlYXCIsXG4gIFwiQ0FNRUxcIixcbiAgXCJDQU1FT1wiLFxuICBcIkNBTVBPXCIsXG4gIFwiQ0FNUFNcIixcbiAgXCJDQU1QWVwiLFxuICBcIkNBTkFMXCIsXG4gIFwiQ0FORFlcIixcbiAgXCJDQU5FRFwiLFxuICBcIkNBTkVTXCIsXG4gIFwiQ0FOTkFcIixcbiAgXCJDQU5OWVwiLFxuICBcIkNBTk9FXCIsXG4gIFwiQ0FOT05cIixcbiAgXCJDQU5TVFwiLFxuICBcIkNBTlRPXCIsXG4gIFwiQ0FOVFNcIixcbiAgXCJDQVBFRFwiLFxuICBcIkNBUEVSXCIsXG4gIFwiQ0FQRVNcIixcbiAgXCJDQVBPTlwiLFxuICBcIkNBUE9TXCIsXG4gIFwiQ0FSQVRcIixcbiAgXCJDQVJEU1wiLFxuICBcIkNBUkVEXCIsXG4gIFwiQ0FSRVJcIixcbiAgXCJDQVJFU1wiLFxuICBcIkNBUkVUXCIsXG4gIFwiQ0FSR09cIixcbiAgXCJDQVJOWVwiLFxuICBcIkNBUk9CXCIsXG4gIFwiQ0FST0xcIixcbiAgXCJDQVJPTVwiLFxuICBcIkNBUlBTXCIsXG4gIFwiQ0FSUllcIixcbiAgXCJDQVJURVwiLFxuICBcIkNBUlRTXCIsXG4gIFwiQ0FSVkVcIixcbiAgXCJDQVNBU1wiLFxuICBcIkNBU0VEXCIsXG4gIFwiQ0FTRVNcIixcbiAgXCJDQVNLU1wiLFxuICBcIkNBU1RFXCIsXG4gIFwiQ0FTVFNcIixcbiAgXCJDQVRDSFwiLFxuICBcIkNBVEVSXCIsXG4gIFwiQ0FUVFlcIixcbiAgXCJDQVVMS1wiLFxuICBcIkNBVUxTXCIsXG4gIFwiQ0FVU0VcIixcbiAgXCJDQVZFRFwiLFxuICBcIkNBVkVTXCIsXG4gIFwiQ0FWSUxcIixcbiAgXCJDQVdFRFwiLFxuICBcIkNFQVNFXCIsXG4gIFwiQ0VEQVJcIixcbiAgXCJDRURFRFwiLFxuICBcIkNFREVTXCIsXG4gIFwiQ0VJTFNcIixcbiAgXCJDRUxFQlwiLFxuICBcIkNFTExPXCIsXG4gIFwiQ0VMTFNcIixcbiAgXCJDRU5UT1wiLFxuICBcIkNFTlRTXCIsXG4gIFwiQ0hBRkVcIixcbiAgXCJDSEFGRlwiLFxuICBcIkNIQUlOXCIsXG4gIFwiQ0hBSVJcIixcbiAgXCJDSEFMS1wiLFxuICBcIkNIQU1QXCIsXG4gIFwiQ0hBTlRcIixcbiAgXCJDSEFPU1wiLFxuICBcIkNIQVBTXCIsXG4gIFwiQ0hBUkRcIixcbiAgXCJDSEFSTVwiLFxuICBcIkNIQVJTXCIsXG4gIFwiQ0hBUlRcIixcbiAgXCJDSEFSWVwiLFxuICBcIkNIQVNFXCIsXG4gIFwiQ0hBU01cIixcbiAgXCJDSEFUU1wiLFxuICBcIkNIQVdTXCIsXG4gIFwiQ0hFQVBcIixcbiAgXCJDSEVBVFwiLFxuICBcIkNIRUNLXCIsXG4gIFwiQ0hFRUtcIixcbiAgXCJDSEVFUFwiLFxuICBcIkNIRUVSXCIsXG4gIFwiQ0hFRlNcIixcbiAgXCJDSEVSVFwiLFxuICBcIkNIRVNTXCIsXG4gIFwiQ0hFU1RcIixcbiAgXCJDSEVXU1wiLFxuICBcIkNIRVdZXCIsXG4gIFwiQ0hJQ0tcIixcbiAgXCJDSElERVwiLFxuICBcIkNISUVGXCIsXG4gIFwiQ0hJTERcIixcbiAgXCJDSElMRVwiLFxuICBcIkNISUxJXCIsXG4gIFwiQ0hJTExcIixcbiAgXCJDSElNRVwiLFxuICBcIkNISU1QXCIsXG4gIFwiQ0hJTkFcIixcbiAgXCJDSElORVwiLFxuICBcIkNISU5LXCIsXG4gIFwiQ0hJTk9cIixcbiAgXCJDSElOU1wiLFxuICBcIkNISVBTXCIsXG4gIFwiQ0hJUlBcIixcbiAgXCJDSElUU1wiLFxuICBcIkNISVZFXCIsXG4gIFwiQ0hPQ0tcIixcbiAgXCJDSE9JUlwiLFxuICBcIkNIT0tFXCIsXG4gIFwiQ0hPTVBcIixcbiAgXCJDSE9QU1wiLFxuICBcIkNIT1JEXCIsXG4gIFwiQ0hPUkVcIixcbiAgXCJDSE9TRVwiLFxuICBcIkNIT1dTXCIsXG4gIFwiQ0hVQ0tcIixcbiAgXCJDSFVGRlwiLFxuICBcIkNIVUdTXCIsXG4gIFwiQ0hVTVBcIixcbiAgXCJDSFVNU1wiLFxuICBcIkNIVU5LXCIsXG4gIFwiQ0hVUkxcIixcbiAgXCJDSFVSTlwiLFxuICBcIkNIVVRFXCIsXG4gIFwiQ0lERVJcIixcbiAgXCJDSUdBUlwiLFxuICBcIkNJTElBXCIsXG4gIFwiQ0lMTFNcIixcbiAgXCJDSU5DSFwiLFxuICBcIkNJUkNBXCIsXG4gIFwiQ0lSUklcIixcbiAgXCJDSVRFRFwiLFxuICBcIkNJVEVTXCIsXG4gIFwiQ0lWRVRcIixcbiAgXCJDSVZJQ1wiLFxuICBcIkNJVklMXCIsXG4gIFwiQ0lWVllcIixcbiAgXCJDTEFDS1wiLFxuICBcIkNMQURTXCIsXG4gIFwiQ0xBSU1cIixcbiAgXCJDTEFNUFwiLFxuICBcIkNMQU1TXCIsXG4gIFwiQ0xBTkdcIixcbiAgXCJDTEFOS1wiLFxuICBcIkNMQU5TXCIsXG4gIFwiQ0xBUFNcIixcbiAgXCJDTEFTSFwiLFxuICBcIkNMQVNQXCIsXG4gIFwiQ0xBU1NcIixcbiAgXCJDTEFWRVwiLFxuICBcIkNMQVdTXCIsXG4gIFwiQ0xBWVNcIixcbiAgXCJDTEVBTlwiLFxuICBcIkNMRUFSXCIsXG4gIFwiQ0xFQVRcIixcbiAgXCJDTEVGU1wiLFxuICBcIkNMRUZUXCIsXG4gIFwiQ0xFUktcIixcbiAgXCJDTEVXU1wiLFxuICBcIkNMSUNLXCIsXG4gIFwiQ0xJRkZcIixcbiAgXCJDTElNQlwiLFxuICBcIkNMSU1FXCIsXG4gIFwiQ0xJTkdcIixcbiAgXCJDTElOS1wiLFxuICBcIkNMSVBTXCIsXG4gIFwiQ0xPQUtcIixcbiAgXCJDTE9DS1wiLFxuICBcIkNMT0RTXCIsXG4gIFwiQ0xPR1NcIixcbiAgXCJDTE9NUFwiLFxuICBcIkNMT05FXCIsXG4gIFwiQ0xPUFNcIixcbiAgXCJDTE9TRVwiLFxuICBcIkNMT1RIXCIsXG4gIFwiQ0xPVFNcIixcbiAgXCJDTE9VRFwiLFxuICBcIkNMT1VUXCIsXG4gIFwiQ0xPVkVcIixcbiAgXCJDTE9XTlwiLFxuICBcIkNMT1lTXCIsXG4gIFwiQ0xVQlNcIixcbiAgXCJDTFVDS1wiLFxuICBcIkNMVUVEXCIsXG4gIFwiQ0xVRVNcIixcbiAgXCJDTFVNUFwiLFxuICBcIkNMVU5HXCIsXG4gIFwiQ0xVTktcIixcbiAgXCJDT0FDSFwiLFxuICBcIkNPQUxTXCIsXG4gIFwiQ09BU1RcIixcbiAgXCJDT0FUSVwiLFxuICBcIkNPQVRTXCIsXG4gIFwiQ09CUkFcIixcbiAgXCJDT0NBU1wiLFxuICBcIkNPQ0NJXCIsXG4gIFwiQ09DS1NcIixcbiAgXCJDT0NLWVwiLFxuICBcIkNPQ09BXCIsXG4gIFwiQ09DT1NcIixcbiAgXCJDT0RBU1wiLFxuICBcIkNPREVEXCIsXG4gIFwiQ09ERVJcIixcbiAgXCJDT0RFU1wiLFxuICBcIkNPREVYXCIsXG4gIFwiQ09ET05cIixcbiAgXCJDT0VEU1wiLFxuICBcIkNPSE9TXCIsXG4gIFwiQ09JRlNcIixcbiAgXCJDT0lMU1wiLFxuICBcIkNPSU5TXCIsXG4gIFwiQ09LRURcIixcbiAgXCJDT0tFU1wiLFxuICBcIkNPTEFTXCIsXG4gIFwiQ09MRFNcIixcbiAgXCJDT0xJQ1wiLFxuICBcIkNPTE9OXCIsXG4gIFwiQ09MT1JcIixcbiAgXCJDT0xUU1wiLFxuICBcIkNPTUFTXCIsXG4gIFwiQ09NQk9cIixcbiAgXCJDT01CU1wiLFxuICBcIkNPTUVSXCIsXG4gIFwiQ09NRVNcIixcbiAgXCJDT01FVFwiLFxuICBcIkNPTUZZXCIsXG4gIFwiQ09NSUNcIixcbiAgXCJDT01NQVwiLFxuICBcIkNPTVBTXCIsXG4gIFwiQ09OQ0hcIixcbiAgXCJDT05ET1wiLFxuICBcIkNPTkVEXCIsXG4gIFwiQ09ORVNcIixcbiAgXCJDT05FWVwiLFxuICBcIkNPTkdBXCIsXG4gIFwiQ09OSUNcIixcbiAgXCJDT05LU1wiLFxuICBcIkNPT0NIXCIsXG4gIFwiQ09PRURcIixcbiAgXCJDT09LU1wiLFxuICBcIkNPT0xTXCIsXG4gIFwiQ09PTlNcIixcbiAgXCJDT09QU1wiLFxuICBcIkNPT1RTXCIsXG4gIFwiQ09QRURcIixcbiAgXCJDT1BFUlwiLFxuICBcIkNPUEVTXCIsXG4gIFwiQ09QUkFcIixcbiAgXCJDT1BTRVwiLFxuICBcIkNPUkFMXCIsXG4gIFwiQ09SRFNcIixcbiAgXCJDT1JFRFwiLFxuICBcIkNPUkVTXCIsXG4gIFwiQ09SR0lcIixcbiAgXCJDT1JLU1wiLFxuICBcIkNPUktZXCIsXG4gIFwiQ09STVNcIixcbiAgXCJDT1JOU1wiLFxuICBcIkNPUk5VXCIsXG4gIFwiQ09STllcIixcbiAgXCJDT1JQU1wiLFxuICBcIkNPU0VUXCIsXG4gIFwiQ09TVEFcIixcbiAgXCJDT1NUU1wiLFxuICBcIkNPVEVTXCIsXG4gIFwiQ09UVEFcIixcbiAgXCJDT1VDSFwiLFxuICBcIkNPVUdIXCIsXG4gIFwiQ09VTERcIixcbiAgXCJDT1VOVFwiLFxuICBcIkNPVVBFXCIsXG4gIFwiQ09VUFNcIixcbiAgXCJDT1VSVFwiLFxuICBcIkNPVVRIXCIsXG4gIFwiQ09WRU5cIixcbiAgXCJDT1ZFUlwiLFxuICBcIkNPVkVTXCIsXG4gIFwiQ09WRVRcIixcbiAgXCJDT1ZFWVwiLFxuICBcIkNPV0VEXCIsXG4gIFwiQ09XRVJcIixcbiAgXCJDT1dMU1wiLFxuICBcIkNPV1JZXCIsXG4gIFwiQ09YRURcIixcbiAgXCJDT1hFU1wiLFxuICBcIkNPWUVSXCIsXG4gIFwiQ09ZTFlcIixcbiAgXCJDT1lQVVwiLFxuICBcIkNPWkVOXCIsXG4gIFwiQ1JBQlNcIixcbiAgXCJDUkFDS1wiLFxuICBcIkNSQUZUXCIsXG4gIFwiQ1JBR1NcIixcbiAgXCJDUkFNUFwiLFxuICBcIkNSQU1TXCIsXG4gIFwiQ1JBTkVcIixcbiAgXCJDUkFOS1wiLFxuICBcIkNSQVBTXCIsXG4gIFwiQ1JBU0hcIixcbiAgXCJDUkFTU1wiLFxuICBcIkNSQVRFXCIsXG4gIFwiQ1JBVkVcIixcbiAgXCJDUkFXTFwiLFxuICBcIkNSQVdTXCIsXG4gIFwiQ1JBWkVcIixcbiAgXCJDUkFaWVwiLFxuICBcIkNSRUFLXCIsXG4gIFwiQ1JFQU1cIixcbiAgXCJDUkVET1wiLFxuICBcIkNSRUVEXCIsXG4gIFwiQ1JFRUtcIixcbiAgXCJDUkVFTFwiLFxuICBcIkNSRUVQXCIsXG4gIFwiQ1JFTUVcIixcbiAgXCJDUkVQRVwiLFxuICBcIkNSRVBUXCIsXG4gIFwiQ1JFU1NcIixcbiAgXCJDUkVTVFwiLFxuICBcIkNSRVdTXCIsXG4gIFwiQ1JJQlNcIixcbiAgXCJDUklDS1wiLFxuICBcIkNSSUVEXCIsXG4gIFwiQ1JJRVJcIixcbiAgXCJDUklFU1wiLFxuICBcIkNSSU1FXCIsXG4gIFwiQ1JJTVBcIixcbiAgXCJDUklTUFwiLFxuICBcIkNSSVRTXCIsXG4gIFwiQ1JPQUtcIixcbiAgXCJDUk9DS1wiLFxuICBcIkNST0NTXCIsXG4gIFwiQ1JPRlRcIixcbiAgXCJDUk9ORVwiLFxuICBcIkNST05ZXCIsXG4gIFwiQ1JPT0tcIixcbiAgXCJDUk9PTlwiLFxuICBcIkNST1BTXCIsXG4gIFwiQ1JPU1NcIixcbiAgXCJDUk9VUFwiLFxuICBcIkNST1dEXCIsXG4gIFwiQ1JPV05cIixcbiAgXCJDUk9XU1wiLFxuICBcIkNSVURFXCIsXG4gIFwiQ1JVRFNcIixcbiAgXCJDUlVFTFwiLFxuICBcIkNSVUVUXCIsXG4gIFwiQ1JVRlRcIixcbiAgXCJDUlVNQlwiLFxuICBcIkNSVU1QXCIsXG4gIFwiQ1JVU0VcIixcbiAgXCJDUlVTSFwiLFxuICBcIkNSVVNUXCIsXG4gIFwiQ1JZUFRcIixcbiAgXCJDVUJCWVwiLFxuICBcIkNVQkVEXCIsXG4gIFwiQ1VCRVNcIixcbiAgXCJDVUJJQ1wiLFxuICBcIkNVQklUXCIsXG4gIFwiQ1VGRlNcIixcbiAgXCJDVUtFU1wiLFxuICBcIkNVTExTXCIsXG4gIFwiQ1VMUEFcIixcbiAgXCJDVUxUU1wiLFxuICBcIkNVTUlOXCIsXG4gIFwiQ1VOVFNcIixcbiAgXCJDVVBQQVwiLFxuICBcIkNVUFBZXCIsXG4gIFwiQ1VSQlNcIixcbiAgXCJDVVJEU1wiLFxuICBcIkNVUkVEXCIsXG4gIFwiQ1VSRVNcIixcbiAgXCJDVVJJRVwiLFxuICBcIkNVUklPXCIsXG4gIFwiQ1VSTFNcIixcbiAgXCJDVVJMWVwiLFxuICBcIkNVUlJZXCIsXG4gIFwiQ1VSU0VcIixcbiAgXCJDVVJWRVwiLFxuICBcIkNVUlZZXCIsXG4gIFwiQ1VTSFlcIixcbiAgXCJDVVNQU1wiLFxuICBcIkNVVEVSXCIsXG4gIFwiQ1VUSUVcIixcbiAgXCJDVVRVUFwiLFxuICBcIkNZQ0FEXCIsXG4gIFwiQ1lDTEVcIixcbiAgXCJDWU5JQ1wiLFxuICBcIkNZU1RTXCIsXG4gIFwiQ1pBUlNcIixcbiAgXCJEQUNIQVwiLFxuICBcIkRBRERZXCIsXG4gIFwiREFET1NcIixcbiAgXCJEQUZGWVwiLFxuICBcIkRBSUxZXCIsXG4gIFwiREFJUllcIixcbiAgXCJEQUlTWVwiLFxuICBcIkRBTEVTXCIsXG4gIFwiREFMTFlcIixcbiAgXCJEQU1FU1wiLFxuICBcIkRBTU5TXCIsXG4gIFwiREFNUFNcIixcbiAgXCJEQU5DRVwiLFxuICBcIkRBTkRZXCIsXG4gIFwiREFSRURcIixcbiAgXCJEQVJFU1wiLFxuICBcIkRBUktTXCIsXG4gIFwiREFSS1lcIixcbiAgXCJEQVJOU1wiLFxuICBcIkRBUlRTXCIsXG4gIFwiREFURURcIixcbiAgXCJEQVRFUlwiLFxuICBcIkRBVEVTXCIsXG4gIFwiREFUVU1cIixcbiAgXCJEQVVCU1wiLFxuICBcIkRBVU5UXCIsXG4gIFwiREFWSVRcIixcbiAgXCJEQVdOU1wiLFxuICBcIkRBWkVEXCIsXG4gIFwiREFaRVNcIixcbiAgXCJERUFMU1wiLFxuICBcIkRFQUxUXCIsXG4gIFwiREVBTlNcIixcbiAgXCJERUFSU1wiLFxuICBcIkRFQVRIXCIsXG4gIFwiREVCQVJcIixcbiAgXCJERUJJVFwiLFxuICBcIkRFQlRTXCIsXG4gIFwiREVCVUdcIixcbiAgXCJERUJVVFwiLFxuICBcIkRFQ0FGXCIsXG4gIFwiREVDQUxcIixcbiAgXCJERUNBWVwiLFxuICBcIkRFQ0tTXCIsXG4gIFwiREVDT1JcIixcbiAgXCJERUNPWVwiLFxuICBcIkRFQ1JZXCIsXG4gIFwiREVFRFNcIixcbiAgXCJERUVNU1wiLFxuICBcIkRFRVBTXCIsXG4gIFwiREVGRVJcIixcbiAgXCJERUdBU1wiLFxuICBcIkRFSUZZXCIsXG4gIFwiREVJR05cIixcbiAgXCJERUlTTVwiLFxuICBcIkRFSVRZXCIsXG4gIFwiREVMQVlcIixcbiAgXCJERUxGVFwiLFxuICBcIkRFTElTXCIsXG4gIFwiREVMTFNcIixcbiAgXCJERUxUQVwiLFxuICBcIkRFTFZFXCIsXG4gIFwiREVNSVRcIixcbiAgXCJERU1PTlwiLFxuICBcIkRFTU9TXCIsXG4gIFwiREVNVVJcIixcbiAgXCJERU5JTVwiLFxuICBcIkRFTlNFXCIsXG4gIFwiREVOVFNcIixcbiAgXCJERVBPVFwiLFxuICBcIkRFUFRIXCIsXG4gIFwiREVSQllcIixcbiAgXCJERVNFWFwiLFxuICBcIkRFU0tTXCIsXG4gIFwiREVURVJcIixcbiAgXCJERVVDRVwiLFxuICBcIkRFVklMXCIsXG4gIFwiREVXRURcIixcbiAgXCJESE9XU1wiLFxuICBcIkRJQUxTXCIsXG4gIFwiRElBUllcIixcbiAgXCJESUFaT1wiLFxuICBcIkRJQ0VEXCIsXG4gIFwiRElDRVNcIixcbiAgXCJESUNFWVwiLFxuICBcIkRJQ0tTXCIsXG4gIFwiRElDS1lcIixcbiAgXCJESUNPVFwiLFxuICBcIkRJQ1RBXCIsXG4gIFwiRElERFlcIixcbiAgXCJESURPU1wiLFxuICBcIkRJRFNUXCIsXG4gIFwiRElFVFNcIixcbiAgXCJESUdJVFwiLFxuICBcIkRJS0VEXCIsXG4gIFwiRElLRVNcIixcbiAgXCJESUxET1wiLFxuICBcIkRJTExTXCIsXG4gIFwiRElMTFlcIixcbiAgXCJESU1FUlwiLFxuICBcIkRJTUVTXCIsXG4gIFwiRElNTFlcIixcbiAgXCJESU5BUlwiLFxuICBcIkRJTkVEXCIsXG4gIFwiRElORVJcIixcbiAgXCJESU5FU1wiLFxuICBcIkRJTkdPXCIsXG4gIFwiRElOR1NcIixcbiAgXCJESU5HWVwiLFxuICBcIkRJTktTXCIsXG4gIFwiRElOS1lcIixcbiAgXCJESU5UU1wiLFxuICBcIkRJT0RFXCIsXG4gIFwiRElQUFlcIixcbiAgXCJESVBTT1wiLFxuICBcIkRJUkVSXCIsXG4gIFwiRElSR0VcIixcbiAgXCJESVJLU1wiLFxuICBcIkRJUlRZXCIsXG4gIFwiRElTQ09cIixcbiAgXCJESVNDU1wiLFxuICBcIkRJU0hZXCIsXG4gIFwiRElTS1NcIixcbiAgXCJESVRDSFwiLFxuICBcIkRJVFRPXCIsXG4gIFwiRElUVFlcIixcbiAgXCJESVZBTlwiLFxuICBcIkRJVkFTXCIsXG4gIFwiRElWRURcIixcbiAgXCJESVZFUlwiLFxuICBcIkRJVkVTXCIsXG4gIFwiRElWT1RcIixcbiAgXCJESVZWWVwiLFxuICBcIkRJWlpZXCIsXG4gIFwiREpJTk5cIixcbiAgXCJET0NLU1wiLFxuICBcIkRPREdFXCIsXG4gIFwiRE9ER1lcIixcbiAgXCJET0RPU1wiLFxuICBcIkRPRVJTXCIsXG4gIFwiRE9FU1RcIixcbiAgXCJET0VUSFwiLFxuICBcIkRPRkZTXCIsXG4gIFwiRE9HRVNcIixcbiAgXCJET0dHT1wiLFxuICBcIkRPR0dZXCIsXG4gIFwiRE9HSUVcIixcbiAgXCJET0dNQVwiLFxuICBcIkRPSUxZXCIsXG4gIFwiRE9JTkdcIixcbiAgXCJET0xDRVwiLFxuICBcIkRPTEVEXCIsXG4gIFwiRE9MRVNcIixcbiAgXCJET0xMU1wiLFxuICBcIkRPTExZXCIsXG4gIFwiRE9MT1JcIixcbiAgXCJET0xUU1wiLFxuICBcIkRPTUVEXCIsXG4gIFwiRE9NRVNcIixcbiAgXCJET05FRVwiLFxuICBcIkRPTk5BXCIsXG4gIFwiRE9OT1JcIixcbiAgXCJET05VVFwiLFxuICBcIkRPT01TXCIsXG4gIFwiRE9PUlNcIixcbiAgXCJET09aWVwiLFxuICBcIkRPUEVEXCIsXG4gIFwiRE9QRVNcIixcbiAgXCJET1BFWVwiLFxuICBcIkRPUktTXCIsXG4gIFwiRE9SS1lcIixcbiAgXCJET1JNU1wiLFxuICBcIkRPVEVEXCIsXG4gIFwiRE9URVNcIixcbiAgXCJET1RUWVwiLFxuICBcIkRPVUJUXCIsXG4gIFwiRE9VR0hcIixcbiAgXCJET1VTRVwiLFxuICBcIkRPVkVTXCIsXG4gIFwiRE9XRFlcIixcbiAgXCJET1dFTFwiLFxuICBcIkRPV0VSXCIsXG4gIFwiRE9XTlNcIixcbiAgXCJET1dOWVwiLFxuICBcIkRPV1JZXCIsXG4gIFwiRE9XU0VcIixcbiAgXCJET1lFTlwiLFxuICBcIkRPWkVEXCIsXG4gIFwiRE9aRU5cIixcbiAgXCJET1pFUlwiLFxuICBcIkRPWkVTXCIsXG4gIFwiRFJBRlRcIixcbiAgXCJEUkFHU1wiLFxuICBcIkRSQUlOXCIsXG4gIFwiRFJBS0VcIixcbiAgXCJEUkFNQVwiLFxuICBcIkRSQU1TXCIsXG4gIFwiRFJBTktcIixcbiAgXCJEUkFQRVwiLFxuICBcIkRSQVdMXCIsXG4gIFwiRFJBV05cIixcbiAgXCJEUkFXU1wiLFxuICBcIkRSQVlTXCIsXG4gIFwiRFJFQURcIixcbiAgXCJEUkVBTVwiLFxuICBcIkRSRUFSXCIsXG4gIFwiRFJFQ0tcIixcbiAgXCJEUkVHU1wiLFxuICBcIkRSRVNTXCIsXG4gIFwiRFJJRURcIixcbiAgXCJEUklFUlwiLFxuICBcIkRSSUVTXCIsXG4gIFwiRFJJRlRcIixcbiAgXCJEUklMTFwiLFxuICBcIkRSSUxZXCIsXG4gIFwiRFJJTktcIixcbiAgXCJEUklQU1wiLFxuICBcIkRSSVZFXCIsXG4gIFwiRFJPSURcIixcbiAgXCJEUk9MTFwiLFxuICBcIkRST05FXCIsXG4gIFwiRFJPT0xcIixcbiAgXCJEUk9PUFwiLFxuICBcIkRST1BTXCIsXG4gIFwiRFJPU1NcIixcbiAgXCJEUk9WRVwiLFxuICBcIkRST1dOXCIsXG4gIFwiRFJVQlNcIixcbiAgXCJEUlVHU1wiLFxuICBcIkRSVUlEXCIsXG4gIFwiRFJVTVNcIixcbiAgXCJEUlVOS1wiLFxuICBcIkRSWUFEXCIsXG4gIFwiRFJZRVJcIixcbiAgXCJEUllMWVwiLFxuICBcIkRVQUxTXCIsXG4gIFwiRFVDQUxcIixcbiAgXCJEVUNBVFwiLFxuICBcIkRVQ0VTXCIsXG4gIFwiRFVDSFlcIixcbiAgXCJEVUNLU1wiLFxuICBcIkRVQ0tZXCIsXG4gIFwiRFVDVFNcIixcbiAgXCJEVURFU1wiLFxuICBcIkRVRUxTXCIsXG4gIFwiRFVFVFNcIixcbiAgXCJEVUZGU1wiLFxuICBcIkRVS0VTXCIsXG4gIFwiRFVMTFNcIixcbiAgXCJEVUxMWVwiLFxuICBcIkRVTFNFXCIsXG4gIFwiRFVNTVlcIixcbiAgXCJEVU1QU1wiLFxuICBcIkRVTVBZXCIsXG4gIFwiRFVOQ0VcIixcbiAgXCJEVU5FU1wiLFxuICBcIkRVTkdTXCIsXG4gIFwiRFVOTk9cIixcbiAgXCJEVU9NT1wiLFxuICBcIkRVUEVEXCIsXG4gIFwiRFVQRVJcIixcbiAgXCJEVVBFU1wiLFxuICBcIkRVUExFXCIsXG4gIFwiRFVSU1RcIixcbiAgXCJEVVNLU1wiLFxuICBcIkRVU0tZXCIsXG4gIFwiRFVTVFNcIixcbiAgXCJEVVNUWVwiLFxuICBcIkRVVENIXCIsXG4gIFwiRFVWRVRcIixcbiAgXCJEV0FSRlwiLFxuICBcIkRXRUVCXCIsXG4gIFwiRFdFTExcIixcbiAgXCJEV0VMVFwiLFxuICBcIkRZQURTXCIsXG4gIFwiRFlFUlNcIixcbiAgXCJEWUlOR1wiLFxuICBcIkRZS0VTXCIsXG4gIFwiRFlORVNcIixcbiAgXCJFQUdFUlwiLFxuICBcIkVBR0xFXCIsXG4gIFwiRUFSTFNcIixcbiAgXCJFQVJMWVwiLFxuICBcIkVBUk5TXCIsXG4gIFwiRUFSVEhcIixcbiAgXCJFQVNFRFwiLFxuICBcIkVBU0VMXCIsXG4gIFwiRUFTRVNcIixcbiAgXCJFQVRFTlwiLFxuICBcIkVBVEVSXCIsXG4gIFwiRUFWRVNcIixcbiAgXCJFQkJFRFwiLFxuICBcIkVCT05ZXCIsXG4gIFwiRUNMQVRcIixcbiAgXCJFREVNQVwiLFxuICBcIkVER0VEXCIsXG4gIFwiRURHRVNcIixcbiAgXCJFRElDVFwiLFxuICBcIkVESUZZXCIsXG4gIFwiRURJVFNcIixcbiAgXCJFRFVDRVwiLFxuICBcIkVFUklFXCIsXG4gIFwiRUdBRFNcIixcbiAgXCJFR0dFRFwiLFxuICBcIkVHR0VSXCIsXG4gIFwiRUdSRVRcIixcbiAgXCJFSURFUlwiLFxuICBcIkVJR0hUXCIsXG4gIFwiRUpFQ1RcIixcbiAgXCJFS0lOR1wiLFxuICBcIkVMQU5EXCIsXG4gIFwiRUxBVEVcIixcbiAgXCJFTEJPV1wiLFxuICBcIkVMREVSXCIsXG4gIFwiRUxFQ1RcIixcbiAgXCJFTEVHWVwiLFxuICBcIkVMRklOXCIsXG4gIFwiRUxJREVcIixcbiAgXCJFTElURVwiLFxuICBcIkVMT1BFXCIsXG4gIFwiRUxVREVcIixcbiAgXCJFTFZFU1wiLFxuICBcIkVNQUlMXCIsXG4gIFwiRU1CRURcIixcbiAgXCJFTUJFUlwiLFxuICBcIkVNQ0VFXCIsXG4gIFwiRU1FTkRcIixcbiAgXCJFTUVSWVwiLFxuICBcIkVNSVJTXCIsXG4gIFwiRU1JVFNcIixcbiAgXCJFTU9URVwiLFxuICBcIkVNUFRZXCIsXG4gIFwiRU5BQ1RcIixcbiAgXCJFTkRFRFwiLFxuICBcIkVORE9XXCIsXG4gIFwiRU5EVUVcIixcbiAgXCJFTkVNQVwiLFxuICBcIkVORU1ZXCIsXG4gIFwiRU5KT1lcIixcbiAgXCJFTk5VSVwiLFxuICBcIkVOUk9MXCIsXG4gIFwiRU5TVUVcIixcbiAgXCJFTlRFUlwiLFxuICBcIkVOVFJZXCIsXG4gIFwiRU5WT0lcIixcbiAgXCJFTlZPWVwiLFxuICBcIkVQQUNUXCIsXG4gIFwiRVBFRVNcIixcbiAgXCJFUEhBSFwiLFxuICBcIkVQSE9EXCIsXG4gIFwiRVBJQ1NcIixcbiAgXCJFUE9DSFwiLFxuICBcIkVQT1hZXCIsXG4gIFwiRVFVQUxcIixcbiAgXCJFUVVJUFwiLFxuICBcIkVSQVNFXCIsXG4gIFwiRVJFQ1RcIixcbiAgXCJFUk9ERVwiLFxuICBcIkVSUkVEXCIsXG4gIFwiRVJST1JcIixcbiAgXCJFUlVDVFwiLFxuICBcIkVSVVBUXCIsXG4gIFwiRVNTQVlcIixcbiAgXCJFU1NFU1wiLFxuICBcIkVTVEVSXCIsXG4gIFwiRVNUT1BcIixcbiAgXCJFVEhFUlwiLFxuICBcIkVUSElDXCIsXG4gIFwiRVRIT1NcIixcbiAgXCJFVEhZTFwiLFxuICBcIkVUVURFXCIsXG4gIFwiRVZBREVcIixcbiAgXCJFVkVOU1wiLFxuICBcIkVWRU5UXCIsXG4gIFwiRVZJQ1RcIixcbiAgXCJFVklMU1wiLFxuICBcIkVWT0tFXCIsXG4gIFwiRVhBQ1RcIixcbiAgXCJFWEFMVFwiLFxuICBcIkVYQU1TXCIsXG4gIFwiRVhDRUxcIixcbiAgXCJFWEVBVFwiLFxuICBcIkVYRUNTXCIsXG4gIFwiRVhFUlRcIixcbiAgXCJFWElMRVwiLFxuICBcIkVYSVNUXCIsXG4gIFwiRVhJVFNcIixcbiAgXCJFWFBBVFwiLFxuICBcIkVYUEVMXCIsXG4gIFwiRVhQT1NcIixcbiAgXCJFWFRPTFwiLFxuICBcIkVYVFJBXCIsXG4gIFwiRVhVREVcIixcbiAgXCJFWFVMVFwiLFxuICBcIkVYVVJCXCIsXG4gIFwiRVlJTkdcIixcbiAgXCJFWVJJRVwiLFxuICBcIkZBQkxFXCIsXG4gIFwiRkFDRURcIixcbiAgXCJGQUNFUlwiLFxuICBcIkZBQ0VTXCIsXG4gIFwiRkFDRVRcIixcbiAgXCJGQUNUU1wiLFxuICBcIkZBRERZXCIsXG4gIFwiRkFERURcIixcbiAgXCJGQURFUlwiLFxuICBcIkZBREVTXCIsXG4gIFwiRkFFUllcIixcbiAgXCJGQUdPVFwiLFxuICBcIkZBSUxTXCIsXG4gIFwiRkFJTlRcIixcbiAgXCJGQUlSU1wiLFxuICBcIkZBSVJZXCIsXG4gIFwiRkFJVEhcIixcbiAgXCJGQUtFRFwiLFxuICBcIkZBS0VSXCIsXG4gIFwiRkFLRVNcIixcbiAgXCJGQUtJUlwiLFxuICBcIkZBTExTXCIsXG4gIFwiRkFMU0VcIixcbiAgXCJGQU1FRFwiLFxuICBcIkZBTkNZXCIsXG4gIFwiRkFOR1NcIixcbiAgXCJGQU5OWVwiLFxuICBcIkZBUkFEXCIsXG4gIFwiRkFSQ0VcIixcbiAgXCJGQVJFRFwiLFxuICBcIkZBUkVTXCIsXG4gIFwiRkFSTVNcIixcbiAgXCJGQVJUU1wiLFxuICBcIkZBU1RTXCIsXG4gIFwiRkFUQUxcIixcbiAgXCJGQVRFRFwiLFxuICBcIkZBVEVTXCIsXG4gIFwiRkFUU09cIixcbiAgXCJGQVRUWVwiLFxuICBcIkZBVFdBXCIsXG4gIFwiRkFVTFRcIixcbiAgXCJGQVVOQVwiLFxuICBcIkZBVU5TXCIsXG4gIFwiRkFWT1JcIixcbiAgXCJGQVdOU1wiLFxuICBcIkZBWEVEXCIsXG4gIFwiRkFYRVNcIixcbiAgXCJGQVpFRFwiLFxuICBcIkZBWkVTXCIsXG4gIFwiRkVBUlNcIixcbiAgXCJGRUFTVFwiLFxuICBcIkZFQVRTXCIsXG4gIFwiRkVDQUxcIixcbiAgXCJGRUNFU1wiLFxuICBcIkZFRURTXCIsXG4gIFwiRkVFTFNcIixcbiAgXCJGRUlHTlwiLFxuICBcIkZFSU5UXCIsXG4gIFwiRkVMTEFcIixcbiAgXCJGRUxMU1wiLFxuICBcIkZFTE9OXCIsXG4gIFwiRkVMVFNcIixcbiAgXCJGRU1NRVwiLFxuICBcIkZFTVVSXCIsXG4gIFwiRkVOQ0VcIixcbiAgXCJGRU5EU1wiLFxuICBcIkZFUkFMXCIsXG4gIFwiRkVSTUlcIixcbiAgXCJGRVJOU1wiLFxuICBcIkZFUlJZXCIsXG4gIFwiRkVUQUxcIixcbiAgXCJGRVRDSFwiLFxuICBcIkZFVEVEXCIsXG4gIFwiRkVURVNcIixcbiAgXCJGRVRJRFwiLFxuICBcIkZFVE9SXCIsXG4gIFwiRkVUVVNcIixcbiAgXCJGRVVEU1wiLFxuICBcIkZFVUVEXCIsXG4gIFwiRkVWRVJcIixcbiAgXCJGSUFUU1wiLFxuICBcIkZJQkVSXCIsXG4gIFwiRklCUkVcIixcbiAgXCJGSUNIRVwiLFxuICBcIkZJQ0hVXCIsXG4gIFwiRklFRlNcIixcbiAgXCJGSUVMRFwiLFxuICBcIkZJRU5EXCIsXG4gIFwiRklFUllcIixcbiAgXCJGSUZFU1wiLFxuICBcIkZJRlRIXCIsXG4gIFwiRklGVFlcIixcbiAgXCJGSUdIVFwiLFxuICBcIkZJTENIXCIsXG4gIFwiRklMRURcIixcbiAgXCJGSUxFU1wiLFxuICBcIkZJTEVUXCIsXG4gIFwiRklMTFNcIixcbiAgXCJGSUxMWVwiLFxuICBcIkZJTE1TXCIsXG4gIFwiRklMTVlcIixcbiAgXCJGSUxUSFwiLFxuICBcIkZJTkFMXCIsXG4gIFwiRklOQ0hcIixcbiAgXCJGSU5EU1wiLFxuICBcIkZJTkVEXCIsXG4gIFwiRklORVJcIixcbiAgXCJGSU5FU1wiLFxuICBcIkZJTklTXCIsXG4gIFwiRklOS1NcIixcbiAgXCJGSU5OWVwiLFxuICBcIkZJT1JEXCIsXG4gIFwiRklSRURcIixcbiAgXCJGSVJFU1wiLFxuICBcIkZJUk1TXCIsXG4gIFwiRklSU1RcIixcbiAgXCJGSVJUSFwiLFxuICBcIkZJU0hZXCIsXG4gIFwiRklTVFNcIixcbiAgXCJGSVZFUlwiLFxuICBcIkZJVkVTXCIsXG4gIFwiRklYRURcIixcbiAgXCJGSVhFUlwiLFxuICBcIkZJWEVTXCIsXG4gIFwiRklaWllcIixcbiAgXCJGSk9SRFwiLFxuICBcIkZMQUNLXCIsXG4gIFwiRkxBR1NcIixcbiAgXCJGTEFJTFwiLFxuICBcIkZMQUlSXCIsXG4gIFwiRkxBS0VcIixcbiAgXCJGTEFLWVwiLFxuICBcIkZMQU1FXCIsXG4gIFwiRkxBTVNcIixcbiAgXCJGTEFOS1wiLFxuICBcIkZMQVJFXCIsXG4gIFwiRkxBU0hcIixcbiAgXCJGTEFTS1wiLFxuICBcIkZMQVRTXCIsXG4gIFwiRkxBV1NcIixcbiAgXCJGTEFZU1wiLFxuICBcIkZMRUFTXCIsXG4gIFwiRkxFQ0tcIixcbiAgXCJGTEVFU1wiLFxuICBcIkZMRUVUXCIsXG4gIFwiRkxFU0hcIixcbiAgXCJGTElDS1wiLFxuICBcIkZMSUNTXCIsXG4gIFwiRkxJRURcIixcbiAgXCJGTElFUlwiLFxuICBcIkZMSUVTXCIsXG4gIFwiRkxJTkdcIixcbiAgXCJGTElOVFwiLFxuICBcIkZMSVBTXCIsXG4gIFwiRkxJUlRcIixcbiAgXCJGTElUU1wiLFxuICBcIkZMT0FUXCIsXG4gIFwiRkxPQ0tcIixcbiAgXCJGTE9FU1wiLFxuICBcIkZMT0dTXCIsXG4gIFwiRkxPT0RcIixcbiAgXCJGTE9PUlwiLFxuICBcIkZMT1BTXCIsXG4gIFwiRkxPUkFcIixcbiAgXCJGTE9TU1wiLFxuICBcIkZMT1VSXCIsXG4gIFwiRkxPVVRcIixcbiAgXCJGTE9XTlwiLFxuICBcIkZMT1dTXCIsXG4gIFwiRkxVQlNcIixcbiAgXCJGTFVFU1wiLFxuICBcIkZMVUZGXCIsXG4gIFwiRkxVSURcIixcbiAgXCJGTFVLRVwiLFxuICBcIkZMVUtZXCIsXG4gIFwiRkxVTUVcIixcbiAgXCJGTFVOR1wiLFxuICBcIkZMVU5LXCIsXG4gIFwiRkxVU0hcIixcbiAgXCJGTFVURVwiLFxuICBcIkZMWUJZXCIsXG4gIFwiRkxZRVJcIixcbiAgXCJGT0FMU1wiLFxuICBcIkZPQU1TXCIsXG4gIFwiRk9BTVlcIixcbiAgXCJGT0NBTFwiLFxuICBcIkZPQ1VTXCIsXG4gIFwiRk9HRVlcIixcbiAgXCJGT0dHWVwiLFxuICBcIkZPSUxTXCIsXG4gIFwiRk9JU1RcIixcbiAgXCJGT0xEU1wiLFxuICBcIkZPTElBXCIsXG4gIFwiRk9MSU9cIixcbiAgXCJGT0xLU1wiLFxuICBcIkZPTEtZXCIsXG4gIFwiRk9MTFlcIixcbiAgXCJGT05EVVwiLFxuICBcIkZPTlRTXCIsXG4gIFwiRk9PRFNcIixcbiAgXCJGT09MU1wiLFxuICBcIkZPT1RTXCIsXG4gIFwiRk9SQVlcIixcbiAgXCJGT1JDRVwiLFxuICBcIkZPUkRTXCIsXG4gIFwiRk9SR0VcIixcbiAgXCJGT1JHT1wiLFxuICBcIkZPUktTXCIsXG4gIFwiRk9STVNcIixcbiAgXCJGT1JURVwiLFxuICBcIkZPUlRIXCIsXG4gIFwiRk9SVFNcIixcbiAgXCJGT1JUWVwiLFxuICBcIkZPUlVNXCIsXG4gIFwiRk9TU0FcIixcbiAgXCJGT1NTRVwiLFxuICBcIkZPVUxTXCIsXG4gIFwiRk9VTkRcIixcbiAgXCJGT1VOVFwiLFxuICBcIkZPVVJTXCIsXG4gIFwiRk9WRUFcIixcbiAgXCJGT1dMU1wiLFxuICBcIkZPWEVEXCIsXG4gIFwiRk9YRVNcIixcbiAgXCJGT1lFUlwiLFxuICBcIkZSQUlMXCIsXG4gIFwiRlJBTUVcIixcbiAgXCJGUkFOQ1wiLFxuICBcIkZSQU5LXCIsXG4gIFwiRlJBVFNcIixcbiAgXCJGUkFVRFwiLFxuICBcIkZSQVlTXCIsXG4gIFwiRlJFQUtcIixcbiAgXCJGUkVFRFwiLFxuICBcIkZSRUVSXCIsXG4gIFwiRlJFRVNcIixcbiAgXCJGUkVTSFwiLFxuICBcIkZSRVRTXCIsXG4gIFwiRlJJQVJcIixcbiAgXCJGUklFRFwiLFxuICBcIkZSSUVSXCIsXG4gIFwiRlJJRVNcIixcbiAgXCJGUklHU1wiLFxuICBcIkZSSUxMXCIsXG4gIFwiRlJJU0tcIixcbiAgXCJGUklaWlwiLFxuICBcIkZST0NLXCIsXG4gIFwiRlJPR1NcIixcbiAgXCJGUk9ORFwiLFxuICBcIkZST05UXCIsXG4gIFwiRlJPU0hcIixcbiAgXCJGUk9TVFwiLFxuICBcIkZST1RIXCIsXG4gIFwiRlJPV05cIixcbiAgXCJGUk9aRVwiLFxuICBcIkZSVUlUXCIsXG4gIFwiRlJVTVBcIixcbiAgXCJGUllFUlwiLFxuICBcIkZVQ0tTXCIsXG4gIFwiRlVER0VcIixcbiAgXCJGVUVMU1wiLFxuICBcIkZVR0FMXCIsXG4gIFwiRlVHVUVcIixcbiAgXCJGVUxMU1wiLFxuICBcIkZVTExZXCIsXG4gIFwiRlVNRURcIixcbiAgXCJGVU1FU1wiLFxuICBcIkZVTkRTXCIsXG4gIFwiRlVOR0lcIixcbiAgXCJGVU5HT1wiLFxuICBcIkZVTktTXCIsXG4gIFwiRlVOS1lcIixcbiAgXCJGVU5OWVwiLFxuICBcIkZVUkxTXCIsXG4gIFwiRlVST1JcIixcbiAgXCJGVVJSWVwiLFxuICBcIkZVUlpFXCIsXG4gIFwiRlVTRURcIixcbiAgXCJGVVNFRVwiLFxuICBcIkZVU0VTXCIsXG4gIFwiRlVTU1lcIixcbiAgXCJGVVNUWVwiLFxuICBcIkZVVE9OXCIsXG4gIFwiRlVaRURcIixcbiAgXCJGVVpFU1wiLFxuICBcIkZVWlpZXCIsXG4gIFwiR0FCQllcIixcbiAgXCJHQUJMRVwiLFxuICBcIkdBRkZFXCIsXG4gIFwiR0FGRlNcIixcbiAgXCJHQUdFU1wiLFxuICBcIkdBSUxZXCIsXG4gIFwiR0FJTlNcIixcbiAgXCJHQUlUU1wiLFxuICBcIkdBTEFTXCIsXG4gIFwiR0FMRVNcIixcbiAgXCJHQUxMU1wiLFxuICBcIkdBTUJBXCIsXG4gIFwiR0FNRURcIixcbiAgXCJHQU1FUlwiLFxuICBcIkdBTUVTXCIsXG4gIFwiR0FNRVlcIixcbiAgXCJHQU1JTlwiLFxuICBcIkdBTU1BXCIsXG4gIFwiR0FNVVRcIixcbiAgXCJHQU5FRlwiLFxuICBcIkdBTkdTXCIsXG4gIFwiR0FPTFNcIixcbiAgXCJHQVBFRFwiLFxuICBcIkdBUEVSXCIsXG4gIFwiR0FQRVNcIixcbiAgXCJHQVJCU1wiLFxuICBcIkdBU0VTXCIsXG4gIFwiR0FTUFNcIixcbiAgXCJHQVNTWVwiLFxuICBcIkdBVEVEXCIsXG4gIFwiR0FURVNcIixcbiAgXCJHQVRPUlwiLFxuICBcIkdBVURZXCIsXG4gIFwiR0FVR0VcIixcbiAgXCJHQVVOVFwiLFxuICBcIkdBVVNTXCIsXG4gIFwiR0FVWkVcIixcbiAgXCJHQVVaWVwiLFxuICBcIkdBVkVMXCIsXG4gIFwiR0FXS1NcIixcbiAgXCJHQVdLWVwiLFxuICBcIkdBWUVSXCIsXG4gIFwiR0FaRURcIixcbiAgXCJHQVpFU1wiLFxuICBcIkdFQVJTXCIsXG4gIFwiR0VDS09cIixcbiAgXCJHRUVLU1wiLFxuICBcIkdFRVNFXCIsXG4gIFwiR0VMRFNcIixcbiAgXCJHRU5FU1wiLFxuICBcIkdFTkVUXCIsXG4gIFwiR0VOSUVcIixcbiAgXCJHRU5JSVwiLFxuICBcIkdFTlJFXCIsXG4gIFwiR0VOVFNcIixcbiAgXCJHRU5VU1wiLFxuICBcIkdFT0RFXCIsXG4gIFwiR0VPSURcIixcbiAgXCJHRVJNU1wiLFxuICBcIkdFU1NPXCIsXG4gIFwiR0VUVVBcIixcbiAgXCJHSE9TVFwiLFxuICBcIkdIT1VMXCIsXG4gIFwiR0lBTlRcIixcbiAgXCJHSUJFRFwiLFxuICBcIkdJQkVTXCIsXG4gIFwiR0lERFlcIixcbiAgXCJHSUZUU1wiLFxuICBcIkdJR1VFXCIsXG4gIFwiR0lMRFNcIixcbiAgXCJHSUxMU1wiLFxuICBcIkdJTFRTXCIsXG4gIFwiR0lNTUVcIixcbiAgXCJHSU1QU1wiLFxuICBcIkdJUFNZXCIsXG4gIFwiR0lSRFNcIixcbiAgXCJHSVJMU1wiLFxuICBcIkdJUkxZXCIsXG4gIFwiR0lST1NcIixcbiAgXCJHSVJUSFwiLFxuICBcIkdJUlRTXCIsXG4gIFwiR0lTTU9cIixcbiAgXCJHSVNUU1wiLFxuICBcIkdJVkVOXCIsXG4gIFwiR0lWRVJcIixcbiAgXCJHSVZFU1wiLFxuICBcIkdJWk1PXCIsXG4gIFwiR0xBREVcIixcbiAgXCJHTEFEU1wiLFxuICBcIkdMQU5EXCIsXG4gIFwiR0xBTlNcIixcbiAgXCJHTEFSRVwiLFxuICBcIkdMQVNTXCIsXG4gIFwiR0xBWkVcIixcbiAgXCJHTEVBTVwiLFxuICBcIkdMRUFOXCIsXG4gIFwiR0xFQkVcIixcbiAgXCJHTEVFU1wiLFxuICBcIkdMRU5TXCIsXG4gIFwiR0xJREVcIixcbiAgXCJHTElOVFwiLFxuICBcIkdMSVRaXCIsXG4gIFwiR0xPQVRcIixcbiAgXCJHTE9CRVwiLFxuICBcIkdMT0JTXCIsXG4gIFwiR0xPTVNcIixcbiAgXCJHTE9PTVwiLFxuICBcIkdMT1JZXCIsXG4gIFwiR0xPU1NcIixcbiAgXCJHTE9WRVwiLFxuICBcIkdMT1dTXCIsXG4gIFwiR0xVRURcIixcbiAgXCJHTFVFU1wiLFxuICBcIkdMVUVZXCIsXG4gIFwiR0xVT05cIixcbiAgXCJHTFVUU1wiLFxuICBcIkdMWVBIXCIsXG4gIFwiR05BUkxcIixcbiAgXCJHTkFTSFwiLFxuICBcIkdOQVRTXCIsXG4gIFwiR05BV1NcIixcbiAgXCJHTk9NRVwiLFxuICBcIkdPQURTXCIsXG4gIFwiR09BTFNcIixcbiAgXCJHT0FUU1wiLFxuICBcIkdPRExZXCIsXG4gIFwiR09FUlNcIixcbiAgXCJHT0VTVFwiLFxuICBcIkdPRVRIXCIsXG4gIFwiR09GRVJcIixcbiAgXCJHT0lOR1wiLFxuICBcIkdPTERTXCIsXG4gIFwiR09MRU1cIixcbiAgXCJHT0xGU1wiLFxuICBcIkdPTExZXCIsXG4gIFwiR09OQURcIixcbiAgXCJHT05FUlwiLFxuICBcIkdPTkdTXCIsXG4gIFwiR09OWk9cIixcbiAgXCJHT09EU1wiLFxuICBcIkdPT0RZXCIsXG4gIFwiR09PRVlcIixcbiAgXCJHT09GU1wiLFxuICBcIkdPT0ZZXCIsXG4gIFwiR09PS1NcIixcbiAgXCJHT09OU1wiLFxuICBcIkdPT1NFXCIsXG4gIFwiR09PU1lcIixcbiAgXCJHT1JFRFwiLFxuICBcIkdPUkVTXCIsXG4gIFwiR09SU0VcIixcbiAgXCJHT1RIU1wiLFxuICBcIkdPVURBXCIsXG4gIFwiR09VR0VcIixcbiAgXCJHT1VSRFwiLFxuICBcIkdPVVRTXCIsXG4gIFwiR09VVFlcIixcbiAgXCJHT1dOU1wiLFxuICBcIkdPWUlNXCIsXG4gIFwiR1JBQlNcIixcbiAgXCJHUkFDRVwiLFxuICBcIkdSQURFXCIsXG4gIFwiR1JBRFNcIixcbiAgXCJHUkFGVFwiLFxuICBcIkdSQUlMXCIsXG4gIFwiR1JBSU5cIixcbiAgXCJHUkFNU1wiLFxuICBcIkdSQU5EXCIsXG4gIFwiR1JBTlRcIixcbiAgXCJHUkFQRVwiLFxuICBcIkdSQVBIXCIsXG4gIFwiR1JBU1BcIixcbiAgXCJHUkFTU1wiLFxuICBcIkdSQVRFXCIsXG4gIFwiR1JBVkVcIixcbiAgXCJHUkFWWVwiLFxuICBcIkdSQVlTXCIsXG4gIFwiR1JBWkVcIixcbiAgXCJHUkVBVFwiLFxuICBcIkdSRUJFXCIsXG4gIFwiR1JFRURcIixcbiAgXCJHUkVFS1wiLFxuICBcIkdSRUVOXCIsXG4gIFwiR1JFRVRcIixcbiAgXCJHUkVZU1wiLFxuICBcIkdSSURTXCIsXG4gIFwiR1JJRUZcIixcbiAgXCJHUklGVFwiLFxuICBcIkdSSUxMXCIsXG4gIFwiR1JJTUVcIixcbiAgXCJHUklNWVwiLFxuICBcIkdSSU5EXCIsXG4gIFwiR1JJTlNcIixcbiAgXCJHUklQRVwiLFxuICBcIkdSSVBTXCIsXG4gIFwiR1JJU1RcIixcbiAgXCJHUklUU1wiLFxuICBcIkdST0FOXCIsXG4gIFwiR1JPQVRcIixcbiAgXCJHUk9EWVwiLFxuICBcIkdST0dTXCIsXG4gIFwiR1JPSU5cIixcbiAgXCJHUk9LU1wiLFxuICBcIkdST09NXCIsXG4gIFwiR1JPUEVcIixcbiAgXCJHUk9TU1wiLFxuICBcIkdST1VQXCIsXG4gIFwiR1JPVVRcIixcbiAgXCJHUk9WRVwiLFxuICBcIkdST1dMXCIsXG4gIFwiR1JPV05cIixcbiAgXCJHUk9XU1wiLFxuICBcIkdSVUJTXCIsXG4gIFwiR1JVRUxcIixcbiAgXCJHUlVGRlwiLFxuICBcIkdSVU1QXCIsXG4gIFwiR1JVTlRcIixcbiAgXCJHVUFOT1wiLFxuICBcIkdVQVJEXCIsXG4gIFwiR1VBVkFcIixcbiAgXCJHVUVTU1wiLFxuICBcIkdVRVNUXCIsXG4gIFwiR1VJREVcIixcbiAgXCJHVUlMRFwiLFxuICBcIkdVSUxFXCIsXG4gIFwiR1VJTFRcIixcbiAgXCJHVUlTRVwiLFxuICBcIkdVTEFHXCIsXG4gIFwiR1VMQ0hcIixcbiAgXCJHVUxFU1wiLFxuICBcIkdVTEZTXCIsXG4gIFwiR1VMTFNcIixcbiAgXCJHVUxMWVwiLFxuICBcIkdVTFBTXCIsXG4gIFwiR1VNQk9cIixcbiAgXCJHVU1NWVwiLFxuICBcIkdVTktZXCIsXG4gIFwiR1VOTllcIixcbiAgXCJHVVBQWVwiLFxuICBcIkdVUlVTXCIsXG4gIFwiR1VTSFlcIixcbiAgXCJHVVNUT1wiLFxuICBcIkdVU1RTXCIsXG4gIFwiR1VTVFlcIixcbiAgXCJHVVRTWVwiLFxuICBcIkdVVFRZXCIsXG4gIFwiR1VZRURcIixcbiAgXCJHWVBTWVwiLFxuICBcIkdZUk9TXCIsXG4gIFwiR1lWRVNcIixcbiAgXCJIQUJJVFwiLFxuICBcIkhBQ0tTXCIsXG4gIFwiSEFERVNcIixcbiAgXCJIQURTVFwiLFxuICBcIkhBRlRTXCIsXG4gIFwiSEFJS1VcIixcbiAgXCJIQUlMU1wiLFxuICBcIkhBSVJTXCIsXG4gIFwiSEFJUllcIixcbiAgXCJIQUxFRFwiLFxuICBcIkhBTEVSXCIsXG4gIFwiSEFMRVNcIixcbiAgXCJIQUxMT1wiLFxuICBcIkhBTExTXCIsXG4gIFwiSEFMTUFcIixcbiAgXCJIQUxPU1wiLFxuICBcIkhBTFRTXCIsXG4gIFwiSEFMVkVcIixcbiAgXCJIQU1FU1wiLFxuICBcIkhBTU1ZXCIsXG4gIFwiSEFNWkFcIixcbiAgXCJIQU5EU1wiLFxuICBcIkhBTkRZXCIsXG4gIFwiSEFOR1NcIixcbiAgXCJIQU5LU1wiLFxuICBcIkhBTktZXCIsXG4gIFwiSEFQTFlcIixcbiAgXCJIQVBQWVwiLFxuICBcIkhBUkRZXCIsXG4gIFwiSEFSRU1cIixcbiAgXCJIQVJFU1wiLFxuICBcIkhBUktTXCIsXG4gIFwiSEFSTVNcIixcbiAgXCJIQVJQU1wiLFxuICBcIkhBUlBZXCIsXG4gIFwiSEFSUllcIixcbiAgXCJIQVJTSFwiLFxuICBcIkhBUlRTXCIsXG4gIFwiSEFTUFNcIixcbiAgXCJIQVNURVwiLFxuICBcIkhBU1RZXCIsXG4gIFwiSEFUQ0hcIixcbiAgXCJIQVRFRFwiLFxuICBcIkhBVEVSXCIsXG4gIFwiSEFURVNcIixcbiAgXCJIQVVMU1wiLFxuICBcIkhBVU5UXCIsXG4gIFwiSEFWRU5cIixcbiAgXCJIQVZFU1wiLFxuICBcIkhBVk9DXCIsXG4gIFwiSEFXS1NcIixcbiAgXCJIQVpFRFwiLFxuICBcIkhBWkVMXCIsXG4gIFwiSEFaRVJcIixcbiAgXCJIQVpFU1wiLFxuICBcIkhFQURTXCIsXG4gIFwiSEVBRFlcIixcbiAgXCJIRUFMU1wiLFxuICBcIkhFQVBTXCIsXG4gIFwiSEVBUkRcIixcbiAgXCJIRUFSU1wiLFxuICBcIkhFQVJUXCIsXG4gIFwiSEVBVEhcIixcbiAgXCJIRUFUU1wiLFxuICBcIkhFQVZFXCIsXG4gIFwiSEVBVllcIixcbiAgXCJIRURHRVwiLFxuICBcIkhFRURTXCIsXG4gIFwiSEVFTFNcIixcbiAgXCJIRUZUU1wiLFxuICBcIkhFRlRZXCIsXG4gIFwiSEVJR0hcIixcbiAgXCJIRUlSU1wiLFxuICBcIkhFSVNUXCIsXG4gIFwiSEVMSVhcIixcbiAgXCJIRUxMT1wiLFxuICBcIkhFTE1TXCIsXG4gIFwiSEVMUFNcIixcbiAgXCJIRU5DRVwiLFxuICBcIkhFTkdFXCIsXG4gIFwiSEVOTkFcIixcbiAgXCJIRU5SWVwiLFxuICBcIkhFUkJTXCIsXG4gIFwiSEVSQllcIixcbiAgXCJIRVJEU1wiLFxuICBcIkhFUk9OXCIsXG4gIFwiSEVSVFpcIixcbiAgXCJIRVdFRFwiLFxuICBcIkhFV0VSXCIsXG4gIFwiSEVYQURcIixcbiAgXCJIRVhFRFwiLFxuICBcIkhFWEVTXCIsXG4gIFwiSElDS1NcIixcbiAgXCJISURFU1wiLFxuICBcIkhJR0hTXCIsXG4gIFwiSElLRURcIixcbiAgXCJISUtFUlwiLFxuICBcIkhJS0VTXCIsXG4gIFwiSElMQVJcIixcbiAgXCJISUxMU1wiLFxuICBcIkhJTExZXCIsXG4gIFwiSElMVFNcIixcbiAgXCJISUxVTVwiLFxuICBcIkhJTUJPXCIsXG4gIFwiSElORFNcIixcbiAgXCJISU5HRVwiLFxuICBcIkhJTlRTXCIsXG4gIFwiSElQUE9cIixcbiAgXCJISVBQWVwiLFxuICBcIkhJUkVEXCIsXG4gIFwiSElSRVNcIixcbiAgXCJISVRDSFwiLFxuICBcIkhJVkVEXCIsXG4gIFwiSElWRVNcIixcbiAgXCJIT0FHWVwiLFxuICBcIkhPQVJEXCIsXG4gIFwiSE9BUllcIixcbiAgXCJIT0JCWVwiLFxuICBcIkhPQk9TXCIsXG4gIFwiSE9DS1NcIixcbiAgXCJIT0NVU1wiLFxuICBcIkhPR0FOXCIsXG4gIFwiSE9JU1RcIixcbiAgXCJIT0tFWVwiLFxuICBcIkhPS1VNXCIsXG4gIFwiSE9MRFNcIixcbiAgXCJIT0xFRFwiLFxuICBcIkhPTEVTXCIsXG4gIFwiSE9MTFlcIixcbiAgXCJIT01FRFwiLFxuICBcIkhPTUVSXCIsXG4gIFwiSE9NRVNcIixcbiAgXCJIT01FWVwiLFxuICBcIkhPTU9TXCIsXG4gIFwiSE9ORURcIixcbiAgXCJIT05FU1wiLFxuICBcIkhPTkVZXCIsXG4gIFwiSE9OS1NcIixcbiAgXCJIT05LWVwiLFxuICBcIkhPTk9SXCIsXG4gIFwiSE9PQ0hcIixcbiAgXCJIT09EU1wiLFxuICBcIkhPT0VZXCIsXG4gIFwiSE9PRlNcIixcbiAgXCJIT09LU1wiLFxuICBcIkhPT0tZXCIsXG4gIFwiSE9PUFNcIixcbiAgXCJIT09UU1wiLFxuICBcIkhPUEVEXCIsXG4gIFwiSE9QRVNcIixcbiAgXCJIT1JERVwiLFxuICBcIkhPUk5TXCIsXG4gIFwiSE9STllcIixcbiAgXCJIT1JTRVwiLFxuICBcIkhPUlNZXCIsXG4gIFwiSE9TRURcIixcbiAgXCJIT1NFU1wiLFxuICBcIkhPU1RTXCIsXG4gIFwiSE9URUxcIixcbiAgXCJIT1RMWVwiLFxuICBcIkhPVU5EXCIsXG4gIFwiSE9VUklcIixcbiAgXCJIT1VSU1wiLFxuICBcIkhPVVNFXCIsXG4gIFwiSE9WRUxcIixcbiAgXCJIT1ZFUlwiLFxuICBcIkhPV0RZXCIsXG4gIFwiSE9XTFNcIixcbiAgXCJIVUJCWVwiLFxuICBcIkhVRkZTXCIsXG4gIFwiSFVGRllcIixcbiAgXCJIVUdFUlwiLFxuICBcIkhVTEFTXCIsXG4gIFwiSFVMS1NcIixcbiAgXCJIVUxMT1wiLFxuICBcIkhVTExTXCIsXG4gIFwiSFVNQU5cIixcbiAgXCJIVU1JRFwiLFxuICBcIkhVTU9SXCIsXG4gIFwiSFVNUEhcIixcbiAgXCJIVU1QU1wiLFxuICBcIkhVTVBZXCIsXG4gIFwiSFVNVVNcIixcbiAgXCJIVU5DSFwiLFxuICBcIkhVTktTXCIsXG4gIFwiSFVOS1lcIixcbiAgXCJIVU5UU1wiLFxuICBcIkhVUkxTXCIsXG4gIFwiSFVSUllcIixcbiAgXCJIVVJUU1wiLFxuICBcIkhVU0tTXCIsXG4gIFwiSFVTS1lcIixcbiAgXCJIVVNTWVwiLFxuICBcIkhVVENIXCIsXG4gIFwiSFVaWkFcIixcbiAgXCJIWURSQVwiLFxuICBcIkhZRFJPXCIsXG4gIFwiSFlFTkFcIixcbiAgXCJIWUlOR1wiLFxuICBcIkhZTUVOXCIsXG4gIFwiSFlNTlNcIixcbiAgXCJIWVBFRFwiLFxuICBcIkhZUEVSXCIsXG4gIFwiSFlQRVNcIixcbiAgXCJIWVBPU1wiLFxuICBcIklBTUJTXCIsXG4gIFwiSUNIT1JcIixcbiAgXCJJQ0lFUlwiLFxuICBcIklDSU5HXCIsXG4gIFwiSUNPTlNcIixcbiAgXCJJREVBTFwiLFxuICBcIklERUFTXCIsXG4gIFwiSURJT01cIixcbiAgXCJJRElPVFwiLFxuICBcIklETEVEXCIsXG4gIFwiSURMRVJcIixcbiAgXCJJRExFU1wiLFxuICBcIklET0xTXCIsXG4gIFwiSURZTExcIixcbiAgXCJJRFlMU1wiLFxuICBcIklHTE9PXCIsXG4gIFwiSUtBVFNcIixcbiAgXCJJS09OU1wiLFxuICBcIklMRVVNXCIsXG4gIFwiSUxFVVNcIixcbiAgXCJJTElBQ1wiLFxuICBcIklMSVVNXCIsXG4gIFwiSU1BR0VcIixcbiAgXCJJTUFHT1wiLFxuICBcIklNQU1TXCIsXG4gIFwiSU1CRURcIixcbiAgXCJJTUJVRVwiLFxuICBcIklNUEVMXCIsXG4gIFwiSU1QTFlcIixcbiAgXCJJTVBST1wiLFxuICBcIklOQU5FXCIsXG4gIFwiSU5BUFRcIixcbiAgXCJJTkNVUlwiLFxuICBcIklOREVYXCIsXG4gIFwiSU5ESUVcIixcbiAgXCJJTkVQVFwiLFxuICBcIklORVJUXCIsXG4gIFwiSU5GRVJcIixcbiAgXCJJTkZJWFwiLFxuICBcIklORlJBXCIsXG4gIFwiSU5HT1RcIixcbiAgXCJJTkpVTlwiLFxuICBcIklOS0VEXCIsXG4gIFwiSU5MQVlcIixcbiAgXCJJTkxFVFwiLFxuICBcIklOTkVSXCIsXG4gIFwiSU5QVVRcIixcbiAgXCJJTlNFVFwiLFxuICBcIklOVEVSXCIsXG4gIFwiSU5UUk9cIixcbiAgXCJJTlVSRVwiLFxuICBcIklPTklDXCIsXG4gIFwiSU9UQVNcIixcbiAgXCJJUkFURVwiLFxuICBcIklSS0VEXCIsXG4gIFwiSVJPTlNcIixcbiAgXCJJUk9OWVwiLFxuICBcIklTTEVTXCIsXG4gIFwiSVNMRVRcIixcbiAgXCJJU1NVRVwiLFxuICBcIklUQ0hZXCIsXG4gIFwiSVRFTVNcIixcbiAgXCJJVklFRFwiLFxuICBcIklWSUVTXCIsXG4gIFwiSVZPUllcIixcbiAgXCJJWE5BWVwiLFxuICBcIkpBQ0tTXCIsXG4gIFwiSkFERURcIixcbiAgXCJKQURFU1wiLFxuICBcIkpBR0dZXCIsXG4gIFwiSkFJTFNcIixcbiAgXCJKQU1CU1wiLFxuICBcIkpBTU1ZXCIsXG4gIFwiSkFORVNcIixcbiAgXCJKQVBBTlwiLFxuICBcIkpBVU5UXCIsXG4gIFwiSkFXRURcIixcbiAgXCJKQVpaWVwiLFxuICBcIkpFQU5TXCIsXG4gIFwiSkVFUFNcIixcbiAgXCJKRUVSU1wiLFxuICBcIkpFTExPXCIsXG4gIFwiSkVMTFNcIixcbiAgXCJKRUxMWVwiLFxuICBcIkpFTk5ZXCIsXG4gIFwiSkVSS1NcIixcbiAgXCJKRVJLWVwiLFxuICBcIkpFUlJZXCIsXG4gIFwiSkVTVFNcIixcbiAgXCJKRVRUWVwiLFxuICBcIkpFV0VMXCIsXG4gIFwiSklCRURcIixcbiAgXCJKSUJFU1wiLFxuICBcIkpJRkZTXCIsXG4gIFwiSklGRllcIixcbiAgXCJKSUhBRFwiLFxuICBcIkpJTFRTXCIsXG4gIFwiSklNTVlcIixcbiAgXCJKSU5HT1wiLFxuICBcIkpJTkdTXCIsXG4gIFwiSklOS1NcIixcbiAgXCJKSU5OU1wiLFxuICBcIkpJVkVEXCIsXG4gIFwiSklWRVNcIixcbiAgXCJKT0NLU1wiLFxuICBcIkpPRVlTXCIsXG4gIFwiSk9ITlNcIixcbiAgXCJKT0lOU1wiLFxuICBcIkpPSU5UXCIsXG4gIFwiSk9JU1RcIixcbiAgXCJKT0tFRFwiLFxuICBcIkpPS0VSXCIsXG4gIFwiSk9LRVNcIixcbiAgXCJKT0xMWVwiLFxuICBcIkpPTFRTXCIsXG4gIFwiSk9VTEVcIixcbiAgXCJKT1VTVFwiLFxuICBcIkpPV0xTXCIsXG4gIFwiSk9ZRURcIixcbiAgXCJKVURHRVwiLFxuICBcIkpVSUNFXCIsXG4gIFwiSlVJQ1lcIixcbiAgXCJKVUpVU1wiLFxuICBcIkpVS0VTXCIsXG4gIFwiSlVMRVBcIixcbiAgXCJKVU1CT1wiLFxuICBcIkpVTVBTXCIsXG4gIFwiSlVNUFlcIixcbiAgXCJKVU5DT1wiLFxuICBcIkpVTktTXCIsXG4gIFwiSlVOS1lcIixcbiAgXCJKVU5UQVwiLFxuICBcIkpVUk9SXCIsXG4gIFwiSlVURVNcIixcbiAgXCJLQUJPQlwiLFxuICBcIktBUE9LXCIsXG4gIFwiS0FQUEFcIixcbiAgXCJLQVBVVFwiLFxuICBcIktBUkFUXCIsXG4gIFwiS0FSTUFcIixcbiAgXCJLQVlBS1wiLFxuICBcIktBWU9TXCIsXG4gIFwiS0FaT09cIixcbiAgXCJLRUJBQlwiLFxuICBcIktFRUxTXCIsXG4gIFwiS0VFTlNcIixcbiAgXCJLRUVQU1wiLFxuICBcIktFRklSXCIsXG4gIFwiS0VMUFNcIixcbiAgXCJLRU5BRlwiLFxuICBcIktFUElTXCIsXG4gIFwiS0VSQlNcIixcbiAgXCJLRVJGU1wiLFxuICBcIktFUk5TXCIsXG4gIFwiS0VUQ0hcIixcbiAgXCJLRVlFRFwiLFxuICBcIktIQUtJXCIsXG4gIFwiS0hBTlNcIixcbiAgXCJLSUNLU1wiLFxuICBcIktJQ0tZXCIsXG4gIFwiS0lERE9cIixcbiAgXCJLSUtFU1wiLFxuICBcIktJTExTXCIsXG4gIFwiS0lMTlNcIixcbiAgXCJLSUxPU1wiLFxuICBcIktJTFRTXCIsXG4gIFwiS0lOREFcIixcbiAgXCJLSU5EU1wiLFxuICBcIktJTkdTXCIsXG4gIFwiS0lOS1NcIixcbiAgXCJLSU5LWVwiLFxuICBcIktJT1NLXCIsXG4gIFwiS0lSS1NcIixcbiAgXCJLSVRIU1wiLFxuICBcIktJVFRZXCIsXG4gIFwiS0lWQVNcIixcbiAgXCJLSVdJU1wiLFxuICBcIktMSUVHXCIsXG4gIFwiS0xVR0VcIixcbiAgXCJLTFVUWlwiLFxuICBcIktOQUNLXCIsXG4gIFwiS05BVkVcIixcbiAgXCJLTkVBRFwiLFxuICBcIktORUVEXCIsXG4gIFwiS05FRUxcIixcbiAgXCJLTkVFU1wiLFxuICBcIktORUxMXCIsXG4gIFwiS05FTFRcIixcbiAgXCJLTklGRVwiLFxuICBcIktOSVNIXCIsXG4gIFwiS05JVFNcIixcbiAgXCJLTk9CU1wiLFxuICBcIktOT0NLXCIsXG4gIFwiS05PTExcIixcbiAgXCJLTk9QU1wiLFxuICBcIktOT1RTXCIsXG4gIFwiS05PVVRcIixcbiAgXCJLTk9XTlwiLFxuICBcIktOT1dTXCIsXG4gIFwiS05VUkxcIixcbiAgXCJLT0FMQVwiLFxuICBcIktPSU5FXCIsXG4gIFwiS09PS1NcIixcbiAgXCJLT09LWVwiLFxuICBcIktPUEVLXCIsXG4gIFwiS1JBQUxcIixcbiAgXCJLUkFVVFwiLFxuICBcIktSSUxMXCIsXG4gIFwiS1JPTkFcIixcbiAgXCJLUk9ORVwiLFxuICBcIktVRE9TXCIsXG4gIFwiS1VEWlVcIixcbiAgXCJLVUxBS1wiLFxuICBcIktZUklFXCIsXG4gIFwiTEFCRUxcIixcbiAgXCJMQUJJQVwiLFxuICBcIkxBQk9SXCIsXG4gIFwiTEFDRURcIixcbiAgXCJMQUNFU1wiLFxuICBcIkxBQ0tTXCIsXG4gIFwiTEFERURcIixcbiAgXCJMQURFTlwiLFxuICBcIkxBREVTXCIsXG4gIFwiTEFETEVcIixcbiAgXCJMQUdFUlwiLFxuICBcIkxBSVJEXCIsXG4gIFwiTEFJUlNcIixcbiAgXCJMQUlUWVwiLFxuICBcIkxBS0VSXCIsXG4gIFwiTEFLRVNcIixcbiAgXCJMQU1BU1wiLFxuICBcIkxBTUJTXCIsXG4gIFwiTEFNRURcIixcbiAgXCJMQU1FUlwiLFxuICBcIkxBTUVTXCIsXG4gIFwiTEFNUFNcIixcbiAgXCJMQU5BSVwiLFxuICBcIkxBTkNFXCIsXG4gIFwiTEFORFNcIixcbiAgXCJMQU5FU1wiLFxuICBcIkxBTktZXCIsXG4gIFwiTEFQRUxcIixcbiAgXCJMQVBJU1wiLFxuICBcIkxBUFNFXCIsXG4gIFwiTEFSQ0hcIixcbiAgXCJMQVJEU1wiLFxuICBcIkxBUkdFXCIsXG4gIFwiTEFSR09cIixcbiAgXCJMQVJLU1wiLFxuICBcIkxBUlZBXCIsXG4gIFwiTEFTRURcIixcbiAgXCJMQVNFUlwiLFxuICBcIkxBU0VTXCIsXG4gIFwiTEFTU09cIixcbiAgXCJMQVNUU1wiLFxuICBcIkxBVENIXCIsXG4gIFwiTEFURVJcIixcbiAgXCJMQVRFWFwiLFxuICBcIkxBVEhFXCIsXG4gIFwiTEFUSFNcIixcbiAgXCJMQVVEU1wiLFxuICBcIkxBVUdIXCIsXG4gIFwiTEFWQVNcIixcbiAgXCJMQVZFRFwiLFxuICBcIkxBVkVSXCIsXG4gIFwiTEFWRVNcIixcbiAgXCJMQVdOU1wiLFxuICBcIkxBWEVSXCIsXG4gIFwiTEFZRVJcIixcbiAgXCJMQVlVUFwiLFxuICBcIkxBWkVEXCIsXG4gIFwiTEFaRVNcIixcbiAgXCJMRUFDSFwiLFxuICBcIkxFQURTXCIsXG4gIFwiTEVBRlNcIixcbiAgXCJMRUFGWVwiLFxuICBcIkxFQUtTXCIsXG4gIFwiTEVBS1lcIixcbiAgXCJMRUFOU1wiLFxuICBcIkxFQU5UXCIsXG4gIFwiTEVBUFNcIixcbiAgXCJMRUFQVFwiLFxuICBcIkxFQVJOXCIsXG4gIFwiTEVBU0VcIixcbiAgXCJMRUFTSFwiLFxuICBcIkxFQVNUXCIsXG4gIFwiTEVBVkVcIixcbiAgXCJMRURHRVwiLFxuICBcIkxFRUNIXCIsXG4gIFwiTEVFS1NcIixcbiAgXCJMRUVSU1wiLFxuICBcIkxFRVJZXCIsXG4gIFwiTEVGVFNcIixcbiAgXCJMRUZUWVwiLFxuICBcIkxFR0FMXCIsXG4gIFwiTEVHR1lcIixcbiAgXCJMRUdJVFwiLFxuICBcIkxFTU1BXCIsXG4gIFwiTEVNT05cIixcbiAgXCJMRU1VUlwiLFxuICBcIkxFTkRTXCIsXG4gIFwiTEVOVE9cIixcbiAgXCJMRVBFUlwiLFxuICBcIkxFUFRBXCIsXG4gIFwiTEVUVVBcIixcbiAgXCJMRVZFRVwiLFxuICBcIkxFVkVMXCIsXG4gIFwiTEVWRVJcIixcbiAgXCJMSUFSU1wiLFxuICBcIkxJQkVMXCIsXG4gIFwiTElCUkFcIixcbiAgXCJMSUNJVFwiLFxuICBcIkxJQ0tTXCIsXG4gIFwiTElFR0VcIixcbiAgXCJMSUVOU1wiLFxuICBcIkxJRkVSXCIsXG4gIFwiTElGVFNcIixcbiAgXCJMSUdIVFwiLFxuICBcIkxJS0VEXCIsXG4gIFwiTElLRU5cIixcbiAgXCJMSUtFU1wiLFxuICBcIkxJTEFDXCIsXG4gIFwiTElMVFNcIixcbiAgXCJMSU1CT1wiLFxuICBcIkxJTUJTXCIsXG4gIFwiTElNRURcIixcbiAgXCJMSU1FTlwiLFxuICBcIkxJTUVTXCIsXG4gIFwiTElNRVlcIixcbiAgXCJMSU1JVFwiLFxuICBcIkxJTU5TXCIsXG4gIFwiTElNT1NcIixcbiAgXCJMSU1QU1wiLFxuICBcIkxJTkVEXCIsXG4gIFwiTElORU5cIixcbiAgXCJMSU5FUlwiLFxuICBcIkxJTkVTXCIsXG4gIFwiTElOR09cIixcbiAgXCJMSU5HU1wiLFxuICBcIkxJTktTXCIsXG4gIFwiTElPTlNcIixcbiAgXCJMSVBJRFwiLFxuICBcIkxJUFBZXCIsXG4gIFwiTElTTEVcIixcbiAgXCJMSVNQU1wiLFxuICBcIkxJU1RTXCIsXG4gIFwiTElURVJcIixcbiAgXCJMSVRIRVwiLFxuICBcIkxJVEhPXCIsXG4gIFwiTElUUkVcIixcbiAgXCJMSVZFRFwiLFxuICBcIkxJVkVOXCIsXG4gIFwiTElWRVJcIixcbiAgXCJMSVZJRFwiLFxuICBcIkxMQU1BXCIsXG4gIFwiTE9BRFNcIixcbiAgXCJMT0FGU1wiLFxuICBcIkxPQU1ZXCIsXG4gIFwiTE9BTlNcIixcbiAgXCJMT0FUSFwiLFxuICBcIkxPQkFSXCIsXG4gIFwiTE9CQllcIixcbiAgXCJMT0JFU1wiLFxuICBcIkxPQ0FMXCIsXG4gIFwiTE9DSFNcIixcbiAgXCJMT0NLU1wiLFxuICBcIkxPQ09TXCIsXG4gIFwiTE9DVVNcIixcbiAgXCJMT0RFU1wiLFxuICBcIkxPREdFXCIsXG4gIFwiTE9FU1NcIixcbiAgXCJMT0ZUU1wiLFxuICBcIkxPRlRZXCIsXG4gIFwiTE9HRVNcIixcbiAgXCJMT0dJQ1wiLFxuICBcIkxPR0lOXCIsXG4gIFwiTE9HT1NcIixcbiAgXCJMT0lOU1wiLFxuICBcIkxPTExTXCIsXG4gIFwiTE9MTFlcIixcbiAgXCJMT05FUlwiLFxuICBcIkxPTkdTXCIsXG4gIFwiTE9PS1NcIixcbiAgXCJMT09LWVwiLFxuICBcIkxPT01TXCIsXG4gIFwiTE9PTlNcIixcbiAgXCJMT09OWVwiLFxuICBcIkxPT1BTXCIsXG4gIFwiTE9PUFlcIixcbiAgXCJMT09TRVwiLFxuICBcIkxPT1RTXCIsXG4gIFwiTE9QRURcIixcbiAgXCJMT1BFU1wiLFxuICBcIkxPUFBZXCIsXG4gIFwiTE9SRFNcIixcbiAgXCJMT1JEWVwiLFxuICBcIkxPUkVTXCIsXG4gIFwiTE9SUllcIixcbiAgXCJMT1NFUlwiLFxuICBcIkxPU0VTXCIsXG4gIFwiTE9TU1lcIixcbiAgXCJMT1RTQVwiLFxuICBcIkxPVFRPXCIsXG4gIFwiTE9UVVNcIixcbiAgXCJMT1VJU1wiLFxuICBcIkxPVVNFXCIsXG4gIFwiTE9VU1lcIixcbiAgXCJMT1VUU1wiLFxuICBcIkxPVkVEXCIsXG4gIFwiTE9WRVJcIixcbiAgXCJMT1ZFU1wiLFxuICBcIkxPV0VEXCIsXG4gIFwiTE9XRVJcIixcbiAgXCJMT1dMWVwiLFxuICBcIkxPWUFMXCIsXG4gIFwiTFVBVVNcIixcbiAgXCJMVUJFU1wiLFxuICBcIkxVQlJBXCIsXG4gIFwiTFVDSURcIixcbiAgXCJMVUNLU1wiLFxuICBcIkxVQ0tZXCIsXG4gIFwiTFVDUkVcIixcbiAgXCJMVUxMU1wiLFxuICBcIkxVTFVTXCIsXG4gIFwiTFVNRU5cIixcbiAgXCJMVU1QU1wiLFxuICBcIkxVTVBZXCIsXG4gIFwiTFVOQVJcIixcbiAgXCJMVU5DSFwiLFxuICBcIkxVTkVTXCIsXG4gIFwiTFVOR0VcIixcbiAgXCJMVU5HU1wiLFxuICBcIkxVUFVTXCIsXG4gIFwiTFVSQ0hcIixcbiAgXCJMVVJFRFwiLFxuICBcIkxVUkVTXCIsXG4gIFwiTFVSSURcIixcbiAgXCJMVVJLU1wiLFxuICBcIkxVU1RTXCIsXG4gIFwiTFVTVFlcIixcbiAgXCJMVVRFRFwiLFxuICBcIkxVVEVTXCIsXG4gIFwiTFlDUkFcIixcbiAgXCJMWUlOR1wiLFxuICBcIkxZTVBIXCIsXG4gIFwiTFlOQ0hcIixcbiAgXCJMWVJFU1wiLFxuICBcIkxZUklDXCIsXG4gIFwiTUFDQVdcIixcbiAgXCJNQUNFRFwiLFxuICBcIk1BQ0VSXCIsXG4gIFwiTUFDRVNcIixcbiAgXCJNQUNIT1wiLFxuICBcIk1BQ1JPXCIsXG4gIFwiTUFEQU1cIixcbiAgXCJNQURMWVwiLFxuICBcIk1BRklBXCIsXG4gIFwiTUFHSUNcIixcbiAgXCJNQUdNQVwiLFxuICBcIk1BR1VTXCIsXG4gIFwiTUFIVUFcIixcbiAgXCJNQUlEU1wiLFxuICBcIk1BSUxTXCIsXG4gIFwiTUFJTVNcIixcbiAgXCJNQUlOU1wiLFxuICBcIk1BSVpFXCIsXG4gIFwiTUFKT1JcIixcbiAgXCJNQUtFUlwiLFxuICBcIk1BS0VTXCIsXG4gIFwiTUFMRVNcIixcbiAgXCJNQUxMU1wiLFxuICBcIk1BTFRTXCIsXG4gIFwiTUFMVFlcIixcbiAgXCJNQU1BU1wiLFxuICBcIk1BTUJPXCIsXG4gIFwiTUFNTUFcIixcbiAgXCJNQU1NWVwiLFxuICBcIk1BTkVTXCIsXG4gIFwiTUFOR0VcIixcbiAgXCJNQU5HT1wiLFxuICBcIk1BTkdZXCIsXG4gIFwiTUFOSUFcIixcbiAgXCJNQU5JQ1wiLFxuICBcIk1BTkxZXCIsXG4gIFwiTUFOTkFcIixcbiAgXCJNQU5PUlwiLFxuICBcIk1BTlNFXCIsXG4gIFwiTUFOVEFcIixcbiAgXCJNQVBMRVwiLFxuICBcIk1BUkNIXCIsXG4gIFwiTUFSRVNcIixcbiAgXCJNQVJHRVwiLFxuICBcIk1BUklBXCIsXG4gIFwiTUFSS1NcIixcbiAgXCJNQVJMU1wiLFxuICBcIk1BUlJZXCIsXG4gIFwiTUFSU0hcIixcbiAgXCJNQVJUU1wiLFxuICBcIk1BU0VSXCIsXG4gIFwiTUFTS1NcIixcbiAgXCJNQVNPTlwiLFxuICBcIk1BU1RTXCIsXG4gIFwiTUFUQ0hcIixcbiAgXCJNQVRFRFwiLFxuICBcIk1BVEVSXCIsXG4gIFwiTUFURVNcIixcbiAgXCJNQVRFWVwiLFxuICBcIk1BVEhTXCIsXG4gIFwiTUFUVEVcIixcbiAgXCJNQVRaT1wiLFxuICBcIk1BVUxTXCIsXG4gIFwiTUFVVkVcIixcbiAgXCJNQVZFTlwiLFxuICBcIk1BVklTXCIsXG4gIFwiTUFYSU1cIixcbiAgXCJNQVhJU1wiLFxuICBcIk1BWUJFXCIsXG4gIFwiTUFZT1JcIixcbiAgXCJNQVlTVFwiLFxuICBcIk1BWkVEXCIsXG4gIFwiTUFaRVJcIixcbiAgXCJNQVpFU1wiLFxuICBcIk1FQURTXCIsXG4gIFwiTUVBTFNcIixcbiAgXCJNRUFMWVwiLFxuICBcIk1FQU5TXCIsXG4gIFwiTUVBTlRcIixcbiAgXCJNRUFOWVwiLFxuICBcIk1FQVRTXCIsXG4gIFwiTUVBVFlcIixcbiAgXCJNRURBTFwiLFxuICBcIk1FRElBXCIsXG4gIFwiTUVESUNcIixcbiAgXCJNRUVUU1wiLFxuICBcIk1FTEJBXCIsXG4gIFwiTUVMRFNcIixcbiAgXCJNRUxFRVwiLFxuICBcIk1FTE9OXCIsXG4gIFwiTUVMVFNcIixcbiAgXCJNRU1FU1wiLFxuICBcIk1FTU9TXCIsXG4gIFwiTUVORFNcIixcbiAgXCJNRU5VU1wiLFxuICBcIk1FT1dTXCIsXG4gIFwiTUVSQ1lcIixcbiAgXCJNRVJHRVwiLFxuICBcIk1FUklUXCIsXG4gIFwiTUVSUllcIixcbiAgXCJNRVNBU1wiLFxuICBcIk1FU05FXCIsXG4gIFwiTUVTT05cIixcbiAgXCJNRVNTWVwiLFxuICBcIk1FVEFMXCIsXG4gIFwiTUVURURcIixcbiAgXCJNRVRFUlwiLFxuICBcIk1FVEVTXCIsXG4gIFwiTUVUUkVcIixcbiAgXCJNRVRST1wiLFxuICBcIk1FV0VEXCIsXG4gIFwiTUVaWk9cIixcbiAgXCJNSUFPV1wiLFxuICBcIk1JQ0tTXCIsXG4gIFwiTUlDUk9cIixcbiAgXCJNSUREWVwiLFxuICBcIk1JRElTXCIsXG4gIFwiTUlEU1RcIixcbiAgXCJNSUVOU1wiLFxuICBcIk1JRkZTXCIsXG4gIFwiTUlHSFRcIixcbiAgXCJNSUtFRFwiLFxuICBcIk1JS0VTXCIsXG4gIFwiTUlMQ0hcIixcbiAgXCJNSUxFUlwiLFxuICBcIk1JTEVTXCIsXG4gIFwiTUlMS1NcIixcbiAgXCJNSUxLWVwiLFxuICBcIk1JTExTXCIsXG4gIFwiTUlNRURcIixcbiAgXCJNSU1FT1wiLFxuICBcIk1JTUVTXCIsXG4gIFwiTUlNSUNcIixcbiAgXCJNSU1TWVwiLFxuICBcIk1JTkNFXCIsXG4gIFwiTUlORFNcIixcbiAgXCJNSU5FRFwiLFxuICBcIk1JTkVSXCIsXG4gIFwiTUlORVNcIixcbiAgXCJNSU5JTVwiLFxuICBcIk1JTklTXCIsXG4gIFwiTUlOS1NcIixcbiAgXCJNSU5PUlwiLFxuICBcIk1JTlRTXCIsXG4gIFwiTUlOVVNcIixcbiAgXCJNSVJFRFwiLFxuICBcIk1JUkVTXCIsXG4gIFwiTUlSVEhcIixcbiAgXCJNSVNFUlwiLFxuICBcIk1JU1NZXCIsXG4gIFwiTUlTVFNcIixcbiAgXCJNSVNUWVwiLFxuICBcIk1JVEVSXCIsXG4gIFwiTUlURVNcIixcbiAgXCJNSVRSRVwiLFxuICBcIk1JVFRTXCIsXG4gIFwiTUlYRURcIixcbiAgXCJNSVhFUlwiLFxuICBcIk1JWEVTXCIsXG4gIFwiTUlYVVBcIixcbiAgXCJNT0FOU1wiLFxuICBcIk1PQVRTXCIsXG4gIFwiTU9DSEFcIixcbiAgXCJNT0NLU1wiLFxuICBcIk1PREFMXCIsXG4gIFwiTU9ERUxcIixcbiAgXCJNT0RFTVwiLFxuICBcIk1PREVTXCIsXG4gIFwiTU9HVUxcIixcbiAgXCJNT0hFTFwiLFxuICBcIk1PSVJFXCIsXG4gIFwiTU9JU1RcIixcbiAgXCJNT0xBTFwiLFxuICBcIk1PTEFSXCIsXG4gIFwiTU9MQVNcIixcbiAgXCJNT0xEU1wiLFxuICBcIk1PTERZXCIsXG4gIFwiTU9MRVNcIixcbiAgXCJNT0xMU1wiLFxuICBcIk1PTExZXCIsXG4gIFwiTU9MVFNcIixcbiAgXCJNT01NQVwiLFxuICBcIk1PTU1ZXCIsXG4gIFwiTU9OQURcIixcbiAgXCJNT05ET1wiLFxuICBcIk1PTkVZXCIsXG4gIFwiTU9OSUNcIixcbiAgXCJNT05LU1wiLFxuICBcIk1PTlRFXCIsXG4gIFwiTU9OVEhcIixcbiAgXCJNT09DSFwiLFxuICBcIk1PT0RTXCIsXG4gIFwiTU9PRFlcIixcbiAgXCJNT09FRFwiLFxuICBcIk1PT0xBXCIsXG4gIFwiTU9PTlNcIixcbiAgXCJNT09OWVwiLFxuICBcIk1PT1JTXCIsXG4gIFwiTU9PU0VcIixcbiAgXCJNT09UU1wiLFxuICBcIk1PUEVEXCIsXG4gIFwiTU9QRVNcIixcbiAgXCJNT1JBTFwiLFxuICBcIk1PUkFZXCIsXG4gIFwiTU9SRUxcIixcbiAgXCJNT1JFU1wiLFxuICBcIk1PUk5TXCIsXG4gIFwiTU9ST05cIixcbiAgXCJNT1JQSFwiLFxuICBcIk1PUlRTXCIsXG4gIFwiTU9TRVlcIixcbiAgXCJNT1NTWVwiLFxuICBcIk1PVEVMXCIsXG4gIFwiTU9URVNcIixcbiAgXCJNT1RFVFwiLFxuICBcIk1PVEhTXCIsXG4gIFwiTU9USFlcIixcbiAgXCJNT1RJRlwiLFxuICBcIk1PVE9SXCIsXG4gIFwiTU9UVE9cIixcbiAgXCJNT1VMRFwiLFxuICBcIk1PVUxUXCIsXG4gIFwiTU9VTkRcIixcbiAgXCJNT1VOVFwiLFxuICBcIk1PVVJOXCIsXG4gIFwiTU9VU0VcIixcbiAgXCJNT1VTWVwiLFxuICBcIk1PVVRIXCIsXG4gIFwiTU9WRURcIixcbiAgXCJNT1ZFUlwiLFxuICBcIk1PVkVTXCIsXG4gIFwiTU9WSUVcIixcbiAgXCJNT1dFRFwiLFxuICBcIk1PV0VSXCIsXG4gIFwiTU9YSUVcIixcbiAgXCJNVUNIT1wiLFxuICBcIk1VQ0tTXCIsXG4gIFwiTVVDS1lcIixcbiAgXCJNVUNVU1wiLFxuICBcIk1VRERZXCIsXG4gIFwiTVVGRlNcIixcbiAgXCJNVUZUSVwiLFxuICBcIk1VR0dZXCIsXG4gIFwiTVVMQ0hcIixcbiAgXCJNVUxDVFwiLFxuICBcIk1VTEVTXCIsXG4gIFwiTVVMRVlcIixcbiAgXCJNVUxMU1wiLFxuICBcIk1VTU1ZXCIsXG4gIFwiTVVNUFNcIixcbiAgXCJNVU5DSFwiLFxuICBcIk1VTkdFXCIsXG4gIFwiTVVOR1NcIixcbiAgXCJNVU9OU1wiLFxuICBcIk1VUkFMXCIsXG4gIFwiTVVSS1lcIixcbiAgXCJNVVNFRFwiLFxuICBcIk1VU0VTXCIsXG4gIFwiTVVTSFlcIixcbiAgXCJNVVNJQ1wiLFxuICBcIk1VU0tTXCIsXG4gIFwiTVVTS1lcIixcbiAgXCJNVVNPU1wiLFxuICBcIk1VU1RTXCIsXG4gIFwiTVVTVFlcIixcbiAgXCJNVVRFRFwiLFxuICBcIk1VVEVTXCIsXG4gIFwiTVVUVFNcIixcbiAgXCJNVVhFU1wiLFxuICBcIk1ZTEFSXCIsXG4gIFwiTVlOQUhcIixcbiAgXCJNWU5BU1wiLFxuICBcIk1ZUlJIXCIsXG4gIFwiTVlUSFNcIixcbiAgXCJOQUJPQlwiLFxuICBcIk5BQ0hPXCIsXG4gIFwiTkFESVJcIixcbiAgXCJOQUlBRFwiLFxuICBcIk5BSUxTXCIsXG4gIFwiTkFJVkVcIixcbiAgXCJOQUtFRFwiLFxuICBcIk5BTUVEXCIsXG4gIFwiTkFNRVNcIixcbiAgXCJOQU5OWVwiLFxuICBcIk5BUEVTXCIsXG4gIFwiTkFQUFlcIixcbiAgXCJOQVJDT1wiLFxuICBcIk5BUkNTXCIsXG4gIFwiTkFSRFNcIixcbiAgXCJOQVJFU1wiLFxuICBcIk5BU0FMXCIsXG4gIFwiTkFTVFlcIixcbiAgXCJOQVRBTFwiLFxuICBcIk5BVENIXCIsXG4gIFwiTkFURVNcIixcbiAgXCJOQVRUWVwiLFxuICBcIk5BVkFMXCIsXG4gIFwiTkFWRUxcIixcbiAgXCJOQVZFU1wiLFxuICBcIk5FQVJTXCIsXG4gIFwiTkVBVEhcIixcbiAgXCJORUNLU1wiLFxuICBcIk5FRURTXCIsXG4gIFwiTkVFRFlcIixcbiAgXCJORUdST1wiLFxuICBcIk5FSUdIXCIsXG4gIFwiTkVPTlNcIixcbiAgXCJORVJEU1wiLFxuICBcIk5FUkRZXCIsXG4gIFwiTkVSRlNcIixcbiAgXCJORVJWRVwiLFxuICBcIk5FUlZZXCIsXG4gIFwiTkVTVFNcIixcbiAgXCJORVZFUlwiLFxuICBcIk5FV0VMXCIsXG4gIFwiTkVXRVJcIixcbiAgXCJORVdMWVwiLFxuICBcIk5FV1NZXCIsXG4gIFwiTkVXVFNcIixcbiAgXCJORVhVU1wiLFxuICBcIk5JQ0FEXCIsXG4gIFwiTklDRVJcIixcbiAgXCJOSUNIRVwiLFxuICBcIk5JQ0tTXCIsXG4gIFwiTklFQ0VcIixcbiAgXCJOSUZUWVwiLFxuICBcIk5JR0hUXCIsXG4gIFwiTklNQklcIixcbiAgXCJOSU5FU1wiLFxuICBcIk5JTkpBXCIsXG4gIFwiTklOTllcIixcbiAgXCJOSU5USFwiLFxuICBcIk5JUFBZXCIsXG4gIFwiTklTRUlcIixcbiAgXCJOSVRFUlwiLFxuICBcIk5JVFJPXCIsXG4gIFwiTklYRURcIixcbiAgXCJOSVhFU1wiLFxuICBcIk5JWElFXCIsXG4gIFwiTk9CTEVcIixcbiAgXCJOT0JMWVwiLFxuICBcIk5PREFMXCIsXG4gIFwiTk9ERFlcIixcbiAgXCJOT0RFU1wiLFxuICBcIk5PRUxTXCIsXG4gIFwiTk9IT1dcIixcbiAgXCJOT0lTRVwiLFxuICBcIk5PSVNZXCIsXG4gIFwiTk9NQURcIixcbiAgXCJOT05DRVwiLFxuICBcIk5PTkVTXCIsXG4gIFwiTk9PS1NcIixcbiAgXCJOT09LWVwiLFxuICBcIk5PT05TXCIsXG4gIFwiTk9PU0VcIixcbiAgXCJOT1JNU1wiLFxuICBcIk5PUlRIXCIsXG4gIFwiTk9TRURcIixcbiAgXCJOT1NFU1wiLFxuICBcIk5PU0VZXCIsXG4gIFwiTk9UQ0hcIixcbiAgXCJOT1RFRFwiLFxuICBcIk5PVEVTXCIsXG4gIFwiTk9VTlNcIixcbiAgXCJOT1ZBRVwiLFxuICBcIk5PVkFTXCIsXG4gIFwiTk9WRUxcIixcbiAgXCJOT1dBWVwiLFxuICBcIk5VREVTXCIsXG4gIFwiTlVER0VcIixcbiAgXCJOVURJRVwiLFxuICBcIk5VS0VEXCIsXG4gIFwiTlVLRVNcIixcbiAgXCJOVUxMU1wiLFxuICBcIk5VTUJTXCIsXG4gIFwiTlVSU0VcIixcbiAgXCJOVVRTWVwiLFxuICBcIk5VVFRZXCIsXG4gIFwiTllMT05cIixcbiAgXCJOWU1QSFwiLFxuICBcIk9BS0VOXCIsXG4gIFwiT0FLVU1cIixcbiAgXCJPQVJFRFwiLFxuICBcIk9BU0VTXCIsXG4gIFwiT0FTSVNcIixcbiAgXCJPQVRFTlwiLFxuICBcIk9BVEhTXCIsXG4gIFwiT0JFQUhcIixcbiAgXCJPQkVTRVwiLFxuICBcIk9CRVlTXCIsXG4gIFwiT0JJVFNcIixcbiAgXCJPQk9FU1wiLFxuICBcIk9DQ1VSXCIsXG4gIFwiT0NFQU5cIixcbiAgXCJPQ0hFUlwiLFxuICBcIk9DSFJFXCIsXG4gIFwiT0NUQUxcIixcbiAgXCJPQ1RFVFwiLFxuICBcIk9EREVSXCIsXG4gIFwiT0RETFlcIixcbiAgXCJPRElVTVwiLFxuICBcIk9ET1JTXCIsXG4gIFwiT0RPVVJcIixcbiAgXCJPRkZBTFwiLFxuICBcIk9GRkVEXCIsXG4gIFwiT0ZGRVJcIixcbiAgXCJPRlRFTlwiLFxuICBcIk9HTEVEXCIsXG4gIFwiT0dMRVNcIixcbiAgXCJPR1JFU1wiLFxuICBcIk9JTEVEXCIsXG4gIFwiT0lMRVJcIixcbiAgXCJPSU5LU1wiLFxuICBcIk9LQVBJXCIsXG4gIFwiT0tBWVNcIixcbiAgXCJPTERFTlwiLFxuICBcIk9MREVSXCIsXG4gIFwiT0xESUVcIixcbiAgXCJPTElPU1wiLFxuICBcIk9MSVZFXCIsXG4gIFwiT01CUkVcIixcbiAgXCJPTUVHQVwiLFxuICBcIk9NRU5TXCIsXG4gIFwiT01JVFNcIixcbiAgXCJPTklPTlwiLFxuICBcIk9OU0VUXCIsXG4gIFwiT09NUEhcIixcbiAgXCJPT1pFRFwiLFxuICBcIk9PWkVTXCIsXG4gIFwiT1BBTFNcIixcbiAgXCJPUEVOU1wiLFxuICBcIk9QRVJBXCIsXG4gIFwiT1BJTkVcIixcbiAgXCJPUElVTVwiLFxuICBcIk9QVEVEXCIsXG4gIFwiT1BUSUNcIixcbiAgXCJPUkFMU1wiLFxuICBcIk9SQVRFXCIsXG4gIFwiT1JCSVRcIixcbiAgXCJPUkNBU1wiLFxuICBcIk9SREVSXCIsXG4gIFwiT1JHQU5cIixcbiAgXCJPUlRIT1wiLFxuICBcIk9TSUVSXCIsXG4gIFwiT1RIRVJcIixcbiAgXCJPVFRFUlwiLFxuICBcIk9VR0hUXCIsXG4gIFwiT1VOQ0VcIixcbiAgXCJPVVNFTFwiLFxuICBcIk9VU1RTXCIsXG4gIFwiT1VURE9cIixcbiAgXCJPVVRFUlwiLFxuICBcIk9VVEdPXCIsXG4gIFwiT1VUVEFcIixcbiAgXCJPVVpFTFwiLFxuICBcIk9WQUxTXCIsXG4gIFwiT1ZBUllcIixcbiAgXCJPVkFURVwiLFxuICBcIk9WRU5TXCIsXG4gIFwiT1ZFUlNcIixcbiAgXCJPVkVSVFwiLFxuICBcIk9WT0lEXCIsXG4gIFwiT1ZVTEVcIixcbiAgXCJPV0lOR1wiLFxuICBcIk9XTEVUXCIsXG4gIFwiT1dORURcIixcbiAgXCJPV05FUlwiLFxuICBcIk9YQk9XXCIsXG4gIFwiT1hFWUVcIixcbiAgXCJPWElERVwiLFxuICBcIk9YTElQXCIsXG4gIFwiT1pPTkVcIixcbiAgXCJQQUNFRFwiLFxuICBcIlBBQ0VSXCIsXG4gIFwiUEFDRVNcIixcbiAgXCJQQUNLU1wiLFxuICBcIlBBQ1RTXCIsXG4gIFwiUEFERFlcIixcbiAgXCJQQURSRVwiLFxuICBcIlBBRUFOXCIsXG4gIFwiUEFHQU5cIixcbiAgXCJQQUdFRFwiLFxuICBcIlBBR0VSXCIsXG4gIFwiUEFHRVNcIixcbiAgXCJQQUlMU1wiLFxuICBcIlBBSU5TXCIsXG4gIFwiUEFJTlRcIixcbiAgXCJQQUlSU1wiLFxuICBcIlBBTEVEXCIsXG4gIFwiUEFMRVJcIixcbiAgXCJQQUxFU1wiLFxuICBcIlBBTExTXCIsXG4gIFwiUEFMTFlcIixcbiAgXCJQQUxNU1wiLFxuICBcIlBBTE1ZXCIsXG4gIFwiUEFMU1lcIixcbiAgXCJQQU5EQVwiLFxuICBcIlBBTkVMXCIsXG4gIFwiUEFORVNcIixcbiAgXCJQQU5HQVwiLFxuICBcIlBBTkdTXCIsXG4gIFwiUEFOSUNcIixcbiAgXCJQQU5TWVwiLFxuICBcIlBBTlRTXCIsXG4gIFwiUEFOVFlcIixcbiAgXCJQQVBBTFwiLFxuICBcIlBBUEFTXCIsXG4gIFwiUEFQQVdcIixcbiAgXCJQQVBFUlwiLFxuICBcIlBBUFBZXCIsXG4gIFwiUEFSQVNcIixcbiAgXCJQQVJDSFwiLFxuICBcIlBBUkRTXCIsXG4gIFwiUEFSRURcIixcbiAgXCJQQVJFTlwiLFxuICBcIlBBUkVTXCIsXG4gIFwiUEFSS0FcIixcbiAgXCJQQVJLU1wiLFxuICBcIlBBUlJZXCIsXG4gIFwiUEFSU0VcIixcbiAgXCJQQVJUU1wiLFxuICBcIlBBUlRZXCIsXG4gIFwiUEFTSEFcIixcbiAgXCJQQVNTRVwiLFxuICBcIlBBU1RBXCIsXG4gIFwiUEFTVEVcIixcbiAgXCJQQVNUU1wiLFxuICBcIlBBU1RZXCIsXG4gIFwiUEFUQ0hcIixcbiAgXCJQQVRFTlwiLFxuICBcIlBBVEVSXCIsXG4gIFwiUEFURVNcIixcbiAgXCJQQVRIU1wiLFxuICBcIlBBVElPXCIsXG4gIFwiUEFUU1lcIixcbiAgXCJQQVRUWVwiLFxuICBcIlBBVVNFXCIsXG4gIFwiUEFWQU5cIixcbiAgXCJQQVZFRFwiLFxuICBcIlBBVkVSXCIsXG4gIFwiUEFWRVNcIixcbiAgXCJQQVdFRFwiLFxuICBcIlBBV0tZXCIsXG4gIFwiUEFXTFNcIixcbiAgXCJQQVdOU1wiLFxuICBcIlBBWUVEXCIsXG4gIFwiUEFZRUVcIixcbiAgXCJQQVlFUlwiLFxuICBcIlBFQUNFXCIsXG4gIFwiUEVBQ0hcIixcbiAgXCJQRUFLU1wiLFxuICBcIlBFQUtZXCIsXG4gIFwiUEVBTFNcIixcbiAgXCJQRUFSTFwiLFxuICBcIlBFQVJTXCIsXG4gIFwiUEVBU0VcIixcbiAgXCJQRUFUU1wiLFxuICBcIlBFQ0FOXCIsXG4gIFwiUEVDS1NcIixcbiAgXCJQRURBTFwiLFxuICBcIlBFRUtTXCIsXG4gIFwiUEVFTFNcIixcbiAgXCJQRUVOU1wiLFxuICBcIlBFRVBTXCIsXG4gIFwiUEVFUlNcIixcbiAgXCJQRUVWRVwiLFxuICBcIlBFS09FXCIsXG4gIFwiUEVMVFNcIixcbiAgXCJQRU5BTFwiLFxuICBcIlBFTkNFXCIsXG4gIFwiUEVORVNcIixcbiAgXCJQRU5HT1wiLFxuICBcIlBFTklTXCIsXG4gIFwiUEVOTllcIixcbiAgXCJQRU9OU1wiLFxuICBcIlBFT05ZXCIsXG4gIFwiUEVQUFlcIixcbiAgXCJQRVJDSFwiLFxuICBcIlBFUklMXCIsXG4gIFwiUEVSS1NcIixcbiAgXCJQRVJLWVwiLFxuICBcIlBFUk1TXCIsXG4gIFwiUEVTS1lcIixcbiAgXCJQRVNPU1wiLFxuICBcIlBFU1RPXCIsXG4gIFwiUEVTVFNcIixcbiAgXCJQRVRBTFwiLFxuICBcIlBFVEVSXCIsXG4gIFwiUEVUSVRcIixcbiAgXCJQRVRUWVwiLFxuICBcIlBFV0VFXCIsXG4gIFwiUEVXSVRcIixcbiAgXCJQSEFHRVwiLFxuICBcIlBISUFMXCIsXG4gIFwiUEhMT1hcIixcbiAgXCJQSE9ORVwiLFxuICBcIlBIT05ZXCIsXG4gIFwiUEhPVE9cIixcbiAgXCJQSFlMQVwiLFxuICBcIlBJQU5PXCIsXG4gIFwiUElDQVNcIixcbiAgXCJQSUNLU1wiLFxuICBcIlBJQ0tZXCIsXG4gIFwiUElDT1RcIixcbiAgXCJQSUVDRVwiLFxuICBcIlBJRVJTXCIsXG4gIFwiUElFVEFcIixcbiAgXCJQSUVUWVwiLFxuICBcIlBJR0dZXCIsXG4gIFwiUElHTVlcIixcbiAgXCJQSUtFUlwiLFxuICBcIlBJS0VTXCIsXG4gIFwiUElMQUZcIixcbiAgXCJQSUxBVVwiLFxuICBcIlBJTEVEXCIsXG4gIFwiUElMRVNcIixcbiAgXCJQSUxMU1wiLFxuICBcIlBJTE9UXCIsXG4gIFwiUElNUFNcIixcbiAgXCJQSU5DSFwiLFxuICBcIlBJTkVEXCIsXG4gIFwiUElORVNcIixcbiAgXCJQSU5FWVwiLFxuICBcIlBJTkdTXCIsXG4gIFwiUElOS09cIixcbiAgXCJQSU5LU1wiLFxuICBcIlBJTktZXCIsXG4gIFwiUElOVE9cIixcbiAgXCJQSU5UU1wiLFxuICBcIlBJTlVQXCIsXG4gIFwiUElPTlNcIixcbiAgXCJQSU9VU1wiLFxuICBcIlBJUEVEXCIsXG4gIFwiUElQRVJcIixcbiAgXCJQSVBFU1wiLFxuICBcIlBJUEVUXCIsXG4gIFwiUElRVUVcIixcbiAgXCJQSVRBU1wiLFxuICBcIlBJVENIXCIsXG4gIFwiUElUSFNcIixcbiAgXCJQSVRIWVwiLFxuICBcIlBJVE9OXCIsXG4gIFwiUElWT1RcIixcbiAgXCJQSVhFTFwiLFxuICBcIlBJWElFXCIsXG4gIFwiUElaWkFcIixcbiAgXCJQTEFDRVwiLFxuICBcIlBMQUlEXCIsXG4gIFwiUExBSU5cIixcbiAgXCJQTEFJVFwiLFxuICBcIlBMQU5FXCIsXG4gIFwiUExBTktcIixcbiAgXCJQTEFOU1wiLFxuICBcIlBMQU5UXCIsXG4gIFwiUExBU0hcIixcbiAgXCJQTEFTTVwiLFxuICBcIlBMQVRFXCIsXG4gIFwiUExBVFNcIixcbiAgXCJQTEFZQVwiLFxuICBcIlBMQVlTXCIsXG4gIFwiUExBWkFcIixcbiAgXCJQTEVBRFwiLFxuICBcIlBMRUFTXCIsXG4gIFwiUExFQVRcIixcbiAgXCJQTEVCRVwiLFxuICBcIlBMRUJTXCIsXG4gIFwiUExJRURcIixcbiAgXCJQTElFU1wiLFxuICBcIlBMSU5LXCIsXG4gIFwiUExPRFNcIixcbiAgXCJQTE9OS1wiLFxuICBcIlBMT1BTXCIsXG4gIFwiUExPVFNcIixcbiAgXCJQTE9XU1wiLFxuICBcIlBMT1lTXCIsXG4gIFwiUExVQ0tcIixcbiAgXCJQTFVHU1wiLFxuICBcIlBMVU1CXCIsXG4gIFwiUExVTUVcIixcbiAgXCJQTFVNUFwiLFxuICBcIlBMVU1TXCIsXG4gIFwiUExVTVlcIixcbiAgXCJQTFVOS1wiLFxuICBcIlBMVVNIXCIsXG4gIFwiUE9BQ0hcIixcbiAgXCJQT0NLU1wiLFxuICBcIlBPQ0tZXCIsXG4gIFwiUE9ER1lcIixcbiAgXCJQT0RJQVwiLFxuICBcIlBPRU1TXCIsXG4gIFwiUE9FU1lcIixcbiAgXCJQT0VUU1wiLFxuICBcIlBPSU5UXCIsXG4gIFwiUE9JU0VcIixcbiAgXCJQT0tFRFwiLFxuICBcIlBPS0VSXCIsXG4gIFwiUE9LRVNcIixcbiAgXCJQT0tFWVwiLFxuICBcIlBPTEFSXCIsXG4gIFwiUE9MRURcIixcbiAgXCJQT0xFUlwiLFxuICBcIlBPTEVTXCIsXG4gIFwiUE9MSU9cIixcbiAgXCJQT0xJU1wiLFxuICBcIlBPTEtBXCIsXG4gIFwiUE9MTFNcIixcbiAgXCJQT0xZUFwiLFxuICBcIlBPTVBTXCIsXG4gIFwiUE9ORFNcIixcbiAgXCJQT09DSFwiLFxuICBcIlBPT0hTXCIsXG4gIFwiUE9PTFNcIixcbiAgXCJQT09QU1wiLFxuICBcIlBPUEVTXCIsXG4gIFwiUE9QUFlcIixcbiAgXCJQT1JDSFwiLFxuICBcIlBPUkVEXCIsXG4gIFwiUE9SRVNcIixcbiAgXCJQT1JHWVwiLFxuICBcIlBPUktTXCIsXG4gIFwiUE9SS1lcIixcbiAgXCJQT1JOT1wiLFxuICBcIlBPUlRTXCIsXG4gIFwiUE9TRURcIixcbiAgXCJQT1NFUlwiLFxuICBcIlBPU0VTXCIsXG4gIFwiUE9TSVRcIixcbiAgXCJQT1NTRVwiLFxuICBcIlBPU1RTXCIsXG4gIFwiUE9UVFlcIixcbiAgXCJQT1VDSFwiLFxuICBcIlBPVUZTXCIsXG4gIFwiUE9VTkRcIixcbiAgXCJQT1VSU1wiLFxuICBcIlBPVVRTXCIsXG4gIFwiUE9XRVJcIixcbiAgXCJQT1hFU1wiLFxuICBcIlBSQU1TXCIsXG4gIFwiUFJBTktcIixcbiAgXCJQUkFURVwiLFxuICBcIlBSQVRTXCIsXG4gIFwiUFJBV05cIixcbiAgXCJQUkFZU1wiLFxuICBcIlBSRUVOXCIsXG4gIFwiUFJFUFNcIixcbiAgXCJQUkVTU1wiLFxuICBcIlBSRVhZXCIsXG4gIFwiUFJFWVNcIixcbiAgXCJQUklDRVwiLFxuICBcIlBSSUNLXCIsXG4gIFwiUFJJREVcIixcbiAgXCJQUklFRFwiLFxuICBcIlBSSUVTXCIsXG4gIFwiUFJJR1NcIixcbiAgXCJQUklNRVwiLFxuICBcIlBSSU1PXCIsXG4gIFwiUFJJTVBcIixcbiAgXCJQUklNU1wiLFxuICBcIlBSSU5LXCIsXG4gIFwiUFJJTlRcIixcbiAgXCJQUklPUlwiLFxuICBcIlBSSVNFXCIsXG4gIFwiUFJJU01cIixcbiAgXCJQUklWWVwiLFxuICBcIlBSSVpFXCIsXG4gIFwiUFJPQkVcIixcbiAgXCJQUk9EU1wiLFxuICBcIlBST0VNXCIsXG4gIFwiUFJPRlNcIixcbiAgXCJQUk9NT1wiLFxuICBcIlBST01TXCIsXG4gIFwiUFJPTkVcIixcbiAgXCJQUk9OR1wiLFxuICBcIlBST09GXCIsXG4gIFwiUFJPUFNcIixcbiAgXCJQUk9TRVwiLFxuICBcIlBST1NZXCIsXG4gIFwiUFJPVURcIixcbiAgXCJQUk9WRVwiLFxuICBcIlBST1dMXCIsXG4gIFwiUFJPV1NcIixcbiAgXCJQUk9YWVwiLFxuICBcIlBSVURFXCIsXG4gIFwiUFJVTkVcIixcbiAgXCJQU0FMTVwiLFxuICBcIlBTRVVEXCIsXG4gIFwiUFNIQVdcIixcbiAgXCJQU09BU1wiLFxuICBcIlBTWUNIXCIsXG4gIFwiUFVCRVNcIixcbiAgXCJQVUJJQ1wiLFxuICBcIlBVQklTXCIsXG4gIFwiUFVDS1NcIixcbiAgXCJQVURHWVwiLFxuICBcIlBVRkZTXCIsXG4gIFwiUFVGRllcIixcbiAgXCJQVUtFRFwiLFxuICBcIlBVS0VTXCIsXG4gIFwiUFVLS0FcIixcbiAgXCJQVUxMU1wiLFxuICBcIlBVTFBTXCIsXG4gIFwiUFVMUFlcIixcbiAgXCJQVUxTRVwiLFxuICBcIlBVTUFTXCIsXG4gIFwiUFVNUFNcIixcbiAgXCJQVU5DSFwiLFxuICBcIlBVTktTXCIsXG4gIFwiUFVOS1lcIixcbiAgXCJQVU5OWVwiLFxuICBcIlBVTlRTXCIsXG4gIFwiUFVQQUVcIixcbiAgXCJQVVBJTFwiLFxuICBcIlBVUFBZXCIsXG4gIFwiUFVSRUVcIixcbiAgXCJQVVJFUlwiLFxuICBcIlBVUkdFXCIsXG4gIFwiUFVSTFNcIixcbiAgXCJQVVJSU1wiLFxuICBcIlBVUlNFXCIsXG4gIFwiUFVSVFlcIixcbiAgXCJQVVNIWVwiLFxuICBcIlBVU1NZXCIsXG4gIFwiUFVUVFNcIixcbiAgXCJQVVRUWVwiLFxuICBcIlBZR01ZXCIsXG4gIFwiUFlMT05cIixcbiAgXCJQWVJFU1wiLFxuICBcIlFVQUNLXCIsXG4gIFwiUVVBRFNcIixcbiAgXCJRVUFGRlwiLFxuICBcIlFVQUlMXCIsXG4gIFwiUVVBS0VcIixcbiAgXCJRVUFMTVwiLFxuICBcIlFVQVJLXCIsXG4gIFwiUVVBUlRcIixcbiAgXCJRVUFTSFwiLFxuICBcIlFVQVNJXCIsXG4gIFwiUVVBWVNcIixcbiAgXCJRVUVFTlwiLFxuICBcIlFVRUVSXCIsXG4gIFwiUVVFTExcIixcbiAgXCJRVUVSWVwiLFxuICBcIlFVRVNUXCIsXG4gIFwiUVVFVUVcIixcbiAgXCJRVUlDS1wiLFxuICBcIlFVSURTXCIsXG4gIFwiUVVJRVRcIixcbiAgXCJRVUlGRlwiLFxuICBcIlFVSUxMXCIsXG4gIFwiUVVJTFRcIixcbiAgXCJRVUlOVFwiLFxuICBcIlFVSVBTXCIsXG4gIFwiUVVJUFVcIixcbiAgXCJRVUlSRVwiLFxuICBcIlFVSVJLXCIsXG4gIFwiUVVJUlRcIixcbiAgXCJRVUlURVwiLFxuICBcIlFVSVRTXCIsXG4gIFwiUVVPSU5cIixcbiAgXCJRVU9JVFwiLFxuICBcIlFVT1RBXCIsXG4gIFwiUVVPVEVcIixcbiAgXCJRVU9USFwiLFxuICBcIlJBQkJJXCIsXG4gIFwiUkFCSURcIixcbiAgXCJSQUNFRFwiLFxuICBcIlJBQ0VSXCIsXG4gIFwiUkFDRVNcIixcbiAgXCJSQUNLU1wiLFxuICBcIlJBREFSXCIsXG4gIFwiUkFESUlcIixcbiAgXCJSQURJT1wiLFxuICBcIlJBRElYXCIsXG4gIFwiUkFET05cIixcbiAgXCJSQUZUU1wiLFxuICBcIlJBR0VEXCIsXG4gIFwiUkFHRVNcIixcbiAgXCJSQUlEU1wiLFxuICBcIlJBSUxTXCIsXG4gIFwiUkFJTlNcIixcbiAgXCJSQUlOWVwiLFxuICBcIlJBSVNFXCIsXG4gIFwiUkFKQUhcIixcbiAgXCJSQUpBU1wiLFxuICBcIlJBS0VEXCIsXG4gIFwiUkFLRVNcIixcbiAgXCJSQUxMWVwiLFxuICBcIlJBTVBTXCIsXG4gIFwiUkFOQ0hcIixcbiAgXCJSQU5EU1wiLFxuICBcIlJBTkRZXCIsXG4gIFwiUkFOR0VcIixcbiAgXCJSQU5HWVwiLFxuICBcIlJBTktTXCIsXG4gIFwiUkFOVFNcIixcbiAgXCJSQVBFUlwiLFxuICBcIlJBUElEXCIsXG4gIFwiUkFSRVJcIixcbiAgXCJSQVNQU1wiLFxuICBcIlJBU1BZXCIsXG4gIFwiUkFURURcIixcbiAgXCJSQVRFU1wiLFxuICBcIlJBVEhTXCIsXG4gIFwiUkFUSU9cIixcbiAgXCJSQVRUWVwiLFxuICBcIlJBVkVEXCIsXG4gIFwiUkFWRUxcIixcbiAgXCJSQVZFTlwiLFxuICBcIlJBVkVSXCIsXG4gIFwiUkFWRVNcIixcbiAgXCJSQVdFUlwiLFxuICBcIlJBWUVEXCIsXG4gIFwiUkFZT05cIixcbiAgXCJSQVpFRFwiLFxuICBcIlJBWkVTXCIsXG4gIFwiUkFaT1JcIixcbiAgXCJSRUFDSFwiLFxuICBcIlJFQUNUXCIsXG4gIFwiUkVBRFNcIixcbiAgXCJSRUFEWVwiLFxuICBcIlJFQUxNXCIsXG4gIFwiUkVBTFNcIixcbiAgXCJSRUFNU1wiLFxuICBcIlJFQVBTXCIsXG4gIFwiUkVBUk1cIixcbiAgXCJSRUFSU1wiLFxuICBcIlJFQkFSXCIsXG4gIFwiUkVCRUxcIixcbiAgXCJSRUJJRFwiLFxuICBcIlJFQlVTXCIsXG4gIFwiUkVCVVRcIixcbiAgXCJSRUNBUFwiLFxuICBcIlJFQ1RBXCIsXG4gIFwiUkVDVE9cIixcbiAgXCJSRUNVUlwiLFxuICBcIlJFQ1VUXCIsXG4gIFwiUkVESURcIixcbiAgXCJSRURPWFwiLFxuICBcIlJFRFVYXCIsXG4gIFwiUkVFRFNcIixcbiAgXCJSRUVEWVwiLFxuICBcIlJFRUZTXCIsXG4gIFwiUkVFS1NcIixcbiAgXCJSRUVMU1wiLFxuICBcIlJFRVZFXCIsXG4gIFwiUkVGRVJcIixcbiAgXCJSRUZJVFwiLFxuICBcIlJFRklYXCIsXG4gIFwiUkVHQUxcIixcbiAgXCJSRUhBQlwiLFxuICBcIlJFSUZZXCIsXG4gIFwiUkVJR05cIixcbiAgXCJSRUlOU1wiLFxuICBcIlJFTEFYXCIsXG4gIFwiUkVMQVlcIixcbiAgXCJSRUxFVFwiLFxuICBcIlJFTElDXCIsXG4gIFwiUkVNQU5cIixcbiAgXCJSRU1BUFwiLFxuICBcIlJFTUlUXCIsXG4gIFwiUkVNSVhcIixcbiAgXCJSRU5BTFwiLFxuICBcIlJFTkRTXCIsXG4gIFwiUkVORVdcIixcbiAgXCJSRU5UU1wiLFxuICBcIlJFUEFZXCIsXG4gIFwiUkVQRUxcIixcbiAgXCJSRVBMWVwiLFxuICBcIlJFUFJPXCIsXG4gIFwiUkVSQU5cIixcbiAgXCJSRVJVTlwiLFxuICBcIlJFU0VUXCIsXG4gIFwiUkVTSU5cIixcbiAgXCJSRVNUU1wiLFxuICBcIlJFVENIXCIsXG4gIFwiUkVUUk9cIixcbiAgXCJSRVRSWVwiLFxuICBcIlJFVVNFXCIsXG4gIFwiUkVWRUxcIixcbiAgXCJSRVZFVFwiLFxuICBcIlJFVlVFXCIsXG4gIFwiUkhFQVNcIixcbiAgXCJSSEVVTVwiLFxuICBcIlJISU5PXCIsXG4gIFwiUkhVTUJcIixcbiAgXCJSSFlNRVwiLFxuICBcIlJJQUxTXCIsXG4gIFwiUklCQllcIixcbiAgXCJSSUNFRFwiLFxuICBcIlJJQ0VSXCIsXG4gIFwiUklDRVNcIixcbiAgXCJSSURFUlwiLFxuICBcIlJJREVTXCIsXG4gIFwiUklER0VcIixcbiAgXCJSSUZMRVwiLFxuICBcIlJJRlRTXCIsXG4gIFwiUklHSFRcIixcbiAgXCJSSUdJRFwiLFxuICBcIlJJR09SXCIsXG4gIFwiUklMRURcIixcbiAgXCJSSUxFU1wiLFxuICBcIlJJTExFXCIsXG4gIFwiUklMTFNcIixcbiAgXCJSSU1FRFwiLFxuICBcIlJJTUVTXCIsXG4gIFwiUklORFNcIixcbiAgXCJSSU5HU1wiLFxuICBcIlJJTktTXCIsXG4gIFwiUklOU0VcIixcbiAgXCJSSU9UU1wiLFxuICBcIlJJUEVOXCIsXG4gIFwiUklQRVJcIixcbiAgXCJSSVNFTlwiLFxuICBcIlJJU0VSXCIsXG4gIFwiUklTRVNcIixcbiAgXCJSSVNLU1wiLFxuICBcIlJJU0tZXCIsXG4gIFwiUklURVNcIixcbiAgXCJSSVRaWVwiLFxuICBcIlJJVkFMXCIsXG4gIFwiUklWRURcIixcbiAgXCJSSVZFTlwiLFxuICBcIlJJVkVSXCIsXG4gIFwiUklWRVNcIixcbiAgXCJSSVZFVFwiLFxuICBcIlJPQUNIXCIsXG4gIFwiUk9BRFNcIixcbiAgXCJST0FNU1wiLFxuICBcIlJPQU5TXCIsXG4gIFwiUk9BUlNcIixcbiAgXCJST0FTVFwiLFxuICBcIlJPQkVEXCIsXG4gIFwiUk9CRVNcIixcbiAgXCJST0JJTlwiLFxuICBcIlJPQk9UXCIsXG4gIFwiUk9DS1NcIixcbiAgXCJST0NLWVwiLFxuICBcIlJPREVPXCIsXG4gIFwiUk9HRVJcIixcbiAgXCJST0dVRVwiLFxuICBcIlJPSURTXCIsXG4gIFwiUk9JTFNcIixcbiAgXCJST0lMWVwiLFxuICBcIlJPTEVTXCIsXG4gIFwiUk9MTFNcIixcbiAgXCJST01BTlwiLFxuICBcIlJPTVBTXCIsXG4gIFwiUk9ORE9cIixcbiAgXCJST09EU1wiLFxuICBcIlJPT0ZTXCIsXG4gIFwiUk9PS1NcIixcbiAgXCJST09NU1wiLFxuICBcIlJPT01ZXCIsXG4gIFwiUk9PU1RcIixcbiAgXCJST09UU1wiLFxuICBcIlJPUEVEXCIsXG4gIFwiUk9QRVJcIixcbiAgXCJST1BFU1wiLFxuICBcIlJPU0VTXCIsXG4gIFwiUk9TSU5cIixcbiAgXCJST1RPUlwiLFxuICBcIlJPVUdFXCIsXG4gIFwiUk9VR0hcIixcbiAgXCJST1VORFwiLFxuICBcIlJPVVNFXCIsXG4gIFwiUk9VU1RcIixcbiAgXCJST1VURVwiLFxuICBcIlJPVVRTXCIsXG4gIFwiUk9WRURcIixcbiAgXCJST1ZFUlwiLFxuICBcIlJPVkVTXCIsXG4gIFwiUk9XQU5cIixcbiAgXCJST1dEWVwiLFxuICBcIlJPV0VEXCIsXG4gIFwiUk9XRVJcIixcbiAgXCJST1lBTFwiLFxuICBcIlJVQkVTXCIsXG4gIFwiUlVCTEVcIixcbiAgXCJSVUNIRVwiLFxuICBcIlJVRERZXCIsXG4gIFwiUlVERVJcIixcbiAgXCJSVUZGU1wiLFxuICBcIlJVR0JZXCIsXG4gIFwiUlVJTkdcIixcbiAgXCJSVUlOU1wiLFxuICBcIlJVTEVEXCIsXG4gIFwiUlVMRVJcIixcbiAgXCJSVUxFU1wiLFxuICBcIlJVTUJBXCIsXG4gIFwiUlVNRU5cIixcbiAgXCJSVU1NWVwiLFxuICBcIlJVTU9SXCIsXG4gIFwiUlVNUFNcIixcbiAgXCJSVU5FU1wiLFxuICBcIlJVTkdTXCIsXG4gIFwiUlVOTllcIixcbiAgXCJSVU5UU1wiLFxuICBcIlJVUEVFXCIsXG4gIFwiUlVSQUxcIixcbiAgXCJSVVNFU1wiLFxuICBcIlJVU0tTXCIsXG4gIFwiUlVTVFNcIixcbiAgXCJSVVNUWVwiLFxuICBcIlNBQkVSXCIsXG4gIFwiU0FCTEVcIixcbiAgXCJTQUJSQVwiLFxuICBcIlNBQlJFXCIsXG4gIFwiU0FDS1NcIixcbiAgXCJTQURMWVwiLFxuICBcIlNBRkVSXCIsXG4gIFwiU0FGRVNcIixcbiAgXCJTQUdBU1wiLFxuICBcIlNBR0VTXCIsXG4gIFwiU0FISUJcIixcbiAgXCJTQUlMU1wiLFxuICBcIlNBSU5UXCIsXG4gIFwiU0FJVEhcIixcbiAgXCJTQUtFU1wiLFxuICBcIlNBTEFEXCIsXG4gIFwiU0FMRVNcIixcbiAgXCJTQUxMWVwiLFxuICBcIlNBTE9OXCIsXG4gIFwiU0FMU0FcIixcbiAgXCJTQUxUU1wiLFxuICBcIlNBTFRZXCIsXG4gIFwiU0FMVkVcIixcbiAgXCJTQUxWT1wiLFxuICBcIlNBTUJBXCIsXG4gIFwiU0FORFNcIixcbiAgXCJTQU5EWVwiLFxuICBcIlNBTkVSXCIsXG4gIFwiU0FQUFlcIixcbiAgXCJTQVJBTlwiLFxuICBcIlNBUkdFXCIsXG4gIFwiU0FSSVNcIixcbiAgXCJTQVNTWVwiLFxuICBcIlNBVEVEXCIsXG4gIFwiU0FUSU5cIixcbiAgXCJTQVRZUlwiLFxuICBcIlNBVUNFXCIsXG4gIFwiU0FVQ1lcIixcbiAgXCJTQVVOQVwiLFxuICBcIlNBVVRFXCIsXG4gIFwiU0FWRURcIixcbiAgXCJTQVZFUlwiLFxuICBcIlNBVkVTXCIsXG4gIFwiU0FWT1JcIixcbiAgXCJTQVZWWVwiLFxuICBcIlNBV0VEXCIsXG4gIFwiU0FYRVNcIixcbiAgXCJTQ0FCU1wiLFxuICBcIlNDQURTXCIsXG4gIFwiU0NBTERcIixcbiAgXCJTQ0FMRVwiLFxuICBcIlNDQUxQXCIsXG4gIFwiU0NBTFlcIixcbiAgXCJTQ0FNUFwiLFxuICBcIlNDQU1TXCIsXG4gIFwiU0NBTlNcIixcbiAgXCJTQ0FOVFwiLFxuICBcIlNDQVJFXCIsXG4gIFwiU0NBUkZcIixcbiAgXCJTQ0FSUFwiLFxuICBcIlNDQVJTXCIsXG4gIFwiU0NBUllcIixcbiAgXCJTQ0FUU1wiLFxuICBcIlNDRU5FXCIsXG4gIFwiU0NFTlRcIixcbiAgXCJTQ0hNT1wiLFxuICBcIlNDSFdBXCIsXG4gIFwiU0NJT05cIixcbiAgXCJTQ09GRlwiLFxuICBcIlNDT0xEXCIsXG4gIFwiU0NPTkVcIixcbiAgXCJTQ09PUFwiLFxuICBcIlNDT09UXCIsXG4gIFwiU0NPUEVcIixcbiAgXCJTQ09SRVwiLFxuICBcIlNDT1JOXCIsXG4gIFwiU0NPVVJcIixcbiAgXCJTQ09VVFwiLFxuICBcIlNDT1dMXCIsXG4gIFwiU0NPV1NcIixcbiAgXCJTQ1JBTVwiLFxuICBcIlNDUkFQXCIsXG4gIFwiU0NSRVdcIixcbiAgXCJTQ1JJTVwiLFxuICBcIlNDUklQXCIsXG4gIFwiU0NST0RcIixcbiAgXCJTQ1JVQlwiLFxuICBcIlNDUlVNXCIsXG4gIFwiU0NVQkFcIixcbiAgXCJTQ1VESVwiLFxuICBcIlNDVURPXCIsXG4gIFwiU0NVRFNcIixcbiAgXCJTQ1VGRlwiLFxuICBcIlNDVUxMXCIsXG4gIFwiU0NVTVNcIixcbiAgXCJTQ1VSRlwiLFxuICBcIlNDVVpaXCIsXG4gIFwiU0VBTFNcIixcbiAgXCJTRUFNU1wiLFxuICBcIlNFQU1ZXCIsXG4gIFwiU0VBUlNcIixcbiAgXCJTRUFUU1wiLFxuICBcIlNFQlVNXCIsXG4gIFwiU0VDQ09cIixcbiAgXCJTRUNUU1wiLFxuICBcIlNFREFOXCIsXG4gIFwiU0VERVJcIixcbiAgXCJTRURHRVwiLFxuICBcIlNFRFVNXCIsXG4gIFwiU0VFRFNcIixcbiAgXCJTRUVEWVwiLFxuICBcIlNFRUtTXCIsXG4gIFwiU0VFTVNcIixcbiAgXCJTRUVQU1wiLFxuICBcIlNFRVJTXCIsXG4gIFwiU0VHVUVcIixcbiAgXCJTRUlORVwiLFxuICBcIlNFSVpFXCIsXG4gIFwiU0VMQUhcIixcbiAgXCJTRUxGU1wiLFxuICBcIlNFTExTXCIsXG4gIFwiU0VNRU5cIixcbiAgXCJTRU1JU1wiLFxuICBcIlNFTkRTXCIsXG4gIFwiU0VOU0VcIixcbiAgXCJTRVBBTFwiLFxuICBcIlNFUElBXCIsXG4gIFwiU0VQT1lcIixcbiAgXCJTRVBUQVwiLFxuICBcIlNFUkZTXCIsXG4gIFwiU0VSR0VcIixcbiAgXCJTRVJJRlwiLFxuICBcIlNFUlVNXCIsXG4gIFwiU0VSVkVcIixcbiAgXCJTRVJWT1wiLFxuICBcIlNFVFVQXCIsXG4gIFwiU0VWRU5cIixcbiAgXCJTRVZFUlwiLFxuICBcIlNFV0VEXCIsXG4gIFwiU0VXRVJcIixcbiAgXCJTRVhFRFwiLFxuICBcIlNFWEVTXCIsXG4gIFwiU0hBQ0tcIixcbiAgXCJTSEFERVwiLFxuICBcIlNIQURTXCIsXG4gIFwiU0hBRFlcIixcbiAgXCJTSEFGVFwiLFxuICBcIlNIQUdTXCIsXG4gIFwiU0hBSFNcIixcbiAgXCJTSEFLRVwiLFxuICBcIlNIQUtPXCIsXG4gIFwiU0hBS1lcIixcbiAgXCJTSEFMRVwiLFxuICBcIlNIQUxMXCIsXG4gIFwiU0hBTFRcIixcbiAgXCJTSEFNRVwiLFxuICBcIlNIQU1TXCIsXG4gIFwiU0hBTktcIixcbiAgXCJTSEFQRVwiLFxuICBcIlNIQVJEXCIsXG4gIFwiU0hBUkVcIixcbiAgXCJTSEFSS1wiLFxuICBcIlNIQVJQXCIsXG4gIFwiU0hBVkVcIixcbiAgXCJTSEFXTFwiLFxuICBcIlNIQVdNXCIsXG4gIFwiU0hBWVNcIixcbiAgXCJTSEVBRlwiLFxuICBcIlNIRUFSXCIsXG4gIFwiU0hFRFNcIixcbiAgXCJTSEVFTlwiLFxuICBcIlNIRUVQXCIsXG4gIFwiU0hFRVJcIixcbiAgXCJTSEVFVFwiLFxuICBcIlNIRUlLXCIsXG4gIFwiU0hFTEZcIixcbiAgXCJTSEVMTFwiLFxuICBcIlNIRVJEXCIsXG4gIFwiU0hFV1NcIixcbiAgXCJTSElFRFwiLFxuICBcIlNISUVTXCIsXG4gIFwiU0hJRlRcIixcbiAgXCJTSElMTFwiLFxuICBcIlNISU1TXCIsXG4gIFwiU0hJTkVcIixcbiAgXCJTSElOU1wiLFxuICBcIlNISU5ZXCIsXG4gIFwiU0hJUFNcIixcbiAgXCJTSElSRVwiLFxuICBcIlNISVJLXCIsXG4gIFwiU0hJUlJcIixcbiAgXCJTSElSVFwiLFxuICBcIlNISVRTXCIsXG4gIFwiU0hMRVBcIixcbiAgXCJTSE9BTFwiLFxuICBcIlNIT0FUXCIsXG4gIFwiU0hPQ0tcIixcbiAgXCJTSE9FU1wiLFxuICBcIlNIT0pJXCIsXG4gIFwiU0hPTkVcIixcbiAgXCJTSE9PS1wiLFxuICBcIlNIT09TXCIsXG4gIFwiU0hPT1RcIixcbiAgXCJTSE9QU1wiLFxuICBcIlNIT1JFXCIsXG4gIFwiU0hPUk5cIixcbiAgXCJTSE9SVFwiLFxuICBcIlNIT1RTXCIsXG4gIFwiU0hPVVRcIixcbiAgXCJTSE9WRVwiLFxuICBcIlNIT1dOXCIsXG4gIFwiU0hPV1NcIixcbiAgXCJTSE9XWVwiLFxuICBcIlNIUkVEXCIsXG4gIFwiU0hSRVdcIixcbiAgXCJTSFJVQlwiLFxuICBcIlNIUlVHXCIsXG4gIFwiU0hVQ0tcIixcbiAgXCJTSFVOU1wiLFxuICBcIlNIVU5UXCIsXG4gIFwiU0hVU0hcIixcbiAgXCJTSFVUU1wiLFxuICBcIlNIWUVSXCIsXG4gIFwiU0hZTFlcIixcbiAgXCJTSUJZTFwiLFxuICBcIlNJQ0tPXCIsXG4gIFwiU0lDS1NcIixcbiAgXCJTSURFRFwiLFxuICBcIlNJREVTXCIsXG4gIFwiU0lETEVcIixcbiAgXCJTSUVHRVwiLFxuICBcIlNJRVZFXCIsXG4gIFwiU0lHSFNcIixcbiAgXCJTSUdIVFwiLFxuICBcIlNJR01BXCIsXG4gIFwiU0lHTlNcIixcbiAgXCJTSUxLU1wiLFxuICBcIlNJTEtZXCIsXG4gIFwiU0lMTFNcIixcbiAgXCJTSUxMWVwiLFxuICBcIlNJTE9TXCIsXG4gIFwiU0lMVFNcIixcbiAgXCJTSU5DRVwiLFxuICBcIlNJTkVTXCIsXG4gIFwiU0lORVdcIixcbiAgXCJTSU5HRVwiLFxuICBcIlNJTkdTXCIsXG4gIFwiU0lOS1NcIixcbiAgXCJTSU5VU1wiLFxuICBcIlNJUkVEXCIsXG4gIFwiU0lSRUVcIixcbiAgXCJTSVJFTlwiLFxuICBcIlNJUkVTXCIsXG4gIFwiU0lSVVBcIixcbiAgXCJTSVNBTFwiLFxuICBcIlNJU1NZXCIsXG4gIFwiU0lUQVJcIixcbiAgXCJTSVRFRFwiLFxuICBcIlNJVEVTXCIsXG4gIFwiU0lUVVNcIixcbiAgXCJTSVhFU1wiLFxuICBcIlNJWFRIXCIsXG4gIFwiU0lYVFlcIixcbiAgXCJTSVpFRFwiLFxuICBcIlNJWkVTXCIsXG4gIFwiU0tBVEVcIixcbiAgXCJTS0VFVFwiLFxuICBcIlNLRUlOXCIsXG4gIFwiU0tFV1NcIixcbiAgXCJTS0lEU1wiLFxuICBcIlNLSUVEXCIsXG4gIFwiU0tJRVJcIixcbiAgXCJTS0lFU1wiLFxuICBcIlNLSUZGXCIsXG4gIFwiU0tJTExcIixcbiAgXCJTS0lNUFwiLFxuICBcIlNLSU1TXCIsXG4gIFwiU0tJTlNcIixcbiAgXCJTS0lOVFwiLFxuICBcIlNLSVBTXCIsXG4gIFwiU0tJUlRcIixcbiAgXCJTS0lUU1wiLFxuICBcIlNLT0FMXCIsXG4gIFwiU0tVTEtcIixcbiAgXCJTS1VMTFwiLFxuICBcIlNLVU5LXCIsXG4gIFwiU0xBQlNcIixcbiAgXCJTTEFDS1wiLFxuICBcIlNMQUdTXCIsXG4gIFwiU0xBSU5cIixcbiAgXCJTTEFLRVwiLFxuICBcIlNMQU1TXCIsXG4gIFwiU0xBTkdcIixcbiAgXCJTTEFOVFwiLFxuICBcIlNMQVBTXCIsXG4gIFwiU0xBU0hcIixcbiAgXCJTTEFURVwiLFxuICBcIlNMQVRTXCIsXG4gIFwiU0xBVkVcIixcbiAgXCJTTEFZU1wiLFxuICBcIlNMRURTXCIsXG4gIFwiU0xFRUtcIixcbiAgXCJTTEVFUFwiLFxuICBcIlNMRUVUXCIsXG4gIFwiU0xFUFRcIixcbiAgXCJTTEVXU1wiLFxuICBcIlNMSUNFXCIsXG4gIFwiU0xJQ0tcIixcbiAgXCJTTElERVwiLFxuICBcIlNMSUxZXCIsXG4gIFwiU0xJTUVcIixcbiAgXCJTTElNU1wiLFxuICBcIlNMSU1ZXCIsXG4gIFwiU0xJTkdcIixcbiAgXCJTTElOS1wiLFxuICBcIlNMSVBTXCIsXG4gIFwiU0xJVFNcIixcbiAgXCJTTE9CU1wiLFxuICBcIlNMT0VTXCIsXG4gIFwiU0xPR1NcIixcbiAgXCJTTE9NT1wiLFxuICBcIlNMT09QXCIsXG4gIFwiU0xPUEVcIixcbiAgXCJTTE9QU1wiLFxuICBcIlNMT1NIXCIsXG4gIFwiU0xPVEhcIixcbiAgXCJTTE9UU1wiLFxuICBcIlNMT1dTXCIsXG4gIFwiU0xVRURcIixcbiAgXCJTTFVFU1wiLFxuICBcIlNMVUdTXCIsXG4gIFwiU0xVTVBcIixcbiAgXCJTTFVNU1wiLFxuICBcIlNMVU5HXCIsXG4gIFwiU0xVTktcIixcbiAgXCJTTFVSUFwiLFxuICBcIlNMVVJTXCIsXG4gIFwiU0xVU0hcIixcbiAgXCJTTFVUU1wiLFxuICBcIlNMWUVSXCIsXG4gIFwiU0xZTFlcIixcbiAgXCJTTUFDS1wiLFxuICBcIlNNQUxMXCIsXG4gIFwiU01BUlRcIixcbiAgXCJTTUFTSFwiLFxuICBcIlNNRUFSXCIsXG4gIFwiU01FTExcIixcbiAgXCJTTUVMVFwiLFxuICBcIlNNSUxFXCIsXG4gIFwiU01JUktcIixcbiAgXCJTTUlURVwiLFxuICBcIlNNSVRIXCIsXG4gIFwiU01PQ0tcIixcbiAgXCJTTU9HU1wiLFxuICBcIlNNT0tFXCIsXG4gIFwiU01PS1lcIixcbiAgXCJTTU9URVwiLFxuICBcIlNNVVRTXCIsXG4gIFwiU05BQ0tcIixcbiAgXCJTTkFGVVwiLFxuICBcIlNOQUdTXCIsXG4gIFwiU05BSUxcIixcbiAgXCJTTkFLRVwiLFxuICBcIlNOQUtZXCIsXG4gIFwiU05BUFNcIixcbiAgXCJTTkFSRVwiLFxuICBcIlNOQVJGXCIsXG4gIFwiU05BUktcIixcbiAgXCJTTkFSTFwiLFxuICBcIlNORUFLXCIsXG4gIFwiU05FRVJcIixcbiAgXCJTTklERVwiLFxuICBcIlNOSUZGXCIsXG4gIFwiU05JUEVcIixcbiAgXCJTTklQU1wiLFxuICBcIlNOSVRTXCIsXG4gIFwiU05PQlNcIixcbiAgXCJTTk9PRFwiLFxuICBcIlNOT09LXCIsXG4gIFwiU05PT1BcIixcbiAgXCJTTk9PVFwiLFxuICBcIlNOT1JFXCIsXG4gIFwiU05PUlRcIixcbiAgXCJTTk9UU1wiLFxuICBcIlNOT1VUXCIsXG4gIFwiU05PV1NcIixcbiAgXCJTTk9XWVwiLFxuICBcIlNOVUJTXCIsXG4gIFwiU05VQ0tcIixcbiAgXCJTTlVGRlwiLFxuICBcIlNOVUdTXCIsXG4gIFwiU09BS1NcIixcbiAgXCJTT0FQU1wiLFxuICBcIlNPQVBZXCIsXG4gIFwiU09BUlNcIixcbiAgXCJTT0JFUlwiLFxuICBcIlNPQ0tPXCIsXG4gIFwiU09DS1NcIixcbiAgXCJTT0NMRVwiLFxuICBcIlNPREFTXCIsXG4gIFwiU09GQVNcIixcbiAgXCJTT0ZUWVwiLFxuICBcIlNPR0dZXCIsXG4gIFwiU09JTFNcIixcbiAgXCJTT0xBUlwiLFxuICBcIlNPTEVEXCIsXG4gIFwiU09MRVNcIixcbiAgXCJTT0xJRFwiLFxuICBcIlNPTE9TXCIsXG4gIFwiU09MVkVcIixcbiAgXCJTT01BU1wiLFxuICBcIlNPTkFSXCIsXG4gIFwiU09OR1NcIixcbiAgXCJTT05JQ1wiLFxuICBcIlNPTk5ZXCIsXG4gIFwiU09PVEhcIixcbiAgXCJTT09UU1wiLFxuICBcIlNPT1RZXCIsXG4gIFwiU09QUFlcIixcbiAgXCJTT1JFUlwiLFxuICBcIlNPUkVTXCIsXG4gIFwiU09SUllcIixcbiAgXCJTT1JUQVwiLFxuICBcIlNPUlRTXCIsXG4gIFwiU09VTFNcIixcbiAgXCJTT1VORFwiLFxuICBcIlNPVVBTXCIsXG4gIFwiU09VUFlcIixcbiAgXCJTT1VSU1wiLFxuICBcIlNPVVNFXCIsXG4gIFwiU09VVEhcIixcbiAgXCJTT1dFRFwiLFxuICBcIlNQQUNFXCIsXG4gIFwiU1BBQ1lcIixcbiAgXCJTUEFERVwiLFxuICBcIlNQQUtFXCIsXG4gIFwiU1BBTkdcIixcbiAgXCJTUEFOS1wiLFxuICBcIlNQQU5TXCIsXG4gIFwiU1BBUkVcIixcbiAgXCJTUEFSS1wiLFxuICBcIlNQQVJTXCIsXG4gIFwiU1BBU01cIixcbiAgXCJTUEFURVwiLFxuICBcIlNQQVRTXCIsXG4gIFwiU1BBV05cIixcbiAgXCJTUEFZU1wiLFxuICBcIlNQQVpaXCIsXG4gIFwiU1BFQUtcIixcbiAgXCJTUEVBUlwiLFxuICBcIlNQRUNLXCIsXG4gIFwiU1BFQ1NcIixcbiAgXCJTUEVFRFwiLFxuICBcIlNQRUxMXCIsXG4gIFwiU1BFTFRcIixcbiAgXCJTUEVORFwiLFxuICBcIlNQRU5UXCIsXG4gIFwiU1BFUk1cIixcbiAgXCJTUEVXU1wiLFxuICBcIlNQSUNFXCIsXG4gIFwiU1BJQ1NcIixcbiAgXCJTUElDWVwiLFxuICBcIlNQSUVEXCIsXG4gIFwiU1BJRUxcIixcbiAgXCJTUElFU1wiLFxuICBcIlNQSUZGXCIsXG4gIFwiU1BJS0VcIixcbiAgXCJTUElLWVwiLFxuICBcIlNQSUxMXCIsXG4gIFwiU1BJTFRcIixcbiAgXCJTUElORVwiLFxuICBcIlNQSU5TXCIsXG4gIFwiU1BJUkVcIixcbiAgXCJTUElURVwiLFxuICBcIlNQSVRTXCIsXG4gIFwiU1BJVFpcIixcbiAgXCJTUElWU1wiLFxuICBcIlNQTEFUXCIsXG4gIFwiU1BMQVlcIixcbiAgXCJTUExJVFwiLFxuICBcIlNQT0lMXCIsXG4gIFwiU1BPS0VcIixcbiAgXCJTUE9PRlwiLFxuICBcIlNQT09LXCIsXG4gIFwiU1BPT0xcIixcbiAgXCJTUE9PTlwiLFxuICBcIlNQT09SXCIsXG4gIFwiU1BPUkVcIixcbiAgXCJTUE9SVFwiLFxuICBcIlNQT1RTXCIsXG4gIFwiU1BPVVRcIixcbiAgXCJTUFJBVFwiLFxuICBcIlNQUkFZXCIsXG4gIFwiU1BSRUVcIixcbiAgXCJTUFJJR1wiLFxuICBcIlNQUklUXCIsXG4gIFwiU1BST0dcIixcbiAgXCJTUFJVRVwiLFxuICBcIlNQVURTXCIsXG4gIFwiU1BVRURcIixcbiAgXCJTUFVNRVwiLFxuICBcIlNQVU5LXCIsXG4gIFwiU1BVUk5cIixcbiAgXCJTUFVSU1wiLFxuICBcIlNQVVJUXCIsXG4gIFwiU1FVQUJcIixcbiAgXCJTUVVBRFwiLFxuICBcIlNRVUFUXCIsXG4gIFwiU1FVQVdcIixcbiAgXCJTUVVJQlwiLFxuICBcIlNRVUlEXCIsXG4gIFwiU1RBQlNcIixcbiAgXCJTVEFDS1wiLFxuICBcIlNUQUZGXCIsXG4gIFwiU1RBR0VcIixcbiAgXCJTVEFHU1wiLFxuICBcIlNUQUdZXCIsXG4gIFwiU1RBSURcIixcbiAgXCJTVEFJTlwiLFxuICBcIlNUQUlSXCIsXG4gIFwiU1RBS0VcIixcbiAgXCJTVEFMRVwiLFxuICBcIlNUQUxLXCIsXG4gIFwiU1RBTExcIixcbiAgXCJTVEFNUFwiLFxuICBcIlNUQU5EXCIsXG4gIFwiU1RBTktcIixcbiAgXCJTVEFQSFwiLFxuICBcIlNUQVJFXCIsXG4gIFwiU1RBUktcIixcbiAgXCJTVEFSU1wiLFxuICBcIlNUQVJUXCIsXG4gIFwiU1RBU0hcIixcbiAgXCJTVEFURVwiLFxuICBcIlNUQVRTXCIsXG4gIFwiU1RBVkVcIixcbiAgXCJTVEFZU1wiLFxuICBcIlNURUFEXCIsXG4gIFwiU1RFQUtcIixcbiAgXCJTVEVBTFwiLFxuICBcIlNURUFNXCIsXG4gIFwiU1RFRURcIixcbiAgXCJTVEVFTFwiLFxuICBcIlNURUVQXCIsXG4gIFwiU1RFRVJcIixcbiAgXCJTVEVJTlwiLFxuICBcIlNURUxBXCIsXG4gIFwiU1RFTEVcIixcbiAgXCJTVEVNU1wiLFxuICBcIlNURU5PXCIsXG4gIFwiU1RFUFNcIixcbiAgXCJTVEVSTlwiLFxuICBcIlNURVRTXCIsXG4gIFwiU1RFV1NcIixcbiAgXCJTVElDS1wiLFxuICBcIlNUSUVEXCIsXG4gIFwiU1RJRVNcIixcbiAgXCJTVElGRlwiLFxuICBcIlNUSUxFXCIsXG4gIFwiU1RJTExcIixcbiAgXCJTVElMVFwiLFxuICBcIlNUSU5HXCIsXG4gIFwiU1RJTktcIixcbiAgXCJTVElOVFwiLFxuICBcIlNUSVJTXCIsXG4gIFwiU1RPQVNcIixcbiAgXCJTVE9BVFwiLFxuICBcIlNUT0NLXCIsXG4gIFwiU1RPR1lcIixcbiAgXCJTVE9JQ1wiLFxuICBcIlNUT0tFXCIsXG4gIFwiU1RPTEVcIixcbiAgXCJTVE9NQVwiLFxuICBcIlNUT01QXCIsXG4gIFwiU1RPTkVcIixcbiAgXCJTVE9OWVwiLFxuICBcIlNUT09EXCIsXG4gIFwiU1RPT0xcIixcbiAgXCJTVE9PUFwiLFxuICBcIlNUT1BTXCIsXG4gIFwiU1RPUkVcIixcbiAgXCJTVE9SS1wiLFxuICBcIlNUT1JNXCIsXG4gIFwiU1RPUllcIixcbiAgXCJTVE9VUFwiLFxuICBcIlNUT1VUXCIsXG4gIFwiU1RPVkVcIixcbiAgXCJTVE9XU1wiLFxuICBcIlNUUkFQXCIsXG4gIFwiU1RSQVdcIixcbiAgXCJTVFJBWVwiLFxuICBcIlNUUkVQXCIsXG4gIFwiU1RSRVdcIixcbiAgXCJTVFJJUFwiLFxuICBcIlNUUk9QXCIsXG4gIFwiU1RSVU1cIixcbiAgXCJTVFJVVFwiLFxuICBcIlNUVUJTXCIsXG4gIFwiU1RVQ0tcIixcbiAgXCJTVFVEU1wiLFxuICBcIlNUVURZXCIsXG4gIFwiU1RVRkZcIixcbiAgXCJTVFVNUFwiLFxuICBcIlNUVU5HXCIsXG4gIFwiU1RVTktcIixcbiAgXCJTVFVOU1wiLFxuICBcIlNUVU5UXCIsXG4gIFwiU1RZRVNcIixcbiAgXCJTVFlMRVwiLFxuICBcIlNUWUxJXCIsXG4gIFwiU1VBVkVcIixcbiAgXCJTVUNLU1wiLFxuICBcIlNVRURFXCIsXG4gIFwiU1VHQVJcIixcbiAgXCJTVUlOR1wiLFxuICBcIlNVSVRFXCIsXG4gIFwiU1VJVFNcIixcbiAgXCJTVUxGQVwiLFxuICBcIlNVTEtTXCIsXG4gIFwiU1VMS1lcIixcbiAgXCJTVUxMWVwiLFxuICBcIlNVTUFDXCIsXG4gIFwiU1VNTUFcIixcbiAgXCJTVU1QU1wiLFxuICBcIlNVTk5ZXCIsXG4gIFwiU1VOVVBcIixcbiAgXCJTVVBFUlwiLFxuICBcIlNVUFJBXCIsXG4gIFwiU1VSQVNcIixcbiAgXCJTVVJEU1wiLFxuICBcIlNVUkVSXCIsXG4gIFwiU1VSRlNcIixcbiAgXCJTVVJHRVwiLFxuICBcIlNVUkxZXCIsXG4gIFwiU1VTSElcIixcbiAgXCJTVVRSQVwiLFxuICBcIlNXQUJTXCIsXG4gIFwiU1dBR1NcIixcbiAgXCJTV0FJTlwiLFxuICBcIlNXQU1JXCIsXG4gIFwiU1dBTVBcIixcbiAgXCJTV0FOS1wiLFxuICBcIlNXQU5TXCIsXG4gIFwiU1dBUFNcIixcbiAgXCJTV0FSRFwiLFxuICBcIlNXQVJFXCIsXG4gIFwiU1dBUkZcIixcbiAgXCJTV0FSTVwiLFxuICBcIlNXQVJUXCIsXG4gIFwiU1dBU0hcIixcbiAgXCJTV0FUSFwiLFxuICBcIlNXQVRTXCIsXG4gIFwiU1dBWVNcIixcbiAgXCJTV0VBUlwiLFxuICBcIlNXRUFUXCIsXG4gIFwiU1dFREVcIixcbiAgXCJTV0VFUFwiLFxuICBcIlNXRUVUXCIsXG4gIFwiU1dFTExcIixcbiAgXCJTV0VQVFwiLFxuICBcIlNXSUZUXCIsXG4gIFwiU1dJR1NcIixcbiAgXCJTV0lMTFwiLFxuICBcIlNXSU1TXCIsXG4gIFwiU1dJTkVcIixcbiAgXCJTV0lOR1wiLFxuICBcIlNXSVBFXCIsXG4gIFwiU1dJUkxcIixcbiAgXCJTV0lTSFwiLFxuICBcIlNXSVNTXCIsXG4gIFwiU1dJVkVcIixcbiAgXCJTV09PTlwiLFxuICBcIlNXT09QXCIsXG4gIFwiU1dPUkRcIixcbiAgXCJTV09SRVwiLFxuICBcIlNXT1JOXCIsXG4gIFwiU1dVTkdcIixcbiAgXCJTWUxQSFwiLFxuICBcIlNZTkNIXCIsXG4gIFwiU1lOQ1NcIixcbiAgXCJTWU5PRFwiLFxuICBcIlNZUlVQXCIsXG4gIFwiVEFCQllcIixcbiAgXCJUQUJMRVwiLFxuICBcIlRBQk9PXCIsXG4gIFwiVEFCT1JcIixcbiAgXCJUQUJVU1wiLFxuICBcIlRBQ0lUXCIsXG4gIFwiVEFDS1NcIixcbiAgXCJUQUNLWVwiLFxuICBcIlRBQ09TXCIsXG4gIFwiVEFFTFNcIixcbiAgXCJUQUZGWVwiLFxuICBcIlRBSUxTXCIsXG4gIFwiVEFJTlRcIixcbiAgXCJUQUtFTlwiLFxuICBcIlRBS0VSXCIsXG4gIFwiVEFLRVNcIixcbiAgXCJUQUxDU1wiLFxuICBcIlRBTEVTXCIsXG4gIFwiVEFMS1NcIixcbiAgXCJUQUxLWVwiLFxuICBcIlRBTExZXCIsXG4gIFwiVEFMT05cIixcbiAgXCJUQUxVU1wiLFxuICBcIlRBTUVEXCIsXG4gIFwiVEFNRVJcIixcbiAgXCJUQU1FU1wiLFxuICBcIlRBTVBTXCIsXG4gIFwiVEFOR09cIixcbiAgXCJUQU5HU1wiLFxuICBcIlRBTkdZXCIsXG4gIFwiVEFOS1NcIixcbiAgXCJUQU5TWVwiLFxuICBcIlRBUEVEXCIsXG4gIFwiVEFQRVJcIixcbiAgXCJUQVBFU1wiLFxuICBcIlRBUElSXCIsXG4gIFwiVEFQSVNcIixcbiAgXCJUQVJEWVwiLFxuICBcIlRBUkVTXCIsXG4gIFwiVEFSTlNcIixcbiAgXCJUQVJPU1wiLFxuICBcIlRBUk9UXCIsXG4gIFwiVEFSUFNcIixcbiAgXCJUQVJSWVwiLFxuICBcIlRBUlRTXCIsXG4gIFwiVEFTS1NcIixcbiAgXCJUQVNURVwiLFxuICBcIlRBU1RZXCIsXG4gIFwiVEFURVJcIixcbiAgXCJUQVRUWVwiLFxuICBcIlRBVU5UXCIsXG4gIFwiVEFVUEVcIixcbiAgXCJUQVdOWVwiLFxuICBcIlRBWEVEXCIsXG4gIFwiVEFYRVNcIixcbiAgXCJUQVhJU1wiLFxuICBcIlRBWE9MXCIsXG4gIFwiVEFYT05cIixcbiAgXCJURUFDSFwiLFxuICBcIlRFQUtTXCIsXG4gIFwiVEVBTFNcIixcbiAgXCJURUFNU1wiLFxuICBcIlRFQVJTXCIsXG4gIFwiVEVBUllcIixcbiAgXCJURUFTRVwiLFxuICBcIlRFQVRTXCIsXG4gIFwiVEVDSFNcIixcbiAgXCJURUNIWVwiLFxuICBcIlRFRERZXCIsXG4gIFwiVEVFTVNcIixcbiAgXCJURUVOU1wiLFxuICBcIlRFRU5ZXCIsXG4gIFwiVEVFVEhcIixcbiAgXCJURUxFWFwiLFxuICBcIlRFTExTXCIsXG4gIFwiVEVMTFlcIixcbiAgXCJURU1QSVwiLFxuICBcIlRFTVBPXCIsXG4gIFwiVEVNUFNcIixcbiAgXCJURU1QVFwiLFxuICBcIlRFTkNIXCIsXG4gIFwiVEVORFNcIixcbiAgXCJURU5FVFwiLFxuICBcIlRFTk9OXCIsXG4gIFwiVEVOT1JcIixcbiAgXCJURU5TRVwiLFxuICBcIlRFTlRIXCIsXG4gIFwiVEVOVFNcIixcbiAgXCJURVBFRVwiLFxuICBcIlRFUElEXCIsXG4gIFwiVEVSQ0VcIixcbiAgXCJURVJNU1wiLFxuICBcIlRFUk5TXCIsXG4gIFwiVEVSUkFcIixcbiAgXCJURVJSWVwiLFxuICBcIlRFUlNFXCIsXG4gIFwiVEVTTEFcIixcbiAgXCJURVNUU1wiLFxuICBcIlRFU1RZXCIsXG4gIFwiVEVUUkFcIixcbiAgXCJURVhUU1wiLFxuICBcIlRIQU5FXCIsXG4gIFwiVEhBTktcIixcbiAgXCJUSEFOWFwiLFxuICBcIlRIQVdTXCIsXG4gIFwiVEhFRlRcIixcbiAgXCJUSEVNRVwiLFxuICBcIlRIRVJFXCIsXG4gIFwiVEhFUk1cIixcbiAgXCJUSEVTRVwiLFxuICBcIlRIRVRBXCIsXG4gIFwiVEhFV1NcIixcbiAgXCJUSElDS1wiLFxuICBcIlRISUVGXCIsXG4gIFwiVEhJR0hcIixcbiAgXCJUSElORVwiLFxuICBcIlRISU5HXCIsXG4gIFwiVEhJTktcIixcbiAgXCJUSElOU1wiLFxuICBcIlRISVJEXCIsXG4gIFwiVEhPTkdcIixcbiAgXCJUSE9STlwiLFxuICBcIlRIT1NFXCIsXG4gIFwiVEhSRUVcIixcbiAgXCJUSFJFV1wiLFxuICBcIlRIUk9CXCIsXG4gIFwiVEhST0VcIixcbiAgXCJUSFJPV1wiLFxuICBcIlRIUlVNXCIsXG4gIFwiVEhVRFNcIixcbiAgXCJUSFVHU1wiLFxuICBcIlRIVU1CXCIsXG4gIFwiVEhVTVBcIixcbiAgXCJUSFVOS1wiLFxuICBcIlRIWU1FXCIsXG4gIFwiVElBUkFcIixcbiAgXCJUSUJJQVwiLFxuICBcIlRJQ0tTXCIsXG4gIFwiVElEQUxcIixcbiAgXCJUSURFRFwiLFxuICBcIlRJREVTXCIsXG4gIFwiVElFUlNcIixcbiAgXCJUSUZGU1wiLFxuICBcIlRJR0VSXCIsXG4gIFwiVElLRVNcIixcbiAgXCJUSUtJU1wiLFxuICBcIlRJTERFXCIsXG4gIFwiVElMRURcIixcbiAgXCJUSUxFUlwiLFxuICBcIlRJTEVTXCIsXG4gIFwiVElMTFNcIixcbiAgXCJUSUxUSFwiLFxuICBcIlRJTFRTXCIsXG4gIFwiVElNRURcIixcbiAgXCJUSU1FUlwiLFxuICBcIlRJTUVTXCIsXG4gIFwiVElNSURcIixcbiAgXCJUSU5FU1wiLFxuICBcIlRJTkdFXCIsXG4gIFwiVElOR1NcIixcbiAgXCJUSU5OWVwiLFxuICBcIlRJTlRTXCIsXG4gIFwiVElQUFlcIixcbiAgXCJUSVBTWVwiLFxuICBcIlRJUkVEXCIsXG4gIFwiVElSRVNcIixcbiAgXCJUSVJPU1wiLFxuICBcIlRJVEFOXCIsXG4gIFwiVElURVJcIixcbiAgXCJUSVRIRVwiLFxuICBcIlRJVExFXCIsXG4gIFwiVElUUkVcIixcbiAgXCJUSVRUWVwiLFxuICBcIlRJWlpZXCIsXG4gIFwiVE9BRFNcIixcbiAgXCJUT0FEWVwiLFxuICBcIlRPQVNUXCIsXG4gIFwiVE9EQVlcIixcbiAgXCJUT0REWVwiLFxuICBcIlRPRkZTXCIsXG4gIFwiVE9GRllcIixcbiAgXCJUT0dBU1wiLFxuICBcIlRPSUxFXCIsXG4gIFwiVE9JTFNcIixcbiAgXCJUT0tFRFwiLFxuICBcIlRPS0VOXCIsXG4gIFwiVE9LRVNcIixcbiAgXCJUT0xMU1wiLFxuICBcIlRPTUJTXCIsXG4gIFwiVE9NRVNcIixcbiAgXCJUT01NWVwiLFxuICBcIlRPTkFMXCIsXG4gIFwiVE9ORURcIixcbiAgXCJUT05FUlwiLFxuICBcIlRPTkVTXCIsXG4gIFwiVE9OR1NcIixcbiAgXCJUT05JQ1wiLFxuICBcIlRPT0xTXCIsXG4gIFwiVE9PTlNcIixcbiAgXCJUT09USFwiLFxuICBcIlRPT1RTXCIsXG4gIFwiVE9QQVpcIixcbiAgXCJUT1BFRFwiLFxuICBcIlRPUEVTXCIsXG4gIFwiVE9QSUNcIixcbiAgXCJUT1BPSVwiLFxuICBcIlRPUE9TXCIsXG4gIFwiVE9RVUVcIixcbiAgXCJUT1JDSFwiLFxuICBcIlRPUklDXCIsXG4gIFwiVE9SU0lcIixcbiAgXCJUT1JTT1wiLFxuICBcIlRPUlRFXCIsXG4gIFwiVE9SVFNcIixcbiAgXCJUT1JVU1wiLFxuICBcIlRPVEFMXCIsXG4gIFwiVE9URURcIixcbiAgXCJUT1RFTVwiLFxuICBcIlRPVEVTXCIsXG4gIFwiVE9UVFlcIixcbiAgXCJUT1VHSFwiLFxuICBcIlRPVVJTXCIsXG4gIFwiVE9VVFNcIixcbiAgXCJUT1dFTFwiLFxuICBcIlRPV0VSXCIsXG4gIFwiVE9XTlNcIixcbiAgXCJUT1hJQ1wiLFxuICBcIlRPWElOXCIsXG4gIFwiVE9ZRURcIixcbiAgXCJUT1lPTlwiLFxuICBcIlRSQUNFXCIsXG4gIFwiVFJBQ0tcIixcbiAgXCJUUkFDVFwiLFxuICBcIlRSQURFXCIsXG4gIFwiVFJBSUxcIixcbiAgXCJUUkFJTlwiLFxuICBcIlRSQUlUXCIsXG4gIFwiVFJBTVBcIixcbiAgXCJUUkFNU1wiLFxuICBcIlRSQU5TXCIsXG4gIFwiVFJBUFNcIixcbiAgXCJUUkFTSFwiLFxuICBcIlRSQVdMXCIsXG4gIFwiVFJBWVNcIixcbiAgXCJUUkVBRFwiLFxuICBcIlRSRUFUXCIsXG4gIFwiVFJFRURcIixcbiAgXCJUUkVFU1wiLFxuICBcIlRSRUtTXCIsXG4gIFwiVFJFTkRcIixcbiAgXCJUUkVTU1wiLFxuICBcIlRSRVdTXCIsXG4gIFwiVFJFWVNcIixcbiAgXCJUUklBRFwiLFxuICBcIlRSSUFMXCIsXG4gIFwiVFJJQkVcIixcbiAgXCJUUklDRVwiLFxuICBcIlRSSUNLXCIsXG4gIFwiVFJJRURcIixcbiAgXCJUUklFUlwiLFxuICBcIlRSSUVTXCIsXG4gIFwiVFJJS0VcIixcbiAgXCJUUklMTFwiLFxuICBcIlRSSU1TXCIsXG4gIFwiVFJJT1NcIixcbiAgXCJUUklQRVwiLFxuICBcIlRSSVBTXCIsXG4gIFwiVFJJVEVcIixcbiAgXCJUUk9MTFwiLFxuICBcIlRST01QXCIsXG4gIFwiVFJPT1BcIixcbiAgXCJUUk9USFwiLFxuICBcIlRST1RTXCIsXG4gIFwiVFJPVVRcIixcbiAgXCJUUk9WRVwiLFxuICBcIlRST1dTXCIsXG4gIFwiVFJVQ0VcIixcbiAgXCJUUlVDS1wiLFxuICBcIlRSVUVEXCIsXG4gIFwiVFJVRVJcIixcbiAgXCJUUlVFU1wiLFxuICBcIlRSVUxZXCIsXG4gIFwiVFJVTVBcIixcbiAgXCJUUlVOS1wiLFxuICBcIlRSVVNTXCIsXG4gIFwiVFJVU1RcIixcbiAgXCJUUlVUSFwiLFxuICBcIlRSWVNUXCIsXG4gIFwiVFNBUlNcIixcbiAgXCJUVUFOU1wiLFxuICBcIlRVQkFMXCIsXG4gIFwiVFVCQVNcIixcbiAgXCJUVUJCWVwiLFxuICBcIlRVQkVEXCIsXG4gIFwiVFVCRVJcIixcbiAgXCJUVUJFU1wiLFxuICBcIlRVQ0tTXCIsXG4gIFwiVFVGVFNcIixcbiAgXCJUVUxJUFwiLFxuICBcIlRVTExFXCIsXG4gIFwiVFVNTVlcIixcbiAgXCJUVU1PUlwiLFxuICBcIlRVTkFTXCIsXG4gIFwiVFVORURcIixcbiAgXCJUVU5FUlwiLFxuICBcIlRVTkVTXCIsXG4gIFwiVFVOSUNcIixcbiAgXCJUVU5OWVwiLFxuICBcIlRVUExFXCIsXG4gIFwiVFVSQk9cIixcbiAgXCJUVVJEU1wiLFxuICBcIlRVUkZTXCIsXG4gIFwiVFVSRllcIixcbiAgXCJUVVJOU1wiLFxuICBcIlRVUlBTXCIsXG4gIFwiVFVTS1NcIixcbiAgXCJUVVNLWVwiLFxuICBcIlRVVE9SXCIsXG4gIFwiVFVUVElcIixcbiAgXCJUVVRVU1wiLFxuICBcIlRVWEVTXCIsXG4gIFwiVFdBSU5cIixcbiAgXCJUV0FOR1wiLFxuICBcIlRXQVRTXCIsXG4gIFwiVFdFQUtcIixcbiAgXCJUV0VFRFwiLFxuICBcIlRXRUVUXCIsXG4gIFwiVFdFUlBcIixcbiAgXCJUV0lDRVwiLFxuICBcIlRXSUdTXCIsXG4gIFwiVFdJTExcIixcbiAgXCJUV0lORVwiLFxuICBcIlRXSU5LXCIsXG4gIFwiVFdJTlNcIixcbiAgXCJUV0lOWVwiLFxuICBcIlRXSVJMXCIsXG4gIFwiVFdJUlBcIixcbiAgXCJUV0lTVFwiLFxuICBcIlRXSVRTXCIsXG4gIFwiVFdJWFRcIixcbiAgXCJUWUlOR1wiLFxuICBcIlRZS0VTXCIsXG4gIFwiVFlQRURcIixcbiAgXCJUWVBFU1wiLFxuICBcIlRZUE9TXCIsXG4gIFwiVFlSRVNcIixcbiAgXCJUWVJPU1wiLFxuICBcIlRaQVJTXCIsXG4gIFwiVURERVJcIixcbiAgXCJVS0FTRVwiLFxuICBcIlVMQ0VSXCIsXG4gIFwiVUxOQVNcIixcbiAgXCJVTFRSQVwiLFxuICBcIlVNQkVMXCIsXG4gIFwiVU1CRVJcIixcbiAgXCJVTUJSQVwiLFxuICBcIlVNSUFLXCIsXG4gIFwiVU1QRURcIixcbiAgXCJVTkFQVFwiLFxuICBcIlVOQVJNXCIsXG4gIFwiVU5BUllcIixcbiAgXCJVTkJBTlwiLFxuICBcIlVOQkFSXCIsXG4gIFwiVU5CT1hcIixcbiAgXCJVTkNBUFwiLFxuICBcIlVOQ0xFXCIsXG4gIFwiVU5DVVRcIixcbiAgXCJVTkRFUlwiLFxuICBcIlVORElEXCIsXG4gIFwiVU5EVUVcIixcbiAgXCJVTkZFRFwiLFxuICBcIlVORklUXCIsXG4gIFwiVU5ISVBcIixcbiAgXCJVTklGWVwiLFxuICBcIlVOSU9OXCIsXG4gIFwiVU5JVEVcIixcbiAgXCJVTklUU1wiLFxuICBcIlVOSVRZXCIsXG4gIFwiVU5MSVRcIixcbiAgXCJVTk1BTlwiLFxuICBcIlVOTUVUXCIsXG4gIFwiVU5QRUdcIixcbiAgXCJVTlBJTlwiLFxuICBcIlVOUklHXCIsXG4gIFwiVU5TQVlcIixcbiAgXCJVTlNFRVwiLFxuICBcIlVOU0VUXCIsXG4gIFwiVU5TRVhcIixcbiAgXCJVTlRJRVwiLFxuICBcIlVOVElMXCIsXG4gIFwiVU5XRURcIixcbiAgXCJVTlpJUFwiLFxuICBcIlVQRU5EXCIsXG4gIFwiVVBQRURcIixcbiAgXCJVUFBFUlwiLFxuICBcIlVQU0VUXCIsXG4gIFwiVVJCQU5cIixcbiAgXCJVUkdFRFwiLFxuICBcIlVSR0VSXCIsXG4gIFwiVVJHRVNcIixcbiAgXCJVUklORVwiLFxuICBcIlVTQUdFXCIsXG4gIFwiVVNFUlNcIixcbiAgXCJVU0hFUlwiLFxuICBcIlVTSU5HXCIsXG4gIFwiVVNVQUxcIixcbiAgXCJVU1VSUFwiLFxuICBcIlVTVVJZXCIsXG4gIFwiVVRFUklcIixcbiAgXCJVVFRFUlwiLFxuICBcIlVWVUxBXCIsXG4gIFwiVkFDVUFcIixcbiAgXCJWQUdVRVwiLFxuICBcIlZBSUxTXCIsXG4gIFwiVkFMRVNcIixcbiAgXCJWQUxFVFwiLFxuICBcIlZBTElEXCIsXG4gIFwiVkFMT1JcIixcbiAgXCJWQUxVRVwiLFxuICBcIlZBTFZFXCIsXG4gIFwiVkFNUFNcIixcbiAgXCJWQU5FU1wiLFxuICBcIlZBUEVTXCIsXG4gIFwiVkFQSURcIixcbiAgXCJWQVBPUlwiLFxuICBcIlZBU0VTXCIsXG4gIFwiVkFVTFRcIixcbiAgXCJWQVVOVFwiLFxuICBcIlZFRVBTXCIsXG4gIFwiVkVFUlNcIixcbiAgXCJWRUdBTlwiLFxuICBcIlZFSUxTXCIsXG4gIFwiVkVJTlNcIixcbiAgXCJWRUxBUlwiLFxuICBcIlZFTERTXCIsXG4gIFwiVkVMRFRcIixcbiAgXCJWRU5BTFwiLFxuICBcIlZFTkRTXCIsXG4gIFwiVkVOT01cIixcbiAgXCJWRU5UU1wiLFxuICBcIlZFTlVFXCIsXG4gIFwiVkVSQlNcIixcbiAgXCJWRVJHRVwiLFxuICBcIlZFUlNFXCIsXG4gIFwiVkVSU09cIixcbiAgXCJWRVJTVFwiLFxuICBcIlZFUlZFXCIsXG4gIFwiVkVTVFNcIixcbiAgXCJWRVRDSFwiLFxuICBcIlZFWEVEXCIsXG4gIFwiVkVYRVNcIixcbiAgXCJWSUFMU1wiLFxuICBcIlZJQU5EXCIsXG4gIFwiVklCRVNcIixcbiAgXCJWSUNBUlwiLFxuICBcIlZJQ0VTXCIsXG4gIFwiVklERU9cIixcbiAgXCJWSUVXU1wiLFxuICBcIlZJR0lMXCIsXG4gIFwiVklHT1JcIixcbiAgXCJWSUxFUlwiLFxuICBcIlZJTExBXCIsXG4gIFwiVklMTElcIixcbiAgXCJWSU5DQVwiLFxuICBcIlZJTkVTXCIsXG4gIFwiVklOWUxcIixcbiAgXCJWSU9MQVwiLFxuICBcIlZJT0xTXCIsXG4gIFwiVklQRVJcIixcbiAgXCJWSVJBTFwiLFxuICBcIlZJUkVPXCIsXG4gIFwiVklSVVNcIixcbiAgXCJWSVNBU1wiLFxuICBcIlZJU0VTXCIsXG4gIFwiVklTSVRcIixcbiAgXCJWSVNPUlwiLFxuICBcIlZJU1RBXCIsXG4gIFwiVklUQUxcIixcbiAgXCJWSVRBU1wiLFxuICBcIlZJVkFTXCIsXG4gIFwiVklWSURcIixcbiAgXCJWSVhFTlwiLFxuICBcIlZJWk9SXCIsXG4gIFwiVk9DQUxcIixcbiAgXCJWT0RLQVwiLFxuICBcIlZPR1VFXCIsXG4gIFwiVk9JQ0VcIixcbiAgXCJWT0lEU1wiLFxuICBcIlZPSUxBXCIsXG4gIFwiVk9JTEVcIixcbiAgXCJWT0xUU1wiLFxuICBcIlZPTUlUXCIsXG4gIFwiVk9URURcIixcbiAgXCJWT1RFUlwiLFxuICBcIlZPVEVTXCIsXG4gIFwiVk9VQ0hcIixcbiAgXCJWT1dFRFwiLFxuICBcIlZPV0VMXCIsXG4gIFwiVk9YRUxcIixcbiAgXCJWUk9PTVwiLFxuICBcIlZVTFZBXCIsXG4gIFwiVllJTkdcIixcbiAgXCJXQUNLT1wiLFxuICBcIldBQ0tZXCIsXG4gIFwiV0FERURcIixcbiAgXCJXQURFUlwiLFxuICBcIldBREVTXCIsXG4gIFwiV0FESVNcIixcbiAgXCJXQUZFUlwiLFxuICBcIldBRlRTXCIsXG4gIFwiV0FHRURcIixcbiAgXCJXQUdFUlwiLFxuICBcIldBR0VTXCIsXG4gIFwiV0FHT05cIixcbiAgXCJXQUhPT1wiLFxuICBcIldBSUZTXCIsXG4gIFwiV0FJTFNcIixcbiAgXCJXQUlTVFwiLFxuICBcIldBSVRTXCIsXG4gIFwiV0FJVkVcIixcbiAgXCJXQUtFRFwiLFxuICBcIldBS0VOXCIsXG4gIFwiV0FLRVNcIixcbiAgXCJXQUxFU1wiLFxuICBcIldBTEtTXCIsXG4gIFwiV0FMTFNcIixcbiAgXCJXQUxUWlwiLFxuICBcIldBTkRTXCIsXG4gIFwiV0FORURcIixcbiAgXCJXQU5FU1wiLFxuICBcIldBTlRTXCIsXG4gIFwiV0FSRFNcIixcbiAgXCJXQVJFU1wiLFxuICBcIldBUk1TXCIsXG4gIFwiV0FSTlNcIixcbiAgXCJXQVJQU1wiLFxuICBcIldBUlRTXCIsXG4gIFwiV0FTSFlcIixcbiAgXCJXQVNQU1wiLFxuICBcIldBU1BZXCIsXG4gIFwiV0FTVEVcIixcbiAgXCJXQVRDSFwiLFxuICBcIldBVEVSXCIsXG4gIFwiV0FUVFNcIixcbiAgXCJXQVZFRFwiLFxuICBcIldBVkVSXCIsXG4gIFwiV0FWRVNcIixcbiAgXCJXQVhFRFwiLFxuICBcIldBWEVOXCIsXG4gIFwiV0FYRVNcIixcbiAgXCJXQVpPT1wiLFxuICBcIldFQUxTXCIsXG4gIFwiV0VBUlNcIixcbiAgXCJXRUFSWVwiLFxuICBcIldFQVZFXCIsXG4gIFwiV0VCRVJcIixcbiAgXCJXRURHRVwiLFxuICBcIldFRURTXCIsXG4gIFwiV0VFRFlcIixcbiAgXCJXRUVLU1wiLFxuICBcIldFRU5ZXCIsXG4gIFwiV0VFUFNcIixcbiAgXCJXRUVQWVwiLFxuICBcIldFRVNUXCIsXG4gIFwiV0VGVFNcIixcbiAgXCJXRUlHSFwiLFxuICBcIldFSVJEXCIsXG4gIFwiV0VJUlNcIixcbiAgXCJXRUxDSFwiLFxuICBcIldFTERTXCIsXG4gIFwiV0VMTFNcIixcbiAgXCJXRUxTSFwiLFxuICBcIldFTFRTXCIsXG4gIFwiV0VOQ0hcIixcbiAgXCJXRU5EU1wiLFxuICBcIldIQUNLXCIsXG4gIFwiV0hBTEVcIixcbiAgXCJXSEFNU1wiLFxuICBcIldIQU5HXCIsXG4gIFwiV0hBUkZcIixcbiAgXCJXSEVBTFwiLFxuICBcIldIRUFUXCIsXG4gIFwiV0hFRUxcIixcbiAgXCJXSEVMS1wiLFxuICBcIldIRUxNXCIsXG4gIFwiV0hFTFBcIixcbiAgXCJXSEVSRVwiLFxuICBcIldIRVRTXCIsXG4gIFwiV0hJQ0hcIixcbiAgXCJXSElGRlwiLFxuICBcIldISUxFXCIsXG4gIFwiV0hJTVNcIixcbiAgXCJXSElORVwiLFxuICBcIldISU5ZXCIsXG4gIFwiV0hJUFNcIixcbiAgXCJXSElSTFwiLFxuICBcIldISVJSXCIsXG4gIFwiV0hJUlNcIixcbiAgXCJXSElTS1wiLFxuICBcIldISVNUXCIsXG4gIFwiV0hJVEVcIixcbiAgXCJXSElUU1wiLFxuICBcIldISVpaXCIsXG4gIFwiV0hPTEVcIixcbiAgXCJXSE9NUFwiLFxuICBcIldIT09QXCIsXG4gIFwiV0hPUFNcIixcbiAgXCJXSE9SRVwiLFxuICBcIldIT1JMXCIsXG4gIFwiV0hPU0VcIixcbiAgXCJXSE9TT1wiLFxuICBcIldIVU1QXCIsXG4gIFwiV0lDS1NcIixcbiAgXCJXSURFTlwiLFxuICBcIldJREVSXCIsXG4gIFwiV0lET1dcIixcbiAgXCJXSURUSFwiLFxuICBcIldJRUxEXCIsXG4gIFwiV0lGRVlcIixcbiAgXCJXSUxDT1wiLFxuICBcIldJTERTXCIsXG4gIFwiV0lMRURcIixcbiAgXCJXSUxFU1wiLFxuICBcIldJTExTXCIsXG4gIFwiV0lMVFNcIixcbiAgXCJXSU1QU1wiLFxuICBcIldJTVBZXCIsXG4gIFwiV0lOQ0VcIixcbiAgXCJXSU5DSFwiLFxuICBcIldJTkRTXCIsXG4gIFwiV0lORFlcIixcbiAgXCJXSU5FRFwiLFxuICBcIldJTkVTXCIsXG4gIFwiV0lOR1NcIixcbiAgXCJXSU5LU1wiLFxuICBcIldJTk9TXCIsXG4gIFwiV0lQRURcIixcbiAgXCJXSVBFUlwiLFxuICBcIldJUEVTXCIsXG4gIFwiV0lSRURcIixcbiAgXCJXSVJFU1wiLFxuICBcIldJU0VEXCIsXG4gIFwiV0lTRVJcIixcbiAgXCJXSVNFU1wiLFxuICBcIldJU1BTXCIsXG4gIFwiV0lTUFlcIixcbiAgXCJXSVRDSFwiLFxuICBcIldJVFRZXCIsXG4gIFwiV0lWRVNcIixcbiAgXCJXSVpFTlwiLFxuICBcIldPS0VOXCIsXG4gIFwiV09MRFNcIixcbiAgXCJXT01BTlwiLFxuICBcIldPTUJTXCIsXG4gIFwiV09NRU5cIixcbiAgXCJXT05LU1wiLFxuICBcIldPTktZXCIsXG4gIFwiV09OVFNcIixcbiAgXCJXT09EU1wiLFxuICBcIldPT0RZXCIsXG4gIFwiV09PRURcIixcbiAgXCJXT09GU1wiLFxuICBcIldPT0xTXCIsXG4gIFwiV09PTFlcIixcbiAgXCJXT09TSFwiLFxuICBcIldPT1pZXCIsXG4gIFwiV09SRFNcIixcbiAgXCJXT1JEWVwiLFxuICBcIldPUktTXCIsXG4gIFwiV09STERcIixcbiAgXCJXT1JNU1wiLFxuICBcIldPUk1ZXCIsXG4gIFwiV09SUllcIixcbiAgXCJXT1JTRVwiLFxuICBcIldPUlNUXCIsXG4gIFwiV09SVEhcIixcbiAgXCJXT1JUU1wiLFxuICBcIldPVUxEXCIsXG4gIFwiV09VTkRcIixcbiAgXCJXT1ZFTlwiLFxuICBcIldPV0VEXCIsXG4gIFwiV09XRUVcIixcbiAgXCJXUkFDS1wiLFxuICBcIldSQVBTXCIsXG4gIFwiV1JBVEhcIixcbiAgXCJXUkVBS1wiLFxuICBcIldSRUNLXCIsXG4gIFwiV1JFTlNcIixcbiAgXCJXUkVTVFwiLFxuICBcIldSSUVSXCIsXG4gIFwiV1JJTkdcIixcbiAgXCJXUklTVFwiLFxuICBcIldSSVRFXCIsXG4gIFwiV1JJVFNcIixcbiAgXCJXUk9OR1wiLFxuICBcIldST1RFXCIsXG4gIFwiV1JPVEhcIixcbiAgXCJXUlVOR1wiLFxuICBcIldSWUVSXCIsXG4gIFwiV1JZTFlcIixcbiAgXCJXVVJTVFwiLFxuICBcIlhFTk9OXCIsXG4gIFwiWEVST1hcIixcbiAgXCJYWUxFTVwiLFxuICBcIllBQ0hUXCIsXG4gIFwiWUFIT09cIixcbiAgXCJZQU5LU1wiLFxuICBcIllBUkRTXCIsXG4gIFwiWUFSTlNcIixcbiAgXCJZQVdFRFwiLFxuICBcIllBV0xTXCIsXG4gIFwiWUFXTlNcIixcbiAgXCJZQVdOWVwiLFxuICBcIllBV1BTXCIsXG4gIFwiWUVBUk5cIixcbiAgXCJZRUFSU1wiLFxuICBcIllFQVNUXCIsXG4gIFwiWUVDQ0hcIixcbiAgXCJZRUxMU1wiLFxuICBcIllFTFBTXCIsXG4gIFwiWUVOVEFcIixcbiAgXCJZRVJCQVwiLFxuICBcIllFU0VTXCIsXG4gIFwiWUlFTERcIixcbiAgXCJZSUtFU1wiLFxuICBcIllJUEVTXCIsXG4gIFwiWU9CQk9cIixcbiAgXCJZT0RFTFwiLFxuICBcIllPR0lTXCIsXG4gIFwiWU9LRURcIixcbiAgXCJZT0tFTFwiLFxuICBcIllPS0VTXCIsXG4gIFwiWU9MS1NcIixcbiAgXCJZT1VOR1wiLFxuICBcIllPVVJOXCIsXG4gIFwiWU9VUlNcIixcbiAgXCJZT1VTRVwiLFxuICBcIllPVVRIXCIsXG4gIFwiWU9XTFNcIixcbiAgXCJZT1lPU1wiLFxuICBcIllVQ0NBXCIsXG4gIFwiWVVDS1lcIixcbiAgXCJZVUtLWVwiLFxuICBcIllVTU1ZXCIsXG4gIFwiWVVSVFNcIixcbiAgXCJaQVBQWVwiLFxuICBcIlpBWUlOXCIsXG4gIFwiWkVCUkFcIixcbiAgXCJaRUJVU1wiLFxuICBcIlpFUk9TXCIsXG4gIFwiWkVTVFNcIixcbiAgXCJaRVRBU1wiLFxuICBcIlpJTENIXCIsXG4gIFwiWklOQ1NcIixcbiAgXCJaSU5HU1wiLFxuICBcIlpJUFBZXCIsXG4gIFwiWkxPVFlcIixcbiAgXCJaT05BTFwiLFxuICBcIlpPTkVEXCIsXG4gIFwiWk9ORVNcIixcbiAgXCJaT05LU1wiLFxuICBcIlpPT01TXCIsXG4gIFwiWk9XSUVcIixcbl1cblxubW9kdWxlLmV4cG9ydHMgPSB7IFdPUkRTIH1cbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMF9fXyA9IG5ldyBVUkwoXCIuLi9mb250cy9CTEFEUk1GXy5UVEZcIiwgaW1wb3J0Lm1ldGEudXJsKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMV9fXyA9IG5ldyBVUkwoXCIuLi9mb250cy9PeGFuaXVtLVZhcmlhYmxlRm9udF93Z2h0LnR0ZlwiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8xX19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMV9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYDpyb290IHtcbiAgLS1kZWZhdWx0OiAjMTIxMjEzO1xuICAtLXRleHQ6ICNmZmZmZmY7XG4gIC0tZ3JheTE6ICM0YTRhNGM7XG4gIC0tZ3JheTI6ICMyYTJhMmM7XG4gIC0tYnJCbHVlMTogIzE3YWFkODtcbiAgLS1ickJsdWUyOiAjMDE3Y2IwO1xuICAtLWJyQmx1ZTM6ICMwYjYxYTg7XG4gIC0tYnJPcmFuZ2UxOiAjZmU5MjAwO1xuICAvKmVlNjEwYSovXG4gIC0tYnJPcmFuZ2UyOiAjZWU2MTBhO1xuICAtLWJyT3JhbmdlMzogI2VhNDEwYjtcbn1cblxuQGZvbnQtZmFjZSB7XG4gIGZvbnQtZmFtaWx5OiBcIkJsYWRlIFJ1bm5lclwiO1xuICBzcmM6IHVybCgke19fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX199KTtcbn1cbkBmb250LWZhY2Uge1xuICBmb250LWZhbWlseTogXCJPeGFuaXVtXCI7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgc3JjOiB1cmwoJHtfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8xX19ffSk7XG59XG5odG1sLFxuYm9keSB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRlZmF1bHQpO1xuICBmb250LWZhbWlseTogXCJPeGFuaXVtXCIsIGN1cnNpdmU7XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuXG5kaXYge1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG59XG5cbi5zdXBlcmNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIG1pbi13aWR0aDogMzIwcHg7XG4gIG1heC13aWR0aDogNTQwcHg7XG4gIG1hcmdpbjogMWNxdyBhdXRvO1xuICBjb250YWluZXItdHlwZTogaW5saW5lLXNpemU7XG59XG5cbi5wYWdlQ29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgZmxleC1zaHJpbms6IDA7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgLyptYXJnaW46IDFjcXcgYXV0bztcbiAgbWluLXdpZHRoOiAzMjBweDtcbiAgbWF4LXdpZHRoOiA1NDBweDsqL1xuICB3aWR0aDogMTAwJTtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAvKmdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyOyovXG4gIC8qZ3JpZC10ZW1wbGF0ZS1yb3dzOiBhdXRvIGF1dG8gMWZyOyovXG4gIC8qZ3JpZC1hdXRvLXJvd3M6IGF1dG87Ki9cbiAgY29udGFpbmVyLXR5cGU6IGlubGluZS1zaXplO1xuICBoZWlnaHQ6IDE1NWNxdztcbn1cblxuLmhlYWRlciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXg6IDAgMSBhdXRvO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgY29sb3I6IHZhcigtLWJyT3JhbmdlMik7XG4gIGZvbnQtZmFtaWx5OiBcIkJsYWRlIFJ1bm5lclwiO1xuICBmb250LXNpemU6IDhjcXc7XG4gIHBhZGRpbmc6IDJjcXcgMDtcbiAgbWFyZ2luOiAxY3F3O1xuICBib3JkZXItYm90dG9tOiAwLjVjcXcgc29saWQgdmFyKC0tZ3JheTEpO1xuICBoZWlnaHQ6IDhjcXc7XG4gIGJvcmRlci10b3A6IDAuNWNxdyBzb2xpZCB2YXIoLS1kZWZhdWx0KTtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gIC1tcy11c2VyLXNlbGVjdDogbm9uZTtcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XG59XG5cbi5tZXNzYWdlIHtcbiAgY29sb3I6IHZhcigtLWJyT3JhbmdlMik7XG4gIGZvbnQtZmFtaWx5OiBcIk94YW5pdW1cIiwgY3Vyc2l2ZTtcbiAgZm9udC1zaXplOiA2Y3F3O1xuICBwYWRkaW5nOiAyY3F3IDA7XG4gIG1hcmdpbjogMWNxdztcbiAgaGVpZ2h0OiA4Y3F3O1xuICBib3JkZXItYm90dG9tOiAwLjVjcXcgc29saWQgdmFyKC0tYnJPcmFuZ2UyKTtcbiAgYm9yZGVyLXRvcDogMC41Y3F3IHNvbGlkIHZhcigtLWJyT3JhbmdlMik7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRlZmF1bHQpO1xufVxuXG4uZ2FtZUNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBmbGV4OiAwIDEgYXV0bztcbiAgd2lkdGg6IDEwMGNxdztcbiAgbWFyZ2luOiBhdXRvO1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgLW1zLXVzZXItc2VsZWN0OiBub25lO1xuICB1c2VyLXNlbGVjdDogbm9uZTtcbn1cblxuLnRpbGVHcmlkIHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgd2lkdGg6IDc1Y3F3O1xuICBncmlkLXRlbXBsYXRlLXJvd3M6IDFmciAxZnIgMWZyIDFmciAxZnIgMWZyO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnIgMWZyIDFmciAxZnI7XG4gIGdyaWQtZ2FwOiAxLjVjcXc7XG4gIG1hcmdpbjogMC41Y3F3IDA7XG59XG5cbi50aWxlIHtcbiAgYXNwZWN0LXJhdGlvOiAxLzE7XG4gIGJvcmRlcjogMC41Y3F3IHNvbGlkIHZhcigtLWdyYXkxKTtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgY29sb3I6IHZhcigtLXRleHQpO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBkaXNwbGF5OiBncmlkO1xuICBwbGFjZS1pdGVtczogY2VudGVyO1xuICBmb250LWZhbWlseTogXCJPeGFuaXVtXCIsIGN1cnNpdmU7XG4gIGZvbnQtc2l6ZTogN2Nxdztcbn1cblxuLnRpbGVXYXRlck1hcmsge1xuICBmb250LWZhbWlseTogXCJCbGFkZSBSdW5uZXJcIjtcbiAgY29sb3I6IHZhcigtLWdyYXkyKTtcbn1cblxuLmtleWJvYXJkQ29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleDogMCAxIGF1dG87XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBtYXJnaW46IGF1dG87XG4gIG1hcmdpbi10b3A6IDJjcXc7XG4gIHdpZHRoOiAxMDBjcXc7XG59XG5cbi5rZXlib2FyZEdyaWQge1xuICBkaXNwbGF5OiBncmlkO1xuICB3aWR0aDogOThjcXc7XG4gIGdyaWQtdGVtcGxhdGUtcm93czogMWZyIDFmciAxZnI7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xuICBncmlkLXJvdy1nYXA6IDEuNWNxdztcbn1cblxuLmtleWJvYXJkUm93MSB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIHdpZHRoOiA5OGNxdztcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnI7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmciAxZnIgMWZyIDFmciAxZnIgMWZyIDFmciAxZnIgMWZyO1xuICBncmlkLWNvbHVtbi1nYXA6IDEuNWNxdztcbn1cblxuLmtleWJvYXJkUm93MiB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIHdpZHRoOiA5OGNxdztcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnI7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMC41ZnIgMWZyIDFmciAxZnIgMWZyIDFmciAxZnIgMWZyIDFmciAxZnIgMC41ZnI7XG4gIGdyaWQtY29sdW1uLWdhcDogMS41Y3F3O1xufVxuXG4ua2V5Ym9hcmRSb3czIHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgd2lkdGg6IDk4Y3F3O1xuICBncmlkLXRlbXBsYXRlLXJvd3M6IDFmcjtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxLjVmciAxZnIgMWZyIDFmciAxZnIgMWZyIDFmciAxZnIgMS41ZnI7XG4gIGdyaWQtY29sdW1uLWdhcDogMS41Y3F3O1xufVxuXG4ua2V5LFxuLmtleVNwYWNlciB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGJvcmRlcjogMC4yNWNxdyBzb2xpZCB2YXIoLS10ZXh0KTtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBmb250LWZhbWlseTogXCJPeGFuaXVtXCIsIGN1cnNpdmU7XG4gIGZvbnQtc2l6ZTogMy41Y3F3O1xuICBmb250LXdlaWdodDogYm9sZGVyO1xuICBwbGFjZS1pdGVtczogY2VudGVyO1xuICBwYWRkaW5nOiAwIDA7XG4gIGJvcmRlci1yYWRpdXM6IDEuNWNxdztcbiAgY29sb3I6IHZhcigtLXRleHQpO1xuICBhc3BlY3QtcmF0aW86IDEvMS4yO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kZWZhdWx0KTtcbiAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgLW1zLXVzZXItc2VsZWN0OiBub25lO1xuICB1c2VyLXNlbGVjdDogbm9uZTtcbn1cblxuLmtleVNwYWNlciB7XG4gIHZpc2liaWxpdHk6IGhpZGRlbjtcbiAgYXNwZWN0LXJhdGlvOiAxLzIuNDtcbn1cblxuI0JBQ0tTUEFDRSxcbiNFTlRFUiB7XG4gIGFzcGVjdC1yYXRpbzogMy8yLjQ7XG4gIGZvbnQtc2l6ZTogMi41Y3F3O1xufVxuXG4udGlsZUNsb3NlIHtcbiAgY29sb3I6IHZhcigtLWJyT3JhbmdlMik7XG4gIGJvcmRlcjogMC41Y3F3IHNvbGlkIHZhcigtLWJyT3JhbmdlMik7XG59XG5cbi50aWxlSGl0IHtcbiAgY29sb3I6IHZhcigtLWJyQmx1ZTEpO1xuICBib3JkZXI6IDAuNWNxdyBzb2xpZCB2YXIoLS1ickJsdWUxKTtcbn1cblxuLnRpbGVNaXNzIHtcbiAgY29sb3I6IHZhcigtLWdyYXkxKTtcbiAgYm9yZGVyOiAwLjVjcXcgc29saWQgdmFyKC0tZ3JheTEpO1xufVxuXG4uZ2FtZU92ZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ickJsdWUxKTtcbiAgY29sb3I6IHZhcigtLWRlZmF1bHQpO1xuICBib3JkZXI6IDAuMjVjcXcgc29saWQgdmFyKC0tYnJCbHVlMSk7XG59XG5cbi5yZXNldCB7XG4gIGFuaW1hdGlvbjogMXMgbGluZWFyIHJlc2V0dGluZztcbn1cblxuQGtleWZyYW1lcyByZXNldHRpbmcge1xuICAwJSB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGVYKDBkZWcpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGVYKDkwZGVnKTtcbiAgfVxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZVgoMGRlZyk7XG4gIH1cbn1cbi5tb2RhbENvbnRhaW5lciB7XG4gIGRpc3BsYXk6IG5vbmU7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgei1pbmRleDogMTtcbiAgcGFkZGluZy10b3A6IDE1Y3F3O1xuICB0b3A6IDA7XG4gIHJpZ2h0OiAwO1xuICBsZWZ0OiAwO1xuICBib3R0b206IDA7XG4gIHdpZHRoOiAxMDBjcXc7XG4gIG92ZXJmbG93OiBhdXRvO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDE4LCAxOCwgMTksIDAuNik7XG59XG5cbi5tb2RhbENvbnRlbnQge1xuICBmb250LWZhbWlseTogXCJPeGFuaXVtXCIsIGN1cnNpdmU7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU0LCAxNDYsIDAsIDAuMyk7XG4gIGNvbG9yOiB2YXIoLS1ick9yYW5nZTEpO1xuICBtYXJnaW46IGF1dG87XG4gIHBhZGRpbmc6IDEuNWNxdztcbiAgcGFkZGluZy10b3A6IDA7XG4gIHdpZHRoOiA4MGNxdztcbiAgbWF4LXdpZHRoOiA4MGNxdztcbiAgbWF4LWhlaWdodDogOTBjcXc7XG4gIGZvbnQtc2l6ZTogNmNxdztcbiAgb3ZlcmZsb3c6IGF1dG87XG59XG5cbi5tb2RhbENvbnRlbnQgaHIge1xuICBib3JkZXI6IDAuMjVjcXcgc29saWQgdmFyKC0tYnJPcmFuZ2UxKTtcbiAgbWFyZ2luLXRvcDogM2Nxdztcbn1cblxuLm1vZGFsVGl0bGUge1xuICBmb250LWZhbWlseTogXCJPeGFuaXVtXCIsIGN1cnNpdmU7XG4gIG1hcmdpbjogMmNxdyAwIDBjcXc7XG4gIHBhZGRpbmc6IDJjcXcgMCAxY3F3O1xufVxuXG4ubW9kYWxDb250ZW50SXRlbSB7XG4gIGZvbnQtZmFtaWx5OiBcIk94YW5pdW1cIiwgY3Vyc2l2ZTtcbiAgbWFyZ2luOiAwIDA7XG4gIHBhZGRpbmc6IDFjcXcgMmNxdztcbiAgZm9udC1zaXplOiA1Y3F3O1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xufVxuXG4uY2xvc2Uge1xuICBjb2xvcjogdmFyKC0tYnJPcmFuZ2UxKTtcbiAgZmxvYXQ6IHJpZ2h0O1xuICBtYXJnaW4tcmlnaHQ6IDEuNWNxdztcbiAgZm9udC1zaXplOiA2Y3F3O1xuICBmb250LXdlaWdodDogYm9sZDtcbn1cblxuLmNsb3NlOmhvdmVyLFxuLmNsb3NlOmZvY3VzIHtcbiAgY29sb3I6IHZhcigtLWJyT3JhbmdlMyk7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG4uc3RhdFRhYmxlIHtcbiAgbWFyZ2luOiAwIGF1dG8gMS41Y3F3O1xufVxuXG4uc3RhdFRhYmxlIHRkIHtcbiAgcGFkZGluZzogMCA0Y3F3O1xufVxuXG4uc3RhdE51bSB7XG4gIHRleHQtYWxpZ246IHJpZ2h0O1xufVxuXG46Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgd2lkdGg6IDJjcXc7XG59XG5cbjo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2sge1xuICBiYWNrZ3JvdW5kOiByZ2JhKDI1NCwgMTQ2LCAwLCAwLjIpO1xufVxuXG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcbiAgYmFja2dyb3VuZDogcmdiYSgyNTQsIDE0NiwgMCwgMC40KTtcbn1cblxuOjotd2Via2l0LXNjcm9sbGJhci10aHVtYjpob3ZlciB7XG4gIGJhY2tncm91bmQ6IHZhcigtLWJyT3JhbmdlMSk7XG59XG5cbi5tb2RhbENvbnRlbnQge1xuICBzY3JvbGxiYXItY29sb3I6IHJnYmEoMjU0LCAxNDYsIDAsIDAuNikgcmdiYSgyNTQsIDE0NiwgMCwgMC4xKTtcbn1gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL2NsaWVudC9zdHlsZS9tYWluLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLGtCQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrQkFBQTtFQUNBLGtCQUFBO0VBQ0Esa0JBQUE7RUFDQSxvQkFBQTtFQUNBLFNBQUE7RUFDQSxvQkFBQTtFQUNBLG9CQUFBO0FBQ0Y7O0FBRUE7RUFDRSwyQkFBQTtFQUNBLDRDQUFBO0FBQ0Y7QUFFQTtFQUNFLHNCQUFBO0VBQ0Esa0JBQUE7RUFDQSxtQkFBQTtFQUNBLDRDQUFBO0FBQUY7QUFHQTs7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QUNBLGFBQUE7RUFDQSxjQUFBO0VBQ0EsdUNBQUE7QUFDRjs7QUFFQTtFQUNFLCtCQUFBO0VBQ0Esd0NBQUE7RUFDQSx1QkFBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0VBQ0EsY0FBQTtFQUNBLFlBQUE7RUFDQSxnQkFBQTtFQUNBLGlCQUFBO0VBQ0EsZUFBQTtFQUNBLGNBQUE7QUFDRjs7QUFFQTtFQUNFLHNDQUFBO0VBQ0EsZ0JBQUE7QUFDRjs7QUFFQTtFQUNFLCtCQUFBO0VBQ0EsbUJBQUE7RUFDQSxvQkFBQTtBQUNGOztBQUVBO0VBQ0UsK0JBQUE7RUFDQSxXQUFBO0VBQ0Esa0JBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7QUFDRjs7QUFFQTtFQUNFLHVCQUFBO0VBQ0EsWUFBQTtFQUNBLG9CQUFBO0VBQ0EsZUFBQTtFQUNBLGlCQUFBO0FBQ0Y7O0FBRUE7O0VBRUUsdUJBQUE7RUFDQSxxQkFBQTtFQUNBLGVBQUE7QUFDRjs7QUFFQTtFQUNFLHFCQUFBO0FBQ0Y7O0FBQ0E7RUFDRSxlQUFBO0FBRUY7O0FBQ0E7RUFDRSxpQkFBQTtBQUVGOztBQUNBO0VBQ0UsV0FBQTtBQUVGOztBQUNBO0VBQ0Usa0NBQUE7QUFFRjs7QUFDQTtFQUNFLGtDQUFBO0FBRUY7O0FBQ0E7RUFDRSw0QkFBQTtBQUVGOztBQUNBO0VBQ0UsOERBQUE7QUFFRlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCI6cm9vdCB7XFxuICAtLWRlZmF1bHQ6ICMxMjEyMTM7XFxuICAtLXRleHQ6ICNmZmZmZmY7XFxuICAtLWdyYXkxOiAjNGE0YTRjO1xcbiAgLS1ncmF5MjogIzJhMmEyYztcXG4gIC0tYnJCbHVlMTogIzE3YWFkODtcXG4gIC0tYnJCbHVlMjogIzAxN2NiMDtcXG4gIC0tYnJCbHVlMzogIzBiNjFhODtcXG4gIC0tYnJPcmFuZ2UxOiAjZmU5MjAwO1xcbiAgLyplZTYxMGEqL1xcbiAgLS1ick9yYW5nZTI6ICNlZTYxMGE7XFxuICAtLWJyT3JhbmdlMzogI2VhNDEwYjtcXG59XFxuXFxuQGZvbnQtZmFjZSB7XFxuICBmb250LWZhbWlseTogXFxcIkJsYWRlIFJ1bm5lclxcXCI7XFxuICBzcmM6IHVybCguLi9mb250cy9CTEFEUk1GXy5UVEYpO1xcbn1cXG5cXG5AZm9udC1mYWNlIHtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiT3hhbml1bVxcXCI7XFxuICBmb250LXN0eWxlOiBub3JtYWw7XFxuICBmb250LXdlaWdodDogbm9ybWFsO1xcbiAgc3JjOiB1cmwoXFxcIi4uL2ZvbnRzL094YW5pdW0tVmFyaWFibGVGb250X3dnaHQudHRmXFxcIik7XFxufVxcblxcbmh0bWwsXFxuYm9keSB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kZWZhdWx0KTtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiT3hhbml1bVxcXCIsIGN1cnNpdmU7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cXG5kaXYge1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG59XFxuXFxuLnN1cGVyY29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBtaW4td2lkdGg6IDMyMHB4O1xcbiAgbWF4LXdpZHRoOiA1NDBweDtcXG4gIG1hcmdpbjogMWNxdyBhdXRvO1xcbiAgY29udGFpbmVyLXR5cGU6IGlubGluZS1zaXplO1xcbn1cXG5cXG4ucGFnZUNvbnRhaW5lciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGZsZXgtc2hyaW5rOiAwO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgLyptYXJnaW46IDFjcXcgYXV0bztcXG4gIG1pbi13aWR0aDogMzIwcHg7XFxuICBtYXgtd2lkdGg6IDU0MHB4OyovXFxuICB3aWR0aDogMTAwJTtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG4gIC8qZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7Ki9cXG4gIC8qZ3JpZC10ZW1wbGF0ZS1yb3dzOiBhdXRvIGF1dG8gMWZyOyovXFxuICAvKmdyaWQtYXV0by1yb3dzOiBhdXRvOyovXFxuICBjb250YWluZXItdHlwZTogaW5saW5lLXNpemU7XFxuICBoZWlnaHQ6IDE1NWNxdztcXG59XFxuXFxuLmhlYWRlciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleDogMCAxIGF1dG87XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGNvbG9yOiB2YXIoLS1ick9yYW5nZTIpO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJCbGFkZSBSdW5uZXJcXFwiO1xcbiAgZm9udC1zaXplOiA4Y3F3O1xcbiAgcGFkZGluZzogMmNxdyAwO1xcbiAgbWFyZ2luOiAxY3F3O1xcbiAgYm9yZGVyLWJvdHRvbTogMC41Y3F3IHNvbGlkIHZhcigtLWdyYXkxKTtcXG4gIGhlaWdodDogOGNxdztcXG4gIGJvcmRlci10b3A6IDAuNWNxdyBzb2xpZCB2YXIoLS1kZWZhdWx0KTtcXG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xcbiAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcXG4gIC1tcy11c2VyLXNlbGVjdDogbm9uZTtcXG4gIHVzZXItc2VsZWN0OiBub25lO1xcbn1cXG5cXG4ubWVzc2FnZSB7XFxuICBjb2xvcjogdmFyKC0tYnJPcmFuZ2UyKTtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiT3hhbml1bVxcXCIsIGN1cnNpdmU7XFxuICBmb250LXNpemU6IDZjcXc7XFxuICBwYWRkaW5nOiAyY3F3IDA7XFxuICBtYXJnaW46IDFjcXc7XFxuICBoZWlnaHQ6IDhjcXc7XFxuICBib3JkZXItYm90dG9tOiAwLjVjcXcgc29saWQgdmFyKC0tYnJPcmFuZ2UyKTtcXG4gIGJvcmRlci10b3A6IDAuNWNxdyBzb2xpZCB2YXIoLS1ick9yYW5nZTIpO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGVmYXVsdCk7XFxufVxcblxcbi5nYW1lQ29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGZsZXg6IDAgMSBhdXRvO1xcbiAgd2lkdGg6IDEwMGNxdztcXG4gIG1hcmdpbjogYXV0bztcXG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xcbiAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcXG4gIC1tcy11c2VyLXNlbGVjdDogbm9uZTtcXG4gIHVzZXItc2VsZWN0OiBub25lO1xcbn1cXG5cXG4udGlsZUdyaWQge1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIHdpZHRoOiA3NWNxdztcXG4gIGdyaWQtdGVtcGxhdGUtcm93czogMWZyIDFmciAxZnIgMWZyIDFmciAxZnI7XFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnIgMWZyIDFmciAxZnI7XFxuICBncmlkLWdhcDogMS41Y3F3O1xcbiAgbWFyZ2luOiAwLjVjcXcgMDtcXG59XFxuXFxuLnRpbGUge1xcbiAgYXNwZWN0LXJhdGlvOiAxIC8gMTtcXG4gIGJvcmRlcjogMC41Y3F3IHNvbGlkIHZhcigtLWdyYXkxKTtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBjb2xvcjogdmFyKC0tdGV4dCk7XFxuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XFxuICBmb250LWZhbWlseTogXFxcIk94YW5pdW1cXFwiLCBjdXJzaXZlO1xcbiAgZm9udC1zaXplOiA3Y3F3O1xcbn1cXG5cXG4udGlsZVdhdGVyTWFyayB7XFxuICBmb250LWZhbWlseTogXFxcIkJsYWRlIFJ1bm5lclxcXCI7XFxuICBjb2xvcjogdmFyKC0tZ3JheTIpO1xcbn1cXG5cXG4ua2V5Ym9hcmRDb250YWluZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXg6IDAgMSBhdXRvO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBtYXJnaW46IGF1dG87XFxuICBtYXJnaW4tdG9wOiAyY3F3O1xcbiAgd2lkdGg6IDEwMGNxdztcXG59XFxuXFxuLmtleWJvYXJkR3JpZCB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgd2lkdGg6IDk4Y3F3O1xcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnIgMWZyIDFmcjtcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xcbiAgZ3JpZC1yb3ctZ2FwOiAxLjVjcXc7XFxufVxcblxcbi5rZXlib2FyZFJvdzEge1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIHdpZHRoOiA5OGNxdztcXG4gIGdyaWQtdGVtcGxhdGUtcm93czogMWZyO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyIDFmciAxZnIgMWZyIDFmciAxZnIgMWZyIDFmciAxZnI7XFxuICBncmlkLWNvbHVtbi1nYXA6IDEuNWNxdztcXG59XFxuLmtleWJvYXJkUm93MiB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgd2lkdGg6IDk4Y3F3O1xcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnI7XFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDAuNWZyIDFmciAxZnIgMWZyIDFmciAxZnIgMWZyIDFmciAxZnIgMWZyIDAuNWZyO1xcbiAgZ3JpZC1jb2x1bW4tZ2FwOiAxLjVjcXc7XFxufVxcbi5rZXlib2FyZFJvdzMge1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIHdpZHRoOiA5OGNxdztcXG4gIGdyaWQtdGVtcGxhdGUtcm93czogMWZyO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxLjVmciAxZnIgMWZyIDFmciAxZnIgMWZyIDFmciAxZnIgMS41ZnI7XFxuICBncmlkLWNvbHVtbi1nYXA6IDEuNWNxdztcXG59XFxuXFxuLmtleSxcXG4ua2V5U3BhY2VyIHtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBib3JkZXI6IDAuMjVjcXcgc29saWQgdmFyKC0tdGV4dCk7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJPeGFuaXVtXFxcIiwgY3Vyc2l2ZTtcXG4gIGZvbnQtc2l6ZTogMy41Y3F3O1xcbiAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcXG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XFxuICBwYWRkaW5nOiAwIDA7XFxuICBib3JkZXItcmFkaXVzOiAxLjVjcXc7XFxuICBjb2xvcjogdmFyKC0tdGV4dCk7XFxuICBhc3BlY3QtcmF0aW86IDEgLyAxLjI7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kZWZhdWx0KTtcXG4gIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XFxuICB1c2VyLXNlbGVjdDogbm9uZTtcXG59XFxuXFxuLmtleVNwYWNlciB7XFxuICB2aXNpYmlsaXR5OiBoaWRkZW47XFxuICBhc3BlY3QtcmF0aW86IDEgLyAyLjQ7XFxufVxcblxcbiNCQUNLU1BBQ0UsXFxuI0VOVEVSIHtcXG4gIGFzcGVjdC1yYXRpbzogMyAvIDIuNDtcXG4gIGZvbnQtc2l6ZTogMi41Y3F3O1xcbn1cXG5cXG4udGlsZUNsb3NlIHtcXG4gIGNvbG9yOiB2YXIoLS1ick9yYW5nZTIpO1xcbiAgYm9yZGVyOiAwLjVjcXcgc29saWQgdmFyKC0tYnJPcmFuZ2UyKTtcXG59XFxuXFxuLnRpbGVIaXQge1xcbiAgY29sb3I6IHZhcigtLWJyQmx1ZTEpO1xcbiAgYm9yZGVyOiAwLjVjcXcgc29saWQgdmFyKC0tYnJCbHVlMSk7XFxufVxcbi50aWxlTWlzcyB7XFxuICBjb2xvcjogdmFyKC0tZ3JheTEpO1xcbiAgYm9yZGVyOiAwLjVjcXcgc29saWQgdmFyKC0tZ3JheTEpO1xcbn1cXG5cXG4uZ2FtZU92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYnJCbHVlMSk7XFxuICBjb2xvcjogdmFyKC0tZGVmYXVsdCk7XFxuICBib3JkZXI6IDAuMjVjcXcgc29saWQgdmFyKC0tYnJCbHVlMSk7XFxufVxcblxcbi5yZXNldCB7XFxuICBhbmltYXRpb246IDFzIGxpbmVhciByZXNldHRpbmc7XFxufVxcblxcbkBrZXlmcmFtZXMgcmVzZXR0aW5nIHtcXG4gIDAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGVYKDBkZWcpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGVYKDkwZGVnKTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZVgoMGRlZyk7XFxuICB9XFxufVxcblxcbi5tb2RhbENvbnRhaW5lciB7XFxuICBkaXNwbGF5OiBub25lO1xcbiAgcG9zaXRpb246IGZpeGVkO1xcbiAgei1pbmRleDogMTtcXG4gIHBhZGRpbmctdG9wOiAxNWNxdztcXG4gIHRvcDogMDtcXG4gIHJpZ2h0OiAwO1xcbiAgbGVmdDogMDtcXG4gIGJvdHRvbTogMDtcXG4gIHdpZHRoOiAxMDBjcXc7XFxuICBvdmVyZmxvdzogYXV0bztcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMTgsIDE4LCAxOSwgMC42KTtcXG59XFxuXFxuLm1vZGFsQ29udGVudCB7XFxuICBmb250LWZhbWlseTogXFxcIk94YW5pdW1cXFwiLCBjdXJzaXZlO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTQsIDE0NiwgMCwgMC4zKTtcXG4gIGNvbG9yOiB2YXIoLS1ick9yYW5nZTEpO1xcbiAgbWFyZ2luOiBhdXRvO1xcbiAgcGFkZGluZzogMS41Y3F3O1xcbiAgcGFkZGluZy10b3A6IDA7XFxuICB3aWR0aDogODBjcXc7XFxuICBtYXgtd2lkdGg6IDgwY3F3O1xcbiAgbWF4LWhlaWdodDogOTBjcXc7XFxuICBmb250LXNpemU6IDZjcXc7XFxuICBvdmVyZmxvdzogYXV0bztcXG59XFxuXFxuLm1vZGFsQ29udGVudCBociB7XFxuICBib3JkZXI6IDAuMjVjcXcgc29saWQgdmFyKC0tYnJPcmFuZ2UxKTtcXG4gIG1hcmdpbi10b3A6IDNjcXc7XFxufVxcblxcbi5tb2RhbFRpdGxlIHtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiT3hhbml1bVxcXCIsIGN1cnNpdmU7XFxuICBtYXJnaW46IDJjcXcgMCAwY3F3O1xcbiAgcGFkZGluZzogMmNxdyAwIDFjcXc7XFxufVxcblxcbi5tb2RhbENvbnRlbnRJdGVtIHtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiT3hhbml1bVxcXCIsIGN1cnNpdmU7XFxuICBtYXJnaW46IDAgMDtcXG4gIHBhZGRpbmc6IDFjcXcgMmNxdztcXG4gIGZvbnQtc2l6ZTogNWNxdztcXG4gIHRleHQtYWxpZ246IGxlZnQ7XFxufVxcblxcbi5jbG9zZSB7XFxuICBjb2xvcjogdmFyKC0tYnJPcmFuZ2UxKTtcXG4gIGZsb2F0OiByaWdodDtcXG4gIG1hcmdpbi1yaWdodDogMS41Y3F3O1xcbiAgZm9udC1zaXplOiA2Y3F3O1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxufVxcblxcbi5jbG9zZTpob3ZlcixcXG4uY2xvc2U6Zm9jdXMge1xcbiAgY29sb3I6IHZhcigtLWJyT3JhbmdlMyk7XFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbi5zdGF0VGFibGUge1xcbiAgbWFyZ2luOiAwIGF1dG8gMS41Y3F3O1xcbn1cXG4uc3RhdFRhYmxlIHRkIHtcXG4gIHBhZGRpbmc6IDAgNGNxdztcXG59XFxuXFxuLnN0YXROdW0ge1xcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XFxufVxcblxcbjo6LXdlYmtpdC1zY3JvbGxiYXIge1xcbiAgd2lkdGg6IDJjcXc7XFxufVxcblxcbjo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2sge1xcbiAgYmFja2dyb3VuZDogcmdiYSgyNTQsIDE0NiwgMCwgMC4yKTtcXG59XFxuXFxuOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XFxuICBiYWNrZ3JvdW5kOiByZ2JhKDI1NCwgMTQ2LCAwLCAwLjQpO1xcbn1cXG5cXG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iOmhvdmVyIHtcXG4gIGJhY2tncm91bmQ6IHZhcigtLWJyT3JhbmdlMSk7XFxufVxcblxcbi5tb2RhbENvbnRlbnQge1xcbiAgc2Nyb2xsYmFyLWNvbG9yOiByZ2JhKDI1NCwgMTQ2LCAwLCAwLjYpIHJnYmEoMjU0LCAxNDYsIDAsIDAuMSk7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1cmwsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG4gIGlmICghdXJsKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuICB1cmwgPSBTdHJpbmcodXJsLl9fZXNNb2R1bGUgPyB1cmwuZGVmYXVsdCA6IHVybCk7XG5cbiAgLy8gSWYgdXJsIGlzIGFscmVhZHkgd3JhcHBlZCBpbiBxdW90ZXMsIHJlbW92ZSB0aGVtXG4gIGlmICgvXlsnXCJdLipbJ1wiXSQvLnRlc3QodXJsKSkge1xuICAgIHVybCA9IHVybC5zbGljZSgxLCAtMSk7XG4gIH1cbiAgaWYgKG9wdGlvbnMuaGFzaCkge1xuICAgIHVybCArPSBvcHRpb25zLmhhc2g7XG4gIH1cblxuICAvLyBTaG91bGQgdXJsIGJlIHdyYXBwZWQ/XG4gIC8vIFNlZSBodHRwczovL2RyYWZ0cy5jc3N3Zy5vcmcvY3NzLXZhbHVlcy0zLyN1cmxzXG4gIGlmICgvW1wiJygpIFxcdFxcbl18KCUyMCkvLnRlc3QodXJsKSB8fCBvcHRpb25zLm5lZWRRdW90ZXMpIHtcbiAgICByZXR1cm4gXCJcXFwiXCIuY29uY2F0KHVybC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykucmVwbGFjZSgvXFxuL2csIFwiXFxcXG5cIiksIFwiXFxcIlwiKTtcbiAgfVxuICByZXR1cm4gdXJsO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsImZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gIGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gIHJldHVybiBDb25zdHJ1Y3Rvcjtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplQ29tcHV0ZWRTdHlsZVZhbHVlKHN0cmluZykge1xuICAvLyBcIjI1MHB4XCIgLS0+IDI1MFxuICByZXR1cm4gK3N0cmluZy5yZXBsYWNlKC9weC8sICcnKTtcbn1cblxuZnVuY3Rpb24gZml4RFBSKGNhbnZhcykge1xuICB2YXIgZHByID0gd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gIHZhciBjb21wdXRlZFN0eWxlcyA9IGdldENvbXB1dGVkU3R5bGUoY2FudmFzKTtcbiAgdmFyIHdpZHRoID0gbm9ybWFsaXplQ29tcHV0ZWRTdHlsZVZhbHVlKGNvbXB1dGVkU3R5bGVzLmdldFByb3BlcnR5VmFsdWUoJ3dpZHRoJykpO1xuICB2YXIgaGVpZ2h0ID0gbm9ybWFsaXplQ29tcHV0ZWRTdHlsZVZhbHVlKGNvbXB1dGVkU3R5bGVzLmdldFByb3BlcnR5VmFsdWUoJ2hlaWdodCcpKTtcbiAgY2FudmFzLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAod2lkdGggKiBkcHIpLnRvU3RyaW5nKCkpO1xuICBjYW52YXMuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAoaGVpZ2h0ICogZHByKS50b1N0cmluZygpKTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21OdW1iZXIobWluLCBtYXgpIHtcbiAgdmFyIGZyYWN0aW9uRGlnaXRzID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAwO1xuICB2YXIgcmFuZG9tTnVtYmVyID0gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluO1xuICByZXR1cm4gTWF0aC5mbG9vcihyYW5kb21OdW1iZXIgKiBNYXRoLnBvdygxMCwgZnJhY3Rpb25EaWdpdHMpKSAvIE1hdGgucG93KDEwLCBmcmFjdGlvbkRpZ2l0cyk7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tQXJyYXlFbGVtZW50KGFycikge1xuICByZXR1cm4gYXJyW2dlbmVyYXRlUmFuZG9tTnVtYmVyKDAsIGFyci5sZW5ndGgpXTtcbn1cblxudmFyIEZSRUVfRkFMTElOR19PQkpFQ1RfQUNDRUxFUkFUSU9OID0gMC4wMDEyNTtcbnZhciBNSU5fRFJBR19GT1JDRV9DT0VGRklDSUVOVCA9IDAuMDAwNTtcbnZhciBNQVhfRFJBR19GT1JDRV9DT0VGRklDSUVOVCA9IDAuMDAwOTtcbnZhciBST1RBVElPTl9TTE9XRE9XTl9BQ0NFTEVSQVRJT04gPSAwLjAwMDAxO1xudmFyIElOSVRJQUxfU0hBUEVfUkFESVVTID0gNjtcbnZhciBJTklUSUFMX0VNT0pJX1NJWkUgPSA4MDtcbnZhciBNSU5fSU5JVElBTF9DT05GRVRUSV9TUEVFRCA9IDAuOTtcbnZhciBNQVhfSU5JVElBTF9DT05GRVRUSV9TUEVFRCA9IDEuNztcbnZhciBNSU5fRklOQUxfWF9DT05GRVRUSV9TUEVFRCA9IDAuMjtcbnZhciBNQVhfRklOQUxfWF9DT05GRVRUSV9TUEVFRCA9IDAuNjtcbnZhciBNSU5fSU5JVElBTF9ST1RBVElPTl9TUEVFRCA9IDAuMDM7XG52YXIgTUFYX0lOSVRJQUxfUk9UQVRJT05fU1BFRUQgPSAwLjA3O1xudmFyIE1JTl9DT05GRVRUSV9BTkdMRSA9IDE1O1xudmFyIE1BWF9DT05GRVRUSV9BTkdMRSA9IDgyO1xudmFyIE1BWF9DT05GRVRUSV9QT1NJVElPTl9TSElGVCA9IDE1MDtcbnZhciBTSEFQRV9WSVNJQklMSVRZX1RSRVNIT0xEID0gMTAwO1xudmFyIERFRkFVTFRfQ09ORkVUVElfTlVNQkVSID0gMjUwO1xudmFyIERFRkFVTFRfRU1PSklTX05VTUJFUiA9IDQwO1xudmFyIERFRkFVTFRfQ09ORkVUVElfQ09MT1JTID0gWycjZmNmNDAzJywgJyM2MmZjMDMnLCAnI2Y0ZmMwMycsICcjMDNlN2ZjJywgJyMwM2ZjYTUnLCAnI2E1MDNmYycsICcjZmMwM2FkJywgJyNmYzAzYzInXTtcblxuZnVuY3Rpb24gZ2V0V2luZG93V2lkdGhDb2VmZmljaWVudChjYW52YXNXaWR0aCkge1xuICB2YXIgSERfU0NSRUVOX1dJRFRIID0gMTkyMDtcbiAgcmV0dXJuIE1hdGgubG9nKGNhbnZhc1dpZHRoKSAvIE1hdGgubG9nKEhEX1NDUkVFTl9XSURUSCk7XG59XG5cbnZhciBDb25mZXR0aVNoYXBlID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQ29uZmV0dGlTaGFwZShhcmdzKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIENvbmZldHRpU2hhcGUpO1xuXG4gICAgdmFyIGluaXRpYWxQb3NpdGlvbiA9IGFyZ3MuaW5pdGlhbFBvc2l0aW9uLFxuICAgICAgICBkaXJlY3Rpb24gPSBhcmdzLmRpcmVjdGlvbixcbiAgICAgICAgY29uZmV0dGlSYWRpdXMgPSBhcmdzLmNvbmZldHRpUmFkaXVzLFxuICAgICAgICBjb25mZXR0aUNvbG9ycyA9IGFyZ3MuY29uZmV0dGlDb2xvcnMsXG4gICAgICAgIGVtb2ppcyA9IGFyZ3MuZW1vamlzLFxuICAgICAgICBlbW9qaVNpemUgPSBhcmdzLmVtb2ppU2l6ZSxcbiAgICAgICAgY2FudmFzV2lkdGggPSBhcmdzLmNhbnZhc1dpZHRoO1xuICAgIHZhciByYW5kb21Db25mZXR0aVNwZWVkID0gZ2VuZXJhdGVSYW5kb21OdW1iZXIoTUlOX0lOSVRJQUxfQ09ORkVUVElfU1BFRUQsIE1BWF9JTklUSUFMX0NPTkZFVFRJX1NQRUVELCAzKTtcbiAgICB2YXIgaW5pdGlhbFNwZWVkID0gcmFuZG9tQ29uZmV0dGlTcGVlZCAqIGdldFdpbmRvd1dpZHRoQ29lZmZpY2llbnQoY2FudmFzV2lkdGgpO1xuICAgIHRoaXMuY29uZmV0dGlTcGVlZCA9IHtcbiAgICAgIHg6IGluaXRpYWxTcGVlZCxcbiAgICAgIHk6IGluaXRpYWxTcGVlZFxuICAgIH07XG4gICAgdGhpcy5maW5hbENvbmZldHRpU3BlZWRYID0gZ2VuZXJhdGVSYW5kb21OdW1iZXIoTUlOX0ZJTkFMX1hfQ09ORkVUVElfU1BFRUQsIE1BWF9GSU5BTF9YX0NPTkZFVFRJX1NQRUVELCAzKTtcbiAgICB0aGlzLnJvdGF0aW9uU3BlZWQgPSBlbW9qaXMubGVuZ3RoID8gMC4wMSA6IGdlbmVyYXRlUmFuZG9tTnVtYmVyKE1JTl9JTklUSUFMX1JPVEFUSU9OX1NQRUVELCBNQVhfSU5JVElBTF9ST1RBVElPTl9TUEVFRCwgMykgKiBnZXRXaW5kb3dXaWR0aENvZWZmaWNpZW50KGNhbnZhc1dpZHRoKTtcbiAgICB0aGlzLmRyYWdGb3JjZUNvZWZmaWNpZW50ID0gZ2VuZXJhdGVSYW5kb21OdW1iZXIoTUlOX0RSQUdfRk9SQ0VfQ09FRkZJQ0lFTlQsIE1BWF9EUkFHX0ZPUkNFX0NPRUZGSUNJRU5ULCA2KTtcbiAgICB0aGlzLnJhZGl1cyA9IHtcbiAgICAgIHg6IGNvbmZldHRpUmFkaXVzLFxuICAgICAgeTogY29uZmV0dGlSYWRpdXNcbiAgICB9O1xuICAgIHRoaXMuaW5pdGlhbFJhZGl1cyA9IGNvbmZldHRpUmFkaXVzO1xuICAgIHRoaXMucm90YXRpb25BbmdsZSA9IGRpcmVjdGlvbiA9PT0gJ2xlZnQnID8gZ2VuZXJhdGVSYW5kb21OdW1iZXIoMCwgMC4yLCAzKSA6IGdlbmVyYXRlUmFuZG9tTnVtYmVyKC0wLjIsIDAsIDMpO1xuICAgIHRoaXMuZW1vamlTaXplID0gZW1vamlTaXplO1xuICAgIHRoaXMuZW1vamlSb3RhdGlvbkFuZ2xlID0gZ2VuZXJhdGVSYW5kb21OdW1iZXIoMCwgMiAqIE1hdGguUEkpO1xuICAgIHRoaXMucmFkaXVzWVVwZGF0ZURpcmVjdGlvbiA9ICdkb3duJztcbiAgICB2YXIgYW5nbGUgPSBkaXJlY3Rpb24gPT09ICdsZWZ0JyA/IGdlbmVyYXRlUmFuZG9tTnVtYmVyKE1BWF9DT05GRVRUSV9BTkdMRSwgTUlOX0NPTkZFVFRJX0FOR0xFKSAqIE1hdGguUEkgLyAxODAgOiBnZW5lcmF0ZVJhbmRvbU51bWJlcigtTUlOX0NPTkZFVFRJX0FOR0xFLCAtTUFYX0NPTkZFVFRJX0FOR0xFKSAqIE1hdGguUEkgLyAxODA7XG4gICAgdGhpcy5hYnNDb3MgPSBNYXRoLmFicyhNYXRoLmNvcyhhbmdsZSkpO1xuICAgIHRoaXMuYWJzU2luID0gTWF0aC5hYnMoTWF0aC5zaW4oYW5nbGUpKTtcbiAgICB2YXIgcG9zaXRpb25TaGlmdCA9IGdlbmVyYXRlUmFuZG9tTnVtYmVyKC1NQVhfQ09ORkVUVElfUE9TSVRJT05fU0hJRlQsIDApO1xuICAgIHZhciBzaGlmdGVkSW5pdGlhbFBvc2l0aW9uID0ge1xuICAgICAgeDogaW5pdGlhbFBvc2l0aW9uLnggKyAoZGlyZWN0aW9uID09PSAnbGVmdCcgPyAtcG9zaXRpb25TaGlmdCA6IHBvc2l0aW9uU2hpZnQpICogdGhpcy5hYnNDb3MsXG4gICAgICB5OiBpbml0aWFsUG9zaXRpb24ueSAtIHBvc2l0aW9uU2hpZnQgKiB0aGlzLmFic1NpblxuICAgIH07XG4gICAgdGhpcy5jdXJyZW50UG9zaXRpb24gPSBPYmplY3QuYXNzaWduKHt9LCBzaGlmdGVkSW5pdGlhbFBvc2l0aW9uKTtcbiAgICB0aGlzLmluaXRpYWxQb3NpdGlvbiA9IE9iamVjdC5hc3NpZ24oe30sIHNoaWZ0ZWRJbml0aWFsUG9zaXRpb24pO1xuICAgIHRoaXMuY29sb3IgPSBlbW9qaXMubGVuZ3RoID8gbnVsbCA6IGdlbmVyYXRlUmFuZG9tQXJyYXlFbGVtZW50KGNvbmZldHRpQ29sb3JzKTtcbiAgICB0aGlzLmVtb2ppID0gZW1vamlzLmxlbmd0aCA/IGdlbmVyYXRlUmFuZG9tQXJyYXlFbGVtZW50KGVtb2ppcykgOiBudWxsO1xuICAgIHRoaXMuY3JlYXRlZEF0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoQ29uZmV0dGlTaGFwZSwgW3tcbiAgICBrZXk6IFwiZHJhd1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkcmF3KGNhbnZhc0NvbnRleHQpIHtcbiAgICAgIHZhciBjdXJyZW50UG9zaXRpb24gPSB0aGlzLmN1cnJlbnRQb3NpdGlvbixcbiAgICAgICAgICByYWRpdXMgPSB0aGlzLnJhZGl1cyxcbiAgICAgICAgICBjb2xvciA9IHRoaXMuY29sb3IsXG4gICAgICAgICAgZW1vamkgPSB0aGlzLmVtb2ppLFxuICAgICAgICAgIHJvdGF0aW9uQW5nbGUgPSB0aGlzLnJvdGF0aW9uQW5nbGUsXG4gICAgICAgICAgZW1vamlSb3RhdGlvbkFuZ2xlID0gdGhpcy5lbW9qaVJvdGF0aW9uQW5nbGUsXG4gICAgICAgICAgZW1vamlTaXplID0gdGhpcy5lbW9qaVNpemU7XG4gICAgICB2YXIgZHByID0gd2luZG93LmRldmljZVBpeGVsUmF0aW87XG5cbiAgICAgIGlmIChjb2xvcikge1xuICAgICAgICBjYW52YXNDb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgICAgICBjYW52YXNDb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICBjYW52YXNDb250ZXh0LmVsbGlwc2UoY3VycmVudFBvc2l0aW9uLnggKiBkcHIsIGN1cnJlbnRQb3NpdGlvbi55ICogZHByLCByYWRpdXMueCAqIGRwciwgcmFkaXVzLnkgKiBkcHIsIHJvdGF0aW9uQW5nbGUsIDAsIDIgKiBNYXRoLlBJKTtcbiAgICAgICAgY2FudmFzQ29udGV4dC5maWxsKCk7XG4gICAgICB9IGVsc2UgaWYgKGVtb2ppKSB7XG4gICAgICAgIGNhbnZhc0NvbnRleHQuZm9udCA9IFwiXCIuY29uY2F0KGVtb2ppU2l6ZSwgXCJweCBzZXJpZlwiKTtcbiAgICAgICAgY2FudmFzQ29udGV4dC5zYXZlKCk7XG4gICAgICAgIGNhbnZhc0NvbnRleHQudHJhbnNsYXRlKGRwciAqIGN1cnJlbnRQb3NpdGlvbi54LCBkcHIgKiBjdXJyZW50UG9zaXRpb24ueSk7XG4gICAgICAgIGNhbnZhc0NvbnRleHQucm90YXRlKGVtb2ppUm90YXRpb25BbmdsZSk7XG4gICAgICAgIGNhbnZhc0NvbnRleHQudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgIGNhbnZhc0NvbnRleHQuZmlsbFRleHQoZW1vamksIDAsIDApO1xuICAgICAgICBjYW52YXNDb250ZXh0LnJlc3RvcmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidXBkYXRlUG9zaXRpb25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdXBkYXRlUG9zaXRpb24oaXRlcmF0aW9uVGltZURlbHRhLCBjdXJyZW50VGltZSkge1xuICAgICAgdmFyIGNvbmZldHRpU3BlZWQgPSB0aGlzLmNvbmZldHRpU3BlZWQsXG4gICAgICAgICAgZHJhZ0ZvcmNlQ29lZmZpY2llbnQgPSB0aGlzLmRyYWdGb3JjZUNvZWZmaWNpZW50LFxuICAgICAgICAgIGZpbmFsQ29uZmV0dGlTcGVlZFggPSB0aGlzLmZpbmFsQ29uZmV0dGlTcGVlZFgsXG4gICAgICAgICAgcmFkaXVzWVVwZGF0ZURpcmVjdGlvbiA9IHRoaXMucmFkaXVzWVVwZGF0ZURpcmVjdGlvbixcbiAgICAgICAgICByb3RhdGlvblNwZWVkID0gdGhpcy5yb3RhdGlvblNwZWVkLFxuICAgICAgICAgIGNyZWF0ZWRBdCA9IHRoaXMuY3JlYXRlZEF0LFxuICAgICAgICAgIGRpcmVjdGlvbiA9IHRoaXMuZGlyZWN0aW9uO1xuICAgICAgdmFyIHRpbWVEZWx0YVNpbmNlQ3JlYXRpb24gPSBjdXJyZW50VGltZSAtIGNyZWF0ZWRBdDtcbiAgICAgIGlmIChjb25mZXR0aVNwZWVkLnggPiBmaW5hbENvbmZldHRpU3BlZWRYKSB0aGlzLmNvbmZldHRpU3BlZWQueCAtPSBkcmFnRm9yY2VDb2VmZmljaWVudCAqIGl0ZXJhdGlvblRpbWVEZWx0YTtcbiAgICAgIHRoaXMuY3VycmVudFBvc2l0aW9uLnggKz0gY29uZmV0dGlTcGVlZC54ICogKGRpcmVjdGlvbiA9PT0gJ2xlZnQnID8gLXRoaXMuYWJzQ29zIDogdGhpcy5hYnNDb3MpICogaXRlcmF0aW9uVGltZURlbHRhO1xuICAgICAgdGhpcy5jdXJyZW50UG9zaXRpb24ueSA9IHRoaXMuaW5pdGlhbFBvc2l0aW9uLnkgLSBjb25mZXR0aVNwZWVkLnkgKiB0aGlzLmFic1NpbiAqIHRpbWVEZWx0YVNpbmNlQ3JlYXRpb24gKyBGUkVFX0ZBTExJTkdfT0JKRUNUX0FDQ0VMRVJBVElPTiAqIE1hdGgucG93KHRpbWVEZWx0YVNpbmNlQ3JlYXRpb24sIDIpIC8gMjtcbiAgICAgIHRoaXMucm90YXRpb25TcGVlZCAtPSB0aGlzLmVtb2ppID8gMC4wMDAxIDogUk9UQVRJT05fU0xPV0RPV05fQUNDRUxFUkFUSU9OICogaXRlcmF0aW9uVGltZURlbHRhO1xuICAgICAgaWYgKHRoaXMucm90YXRpb25TcGVlZCA8IDApIHRoaXMucm90YXRpb25TcGVlZCA9IDA7IC8vIG5vIG5lZWQgdG8gdXBkYXRlIHJvdGF0aW9uIHJhZGl1cyBmb3IgZW1vamlcblxuICAgICAgaWYgKHRoaXMuZW1vamkpIHtcbiAgICAgICAgdGhpcy5lbW9qaVJvdGF0aW9uQW5nbGUgKz0gdGhpcy5yb3RhdGlvblNwZWVkICogaXRlcmF0aW9uVGltZURlbHRhICUgKDIgKiBNYXRoLlBJKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAocmFkaXVzWVVwZGF0ZURpcmVjdGlvbiA9PT0gJ2Rvd24nKSB7XG4gICAgICAgIHRoaXMucmFkaXVzLnkgLT0gaXRlcmF0aW9uVGltZURlbHRhICogcm90YXRpb25TcGVlZDtcblxuICAgICAgICBpZiAodGhpcy5yYWRpdXMueSA8PSAwKSB7XG4gICAgICAgICAgdGhpcy5yYWRpdXMueSA9IDA7XG4gICAgICAgICAgdGhpcy5yYWRpdXNZVXBkYXRlRGlyZWN0aW9uID0gJ3VwJztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yYWRpdXMueSArPSBpdGVyYXRpb25UaW1lRGVsdGEgKiByb3RhdGlvblNwZWVkO1xuXG4gICAgICAgIGlmICh0aGlzLnJhZGl1cy55ID49IHRoaXMuaW5pdGlhbFJhZGl1cykge1xuICAgICAgICAgIHRoaXMucmFkaXVzLnkgPSB0aGlzLmluaXRpYWxSYWRpdXM7XG4gICAgICAgICAgdGhpcy5yYWRpdXNZVXBkYXRlRGlyZWN0aW9uID0gJ2Rvd24nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldElzVmlzaWJsZU9uQ2FudmFzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldElzVmlzaWJsZU9uQ2FudmFzKGNhbnZhc0hlaWdodCkge1xuICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFBvc2l0aW9uLnkgPCBjYW52YXNIZWlnaHQgKyBTSEFQRV9WSVNJQklMSVRZX1RSRVNIT0xEO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBDb25mZXR0aVNoYXBlO1xufSgpO1xuXG5mdW5jdGlvbiBjcmVhdGVDYW52YXMoKSB7XG4gIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgY2FudmFzLnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJztcbiAgY2FudmFzLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xuICBjYW52YXMuc3R5bGUudG9wID0gJzAnO1xuICBjYW52YXMuc3R5bGUubGVmdCA9ICcwJztcbiAgY2FudmFzLnN0eWxlLnpJbmRleCA9ICcxMDAwJztcbiAgY2FudmFzLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgcmV0dXJuIGNhbnZhcztcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplQ29uZmV0dGlDb25maWcoY29uZmV0dGlDb25maWcpIHtcbiAgdmFyIF9jb25mZXR0aUNvbmZpZyRjb25mZSA9IGNvbmZldHRpQ29uZmlnLmNvbmZldHRpUmFkaXVzLFxuICAgICAgY29uZmV0dGlSYWRpdXMgPSBfY29uZmV0dGlDb25maWckY29uZmUgPT09IHZvaWQgMCA/IElOSVRJQUxfU0hBUEVfUkFESVVTIDogX2NvbmZldHRpQ29uZmlnJGNvbmZlLFxuICAgICAgX2NvbmZldHRpQ29uZmlnJGNvbmZlMiA9IGNvbmZldHRpQ29uZmlnLmNvbmZldHRpTnVtYmVyLFxuICAgICAgY29uZmV0dGlOdW1iZXIgPSBfY29uZmV0dGlDb25maWckY29uZmUyID09PSB2b2lkIDAgPyBjb25mZXR0aUNvbmZpZy5jb25mZXR0aWVzTnVtYmVyIHx8IChjb25mZXR0aUNvbmZpZy5lbW9qaXMgPyBERUZBVUxUX0VNT0pJU19OVU1CRVIgOiBERUZBVUxUX0NPTkZFVFRJX05VTUJFUikgOiBfY29uZmV0dGlDb25maWckY29uZmUyLFxuICAgICAgX2NvbmZldHRpQ29uZmlnJGNvbmZlMyA9IGNvbmZldHRpQ29uZmlnLmNvbmZldHRpQ29sb3JzLFxuICAgICAgY29uZmV0dGlDb2xvcnMgPSBfY29uZmV0dGlDb25maWckY29uZmUzID09PSB2b2lkIDAgPyBERUZBVUxUX0NPTkZFVFRJX0NPTE9SUyA6IF9jb25mZXR0aUNvbmZpZyRjb25mZTMsXG4gICAgICBfY29uZmV0dGlDb25maWckZW1vamkgPSBjb25mZXR0aUNvbmZpZy5lbW9qaXMsXG4gICAgICBlbW9qaXMgPSBfY29uZmV0dGlDb25maWckZW1vamkgPT09IHZvaWQgMCA/IGNvbmZldHRpQ29uZmlnLmVtb2ppZXMgfHwgW10gOiBfY29uZmV0dGlDb25maWckZW1vamksXG4gICAgICBfY29uZmV0dGlDb25maWckZW1vamkyID0gY29uZmV0dGlDb25maWcuZW1vamlTaXplLFxuICAgICAgZW1vamlTaXplID0gX2NvbmZldHRpQ29uZmlnJGVtb2ppMiA9PT0gdm9pZCAwID8gSU5JVElBTF9FTU9KSV9TSVpFIDogX2NvbmZldHRpQ29uZmlnJGVtb2ppMjsgLy8gZGVwcmVjYXRlIHdyb25nIHBsdXJhbCBmb3JtcywgdXNlZCBpbiBlYXJseSByZWxlYXNlc1xuXG4gIGlmIChjb25mZXR0aUNvbmZpZy5lbW9qaWVzKSBjb25zb2xlLmVycm9yKFwiZW1vamllcyBhcmd1bWVudCBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIGVtb2ppcyBpbnN0ZWFkXCIpO1xuICBpZiAoY29uZmV0dGlDb25maWcuY29uZmV0dGllc051bWJlcikgY29uc29sZS5lcnJvcihcImNvbmZldHRpZXNOdW1iZXIgYXJndW1lbnQgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSBjb25mZXR0aU51bWJlciBpbnN0ZWFkXCIpO1xuICByZXR1cm4ge1xuICAgIGNvbmZldHRpUmFkaXVzOiBjb25mZXR0aVJhZGl1cyxcbiAgICBjb25mZXR0aU51bWJlcjogY29uZmV0dGlOdW1iZXIsXG4gICAgY29uZmV0dGlDb2xvcnM6IGNvbmZldHRpQ29sb3JzLFxuICAgIGVtb2ppczogZW1vamlzLFxuICAgIGVtb2ppU2l6ZTogZW1vamlTaXplXG4gIH07XG59XG5cbnZhciBDb25mZXR0aUJhdGNoID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQ29uZmV0dGlCYXRjaChjYW52YXNDb250ZXh0KSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDb25mZXR0aUJhdGNoKTtcblxuICAgIHRoaXMuY2FudmFzQ29udGV4dCA9IGNhbnZhc0NvbnRleHQ7XG4gICAgdGhpcy5zaGFwZXMgPSBbXTtcbiAgICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAoY29tcGxldGlvbkNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gX3RoaXMucmVzb2x2ZVByb21pc2UgPSBjb21wbGV0aW9uQ2FsbGJhY2s7XG4gICAgfSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoQ29uZmV0dGlCYXRjaCwgW3tcbiAgICBrZXk6IFwiZ2V0QmF0Y2hDb21wbGV0ZVByb21pc2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0QmF0Y2hDb21wbGV0ZVByb21pc2UoKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9taXNlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJhZGRTaGFwZXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYWRkU2hhcGVzKCkge1xuICAgICAgdmFyIF90aGlzJHNoYXBlcztcblxuICAgICAgKF90aGlzJHNoYXBlcyA9IHRoaXMuc2hhcGVzKS5wdXNoLmFwcGx5KF90aGlzJHNoYXBlcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY29tcGxldGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY29tcGxldGUoKSB7XG4gICAgICB2YXIgX2E7XG5cbiAgICAgIGlmICh0aGlzLnNoYXBlcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICAoX2EgPSB0aGlzLnJlc29sdmVQcm9taXNlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbCh0aGlzKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJwcm9jZXNzU2hhcGVzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHByb2Nlc3NTaGFwZXModGltZSwgY2FudmFzSGVpZ2h0LCBjbGVhbnVwSW52aXNpYmxlU2hhcGVzKSB7XG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgdmFyIHRpbWVEZWx0YSA9IHRpbWUudGltZURlbHRhLFxuICAgICAgICAgIGN1cnJlbnRUaW1lID0gdGltZS5jdXJyZW50VGltZTtcbiAgICAgIHRoaXMuc2hhcGVzID0gdGhpcy5zaGFwZXMuZmlsdGVyKGZ1bmN0aW9uIChzaGFwZSkge1xuICAgICAgICAvLyBSZW5kZXIgdGhlIHNoYXBlcyBpbiB0aGlzIGJhdGNoXG4gICAgICAgIHNoYXBlLnVwZGF0ZVBvc2l0aW9uKHRpbWVEZWx0YSwgY3VycmVudFRpbWUpO1xuICAgICAgICBzaGFwZS5kcmF3KF90aGlzMi5jYW52YXNDb250ZXh0KTsgLy8gT25seSBjbGVhbnVwIHRoZSBzaGFwZXMgaWYgd2UncmUgYmVpbmcgYXNrZWQgdG9cblxuICAgICAgICBpZiAoIWNsZWFudXBJbnZpc2libGVTaGFwZXMpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzaGFwZS5nZXRJc1Zpc2libGVPbkNhbnZhcyhjYW52YXNIZWlnaHQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIENvbmZldHRpQmF0Y2g7XG59KCk7XG5cbnZhciBKU0NvbmZldHRpID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gSlNDb25mZXR0aSgpIHtcbiAgICB2YXIganNDb25mZXR0aUNvbmZpZyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgSlNDb25mZXR0aSk7XG5cbiAgICB0aGlzLmFjdGl2ZUNvbmZldHRpQmF0Y2hlcyA9IFtdO1xuICAgIHRoaXMuY2FudmFzID0ganNDb25mZXR0aUNvbmZpZy5jYW52YXMgfHwgY3JlYXRlQ2FudmFzKCk7XG4gICAgdGhpcy5jYW52YXNDb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB0aGlzLnJlcXVlc3RBbmltYXRpb25GcmFtZVJlcXVlc3RlZCA9IGZhbHNlO1xuICAgIHRoaXMubGFzdFVwZGF0ZWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB0aGlzLml0ZXJhdGlvbkluZGV4ID0gMDtcbiAgICB0aGlzLmxvb3AgPSB0aGlzLmxvb3AuYmluZCh0aGlzKTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5sb29wKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhKU0NvbmZldHRpLCBbe1xuICAgIGtleTogXCJsb29wXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgICB0aGlzLnJlcXVlc3RBbmltYXRpb25GcmFtZVJlcXVlc3RlZCA9IGZhbHNlO1xuICAgICAgZml4RFBSKHRoaXMuY2FudmFzKTtcbiAgICAgIHZhciBjdXJyZW50VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgdmFyIHRpbWVEZWx0YSA9IGN1cnJlbnRUaW1lIC0gdGhpcy5sYXN0VXBkYXRlZDtcbiAgICAgIHZhciBjYW52YXNIZWlnaHQgPSB0aGlzLmNhbnZhcy5vZmZzZXRIZWlnaHQ7XG4gICAgICB2YXIgY2xlYW51cEludmlzaWJsZVNoYXBlcyA9IHRoaXMuaXRlcmF0aW9uSW5kZXggJSAxMCA9PT0gMDtcbiAgICAgIHRoaXMuYWN0aXZlQ29uZmV0dGlCYXRjaGVzID0gdGhpcy5hY3RpdmVDb25mZXR0aUJhdGNoZXMuZmlsdGVyKGZ1bmN0aW9uIChiYXRjaCkge1xuICAgICAgICBiYXRjaC5wcm9jZXNzU2hhcGVzKHtcbiAgICAgICAgICB0aW1lRGVsdGE6IHRpbWVEZWx0YSxcbiAgICAgICAgICBjdXJyZW50VGltZTogY3VycmVudFRpbWVcbiAgICAgICAgfSwgY2FudmFzSGVpZ2h0LCBjbGVhbnVwSW52aXNpYmxlU2hhcGVzKTsgLy8gRG8gbm90IHJlbW92ZSBpbnZpc2libGUgc2hhcGVzIG9uIGV2ZXJ5IGl0ZXJhdGlvblxuXG4gICAgICAgIGlmICghY2xlYW51cEludmlzaWJsZVNoYXBlcykge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICFiYXRjaC5jb21wbGV0ZSgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLml0ZXJhdGlvbkluZGV4Kys7XG4gICAgICB0aGlzLnF1ZXVlQW5pbWF0aW9uRnJhbWVJZk5lZWRlZChjdXJyZW50VGltZSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInF1ZXVlQW5pbWF0aW9uRnJhbWVJZk5lZWRlZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBxdWV1ZUFuaW1hdGlvbkZyYW1lSWZOZWVkZWQoY3VycmVudFRpbWUpIHtcbiAgICAgIGlmICh0aGlzLnJlcXVlc3RBbmltYXRpb25GcmFtZVJlcXVlc3RlZCkge1xuICAgICAgICAvLyBXZSBhbHJlYWR5IGhhdmUgYSBwZW5kZWQgYW5pbWF0aW9uIGZyYW1lLCBzbyB0aGVyZSBpcyBubyBtb3JlIHdvcmtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5hY3RpdmVDb25mZXR0aUJhdGNoZXMubGVuZ3RoIDwgMSkge1xuICAgICAgICAvLyBObyBzaGFwZXMgdG8gYW5pbWF0ZSwgc28gZG9uJ3QgcXVldWUgYW5vdGhlciBmcmFtZVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVxdWVzdEFuaW1hdGlvbkZyYW1lUmVxdWVzdGVkID0gdHJ1ZTsgLy8gQ2FwdHVyZSB0aGUgbGFzdCB1cGRhdGVkIHRpbWUgZm9yIGFuaW1hdGlvblxuXG4gICAgICB0aGlzLmxhc3RVcGRhdGVkID0gY3VycmVudFRpbWUgfHwgbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5sb29wKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiYWRkQ29uZmV0dGlcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYWRkQ29uZmV0dGkoKSB7XG4gICAgICB2YXIgY29uZmV0dGlDb25maWcgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXG4gICAgICB2YXIgX25vcm1hbGl6ZUNvbmZldHRpQ29uID0gbm9ybWFsaXplQ29uZmV0dGlDb25maWcoY29uZmV0dGlDb25maWcpLFxuICAgICAgICAgIGNvbmZldHRpUmFkaXVzID0gX25vcm1hbGl6ZUNvbmZldHRpQ29uLmNvbmZldHRpUmFkaXVzLFxuICAgICAgICAgIGNvbmZldHRpTnVtYmVyID0gX25vcm1hbGl6ZUNvbmZldHRpQ29uLmNvbmZldHRpTnVtYmVyLFxuICAgICAgICAgIGNvbmZldHRpQ29sb3JzID0gX25vcm1hbGl6ZUNvbmZldHRpQ29uLmNvbmZldHRpQ29sb3JzLFxuICAgICAgICAgIGVtb2ppcyA9IF9ub3JtYWxpemVDb25mZXR0aUNvbi5lbW9qaXMsXG4gICAgICAgICAgZW1vamlTaXplID0gX25vcm1hbGl6ZUNvbmZldHRpQ29uLmVtb2ppU2l6ZTsgLy8gVXNlIHRoZSBib3VuZGluZyByZWN0IHJhdGhlciB0YWhuIHRoZSBjYW52YXMgd2lkdGggLyBoZWlnaHQsIGJlY2F1c2VcbiAgICAgIC8vIC53aWR0aCAvIC5oZWlnaHQgYXJlIHVuc2V0IHVudGlsIGEgbGF5b3V0IHBhc3MgaGFzIGJlZW4gY29tcGxldGVkLiBVcG9uXG4gICAgICAvLyBjb25mZXR0aSBiZWluZyBpbW1lZGlhdGVseSBxdWV1ZWQgb24gYSBwYWdlIGxvYWQsIHRoaXMgaGFzbid0IGhhcHBlbmVkIHNvXG4gICAgICAvLyB0aGUgZGVmYXVsdCBvZiAzMDB4MTUwIHdpbGwgYmUgcmV0dXJuZWQsIGNhdXNpbmcgYW4gaW1wcm9wZXIgc291cmNlIHBvaW50XG4gICAgICAvLyBmb3IgdGhlIGNvbmZldHRpIGFuaW1hdGlvbi5cblxuXG4gICAgICB2YXIgY2FudmFzUmVjdCA9IHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgdmFyIGNhbnZhc1dpZHRoID0gY2FudmFzUmVjdC53aWR0aDtcbiAgICAgIHZhciBjYW52YXNIZWlnaHQgPSBjYW52YXNSZWN0LmhlaWdodDtcbiAgICAgIHZhciB5UG9zaXRpb24gPSBjYW52YXNIZWlnaHQgKiA1IC8gNztcbiAgICAgIHZhciBsZWZ0Q29uZmV0dGlQb3NpdGlvbiA9IHtcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogeVBvc2l0aW9uXG4gICAgICB9O1xuICAgICAgdmFyIHJpZ2h0Q29uZmV0dGlQb3NpdGlvbiA9IHtcbiAgICAgICAgeDogY2FudmFzV2lkdGgsXG4gICAgICAgIHk6IHlQb3NpdGlvblxuICAgICAgfTtcbiAgICAgIHZhciBjb25mZXR0aUdyb3VwID0gbmV3IENvbmZldHRpQmF0Y2godGhpcy5jYW52YXNDb250ZXh0KTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb25mZXR0aU51bWJlciAvIDI7IGkrKykge1xuICAgICAgICB2YXIgY29uZmV0dGlPblRoZVJpZ2h0ID0gbmV3IENvbmZldHRpU2hhcGUoe1xuICAgICAgICAgIGluaXRpYWxQb3NpdGlvbjogbGVmdENvbmZldHRpUG9zaXRpb24sXG4gICAgICAgICAgZGlyZWN0aW9uOiAncmlnaHQnLFxuICAgICAgICAgIGNvbmZldHRpUmFkaXVzOiBjb25mZXR0aVJhZGl1cyxcbiAgICAgICAgICBjb25mZXR0aUNvbG9yczogY29uZmV0dGlDb2xvcnMsXG4gICAgICAgICAgY29uZmV0dGlOdW1iZXI6IGNvbmZldHRpTnVtYmVyLFxuICAgICAgICAgIGVtb2ppczogZW1vamlzLFxuICAgICAgICAgIGVtb2ppU2l6ZTogZW1vamlTaXplLFxuICAgICAgICAgIGNhbnZhc1dpZHRoOiBjYW52YXNXaWR0aFxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGNvbmZldHRpT25UaGVMZWZ0ID0gbmV3IENvbmZldHRpU2hhcGUoe1xuICAgICAgICAgIGluaXRpYWxQb3NpdGlvbjogcmlnaHRDb25mZXR0aVBvc2l0aW9uLFxuICAgICAgICAgIGRpcmVjdGlvbjogJ2xlZnQnLFxuICAgICAgICAgIGNvbmZldHRpUmFkaXVzOiBjb25mZXR0aVJhZGl1cyxcbiAgICAgICAgICBjb25mZXR0aUNvbG9yczogY29uZmV0dGlDb2xvcnMsXG4gICAgICAgICAgY29uZmV0dGlOdW1iZXI6IGNvbmZldHRpTnVtYmVyLFxuICAgICAgICAgIGVtb2ppczogZW1vamlzLFxuICAgICAgICAgIGVtb2ppU2l6ZTogZW1vamlTaXplLFxuICAgICAgICAgIGNhbnZhc1dpZHRoOiBjYW52YXNXaWR0aFxuICAgICAgICB9KTtcbiAgICAgICAgY29uZmV0dGlHcm91cC5hZGRTaGFwZXMoY29uZmV0dGlPblRoZVJpZ2h0LCBjb25mZXR0aU9uVGhlTGVmdCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYWN0aXZlQ29uZmV0dGlCYXRjaGVzLnB1c2goY29uZmV0dGlHcm91cCk7XG4gICAgICB0aGlzLnF1ZXVlQW5pbWF0aW9uRnJhbWVJZk5lZWRlZCgpO1xuICAgICAgcmV0dXJuIGNvbmZldHRpR3JvdXAuZ2V0QmF0Y2hDb21wbGV0ZVByb21pc2UoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY2xlYXJDYW52YXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2xlYXJDYW52YXMoKSB7XG4gICAgICB0aGlzLmFjdGl2ZUNvbmZldHRpQmF0Y2hlcyA9IFtdO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBKU0NvbmZldHRpO1xufSgpO1xuXG5leHBvcnQgZGVmYXVsdCBKU0NvbmZldHRpO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvZGlzdC9janMuanM/P3J1bGVTZXRbMV0ucnVsZXNbMF0udXNlWzJdIS4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL21haW4uY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9ydWxlU2V0WzFdLnJ1bGVzWzBdLnVzZVsyXSEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanMhLi9tYWluLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi4vXCI7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5iID0gZG9jdW1lbnQuYmFzZVVSSSB8fCBzZWxmLmxvY2F0aW9uLmhyZWY7XG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbi8vIG5vIG9uIGNodW5rcyBsb2FkZWRcblxuLy8gbm8ganNvbnAgZnVuY3Rpb24iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsIlwidXNlIHN0cmljdFwiXG5cbmltcG9ydCBcIi4uL3N0eWxlL21haW4uY3NzXCJcbmltcG9ydCB7IENhbXBhaWduIH0gZnJvbSBcIi4vY2FtcGFpZ24uanNcIlxuaW1wb3J0IHsgUm91bmQgfSBmcm9tIFwiLi9yb3VuZC5qc1wiXG5pbXBvcnQgeyBVSSB9IGZyb20gXCIuL3VpLmpzXCJcbmltcG9ydCB7IFdPUkRTIH0gZnJvbSBcIi4vd29yZHMuanNcIlxuaW1wb3J0IHsgV09SRFNfU1VQUExFTUVOVCB9IGZyb20gXCIuL3dvcmRzLXN1cHBsZW1lbnQuanNcIlxuaW1wb3J0IEpTQ29uZmV0dGkgZnJvbSBcImpzLWNvbmZldHRpXCJcblxubGV0IGdhbWUsIHVpLCBjYW1wYWlnblxuY29uc3QganNDb25mZXR0aSA9IG5ldyBKU0NvbmZldHRpKClcblxuYXN5bmMgZnVuY3Rpb24gY2hlY2tSb3coKSB7XG4gIGNvbnN0IGd1ZXNzID0gdWkuYm9hcmRbdWkuY3VyUm93XS5qb2luKFwiXCIpXG4gIHVpLmNsaWNrQXVkaW8ucGF1c2UoKVxuICBpZiAoXG4gICAgIVdPUkRTLmluY2x1ZGVzKGd1ZXNzLnRvVXBwZXJDYXNlKCkpICYmXG4gICAgIVdPUkRTX1NVUFBMRU1FTlQuaW5jbHVkZXMoZ3Vlc3MudG9VcHBlckNhc2UoKSlcbiAgKSB7XG4gICAgdWkuaW52YWxpZEF1ZGlvLnBsYXkoKS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIC8qZG8gbm90aGluZyAtIGl0J3MganVzdCBhdWRpbyovXG4gICAgfSlcbiAgICB1aS5kaXNwbGF5TWVzc2FnZShgJHtndWVzc30gaXMgbm90IGEgd29yZGApXG4gICAgcmV0dXJuXG4gIH1cbiAgZ2FtZS5zdWJtaXRHdWVzcyhndWVzcylcbiAgYXdhaXQgdWkucmV2ZWFsR3Vlc3MoZ2FtZS5ndWVzc1N0YXR1cygpKVxuICB1aS51cGRhdGVLZXlib2FyZChnYW1lLmxldHRlclN0YXR1cylcbiAgaWYgKGdhbWUuc2VjcmV0V29yZCA9PT0gZ3Vlc3MpIHtcbiAgICB3aW5Sb3V0aW5lKClcbiAgICByZXR1cm5cbiAgfVxuICBpZiAodWkuY3VyUm93ID49IDUpIHtcbiAgICBsb3NlUm91dGluZSgpXG4gICAgcmV0dXJuXG4gIH1cblxuICB1aS5jdXJSb3crK1xuICB1aS5jdXJDb2wgPSAwXG59XG5cbmZ1bmN0aW9uIHdpblJvdXRpbmUoKSB7XG4gIHVpLmN1clJvdysrXG4gIGxldCBnYW1lRGV0YWlscyA9IHtcbiAgICBvdXRjb21lOiBcIndvblwiLFxuICAgIGF0dGVtcHRzOiB1aS5jdXJSb3csXG4gICAgd29yZDogZ2FtZS5zZWNyZXRXb3JkLFxuICAgIHNjb3JlOiBnYW1lLndvcmRCYXNlUG9pbnRWYWx1ZSgpICogMTAgKiogKDYgLSB1aS5jdXJSb3cpLFxuICB9XG4gIHVpLmJ1c3kgPSB0cnVlXG4gIHVpLnN1Y2Nlc3NBdWRpby5wbGF5KCkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgLypkbyBub3RoaW5nIC0gaXQncyBqdXN0IGF1ZGlvKi9cbiAgfSlcbiAganNDb25mZXR0aS5hZGRDb25mZXR0aSh7XG4gICAgY29uZmV0dGlDb2xvcnM6IFtcbiAgICAgIFwiIzE3YWFkOFwiLFxuICAgICAgXCIjMDE3Y2IwXCIsXG4gICAgICBcIiMwYjYxYThcIixcbiAgICAgIFwiI2ZlOTIwMFwiLFxuICAgICAgXCIjZWU2MTBhXCIsXG4gICAgICBcIiNlYTQxMGJcIixcbiAgICBdLFxuICB9KVxuICBjYW1wYWlnbi51cGRhdGVDYW1wYWlnbihnYW1lRGV0YWlscylcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgdWkuc2hvd01vZGFsKFxuICAgICAgXCJTdWNjZXNzXCIsXG4gICAgICBbXG4gICAgICAgIHRhYmxpemVTdGF0cyhnYW1lRGV0YWlscyksXG4gICAgICAgIFwiPGk+V2hhdCBpdCBtZWFuczo8Lz5cIixcbiAgICAgICAgLi4uZm9ybWF0RGVmaW5pdGlvbihnYW1lLndvcmREZWZpbml0aW9uKSxcbiAgICAgIF0sXG4gICAgICBnYW1lLmdhbWVTdGF0ZVxuICAgIClcbiAgICB1aS5idXN5ID0gZmFsc2VcbiAgfSwgMTUwMClcbn1cblxuZnVuY3Rpb24gbG9zZVJvdXRpbmUoKSB7XG4gIHVpLmN1clJvdysrXG4gIGxldCBnYW1lRGV0YWlscyA9IHtcbiAgICBvdXRjb21lOiBcImxvc3RcIixcbiAgICBhdHRlbXB0czogdWkuY3VyUm93LFxuICAgIHdvcmQ6IGdhbWUuc2VjcmV0V29yZCxcbiAgICBzY29yZTpcbiAgICAgIGNhbXBhaWduLmF2ZXJhZ2VTY29yZSgpID4gMFxuICAgICAgICA/IC0xICogY2FtcGFpZ24uYXZlcmFnZVNjb3JlKClcbiAgICAgICAgOiBjYW1wYWlnbi5hdmVyYWdlU2NvcmUoKSxcbiAgfVxuICBjYW1wYWlnbi51cGRhdGVDYW1wYWlnbihnYW1lRGV0YWlscylcbiAgdWkuZmFpbEF1ZGlvLnBsYXkoKS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAvKmRvIG5vdGhpbmcgLSBpdCdzIGp1c3QgYXVkaW8qL1xuICB9KVxuICB1aS5zaG93TW9kYWwoXG4gICAgXCJGYWlsdXJlXCIsXG4gICAgW1xuICAgICAgdGFibGl6ZVN0YXRzKGdhbWVEZXRhaWxzKSxcbiAgICAgIFwiPGk+V2hhdCBpdCBtZWFuczo8Lz5cIixcbiAgICAgIC4uLmZvcm1hdERlZmluaXRpb24oZ2FtZS53b3JkRGVmaW5pdGlvbiksXG4gICAgXSxcbiAgICBnYW1lLmdhbWVTdGF0ZVxuICApXG59XG5cbmZ1bmN0aW9uIGZvcm1hdERlZmluaXRpb24ocGFja2VkRGVmaW5pdGlvbikge1xuICByZXR1cm4gcGFja2VkRGVmaW5pdGlvbi5tYXAoKGVsKSA9PiB7XG4gICAgbGV0IGh0bWxTdHJpbmcgPSBcIlwiXG4gICAgaWYgKGVsLnBhcnRPZlNwZWVjaCkgaHRtbFN0cmluZyA9IGA8aT4ke2VsLnBhcnRPZlNwZWVjaH06PC9pPiZuYnNwOyZuYnNwO2BcbiAgICByZXR1cm4gYCR7aHRtbFN0cmluZ30ke2VsLmRlZmluaXRpb259YFxuICB9KVxufVxuXG5mdW5jdGlvbiB0YWJsaXplU3RhdHMoZ2FtZURldGFpbHMpIHtcbiAgbGV0IHN0YXRTdHIgPSBcIjxocj48dGFibGUgY2xhc3M9J3N0YXRUYWJsZSc+XCJcblxuICBmdW5jdGlvbiBzdGF0Um93KHN0YXRLZXksIHN0YXRWYWx1ZSkge1xuICAgIHJldHVybiBgPHRyPjx0ZD4ke3N0YXRLZXl9PC90ZD48dGQgY2xhc3M9XCJzdGF0TnVtXCI+JHtzdGF0VmFsdWV9PC90ZD48L3RyPmBcbiAgfVxuXG4gIGlmIChnYW1lRGV0YWlscykge1xuICAgIHN0YXRTdHIgPSBgJHtzdGF0U3RyfSR7c3RhdFJvdyhcIldvcmRcIiwgZ2FtZURldGFpbHMud29yZCl9YFxuICAgIHN0YXRTdHIgPSBgJHtzdGF0U3RyfSR7c3RhdFJvdyhcIkF0dGVtcHRzXCIsIGdhbWVEZXRhaWxzLmF0dGVtcHRzKX1gXG4gICAgc3RhdFN0ciA9IGAke3N0YXRTdHJ9JHtzdGF0Um93KFwiUm91bmQgU2NvcmVcIiwgZ2FtZURldGFpbHMuc2NvcmUpfWBcbiAgfVxuICBmb3IgKGxldCBlbCBvZiBjYW1wYWlnbi5jYW1wYWlnblN1bW1hcnkoKSkge1xuICAgIHN0YXRTdHIgPSBgJHtzdGF0U3RyfSR7c3RhdFJvdyhlbC5sYWJlbCwgZWwudmFsdWUpfWBcbiAgfVxuICByZXR1cm4gYCR7c3RhdFN0cn08L3RhYmxlPjxocj5gXG59XG5cbmZ1bmN0aW9uIGluc3RydWN0aW9ucygpIHtcbiAgdWkuc2hvd01vZGFsKFxuICAgIFwiTWlzc2lvbiBCcmllZmluZ1wiLFxuICAgIFtcbiAgICAgIFwiRGVjcnlwdCB0aGUgY29kZS5cIixcbiAgICAgIFwiRWFjaCBjb2RlIGlzIGEgNSBsZXR0ZXIgd29yZC5cIixcbiAgICAgIFwiQmx1ZSBpbmRpY2F0ZXMgcmlnaHQgbGV0dGVyIGluIHJpZ2h0IHBvc2l0aW9uLlwiLFxuICAgICAgXCJPcmFuZ2UgaW5kaWNhdGVzIHJpZ2h0IGxldHRlciBpbiB3cm9uZyBwb3NpdGlvbi5cIixcbiAgICAgIFwiWW91IGhhdmUgNiBhdHRlbXB0cyBiZWZvcmUgbG9ja291dC5cIixcbiAgICAgIFwiR29vZCBMdWNrIVwiLFxuICAgICAgLy8gXCImbmJzcDsmbmJzcDtcIixcbiAgICAgIHRhYmxpemVTdGF0cygpLFxuICAgICAgXCJUaGUgc2NvcmUgY2FsY3VsYXRpb24gc3RhcnRzIHdpdGggdGhlIHJhdyBzY3JhYmJsZSB3b3JkIFwiICtcbiAgICAgICAgXCJ2YWx1ZSBhbmQgaXMgdGhlbiBtdWx0aXBsaWVkIGJ5IDEwIGZvciBldmVyeSB1bnVzZWQgYXR0ZW1wdC4gXCIgK1xuICAgICAgICBcIkZvciBleGFtcGxlLCBpZiB0aGUgd29yZCB3YXMgU01BUlQgYW5kIGl0IHdhcyBzb2x2ZWQgb24gdGhlIFwiICtcbiAgICAgICAgXCJmb3VydGggYXR0ZW1wdCwgdGhlIHNjb3JlIHdvdWxkIGJlIHRoZSByYXcgd29yZCB2YWx1ZSBvZiA3IG11bHRpcGxpZWQgXCIgK1xuICAgICAgICBcImJ5IDEwIHR3aWNlLCBvbmNlIGZvciBlYWNoIG9mIHRoZSB0d28gdW51c2VkIGF0dGVtcHRzOiA3IHggMTAgeCAxMCA9IDcwMC5cIixcbiAgICBdLFxuICAgIGdhbWUuZ2FtZVN0YXRlXG4gIClcbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICBpZiAodWkuYnVzeSkgcmV0dXJuXG4gIGlmIChldmVudC5rZXkgPT09IFwiRW50ZXJcIiAmJiBtb2RhbENvbnRhaW5lci5zdHlsZS5kaXNwbGF5ICE9PSBcIm5vbmVcIikge1xuICAgIGNsb3NlQnV0dG9uLmNsaWNrKClcbiAgICByZXR1cm5cbiAgfVxuXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGV2ZW50LmtleS50b1VwcGVyQ2FzZSgpKSAmJlxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGV2ZW50LmtleS50b1VwcGVyQ2FzZSgpKS5jbGljaygpXG5cbiAgaWYgKGV2ZW50LmtleSA9PT0gXCJEZWxldGVcIikgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJCQUNLU1BBQ0VcIikuY2xpY2soKVxufSlcblxucGFnZUNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCB0b3VjaEFuZENsaWNrSGFuZGxlcilcblxucGFnZUNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdG91Y2hBbmRDbGlja0hhbmRsZXIpXG5cbmZ1bmN0aW9uIHRvdWNoQW5kQ2xpY2tIYW5kbGVyKGV2ZW50KSB7XG4gIGlmICghKGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PT0gXCJTUEFOXCIpKSByZXR1cm5cbiAgaWYgKHVpLmJ1c3kpIHJldHVyblxuXG4gIGlmIChldmVudC50eXBlID09PSBcInRvdWNoc3RhcnRcIikge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgfVxuXG4gIHVpLmNsaWNrQXVkaW8uY3VycmVudFRpbWUgPSAwXG4gIHVpLmNsaWNrQXVkaW8ucGxheSgpLmNhdGNoKChlcnJvcikgPT4ge1xuICAgIC8qZG8gbm90aGluZyAtIGl0J3MganVzdCBhdWRpbyovXG4gIH0pXG5cbiAgbGV0IGtleSA9IGV2ZW50LnRhcmdldC5pZFxuICBpZiAoZ2FtZS5nYW1lU3RhdGUgPT09IFwiUExBWUlOR1wiKSB7XG4gICAgaWYgKGtleSA9PT0gXCJCQUNLU1BBQ0VcIikgdWkuZGVsZXRlTGV0dGVyKClcbiAgICBpZiAoa2V5ID09PSBcIkVOVEVSXCIgJiYgdWkuY3VyQ29sID4gNCkgY2hlY2tSb3coKVxuICAgIGlmIChcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaXCIuc3BsaXQoXCJcIikuaW5jbHVkZXMoa2V5KSlcbiAgICAgIHVpLmFwcGVuZExldHRlcihrZXkpXG4gICAgcmV0dXJuXG4gIH1cblxuICBpZiAoZ2FtZS5nYW1lU3RhdGUgIT09IFwiUExBWUlOR1wiICYmIGtleSA9PT0gXCJFTlRFUlwiKSBuZXdSb3VuZCgpXG59XG5cbmZ1bmN0aW9uIG5ld1JvdW5kKCkge1xuICBnYW1lID0gbmV3IFJvdW5kKFdPUkRTW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIFdPUkRTLmxlbmd0aCldKVxuICBjb25zb2xlLmxvZyhnYW1lLnNlY3JldFdvcmQpXG4gIHVpLnJlc2V0KClcbn1cblxuZnVuY3Rpb24gbWFpbigpIHtcbiAgLy8gbG9jYWxTdG9yYWdlLmNsZWFyKClcbiAgY2FtcGFpZ24gPSBuZXcgQ2FtcGFpZ24oKVxuICB1aSA9IG5ldyBVSShwYWdlQ29udGFpbmVyKVxuICBuZXdSb3VuZCgpXG4gIGluc3RydWN0aW9ucygpXG59XG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gIG1haW4oKVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9