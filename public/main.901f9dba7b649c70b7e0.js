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
    this.initialUiSetup(container);
    this.audioSetup();
    this.curRow = 0;
    this.curCol = 0;
    this.board = [
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ];
    this.busy = false;
  }

  initialUiSetup(container) {
    const header = document.createElement("div");
    header.id = "header";
    header.className = "header";
    header.textContent = "WordBrunner";
    container.appendChild(header);

    const gameContainer = document.createElement("div");
    gameContainer.id = "gameContainer";
    gameContainer.className = "gameContainer";
    this.drawTileGrid(gameContainer);
    container.appendChild(gameContainer);

    const keyboardContainer = document.createElement("div");
    keyboardContainer.id = "keyboardContainer";
    keyboardContainer.className = "keyboardContainer";
    this.drawKeyboard(keyboardContainer);
    container.appendChild(keyboardContainer);

    const modalContainer = document.createElement("div");
    modalContainer.id = "modalContainer";
    modalContainer.className = "modalContainer";
    container.appendChild(modalContainer);
  }

  audioSetup() {
    this.clickAudio = new Audio();
    this.clickAudio.src = _audio_click_mp3__WEBPACK_IMPORTED_MODULE_0__;
    this.compAudio = new Audio();
    this.compAudio.src = _audio_comp_mp3__WEBPACK_IMPORTED_MODULE_1__;
    this.successAudio = new Audio();
    this.successAudio.src = _audio_fight_mp3__WEBPACK_IMPORTED_MODULE_2__;
    this.failAudio = new Audio();
    this.failAudio.src = _audio_regret_mp3__WEBPACK_IMPORTED_MODULE_3__;
    this.invalidAudio = new Audio();
    this.invalidAudio.src = _audio_invalid_mp3__WEBPACK_IMPORTED_MODULE_4__;
    this.ratchetAudio = new Audio();
    this.ratchetAudio.src = _audio_ratchet_mp3__WEBPACK_IMPORTED_MODULE_5__;
  }

  reset() {
    this.curRow = 0;
    this.curCol = 0;
    this.board = [
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ];
    this.busy = false;
    ENTER.classList.remove("gameOver");
    ENTER.textContent = "ENTER";
    header.className = "header";
    header.textContent = "wordBrunner";
    this.flipAndResetTiles();
    for (let letter of "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")) {
      let key = document.getElementById(letter);
      key.className = "key";
    }
  }

  iterateTiles(callback) {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        callback(document.getElementById(`tile-${row}-${col}`));
      }
    }
  }

  flipAndResetTiles() {
    this.clickAudio.pause();
    this.ratchetAudio.play().catch((error) => {
      /*do nothing - it's just audio*/
    });

    setTimeout(() => {
      this.iterateTiles((tile) => {
        tile.classList.remove("tileHit", "tileClose", "tileMiss");
        tile.innerHTML = '<span class="tileWaterMark">B</span>';
      });
    }, 500);

    setTimeout(() => {
      this.iterateTiles((tile) => {
        tile.classList.remove("reset");
      });
    }, 1000);

    this.iterateTiles((tile) => {
      tile.classList.add("reset");
    });
  }

  drawTile(container, row, col, value = "") {
    const tile = document.createElement("div");
    tile.id = `tile-${row}-${col}`;
    tile.className = "tile";
    tile.textContent = value;
    container.appendChild(tile);
    // return tile
  }

  drawTileGrid(container, rows = 6, cols = 5) {
    const tileGrid = document.createElement("div");
    tileGrid.className = "tileGrid";

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        this.drawTile(tileGrid, row, col, "");
      }
    }
    container.appendChild(tileGrid);
  }

  drawKey(key) {
    const keyButton = document.createElement("span");
    keyButton.id = key === "⌫" ? "BACKSPACE" : key === "ENTER" ? "ENTER" : key;
    keyButton.role = "button";
    keyButton.className = key === " " ? "keySpacer" : "key";
    keyButton.textContent = key;
    return keyButton;
  }

  drawKeyboardRow(container, row, keys) {
    const keyboardRow = document.createElement("div");
    keyboardRow.className = "keyboardRowContainer";

    const keyboardRowGrid = document.createElement("div");
    keyboardRowGrid.id = `keyboardRow${row}`;
    //Following 3 rows added to prevent webpack PurgeCSS from removing the classes from CSS,
    //as it is not smart enough to interpret the template literal that follows.
    keyboardRowGrid.className = `keyboardRow1`;
    keyboardRowGrid.className = `keyboardRow2`;
    keyboardRowGrid.className = `keyboardRow3`;
    keyboardRowGrid.className = `keyboardRow${row}`;

    for (let key of keys) {
      const keyButton = this.drawKey(key);
      keyboardRowGrid.append(keyButton);
    }

    keyboardRow.append(keyboardRowGrid);
    container.append(keyboardRow);
  }

  drawKeyboard(container) {
    const keys = [
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      [" ", "A", "S", "D", "F", "G", "H", "J", "K", "L", " "],
      ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
    ];
    const keyboardGrid = document.createElement("div");
    keyboardGrid.className = "keyboardGrid";
    keyboardGrid.id = "keyboardGrid";

    container.append(keyboardGrid);

    this.drawKeyboardRow(keyboardGrid, 1, keys[0]);
    this.drawKeyboardRow(keyboardGrid, 2, keys[1]);
    this.drawKeyboardRow(keyboardGrid, 3, keys[2]);
  }

  appendLetter(letter) {
    if (this.curCol < 5 && this.curRow < 6) {
      const tile = document.getElementById(
        `tile-${this.curRow}-${this.curCol}`
      );
      tile.textContent = letter;
      this.board[this.curRow][this.curCol] = letter;
      this.curCol++;
    }
  }

  deleteLetter() {
    if (this.curCol > 0) {
      this.curCol--;
      const tile = document.getElementById(
        `tile-${this.curRow}-${this.curCol}`
      );
      tile.innerHTML = '<span class="tileWaterMark">B</span>';
      this.board[this.curRow][this.curCol] = "";
      BACKSPACE.classList.remove("notWord");
    }
  }

  displayMessage(message, time = 3500) {
    header.className = "message";
    header.textContent = message;
    setTimeout(() => {
      header.className = "header";
      header.textContent = "wordBrunner";
    }, time);
  }

  updateKeyboard(letterStatus) {
    for (let [letter, status] of Object.entries(letterStatus)) {
      let key = document.getElementById(letter);
      key.classList.add(
        status === "G"
          ? "tileHit"
          : status === "Y"
          ? "tileClose"
          : status === "R"
          ? "tileMiss"
          : "key"
      );
    }
  }

  async revealGuess(guessStatus) {
    return new Promise(async (resolve, reject) => {
      this.busy = true;
      let gArr = guessStatus;
      this.compAudio.play().catch((error) => {
        /*do nothing - it's just audio*/
      });
      let word = gArr[this.curRow];
      let interval = setInterval(() => this.scrambleEffect(), 30);
      await new Promise((resolve, reject) => {
        setTimeout(resolve, 1000);
      });
      clearInterval(interval);
      this.colorTiles(word);
      this.busy = false;
      resolve();
    });
  }

  scrambleEffect() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let col = 0; col < 5; col++) {
      let tile = document.getElementById(`tile-${this.curRow}-${col}`);
      tile.textContent = letters[Math.floor(Math.random() * 26)];
    }
  }

  colorTiles(word) {
    for (let [idx, letter] of word.entries()) {
      let tile = document.getElementById(`tile-${this.curRow}-${idx}`);
      tile.textContent = word[idx]["letter"];
      tile.classList.add(
        letter.status === "G"
          ? "tileHit"
          : letter.status === "Y"
          ? "tileClose"
          : "tileMiss"
      );
    }
  }

  showModal(title = "Title", content = ["lorem ipsum"], gameState) {
    const modalCloseHandler = (event) => {
      if (event.type === "touchstart") {
        event.preventDefault();
      }
      modalContainer.style.display = "none";
      this.successAudio.pause();
      this.successAudio.currentTime = 0;
      this.failAudio.pause();
      this.failAudio.currentTime = 0;
      if (gameState !== "PLAYING") {
        ENTER.classList.add("gameOver");
        ENTER.textContent = "RESET";
      }
    };

    let modalContent = document.createElement("div");
    modalContent.id = "modalContent";
    modalContent.className = "modalContent";

    let closeButton = document.createElement("span");
    closeButton.id = "closeButton";
    closeButton.className = "close";
    closeButton.textContent = `x`;
    closeButton.addEventListener("click", modalCloseHandler);
    closeButton.addEventListener("touchstart", modalCloseHandler);
    modalContent.appendChild(closeButton);

    let modalTitle = document.createElement("h4");
    modalTitle.className = "modalTitle";
    modalTitle.textContent = title;
    modalContent.appendChild(modalTitle);

    for (let item of content) {
      let modalContentItem = document.createElement("p");
      modalContentItem.className = "modalContentItem";
      modalContentItem.innerHTML = item;
      modalContent.appendChild(modalContentItem);
    }

    modalContainer.replaceChildren();
    modalContainer.appendChild(modalContent);
    modalContainer.style.display = "block";
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

.notWord {
  animation-name: flashBackspace;
  animation-duration: 1s;
  animation-iteration-count: infinite;
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
@keyframes flashBackspace {
  0%, 100% {
    background-color: var(--brOrange2);
    color: var(--text);
    border: 0.25cqw solid var(--text);
  }
  50% {
    background-color: var(--default);
    color: var(--text);
    border: 0.25cqw solid var(--text);
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
}`, "",{"version":3,"sources":["webpack://./client/style/main.css"],"names":[],"mappings":"AAAA;EACE,kBAAA;EACA,eAAA;EACA,gBAAA;EACA,gBAAA;EACA,kBAAA;EACA,kBAAA;EACA,kBAAA;EACA,oBAAA;EACA,SAAA;EACA,oBAAA;EACA,oBAAA;AACF;;AAEA;EACE,2BAAA;EACA,4CAAA;AACF;AAEA;EACE,sBAAA;EACA,kBAAA;EACA,mBAAA;EACA,4CAAA;AAAF;AAGA;;EAEE,gCAAA;EACA,+BAAA;EACA,SAAA;EACA,UAAA;EACA,kBAAA;AADF;;AAIA;EACE,SAAA;EACA,UAAA;AADF;;AAIA;EACE,aAAA;EACA,gBAAA;EACA,gBAAA;EACA,iBAAA;EACA,2BAAA;AADF;;AAIA;EACE,aAAA;EACA,sBAAA;EACA,cAAA;EACA,kBAAA;EACA;;oBAAA;EAGA,WAAA;EACA,8BAAA;EACA,8BAAA;EACA,qCAAA;EACA,wBAAA;EACA,2BAAA;EACA,cAAA;AADF;;AAIA;EACE,aAAA;EACA,cAAA;EACA,uBAAA;EACA,uBAAA;EACA,2BAAA;EACA,eAAA;EACA,eAAA;EACA,YAAA;EACA,wCAAA;EACA,YAAA;EACA,uCAAA;EACA,oBAAA;EACA,yBAAA;EACA,qBAAA;EACA,iBAAA;AADF;;AAIA;EACE,uBAAA;EACA,+BAAA;EACA,eAAA;EACA,eAAA;EACA,YAAA;EACA,YAAA;EACA,4CAAA;EACA,yCAAA;EACA,gCAAA;AADF;;AAIA;EACE,aAAA;EACA,uBAAA;EACA,cAAA;EACA,aAAA;EACA,YAAA;EACA,oBAAA;EACA,yBAAA;EACA,qBAAA;EACA,iBAAA;AADF;;AAIA;EACE,aAAA;EACA,YAAA;EACA,2CAAA;EACA,0CAAA;EACA,gBAAA;EACA,gBAAA;AADF;;AAIA;EACE,iBAAA;EACA,iCAAA;EACA,sBAAA;EACA,kBAAA;EACA,yBAAA;EACA,aAAA;EACA,mBAAA;EACA,+BAAA;EACA,eAAA;AADF;;AAIA;EACE,2BAAA;EACA,mBAAA;AADF;;AAIA;EACE,aAAA;EACA,cAAA;EACA,uBAAA;EACA,YAAA;EACA,gBAAA;EACA,aAAA;AADF;;AAIA;EACE,aAAA;EACA,YAAA;EACA,+BAAA;EACA,0BAAA;EACA,oBAAA;AADF;;AAIA;EACE,aAAA;EACA,YAAA;EACA,uBAAA;EACA,8DAAA;EACA,uBAAA;AADF;;AAGA;EACE,aAAA;EACA,YAAA;EACA,uBAAA;EACA,sEAAA;EACA,uBAAA;AAAF;;AAEA;EACE,aAAA;EACA,YAAA;EACA,uBAAA;EACA,8DAAA;EACA,uBAAA;AACF;;AAEA;;EAEE,aAAA;EACA,iCAAA;EACA,sBAAA;EACA,kBAAA;EACA,+BAAA;EACA,iBAAA;EACA,mBAAA;EACA,mBAAA;EACA,YAAA;EACA,qBAAA;EACA,kBAAA;EACA,mBAAA;EACA,gCAAA;EACA,yBAAA;EACA,qBAAA;EACA,iBAAA;AACF;;AAEA;EACE,kBAAA;EACA,mBAAA;AACF;;AAEA;;EAEE,mBAAA;EACA,iBAAA;AACF;;AAEA;EACE,uBAAA;EACA,qCAAA;AACF;;AAEA;EACE,qBAAA;EACA,mCAAA;AACF;;AACA;EACE,mBAAA;EACA,iCAAA;AAEF;;AACA;EACE,gCAAA;EACA,qBAAA;EACA,oCAAA;AAEF;;AACA;EACE,8BAAA;EACA,sBAAA;EACA,mCAAA;AAEF;;AACA;EACE,8BAAA;AAEF;;AACA;EACE;IACE,wBAAA;EAEF;EAAA;IACE,yBAAA;EAEF;EAAA;IACE,wBAAA;EAEF;AACF;AACA;EACE;IAEE,kCAAA;IACA,kBAAA;IACA,iCAAA;EAAF;EAEA;IACE,gCAAA;IACA,kBAAA;IACA,iCAAA;EAAF;AACF;AAGA;EACE,aAAA;EACA,eAAA;EACA,UAAA;EACA,kBAAA;EACA,MAAA;EACA,QAAA;EACA,OAAA;EACA,SAAA;EACA,aAAA;EACA,cAAA;EACA,uCAAA;AADF;;AAIA;EACE,+BAAA;EACA,wCAAA;EACA,uBAAA;EACA,YAAA;EACA,eAAA;EACA,cAAA;EACA,YAAA;EACA,gBAAA;EACA,iBAAA;EACA,eAAA;EACA,cAAA;AADF;;AAIA;EACE,sCAAA;EACA,gBAAA;AADF;;AAIA;EACE,+BAAA;EACA,mBAAA;EACA,oBAAA;AADF;;AAIA;EACE,+BAAA;EACA,WAAA;EACA,kBAAA;EACA,eAAA;EACA,gBAAA;AADF;;AAIA;EACE,uBAAA;EACA,YAAA;EACA,oBAAA;EACA,eAAA;EACA,iBAAA;AADF;;AAIA;;EAEE,uBAAA;EACA,qBAAA;EACA,eAAA;AADF;;AAIA;EACE,qBAAA;AADF;;AAGA;EACE,eAAA;AAAF;;AAGA;EACE,iBAAA;AAAF;;AAGA;EACE,WAAA;AAAF;;AAGA;EACE,kCAAA;AAAF;;AAGA;EACE,kCAAA;AAAF;;AAGA;EACE,4BAAA;AAAF;;AAGA;EACE,8DAAA;AAAF","sourcesContent":[":root {\n  --default: #121213;\n  --text: #ffffff;\n  --gray1: #4a4a4c;\n  --gray2: #2a2a2c;\n  --brBlue1: #17aad8;\n  --brBlue2: #017cb0;\n  --brBlue3: #0b61a8;\n  --brOrange1: #fe9200;\n  /*ee610a*/\n  --brOrange2: #ee610a;\n  --brOrange3: #ea410b;\n}\n\n@font-face {\n  font-family: \"Blade Runner\";\n  src: url(../fonts/BLADRMF_.TTF);\n}\n\n@font-face {\n  font-family: \"Oxanium\";\n  font-style: normal;\n  font-weight: normal;\n  src: url(\"../fonts/Oxanium-VariableFont_wght.ttf\");\n}\n\nhtml,\nbody {\n  background-color: var(--default);\n  font-family: \"Oxanium\", cursive;\n  margin: 0;\n  padding: 0;\n  text-align: center;\n}\n\ndiv {\n  margin: 0;\n  padding: 0;\n}\n\n.supercontainer {\n  display: flex;\n  min-width: 320px;\n  max-width: 540px;\n  margin: 1cqw auto;\n  container-type: inline-size;\n}\n\n.pageContainer {\n  display: flex;\n  flex-direction: column;\n  flex-shrink: 0;\n  text-align: center;\n  /*margin: 1cqw auto;\n  min-width: 320px;\n  max-width: 540px;*/\n  width: 100%;\n  justify-content: space-between;\n  /*grid-template-columns: 1fr;*/\n  /*grid-template-rows: auto auto 1fr;*/\n  /*grid-auto-rows: auto;*/\n  container-type: inline-size;\n  height: 155cqw;\n}\n\n.header {\n  display: flex;\n  flex: 0 1 auto;\n  justify-content: center;\n  color: var(--brOrange2);\n  font-family: \"Blade Runner\";\n  font-size: 8cqw;\n  padding: 2cqw 0;\n  margin: 1cqw;\n  border-bottom: 0.5cqw solid var(--gray1);\n  height: 8cqw;\n  border-top: 0.5cqw solid var(--default);\n  pointer-events: none;\n  -webkit-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.message {\n  color: var(--brOrange2);\n  font-family: \"Oxanium\", cursive;\n  font-size: 6cqw;\n  padding: 2cqw 0;\n  margin: 1cqw;\n  height: 8cqw;\n  border-bottom: 0.5cqw solid var(--brOrange2);\n  border-top: 0.5cqw solid var(--brOrange2);\n  background-color: var(--default);\n}\n\n.gameContainer {\n  display: flex;\n  justify-content: center;\n  flex: 0 1 auto;\n  width: 100cqw;\n  margin: auto;\n  pointer-events: none;\n  -webkit-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.tileGrid {\n  display: grid;\n  width: 75cqw;\n  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;\n  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;\n  grid-gap: 1.5cqw;\n  margin: 0.5cqw 0;\n}\n\n.tile {\n  aspect-ratio: 1 / 1;\n  border: 0.5cqw solid var(--gray1);\n  box-sizing: border-box;\n  color: var(--text);\n  text-transform: uppercase;\n  display: grid;\n  place-items: center;\n  font-family: \"Oxanium\", cursive;\n  font-size: 7cqw;\n}\n\n.tileWaterMark {\n  font-family: \"Blade Runner\";\n  color: var(--gray2);\n}\n\n.keyboardContainer {\n  display: flex;\n  flex: 0 1 auto;\n  justify-content: center;\n  margin: auto;\n  margin-top: 2cqw;\n  width: 100cqw;\n}\n\n.keyboardGrid {\n  display: grid;\n  width: 98cqw;\n  grid-template-rows: 1fr 1fr 1fr;\n  grid-template-columns: 1fr;\n  grid-row-gap: 1.5cqw;\n}\n\n.keyboardRow1 {\n  display: grid;\n  width: 98cqw;\n  grid-template-rows: 1fr;\n  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;\n  grid-column-gap: 1.5cqw;\n}\n.keyboardRow2 {\n  display: grid;\n  width: 98cqw;\n  grid-template-rows: 1fr;\n  grid-template-columns: 0.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 0.5fr;\n  grid-column-gap: 1.5cqw;\n}\n.keyboardRow3 {\n  display: grid;\n  width: 98cqw;\n  grid-template-rows: 1fr;\n  grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1.5fr;\n  grid-column-gap: 1.5cqw;\n}\n\n.key,\n.keySpacer {\n  display: grid;\n  border: 0.25cqw solid var(--text);\n  box-sizing: border-box;\n  text-align: center;\n  font-family: \"Oxanium\", cursive;\n  font-size: 3.5cqw;\n  font-weight: bolder;\n  place-items: center;\n  padding: 0 0;\n  border-radius: 1.5cqw;\n  color: var(--text);\n  aspect-ratio: 1 / 1.2;\n  background-color: var(--default);\n  -webkit-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.keySpacer {\n  visibility: hidden;\n  aspect-ratio: 1 / 2.4;\n}\n\n#BACKSPACE,\n#ENTER {\n  aspect-ratio: 3 / 2.4;\n  font-size: 2.5cqw;\n}\n\n.tileClose {\n  color: var(--brOrange2);\n  border: 0.5cqw solid var(--brOrange2);\n}\n\n.tileHit {\n  color: var(--brBlue1);\n  border: 0.5cqw solid var(--brBlue1);\n}\n.tileMiss {\n  color: var(--gray1);\n  border: 0.5cqw solid var(--gray1);\n}\n\n.gameOver {\n  background-color: var(--brBlue1);\n  color: var(--default);\n  border: 0.25cqw solid var(--brBlue1);\n}\n\n.notWord {\n  animation-name: flashBackspace;\n  animation-duration: 1s;\n  animation-iteration-count: infinite;\n}\n\n.reset {\n  animation: 1s linear resetting;\n}\n\n@keyframes resetting {\n  0% {\n    transform: rotateX(0deg);\n  }\n  50% {\n    transform: rotateX(90deg);\n  }\n  100% {\n    transform: rotateX(0deg);\n  }\n}\n\n@keyframes flashBackspace {\n  0%,\n  100% {\n    background-color: var(--brOrange2);\n    color: var(--text);\n    border: 0.25cqw solid var(--text);\n  }\n  50% {\n    background-color: var(--default);\n    color: var(--text);\n    border: 0.25cqw solid var(--text);\n  }\n}\n\n.modalContainer {\n  display: none;\n  position: fixed;\n  z-index: 1;\n  padding-top: 15cqw;\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n  width: 100cqw;\n  overflow: auto;\n  background-color: rgba(18, 18, 19, 0.6);\n}\n\n.modalContent {\n  font-family: \"Oxanium\", cursive;\n  background-color: rgba(254, 146, 0, 0.3);\n  color: var(--brOrange1);\n  margin: auto;\n  padding: 1.5cqw;\n  padding-top: 0;\n  width: 80cqw;\n  max-width: 80cqw;\n  max-height: 90cqw;\n  font-size: 6cqw;\n  overflow: auto;\n}\n\n.modalContent hr {\n  border: 0.25cqw solid var(--brOrange1);\n  margin-top: 3cqw;\n}\n\n.modalTitle {\n  font-family: \"Oxanium\", cursive;\n  margin: 2cqw 0 0cqw;\n  padding: 2cqw 0 1cqw;\n}\n\n.modalContentItem {\n  font-family: \"Oxanium\", cursive;\n  margin: 0 0;\n  padding: 1cqw 2cqw;\n  font-size: 5cqw;\n  text-align: left;\n}\n\n.close {\n  color: var(--brOrange1);\n  float: right;\n  margin-right: 1.5cqw;\n  font-size: 6cqw;\n  font-weight: bold;\n}\n\n.close:hover,\n.close:focus {\n  color: var(--brOrange3);\n  text-decoration: none;\n  cursor: pointer;\n}\n\n.statTable {\n  margin: 0 auto 1.5cqw;\n}\n.statTable td {\n  padding: 0 4cqw;\n}\n\n.statNum {\n  text-align: right;\n}\n\n::-webkit-scrollbar {\n  width: 2cqw;\n}\n\n::-webkit-scrollbar-track {\n  background: rgba(254, 146, 0, 0.2);\n}\n\n::-webkit-scrollbar-thumb {\n  background: rgba(254, 146, 0, 0.4);\n}\n\n::-webkit-scrollbar-thumb:hover {\n  background: var(--brOrange1);\n}\n\n.modalContent {\n  scrollbar-color: rgba(254, 146, 0, 0.6) rgba(254, 146, 0, 0.1);\n}\n"],"sourceRoot":""}]);
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










let game, ui, campaign;
const jsConfetti = new js_confetti__WEBPACK_IMPORTED_MODULE_6__["default"]();

async function checkRow() {
  const guess = ui.board[ui.curRow].join("");
  ui.clickAudio.pause();
  if (
    !_words_js__WEBPACK_IMPORTED_MODULE_4__.WORDS.includes(guess.toUpperCase()) &&
    !_words_supplement_js__WEBPACK_IMPORTED_MODULE_5__.WORDS_SUPPLEMENT.includes(guess.toUpperCase())
  ) {
    ui.invalidAudio.play().catch((error) => {
      /*do nothing - it's just audio*/
    });
    ui.displayMessage(`${guess} is not a word`);
    BACKSPACE.classList.add("notWord");
    return;
  }
  game.submitGuess(guess);
  await ui.revealGuess(game.guessStatus());
  ui.updateKeyboard(game.letterStatus);
  if (game.secretWord === guess) {
    winRoutine();
    return;
  }
  if (ui.curRow >= 5) {
    loseRoutine();
    return;
  }

  ui.curRow++;
  ui.curCol = 0;
}

function winRoutine() {
  ui.curRow++;
  let gameDetails = {
    outcome: "won",
    attempts: ui.curRow,
    word: game.secretWord,
    score: game.wordBasePointValue() * 10 ** (6 - ui.curRow),
  };
  ui.busy = true;
  ui.successAudio.play().catch((error) => {
    /*do nothing - it's just audio*/
  });
  jsConfetti.addConfetti({
    confettiColors: [
      "#17aad8",
      "#017cb0",
      "#0b61a8",
      "#fe9200",
      "#ee610a",
      "#ea410b",
    ],
  });
  campaign.updateCampaign(gameDetails);
  setTimeout(() => {
    ui.showModal(
      "Success",
      [
        tablizeStats(gameDetails),
        "<i>What it means:</>",
        ...formatDefinition(game.wordDefinition),
      ],
      game.gameState
    );
    ui.busy = false;
  }, 1500);
}

function loseRoutine() {
  ui.curRow++;
  let gameDetails = {
    outcome: "lost",
    attempts: ui.curRow,
    word: game.secretWord,
    score:
      campaign.averageScore() > 0
        ? -1 * campaign.averageScore()
        : campaign.averageScore(),
  };
  campaign.updateCampaign(gameDetails);
  ui.failAudio.play().catch((error) => {
    /*do nothing - it's just audio*/
  });
  ui.showModal(
    "Failure",
    [
      tablizeStats(gameDetails),
      "<i>What it means:</>",
      ...formatDefinition(game.wordDefinition),
    ],
    game.gameState
  );
}

function formatDefinition(packedDefinition) {
  return packedDefinition.map((el) => {
    let htmlString = "";
    if (el.partOfSpeech) htmlString = `<i>${el.partOfSpeech}:</i>&nbsp;&nbsp;`;
    return `${htmlString}${el.definition}`;
  });
}

function tablizeStats(gameDetails) {
  let statStr = "<hr><table class='statTable'>";

  function statRow(statKey, statValue) {
    return `<tr><td>${statKey}</td><td class="statNum">${statValue}</td></tr>`;
  }

  if (gameDetails) {
    statStr = `${statStr}${statRow("Word", gameDetails.word)}`;
    statStr = `${statStr}${statRow("Attempts", gameDetails.attempts)}`;
    statStr = `${statStr}${statRow("Round Score", gameDetails.score)}`;
  }
  for (let el of campaign.campaignSummary()) {
    statStr = `${statStr}${statRow(el.label, el.value)}`;
  }
  return `${statStr}</table><hr>`;
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
  );
}

window.addEventListener("keydown", function (event) {
  if (ui.busy) return;
  if (event.key === "Enter" && modalContainer.style.display !== "none") {
    closeButton.click();
    return;
  }

  document.getElementById(event.key.toUpperCase()) &&
    document.getElementById(event.key.toUpperCase()).click();

  if (event.key === "Delete") document.getElementById("BACKSPACE").click();
});

pageContainer.addEventListener("touchstart", touchAndClickHandler);

pageContainer.addEventListener("click", touchAndClickHandler);

function touchAndClickHandler(event) {
  if (!(event.target.nodeName === "SPAN")) return;
  if (ui.busy) return;

  if (event.type === "touchstart") {
    event.preventDefault();
  }

  ui.clickAudio.currentTime = 0;
  ui.clickAudio.play().catch((error) => {
    /*do nothing - it's just audio*/
  });

  let key = event.target.id;
  if (game.gameState === "PLAYING") {
    if (key === "BACKSPACE") ui.deleteLetter();
    if (key === "ENTER" && ui.curCol > 4) checkRow();
    if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").includes(key))
      ui.appendLetter(key);
    return;
  }

  if (game.gameState !== "PLAYING" && key === "ENTER") newRound();
}

function newRound() {
  game = new _round_js__WEBPACK_IMPORTED_MODULE_2__.Round(_words_js__WEBPACK_IMPORTED_MODULE_4__.WORDS[Math.floor(Math.random() * _words_js__WEBPACK_IMPORTED_MODULE_4__.WORDS.length)]);
  console.log(game.secretWord);
  ui.reset();
}

function main() {
  // localStorage.clear()
  campaign = new _campaign_js__WEBPACK_IMPORTED_MODULE_1__.Campaign();
  ui = new _ui_js__WEBPACK_IMPORTED_MODULE_3__.UI(pageContainer);
  newRound();
  instructions();
}

window.onload = function () {
  main();
};

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1COzs7Ozs7Ozs7OztBQ3BlbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwbUtuQjtBQUM2RztBQUNqQjtBQUNPO0FBQ25HLDRDQUE0Qyx5SEFBd0M7QUFDcEYsNENBQTRDLDJKQUF5RDtBQUNyRyw4QkFBOEIsbUZBQTJCLENBQUMsNEZBQXFDO0FBQy9GLHlDQUF5QyxzRkFBK0I7QUFDeEUseUNBQXlDLHNGQUErQjtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLG1DQUFtQztBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxtQ0FBbUM7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0Isc0NBQXNDO0FBQ3RDLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUMsT0FBTyx3RkFBd0YsV0FBVyxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFVBQVUsV0FBVyxXQUFXLE1BQU0sS0FBSyxXQUFXLFdBQVcsS0FBSyxLQUFLLFdBQVcsV0FBVyxXQUFXLFdBQVcsS0FBSyxNQUFNLFdBQVcsV0FBVyxVQUFVLFVBQVUsV0FBVyxNQUFNLEtBQUssVUFBVSxVQUFVLE1BQU0sS0FBSyxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsTUFBTSxLQUFLLFVBQVUsV0FBVyxVQUFVLFdBQVcsTUFBTSxNQUFNLFVBQVUsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFVBQVUsTUFBTSxLQUFLLFVBQVUsVUFBVSxXQUFXLFdBQVcsV0FBVyxVQUFVLFVBQVUsVUFBVSxXQUFXLFVBQVUsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLE1BQU0sS0FBSyxXQUFXLFdBQVcsVUFBVSxVQUFVLFVBQVUsVUFBVSxXQUFXLFdBQVcsV0FBVyxNQUFNLEtBQUssVUFBVSxXQUFXLFVBQVUsVUFBVSxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsTUFBTSxLQUFLLFVBQVUsVUFBVSxXQUFXLFdBQVcsV0FBVyxXQUFXLE1BQU0sS0FBSyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsVUFBVSxXQUFXLFdBQVcsVUFBVSxNQUFNLEtBQUssV0FBVyxXQUFXLE1BQU0sS0FBSyxVQUFVLFVBQVUsV0FBVyxVQUFVLFdBQVcsVUFBVSxNQUFNLEtBQUssVUFBVSxVQUFVLFdBQVcsV0FBVyxXQUFXLE1BQU0sS0FBSyxVQUFVLFVBQVUsV0FBVyxXQUFXLFdBQVcsTUFBTSxLQUFLLFVBQVUsVUFBVSxXQUFXLFdBQVcsV0FBVyxNQUFNLEtBQUssVUFBVSxVQUFVLFdBQVcsV0FBVyxXQUFXLE1BQU0sTUFBTSxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsVUFBVSxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLE1BQU0sS0FBSyxXQUFXLFdBQVcsTUFBTSxNQUFNLFdBQVcsV0FBVyxNQUFNLEtBQUssV0FBVyxXQUFXLE1BQU0sS0FBSyxXQUFXLFdBQVcsTUFBTSxLQUFLLFdBQVcsV0FBVyxNQUFNLEtBQUssV0FBVyxXQUFXLFdBQVcsTUFBTSxLQUFLLFdBQVcsV0FBVyxXQUFXLE1BQU0sS0FBSyxXQUFXLE1BQU0sS0FBSyxLQUFLLFdBQVcsS0FBSyxLQUFLLFdBQVcsS0FBSyxLQUFLLFdBQVcsS0FBSyxLQUFLLEtBQUssS0FBSyxXQUFXLFdBQVcsV0FBVyxLQUFLLEtBQUssV0FBVyxXQUFXLFdBQVcsS0FBSyxLQUFLLEtBQUssVUFBVSxVQUFVLFVBQVUsV0FBVyxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxXQUFXLE1BQU0sS0FBSyxXQUFXLFdBQVcsV0FBVyxVQUFVLFVBQVUsVUFBVSxVQUFVLFdBQVcs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c0ZBQXNGLHFCQUFxQjtBQUMzRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YsaURBQWlELHFCQUFxQjtBQUN0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Ysc0RBQXNELHFCQUFxQjtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ3BGYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ3pCYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVELGNBQWM7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQixrQkFBa0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0MsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMERBQTBEOztBQUUxRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1HQUFtRzs7QUFFbkc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7O0FBRTFDO0FBQ0E7QUFD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QUFDN0QsaUJBQWlCLFFBQVEsRUFBRSwwQ0FBMEM7QUFDckUsaUJBQWlCLFFBQVEsRUFBRSwwQ0FBMEM7QUFDckU7QUFDQTtBQUNBLGlCQUFpQixRQUFRLEVBQUUsNEJBQTRCO0FBQ3ZEO0FBQ0EsWUFBWSxRQUFRO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLE1BQU07QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxDQUFDOztBQUVEOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLDRDQUFLLENBQUMsNENBQUssNEJBQTRCLDRDQUFLO0FBQ3pEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLGtEQUFRO0FBQ3pCLFdBQVcsc0NBQUU7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd29yZGFsLXdlYi8uL2NsaWVudC9qcy9jYW1wYWlnbi5qcyIsIndlYnBhY2s6Ly93b3JkYWwtd2ViLy4vY2xpZW50L2pzL3JvdW5kLmpzIiwid2VicGFjazovL3dvcmRhbC13ZWIvLi9jbGllbnQvanMvdWkuanMiLCJ3ZWJwYWNrOi8vd29yZGFsLXdlYi8uL2NsaWVudC9qcy93b3Jkcy1zdXBwbGVtZW50LmpzIiwid2VicGFjazovL3dvcmRhbC13ZWIvLi9jbGllbnQvanMvd29yZHMuanMiLCJ3ZWJwYWNrOi8vd29yZGFsLXdlYi8uL2NsaWVudC9zdHlsZS9tYWluLmNzcyIsIndlYnBhY2s6Ly93b3JkYWwtd2ViLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly93b3JkYWwtd2ViLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qcyIsIndlYnBhY2s6Ly93b3JkYWwtd2ViLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vd29yZGFsLXdlYi8uL25vZGVfbW9kdWxlcy9qcy1jb25mZXR0aS9kaXN0L2VzL2luZGV4LmpzIiwid2VicGFjazovL3dvcmRhbC13ZWIvLi9jbGllbnQvc3R5bGUvbWFpbi5jc3M/OGVmOSIsIndlYnBhY2s6Ly93b3JkYWwtd2ViLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL3dvcmRhbC13ZWIvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL3dvcmRhbC13ZWIvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vd29yZGFsLXdlYi8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly93b3JkYWwtd2ViLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vd29yZGFsLXdlYi8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL3dvcmRhbC13ZWIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd29yZGFsLXdlYi93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly93b3JkYWwtd2ViL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93b3JkYWwtd2ViL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd29yZGFsLXdlYi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3dvcmRhbC13ZWIvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vd29yZGFsLXdlYi93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly93b3JkYWwtd2ViL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly93b3JkYWwtd2ViLy4vY2xpZW50L2pzL2FwcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgQ2FtcGFpZ24ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmdhbWVzUGxheWVkID0gMFxuICAgIHRoaXMuZ2FtZXNXb24gPSAwXG4gICAgdGhpcy5oaWdoU2NvcmUgPSAwXG4gICAgdGhpcy5iZXN0U3RyZWFrID0gMFxuICAgIHRoaXMuY3VyU3RyZWFrID0gMFxuICAgIHRoaXMuZ2FtZURldGFpbHMgPSBbXVxuICAgIHRoaXMudmVyc2lvbiA9IDFcbiAgICB0aGlzLnJlc3RvcmVGcm9tTG9jYWxTdG9yYWdlKClcbiAgfVxuXG4gIHVwZGF0ZUNhbXBhaWduKGdhbWVEZXRhaWxzKSB7XG4gICAgdGhpcy5nYW1lRGV0YWlscy5wdXNoKGdhbWVEZXRhaWxzKVxuICAgIHRoaXMuZ2FtZXNQbGF5ZWQrK1xuXG4gICAgaWYgKGdhbWVEZXRhaWxzLm91dGNvbWUgPT09IFwid29uXCIpIHtcbiAgICAgIHRoaXMuZ2FtZXNXb24rK1xuICAgICAgdGhpcy5jdXJTdHJlYWsrK1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1clN0cmVhayA9IDBcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jdXJTdHJlYWsgPiB0aGlzLmJlc3RTdHJlYWspIHtcbiAgICAgIHRoaXMuYmVzdFN0cmVhayA9IHRoaXMuY3VyU3RyZWFrXG4gICAgfVxuXG4gICAgaWYgKGdhbWVEZXRhaWxzLnNjb3JlID4gdGhpcy5oaWdoU2NvcmUpIHtcbiAgICAgIHRoaXMuaGlnaFNjb3JlID0gZ2FtZURldGFpbHMuc2NvcmVcbiAgICB9XG4gICAgdGhpcy5zYXZlVG9Mb2NhbFN0b3JhZ2UoKVxuICB9XG5cbiAgYXZlcmFnZUF0dGVtcHRzKCkge1xuICAgIGlmICh0aGlzLmdhbWVzUGxheWVkID09PSAwKSByZXR1cm4gMFxuICAgIHJldHVybiBwYXJzZUZsb2F0KFxuICAgICAgKFxuICAgICAgICB0aGlzLmdhbWVEZXRhaWxzLnJlZHVjZSgoYWNjLCBjdikgPT4ge1xuICAgICAgICAgIHJldHVybiBhY2MgKyBjdi5hdHRlbXB0c1xuICAgICAgICB9LCAwKSAvIHRoaXMuZ2FtZXNQbGF5ZWRcbiAgICAgICkudG9GaXhlZCgxKVxuICAgIClcbiAgfVxuXG4gIHdpblBlcmNlbnRhZ2UoKSB7XG4gICAgaWYgKHRoaXMuZ2FtZXNQbGF5ZWQgPT09IDApIHJldHVybiAwXG4gICAgcmV0dXJuIE1hdGgucm91bmQoKDEwMCAqIHRoaXMuZ2FtZXNXb24pIC8gdGhpcy5nYW1lc1BsYXllZClcbiAgfVxuXG4gIHNsdWdnaW5nUGVyY2VudGFnZSgpIHtcbiAgICBpZiAodGhpcy5nYW1lc1BsYXllZCA9PT0gMCkgcmV0dXJuIDBcbiAgICByZXR1cm4gTWF0aC5yb3VuZChcbiAgICAgICgxMDAgKlxuICAgICAgICB0aGlzLmdhbWVEZXRhaWxzXG4gICAgICAgICAgLmZpbHRlcigoZWwpID0+IGVsLm91dGNvbWUgPT09IFwid29uXCIpXG4gICAgICAgICAgLnJlZHVjZSgoYWNjLCBjdikgPT4gYWNjICsgNyAtIGN2LmF0dGVtcHRzLCAwKSkgL1xuICAgICAgICB0aGlzLmdhbWVzUGxheWVkXG4gICAgKVxuICB9XG5cbiAgYXZlcmFnZVNjb3JlKCkge1xuICAgIGlmICh0aGlzLmdhbWVzUGxheWVkID09PSAwKSByZXR1cm4gMFxuICAgIHJldHVybiBNYXRoLnJvdW5kKFxuICAgICAgdGhpcy5nYW1lRGV0YWlscy5yZWR1Y2UoKGFjYywgY3YpID0+IGFjYyArIGN2LnNjb3JlLCAwKSAvIHRoaXMuZ2FtZXNQbGF5ZWRcbiAgICApXG4gIH1cblxuICBzYXZlVG9Mb2NhbFN0b3JhZ2UoKSB7XG4gICAgbGV0IGNhbXBhaWduQ29weSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMpXG4gICAgbG9jYWxTdG9yYWdlLmNsZWFyKClcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImNhbXBhaWduXCIsIEpTT04uc3RyaW5naWZ5KGNhbXBhaWduQ29weSkpXG4gIH1cblxuICByZXN0b3JlRnJvbUxvY2FsU3RvcmFnZSgpIHtcbiAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJjYW1wYWlnblwiKSkge1xuICAgICAgbGV0IGNhbXBhaWduQ29weSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJjYW1wYWlnblwiKSlcbiAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgY2FtcGFpZ25Db3B5KVxuICAgIH1cbiAgfVxuXG4gIGNhbXBhaWduU3VtbWFyeSgpIHtcbiAgICBsZXQgc3VtbWFyeSA9IFtdXG4gICAgc3VtbWFyeS5wdXNoKHsgbGFiZWw6IFwiQXZlcmFnZSBTY29yZVwiLCB2YWx1ZTogdGhpcy5hdmVyYWdlU2NvcmUoKSB9KVxuICAgIHN1bW1hcnkucHVzaCh7IGxhYmVsOiBcIkhpZ2ggU2NvcmVcIiwgdmFsdWU6IHRoaXMuaGlnaFNjb3JlIH0pXG4gICAgc3VtbWFyeS5wdXNoKHsgbGFiZWw6IFwiV2lubmluZyAlXCIsIHZhbHVlOiB0aGlzLndpblBlcmNlbnRhZ2UoKSB9KVxuICAgIHN1bW1hcnkucHVzaCh7IGxhYmVsOiBcIlNsdWdnaW5nICVcIiwgdmFsdWU6IHRoaXMuc2x1Z2dpbmdQZXJjZW50YWdlKCkgfSlcbiAgICBzdW1tYXJ5LnB1c2goeyBsYWJlbDogXCJCZXN0IFN0cmVha1wiLCB2YWx1ZTogdGhpcy5iZXN0U3RyZWFrIH0pXG4gICAgc3VtbWFyeS5wdXNoKHsgbGFiZWw6IFwiQ3VycmVudCBTdHJlYWtcIiwgdmFsdWU6IHRoaXMuY3VyU3RyZWFrIH0pXG4gICAgc3VtbWFyeS5wdXNoKHsgbGFiZWw6IFwiQXR0ZW1wdHMvUm5kXCIsIHZhbHVlOiB0aGlzLmF2ZXJhZ2VBdHRlbXB0cygpIH0pXG4gICAgc3VtbWFyeS5wdXNoKHsgbGFiZWw6IFwiUm91bmRzIFBsYXllZFwiLCB2YWx1ZTogdGhpcy5nYW1lc1BsYXllZCB9KVxuICAgIHJldHVybiBzdW1tYXJ5XG4gIH1cbn1cbiIsImNvbnN0IExFVFRFUl9WQUxVRVMgPSB7XG4gIGE6IDEsXG4gIGI6IDMsXG4gIGM6IDMsXG4gIGQ6IDIsXG4gIGU6IDEsXG4gIGY6IDQsXG4gIGc6IDIsXG4gIGg6IDQsXG4gIGk6IDEsXG4gIGo6IDgsXG4gIGs6IDUsXG4gIGw6IDEsXG4gIG06IDMsXG4gIG46IDEsXG4gIG86IDEsXG4gIHA6IDMsXG4gIHE6IDEwLFxuICByOiAxLFxuICBzOiAxLFxuICB0OiAxLFxuICB1OiAxLFxuICB2OiA0LFxuICB3OiA0LFxuICB4OiA4LFxuICB5OiA0LFxuICB6OiAxMCxcbn1cblxuZXhwb3J0IGNsYXNzIFJvdW5kIHtcbiAgY29uc3RydWN0b3Ioc2VjcmV0V29yZCA9IFwiZ3Vlc3NcIikge1xuICAgIHRoaXMuc2VjcmV0V29yZCA9IHNlY3JldFdvcmQudG9VcHBlckNhc2UoKVxuICAgIHRoaXMud29yZERlZmluaXRpb24gPSBbXVxuICAgIHRoaXMuZ3Vlc3NlcyA9IFtdXG4gICAgdGhpcy5sZXR0ZXJTdGF0dXMgPSB7fVxuICAgIHRoaXMuZ3Vlc3Nlc1JlbWFpbmluZyA9IDZcbiAgICB0aGlzLmdhbWVTdGF0ZSA9IFwiUExBWUlOR1wiIC8vUExBWUlORywgV09OLCBMT1NUXG4gICAgdGhpcy5yZXNldExldHRlclN0YXR1cygpXG4gICAgdGhpcy5nZXREZWZpbml0aW9uKClcbiAgfVxuXG4gIHN1Ym1pdEd1ZXNzKHdvcmQpIHtcbiAgICBpZiAodGhpcy5nYW1lU3RhdGUgPT09IFwiUExBWUlOR1wiKSB7XG4gICAgICB0aGlzLmd1ZXNzZXMucHVzaCh3b3JkLnRvVXBwZXJDYXNlKCkpXG4gICAgICB0aGlzLmd1ZXNzZXNSZW1haW5pbmctLVxuICAgICAgdGhpcy5zZXRMZXR0ZXJTdGF0dXMod29yZC50b1VwcGVyQ2FzZSgpKVxuICAgICAgdGhpcy5jYWxjR2FtZVN0YXRlKHdvcmQudG9VcHBlckNhc2UoKSlcbiAgICAgIHJldHVybiBbdGhpcy5ndWVzc1N0YXR1cygpLCB0aGlzLmxldHRlclN0YXR1c11cbiAgICB9XG4gIH1cblxuICBjYWxjR2FtZVN0YXRlKHdvcmQpIHtcbiAgICBpZiAodGhpcy5nYW1lU3RhdGUgPT09IFwiUExBWUlOR1wiKSB7XG4gICAgICBpZiAod29yZC50b1VwcGVyQ2FzZSgpID09PSB0aGlzLnNlY3JldFdvcmQpIHtcbiAgICAgICAgdGhpcy5nYW1lU3RhdGUgPSBcIldPTlwiXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZ3Vlc3Nlc1JlbWFpbmluZyA9PT0gMCkge1xuICAgICAgICB0aGlzLmdhbWVTdGF0ZSA9IFwiTE9TVFwiXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmdhbWVTdGF0ZSA9IFwiUExBWUlOR1wiXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmdhbWVTdGF0ZVxuICB9XG5cbiAgc2V0TGV0dGVyU3RhdHVzKHdvcmQpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdvcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh3b3JkW2ldID09PSB0aGlzLnNlY3JldFdvcmRbaV0pIHtcbiAgICAgICAgdGhpcy5sZXR0ZXJTdGF0dXNbdGhpcy5zZWNyZXRXb3JkW2ldXSA9IFwiR1wiXG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICB0aGlzLnNlY3JldFdvcmQuc3BsaXQoXCJcIikuaW5jbHVkZXMod29yZFtpXSkgJiZcbiAgICAgICAgdGhpcy5sZXR0ZXJTdGF0dXNbd29yZFtpXV0gIT09IFwiR1wiXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5sZXR0ZXJTdGF0dXNbd29yZFtpXV0gPSBcIllcIlxuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgIXRoaXMuc2VjcmV0V29yZC5zcGxpdChcIlwiKS5pbmNsdWRlcyh3b3JkW2ldKSAmJlxuICAgICAgICB0aGlzLmxldHRlclN0YXR1c1t3b3JkW2ldXSA9PT0gXCJXXCJcbiAgICAgICkge1xuICAgICAgICB0aGlzLmxldHRlclN0YXR1c1t3b3JkW2ldXSA9IFwiUlwiXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmxldHRlclN0YXR1c1xuICB9XG5cbiAgcmVzZXRMZXR0ZXJTdGF0dXMoKSB7XG4gICAgZm9yIChsZXQgbGV0dGVyIG9mIFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpcIi5zcGxpdChcIlwiKSkge1xuICAgICAgdGhpcy5sZXR0ZXJTdGF0dXNbbGV0dGVyXSA9IFwiV1wiXG4gICAgfVxuICAgIHJldHVybiB0aGlzLmxldHRlclN0YXR1c1xuICB9XG5cbiAgZ3Vlc3NTdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ3Vlc3Nlcy5tYXAoKGd1ZXNzKSA9PiB7XG4gICAgICBsZXQgZ3Vlc3NTdGF0QXJyID0gZ3Vlc3Muc3BsaXQoXCJcIikubWFwKChlbCkgPT4ge1xuICAgICAgICByZXR1cm4geyBsZXR0ZXI6IGVsLCBzdGF0dXM6IFwiUlwiIH1cbiAgICAgIH0pXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2VjcmV0V29yZC5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5zZWNyZXRXb3JkW2ldID09PSBndWVzc1tpXSkge1xuICAgICAgICAgIGd1ZXNzU3RhdEFycltpXS5zdGF0dXMgPSBcIkdcIlxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZ3Vlc3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgdGhpcy5zZWNyZXRXb3JkW2ldID09PSBndWVzc1tqXSAmJlxuICAgICAgICAgICAgICBndWVzc1N0YXRBcnJbal0uc3RhdHVzID09PSBcIlJcIlxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGd1ZXNzU3RhdEFycltqXS5zdGF0dXMgPSBcIllcIlxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGd1ZXNzU3RhdEFyclxuICAgIH0pXG4gIH1cblxuICBhc3luYyBnZXREZWZpbml0aW9uKCkge1xuICAgIGxldCBkZWZpbml0aW9uQXJyID0gW11cbiAgICB0cnkge1xuICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXG4gICAgICAgIGBodHRwczovL2FwaS5kaWN0aW9uYXJ5YXBpLmRldi9hcGkvdjIvZW50cmllcy9lbi8ke3RoaXMuc2VjcmV0V29yZC50b0xvd2VyQ2FzZSgpfWBcbiAgICAgIClcbiAgICAgIGlmIChyZXNwb25zZS5vaykge1xuICAgICAgICBsZXQganNvbiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxuICAgICAgICBkZWZpbml0aW9uQXJyID0gdGhpcy51bnBhY2tEZWZpbml0aW9uKGpzb24pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEZWZpbml0aW9uIEZldGNoIEZhaWxlZFwiKVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBkZWZpbml0aW9uQXJyID0gW1xuICAgICAgICB7XG4gICAgICAgICAgcGFydE9mU3BlZWNoOiBudWxsLFxuICAgICAgICAgIGRlZmluaXRpb246IFwiRGljdGlvbmFyeSBvciBkZWZpbml0aW9uIG5vdCBhdmFpbGFibGUgYXQgdGhpcyB0aW1lLlwiLFxuICAgICAgICB9LFxuICAgICAgXVxuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLndvcmREZWZpbml0aW9uID0gZGVmaW5pdGlvbkFyclxuICAgICAgcmV0dXJuIGRlZmluaXRpb25BcnJcbiAgICB9XG4gIH1cblxuICB1bnBhY2tEZWZpbml0aW9uKGpzb24pIHtcbiAgICBsZXQgZGVmaW5pdGlvbkFyciA9IFtdXG4gICAgZm9yIChsZXQgZW50cnkgb2YganNvbikge1xuICAgICAgZm9yIChsZXQgbWVhbmluZyBvZiBlbnRyeS5tZWFuaW5ncykge1xuICAgICAgICBmb3IgKGxldCBkZWZpbml0aW9uIG9mIG1lYW5pbmcuZGVmaW5pdGlvbnMpIHtcbiAgICAgICAgICBkZWZpbml0aW9uQXJyLnB1c2goe1xuICAgICAgICAgICAgcGFydE9mU3BlZWNoOiBtZWFuaW5nLnBhcnRPZlNwZWVjaCxcbiAgICAgICAgICAgIGRlZmluaXRpb246IGRlZmluaXRpb24uZGVmaW5pdGlvbixcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChkZWZpbml0aW9uQXJyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZGVmaW5pdGlvbkFyci5wdXNoKHtcbiAgICAgICAgcGFydE9mU3BlZWNoOiBudWxsLFxuICAgICAgICBkZWZpbml0aW9uOiBcIkRpY3Rpb25hcnkgb3IgZGVmaW5pdGlvbiBub3QgYXZhaWxhYmxlIGF0IHRoaXMgdGltZS5cIixcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiBkZWZpbml0aW9uQXJyXG4gIH1cblxuICB3b3JkQmFzZVBvaW50VmFsdWUoKSB7XG4gICAgbGV0IHdvcmRCYXNlU2NvcmUgPSB0aGlzLnNlY3JldFdvcmRcbiAgICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgICAuc3BsaXQoXCJcIilcbiAgICAgIC5yZWR1Y2UoKGFjYywgY3YpID0+IHtcbiAgICAgICAgcmV0dXJuIGFjYyArIExFVFRFUl9WQUxVRVNbY3ZdXG4gICAgICB9LCAwKVxuXG4gICAgcmV0dXJuIHdvcmRCYXNlU2NvcmVcbiAgfVxufVxuIiwiaW1wb3J0IGF1ZGlvRmlsZUNsaWNrIGZyb20gXCIuLi9hdWRpby9jbGljay5tcDNcIjtcbmltcG9ydCBhdWRpb0ZpbGVDb21wIGZyb20gXCIuLi9hdWRpby9jb21wLm1wM1wiO1xuaW1wb3J0IGF1ZGlvRmlsZVN1Y2Nlc3MgZnJvbSBcIi4uL2F1ZGlvL2ZpZ2h0Lm1wM1wiO1xuaW1wb3J0IGF1ZGlvRmlsZUZhaWwgZnJvbSBcIi4uL2F1ZGlvL3JlZ3JldC5tcDNcIjtcbmltcG9ydCBhdWRpb0ZpbGVJbnZhbGlkIGZyb20gXCIuLi9hdWRpby9pbnZhbGlkLm1wM1wiO1xuaW1wb3J0IGF1ZGlvRmlsZVJhdGNoZXQgZnJvbSBcIi4uL2F1ZGlvL3JhdGNoZXQubXAzXCI7XG5pbXBvcnQgXCIuLi9zdHlsZS9tYWluLmNzc1wiO1xuXG5leHBvcnQgY2xhc3MgVUkge1xuICBjb25zdHJ1Y3Rvcihjb250YWluZXIpIHtcbiAgICB0aGlzLmluaXRpYWxVaVNldHVwKGNvbnRhaW5lcik7XG4gICAgdGhpcy5hdWRpb1NldHVwKCk7XG4gICAgdGhpcy5jdXJSb3cgPSAwO1xuICAgIHRoaXMuY3VyQ29sID0gMDtcbiAgICB0aGlzLmJvYXJkID0gW1xuICAgICAgW1wiXCIsIFwiXCIsIFwiXCIsIFwiXCIsIFwiXCJdLFxuICAgICAgW1wiXCIsIFwiXCIsIFwiXCIsIFwiXCIsIFwiXCJdLFxuICAgICAgW1wiXCIsIFwiXCIsIFwiXCIsIFwiXCIsIFwiXCJdLFxuICAgICAgW1wiXCIsIFwiXCIsIFwiXCIsIFwiXCIsIFwiXCJdLFxuICAgICAgW1wiXCIsIFwiXCIsIFwiXCIsIFwiXCIsIFwiXCJdLFxuICAgICAgW1wiXCIsIFwiXCIsIFwiXCIsIFwiXCIsIFwiXCJdLFxuICAgIF07XG4gICAgdGhpcy5idXN5ID0gZmFsc2U7XG4gIH1cblxuICBpbml0aWFsVWlTZXR1cChjb250YWluZXIpIHtcbiAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGhlYWRlci5pZCA9IFwiaGVhZGVyXCI7XG4gICAgaGVhZGVyLmNsYXNzTmFtZSA9IFwiaGVhZGVyXCI7XG4gICAgaGVhZGVyLnRleHRDb250ZW50ID0gXCJXb3JkQnJ1bm5lclwiO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChoZWFkZXIpO1xuXG4gICAgY29uc3QgZ2FtZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgZ2FtZUNvbnRhaW5lci5pZCA9IFwiZ2FtZUNvbnRhaW5lclwiO1xuICAgIGdhbWVDb250YWluZXIuY2xhc3NOYW1lID0gXCJnYW1lQ29udGFpbmVyXCI7XG4gICAgdGhpcy5kcmF3VGlsZUdyaWQoZ2FtZUNvbnRhaW5lcik7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGdhbWVDb250YWluZXIpO1xuXG4gICAgY29uc3Qga2V5Ym9hcmRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGtleWJvYXJkQ29udGFpbmVyLmlkID0gXCJrZXlib2FyZENvbnRhaW5lclwiO1xuICAgIGtleWJvYXJkQ29udGFpbmVyLmNsYXNzTmFtZSA9IFwia2V5Ym9hcmRDb250YWluZXJcIjtcbiAgICB0aGlzLmRyYXdLZXlib2FyZChrZXlib2FyZENvbnRhaW5lcik7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGtleWJvYXJkQ29udGFpbmVyKTtcblxuICAgIGNvbnN0IG1vZGFsQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBtb2RhbENvbnRhaW5lci5pZCA9IFwibW9kYWxDb250YWluZXJcIjtcbiAgICBtb2RhbENvbnRhaW5lci5jbGFzc05hbWUgPSBcIm1vZGFsQ29udGFpbmVyXCI7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKG1vZGFsQ29udGFpbmVyKTtcbiAgfVxuXG4gIGF1ZGlvU2V0dXAoKSB7XG4gICAgdGhpcy5jbGlja0F1ZGlvID0gbmV3IEF1ZGlvKCk7XG4gICAgdGhpcy5jbGlja0F1ZGlvLnNyYyA9IGF1ZGlvRmlsZUNsaWNrO1xuICAgIHRoaXMuY29tcEF1ZGlvID0gbmV3IEF1ZGlvKCk7XG4gICAgdGhpcy5jb21wQXVkaW8uc3JjID0gYXVkaW9GaWxlQ29tcDtcbiAgICB0aGlzLnN1Y2Nlc3NBdWRpbyA9IG5ldyBBdWRpbygpO1xuICAgIHRoaXMuc3VjY2Vzc0F1ZGlvLnNyYyA9IGF1ZGlvRmlsZVN1Y2Nlc3M7XG4gICAgdGhpcy5mYWlsQXVkaW8gPSBuZXcgQXVkaW8oKTtcbiAgICB0aGlzLmZhaWxBdWRpby5zcmMgPSBhdWRpb0ZpbGVGYWlsO1xuICAgIHRoaXMuaW52YWxpZEF1ZGlvID0gbmV3IEF1ZGlvKCk7XG4gICAgdGhpcy5pbnZhbGlkQXVkaW8uc3JjID0gYXVkaW9GaWxlSW52YWxpZDtcbiAgICB0aGlzLnJhdGNoZXRBdWRpbyA9IG5ldyBBdWRpbygpO1xuICAgIHRoaXMucmF0Y2hldEF1ZGlvLnNyYyA9IGF1ZGlvRmlsZVJhdGNoZXQ7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmN1clJvdyA9IDA7XG4gICAgdGhpcy5jdXJDb2wgPSAwO1xuICAgIHRoaXMuYm9hcmQgPSBbXG4gICAgICBbXCJcIiwgXCJcIiwgXCJcIiwgXCJcIiwgXCJcIl0sXG4gICAgICBbXCJcIiwgXCJcIiwgXCJcIiwgXCJcIiwgXCJcIl0sXG4gICAgICBbXCJcIiwgXCJcIiwgXCJcIiwgXCJcIiwgXCJcIl0sXG4gICAgICBbXCJcIiwgXCJcIiwgXCJcIiwgXCJcIiwgXCJcIl0sXG4gICAgICBbXCJcIiwgXCJcIiwgXCJcIiwgXCJcIiwgXCJcIl0sXG4gICAgICBbXCJcIiwgXCJcIiwgXCJcIiwgXCJcIiwgXCJcIl0sXG4gICAgXTtcbiAgICB0aGlzLmJ1c3kgPSBmYWxzZTtcbiAgICBFTlRFUi5jbGFzc0xpc3QucmVtb3ZlKFwiZ2FtZU92ZXJcIik7XG4gICAgRU5URVIudGV4dENvbnRlbnQgPSBcIkVOVEVSXCI7XG4gICAgaGVhZGVyLmNsYXNzTmFtZSA9IFwiaGVhZGVyXCI7XG4gICAgaGVhZGVyLnRleHRDb250ZW50ID0gXCJ3b3JkQnJ1bm5lclwiO1xuICAgIHRoaXMuZmxpcEFuZFJlc2V0VGlsZXMoKTtcbiAgICBmb3IgKGxldCBsZXR0ZXIgb2YgXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWlwiLnNwbGl0KFwiXCIpKSB7XG4gICAgICBsZXQga2V5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobGV0dGVyKTtcbiAgICAgIGtleS5jbGFzc05hbWUgPSBcImtleVwiO1xuICAgIH1cbiAgfVxuXG4gIGl0ZXJhdGVUaWxlcyhjYWxsYmFjaykge1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDY7IHJvdysrKSB7XG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCA1OyBjb2wrKykge1xuICAgICAgICBjYWxsYmFjayhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgdGlsZS0ke3Jvd30tJHtjb2x9YCkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZsaXBBbmRSZXNldFRpbGVzKCkge1xuICAgIHRoaXMuY2xpY2tBdWRpby5wYXVzZSgpO1xuICAgIHRoaXMucmF0Y2hldEF1ZGlvLnBsYXkoKS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIC8qZG8gbm90aGluZyAtIGl0J3MganVzdCBhdWRpbyovXG4gICAgfSk7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuaXRlcmF0ZVRpbGVzKCh0aWxlKSA9PiB7XG4gICAgICAgIHRpbGUuY2xhc3NMaXN0LnJlbW92ZShcInRpbGVIaXRcIiwgXCJ0aWxlQ2xvc2VcIiwgXCJ0aWxlTWlzc1wiKTtcbiAgICAgICAgdGlsZS5pbm5lckhUTUwgPSAnPHNwYW4gY2xhc3M9XCJ0aWxlV2F0ZXJNYXJrXCI+Qjwvc3Bhbj4nO1xuICAgICAgfSk7XG4gICAgfSwgNTAwKTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5pdGVyYXRlVGlsZXMoKHRpbGUpID0+IHtcbiAgICAgICAgdGlsZS5jbGFzc0xpc3QucmVtb3ZlKFwicmVzZXRcIik7XG4gICAgICB9KTtcbiAgICB9LCAxMDAwKTtcblxuICAgIHRoaXMuaXRlcmF0ZVRpbGVzKCh0aWxlKSA9PiB7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJyZXNldFwiKTtcbiAgICB9KTtcbiAgfVxuXG4gIGRyYXdUaWxlKGNvbnRhaW5lciwgcm93LCBjb2wsIHZhbHVlID0gXCJcIikge1xuICAgIGNvbnN0IHRpbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHRpbGUuaWQgPSBgdGlsZS0ke3Jvd30tJHtjb2x9YDtcbiAgICB0aWxlLmNsYXNzTmFtZSA9IFwidGlsZVwiO1xuICAgIHRpbGUudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGlsZSk7XG4gICAgLy8gcmV0dXJuIHRpbGVcbiAgfVxuXG4gIGRyYXdUaWxlR3JpZChjb250YWluZXIsIHJvd3MgPSA2LCBjb2xzID0gNSkge1xuICAgIGNvbnN0IHRpbGVHcmlkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICB0aWxlR3JpZC5jbGFzc05hbWUgPSBcInRpbGVHcmlkXCI7XG5cbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCByb3dzOyByb3crKykge1xuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgY29sczsgY29sKyspIHtcbiAgICAgICAgdGhpcy5kcmF3VGlsZSh0aWxlR3JpZCwgcm93LCBjb2wsIFwiXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGlsZUdyaWQpO1xuICB9XG5cbiAgZHJhd0tleShrZXkpIHtcbiAgICBjb25zdCBrZXlCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICBrZXlCdXR0b24uaWQgPSBrZXkgPT09IFwi4oyrXCIgPyBcIkJBQ0tTUEFDRVwiIDoga2V5ID09PSBcIkVOVEVSXCIgPyBcIkVOVEVSXCIgOiBrZXk7XG4gICAga2V5QnV0dG9uLnJvbGUgPSBcImJ1dHRvblwiO1xuICAgIGtleUJ1dHRvbi5jbGFzc05hbWUgPSBrZXkgPT09IFwiIFwiID8gXCJrZXlTcGFjZXJcIiA6IFwia2V5XCI7XG4gICAga2V5QnV0dG9uLnRleHRDb250ZW50ID0ga2V5O1xuICAgIHJldHVybiBrZXlCdXR0b247XG4gIH1cblxuICBkcmF3S2V5Ym9hcmRSb3coY29udGFpbmVyLCByb3csIGtleXMpIHtcbiAgICBjb25zdCBrZXlib2FyZFJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAga2V5Ym9hcmRSb3cuY2xhc3NOYW1lID0gXCJrZXlib2FyZFJvd0NvbnRhaW5lclwiO1xuXG4gICAgY29uc3Qga2V5Ym9hcmRSb3dHcmlkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBrZXlib2FyZFJvd0dyaWQuaWQgPSBga2V5Ym9hcmRSb3cke3Jvd31gO1xuICAgIC8vRm9sbG93aW5nIDMgcm93cyBhZGRlZCB0byBwcmV2ZW50IHdlYnBhY2sgUHVyZ2VDU1MgZnJvbSByZW1vdmluZyB0aGUgY2xhc3NlcyBmcm9tIENTUyxcbiAgICAvL2FzIGl0IGlzIG5vdCBzbWFydCBlbm91Z2ggdG8gaW50ZXJwcmV0IHRoZSB0ZW1wbGF0ZSBsaXRlcmFsIHRoYXQgZm9sbG93cy5cbiAgICBrZXlib2FyZFJvd0dyaWQuY2xhc3NOYW1lID0gYGtleWJvYXJkUm93MWA7XG4gICAga2V5Ym9hcmRSb3dHcmlkLmNsYXNzTmFtZSA9IGBrZXlib2FyZFJvdzJgO1xuICAgIGtleWJvYXJkUm93R3JpZC5jbGFzc05hbWUgPSBga2V5Ym9hcmRSb3czYDtcbiAgICBrZXlib2FyZFJvd0dyaWQuY2xhc3NOYW1lID0gYGtleWJvYXJkUm93JHtyb3d9YDtcblxuICAgIGZvciAobGV0IGtleSBvZiBrZXlzKSB7XG4gICAgICBjb25zdCBrZXlCdXR0b24gPSB0aGlzLmRyYXdLZXkoa2V5KTtcbiAgICAgIGtleWJvYXJkUm93R3JpZC5hcHBlbmQoa2V5QnV0dG9uKTtcbiAgICB9XG5cbiAgICBrZXlib2FyZFJvdy5hcHBlbmQoa2V5Ym9hcmRSb3dHcmlkKTtcbiAgICBjb250YWluZXIuYXBwZW5kKGtleWJvYXJkUm93KTtcbiAgfVxuXG4gIGRyYXdLZXlib2FyZChjb250YWluZXIpIHtcbiAgICBjb25zdCBrZXlzID0gW1xuICAgICAgW1wiUVwiLCBcIldcIiwgXCJFXCIsIFwiUlwiLCBcIlRcIiwgXCJZXCIsIFwiVVwiLCBcIklcIiwgXCJPXCIsIFwiUFwiXSxcbiAgICAgIFtcIiBcIiwgXCJBXCIsIFwiU1wiLCBcIkRcIiwgXCJGXCIsIFwiR1wiLCBcIkhcIiwgXCJKXCIsIFwiS1wiLCBcIkxcIiwgXCIgXCJdLFxuICAgICAgW1wiRU5URVJcIiwgXCJaXCIsIFwiWFwiLCBcIkNcIiwgXCJWXCIsIFwiQlwiLCBcIk5cIiwgXCJNXCIsIFwi4oyrXCJdLFxuICAgIF07XG4gICAgY29uc3Qga2V5Ym9hcmRHcmlkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBrZXlib2FyZEdyaWQuY2xhc3NOYW1lID0gXCJrZXlib2FyZEdyaWRcIjtcbiAgICBrZXlib2FyZEdyaWQuaWQgPSBcImtleWJvYXJkR3JpZFwiO1xuXG4gICAgY29udGFpbmVyLmFwcGVuZChrZXlib2FyZEdyaWQpO1xuXG4gICAgdGhpcy5kcmF3S2V5Ym9hcmRSb3coa2V5Ym9hcmRHcmlkLCAxLCBrZXlzWzBdKTtcbiAgICB0aGlzLmRyYXdLZXlib2FyZFJvdyhrZXlib2FyZEdyaWQsIDIsIGtleXNbMV0pO1xuICAgIHRoaXMuZHJhd0tleWJvYXJkUm93KGtleWJvYXJkR3JpZCwgMywga2V5c1syXSk7XG4gIH1cblxuICBhcHBlbmRMZXR0ZXIobGV0dGVyKSB7XG4gICAgaWYgKHRoaXMuY3VyQ29sIDwgNSAmJiB0aGlzLmN1clJvdyA8IDYpIHtcbiAgICAgIGNvbnN0IHRpbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgYHRpbGUtJHt0aGlzLmN1clJvd30tJHt0aGlzLmN1ckNvbH1gXG4gICAgICApO1xuICAgICAgdGlsZS50ZXh0Q29udGVudCA9IGxldHRlcjtcbiAgICAgIHRoaXMuYm9hcmRbdGhpcy5jdXJSb3ddW3RoaXMuY3VyQ29sXSA9IGxldHRlcjtcbiAgICAgIHRoaXMuY3VyQ29sKys7XG4gICAgfVxuICB9XG5cbiAgZGVsZXRlTGV0dGVyKCkge1xuICAgIGlmICh0aGlzLmN1ckNvbCA+IDApIHtcbiAgICAgIHRoaXMuY3VyQ29sLS07XG4gICAgICBjb25zdCB0aWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgIGB0aWxlLSR7dGhpcy5jdXJSb3d9LSR7dGhpcy5jdXJDb2x9YFxuICAgICAgKTtcbiAgICAgIHRpbGUuaW5uZXJIVE1MID0gJzxzcGFuIGNsYXNzPVwidGlsZVdhdGVyTWFya1wiPkI8L3NwYW4+JztcbiAgICAgIHRoaXMuYm9hcmRbdGhpcy5jdXJSb3ddW3RoaXMuY3VyQ29sXSA9IFwiXCI7XG4gICAgICBCQUNLU1BBQ0UuY2xhc3NMaXN0LnJlbW92ZShcIm5vdFdvcmRcIik7XG4gICAgfVxuICB9XG5cbiAgZGlzcGxheU1lc3NhZ2UobWVzc2FnZSwgdGltZSA9IDM1MDApIHtcbiAgICBoZWFkZXIuY2xhc3NOYW1lID0gXCJtZXNzYWdlXCI7XG4gICAgaGVhZGVyLnRleHRDb250ZW50ID0gbWVzc2FnZTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGhlYWRlci5jbGFzc05hbWUgPSBcImhlYWRlclwiO1xuICAgICAgaGVhZGVyLnRleHRDb250ZW50ID0gXCJ3b3JkQnJ1bm5lclwiO1xuICAgIH0sIHRpbWUpO1xuICB9XG5cbiAgdXBkYXRlS2V5Ym9hcmQobGV0dGVyU3RhdHVzKSB7XG4gICAgZm9yIChsZXQgW2xldHRlciwgc3RhdHVzXSBvZiBPYmplY3QuZW50cmllcyhsZXR0ZXJTdGF0dXMpKSB7XG4gICAgICBsZXQga2V5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobGV0dGVyKTtcbiAgICAgIGtleS5jbGFzc0xpc3QuYWRkKFxuICAgICAgICBzdGF0dXMgPT09IFwiR1wiXG4gICAgICAgICAgPyBcInRpbGVIaXRcIlxuICAgICAgICAgIDogc3RhdHVzID09PSBcIllcIlxuICAgICAgICAgID8gXCJ0aWxlQ2xvc2VcIlxuICAgICAgICAgIDogc3RhdHVzID09PSBcIlJcIlxuICAgICAgICAgID8gXCJ0aWxlTWlzc1wiXG4gICAgICAgICAgOiBcImtleVwiXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHJldmVhbEd1ZXNzKGd1ZXNzU3RhdHVzKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuYnVzeSA9IHRydWU7XG4gICAgICBsZXQgZ0FyciA9IGd1ZXNzU3RhdHVzO1xuICAgICAgdGhpcy5jb21wQXVkaW8ucGxheSgpLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAvKmRvIG5vdGhpbmcgLSBpdCdzIGp1c3QgYXVkaW8qL1xuICAgICAgfSk7XG4gICAgICBsZXQgd29yZCA9IGdBcnJbdGhpcy5jdXJSb3ddO1xuICAgICAgbGV0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4gdGhpcy5zY3JhbWJsZUVmZmVjdCgpLCAzMCk7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCk7XG4gICAgICB9KTtcbiAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgdGhpcy5jb2xvclRpbGVzKHdvcmQpO1xuICAgICAgdGhpcy5idXN5ID0gZmFsc2U7XG4gICAgICByZXNvbHZlKCk7XG4gICAgfSk7XG4gIH1cblxuICBzY3JhbWJsZUVmZmVjdCgpIHtcbiAgICBjb25zdCBsZXR0ZXJzID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWlwiO1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IDU7IGNvbCsrKSB7XG4gICAgICBsZXQgdGlsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGB0aWxlLSR7dGhpcy5jdXJSb3d9LSR7Y29sfWApO1xuICAgICAgdGlsZS50ZXh0Q29udGVudCA9IGxldHRlcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjYpXTtcbiAgICB9XG4gIH1cblxuICBjb2xvclRpbGVzKHdvcmQpIHtcbiAgICBmb3IgKGxldCBbaWR4LCBsZXR0ZXJdIG9mIHdvcmQuZW50cmllcygpKSB7XG4gICAgICBsZXQgdGlsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGB0aWxlLSR7dGhpcy5jdXJSb3d9LSR7aWR4fWApO1xuICAgICAgdGlsZS50ZXh0Q29udGVudCA9IHdvcmRbaWR4XVtcImxldHRlclwiXTtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LmFkZChcbiAgICAgICAgbGV0dGVyLnN0YXR1cyA9PT0gXCJHXCJcbiAgICAgICAgICA/IFwidGlsZUhpdFwiXG4gICAgICAgICAgOiBsZXR0ZXIuc3RhdHVzID09PSBcIllcIlxuICAgICAgICAgID8gXCJ0aWxlQ2xvc2VcIlxuICAgICAgICAgIDogXCJ0aWxlTWlzc1wiXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHNob3dNb2RhbCh0aXRsZSA9IFwiVGl0bGVcIiwgY29udGVudCA9IFtcImxvcmVtIGlwc3VtXCJdLCBnYW1lU3RhdGUpIHtcbiAgICBjb25zdCBtb2RhbENsb3NlSGFuZGxlciA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LnR5cGUgPT09IFwidG91Y2hzdGFydFwiKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgICBtb2RhbENvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICB0aGlzLnN1Y2Nlc3NBdWRpby5wYXVzZSgpO1xuICAgICAgdGhpcy5zdWNjZXNzQXVkaW8uY3VycmVudFRpbWUgPSAwO1xuICAgICAgdGhpcy5mYWlsQXVkaW8ucGF1c2UoKTtcbiAgICAgIHRoaXMuZmFpbEF1ZGlvLmN1cnJlbnRUaW1lID0gMDtcbiAgICAgIGlmIChnYW1lU3RhdGUgIT09IFwiUExBWUlOR1wiKSB7XG4gICAgICAgIEVOVEVSLmNsYXNzTGlzdC5hZGQoXCJnYW1lT3ZlclwiKTtcbiAgICAgICAgRU5URVIudGV4dENvbnRlbnQgPSBcIlJFU0VUXCI7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxldCBtb2RhbENvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIG1vZGFsQ29udGVudC5pZCA9IFwibW9kYWxDb250ZW50XCI7XG4gICAgbW9kYWxDb250ZW50LmNsYXNzTmFtZSA9IFwibW9kYWxDb250ZW50XCI7XG5cbiAgICBsZXQgY2xvc2VCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICBjbG9zZUJ1dHRvbi5pZCA9IFwiY2xvc2VCdXR0b25cIjtcbiAgICBjbG9zZUJ1dHRvbi5jbGFzc05hbWUgPSBcImNsb3NlXCI7XG4gICAgY2xvc2VCdXR0b24udGV4dENvbnRlbnQgPSBgeGA7XG4gICAgY2xvc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG1vZGFsQ2xvc2VIYW5kbGVyKTtcbiAgICBjbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBtb2RhbENsb3NlSGFuZGxlcik7XG4gICAgbW9kYWxDb250ZW50LmFwcGVuZENoaWxkKGNsb3NlQnV0dG9uKTtcblxuICAgIGxldCBtb2RhbFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImg0XCIpO1xuICAgIG1vZGFsVGl0bGUuY2xhc3NOYW1lID0gXCJtb2RhbFRpdGxlXCI7XG4gICAgbW9kYWxUaXRsZS50ZXh0Q29udGVudCA9IHRpdGxlO1xuICAgIG1vZGFsQ29udGVudC5hcHBlbmRDaGlsZChtb2RhbFRpdGxlKTtcblxuICAgIGZvciAobGV0IGl0ZW0gb2YgY29udGVudCkge1xuICAgICAgbGV0IG1vZGFsQ29udGVudEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgIG1vZGFsQ29udGVudEl0ZW0uY2xhc3NOYW1lID0gXCJtb2RhbENvbnRlbnRJdGVtXCI7XG4gICAgICBtb2RhbENvbnRlbnRJdGVtLmlubmVySFRNTCA9IGl0ZW07XG4gICAgICBtb2RhbENvbnRlbnQuYXBwZW5kQ2hpbGQobW9kYWxDb250ZW50SXRlbSk7XG4gICAgfVxuXG4gICAgbW9kYWxDb250YWluZXIucmVwbGFjZUNoaWxkcmVuKCk7XG4gICAgbW9kYWxDb250YWluZXIuYXBwZW5kQ2hpbGQobW9kYWxDb250ZW50KTtcbiAgICBtb2RhbENvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICB9XG59XG4iLCJjb25zdCBXT1JEU19TVVBQTEVNRU5UID0gW1xuICBcIkFCQUNJXCIsXG4gIFwiQUJFTkRcIixcbiAgXCJBQ0hPT1wiLFxuICBcIkFDTkVEXCIsXG4gIFwiQUdBUlNcIixcbiAgXCJBR09ORVwiLFxuICBcIkFIT0xEXCIsXG4gIFwiQUlERVJcIixcbiAgXCJBTEdJTlwiLFxuICBcIkFMVEhPXCIsXG4gIFwiQU1NT1NcIixcbiAgXCJBTVVDS1wiLFxuICBcIkFNWUxTXCIsXG4gIFwiQU5ERURcIixcbiAgXCJBTklMRVwiLFxuICBcIkFOTlVNXCIsXG4gIFwiQVBFUlNcIixcbiAgXCJBUE9SVFwiLFxuICBcIkFQU09TXCIsXG4gIFwiQVFVQUVcIixcbiAgXCJBUVVBU1wiLFxuICBcIkFSRUFMXCIsXG4gIFwiQVJJVFlcIixcbiAgXCJBU0tFUlwiLFxuICBcIkFTU0VEXCIsXG4gIFwiQVNUUk9cIixcbiAgXCJBWExFRFwiLFxuICBcIkFZSU5TXCIsXG4gIFwiQkFIVFNcIixcbiAgXCJCQUxEU1wiLFxuICBcIkJBUklDXCIsXG4gIFwiQkFSS1lcIixcbiAgXCJCQVJNU1wiLFxuICBcIkJBWkFSXCIsXG4gIFwiQkVCVUdcIixcbiAgXCJCRUxMSVwiLFxuICBcIkJFU09UXCIsXG4gIFwiQkhPWVNcIixcbiAgXCJCSURFUlwiLFxuICBcIkJJR0dZXCIsXG4gIFwiQklMRVNcIixcbiAgXCJCSUxHWVwiLFxuICBcIkJJVFNZXCIsXG4gIFwiQkxBU0hcIixcbiAgXCJCT09LWVwiLFxuICBcIkJPU1NBXCIsXG4gIFwiQlJBTlNcIixcbiAgXCJCUkFWQVwiLFxuICBcIkJSRU5UXCIsXG4gIFwiQlJJRVNcIixcbiAgXCJCUlVOR1wiLFxuICBcIkJSVVNLXCIsXG4gIFwiQlVGRkFcIixcbiAgXCJCVVJSWVwiLFxuICBcIkNBR0VSXCIsXG4gIFwiQ0FORVJcIixcbiAgXCJDQVJORVwiLFxuICBcIkNBUk9OXCIsXG4gIFwiQ0FSUFlcIixcbiAgXCJDQVNVU1wiLFxuICBcIkNFREVSXCIsXG4gIFwiQ0hJRkZcIixcbiAgXCJDSE9PU1wiLFxuICBcIkNPT0tZXCIsXG4gIFwiQ09RVUlcIixcbiAgXCJDT1JEWVwiLFxuICBcIkNPUkVSXCIsXG4gIFwiQ1JJTktcIixcbiAgXCJDVUJFUlwiLFxuICBcIkNVSU5HXCIsXG4gIFwiQ1VQSURcIixcbiAgXCJDVVJEWVwiLFxuICBcIkNVUkVSXCIsXG4gIFwiQ1VSSUFcIixcbiAgXCJDVVNQWVwiLFxuICBcIkRBUkVSXCIsXG4gIFwiREFTSFlcIixcbiAgXCJERUFEU1wiLFxuICBcIkRFQVJZXCIsXG4gIFwiREVGT0dcIixcbiAgXCJERUZVTlwiLFxuICBcIkRFR1VNXCIsXG4gIFwiREVJQ0VcIixcbiAgXCJERUlTVFwiLFxuICBcIkRFUVVFXCIsXG4gIFwiREVXRVlcIixcbiAgXCJESUNFUlwiLFxuICBcIkRJQ1VUXCIsXG4gIFwiRElET1RcIixcbiAgXCJESUVNU1wiLFxuICBcIkRJRVNUXCIsXG4gIFwiRElFVEhcIixcbiAgXCJESVJUU1wiLFxuICBcIkRJWElUXCIsXG4gIFwiRE9QRVJcIixcbiAgXCJET1NFRFwiLFxuICBcIkRPU0VSXCIsXG4gIFwiRE9TRVNcIixcbiAgXCJET1RFUlwiLFxuICBcIkRPVkVZXCIsXG4gIFwiRE9YSUVcIixcbiAgXCJEUkFCU1wiLFxuICBcIkRSSUJTXCIsXG4gIFwiRFVERFlcIixcbiAgXCJEVU5HWVwiLFxuICBcIkRVTktTXCIsXG4gIFwiRUFSRURcIixcbiAgXCJFQVNUU1wiLFxuICBcIkVDSE9TXCIsXG4gIFwiRURHRVJcIixcbiAgXCJFTEFOU1wiLFxuICBcIkVOREVSXCIsXG4gIFwiRVBTT01cIixcbiAgXCJFVkVSWVwiLFxuICBcIkVZRVJTXCIsXG4gIFwiRkFDSUVcIixcbiAgXCJGQUNUT1wiLFxuICBcIkZBSVJFXCIsXG4gIFwiRkFNRVNcIixcbiAgXCJGQU5JTlwiLFxuICBcIkZBVExZXCIsXG4gIFwiRkFXTllcIixcbiAgXCJGQVhFUlwiLFxuICBcIkZFSVNUXCIsXG4gIFwiRkVOTllcIixcbiAgXCJGRVJOWVwiLFxuICBcIkZFVUFSXCIsXG4gIFwiRkVXRVJcIixcbiAgXCJGSUxBUlwiLFxuICBcIkZJTEVSXCIsXG4gIFwiRklOSUZcIixcbiAgXCJGSVJFUlwiLFxuICBcIkZJU1RZXCIsXG4gIFwiRklUTFlcIixcbiAgXCJGSVhJVFwiLFxuICBcIkZMQUJTXCIsXG4gIFwiRkxBS1NcIixcbiAgXCJGTEFQU1wiLFxuICBcIkZPTElDXCIsXG4gIFwiRk9SRVNcIixcbiAgXCJGT1JLWVwiLFxuICBcIkZPUk1BXCIsXG4gIFwiRlVNRVJcIixcbiAgXCJHQU1JQ1wiLFxuICBcIkdBUFBZXCIsXG4gIFwiR0FSREVcIixcbiAgXCJHQVlMWVwiLFxuICBcIkdBWkVSXCIsXG4gIFwiR0hPVElcIixcbiAgXCJHSUJFUlwiLFxuICBcIkdJR0FTXCIsXG4gIFwiR0lNRUxcIixcbiAgXCJHSU1QWVwiLFxuICBcIkdJTk5ZXCIsXG4gIFwiR0xBUllcIixcbiAgXCJHTFVFUlwiLFxuICBcIkdPT05ZXCIsXG4gIFwiR09PUFlcIixcbiAgXCJHT1JHRVwiLFxuICBcIkdSQVBZXCIsXG4gIFwiR1JBVEFcIixcbiAgXCJHVU5LU1wiLFxuICBcIkdVVFRBXCIsXG4gIFwiR1dJTkVcIixcbiAgXCJHWVZFRFwiLFxuICBcIkhBUEFYXCIsXG4gIFwiSEFSVU1cIixcbiAgXCJIQVVURVwiLFxuICBcIkhBV0VEXCIsXG4gIFwiSEFZRURcIixcbiAgXCJIQVlFUlwiLFxuICBcIkhBWUVZXCIsXG4gIFwiSEVFUkRcIixcbiAgXCJIRUxMU1wiLFxuICBcIkhFTVBTXCIsXG4gIFwiSEVNUFlcIixcbiAgXCJIRVJFTVwiLFxuICBcIkhFUk9TXCIsXG4gIFwiSEVYRVJcIixcbiAgXCJISURFUlwiLFxuICBcIkhJUkVSXCIsXG4gIFwiSElWRVJcIixcbiAgXCJIT0FSU1wiLFxuICBcIkhPREFEXCIsXG4gIFwiSE9FUlNcIixcbiAgXCJIT0xFUlwiLFxuICBcIkhPTEVZXCIsXG4gIFwiSE9MT05cIixcbiAgXCJIT01NRVwiLFxuICBcIkhPTkVSXCIsXG4gIFwiSE9QRVJcIixcbiAgXCJIT1BQWVwiLFxuICBcIkhVTEtZXCIsXG4gIFwiSFVSTFlcIixcbiAgXCJJQ0VSU1wiLFxuICBcIklDSUxZXCIsXG4gIFwiSU1NSVhcIixcbiAgXCJJTktFUlwiLFxuICBcIklOT0RFXCIsXG4gIFwiSU9ESUNcIixcbiAgXCJKQUtFU1wiLFxuICBcIkpJQkVSXCIsXG4gIFwiSk9XTFlcIixcbiAgXCJKVURPU1wiLFxuICBcIkpVU1RFXCIsXG4gIFwiS0FJQUtcIixcbiAgXCJLQUxFU1wiLFxuICBcIktFQk9CXCIsXG4gIFwiS0VMTFlcIixcbiAgXCJLRUxQWVwiLFxuICBcIktFWUVSXCIsXG4gIFwiS0lMVFlcIixcbiAgXCJLSVRFRFwiLFxuICBcIktJVEVTXCIsXG4gIFwiS0xVTktcIixcbiAgXCJMQUNFUlwiLFxuICBcIkxBQ0VZXCIsXG4gIFwiTEFQSU5cIixcbiAgXCJMQVJEWVwiLFxuICBcIkxBVFVTXCIsXG4gIFwiTEFVREVcIixcbiAgXCJMQVdOWVwiLFxuICBcIkxBV1pZXCIsXG4gIFwiTEFYTFlcIixcbiAgXCJMSUVSU1wiLFxuICBcIkxJRVNUXCIsXG4gIFwiTElFVEhcIixcbiAgXCJMSUdORVwiLFxuICBcIkxJS0VSXCIsXG4gIFwiTElMVFlcIixcbiAgXCJMSU1CWVwiLFxuICBcIkxJTlRTXCIsXG4gIFwiTElOVFlcIixcbiAgXCJMSVJBU1wiLFxuICBcIkxJVEVTXCIsXG4gIFwiTElWRVNcIixcbiAgXCJMSVZSRVwiLFxuICBcIkxPQU1TXCIsXG4gIFwiTE9CRURcIixcbiAgXCJMT0dHWVwiLFxuICBcIkxPUEVSXCIsXG4gIFwiTE9UVEFcIixcbiAgXCJMT1hFU1wiLFxuICBcIkxVTEFCXCIsXG4gIFwiTFVSRVJcIixcbiAgXCJMVVZZQVwiLFxuICBcIkxVWEVTXCIsXG4gIFwiTUFORURcIixcbiAgXCJNQVNIWVwiLFxuICBcIk1BU1NFXCIsXG4gIFwiTUVCQkVcIixcbiAgXCJNRUNDQVwiLFxuICBcIk1FQ1VNXCIsXG4gIFwiTUVSU0VcIixcbiAgXCJNSUNBU1wiLFxuICBcIk1JTUVSXCIsXG4gIFwiTUlOQVNcIixcbiAgXCJNT0RVU1wiLFxuICBcIk1PTFRPXCIsXG4gIFwiTU9QRVJcIixcbiAgXCJNT1NUU1wiLFxuICBcIk1SQURTXCIsXG4gIFwiTVVKSUtcIixcbiAgXCJNVU1CT1wiLFxuICBcIk1VTkdZXCIsXG4gIFwiTVVSS1NcIixcbiAgXCJNVVNFUlwiLFxuICBcIk1VU1NZXCIsXG4gIFwiTVVURVJcIixcbiAgXCJOQUJMQVwiLFxuICBcIk5BTUVSXCIsXG4gIFwiTkVSVFNcIixcbiAgXCJOSUhJTFwiLFxuICBcIk5JVFRZXCIsXG4gIFwiTk9CQllcIixcbiAgXCJOT0lSRVwiLFxuICBcIk5PTk5ZXCIsXG4gIFwiTk9URVJcIixcbiAgXCJOVURFUlwiLFxuICBcIk5VUkJTXCIsXG4gIFwiT0ZGRU5cIixcbiAgXCJPR0xFUlwiLFxuICBcIk9ITUlDXCIsXG4gIFwiT0tSQVNcIixcbiAgXCJPTEVPU1wiLFxuICBcIk9OQ0VUXCIsXG4gIFwiT09ETEVcIixcbiAgXCJPUkJFRFwiLFxuICBcIk9SSU5HXCIsXG4gIFwiT1JMT05cIixcbiAgXCJPVVRFTlwiLFxuICBcIk9XRVNUXCIsXG4gIFwiT1dFVEhcIixcbiAgXCJQQU1QQVwiLFxuICBcIlBBTkVEXCIsXG4gIFwiUEFSRVJcIixcbiAgXCJQQVdFUlwiLFxuICBcIlBFQVRZXCIsXG4gIFwiUEVORFNcIixcbiAgXCJQRVJEVVwiLFxuICBcIlBFVFJJXCIsXG4gIFwiUEZGRlRcIixcbiAgXCJQSEFTRVwiLFxuICBcIlBJSU5HXCIsXG4gIFwiUElTTU9cIixcbiAgXCJQTEVJTlwiLFxuICBcIlBMRU5BXCIsXG4gIFwiUExZRVJcIixcbiAgXCJQT0xMWVwiLFxuICBcIlBPTE9TXCIsXG4gIFwiUE9ORVNcIixcbiAgXCJQT09FWVwiLFxuICBcIlBPU0VUXCIsXG4gIFwiUE9TVEVcIixcbiAgXCJQT1hFRFwiLFxuICBcIlBSRVNUXCIsXG4gIFwiUFJJRVJcIixcbiAgXCJQUklNQVwiLFxuICBcIlBSVVRBXCIsXG4gIFwiUFJZRVJcIixcbiAgXCJQVVBBTFwiLFxuICBcIlBVUEFTXCIsXG4gIFwiUFlYSUVcIixcbiAgXCJRT1BIU1wiLFxuICBcIlFVQUlTXCIsXG4gIFwiUVVBTFNcIixcbiAgXCJSQUtFUlwiLFxuICBcIlJBUEVEXCIsXG4gIFwiUkFQRVNcIixcbiAgXCJSQVNBRVwiLFxuICBcIlJBVEVSXCIsXG4gIFwiUkFXTFlcIixcbiAgXCJSQVpFUlwiLFxuICBcIlJFQk9YXCIsXG4gIFwiUkVESVBcIixcbiAgXCJSRURMWVwiLFxuICBcIlJFRUtZXCIsXG4gIFwiUkVGTFlcIixcbiAgXCJSRUZSWVwiLFxuICBcIlJFTlRFXCIsXG4gIFwiUkVTQVdcIixcbiAgXCJSRVNBWVwiLFxuICBcIlJFU0VXXCIsXG4gIFwiUkVXRURcIixcbiAgXCJSSURHWVwiLFxuICBcIlJJRkVSXCIsXG4gIFwiUklNRVJcIixcbiAgXCJST0JMRVwiLFxuICBcIlJPT0tZXCIsXG4gIFwiUk9PVFlcIixcbiAgXCJSVU5JQ1wiLFxuICBcIlJVTlRZXCIsXG4gIFwiUlVTU0VcIixcbiAgXCJSVVRUWVwiLFxuICBcIlNBR0VSXCIsXG4gIFwiU0FURVNcIixcbiAgXCJTQVdFUlwiLFxuICBcIlNBWUVSXCIsXG4gIFwiU0NPUFNcIixcbiAgXCJTQ1VTRVwiLFxuICBcIlNFREdZXCIsXG4gIFwiU0VFU1RcIixcbiAgXCJTSElFUlwiLFxuICBcIlNISUtJXCIsXG4gIFwiU0hJU0hcIixcbiAgXCJTSE5PUlwiLFxuICBcIlNIT0VEXCIsXG4gIFwiU0hPRVJcIixcbiAgXCJTSFVURVwiLFxuICBcIlNJRlRTXCIsXG4gIFwiU0lMVFlcIixcbiAgXCJTSVpFUlwiLFxuICBcIlNLWUVEXCIsXG4gIFwiU0xBV1NcIixcbiAgXCJTTElFUlwiLFxuICBcIlNMVUZGXCIsXG4gIFwiU09GVFNcIixcbiAgXCJTT0xPTlwiLFxuICBcIlNPTFVNXCIsXG4gIFwiU09OTFlcIixcbiAgXCJTT1dFUlwiLFxuICBcIlNPWUFTXCIsXG4gIFwiU1BJRVJcIixcbiAgXCJTUElOQVwiLFxuICBcIlNQSU5ZXCIsXG4gIFwiU1BVTVlcIixcbiAgXCJTUFVUQVwiLFxuICBcIlNUT0FFXCIsXG4gIFwiU1VEU1lcIixcbiAgXCJTVUVSU1wiLFxuICBcIlNVRVRTXCIsXG4gIFwiU1VFVFlcIixcbiAgXCJTVVBFU1wiLFxuICBcIlRBQ0VUXCIsXG4gIFwiVEFDVFNcIixcbiAgXCJUQUdVQVwiLFxuICBcIlRBUkVEXCIsXG4gIFwiVEFYRVJcIixcbiAgXCJURUNVTVwiLFxuICBcIlRFWEFTXCIsXG4gIFwiVEhFSVJcIixcbiAgXCJUSEVOU1wiLFxuICBcIlRIT1VTXCIsXG4gIFwiVEhXQVBcIixcbiAgXCJUSUdIVFwiLFxuICBcIlRPS0VSXCIsXG4gIFwiVE9QRVJcIixcbiAgXCJUT1JBSFwiLFxuICBcIlRPVEVSXCIsXG4gIFwiVE9VQ0hcIixcbiAgXCJUT1ZFU1wiLFxuICBcIlRPV0VEXCIsXG4gIFwiVE9ZRVJcIixcbiAgXCJUUkVBUFwiLFxuICBcIlRSSUJTXCIsXG4gIFwiVFVGQVNcIixcbiAgXCJUVUZUWVwiLFxuICBcIlRVUkRZXCIsXG4gIFwiVFlQQUxcIixcbiAgXCJVTE5BUlwiLFxuICBcIlVNUFRZXCIsXG4gIFwiVU5BUkNcIixcbiAgXCJVTkFURVwiLFxuICBcIlVORklYXCIsXG4gIFwiVU5ISVRcIixcbiAgXCJVTkpBTVwiLFxuICBcIlVOTUFQXCIsXG4gIFwiVU5TRVdcIixcbiAgXCJVTldPTlwiLFxuICBcIlVSRUFTXCIsXG4gIFwiVVRFUk9cIixcbiAgXCJWQUNVT1wiLFxuICBcIlZBR1VTXCIsXG4gIFwiVkFORURcIixcbiAgXCJWQVJJQVwiLFxuICBcIlZFQUxTXCIsXG4gIFwiVkVJTllcIixcbiAgXCJWRVJTQVwiLFxuICBcIlZJRVJTXCIsXG4gIFwiVklMTEVcIixcbiAgXCJWSU5FRFwiLFxuICBcIlZJUkVTXCIsXG4gIFwiVklTRURcIixcbiAgXCJWSVRBRVwiLFxuICBcIlZJVEFNXCIsXG4gIFwiVklUUk9cIixcbiAgXCJWT1dFUlwiLFxuICBcIldBS0VSXCIsXG4gIFwiV0FMRURcIixcbiAgXCJXQU5MWVwiLFxuICBcIldBUlRZXCIsXG4gIFwiV0FYRVJcIixcbiAgXCJXRUFMRFwiLFxuICBcIldFQU5TXCIsXG4gIFwiV0VCQllcIixcbiAgXCJXRURHWVwiLFxuICBcIldFU1RTXCIsXG4gIFwiV0VUTFlcIixcbiAgXCJXSEFUU1wiLFxuICBcIldIRUVFXCIsXG4gIFwiV0hFTlNcIixcbiAgXCJXSEVXU1wiLFxuICBcIldIRVlTXCIsXG4gIFwiV0hJU0hcIixcbiAgXCJXSE9BU1wiLFxuICBcIldIT09PXCIsXG4gIFwiV0lORVlcIixcbiAgXCJXSVJFUlwiLFxuICBcIldJU1RTXCIsXG4gIFwiV0lUSFNcIixcbiAgXCJXT09FUlwiLFxuICBcIllPR0FTXCIsXG4gIFwiWU9HSUNcIixcbiAgXCJZT0xLWVwiLFxuICBcIllPUkVTXCIsXG4gIFwiWVVMRVNcIixcbiAgXCJaRUFMU1wiLFxuICBcIlpFU1RZXCIsXG4gIFwiWklOR1lcIixcbiAgXCJaT01CSVwiLFxuICBcIlpPT0tTXCIsXG5dXG5cbm1vZHVsZS5leHBvcnRzID0geyBXT1JEU19TVVBQTEVNRU5UIH1cbiIsImNvbnN0IFdPUkRTID0gW1xuICBcIkFBUkdIXCIsXG4gIFwiQUJBQ0FcIixcbiAgXCJBQkFDS1wiLFxuICBcIkFCQUZUXCIsXG4gIFwiQUJBU0VcIixcbiAgXCJBQkFTSFwiLFxuICBcIkFCQVRFXCIsXG4gIFwiQUJCRVlcIixcbiAgXCJBQkJPVFwiLFxuICBcIkFCRUFNXCIsXG4gIFwiQUJFVFNcIixcbiAgXCJBQkhPUlwiLFxuICBcIkFCSURFXCIsXG4gIFwiQUJMRURcIixcbiAgXCJBQkxFUlwiLFxuICBcIkFCT0RFXCIsXG4gIFwiQUJPUlRcIixcbiAgXCJBQk9VVFwiLFxuICBcIkFCT1ZFXCIsXG4gIFwiQUJVU0VcIixcbiAgXCJBQlVUU1wiLFxuICBcIkFCVVpaXCIsXG4gIFwiQUJZU1NcIixcbiAgXCJBQ0hFRFwiLFxuICBcIkFDSEVTXCIsXG4gIFwiQUNJRFNcIixcbiAgXCJBQ0lOR1wiLFxuICBcIkFDTUVTXCIsXG4gIFwiQUNPUk5cIixcbiAgXCJBQ1JFU1wiLFxuICBcIkFDUklEXCIsXG4gIFwiQUNURURcIixcbiAgXCJBQ1RJTlwiLFxuICBcIkFDVE9SXCIsXG4gIFwiQUNVVEVcIixcbiAgXCJBREFHRVwiLFxuICBcIkFEQVBUXCIsXG4gIFwiQURERURcIixcbiAgXCJBRERFUlwiLFxuICBcIkFERExFXCIsXG4gIFwiQURFUFRcIixcbiAgXCJBRElFVVwiLFxuICBcIkFESU9TXCIsXG4gIFwiQURMSUJcIixcbiAgXCJBRE1BTlwiLFxuICBcIkFETUVOXCIsXG4gIFwiQURNSVRcIixcbiAgXCJBRE1JWFwiLFxuICBcIkFET0JFXCIsXG4gIFwiQURPUFRcIixcbiAgXCJBRE9SRVwiLFxuICBcIkFET1JOXCIsXG4gIFwiQURVTFRcIixcbiAgXCJBRFpFU1wiLFxuICBcIkFFR0lTXCIsXG4gIFwiQUVSSUVcIixcbiAgXCJBRkZJWFwiLFxuICBcIkFGSVJFXCIsXG4gIFwiQUZPT1RcIixcbiAgXCJBRk9SRVwiLFxuICBcIkFGT1VMXCIsXG4gIFwiQUZURVJcIixcbiAgXCJBR0FJTlwiLFxuICBcIkFHQVBFXCIsXG4gIFwiQUdBVEVcIixcbiAgXCJBR0FWRVwiLFxuICBcIkFHRU5UXCIsXG4gIFwiQUdJTEVcIixcbiAgXCJBR0lOR1wiLFxuICBcIkFHTEVZXCIsXG4gIFwiQUdMT1dcIixcbiAgXCJBR09OWVwiLFxuICBcIkFHT1JBXCIsXG4gIFwiQUdSRUVcIixcbiAgXCJBR1VFU1wiLFxuICBcIkFIRUFEXCIsXG4gIFwiQUlERURcIixcbiAgXCJBSURFU1wiLFxuICBcIkFJTEVEXCIsXG4gIFwiQUlNRURcIixcbiAgXCJBSU9MSVwiLFxuICBcIkFJUkVEXCIsXG4gIFwiQUlSRVJcIixcbiAgXCJBSVNMRVwiLFxuICBcIkFJVENIXCIsXG4gIFwiQUpVR0FcIixcbiAgXCJBTEFDS1wiLFxuICBcIkFMQVJNXCIsXG4gIFwiQUxCVU1cIixcbiAgXCJBTERFUlwiLFxuICBcIkFMRVBIXCIsXG4gIFwiQUxFUlRcIixcbiAgXCJBTEdBRVwiLFxuICBcIkFMR0FMXCIsXG4gIFwiQUxJQVNcIixcbiAgXCJBTElCSVwiLFxuICBcIkFMSUVOXCIsXG4gIFwiQUxJR05cIixcbiAgXCJBTElLRVwiLFxuICBcIkFMSVZFXCIsXG4gIFwiQUxLWURcIixcbiAgXCJBTEtZTFwiLFxuICBcIkFMTEFZXCIsXG4gIFwiQUxMRVlcIixcbiAgXCJBTExPVFwiLFxuICBcIkFMTE9XXCIsXG4gIFwiQUxMT1lcIixcbiAgXCJBTE9FU1wiLFxuICBcIkFMT0ZUXCIsXG4gIFwiQUxPSEFcIixcbiAgXCJBTE9ORVwiLFxuICBcIkFMT05HXCIsXG4gIFwiQUxPT0ZcIixcbiAgXCJBTE9VRFwiLFxuICBcIkFMUEhBXCIsXG4gIFwiQUxUQVJcIixcbiAgXCJBTFRFUlwiLFxuICBcIkFMVE9TXCIsXG4gIFwiQUxVTVNcIixcbiAgXCJBTFdBWVwiLFxuICBcIkFNQUhTXCIsXG4gIFwiQU1BU1NcIixcbiAgXCJBTUFaRVwiLFxuICBcIkFNQkVSXCIsXG4gIFwiQU1CSVRcIixcbiAgXCJBTUJMRVwiLFxuICBcIkFNRUJBXCIsXG4gIFwiQU1FTkRcIixcbiAgXCJBTUVOU1wiLFxuICBcIkFNSURFXCIsXG4gIFwiQU1JR09cIixcbiAgXCJBTUlORVwiLFxuICBcIkFNSU5PXCIsXG4gIFwiQU1JU1NcIixcbiAgXCJBTUlUWVwiLFxuICBcIkFNT05HXCIsXG4gIFwiQU1PVVJcIixcbiAgXCJBTVBFRFwiLFxuICBcIkFNUExFXCIsXG4gIFwiQU1QTFlcIixcbiAgXCJBTVVTRVwiLFxuICBcIkFORU5UXCIsXG4gIFwiQU5HRUxcIixcbiAgXCJBTkdFUlwiLFxuICBcIkFOR0xFXCIsXG4gIFwiQU5HUllcIixcbiAgXCJBTkdTVFwiLFxuICBcIkFOSU1BXCIsXG4gIFwiQU5JT05cIixcbiAgXCJBTklTRVwiLFxuICBcIkFOS0hTXCIsXG4gIFwiQU5LTEVcIixcbiAgXCJBTk5BU1wiLFxuICBcIkFOTkVYXCIsXG4gIFwiQU5OT1lcIixcbiAgXCJBTk5VTFwiLFxuICBcIkFOT0RFXCIsXG4gIFwiQU5PTEVcIixcbiAgXCJBTlRFRFwiLFxuICBcIkFOVEVTXCIsXG4gIFwiQU5USUNcIixcbiAgXCJBTlRJU1wiLFxuICBcIkFOVFNZXCIsXG4gIFwiQU5WSUxcIixcbiAgXCJBT1JUQVwiLFxuICBcIkFQQUNFXCIsXG4gIFwiQVBBUlRcIixcbiAgXCJBUEhJRFwiLFxuICBcIkFQSElTXCIsXG4gIFwiQVBJQU5cIixcbiAgXCJBUElOR1wiLFxuICBcIkFQSVNIXCIsXG4gIFwiQVBORUFcIixcbiAgXCJBUFBMRVwiLFxuICBcIkFQUExZXCIsXG4gIFwiQVBST05cIixcbiAgXCJBUFNFU1wiLFxuICBcIkFQVExZXCIsXG4gIFwiQVJCT1JcIixcbiAgXCJBUkNFRFwiLFxuICBcIkFSRE9SXCIsXG4gIFwiQVJFQVNcIixcbiAgXCJBUkVOQVwiLFxuICBcIkFSR09OXCIsXG4gIFwiQVJHT1RcIixcbiAgXCJBUkdVRVwiLFxuICBcIkFSSUFTXCIsXG4gIFwiQVJJU0VcIixcbiAgXCJBUk1FRFwiLFxuICBcIkFSTU9SXCIsXG4gIFwiQVJPTUFcIixcbiAgXCJBUk9TRVwiLFxuICBcIkFSUkFTXCIsXG4gIFwiQVJSQVlcIixcbiAgXCJBUlJPV1wiLFxuICBcIkFSU0VTXCIsXG4gIFwiQVJTT05cIixcbiAgXCJBUlRTWVwiLFxuICBcIkFSVU1TXCIsXG4gIFwiQVNBTkFcIixcbiAgXCJBU0NPVFwiLFxuICBcIkFTSEVOXCIsXG4gIFwiQVNIRVNcIixcbiAgXCJBU0lERVwiLFxuICBcIkFTS0VEXCIsXG4gIFwiQVNLRVdcIixcbiAgXCJBU1BFTlwiLFxuICBcIkFTUElDXCIsXG4gIFwiQVNTQUlcIixcbiAgXCJBU1NBWVwiLFxuICBcIkFTU0VTXCIsXG4gIFwiQVNTRVRcIixcbiAgXCJBU1RFUlwiLFxuICBcIkFTVElSXCIsXG4gIFwiQVRJTFRcIixcbiAgXCJBVExBU1wiLFxuICBcIkFUT0xMXCIsXG4gIFwiQVRPTVNcIixcbiAgXCJBVE9ORVwiLFxuICBcIkFUUklBXCIsXG4gIFwiQVRUQVJcIixcbiAgXCJBVFRJQ1wiLFxuICBcIkFVRElPXCIsXG4gIFwiQVVESVRcIixcbiAgXCJBVUdFUlwiLFxuICBcIkFVR0hUXCIsXG4gIFwiQVVHVVJcIixcbiAgXCJBVU5UU1wiLFxuICBcIkFVUkFFXCIsXG4gIFwiQVVSQUxcIixcbiAgXCJBVVJBU1wiLFxuICBcIkFVUklDXCIsXG4gIFwiQVVUT1NcIixcbiAgXCJBVkFJTFwiLFxuICBcIkFWQU5UXCIsXG4gIFwiQVZBU1RcIixcbiAgXCJBVkVSU1wiLFxuICBcIkFWRVJUXCIsXG4gIFwiQVZJQU5cIixcbiAgXCJBVk9JRFwiLFxuICBcIkFWT1dTXCIsXG4gIFwiQVdBSVRcIixcbiAgXCJBV0FLRVwiLFxuICBcIkFXQVJEXCIsXG4gIFwiQVdBUkVcIixcbiAgXCJBV0FTSFwiLFxuICBcIkFXQVlTXCIsXG4gIFwiQVdGVUxcIixcbiAgXCJBV0lOR1wiLFxuICBcIkFXT0tFXCIsXG4gIFwiQVhFTFNcIixcbiAgXCJBWElBTFwiLFxuICBcIkFYSU5HXCIsXG4gIFwiQVhJT01cIixcbiAgXCJBWExFU1wiLFxuICBcIkFYTUFOXCIsXG4gIFwiQVhNRU5cIixcbiAgXCJBWE9OU1wiLFxuICBcIkFaSU5FXCIsXG4gIFwiQVpPSUNcIixcbiAgXCJBWlVSRVwiLFxuICBcIkJBQkVMXCIsXG4gIFwiQkFCRVNcIixcbiAgXCJCQUNLU1wiLFxuICBcIkJBQ09OXCIsXG4gIFwiQkFERFlcIixcbiAgXCJCQURHRVwiLFxuICBcIkJBRExZXCIsXG4gIFwiQkFHRUxcIixcbiAgXCJCQUdHWVwiLFxuICBcIkJBSUxTXCIsXG4gIFwiQkFJUk5cIixcbiAgXCJCQUlUU1wiLFxuICBcIkJBSVpFXCIsXG4gIFwiQkFLRURcIixcbiAgXCJCQUtFUlwiLFxuICBcIkJBS0VTXCIsXG4gIFwiQkFMRFlcIixcbiAgXCJCQUxFRFwiLFxuICBcIkJBTEVSXCIsXG4gIFwiQkFMRVNcIixcbiAgXCJCQUxLU1wiLFxuICBcIkJBTEtZXCIsXG4gIFwiQkFMTFNcIixcbiAgXCJCQUxMWVwiLFxuICBcIkJBTE1TXCIsXG4gIFwiQkFMTVlcIixcbiAgXCJCQUxTQVwiLFxuICBcIkJBTkFMXCIsXG4gIFwiQkFORFNcIixcbiAgXCJCQU5EWVwiLFxuICBcIkJBTkVTXCIsXG4gIFwiQkFOR1NcIixcbiAgXCJCQU5KT1wiLFxuICBcIkJBTktTXCIsXG4gIFwiQkFOTlNcIixcbiAgXCJCQVJCU1wiLFxuICBcIkJBUkRTXCIsXG4gIFwiQkFSRURcIixcbiAgXCJCQVJFUlwiLFxuICBcIkJBUkVTXCIsXG4gIFwiQkFSRlNcIixcbiAgXCJCQVJGWVwiLFxuICBcIkJBUkdFXCIsXG4gIFwiQkFSS1NcIixcbiAgXCJCQVJNWVwiLFxuICBcIkJBUk5TXCIsXG4gIFwiQkFST05cIixcbiAgXCJCQVNBTFwiLFxuICBcIkJBU0VEXCIsXG4gIFwiQkFTRVJcIixcbiAgXCJCQVNFU1wiLFxuICBcIkJBU0lDXCIsXG4gIFwiQkFTSUxcIixcbiAgXCJCQVNJTlwiLFxuICBcIkJBU0lTXCIsXG4gIFwiQkFTS1NcIixcbiAgXCJCQVNTSVwiLFxuICBcIkJBU1NPXCIsXG4gIFwiQkFTVEVcIixcbiAgXCJCQVRDSFwiLFxuICBcIkJBVEVEXCIsXG4gIFwiQkFURVNcIixcbiAgXCJCQVRIRVwiLFxuICBcIkJBVEhTXCIsXG4gIFwiQkFUSUtcIixcbiAgXCJCQVRPTlwiLFxuICBcIkJBVFRZXCIsXG4gIFwiQkFVRFNcIixcbiAgXCJCQVVMS1wiLFxuICBcIkJBV0RZXCIsXG4gIFwiQkFXTFNcIixcbiAgXCJCQVlFRFwiLFxuICBcIkJBWU9VXCIsXG4gIFwiQkVBQ0hcIixcbiAgXCJCRUFEU1wiLFxuICBcIkJFQURZXCIsXG4gIFwiQkVBS1NcIixcbiAgXCJCRUFLWVwiLFxuICBcIkJFQU1TXCIsXG4gIFwiQkVBTVlcIixcbiAgXCJCRUFOT1wiLFxuICBcIkJFQU5TXCIsXG4gIFwiQkVBUkRcIixcbiAgXCJCRUFSU1wiLFxuICBcIkJFQVNUXCIsXG4gIFwiQkVBVFNcIixcbiAgXCJCRUFVU1wiLFxuICBcIkJFQVVUXCIsXG4gIFwiQkVBVVhcIixcbiAgXCJCRUJPUFwiLFxuICBcIkJFQ0tTXCIsXG4gIFwiQkVERVdcIixcbiAgXCJCRURJTVwiLFxuICBcIkJFRUNIXCIsXG4gIFwiQkVFRlNcIixcbiAgXCJCRUVGWVwiLFxuICBcIkJFRVBTXCIsXG4gIFwiQkVFUlNcIixcbiAgXCJCRUVSWVwiLFxuICBcIkJFRVRTXCIsXG4gIFwiQkVGSVRcIixcbiAgXCJCRUZPR1wiLFxuICBcIkJFR0FOXCIsXG4gIFwiQkVHQVRcIixcbiAgXCJCRUdFVFwiLFxuICBcIkJFR0lOXCIsXG4gIFwiQkVHT1RcIixcbiAgXCJCRUdVTlwiLFxuICBcIkJFSUdFXCIsXG4gIFwiQkVJTkdcIixcbiAgXCJCRUxBWVwiLFxuICBcIkJFTENIXCIsXG4gIFwiQkVMSUVcIixcbiAgXCJCRUxMRVwiLFxuICBcIkJFTExTXCIsXG4gIFwiQkVMTFlcIixcbiAgXCJCRUxPV1wiLFxuICBcIkJFTFRTXCIsXG4gIFwiQkVOQ0hcIixcbiAgXCJCRU5EU1wiLFxuICBcIkJFTlRTXCIsXG4gIFwiQkVSRVRcIixcbiAgXCJCRVJHU1wiLFxuICBcIkJFUk1TXCIsXG4gIFwiQkVSUllcIixcbiAgXCJCRVJUSFwiLFxuICBcIkJFUllMXCIsXG4gIFwiQkVTRVRcIixcbiAgXCJCRVNUU1wiLFxuICBcIkJFVEFTXCIsXG4gIFwiQkVURUxcIixcbiAgXCJCRVRIU1wiLFxuICBcIkJFVkVMXCIsXG4gIFwiQkVaRUxcIixcbiAgXCJCSEFOR1wiLFxuICBcIkJJQkJTXCIsXG4gIFwiQklCTEVcIixcbiAgXCJCSUREWVwiLFxuICBcIkJJREVEXCIsXG4gIFwiQklERVNcIixcbiAgXCJCSURFVFwiLFxuICBcIkJJRVJTXCIsXG4gIFwiQklGRlNcIixcbiAgXCJCSUZGWVwiLFxuICBcIkJJR0hUXCIsXG4gIFwiQklHTFlcIixcbiAgXCJCSUdPVFwiLFxuICBcIkJJS0VEXCIsXG4gIFwiQklLRVJcIixcbiAgXCJCSUtFU1wiLFxuICBcIkJJTEdFXCIsXG4gIFwiQklMS1NcIixcbiAgXCJCSUxMU1wiLFxuICBcIkJJTExZXCIsXG4gIFwiQklNQk9cIixcbiAgXCJCSU5EU1wiLFxuICBcIkJJTkdFXCIsXG4gIFwiQklOR09cIixcbiAgXCJCSU9NRVwiLFxuICBcIkJJUEVEXCIsXG4gIFwiQklQT0RcIixcbiAgXCJCSVJDSFwiLFxuICBcIkJJUkRTXCIsXG4gIFwiQklSVEhcIixcbiAgXCJCSVNPTlwiLFxuICBcIkJJVENIXCIsXG4gIFwiQklURVJcIixcbiAgXCJCSVRFU1wiLFxuICBcIkJJVFRZXCIsXG4gIFwiQkxBQlNcIixcbiAgXCJCTEFDS1wiLFxuICBcIkJMQURFXCIsXG4gIFwiQkxBSFNcIixcbiAgXCJCTEFNRVwiLFxuICBcIkJMQU5EXCIsXG4gIFwiQkxBTktcIixcbiAgXCJCTEFSRVwiLFxuICBcIkJMQVNUXCIsXG4gIFwiQkxBVFNcIixcbiAgXCJCTEFaRVwiLFxuICBcIkJMRUFLXCIsXG4gIFwiQkxFQVJcIixcbiAgXCJCTEVBVFwiLFxuICBcIkJMRUJTXCIsXG4gIFwiQkxFRURcIixcbiAgXCJCTEVORFwiLFxuICBcIkJMRVNTXCIsXG4gIFwiQkxFU1RcIixcbiAgXCJCTElNUFwiLFxuICBcIkJMSU5EXCIsXG4gIFwiQkxJTklcIixcbiAgXCJCTElOS1wiLFxuICBcIkJMSVBTXCIsXG4gIFwiQkxJU1NcIixcbiAgXCJCTElUWlwiLFxuICBcIkJMT0FUXCIsXG4gIFwiQkxPQlNcIixcbiAgXCJCTE9DS1wiLFxuICBcIkJMT0NTXCIsXG4gIFwiQkxPS0VcIixcbiAgXCJCTE9ORFwiLFxuICBcIkJMT09EXCIsXG4gIFwiQkxPT01cIixcbiAgXCJCTE9UU1wiLFxuICBcIkJMT1dOXCIsXG4gIFwiQkxPV1NcIixcbiAgXCJCTE9XWVwiLFxuICBcIkJMVUVEXCIsXG4gIFwiQkxVRVJcIixcbiAgXCJCTFVFU1wiLFxuICBcIkJMVUZGXCIsXG4gIFwiQkxVTlRcIixcbiAgXCJCTFVSQlwiLFxuICBcIkJMVVJTXCIsXG4gIFwiQkxVUlRcIixcbiAgXCJCTFVTSFwiLFxuICBcIkJPQVJEXCIsXG4gIFwiQk9BUlNcIixcbiAgXCJCT0FTVFwiLFxuICBcIkJPQVRTXCIsXG4gIFwiQk9CQllcIixcbiAgXCJCT0NDRVwiLFxuICBcIkJPQ0NJXCIsXG4gIFwiQk9DS1NcIixcbiAgXCJCT0RFRFwiLFxuICBcIkJPREVTXCIsXG4gIFwiQk9ER0VcIixcbiAgXCJCT0ZGT1wiLFxuICBcIkJPRkZTXCIsXG4gIFwiQk9HRVlcIixcbiAgXCJCT0dHWVwiLFxuICBcIkJPR0lFXCIsXG4gIFwiQk9HVVNcIixcbiAgXCJCT0lMU1wiLFxuICBcIkJPTEFTXCIsXG4gIFwiQk9MTFNcIixcbiAgXCJCT0xPU1wiLFxuICBcIkJPTFRTXCIsXG4gIFwiQk9NQkVcIixcbiAgXCJCT01CU1wiLFxuICBcIkJPTkRTXCIsXG4gIFwiQk9ORURcIixcbiAgXCJCT05FUlwiLFxuICBcIkJPTkVTXCIsXG4gIFwiQk9OR09cIixcbiAgXCJCT05HU1wiLFxuICBcIkJPTktTXCIsXG4gIFwiQk9OTkVcIixcbiAgXCJCT05OWVwiLFxuICBcIkJPTlVTXCIsXG4gIFwiQk9PQlNcIixcbiAgXCJCT09CWVwiLFxuICBcIkJPT0VEXCIsXG4gIFwiQk9PS1NcIixcbiAgXCJCT09NU1wiLFxuICBcIkJPT01ZXCIsXG4gIFwiQk9PTlNcIixcbiAgXCJCT09SU1wiLFxuICBcIkJPT1NUXCIsXG4gIFwiQk9PVEhcIixcbiAgXCJCT09UU1wiLFxuICBcIkJPT1RZXCIsXG4gIFwiQk9PWkVcIixcbiAgXCJCT09aWVwiLFxuICBcIkJPUkFYXCIsXG4gIFwiQk9SRURcIixcbiAgXCJCT1JFUlwiLFxuICBcIkJPUkVTXCIsXG4gIFwiQk9SSUNcIixcbiAgXCJCT1JORVwiLFxuICBcIkJPUk9OXCIsXG4gIFwiQk9TS1lcIixcbiAgXCJCT1NPTVwiLFxuICBcIkJPU09OXCIsXG4gIFwiQk9TU1lcIixcbiAgXCJCT1NVTlwiLFxuICBcIkJPVENIXCIsXG4gIFwiQk9VR0hcIixcbiAgXCJCT1VMRVwiLFxuICBcIkJPVU5EXCIsXG4gIFwiQk9VVFNcIixcbiAgXCJCT1dFRFwiLFxuICBcIkJPV0VMXCIsXG4gIFwiQk9XRVJcIixcbiAgXCJCT1dJRVwiLFxuICBcIkJPV0xTXCIsXG4gIFwiQk9YRURcIixcbiAgXCJCT1hFUlwiLFxuICBcIkJPWEVTXCIsXG4gIFwiQk9aT1NcIixcbiAgXCJCUkFDRVwiLFxuICBcIkJSQUNLXCIsXG4gIFwiQlJBQ1RcIixcbiAgXCJCUkFEU1wiLFxuICBcIkJSQUVTXCIsXG4gIFwiQlJBR1NcIixcbiAgXCJCUkFJRFwiLFxuICBcIkJSQUlOXCIsXG4gIFwiQlJBS0VcIixcbiAgXCJCUkFORFwiLFxuICBcIkJSQU5UXCIsXG4gIFwiQlJBU0hcIixcbiAgXCJCUkFTU1wiLFxuICBcIkJSQVRTXCIsXG4gIFwiQlJBVkVcIixcbiAgXCJCUkFWT1wiLFxuICBcIkJSQVdMXCIsXG4gIFwiQlJBV05cIixcbiAgXCJCUkFZU1wiLFxuICBcIkJSQVpFXCIsXG4gIFwiQlJFQURcIixcbiAgXCJCUkVBS1wiLFxuICBcIkJSRUFNXCIsXG4gIFwiQlJFRURcIixcbiAgXCJCUkVWRVwiLFxuICBcIkJSRVdTXCIsXG4gIFwiQlJJQVJcIixcbiAgXCJCUklCRVwiLFxuICBcIkJSSUNLXCIsXG4gIFwiQlJJREVcIixcbiAgXCJCUklFRlwiLFxuICBcIkJSSUVSXCIsXG4gIFwiQlJJR1NcIixcbiAgXCJCUklNU1wiLFxuICBcIkJSSU5FXCIsXG4gIFwiQlJJTkdcIixcbiAgXCJCUklOS1wiLFxuICBcIkJSSU5ZXCIsXG4gIFwiQlJJU0tcIixcbiAgXCJCUk9BRFwiLFxuICBcIkJST0lMXCIsXG4gIFwiQlJPS0VcIixcbiAgXCJCUk9NT1wiLFxuICBcIkJST05DXCIsXG4gIFwiQlJPT0RcIixcbiAgXCJCUk9PS1wiLFxuICBcIkJST09NXCIsXG4gIFwiQlJPVEhcIixcbiAgXCJCUk9XTlwiLFxuICBcIkJST1dTXCIsXG4gIFwiQlJVSU5cIixcbiAgXCJCUlVJVFwiLFxuICBcIkJSVU5UXCIsXG4gIFwiQlJVU0hcIixcbiAgXCJCUlVURVwiLFxuICBcIkJVQkJBXCIsXG4gIFwiQlVDS1NcIixcbiAgXCJCVUREWVwiLFxuICBcIkJVREdFXCIsXG4gIFwiQlVGRk9cIixcbiAgXCJCVUZGU1wiLFxuICBcIkJVR0dZXCIsXG4gIFwiQlVHTEVcIixcbiAgXCJCVUlMRFwiLFxuICBcIkJVSUxUXCIsXG4gIFwiQlVMQlNcIixcbiAgXCJCVUxHRVwiLFxuICBcIkJVTEdZXCIsXG4gIFwiQlVMS1NcIixcbiAgXCJCVUxLWVwiLFxuICBcIkJVTExTXCIsXG4gIFwiQlVMTFlcIixcbiAgXCJCVU1QSFwiLFxuICBcIkJVTVBTXCIsXG4gIFwiQlVNUFlcIixcbiAgXCJCVU5DSFwiLFxuICBcIkJVTkNPXCIsXG4gIFwiQlVORFNcIixcbiAgXCJCVU5HU1wiLFxuICBcIkJVTktPXCIsXG4gIFwiQlVOS1NcIixcbiAgXCJCVU5OWVwiLFxuICBcIkJVTlRTXCIsXG4gIFwiQlVPWVNcIixcbiAgXCJCVVJFVFwiLFxuICBcIkJVUkdTXCIsXG4gIFwiQlVSTFNcIixcbiAgXCJCVVJMWVwiLFxuICBcIkJVUk5TXCIsXG4gIFwiQlVSTlRcIixcbiAgXCJCVVJQU1wiLFxuICBcIkJVUlJPXCIsXG4gIFwiQlVSUlNcIixcbiAgXCJCVVJTVFwiLFxuICBcIkJVU0JZXCIsXG4gIFwiQlVTRURcIixcbiAgXCJCVVNFU1wiLFxuICBcIkJVU0hZXCIsXG4gIFwiQlVTS1NcIixcbiAgXCJCVVNUU1wiLFxuICBcIkJVU1RZXCIsXG4gIFwiQlVUQ0hcIixcbiAgXCJCVVRURVwiLFxuICBcIkJVVFRTXCIsXG4gIFwiQlVUWUxcIixcbiAgXCJCVVhPTVwiLFxuICBcIkJVWUVSXCIsXG4gIFwiQlVaWllcIixcbiAgXCJCV0FOQVwiLFxuICBcIkJZTEFXXCIsXG4gIFwiQllSRVNcIixcbiAgXCJCWVRFU1wiLFxuICBcIkJZV0FZXCIsXG4gIFwiQ0FCQUxcIixcbiAgXCJDQUJCWVwiLFxuICBcIkNBQklOXCIsXG4gIFwiQ0FCTEVcIixcbiAgXCJDQUNBT1wiLFxuICBcIkNBQ0hFXCIsXG4gIFwiQ0FDVElcIixcbiAgXCJDQUREWVwiLFxuICBcIkNBREVUXCIsXG4gIFwiQ0FER0VcIixcbiAgXCJDQURSRVwiLFxuICBcIkNBRkVTXCIsXG4gIFwiQ0FHRURcIixcbiAgXCJDQUdFU1wiLFxuICBcIkNBR0VZXCIsXG4gIFwiQ0FJUk5cIixcbiAgXCJDQUtFRFwiLFxuICBcIkNBS0VTXCIsXG4gIFwiQ0FMSVhcIixcbiAgXCJDQUxLU1wiLFxuICBcIkNBTExBXCIsXG4gIFwiQ0FMTFNcIixcbiAgXCJDQUxNU1wiLFxuICBcIkNBTFZFXCIsXG4gIFwiQ0FMWVhcIixcbiAgXCJDQU1FTFwiLFxuICBcIkNBTUVPXCIsXG4gIFwiQ0FNUE9cIixcbiAgXCJDQU1QU1wiLFxuICBcIkNBTVBZXCIsXG4gIFwiQ0FOQUxcIixcbiAgXCJDQU5EWVwiLFxuICBcIkNBTkVEXCIsXG4gIFwiQ0FORVNcIixcbiAgXCJDQU5OQVwiLFxuICBcIkNBTk5ZXCIsXG4gIFwiQ0FOT0VcIixcbiAgXCJDQU5PTlwiLFxuICBcIkNBTlNUXCIsXG4gIFwiQ0FOVE9cIixcbiAgXCJDQU5UU1wiLFxuICBcIkNBUEVEXCIsXG4gIFwiQ0FQRVJcIixcbiAgXCJDQVBFU1wiLFxuICBcIkNBUE9OXCIsXG4gIFwiQ0FQT1NcIixcbiAgXCJDQVJBVFwiLFxuICBcIkNBUkRTXCIsXG4gIFwiQ0FSRURcIixcbiAgXCJDQVJFUlwiLFxuICBcIkNBUkVTXCIsXG4gIFwiQ0FSRVRcIixcbiAgXCJDQVJHT1wiLFxuICBcIkNBUk5ZXCIsXG4gIFwiQ0FST0JcIixcbiAgXCJDQVJPTFwiLFxuICBcIkNBUk9NXCIsXG4gIFwiQ0FSUFNcIixcbiAgXCJDQVJSWVwiLFxuICBcIkNBUlRFXCIsXG4gIFwiQ0FSVFNcIixcbiAgXCJDQVJWRVwiLFxuICBcIkNBU0FTXCIsXG4gIFwiQ0FTRURcIixcbiAgXCJDQVNFU1wiLFxuICBcIkNBU0tTXCIsXG4gIFwiQ0FTVEVcIixcbiAgXCJDQVNUU1wiLFxuICBcIkNBVENIXCIsXG4gIFwiQ0FURVJcIixcbiAgXCJDQVRUWVwiLFxuICBcIkNBVUxLXCIsXG4gIFwiQ0FVTFNcIixcbiAgXCJDQVVTRVwiLFxuICBcIkNBVkVEXCIsXG4gIFwiQ0FWRVNcIixcbiAgXCJDQVZJTFwiLFxuICBcIkNBV0VEXCIsXG4gIFwiQ0VBU0VcIixcbiAgXCJDRURBUlwiLFxuICBcIkNFREVEXCIsXG4gIFwiQ0VERVNcIixcbiAgXCJDRUlMU1wiLFxuICBcIkNFTEVCXCIsXG4gIFwiQ0VMTE9cIixcbiAgXCJDRUxMU1wiLFxuICBcIkNFTlRPXCIsXG4gIFwiQ0VOVFNcIixcbiAgXCJDSEFGRVwiLFxuICBcIkNIQUZGXCIsXG4gIFwiQ0hBSU5cIixcbiAgXCJDSEFJUlwiLFxuICBcIkNIQUxLXCIsXG4gIFwiQ0hBTVBcIixcbiAgXCJDSEFOVFwiLFxuICBcIkNIQU9TXCIsXG4gIFwiQ0hBUFNcIixcbiAgXCJDSEFSRFwiLFxuICBcIkNIQVJNXCIsXG4gIFwiQ0hBUlNcIixcbiAgXCJDSEFSVFwiLFxuICBcIkNIQVJZXCIsXG4gIFwiQ0hBU0VcIixcbiAgXCJDSEFTTVwiLFxuICBcIkNIQVRTXCIsXG4gIFwiQ0hBV1NcIixcbiAgXCJDSEVBUFwiLFxuICBcIkNIRUFUXCIsXG4gIFwiQ0hFQ0tcIixcbiAgXCJDSEVFS1wiLFxuICBcIkNIRUVQXCIsXG4gIFwiQ0hFRVJcIixcbiAgXCJDSEVGU1wiLFxuICBcIkNIRVJUXCIsXG4gIFwiQ0hFU1NcIixcbiAgXCJDSEVTVFwiLFxuICBcIkNIRVdTXCIsXG4gIFwiQ0hFV1lcIixcbiAgXCJDSElDS1wiLFxuICBcIkNISURFXCIsXG4gIFwiQ0hJRUZcIixcbiAgXCJDSElMRFwiLFxuICBcIkNISUxFXCIsXG4gIFwiQ0hJTElcIixcbiAgXCJDSElMTFwiLFxuICBcIkNISU1FXCIsXG4gIFwiQ0hJTVBcIixcbiAgXCJDSElOQVwiLFxuICBcIkNISU5FXCIsXG4gIFwiQ0hJTktcIixcbiAgXCJDSElOT1wiLFxuICBcIkNISU5TXCIsXG4gIFwiQ0hJUFNcIixcbiAgXCJDSElSUFwiLFxuICBcIkNISVRTXCIsXG4gIFwiQ0hJVkVcIixcbiAgXCJDSE9DS1wiLFxuICBcIkNIT0lSXCIsXG4gIFwiQ0hPS0VcIixcbiAgXCJDSE9NUFwiLFxuICBcIkNIT1BTXCIsXG4gIFwiQ0hPUkRcIixcbiAgXCJDSE9SRVwiLFxuICBcIkNIT1NFXCIsXG4gIFwiQ0hPV1NcIixcbiAgXCJDSFVDS1wiLFxuICBcIkNIVUZGXCIsXG4gIFwiQ0hVR1NcIixcbiAgXCJDSFVNUFwiLFxuICBcIkNIVU1TXCIsXG4gIFwiQ0hVTktcIixcbiAgXCJDSFVSTFwiLFxuICBcIkNIVVJOXCIsXG4gIFwiQ0hVVEVcIixcbiAgXCJDSURFUlwiLFxuICBcIkNJR0FSXCIsXG4gIFwiQ0lMSUFcIixcbiAgXCJDSUxMU1wiLFxuICBcIkNJTkNIXCIsXG4gIFwiQ0lSQ0FcIixcbiAgXCJDSVJSSVwiLFxuICBcIkNJVEVEXCIsXG4gIFwiQ0lURVNcIixcbiAgXCJDSVZFVFwiLFxuICBcIkNJVklDXCIsXG4gIFwiQ0lWSUxcIixcbiAgXCJDSVZWWVwiLFxuICBcIkNMQUNLXCIsXG4gIFwiQ0xBRFNcIixcbiAgXCJDTEFJTVwiLFxuICBcIkNMQU1QXCIsXG4gIFwiQ0xBTVNcIixcbiAgXCJDTEFOR1wiLFxuICBcIkNMQU5LXCIsXG4gIFwiQ0xBTlNcIixcbiAgXCJDTEFQU1wiLFxuICBcIkNMQVNIXCIsXG4gIFwiQ0xBU1BcIixcbiAgXCJDTEFTU1wiLFxuICBcIkNMQVZFXCIsXG4gIFwiQ0xBV1NcIixcbiAgXCJDTEFZU1wiLFxuICBcIkNMRUFOXCIsXG4gIFwiQ0xFQVJcIixcbiAgXCJDTEVBVFwiLFxuICBcIkNMRUZTXCIsXG4gIFwiQ0xFRlRcIixcbiAgXCJDTEVSS1wiLFxuICBcIkNMRVdTXCIsXG4gIFwiQ0xJQ0tcIixcbiAgXCJDTElGRlwiLFxuICBcIkNMSU1CXCIsXG4gIFwiQ0xJTUVcIixcbiAgXCJDTElOR1wiLFxuICBcIkNMSU5LXCIsXG4gIFwiQ0xJUFNcIixcbiAgXCJDTE9BS1wiLFxuICBcIkNMT0NLXCIsXG4gIFwiQ0xPRFNcIixcbiAgXCJDTE9HU1wiLFxuICBcIkNMT01QXCIsXG4gIFwiQ0xPTkVcIixcbiAgXCJDTE9QU1wiLFxuICBcIkNMT1NFXCIsXG4gIFwiQ0xPVEhcIixcbiAgXCJDTE9UU1wiLFxuICBcIkNMT1VEXCIsXG4gIFwiQ0xPVVRcIixcbiAgXCJDTE9WRVwiLFxuICBcIkNMT1dOXCIsXG4gIFwiQ0xPWVNcIixcbiAgXCJDTFVCU1wiLFxuICBcIkNMVUNLXCIsXG4gIFwiQ0xVRURcIixcbiAgXCJDTFVFU1wiLFxuICBcIkNMVU1QXCIsXG4gIFwiQ0xVTkdcIixcbiAgXCJDTFVOS1wiLFxuICBcIkNPQUNIXCIsXG4gIFwiQ09BTFNcIixcbiAgXCJDT0FTVFwiLFxuICBcIkNPQVRJXCIsXG4gIFwiQ09BVFNcIixcbiAgXCJDT0JSQVwiLFxuICBcIkNPQ0FTXCIsXG4gIFwiQ09DQ0lcIixcbiAgXCJDT0NLU1wiLFxuICBcIkNPQ0tZXCIsXG4gIFwiQ09DT0FcIixcbiAgXCJDT0NPU1wiLFxuICBcIkNPREFTXCIsXG4gIFwiQ09ERURcIixcbiAgXCJDT0RFUlwiLFxuICBcIkNPREVTXCIsXG4gIFwiQ09ERVhcIixcbiAgXCJDT0RPTlwiLFxuICBcIkNPRURTXCIsXG4gIFwiQ09IT1NcIixcbiAgXCJDT0lGU1wiLFxuICBcIkNPSUxTXCIsXG4gIFwiQ09JTlNcIixcbiAgXCJDT0tFRFwiLFxuICBcIkNPS0VTXCIsXG4gIFwiQ09MQVNcIixcbiAgXCJDT0xEU1wiLFxuICBcIkNPTElDXCIsXG4gIFwiQ09MT05cIixcbiAgXCJDT0xPUlwiLFxuICBcIkNPTFRTXCIsXG4gIFwiQ09NQVNcIixcbiAgXCJDT01CT1wiLFxuICBcIkNPTUJTXCIsXG4gIFwiQ09NRVJcIixcbiAgXCJDT01FU1wiLFxuICBcIkNPTUVUXCIsXG4gIFwiQ09NRllcIixcbiAgXCJDT01JQ1wiLFxuICBcIkNPTU1BXCIsXG4gIFwiQ09NUFNcIixcbiAgXCJDT05DSFwiLFxuICBcIkNPTkRPXCIsXG4gIFwiQ09ORURcIixcbiAgXCJDT05FU1wiLFxuICBcIkNPTkVZXCIsXG4gIFwiQ09OR0FcIixcbiAgXCJDT05JQ1wiLFxuICBcIkNPTktTXCIsXG4gIFwiQ09PQ0hcIixcbiAgXCJDT09FRFwiLFxuICBcIkNPT0tTXCIsXG4gIFwiQ09PTFNcIixcbiAgXCJDT09OU1wiLFxuICBcIkNPT1BTXCIsXG4gIFwiQ09PVFNcIixcbiAgXCJDT1BFRFwiLFxuICBcIkNPUEVSXCIsXG4gIFwiQ09QRVNcIixcbiAgXCJDT1BSQVwiLFxuICBcIkNPUFNFXCIsXG4gIFwiQ09SQUxcIixcbiAgXCJDT1JEU1wiLFxuICBcIkNPUkVEXCIsXG4gIFwiQ09SRVNcIixcbiAgXCJDT1JHSVwiLFxuICBcIkNPUktTXCIsXG4gIFwiQ09SS1lcIixcbiAgXCJDT1JNU1wiLFxuICBcIkNPUk5TXCIsXG4gIFwiQ09STlVcIixcbiAgXCJDT1JOWVwiLFxuICBcIkNPUlBTXCIsXG4gIFwiQ09TRVRcIixcbiAgXCJDT1NUQVwiLFxuICBcIkNPU1RTXCIsXG4gIFwiQ09URVNcIixcbiAgXCJDT1RUQVwiLFxuICBcIkNPVUNIXCIsXG4gIFwiQ09VR0hcIixcbiAgXCJDT1VMRFwiLFxuICBcIkNPVU5UXCIsXG4gIFwiQ09VUEVcIixcbiAgXCJDT1VQU1wiLFxuICBcIkNPVVJUXCIsXG4gIFwiQ09VVEhcIixcbiAgXCJDT1ZFTlwiLFxuICBcIkNPVkVSXCIsXG4gIFwiQ09WRVNcIixcbiAgXCJDT1ZFVFwiLFxuICBcIkNPVkVZXCIsXG4gIFwiQ09XRURcIixcbiAgXCJDT1dFUlwiLFxuICBcIkNPV0xTXCIsXG4gIFwiQ09XUllcIixcbiAgXCJDT1hFRFwiLFxuICBcIkNPWEVTXCIsXG4gIFwiQ09ZRVJcIixcbiAgXCJDT1lMWVwiLFxuICBcIkNPWVBVXCIsXG4gIFwiQ09aRU5cIixcbiAgXCJDUkFCU1wiLFxuICBcIkNSQUNLXCIsXG4gIFwiQ1JBRlRcIixcbiAgXCJDUkFHU1wiLFxuICBcIkNSQU1QXCIsXG4gIFwiQ1JBTVNcIixcbiAgXCJDUkFORVwiLFxuICBcIkNSQU5LXCIsXG4gIFwiQ1JBUFNcIixcbiAgXCJDUkFTSFwiLFxuICBcIkNSQVNTXCIsXG4gIFwiQ1JBVEVcIixcbiAgXCJDUkFWRVwiLFxuICBcIkNSQVdMXCIsXG4gIFwiQ1JBV1NcIixcbiAgXCJDUkFaRVwiLFxuICBcIkNSQVpZXCIsXG4gIFwiQ1JFQUtcIixcbiAgXCJDUkVBTVwiLFxuICBcIkNSRURPXCIsXG4gIFwiQ1JFRURcIixcbiAgXCJDUkVFS1wiLFxuICBcIkNSRUVMXCIsXG4gIFwiQ1JFRVBcIixcbiAgXCJDUkVNRVwiLFxuICBcIkNSRVBFXCIsXG4gIFwiQ1JFUFRcIixcbiAgXCJDUkVTU1wiLFxuICBcIkNSRVNUXCIsXG4gIFwiQ1JFV1NcIixcbiAgXCJDUklCU1wiLFxuICBcIkNSSUNLXCIsXG4gIFwiQ1JJRURcIixcbiAgXCJDUklFUlwiLFxuICBcIkNSSUVTXCIsXG4gIFwiQ1JJTUVcIixcbiAgXCJDUklNUFwiLFxuICBcIkNSSVNQXCIsXG4gIFwiQ1JJVFNcIixcbiAgXCJDUk9BS1wiLFxuICBcIkNST0NLXCIsXG4gIFwiQ1JPQ1NcIixcbiAgXCJDUk9GVFwiLFxuICBcIkNST05FXCIsXG4gIFwiQ1JPTllcIixcbiAgXCJDUk9PS1wiLFxuICBcIkNST09OXCIsXG4gIFwiQ1JPUFNcIixcbiAgXCJDUk9TU1wiLFxuICBcIkNST1VQXCIsXG4gIFwiQ1JPV0RcIixcbiAgXCJDUk9XTlwiLFxuICBcIkNST1dTXCIsXG4gIFwiQ1JVREVcIixcbiAgXCJDUlVEU1wiLFxuICBcIkNSVUVMXCIsXG4gIFwiQ1JVRVRcIixcbiAgXCJDUlVGVFwiLFxuICBcIkNSVU1CXCIsXG4gIFwiQ1JVTVBcIixcbiAgXCJDUlVTRVwiLFxuICBcIkNSVVNIXCIsXG4gIFwiQ1JVU1RcIixcbiAgXCJDUllQVFwiLFxuICBcIkNVQkJZXCIsXG4gIFwiQ1VCRURcIixcbiAgXCJDVUJFU1wiLFxuICBcIkNVQklDXCIsXG4gIFwiQ1VCSVRcIixcbiAgXCJDVUZGU1wiLFxuICBcIkNVS0VTXCIsXG4gIFwiQ1VMTFNcIixcbiAgXCJDVUxQQVwiLFxuICBcIkNVTFRTXCIsXG4gIFwiQ1VNSU5cIixcbiAgXCJDVU5UU1wiLFxuICBcIkNVUFBBXCIsXG4gIFwiQ1VQUFlcIixcbiAgXCJDVVJCU1wiLFxuICBcIkNVUkRTXCIsXG4gIFwiQ1VSRURcIixcbiAgXCJDVVJFU1wiLFxuICBcIkNVUklFXCIsXG4gIFwiQ1VSSU9cIixcbiAgXCJDVVJMU1wiLFxuICBcIkNVUkxZXCIsXG4gIFwiQ1VSUllcIixcbiAgXCJDVVJTRVwiLFxuICBcIkNVUlZFXCIsXG4gIFwiQ1VSVllcIixcbiAgXCJDVVNIWVwiLFxuICBcIkNVU1BTXCIsXG4gIFwiQ1VURVJcIixcbiAgXCJDVVRJRVwiLFxuICBcIkNVVFVQXCIsXG4gIFwiQ1lDQURcIixcbiAgXCJDWUNMRVwiLFxuICBcIkNZTklDXCIsXG4gIFwiQ1lTVFNcIixcbiAgXCJDWkFSU1wiLFxuICBcIkRBQ0hBXCIsXG4gIFwiREFERFlcIixcbiAgXCJEQURPU1wiLFxuICBcIkRBRkZZXCIsXG4gIFwiREFJTFlcIixcbiAgXCJEQUlSWVwiLFxuICBcIkRBSVNZXCIsXG4gIFwiREFMRVNcIixcbiAgXCJEQUxMWVwiLFxuICBcIkRBTUVTXCIsXG4gIFwiREFNTlNcIixcbiAgXCJEQU1QU1wiLFxuICBcIkRBTkNFXCIsXG4gIFwiREFORFlcIixcbiAgXCJEQVJFRFwiLFxuICBcIkRBUkVTXCIsXG4gIFwiREFSS1NcIixcbiAgXCJEQVJLWVwiLFxuICBcIkRBUk5TXCIsXG4gIFwiREFSVFNcIixcbiAgXCJEQVRFRFwiLFxuICBcIkRBVEVSXCIsXG4gIFwiREFURVNcIixcbiAgXCJEQVRVTVwiLFxuICBcIkRBVUJTXCIsXG4gIFwiREFVTlRcIixcbiAgXCJEQVZJVFwiLFxuICBcIkRBV05TXCIsXG4gIFwiREFaRURcIixcbiAgXCJEQVpFU1wiLFxuICBcIkRFQUxTXCIsXG4gIFwiREVBTFRcIixcbiAgXCJERUFOU1wiLFxuICBcIkRFQVJTXCIsXG4gIFwiREVBVEhcIixcbiAgXCJERUJBUlwiLFxuICBcIkRFQklUXCIsXG4gIFwiREVCVFNcIixcbiAgXCJERUJVR1wiLFxuICBcIkRFQlVUXCIsXG4gIFwiREVDQUZcIixcbiAgXCJERUNBTFwiLFxuICBcIkRFQ0FZXCIsXG4gIFwiREVDS1NcIixcbiAgXCJERUNPUlwiLFxuICBcIkRFQ09ZXCIsXG4gIFwiREVDUllcIixcbiAgXCJERUVEU1wiLFxuICBcIkRFRU1TXCIsXG4gIFwiREVFUFNcIixcbiAgXCJERUZFUlwiLFxuICBcIkRFR0FTXCIsXG4gIFwiREVJRllcIixcbiAgXCJERUlHTlwiLFxuICBcIkRFSVNNXCIsXG4gIFwiREVJVFlcIixcbiAgXCJERUxBWVwiLFxuICBcIkRFTEZUXCIsXG4gIFwiREVMSVNcIixcbiAgXCJERUxMU1wiLFxuICBcIkRFTFRBXCIsXG4gIFwiREVMVkVcIixcbiAgXCJERU1JVFwiLFxuICBcIkRFTU9OXCIsXG4gIFwiREVNT1NcIixcbiAgXCJERU1VUlwiLFxuICBcIkRFTklNXCIsXG4gIFwiREVOU0VcIixcbiAgXCJERU5UU1wiLFxuICBcIkRFUE9UXCIsXG4gIFwiREVQVEhcIixcbiAgXCJERVJCWVwiLFxuICBcIkRFU0VYXCIsXG4gIFwiREVTS1NcIixcbiAgXCJERVRFUlwiLFxuICBcIkRFVUNFXCIsXG4gIFwiREVWSUxcIixcbiAgXCJERVdFRFwiLFxuICBcIkRIT1dTXCIsXG4gIFwiRElBTFNcIixcbiAgXCJESUFSWVwiLFxuICBcIkRJQVpPXCIsXG4gIFwiRElDRURcIixcbiAgXCJESUNFU1wiLFxuICBcIkRJQ0VZXCIsXG4gIFwiRElDS1NcIixcbiAgXCJESUNLWVwiLFxuICBcIkRJQ09UXCIsXG4gIFwiRElDVEFcIixcbiAgXCJESUREWVwiLFxuICBcIkRJRE9TXCIsXG4gIFwiRElEU1RcIixcbiAgXCJESUVUU1wiLFxuICBcIkRJR0lUXCIsXG4gIFwiRElLRURcIixcbiAgXCJESUtFU1wiLFxuICBcIkRJTERPXCIsXG4gIFwiRElMTFNcIixcbiAgXCJESUxMWVwiLFxuICBcIkRJTUVSXCIsXG4gIFwiRElNRVNcIixcbiAgXCJESU1MWVwiLFxuICBcIkRJTkFSXCIsXG4gIFwiRElORURcIixcbiAgXCJESU5FUlwiLFxuICBcIkRJTkVTXCIsXG4gIFwiRElOR09cIixcbiAgXCJESU5HU1wiLFxuICBcIkRJTkdZXCIsXG4gIFwiRElOS1NcIixcbiAgXCJESU5LWVwiLFxuICBcIkRJTlRTXCIsXG4gIFwiRElPREVcIixcbiAgXCJESVBQWVwiLFxuICBcIkRJUFNPXCIsXG4gIFwiRElSRVJcIixcbiAgXCJESVJHRVwiLFxuICBcIkRJUktTXCIsXG4gIFwiRElSVFlcIixcbiAgXCJESVNDT1wiLFxuICBcIkRJU0NTXCIsXG4gIFwiRElTSFlcIixcbiAgXCJESVNLU1wiLFxuICBcIkRJVENIXCIsXG4gIFwiRElUVE9cIixcbiAgXCJESVRUWVwiLFxuICBcIkRJVkFOXCIsXG4gIFwiRElWQVNcIixcbiAgXCJESVZFRFwiLFxuICBcIkRJVkVSXCIsXG4gIFwiRElWRVNcIixcbiAgXCJESVZPVFwiLFxuICBcIkRJVlZZXCIsXG4gIFwiRElaWllcIixcbiAgXCJESklOTlwiLFxuICBcIkRPQ0tTXCIsXG4gIFwiRE9ER0VcIixcbiAgXCJET0RHWVwiLFxuICBcIkRPRE9TXCIsXG4gIFwiRE9FUlNcIixcbiAgXCJET0VTVFwiLFxuICBcIkRPRVRIXCIsXG4gIFwiRE9GRlNcIixcbiAgXCJET0dFU1wiLFxuICBcIkRPR0dPXCIsXG4gIFwiRE9HR1lcIixcbiAgXCJET0dJRVwiLFxuICBcIkRPR01BXCIsXG4gIFwiRE9JTFlcIixcbiAgXCJET0lOR1wiLFxuICBcIkRPTENFXCIsXG4gIFwiRE9MRURcIixcbiAgXCJET0xFU1wiLFxuICBcIkRPTExTXCIsXG4gIFwiRE9MTFlcIixcbiAgXCJET0xPUlwiLFxuICBcIkRPTFRTXCIsXG4gIFwiRE9NRURcIixcbiAgXCJET01FU1wiLFxuICBcIkRPTkVFXCIsXG4gIFwiRE9OTkFcIixcbiAgXCJET05PUlwiLFxuICBcIkRPTlVUXCIsXG4gIFwiRE9PTVNcIixcbiAgXCJET09SU1wiLFxuICBcIkRPT1pZXCIsXG4gIFwiRE9QRURcIixcbiAgXCJET1BFU1wiLFxuICBcIkRPUEVZXCIsXG4gIFwiRE9SS1NcIixcbiAgXCJET1JLWVwiLFxuICBcIkRPUk1TXCIsXG4gIFwiRE9URURcIixcbiAgXCJET1RFU1wiLFxuICBcIkRPVFRZXCIsXG4gIFwiRE9VQlRcIixcbiAgXCJET1VHSFwiLFxuICBcIkRPVVNFXCIsXG4gIFwiRE9WRVNcIixcbiAgXCJET1dEWVwiLFxuICBcIkRPV0VMXCIsXG4gIFwiRE9XRVJcIixcbiAgXCJET1dOU1wiLFxuICBcIkRPV05ZXCIsXG4gIFwiRE9XUllcIixcbiAgXCJET1dTRVwiLFxuICBcIkRPWUVOXCIsXG4gIFwiRE9aRURcIixcbiAgXCJET1pFTlwiLFxuICBcIkRPWkVSXCIsXG4gIFwiRE9aRVNcIixcbiAgXCJEUkFGVFwiLFxuICBcIkRSQUdTXCIsXG4gIFwiRFJBSU5cIixcbiAgXCJEUkFLRVwiLFxuICBcIkRSQU1BXCIsXG4gIFwiRFJBTVNcIixcbiAgXCJEUkFOS1wiLFxuICBcIkRSQVBFXCIsXG4gIFwiRFJBV0xcIixcbiAgXCJEUkFXTlwiLFxuICBcIkRSQVdTXCIsXG4gIFwiRFJBWVNcIixcbiAgXCJEUkVBRFwiLFxuICBcIkRSRUFNXCIsXG4gIFwiRFJFQVJcIixcbiAgXCJEUkVDS1wiLFxuICBcIkRSRUdTXCIsXG4gIFwiRFJFU1NcIixcbiAgXCJEUklFRFwiLFxuICBcIkRSSUVSXCIsXG4gIFwiRFJJRVNcIixcbiAgXCJEUklGVFwiLFxuICBcIkRSSUxMXCIsXG4gIFwiRFJJTFlcIixcbiAgXCJEUklOS1wiLFxuICBcIkRSSVBTXCIsXG4gIFwiRFJJVkVcIixcbiAgXCJEUk9JRFwiLFxuICBcIkRST0xMXCIsXG4gIFwiRFJPTkVcIixcbiAgXCJEUk9PTFwiLFxuICBcIkRST09QXCIsXG4gIFwiRFJPUFNcIixcbiAgXCJEUk9TU1wiLFxuICBcIkRST1ZFXCIsXG4gIFwiRFJPV05cIixcbiAgXCJEUlVCU1wiLFxuICBcIkRSVUdTXCIsXG4gIFwiRFJVSURcIixcbiAgXCJEUlVNU1wiLFxuICBcIkRSVU5LXCIsXG4gIFwiRFJZQURcIixcbiAgXCJEUllFUlwiLFxuICBcIkRSWUxZXCIsXG4gIFwiRFVBTFNcIixcbiAgXCJEVUNBTFwiLFxuICBcIkRVQ0FUXCIsXG4gIFwiRFVDRVNcIixcbiAgXCJEVUNIWVwiLFxuICBcIkRVQ0tTXCIsXG4gIFwiRFVDS1lcIixcbiAgXCJEVUNUU1wiLFxuICBcIkRVREVTXCIsXG4gIFwiRFVFTFNcIixcbiAgXCJEVUVUU1wiLFxuICBcIkRVRkZTXCIsXG4gIFwiRFVLRVNcIixcbiAgXCJEVUxMU1wiLFxuICBcIkRVTExZXCIsXG4gIFwiRFVMU0VcIixcbiAgXCJEVU1NWVwiLFxuICBcIkRVTVBTXCIsXG4gIFwiRFVNUFlcIixcbiAgXCJEVU5DRVwiLFxuICBcIkRVTkVTXCIsXG4gIFwiRFVOR1NcIixcbiAgXCJEVU5OT1wiLFxuICBcIkRVT01PXCIsXG4gIFwiRFVQRURcIixcbiAgXCJEVVBFUlwiLFxuICBcIkRVUEVTXCIsXG4gIFwiRFVQTEVcIixcbiAgXCJEVVJTVFwiLFxuICBcIkRVU0tTXCIsXG4gIFwiRFVTS1lcIixcbiAgXCJEVVNUU1wiLFxuICBcIkRVU1RZXCIsXG4gIFwiRFVUQ0hcIixcbiAgXCJEVVZFVFwiLFxuICBcIkRXQVJGXCIsXG4gIFwiRFdFRUJcIixcbiAgXCJEV0VMTFwiLFxuICBcIkRXRUxUXCIsXG4gIFwiRFlBRFNcIixcbiAgXCJEWUVSU1wiLFxuICBcIkRZSU5HXCIsXG4gIFwiRFlLRVNcIixcbiAgXCJEWU5FU1wiLFxuICBcIkVBR0VSXCIsXG4gIFwiRUFHTEVcIixcbiAgXCJFQVJMU1wiLFxuICBcIkVBUkxZXCIsXG4gIFwiRUFSTlNcIixcbiAgXCJFQVJUSFwiLFxuICBcIkVBU0VEXCIsXG4gIFwiRUFTRUxcIixcbiAgXCJFQVNFU1wiLFxuICBcIkVBVEVOXCIsXG4gIFwiRUFURVJcIixcbiAgXCJFQVZFU1wiLFxuICBcIkVCQkVEXCIsXG4gIFwiRUJPTllcIixcbiAgXCJFQ0xBVFwiLFxuICBcIkVERU1BXCIsXG4gIFwiRURHRURcIixcbiAgXCJFREdFU1wiLFxuICBcIkVESUNUXCIsXG4gIFwiRURJRllcIixcbiAgXCJFRElUU1wiLFxuICBcIkVEVUNFXCIsXG4gIFwiRUVSSUVcIixcbiAgXCJFR0FEU1wiLFxuICBcIkVHR0VEXCIsXG4gIFwiRUdHRVJcIixcbiAgXCJFR1JFVFwiLFxuICBcIkVJREVSXCIsXG4gIFwiRUlHSFRcIixcbiAgXCJFSkVDVFwiLFxuICBcIkVLSU5HXCIsXG4gIFwiRUxBTkRcIixcbiAgXCJFTEFURVwiLFxuICBcIkVMQk9XXCIsXG4gIFwiRUxERVJcIixcbiAgXCJFTEVDVFwiLFxuICBcIkVMRUdZXCIsXG4gIFwiRUxGSU5cIixcbiAgXCJFTElERVwiLFxuICBcIkVMSVRFXCIsXG4gIFwiRUxPUEVcIixcbiAgXCJFTFVERVwiLFxuICBcIkVMVkVTXCIsXG4gIFwiRU1BSUxcIixcbiAgXCJFTUJFRFwiLFxuICBcIkVNQkVSXCIsXG4gIFwiRU1DRUVcIixcbiAgXCJFTUVORFwiLFxuICBcIkVNRVJZXCIsXG4gIFwiRU1JUlNcIixcbiAgXCJFTUlUU1wiLFxuICBcIkVNT1RFXCIsXG4gIFwiRU1QVFlcIixcbiAgXCJFTkFDVFwiLFxuICBcIkVOREVEXCIsXG4gIFwiRU5ET1dcIixcbiAgXCJFTkRVRVwiLFxuICBcIkVORU1BXCIsXG4gIFwiRU5FTVlcIixcbiAgXCJFTkpPWVwiLFxuICBcIkVOTlVJXCIsXG4gIFwiRU5ST0xcIixcbiAgXCJFTlNVRVwiLFxuICBcIkVOVEVSXCIsXG4gIFwiRU5UUllcIixcbiAgXCJFTlZPSVwiLFxuICBcIkVOVk9ZXCIsXG4gIFwiRVBBQ1RcIixcbiAgXCJFUEVFU1wiLFxuICBcIkVQSEFIXCIsXG4gIFwiRVBIT0RcIixcbiAgXCJFUElDU1wiLFxuICBcIkVQT0NIXCIsXG4gIFwiRVBPWFlcIixcbiAgXCJFUVVBTFwiLFxuICBcIkVRVUlQXCIsXG4gIFwiRVJBU0VcIixcbiAgXCJFUkVDVFwiLFxuICBcIkVST0RFXCIsXG4gIFwiRVJSRURcIixcbiAgXCJFUlJPUlwiLFxuICBcIkVSVUNUXCIsXG4gIFwiRVJVUFRcIixcbiAgXCJFU1NBWVwiLFxuICBcIkVTU0VTXCIsXG4gIFwiRVNURVJcIixcbiAgXCJFU1RPUFwiLFxuICBcIkVUSEVSXCIsXG4gIFwiRVRISUNcIixcbiAgXCJFVEhPU1wiLFxuICBcIkVUSFlMXCIsXG4gIFwiRVRVREVcIixcbiAgXCJFVkFERVwiLFxuICBcIkVWRU5TXCIsXG4gIFwiRVZFTlRcIixcbiAgXCJFVklDVFwiLFxuICBcIkVWSUxTXCIsXG4gIFwiRVZPS0VcIixcbiAgXCJFWEFDVFwiLFxuICBcIkVYQUxUXCIsXG4gIFwiRVhBTVNcIixcbiAgXCJFWENFTFwiLFxuICBcIkVYRUFUXCIsXG4gIFwiRVhFQ1NcIixcbiAgXCJFWEVSVFwiLFxuICBcIkVYSUxFXCIsXG4gIFwiRVhJU1RcIixcbiAgXCJFWElUU1wiLFxuICBcIkVYUEFUXCIsXG4gIFwiRVhQRUxcIixcbiAgXCJFWFBPU1wiLFxuICBcIkVYVE9MXCIsXG4gIFwiRVhUUkFcIixcbiAgXCJFWFVERVwiLFxuICBcIkVYVUxUXCIsXG4gIFwiRVhVUkJcIixcbiAgXCJFWUlOR1wiLFxuICBcIkVZUklFXCIsXG4gIFwiRkFCTEVcIixcbiAgXCJGQUNFRFwiLFxuICBcIkZBQ0VSXCIsXG4gIFwiRkFDRVNcIixcbiAgXCJGQUNFVFwiLFxuICBcIkZBQ1RTXCIsXG4gIFwiRkFERFlcIixcbiAgXCJGQURFRFwiLFxuICBcIkZBREVSXCIsXG4gIFwiRkFERVNcIixcbiAgXCJGQUVSWVwiLFxuICBcIkZBR09UXCIsXG4gIFwiRkFJTFNcIixcbiAgXCJGQUlOVFwiLFxuICBcIkZBSVJTXCIsXG4gIFwiRkFJUllcIixcbiAgXCJGQUlUSFwiLFxuICBcIkZBS0VEXCIsXG4gIFwiRkFLRVJcIixcbiAgXCJGQUtFU1wiLFxuICBcIkZBS0lSXCIsXG4gIFwiRkFMTFNcIixcbiAgXCJGQUxTRVwiLFxuICBcIkZBTUVEXCIsXG4gIFwiRkFOQ1lcIixcbiAgXCJGQU5HU1wiLFxuICBcIkZBTk5ZXCIsXG4gIFwiRkFSQURcIixcbiAgXCJGQVJDRVwiLFxuICBcIkZBUkVEXCIsXG4gIFwiRkFSRVNcIixcbiAgXCJGQVJNU1wiLFxuICBcIkZBUlRTXCIsXG4gIFwiRkFTVFNcIixcbiAgXCJGQVRBTFwiLFxuICBcIkZBVEVEXCIsXG4gIFwiRkFURVNcIixcbiAgXCJGQVRTT1wiLFxuICBcIkZBVFRZXCIsXG4gIFwiRkFUV0FcIixcbiAgXCJGQVVMVFwiLFxuICBcIkZBVU5BXCIsXG4gIFwiRkFVTlNcIixcbiAgXCJGQVZPUlwiLFxuICBcIkZBV05TXCIsXG4gIFwiRkFYRURcIixcbiAgXCJGQVhFU1wiLFxuICBcIkZBWkVEXCIsXG4gIFwiRkFaRVNcIixcbiAgXCJGRUFSU1wiLFxuICBcIkZFQVNUXCIsXG4gIFwiRkVBVFNcIixcbiAgXCJGRUNBTFwiLFxuICBcIkZFQ0VTXCIsXG4gIFwiRkVFRFNcIixcbiAgXCJGRUVMU1wiLFxuICBcIkZFSUdOXCIsXG4gIFwiRkVJTlRcIixcbiAgXCJGRUxMQVwiLFxuICBcIkZFTExTXCIsXG4gIFwiRkVMT05cIixcbiAgXCJGRUxUU1wiLFxuICBcIkZFTU1FXCIsXG4gIFwiRkVNVVJcIixcbiAgXCJGRU5DRVwiLFxuICBcIkZFTkRTXCIsXG4gIFwiRkVSQUxcIixcbiAgXCJGRVJNSVwiLFxuICBcIkZFUk5TXCIsXG4gIFwiRkVSUllcIixcbiAgXCJGRVRBTFwiLFxuICBcIkZFVENIXCIsXG4gIFwiRkVURURcIixcbiAgXCJGRVRFU1wiLFxuICBcIkZFVElEXCIsXG4gIFwiRkVUT1JcIixcbiAgXCJGRVRVU1wiLFxuICBcIkZFVURTXCIsXG4gIFwiRkVVRURcIixcbiAgXCJGRVZFUlwiLFxuICBcIkZJQVRTXCIsXG4gIFwiRklCRVJcIixcbiAgXCJGSUJSRVwiLFxuICBcIkZJQ0hFXCIsXG4gIFwiRklDSFVcIixcbiAgXCJGSUVGU1wiLFxuICBcIkZJRUxEXCIsXG4gIFwiRklFTkRcIixcbiAgXCJGSUVSWVwiLFxuICBcIkZJRkVTXCIsXG4gIFwiRklGVEhcIixcbiAgXCJGSUZUWVwiLFxuICBcIkZJR0hUXCIsXG4gIFwiRklMQ0hcIixcbiAgXCJGSUxFRFwiLFxuICBcIkZJTEVTXCIsXG4gIFwiRklMRVRcIixcbiAgXCJGSUxMU1wiLFxuICBcIkZJTExZXCIsXG4gIFwiRklMTVNcIixcbiAgXCJGSUxNWVwiLFxuICBcIkZJTFRIXCIsXG4gIFwiRklOQUxcIixcbiAgXCJGSU5DSFwiLFxuICBcIkZJTkRTXCIsXG4gIFwiRklORURcIixcbiAgXCJGSU5FUlwiLFxuICBcIkZJTkVTXCIsXG4gIFwiRklOSVNcIixcbiAgXCJGSU5LU1wiLFxuICBcIkZJTk5ZXCIsXG4gIFwiRklPUkRcIixcbiAgXCJGSVJFRFwiLFxuICBcIkZJUkVTXCIsXG4gIFwiRklSTVNcIixcbiAgXCJGSVJTVFwiLFxuICBcIkZJUlRIXCIsXG4gIFwiRklTSFlcIixcbiAgXCJGSVNUU1wiLFxuICBcIkZJVkVSXCIsXG4gIFwiRklWRVNcIixcbiAgXCJGSVhFRFwiLFxuICBcIkZJWEVSXCIsXG4gIFwiRklYRVNcIixcbiAgXCJGSVpaWVwiLFxuICBcIkZKT1JEXCIsXG4gIFwiRkxBQ0tcIixcbiAgXCJGTEFHU1wiLFxuICBcIkZMQUlMXCIsXG4gIFwiRkxBSVJcIixcbiAgXCJGTEFLRVwiLFxuICBcIkZMQUtZXCIsXG4gIFwiRkxBTUVcIixcbiAgXCJGTEFNU1wiLFxuICBcIkZMQU5LXCIsXG4gIFwiRkxBUkVcIixcbiAgXCJGTEFTSFwiLFxuICBcIkZMQVNLXCIsXG4gIFwiRkxBVFNcIixcbiAgXCJGTEFXU1wiLFxuICBcIkZMQVlTXCIsXG4gIFwiRkxFQVNcIixcbiAgXCJGTEVDS1wiLFxuICBcIkZMRUVTXCIsXG4gIFwiRkxFRVRcIixcbiAgXCJGTEVTSFwiLFxuICBcIkZMSUNLXCIsXG4gIFwiRkxJQ1NcIixcbiAgXCJGTElFRFwiLFxuICBcIkZMSUVSXCIsXG4gIFwiRkxJRVNcIixcbiAgXCJGTElOR1wiLFxuICBcIkZMSU5UXCIsXG4gIFwiRkxJUFNcIixcbiAgXCJGTElSVFwiLFxuICBcIkZMSVRTXCIsXG4gIFwiRkxPQVRcIixcbiAgXCJGTE9DS1wiLFxuICBcIkZMT0VTXCIsXG4gIFwiRkxPR1NcIixcbiAgXCJGTE9PRFwiLFxuICBcIkZMT09SXCIsXG4gIFwiRkxPUFNcIixcbiAgXCJGTE9SQVwiLFxuICBcIkZMT1NTXCIsXG4gIFwiRkxPVVJcIixcbiAgXCJGTE9VVFwiLFxuICBcIkZMT1dOXCIsXG4gIFwiRkxPV1NcIixcbiAgXCJGTFVCU1wiLFxuICBcIkZMVUVTXCIsXG4gIFwiRkxVRkZcIixcbiAgXCJGTFVJRFwiLFxuICBcIkZMVUtFXCIsXG4gIFwiRkxVS1lcIixcbiAgXCJGTFVNRVwiLFxuICBcIkZMVU5HXCIsXG4gIFwiRkxVTktcIixcbiAgXCJGTFVTSFwiLFxuICBcIkZMVVRFXCIsXG4gIFwiRkxZQllcIixcbiAgXCJGTFlFUlwiLFxuICBcIkZPQUxTXCIsXG4gIFwiRk9BTVNcIixcbiAgXCJGT0FNWVwiLFxuICBcIkZPQ0FMXCIsXG4gIFwiRk9DVVNcIixcbiAgXCJGT0dFWVwiLFxuICBcIkZPR0dZXCIsXG4gIFwiRk9JTFNcIixcbiAgXCJGT0lTVFwiLFxuICBcIkZPTERTXCIsXG4gIFwiRk9MSUFcIixcbiAgXCJGT0xJT1wiLFxuICBcIkZPTEtTXCIsXG4gIFwiRk9MS1lcIixcbiAgXCJGT0xMWVwiLFxuICBcIkZPTkRVXCIsXG4gIFwiRk9OVFNcIixcbiAgXCJGT09EU1wiLFxuICBcIkZPT0xTXCIsXG4gIFwiRk9PVFNcIixcbiAgXCJGT1JBWVwiLFxuICBcIkZPUkNFXCIsXG4gIFwiRk9SRFNcIixcbiAgXCJGT1JHRVwiLFxuICBcIkZPUkdPXCIsXG4gIFwiRk9SS1NcIixcbiAgXCJGT1JNU1wiLFxuICBcIkZPUlRFXCIsXG4gIFwiRk9SVEhcIixcbiAgXCJGT1JUU1wiLFxuICBcIkZPUlRZXCIsXG4gIFwiRk9SVU1cIixcbiAgXCJGT1NTQVwiLFxuICBcIkZPU1NFXCIsXG4gIFwiRk9VTFNcIixcbiAgXCJGT1VORFwiLFxuICBcIkZPVU5UXCIsXG4gIFwiRk9VUlNcIixcbiAgXCJGT1ZFQVwiLFxuICBcIkZPV0xTXCIsXG4gIFwiRk9YRURcIixcbiAgXCJGT1hFU1wiLFxuICBcIkZPWUVSXCIsXG4gIFwiRlJBSUxcIixcbiAgXCJGUkFNRVwiLFxuICBcIkZSQU5DXCIsXG4gIFwiRlJBTktcIixcbiAgXCJGUkFUU1wiLFxuICBcIkZSQVVEXCIsXG4gIFwiRlJBWVNcIixcbiAgXCJGUkVBS1wiLFxuICBcIkZSRUVEXCIsXG4gIFwiRlJFRVJcIixcbiAgXCJGUkVFU1wiLFxuICBcIkZSRVNIXCIsXG4gIFwiRlJFVFNcIixcbiAgXCJGUklBUlwiLFxuICBcIkZSSUVEXCIsXG4gIFwiRlJJRVJcIixcbiAgXCJGUklFU1wiLFxuICBcIkZSSUdTXCIsXG4gIFwiRlJJTExcIixcbiAgXCJGUklTS1wiLFxuICBcIkZSSVpaXCIsXG4gIFwiRlJPQ0tcIixcbiAgXCJGUk9HU1wiLFxuICBcIkZST05EXCIsXG4gIFwiRlJPTlRcIixcbiAgXCJGUk9TSFwiLFxuICBcIkZST1NUXCIsXG4gIFwiRlJPVEhcIixcbiAgXCJGUk9XTlwiLFxuICBcIkZST1pFXCIsXG4gIFwiRlJVSVRcIixcbiAgXCJGUlVNUFwiLFxuICBcIkZSWUVSXCIsXG4gIFwiRlVDS1NcIixcbiAgXCJGVURHRVwiLFxuICBcIkZVRUxTXCIsXG4gIFwiRlVHQUxcIixcbiAgXCJGVUdVRVwiLFxuICBcIkZVTExTXCIsXG4gIFwiRlVMTFlcIixcbiAgXCJGVU1FRFwiLFxuICBcIkZVTUVTXCIsXG4gIFwiRlVORFNcIixcbiAgXCJGVU5HSVwiLFxuICBcIkZVTkdPXCIsXG4gIFwiRlVOS1NcIixcbiAgXCJGVU5LWVwiLFxuICBcIkZVTk5ZXCIsXG4gIFwiRlVSTFNcIixcbiAgXCJGVVJPUlwiLFxuICBcIkZVUlJZXCIsXG4gIFwiRlVSWkVcIixcbiAgXCJGVVNFRFwiLFxuICBcIkZVU0VFXCIsXG4gIFwiRlVTRVNcIixcbiAgXCJGVVNTWVwiLFxuICBcIkZVU1RZXCIsXG4gIFwiRlVUT05cIixcbiAgXCJGVVpFRFwiLFxuICBcIkZVWkVTXCIsXG4gIFwiRlVaWllcIixcbiAgXCJHQUJCWVwiLFxuICBcIkdBQkxFXCIsXG4gIFwiR0FGRkVcIixcbiAgXCJHQUZGU1wiLFxuICBcIkdBR0VTXCIsXG4gIFwiR0FJTFlcIixcbiAgXCJHQUlOU1wiLFxuICBcIkdBSVRTXCIsXG4gIFwiR0FMQVNcIixcbiAgXCJHQUxFU1wiLFxuICBcIkdBTExTXCIsXG4gIFwiR0FNQkFcIixcbiAgXCJHQU1FRFwiLFxuICBcIkdBTUVSXCIsXG4gIFwiR0FNRVNcIixcbiAgXCJHQU1FWVwiLFxuICBcIkdBTUlOXCIsXG4gIFwiR0FNTUFcIixcbiAgXCJHQU1VVFwiLFxuICBcIkdBTkVGXCIsXG4gIFwiR0FOR1NcIixcbiAgXCJHQU9MU1wiLFxuICBcIkdBUEVEXCIsXG4gIFwiR0FQRVJcIixcbiAgXCJHQVBFU1wiLFxuICBcIkdBUkJTXCIsXG4gIFwiR0FTRVNcIixcbiAgXCJHQVNQU1wiLFxuICBcIkdBU1NZXCIsXG4gIFwiR0FURURcIixcbiAgXCJHQVRFU1wiLFxuICBcIkdBVE9SXCIsXG4gIFwiR0FVRFlcIixcbiAgXCJHQVVHRVwiLFxuICBcIkdBVU5UXCIsXG4gIFwiR0FVU1NcIixcbiAgXCJHQVVaRVwiLFxuICBcIkdBVVpZXCIsXG4gIFwiR0FWRUxcIixcbiAgXCJHQVdLU1wiLFxuICBcIkdBV0tZXCIsXG4gIFwiR0FZRVJcIixcbiAgXCJHQVpFRFwiLFxuICBcIkdBWkVTXCIsXG4gIFwiR0VBUlNcIixcbiAgXCJHRUNLT1wiLFxuICBcIkdFRUtTXCIsXG4gIFwiR0VFU0VcIixcbiAgXCJHRUxEU1wiLFxuICBcIkdFTkVTXCIsXG4gIFwiR0VORVRcIixcbiAgXCJHRU5JRVwiLFxuICBcIkdFTklJXCIsXG4gIFwiR0VOUkVcIixcbiAgXCJHRU5UU1wiLFxuICBcIkdFTlVTXCIsXG4gIFwiR0VPREVcIixcbiAgXCJHRU9JRFwiLFxuICBcIkdFUk1TXCIsXG4gIFwiR0VTU09cIixcbiAgXCJHRVRVUFwiLFxuICBcIkdIT1NUXCIsXG4gIFwiR0hPVUxcIixcbiAgXCJHSUFOVFwiLFxuICBcIkdJQkVEXCIsXG4gIFwiR0lCRVNcIixcbiAgXCJHSUREWVwiLFxuICBcIkdJRlRTXCIsXG4gIFwiR0lHVUVcIixcbiAgXCJHSUxEU1wiLFxuICBcIkdJTExTXCIsXG4gIFwiR0lMVFNcIixcbiAgXCJHSU1NRVwiLFxuICBcIkdJTVBTXCIsXG4gIFwiR0lQU1lcIixcbiAgXCJHSVJEU1wiLFxuICBcIkdJUkxTXCIsXG4gIFwiR0lSTFlcIixcbiAgXCJHSVJPU1wiLFxuICBcIkdJUlRIXCIsXG4gIFwiR0lSVFNcIixcbiAgXCJHSVNNT1wiLFxuICBcIkdJU1RTXCIsXG4gIFwiR0lWRU5cIixcbiAgXCJHSVZFUlwiLFxuICBcIkdJVkVTXCIsXG4gIFwiR0laTU9cIixcbiAgXCJHTEFERVwiLFxuICBcIkdMQURTXCIsXG4gIFwiR0xBTkRcIixcbiAgXCJHTEFOU1wiLFxuICBcIkdMQVJFXCIsXG4gIFwiR0xBU1NcIixcbiAgXCJHTEFaRVwiLFxuICBcIkdMRUFNXCIsXG4gIFwiR0xFQU5cIixcbiAgXCJHTEVCRVwiLFxuICBcIkdMRUVTXCIsXG4gIFwiR0xFTlNcIixcbiAgXCJHTElERVwiLFxuICBcIkdMSU5UXCIsXG4gIFwiR0xJVFpcIixcbiAgXCJHTE9BVFwiLFxuICBcIkdMT0JFXCIsXG4gIFwiR0xPQlNcIixcbiAgXCJHTE9NU1wiLFxuICBcIkdMT09NXCIsXG4gIFwiR0xPUllcIixcbiAgXCJHTE9TU1wiLFxuICBcIkdMT1ZFXCIsXG4gIFwiR0xPV1NcIixcbiAgXCJHTFVFRFwiLFxuICBcIkdMVUVTXCIsXG4gIFwiR0xVRVlcIixcbiAgXCJHTFVPTlwiLFxuICBcIkdMVVRTXCIsXG4gIFwiR0xZUEhcIixcbiAgXCJHTkFSTFwiLFxuICBcIkdOQVNIXCIsXG4gIFwiR05BVFNcIixcbiAgXCJHTkFXU1wiLFxuICBcIkdOT01FXCIsXG4gIFwiR09BRFNcIixcbiAgXCJHT0FMU1wiLFxuICBcIkdPQVRTXCIsXG4gIFwiR09ETFlcIixcbiAgXCJHT0VSU1wiLFxuICBcIkdPRVNUXCIsXG4gIFwiR09FVEhcIixcbiAgXCJHT0ZFUlwiLFxuICBcIkdPSU5HXCIsXG4gIFwiR09MRFNcIixcbiAgXCJHT0xFTVwiLFxuICBcIkdPTEZTXCIsXG4gIFwiR09MTFlcIixcbiAgXCJHT05BRFwiLFxuICBcIkdPTkVSXCIsXG4gIFwiR09OR1NcIixcbiAgXCJHT05aT1wiLFxuICBcIkdPT0RTXCIsXG4gIFwiR09PRFlcIixcbiAgXCJHT09FWVwiLFxuICBcIkdPT0ZTXCIsXG4gIFwiR09PRllcIixcbiAgXCJHT09LU1wiLFxuICBcIkdPT05TXCIsXG4gIFwiR09PU0VcIixcbiAgXCJHT09TWVwiLFxuICBcIkdPUkVEXCIsXG4gIFwiR09SRVNcIixcbiAgXCJHT1JTRVwiLFxuICBcIkdPVEhTXCIsXG4gIFwiR09VREFcIixcbiAgXCJHT1VHRVwiLFxuICBcIkdPVVJEXCIsXG4gIFwiR09VVFNcIixcbiAgXCJHT1VUWVwiLFxuICBcIkdPV05TXCIsXG4gIFwiR09ZSU1cIixcbiAgXCJHUkFCU1wiLFxuICBcIkdSQUNFXCIsXG4gIFwiR1JBREVcIixcbiAgXCJHUkFEU1wiLFxuICBcIkdSQUZUXCIsXG4gIFwiR1JBSUxcIixcbiAgXCJHUkFJTlwiLFxuICBcIkdSQU1TXCIsXG4gIFwiR1JBTkRcIixcbiAgXCJHUkFOVFwiLFxuICBcIkdSQVBFXCIsXG4gIFwiR1JBUEhcIixcbiAgXCJHUkFTUFwiLFxuICBcIkdSQVNTXCIsXG4gIFwiR1JBVEVcIixcbiAgXCJHUkFWRVwiLFxuICBcIkdSQVZZXCIsXG4gIFwiR1JBWVNcIixcbiAgXCJHUkFaRVwiLFxuICBcIkdSRUFUXCIsXG4gIFwiR1JFQkVcIixcbiAgXCJHUkVFRFwiLFxuICBcIkdSRUVLXCIsXG4gIFwiR1JFRU5cIixcbiAgXCJHUkVFVFwiLFxuICBcIkdSRVlTXCIsXG4gIFwiR1JJRFNcIixcbiAgXCJHUklFRlwiLFxuICBcIkdSSUZUXCIsXG4gIFwiR1JJTExcIixcbiAgXCJHUklNRVwiLFxuICBcIkdSSU1ZXCIsXG4gIFwiR1JJTkRcIixcbiAgXCJHUklOU1wiLFxuICBcIkdSSVBFXCIsXG4gIFwiR1JJUFNcIixcbiAgXCJHUklTVFwiLFxuICBcIkdSSVRTXCIsXG4gIFwiR1JPQU5cIixcbiAgXCJHUk9BVFwiLFxuICBcIkdST0RZXCIsXG4gIFwiR1JPR1NcIixcbiAgXCJHUk9JTlwiLFxuICBcIkdST0tTXCIsXG4gIFwiR1JPT01cIixcbiAgXCJHUk9QRVwiLFxuICBcIkdST1NTXCIsXG4gIFwiR1JPVVBcIixcbiAgXCJHUk9VVFwiLFxuICBcIkdST1ZFXCIsXG4gIFwiR1JPV0xcIixcbiAgXCJHUk9XTlwiLFxuICBcIkdST1dTXCIsXG4gIFwiR1JVQlNcIixcbiAgXCJHUlVFTFwiLFxuICBcIkdSVUZGXCIsXG4gIFwiR1JVTVBcIixcbiAgXCJHUlVOVFwiLFxuICBcIkdVQU5PXCIsXG4gIFwiR1VBUkRcIixcbiAgXCJHVUFWQVwiLFxuICBcIkdVRVNTXCIsXG4gIFwiR1VFU1RcIixcbiAgXCJHVUlERVwiLFxuICBcIkdVSUxEXCIsXG4gIFwiR1VJTEVcIixcbiAgXCJHVUlMVFwiLFxuICBcIkdVSVNFXCIsXG4gIFwiR1VMQUdcIixcbiAgXCJHVUxDSFwiLFxuICBcIkdVTEVTXCIsXG4gIFwiR1VMRlNcIixcbiAgXCJHVUxMU1wiLFxuICBcIkdVTExZXCIsXG4gIFwiR1VMUFNcIixcbiAgXCJHVU1CT1wiLFxuICBcIkdVTU1ZXCIsXG4gIFwiR1VOS1lcIixcbiAgXCJHVU5OWVwiLFxuICBcIkdVUFBZXCIsXG4gIFwiR1VSVVNcIixcbiAgXCJHVVNIWVwiLFxuICBcIkdVU1RPXCIsXG4gIFwiR1VTVFNcIixcbiAgXCJHVVNUWVwiLFxuICBcIkdVVFNZXCIsXG4gIFwiR1VUVFlcIixcbiAgXCJHVVlFRFwiLFxuICBcIkdZUFNZXCIsXG4gIFwiR1lST1NcIixcbiAgXCJHWVZFU1wiLFxuICBcIkhBQklUXCIsXG4gIFwiSEFDS1NcIixcbiAgXCJIQURFU1wiLFxuICBcIkhBRFNUXCIsXG4gIFwiSEFGVFNcIixcbiAgXCJIQUlLVVwiLFxuICBcIkhBSUxTXCIsXG4gIFwiSEFJUlNcIixcbiAgXCJIQUlSWVwiLFxuICBcIkhBTEVEXCIsXG4gIFwiSEFMRVJcIixcbiAgXCJIQUxFU1wiLFxuICBcIkhBTExPXCIsXG4gIFwiSEFMTFNcIixcbiAgXCJIQUxNQVwiLFxuICBcIkhBTE9TXCIsXG4gIFwiSEFMVFNcIixcbiAgXCJIQUxWRVwiLFxuICBcIkhBTUVTXCIsXG4gIFwiSEFNTVlcIixcbiAgXCJIQU1aQVwiLFxuICBcIkhBTkRTXCIsXG4gIFwiSEFORFlcIixcbiAgXCJIQU5HU1wiLFxuICBcIkhBTktTXCIsXG4gIFwiSEFOS1lcIixcbiAgXCJIQVBMWVwiLFxuICBcIkhBUFBZXCIsXG4gIFwiSEFSRFlcIixcbiAgXCJIQVJFTVwiLFxuICBcIkhBUkVTXCIsXG4gIFwiSEFSS1NcIixcbiAgXCJIQVJNU1wiLFxuICBcIkhBUlBTXCIsXG4gIFwiSEFSUFlcIixcbiAgXCJIQVJSWVwiLFxuICBcIkhBUlNIXCIsXG4gIFwiSEFSVFNcIixcbiAgXCJIQVNQU1wiLFxuICBcIkhBU1RFXCIsXG4gIFwiSEFTVFlcIixcbiAgXCJIQVRDSFwiLFxuICBcIkhBVEVEXCIsXG4gIFwiSEFURVJcIixcbiAgXCJIQVRFU1wiLFxuICBcIkhBVUxTXCIsXG4gIFwiSEFVTlRcIixcbiAgXCJIQVZFTlwiLFxuICBcIkhBVkVTXCIsXG4gIFwiSEFWT0NcIixcbiAgXCJIQVdLU1wiLFxuICBcIkhBWkVEXCIsXG4gIFwiSEFaRUxcIixcbiAgXCJIQVpFUlwiLFxuICBcIkhBWkVTXCIsXG4gIFwiSEVBRFNcIixcbiAgXCJIRUFEWVwiLFxuICBcIkhFQUxTXCIsXG4gIFwiSEVBUFNcIixcbiAgXCJIRUFSRFwiLFxuICBcIkhFQVJTXCIsXG4gIFwiSEVBUlRcIixcbiAgXCJIRUFUSFwiLFxuICBcIkhFQVRTXCIsXG4gIFwiSEVBVkVcIixcbiAgXCJIRUFWWVwiLFxuICBcIkhFREdFXCIsXG4gIFwiSEVFRFNcIixcbiAgXCJIRUVMU1wiLFxuICBcIkhFRlRTXCIsXG4gIFwiSEVGVFlcIixcbiAgXCJIRUlHSFwiLFxuICBcIkhFSVJTXCIsXG4gIFwiSEVJU1RcIixcbiAgXCJIRUxJWFwiLFxuICBcIkhFTExPXCIsXG4gIFwiSEVMTVNcIixcbiAgXCJIRUxQU1wiLFxuICBcIkhFTkNFXCIsXG4gIFwiSEVOR0VcIixcbiAgXCJIRU5OQVwiLFxuICBcIkhFTlJZXCIsXG4gIFwiSEVSQlNcIixcbiAgXCJIRVJCWVwiLFxuICBcIkhFUkRTXCIsXG4gIFwiSEVST05cIixcbiAgXCJIRVJUWlwiLFxuICBcIkhFV0VEXCIsXG4gIFwiSEVXRVJcIixcbiAgXCJIRVhBRFwiLFxuICBcIkhFWEVEXCIsXG4gIFwiSEVYRVNcIixcbiAgXCJISUNLU1wiLFxuICBcIkhJREVTXCIsXG4gIFwiSElHSFNcIixcbiAgXCJISUtFRFwiLFxuICBcIkhJS0VSXCIsXG4gIFwiSElLRVNcIixcbiAgXCJISUxBUlwiLFxuICBcIkhJTExTXCIsXG4gIFwiSElMTFlcIixcbiAgXCJISUxUU1wiLFxuICBcIkhJTFVNXCIsXG4gIFwiSElNQk9cIixcbiAgXCJISU5EU1wiLFxuICBcIkhJTkdFXCIsXG4gIFwiSElOVFNcIixcbiAgXCJISVBQT1wiLFxuICBcIkhJUFBZXCIsXG4gIFwiSElSRURcIixcbiAgXCJISVJFU1wiLFxuICBcIkhJVENIXCIsXG4gIFwiSElWRURcIixcbiAgXCJISVZFU1wiLFxuICBcIkhPQUdZXCIsXG4gIFwiSE9BUkRcIixcbiAgXCJIT0FSWVwiLFxuICBcIkhPQkJZXCIsXG4gIFwiSE9CT1NcIixcbiAgXCJIT0NLU1wiLFxuICBcIkhPQ1VTXCIsXG4gIFwiSE9HQU5cIixcbiAgXCJIT0lTVFwiLFxuICBcIkhPS0VZXCIsXG4gIFwiSE9LVU1cIixcbiAgXCJIT0xEU1wiLFxuICBcIkhPTEVEXCIsXG4gIFwiSE9MRVNcIixcbiAgXCJIT0xMWVwiLFxuICBcIkhPTUVEXCIsXG4gIFwiSE9NRVJcIixcbiAgXCJIT01FU1wiLFxuICBcIkhPTUVZXCIsXG4gIFwiSE9NT1NcIixcbiAgXCJIT05FRFwiLFxuICBcIkhPTkVTXCIsXG4gIFwiSE9ORVlcIixcbiAgXCJIT05LU1wiLFxuICBcIkhPTktZXCIsXG4gIFwiSE9OT1JcIixcbiAgXCJIT09DSFwiLFxuICBcIkhPT0RTXCIsXG4gIFwiSE9PRVlcIixcbiAgXCJIT09GU1wiLFxuICBcIkhPT0tTXCIsXG4gIFwiSE9PS1lcIixcbiAgXCJIT09QU1wiLFxuICBcIkhPT1RTXCIsXG4gIFwiSE9QRURcIixcbiAgXCJIT1BFU1wiLFxuICBcIkhPUkRFXCIsXG4gIFwiSE9STlNcIixcbiAgXCJIT1JOWVwiLFxuICBcIkhPUlNFXCIsXG4gIFwiSE9SU1lcIixcbiAgXCJIT1NFRFwiLFxuICBcIkhPU0VTXCIsXG4gIFwiSE9TVFNcIixcbiAgXCJIT1RFTFwiLFxuICBcIkhPVExZXCIsXG4gIFwiSE9VTkRcIixcbiAgXCJIT1VSSVwiLFxuICBcIkhPVVJTXCIsXG4gIFwiSE9VU0VcIixcbiAgXCJIT1ZFTFwiLFxuICBcIkhPVkVSXCIsXG4gIFwiSE9XRFlcIixcbiAgXCJIT1dMU1wiLFxuICBcIkhVQkJZXCIsXG4gIFwiSFVGRlNcIixcbiAgXCJIVUZGWVwiLFxuICBcIkhVR0VSXCIsXG4gIFwiSFVMQVNcIixcbiAgXCJIVUxLU1wiLFxuICBcIkhVTExPXCIsXG4gIFwiSFVMTFNcIixcbiAgXCJIVU1BTlwiLFxuICBcIkhVTUlEXCIsXG4gIFwiSFVNT1JcIixcbiAgXCJIVU1QSFwiLFxuICBcIkhVTVBTXCIsXG4gIFwiSFVNUFlcIixcbiAgXCJIVU1VU1wiLFxuICBcIkhVTkNIXCIsXG4gIFwiSFVOS1NcIixcbiAgXCJIVU5LWVwiLFxuICBcIkhVTlRTXCIsXG4gIFwiSFVSTFNcIixcbiAgXCJIVVJSWVwiLFxuICBcIkhVUlRTXCIsXG4gIFwiSFVTS1NcIixcbiAgXCJIVVNLWVwiLFxuICBcIkhVU1NZXCIsXG4gIFwiSFVUQ0hcIixcbiAgXCJIVVpaQVwiLFxuICBcIkhZRFJBXCIsXG4gIFwiSFlEUk9cIixcbiAgXCJIWUVOQVwiLFxuICBcIkhZSU5HXCIsXG4gIFwiSFlNRU5cIixcbiAgXCJIWU1OU1wiLFxuICBcIkhZUEVEXCIsXG4gIFwiSFlQRVJcIixcbiAgXCJIWVBFU1wiLFxuICBcIkhZUE9TXCIsXG4gIFwiSUFNQlNcIixcbiAgXCJJQ0hPUlwiLFxuICBcIklDSUVSXCIsXG4gIFwiSUNJTkdcIixcbiAgXCJJQ09OU1wiLFxuICBcIklERUFMXCIsXG4gIFwiSURFQVNcIixcbiAgXCJJRElPTVwiLFxuICBcIklESU9UXCIsXG4gIFwiSURMRURcIixcbiAgXCJJRExFUlwiLFxuICBcIklETEVTXCIsXG4gIFwiSURPTFNcIixcbiAgXCJJRFlMTFwiLFxuICBcIklEWUxTXCIsXG4gIFwiSUdMT09cIixcbiAgXCJJS0FUU1wiLFxuICBcIklLT05TXCIsXG4gIFwiSUxFVU1cIixcbiAgXCJJTEVVU1wiLFxuICBcIklMSUFDXCIsXG4gIFwiSUxJVU1cIixcbiAgXCJJTUFHRVwiLFxuICBcIklNQUdPXCIsXG4gIFwiSU1BTVNcIixcbiAgXCJJTUJFRFwiLFxuICBcIklNQlVFXCIsXG4gIFwiSU1QRUxcIixcbiAgXCJJTVBMWVwiLFxuICBcIklNUFJPXCIsXG4gIFwiSU5BTkVcIixcbiAgXCJJTkFQVFwiLFxuICBcIklOQ1VSXCIsXG4gIFwiSU5ERVhcIixcbiAgXCJJTkRJRVwiLFxuICBcIklORVBUXCIsXG4gIFwiSU5FUlRcIixcbiAgXCJJTkZFUlwiLFxuICBcIklORklYXCIsXG4gIFwiSU5GUkFcIixcbiAgXCJJTkdPVFwiLFxuICBcIklOSlVOXCIsXG4gIFwiSU5LRURcIixcbiAgXCJJTkxBWVwiLFxuICBcIklOTEVUXCIsXG4gIFwiSU5ORVJcIixcbiAgXCJJTlBVVFwiLFxuICBcIklOU0VUXCIsXG4gIFwiSU5URVJcIixcbiAgXCJJTlRST1wiLFxuICBcIklOVVJFXCIsXG4gIFwiSU9OSUNcIixcbiAgXCJJT1RBU1wiLFxuICBcIklSQVRFXCIsXG4gIFwiSVJLRURcIixcbiAgXCJJUk9OU1wiLFxuICBcIklST05ZXCIsXG4gIFwiSVNMRVNcIixcbiAgXCJJU0xFVFwiLFxuICBcIklTU1VFXCIsXG4gIFwiSVRDSFlcIixcbiAgXCJJVEVNU1wiLFxuICBcIklWSUVEXCIsXG4gIFwiSVZJRVNcIixcbiAgXCJJVk9SWVwiLFxuICBcIklYTkFZXCIsXG4gIFwiSkFDS1NcIixcbiAgXCJKQURFRFwiLFxuICBcIkpBREVTXCIsXG4gIFwiSkFHR1lcIixcbiAgXCJKQUlMU1wiLFxuICBcIkpBTUJTXCIsXG4gIFwiSkFNTVlcIixcbiAgXCJKQU5FU1wiLFxuICBcIkpBUEFOXCIsXG4gIFwiSkFVTlRcIixcbiAgXCJKQVdFRFwiLFxuICBcIkpBWlpZXCIsXG4gIFwiSkVBTlNcIixcbiAgXCJKRUVQU1wiLFxuICBcIkpFRVJTXCIsXG4gIFwiSkVMTE9cIixcbiAgXCJKRUxMU1wiLFxuICBcIkpFTExZXCIsXG4gIFwiSkVOTllcIixcbiAgXCJKRVJLU1wiLFxuICBcIkpFUktZXCIsXG4gIFwiSkVSUllcIixcbiAgXCJKRVNUU1wiLFxuICBcIkpFVFRZXCIsXG4gIFwiSkVXRUxcIixcbiAgXCJKSUJFRFwiLFxuICBcIkpJQkVTXCIsXG4gIFwiSklGRlNcIixcbiAgXCJKSUZGWVwiLFxuICBcIkpJSEFEXCIsXG4gIFwiSklMVFNcIixcbiAgXCJKSU1NWVwiLFxuICBcIkpJTkdPXCIsXG4gIFwiSklOR1NcIixcbiAgXCJKSU5LU1wiLFxuICBcIkpJTk5TXCIsXG4gIFwiSklWRURcIixcbiAgXCJKSVZFU1wiLFxuICBcIkpPQ0tTXCIsXG4gIFwiSk9FWVNcIixcbiAgXCJKT0hOU1wiLFxuICBcIkpPSU5TXCIsXG4gIFwiSk9JTlRcIixcbiAgXCJKT0lTVFwiLFxuICBcIkpPS0VEXCIsXG4gIFwiSk9LRVJcIixcbiAgXCJKT0tFU1wiLFxuICBcIkpPTExZXCIsXG4gIFwiSk9MVFNcIixcbiAgXCJKT1VMRVwiLFxuICBcIkpPVVNUXCIsXG4gIFwiSk9XTFNcIixcbiAgXCJKT1lFRFwiLFxuICBcIkpVREdFXCIsXG4gIFwiSlVJQ0VcIixcbiAgXCJKVUlDWVwiLFxuICBcIkpVSlVTXCIsXG4gIFwiSlVLRVNcIixcbiAgXCJKVUxFUFwiLFxuICBcIkpVTUJPXCIsXG4gIFwiSlVNUFNcIixcbiAgXCJKVU1QWVwiLFxuICBcIkpVTkNPXCIsXG4gIFwiSlVOS1NcIixcbiAgXCJKVU5LWVwiLFxuICBcIkpVTlRBXCIsXG4gIFwiSlVST1JcIixcbiAgXCJKVVRFU1wiLFxuICBcIktBQk9CXCIsXG4gIFwiS0FQT0tcIixcbiAgXCJLQVBQQVwiLFxuICBcIktBUFVUXCIsXG4gIFwiS0FSQVRcIixcbiAgXCJLQVJNQVwiLFxuICBcIktBWUFLXCIsXG4gIFwiS0FZT1NcIixcbiAgXCJLQVpPT1wiLFxuICBcIktFQkFCXCIsXG4gIFwiS0VFTFNcIixcbiAgXCJLRUVOU1wiLFxuICBcIktFRVBTXCIsXG4gIFwiS0VGSVJcIixcbiAgXCJLRUxQU1wiLFxuICBcIktFTkFGXCIsXG4gIFwiS0VQSVNcIixcbiAgXCJLRVJCU1wiLFxuICBcIktFUkZTXCIsXG4gIFwiS0VSTlNcIixcbiAgXCJLRVRDSFwiLFxuICBcIktFWUVEXCIsXG4gIFwiS0hBS0lcIixcbiAgXCJLSEFOU1wiLFxuICBcIktJQ0tTXCIsXG4gIFwiS0lDS1lcIixcbiAgXCJLSURET1wiLFxuICBcIktJS0VTXCIsXG4gIFwiS0lMTFNcIixcbiAgXCJLSUxOU1wiLFxuICBcIktJTE9TXCIsXG4gIFwiS0lMVFNcIixcbiAgXCJLSU5EQVwiLFxuICBcIktJTkRTXCIsXG4gIFwiS0lOR1NcIixcbiAgXCJLSU5LU1wiLFxuICBcIktJTktZXCIsXG4gIFwiS0lPU0tcIixcbiAgXCJLSVJLU1wiLFxuICBcIktJVEhTXCIsXG4gIFwiS0lUVFlcIixcbiAgXCJLSVZBU1wiLFxuICBcIktJV0lTXCIsXG4gIFwiS0xJRUdcIixcbiAgXCJLTFVHRVwiLFxuICBcIktMVVRaXCIsXG4gIFwiS05BQ0tcIixcbiAgXCJLTkFWRVwiLFxuICBcIktORUFEXCIsXG4gIFwiS05FRURcIixcbiAgXCJLTkVFTFwiLFxuICBcIktORUVTXCIsXG4gIFwiS05FTExcIixcbiAgXCJLTkVMVFwiLFxuICBcIktOSUZFXCIsXG4gIFwiS05JU0hcIixcbiAgXCJLTklUU1wiLFxuICBcIktOT0JTXCIsXG4gIFwiS05PQ0tcIixcbiAgXCJLTk9MTFwiLFxuICBcIktOT1BTXCIsXG4gIFwiS05PVFNcIixcbiAgXCJLTk9VVFwiLFxuICBcIktOT1dOXCIsXG4gIFwiS05PV1NcIixcbiAgXCJLTlVSTFwiLFxuICBcIktPQUxBXCIsXG4gIFwiS09JTkVcIixcbiAgXCJLT09LU1wiLFxuICBcIktPT0tZXCIsXG4gIFwiS09QRUtcIixcbiAgXCJLUkFBTFwiLFxuICBcIktSQVVUXCIsXG4gIFwiS1JJTExcIixcbiAgXCJLUk9OQVwiLFxuICBcIktST05FXCIsXG4gIFwiS1VET1NcIixcbiAgXCJLVURaVVwiLFxuICBcIktVTEFLXCIsXG4gIFwiS1lSSUVcIixcbiAgXCJMQUJFTFwiLFxuICBcIkxBQklBXCIsXG4gIFwiTEFCT1JcIixcbiAgXCJMQUNFRFwiLFxuICBcIkxBQ0VTXCIsXG4gIFwiTEFDS1NcIixcbiAgXCJMQURFRFwiLFxuICBcIkxBREVOXCIsXG4gIFwiTEFERVNcIixcbiAgXCJMQURMRVwiLFxuICBcIkxBR0VSXCIsXG4gIFwiTEFJUkRcIixcbiAgXCJMQUlSU1wiLFxuICBcIkxBSVRZXCIsXG4gIFwiTEFLRVJcIixcbiAgXCJMQUtFU1wiLFxuICBcIkxBTUFTXCIsXG4gIFwiTEFNQlNcIixcbiAgXCJMQU1FRFwiLFxuICBcIkxBTUVSXCIsXG4gIFwiTEFNRVNcIixcbiAgXCJMQU1QU1wiLFxuICBcIkxBTkFJXCIsXG4gIFwiTEFOQ0VcIixcbiAgXCJMQU5EU1wiLFxuICBcIkxBTkVTXCIsXG4gIFwiTEFOS1lcIixcbiAgXCJMQVBFTFwiLFxuICBcIkxBUElTXCIsXG4gIFwiTEFQU0VcIixcbiAgXCJMQVJDSFwiLFxuICBcIkxBUkRTXCIsXG4gIFwiTEFSR0VcIixcbiAgXCJMQVJHT1wiLFxuICBcIkxBUktTXCIsXG4gIFwiTEFSVkFcIixcbiAgXCJMQVNFRFwiLFxuICBcIkxBU0VSXCIsXG4gIFwiTEFTRVNcIixcbiAgXCJMQVNTT1wiLFxuICBcIkxBU1RTXCIsXG4gIFwiTEFUQ0hcIixcbiAgXCJMQVRFUlwiLFxuICBcIkxBVEVYXCIsXG4gIFwiTEFUSEVcIixcbiAgXCJMQVRIU1wiLFxuICBcIkxBVURTXCIsXG4gIFwiTEFVR0hcIixcbiAgXCJMQVZBU1wiLFxuICBcIkxBVkVEXCIsXG4gIFwiTEFWRVJcIixcbiAgXCJMQVZFU1wiLFxuICBcIkxBV05TXCIsXG4gIFwiTEFYRVJcIixcbiAgXCJMQVlFUlwiLFxuICBcIkxBWVVQXCIsXG4gIFwiTEFaRURcIixcbiAgXCJMQVpFU1wiLFxuICBcIkxFQUNIXCIsXG4gIFwiTEVBRFNcIixcbiAgXCJMRUFGU1wiLFxuICBcIkxFQUZZXCIsXG4gIFwiTEVBS1NcIixcbiAgXCJMRUFLWVwiLFxuICBcIkxFQU5TXCIsXG4gIFwiTEVBTlRcIixcbiAgXCJMRUFQU1wiLFxuICBcIkxFQVBUXCIsXG4gIFwiTEVBUk5cIixcbiAgXCJMRUFTRVwiLFxuICBcIkxFQVNIXCIsXG4gIFwiTEVBU1RcIixcbiAgXCJMRUFWRVwiLFxuICBcIkxFREdFXCIsXG4gIFwiTEVFQ0hcIixcbiAgXCJMRUVLU1wiLFxuICBcIkxFRVJTXCIsXG4gIFwiTEVFUllcIixcbiAgXCJMRUZUU1wiLFxuICBcIkxFRlRZXCIsXG4gIFwiTEVHQUxcIixcbiAgXCJMRUdHWVwiLFxuICBcIkxFR0lUXCIsXG4gIFwiTEVNTUFcIixcbiAgXCJMRU1PTlwiLFxuICBcIkxFTVVSXCIsXG4gIFwiTEVORFNcIixcbiAgXCJMRU5UT1wiLFxuICBcIkxFUEVSXCIsXG4gIFwiTEVQVEFcIixcbiAgXCJMRVRVUFwiLFxuICBcIkxFVkVFXCIsXG4gIFwiTEVWRUxcIixcbiAgXCJMRVZFUlwiLFxuICBcIkxJQVJTXCIsXG4gIFwiTElCRUxcIixcbiAgXCJMSUJSQVwiLFxuICBcIkxJQ0lUXCIsXG4gIFwiTElDS1NcIixcbiAgXCJMSUVHRVwiLFxuICBcIkxJRU5TXCIsXG4gIFwiTElGRVJcIixcbiAgXCJMSUZUU1wiLFxuICBcIkxJR0hUXCIsXG4gIFwiTElLRURcIixcbiAgXCJMSUtFTlwiLFxuICBcIkxJS0VTXCIsXG4gIFwiTElMQUNcIixcbiAgXCJMSUxUU1wiLFxuICBcIkxJTUJPXCIsXG4gIFwiTElNQlNcIixcbiAgXCJMSU1FRFwiLFxuICBcIkxJTUVOXCIsXG4gIFwiTElNRVNcIixcbiAgXCJMSU1FWVwiLFxuICBcIkxJTUlUXCIsXG4gIFwiTElNTlNcIixcbiAgXCJMSU1PU1wiLFxuICBcIkxJTVBTXCIsXG4gIFwiTElORURcIixcbiAgXCJMSU5FTlwiLFxuICBcIkxJTkVSXCIsXG4gIFwiTElORVNcIixcbiAgXCJMSU5HT1wiLFxuICBcIkxJTkdTXCIsXG4gIFwiTElOS1NcIixcbiAgXCJMSU9OU1wiLFxuICBcIkxJUElEXCIsXG4gIFwiTElQUFlcIixcbiAgXCJMSVNMRVwiLFxuICBcIkxJU1BTXCIsXG4gIFwiTElTVFNcIixcbiAgXCJMSVRFUlwiLFxuICBcIkxJVEhFXCIsXG4gIFwiTElUSE9cIixcbiAgXCJMSVRSRVwiLFxuICBcIkxJVkVEXCIsXG4gIFwiTElWRU5cIixcbiAgXCJMSVZFUlwiLFxuICBcIkxJVklEXCIsXG4gIFwiTExBTUFcIixcbiAgXCJMT0FEU1wiLFxuICBcIkxPQUZTXCIsXG4gIFwiTE9BTVlcIixcbiAgXCJMT0FOU1wiLFxuICBcIkxPQVRIXCIsXG4gIFwiTE9CQVJcIixcbiAgXCJMT0JCWVwiLFxuICBcIkxPQkVTXCIsXG4gIFwiTE9DQUxcIixcbiAgXCJMT0NIU1wiLFxuICBcIkxPQ0tTXCIsXG4gIFwiTE9DT1NcIixcbiAgXCJMT0NVU1wiLFxuICBcIkxPREVTXCIsXG4gIFwiTE9ER0VcIixcbiAgXCJMT0VTU1wiLFxuICBcIkxPRlRTXCIsXG4gIFwiTE9GVFlcIixcbiAgXCJMT0dFU1wiLFxuICBcIkxPR0lDXCIsXG4gIFwiTE9HSU5cIixcbiAgXCJMT0dPU1wiLFxuICBcIkxPSU5TXCIsXG4gIFwiTE9MTFNcIixcbiAgXCJMT0xMWVwiLFxuICBcIkxPTkVSXCIsXG4gIFwiTE9OR1NcIixcbiAgXCJMT09LU1wiLFxuICBcIkxPT0tZXCIsXG4gIFwiTE9PTVNcIixcbiAgXCJMT09OU1wiLFxuICBcIkxPT05ZXCIsXG4gIFwiTE9PUFNcIixcbiAgXCJMT09QWVwiLFxuICBcIkxPT1NFXCIsXG4gIFwiTE9PVFNcIixcbiAgXCJMT1BFRFwiLFxuICBcIkxPUEVTXCIsXG4gIFwiTE9QUFlcIixcbiAgXCJMT1JEU1wiLFxuICBcIkxPUkRZXCIsXG4gIFwiTE9SRVNcIixcbiAgXCJMT1JSWVwiLFxuICBcIkxPU0VSXCIsXG4gIFwiTE9TRVNcIixcbiAgXCJMT1NTWVwiLFxuICBcIkxPVFNBXCIsXG4gIFwiTE9UVE9cIixcbiAgXCJMT1RVU1wiLFxuICBcIkxPVUlTXCIsXG4gIFwiTE9VU0VcIixcbiAgXCJMT1VTWVwiLFxuICBcIkxPVVRTXCIsXG4gIFwiTE9WRURcIixcbiAgXCJMT1ZFUlwiLFxuICBcIkxPVkVTXCIsXG4gIFwiTE9XRURcIixcbiAgXCJMT1dFUlwiLFxuICBcIkxPV0xZXCIsXG4gIFwiTE9ZQUxcIixcbiAgXCJMVUFVU1wiLFxuICBcIkxVQkVTXCIsXG4gIFwiTFVCUkFcIixcbiAgXCJMVUNJRFwiLFxuICBcIkxVQ0tTXCIsXG4gIFwiTFVDS1lcIixcbiAgXCJMVUNSRVwiLFxuICBcIkxVTExTXCIsXG4gIFwiTFVMVVNcIixcbiAgXCJMVU1FTlwiLFxuICBcIkxVTVBTXCIsXG4gIFwiTFVNUFlcIixcbiAgXCJMVU5BUlwiLFxuICBcIkxVTkNIXCIsXG4gIFwiTFVORVNcIixcbiAgXCJMVU5HRVwiLFxuICBcIkxVTkdTXCIsXG4gIFwiTFVQVVNcIixcbiAgXCJMVVJDSFwiLFxuICBcIkxVUkVEXCIsXG4gIFwiTFVSRVNcIixcbiAgXCJMVVJJRFwiLFxuICBcIkxVUktTXCIsXG4gIFwiTFVTVFNcIixcbiAgXCJMVVNUWVwiLFxuICBcIkxVVEVEXCIsXG4gIFwiTFVURVNcIixcbiAgXCJMWUNSQVwiLFxuICBcIkxZSU5HXCIsXG4gIFwiTFlNUEhcIixcbiAgXCJMWU5DSFwiLFxuICBcIkxZUkVTXCIsXG4gIFwiTFlSSUNcIixcbiAgXCJNQUNBV1wiLFxuICBcIk1BQ0VEXCIsXG4gIFwiTUFDRVJcIixcbiAgXCJNQUNFU1wiLFxuICBcIk1BQ0hPXCIsXG4gIFwiTUFDUk9cIixcbiAgXCJNQURBTVwiLFxuICBcIk1BRExZXCIsXG4gIFwiTUFGSUFcIixcbiAgXCJNQUdJQ1wiLFxuICBcIk1BR01BXCIsXG4gIFwiTUFHVVNcIixcbiAgXCJNQUhVQVwiLFxuICBcIk1BSURTXCIsXG4gIFwiTUFJTFNcIixcbiAgXCJNQUlNU1wiLFxuICBcIk1BSU5TXCIsXG4gIFwiTUFJWkVcIixcbiAgXCJNQUpPUlwiLFxuICBcIk1BS0VSXCIsXG4gIFwiTUFLRVNcIixcbiAgXCJNQUxFU1wiLFxuICBcIk1BTExTXCIsXG4gIFwiTUFMVFNcIixcbiAgXCJNQUxUWVwiLFxuICBcIk1BTUFTXCIsXG4gIFwiTUFNQk9cIixcbiAgXCJNQU1NQVwiLFxuICBcIk1BTU1ZXCIsXG4gIFwiTUFORVNcIixcbiAgXCJNQU5HRVwiLFxuICBcIk1BTkdPXCIsXG4gIFwiTUFOR1lcIixcbiAgXCJNQU5JQVwiLFxuICBcIk1BTklDXCIsXG4gIFwiTUFOTFlcIixcbiAgXCJNQU5OQVwiLFxuICBcIk1BTk9SXCIsXG4gIFwiTUFOU0VcIixcbiAgXCJNQU5UQVwiLFxuICBcIk1BUExFXCIsXG4gIFwiTUFSQ0hcIixcbiAgXCJNQVJFU1wiLFxuICBcIk1BUkdFXCIsXG4gIFwiTUFSSUFcIixcbiAgXCJNQVJLU1wiLFxuICBcIk1BUkxTXCIsXG4gIFwiTUFSUllcIixcbiAgXCJNQVJTSFwiLFxuICBcIk1BUlRTXCIsXG4gIFwiTUFTRVJcIixcbiAgXCJNQVNLU1wiLFxuICBcIk1BU09OXCIsXG4gIFwiTUFTVFNcIixcbiAgXCJNQVRDSFwiLFxuICBcIk1BVEVEXCIsXG4gIFwiTUFURVJcIixcbiAgXCJNQVRFU1wiLFxuICBcIk1BVEVZXCIsXG4gIFwiTUFUSFNcIixcbiAgXCJNQVRURVwiLFxuICBcIk1BVFpPXCIsXG4gIFwiTUFVTFNcIixcbiAgXCJNQVVWRVwiLFxuICBcIk1BVkVOXCIsXG4gIFwiTUFWSVNcIixcbiAgXCJNQVhJTVwiLFxuICBcIk1BWElTXCIsXG4gIFwiTUFZQkVcIixcbiAgXCJNQVlPUlwiLFxuICBcIk1BWVNUXCIsXG4gIFwiTUFaRURcIixcbiAgXCJNQVpFUlwiLFxuICBcIk1BWkVTXCIsXG4gIFwiTUVBRFNcIixcbiAgXCJNRUFMU1wiLFxuICBcIk1FQUxZXCIsXG4gIFwiTUVBTlNcIixcbiAgXCJNRUFOVFwiLFxuICBcIk1FQU5ZXCIsXG4gIFwiTUVBVFNcIixcbiAgXCJNRUFUWVwiLFxuICBcIk1FREFMXCIsXG4gIFwiTUVESUFcIixcbiAgXCJNRURJQ1wiLFxuICBcIk1FRVRTXCIsXG4gIFwiTUVMQkFcIixcbiAgXCJNRUxEU1wiLFxuICBcIk1FTEVFXCIsXG4gIFwiTUVMT05cIixcbiAgXCJNRUxUU1wiLFxuICBcIk1FTUVTXCIsXG4gIFwiTUVNT1NcIixcbiAgXCJNRU5EU1wiLFxuICBcIk1FTlVTXCIsXG4gIFwiTUVPV1NcIixcbiAgXCJNRVJDWVwiLFxuICBcIk1FUkdFXCIsXG4gIFwiTUVSSVRcIixcbiAgXCJNRVJSWVwiLFxuICBcIk1FU0FTXCIsXG4gIFwiTUVTTkVcIixcbiAgXCJNRVNPTlwiLFxuICBcIk1FU1NZXCIsXG4gIFwiTUVUQUxcIixcbiAgXCJNRVRFRFwiLFxuICBcIk1FVEVSXCIsXG4gIFwiTUVURVNcIixcbiAgXCJNRVRSRVwiLFxuICBcIk1FVFJPXCIsXG4gIFwiTUVXRURcIixcbiAgXCJNRVpaT1wiLFxuICBcIk1JQU9XXCIsXG4gIFwiTUlDS1NcIixcbiAgXCJNSUNST1wiLFxuICBcIk1JRERZXCIsXG4gIFwiTUlESVNcIixcbiAgXCJNSURTVFwiLFxuICBcIk1JRU5TXCIsXG4gIFwiTUlGRlNcIixcbiAgXCJNSUdIVFwiLFxuICBcIk1JS0VEXCIsXG4gIFwiTUlLRVNcIixcbiAgXCJNSUxDSFwiLFxuICBcIk1JTEVSXCIsXG4gIFwiTUlMRVNcIixcbiAgXCJNSUxLU1wiLFxuICBcIk1JTEtZXCIsXG4gIFwiTUlMTFNcIixcbiAgXCJNSU1FRFwiLFxuICBcIk1JTUVPXCIsXG4gIFwiTUlNRVNcIixcbiAgXCJNSU1JQ1wiLFxuICBcIk1JTVNZXCIsXG4gIFwiTUlOQ0VcIixcbiAgXCJNSU5EU1wiLFxuICBcIk1JTkVEXCIsXG4gIFwiTUlORVJcIixcbiAgXCJNSU5FU1wiLFxuICBcIk1JTklNXCIsXG4gIFwiTUlOSVNcIixcbiAgXCJNSU5LU1wiLFxuICBcIk1JTk9SXCIsXG4gIFwiTUlOVFNcIixcbiAgXCJNSU5VU1wiLFxuICBcIk1JUkVEXCIsXG4gIFwiTUlSRVNcIixcbiAgXCJNSVJUSFwiLFxuICBcIk1JU0VSXCIsXG4gIFwiTUlTU1lcIixcbiAgXCJNSVNUU1wiLFxuICBcIk1JU1RZXCIsXG4gIFwiTUlURVJcIixcbiAgXCJNSVRFU1wiLFxuICBcIk1JVFJFXCIsXG4gIFwiTUlUVFNcIixcbiAgXCJNSVhFRFwiLFxuICBcIk1JWEVSXCIsXG4gIFwiTUlYRVNcIixcbiAgXCJNSVhVUFwiLFxuICBcIk1PQU5TXCIsXG4gIFwiTU9BVFNcIixcbiAgXCJNT0NIQVwiLFxuICBcIk1PQ0tTXCIsXG4gIFwiTU9EQUxcIixcbiAgXCJNT0RFTFwiLFxuICBcIk1PREVNXCIsXG4gIFwiTU9ERVNcIixcbiAgXCJNT0dVTFwiLFxuICBcIk1PSEVMXCIsXG4gIFwiTU9JUkVcIixcbiAgXCJNT0lTVFwiLFxuICBcIk1PTEFMXCIsXG4gIFwiTU9MQVJcIixcbiAgXCJNT0xBU1wiLFxuICBcIk1PTERTXCIsXG4gIFwiTU9MRFlcIixcbiAgXCJNT0xFU1wiLFxuICBcIk1PTExTXCIsXG4gIFwiTU9MTFlcIixcbiAgXCJNT0xUU1wiLFxuICBcIk1PTU1BXCIsXG4gIFwiTU9NTVlcIixcbiAgXCJNT05BRFwiLFxuICBcIk1PTkRPXCIsXG4gIFwiTU9ORVlcIixcbiAgXCJNT05JQ1wiLFxuICBcIk1PTktTXCIsXG4gIFwiTU9OVEVcIixcbiAgXCJNT05USFwiLFxuICBcIk1PT0NIXCIsXG4gIFwiTU9PRFNcIixcbiAgXCJNT09EWVwiLFxuICBcIk1PT0VEXCIsXG4gIFwiTU9PTEFcIixcbiAgXCJNT09OU1wiLFxuICBcIk1PT05ZXCIsXG4gIFwiTU9PUlNcIixcbiAgXCJNT09TRVwiLFxuICBcIk1PT1RTXCIsXG4gIFwiTU9QRURcIixcbiAgXCJNT1BFU1wiLFxuICBcIk1PUkFMXCIsXG4gIFwiTU9SQVlcIixcbiAgXCJNT1JFTFwiLFxuICBcIk1PUkVTXCIsXG4gIFwiTU9STlNcIixcbiAgXCJNT1JPTlwiLFxuICBcIk1PUlBIXCIsXG4gIFwiTU9SVFNcIixcbiAgXCJNT1NFWVwiLFxuICBcIk1PU1NZXCIsXG4gIFwiTU9URUxcIixcbiAgXCJNT1RFU1wiLFxuICBcIk1PVEVUXCIsXG4gIFwiTU9USFNcIixcbiAgXCJNT1RIWVwiLFxuICBcIk1PVElGXCIsXG4gIFwiTU9UT1JcIixcbiAgXCJNT1RUT1wiLFxuICBcIk1PVUxEXCIsXG4gIFwiTU9VTFRcIixcbiAgXCJNT1VORFwiLFxuICBcIk1PVU5UXCIsXG4gIFwiTU9VUk5cIixcbiAgXCJNT1VTRVwiLFxuICBcIk1PVVNZXCIsXG4gIFwiTU9VVEhcIixcbiAgXCJNT1ZFRFwiLFxuICBcIk1PVkVSXCIsXG4gIFwiTU9WRVNcIixcbiAgXCJNT1ZJRVwiLFxuICBcIk1PV0VEXCIsXG4gIFwiTU9XRVJcIixcbiAgXCJNT1hJRVwiLFxuICBcIk1VQ0hPXCIsXG4gIFwiTVVDS1NcIixcbiAgXCJNVUNLWVwiLFxuICBcIk1VQ1VTXCIsXG4gIFwiTVVERFlcIixcbiAgXCJNVUZGU1wiLFxuICBcIk1VRlRJXCIsXG4gIFwiTVVHR1lcIixcbiAgXCJNVUxDSFwiLFxuICBcIk1VTENUXCIsXG4gIFwiTVVMRVNcIixcbiAgXCJNVUxFWVwiLFxuICBcIk1VTExTXCIsXG4gIFwiTVVNTVlcIixcbiAgXCJNVU1QU1wiLFxuICBcIk1VTkNIXCIsXG4gIFwiTVVOR0VcIixcbiAgXCJNVU5HU1wiLFxuICBcIk1VT05TXCIsXG4gIFwiTVVSQUxcIixcbiAgXCJNVVJLWVwiLFxuICBcIk1VU0VEXCIsXG4gIFwiTVVTRVNcIixcbiAgXCJNVVNIWVwiLFxuICBcIk1VU0lDXCIsXG4gIFwiTVVTS1NcIixcbiAgXCJNVVNLWVwiLFxuICBcIk1VU09TXCIsXG4gIFwiTVVTVFNcIixcbiAgXCJNVVNUWVwiLFxuICBcIk1VVEVEXCIsXG4gIFwiTVVURVNcIixcbiAgXCJNVVRUU1wiLFxuICBcIk1VWEVTXCIsXG4gIFwiTVlMQVJcIixcbiAgXCJNWU5BSFwiLFxuICBcIk1ZTkFTXCIsXG4gIFwiTVlSUkhcIixcbiAgXCJNWVRIU1wiLFxuICBcIk5BQk9CXCIsXG4gIFwiTkFDSE9cIixcbiAgXCJOQURJUlwiLFxuICBcIk5BSUFEXCIsXG4gIFwiTkFJTFNcIixcbiAgXCJOQUlWRVwiLFxuICBcIk5BS0VEXCIsXG4gIFwiTkFNRURcIixcbiAgXCJOQU1FU1wiLFxuICBcIk5BTk5ZXCIsXG4gIFwiTkFQRVNcIixcbiAgXCJOQVBQWVwiLFxuICBcIk5BUkNPXCIsXG4gIFwiTkFSQ1NcIixcbiAgXCJOQVJEU1wiLFxuICBcIk5BUkVTXCIsXG4gIFwiTkFTQUxcIixcbiAgXCJOQVNUWVwiLFxuICBcIk5BVEFMXCIsXG4gIFwiTkFUQ0hcIixcbiAgXCJOQVRFU1wiLFxuICBcIk5BVFRZXCIsXG4gIFwiTkFWQUxcIixcbiAgXCJOQVZFTFwiLFxuICBcIk5BVkVTXCIsXG4gIFwiTkVBUlNcIixcbiAgXCJORUFUSFwiLFxuICBcIk5FQ0tTXCIsXG4gIFwiTkVFRFNcIixcbiAgXCJORUVEWVwiLFxuICBcIk5FR1JPXCIsXG4gIFwiTkVJR0hcIixcbiAgXCJORU9OU1wiLFxuICBcIk5FUkRTXCIsXG4gIFwiTkVSRFlcIixcbiAgXCJORVJGU1wiLFxuICBcIk5FUlZFXCIsXG4gIFwiTkVSVllcIixcbiAgXCJORVNUU1wiLFxuICBcIk5FVkVSXCIsXG4gIFwiTkVXRUxcIixcbiAgXCJORVdFUlwiLFxuICBcIk5FV0xZXCIsXG4gIFwiTkVXU1lcIixcbiAgXCJORVdUU1wiLFxuICBcIk5FWFVTXCIsXG4gIFwiTklDQURcIixcbiAgXCJOSUNFUlwiLFxuICBcIk5JQ0hFXCIsXG4gIFwiTklDS1NcIixcbiAgXCJOSUVDRVwiLFxuICBcIk5JRlRZXCIsXG4gIFwiTklHSFRcIixcbiAgXCJOSU1CSVwiLFxuICBcIk5JTkVTXCIsXG4gIFwiTklOSkFcIixcbiAgXCJOSU5OWVwiLFxuICBcIk5JTlRIXCIsXG4gIFwiTklQUFlcIixcbiAgXCJOSVNFSVwiLFxuICBcIk5JVEVSXCIsXG4gIFwiTklUUk9cIixcbiAgXCJOSVhFRFwiLFxuICBcIk5JWEVTXCIsXG4gIFwiTklYSUVcIixcbiAgXCJOT0JMRVwiLFxuICBcIk5PQkxZXCIsXG4gIFwiTk9EQUxcIixcbiAgXCJOT0REWVwiLFxuICBcIk5PREVTXCIsXG4gIFwiTk9FTFNcIixcbiAgXCJOT0hPV1wiLFxuICBcIk5PSVNFXCIsXG4gIFwiTk9JU1lcIixcbiAgXCJOT01BRFwiLFxuICBcIk5PTkNFXCIsXG4gIFwiTk9ORVNcIixcbiAgXCJOT09LU1wiLFxuICBcIk5PT0tZXCIsXG4gIFwiTk9PTlNcIixcbiAgXCJOT09TRVwiLFxuICBcIk5PUk1TXCIsXG4gIFwiTk9SVEhcIixcbiAgXCJOT1NFRFwiLFxuICBcIk5PU0VTXCIsXG4gIFwiTk9TRVlcIixcbiAgXCJOT1RDSFwiLFxuICBcIk5PVEVEXCIsXG4gIFwiTk9URVNcIixcbiAgXCJOT1VOU1wiLFxuICBcIk5PVkFFXCIsXG4gIFwiTk9WQVNcIixcbiAgXCJOT1ZFTFwiLFxuICBcIk5PV0FZXCIsXG4gIFwiTlVERVNcIixcbiAgXCJOVURHRVwiLFxuICBcIk5VRElFXCIsXG4gIFwiTlVLRURcIixcbiAgXCJOVUtFU1wiLFxuICBcIk5VTExTXCIsXG4gIFwiTlVNQlNcIixcbiAgXCJOVVJTRVwiLFxuICBcIk5VVFNZXCIsXG4gIFwiTlVUVFlcIixcbiAgXCJOWUxPTlwiLFxuICBcIk5ZTVBIXCIsXG4gIFwiT0FLRU5cIixcbiAgXCJPQUtVTVwiLFxuICBcIk9BUkVEXCIsXG4gIFwiT0FTRVNcIixcbiAgXCJPQVNJU1wiLFxuICBcIk9BVEVOXCIsXG4gIFwiT0FUSFNcIixcbiAgXCJPQkVBSFwiLFxuICBcIk9CRVNFXCIsXG4gIFwiT0JFWVNcIixcbiAgXCJPQklUU1wiLFxuICBcIk9CT0VTXCIsXG4gIFwiT0NDVVJcIixcbiAgXCJPQ0VBTlwiLFxuICBcIk9DSEVSXCIsXG4gIFwiT0NIUkVcIixcbiAgXCJPQ1RBTFwiLFxuICBcIk9DVEVUXCIsXG4gIFwiT0RERVJcIixcbiAgXCJPRERMWVwiLFxuICBcIk9ESVVNXCIsXG4gIFwiT0RPUlNcIixcbiAgXCJPRE9VUlwiLFxuICBcIk9GRkFMXCIsXG4gIFwiT0ZGRURcIixcbiAgXCJPRkZFUlwiLFxuICBcIk9GVEVOXCIsXG4gIFwiT0dMRURcIixcbiAgXCJPR0xFU1wiLFxuICBcIk9HUkVTXCIsXG4gIFwiT0lMRURcIixcbiAgXCJPSUxFUlwiLFxuICBcIk9JTktTXCIsXG4gIFwiT0tBUElcIixcbiAgXCJPS0FZU1wiLFxuICBcIk9MREVOXCIsXG4gIFwiT0xERVJcIixcbiAgXCJPTERJRVwiLFxuICBcIk9MSU9TXCIsXG4gIFwiT0xJVkVcIixcbiAgXCJPTUJSRVwiLFxuICBcIk9NRUdBXCIsXG4gIFwiT01FTlNcIixcbiAgXCJPTUlUU1wiLFxuICBcIk9OSU9OXCIsXG4gIFwiT05TRVRcIixcbiAgXCJPT01QSFwiLFxuICBcIk9PWkVEXCIsXG4gIFwiT09aRVNcIixcbiAgXCJPUEFMU1wiLFxuICBcIk9QRU5TXCIsXG4gIFwiT1BFUkFcIixcbiAgXCJPUElORVwiLFxuICBcIk9QSVVNXCIsXG4gIFwiT1BURURcIixcbiAgXCJPUFRJQ1wiLFxuICBcIk9SQUxTXCIsXG4gIFwiT1JBVEVcIixcbiAgXCJPUkJJVFwiLFxuICBcIk9SQ0FTXCIsXG4gIFwiT1JERVJcIixcbiAgXCJPUkdBTlwiLFxuICBcIk9SVEhPXCIsXG4gIFwiT1NJRVJcIixcbiAgXCJPVEhFUlwiLFxuICBcIk9UVEVSXCIsXG4gIFwiT1VHSFRcIixcbiAgXCJPVU5DRVwiLFxuICBcIk9VU0VMXCIsXG4gIFwiT1VTVFNcIixcbiAgXCJPVVRET1wiLFxuICBcIk9VVEVSXCIsXG4gIFwiT1VUR09cIixcbiAgXCJPVVRUQVwiLFxuICBcIk9VWkVMXCIsXG4gIFwiT1ZBTFNcIixcbiAgXCJPVkFSWVwiLFxuICBcIk9WQVRFXCIsXG4gIFwiT1ZFTlNcIixcbiAgXCJPVkVSU1wiLFxuICBcIk9WRVJUXCIsXG4gIFwiT1ZPSURcIixcbiAgXCJPVlVMRVwiLFxuICBcIk9XSU5HXCIsXG4gIFwiT1dMRVRcIixcbiAgXCJPV05FRFwiLFxuICBcIk9XTkVSXCIsXG4gIFwiT1hCT1dcIixcbiAgXCJPWEVZRVwiLFxuICBcIk9YSURFXCIsXG4gIFwiT1hMSVBcIixcbiAgXCJPWk9ORVwiLFxuICBcIlBBQ0VEXCIsXG4gIFwiUEFDRVJcIixcbiAgXCJQQUNFU1wiLFxuICBcIlBBQ0tTXCIsXG4gIFwiUEFDVFNcIixcbiAgXCJQQUREWVwiLFxuICBcIlBBRFJFXCIsXG4gIFwiUEFFQU5cIixcbiAgXCJQQUdBTlwiLFxuICBcIlBBR0VEXCIsXG4gIFwiUEFHRVJcIixcbiAgXCJQQUdFU1wiLFxuICBcIlBBSUxTXCIsXG4gIFwiUEFJTlNcIixcbiAgXCJQQUlOVFwiLFxuICBcIlBBSVJTXCIsXG4gIFwiUEFMRURcIixcbiAgXCJQQUxFUlwiLFxuICBcIlBBTEVTXCIsXG4gIFwiUEFMTFNcIixcbiAgXCJQQUxMWVwiLFxuICBcIlBBTE1TXCIsXG4gIFwiUEFMTVlcIixcbiAgXCJQQUxTWVwiLFxuICBcIlBBTkRBXCIsXG4gIFwiUEFORUxcIixcbiAgXCJQQU5FU1wiLFxuICBcIlBBTkdBXCIsXG4gIFwiUEFOR1NcIixcbiAgXCJQQU5JQ1wiLFxuICBcIlBBTlNZXCIsXG4gIFwiUEFOVFNcIixcbiAgXCJQQU5UWVwiLFxuICBcIlBBUEFMXCIsXG4gIFwiUEFQQVNcIixcbiAgXCJQQVBBV1wiLFxuICBcIlBBUEVSXCIsXG4gIFwiUEFQUFlcIixcbiAgXCJQQVJBU1wiLFxuICBcIlBBUkNIXCIsXG4gIFwiUEFSRFNcIixcbiAgXCJQQVJFRFwiLFxuICBcIlBBUkVOXCIsXG4gIFwiUEFSRVNcIixcbiAgXCJQQVJLQVwiLFxuICBcIlBBUktTXCIsXG4gIFwiUEFSUllcIixcbiAgXCJQQVJTRVwiLFxuICBcIlBBUlRTXCIsXG4gIFwiUEFSVFlcIixcbiAgXCJQQVNIQVwiLFxuICBcIlBBU1NFXCIsXG4gIFwiUEFTVEFcIixcbiAgXCJQQVNURVwiLFxuICBcIlBBU1RTXCIsXG4gIFwiUEFTVFlcIixcbiAgXCJQQVRDSFwiLFxuICBcIlBBVEVOXCIsXG4gIFwiUEFURVJcIixcbiAgXCJQQVRFU1wiLFxuICBcIlBBVEhTXCIsXG4gIFwiUEFUSU9cIixcbiAgXCJQQVRTWVwiLFxuICBcIlBBVFRZXCIsXG4gIFwiUEFVU0VcIixcbiAgXCJQQVZBTlwiLFxuICBcIlBBVkVEXCIsXG4gIFwiUEFWRVJcIixcbiAgXCJQQVZFU1wiLFxuICBcIlBBV0VEXCIsXG4gIFwiUEFXS1lcIixcbiAgXCJQQVdMU1wiLFxuICBcIlBBV05TXCIsXG4gIFwiUEFZRURcIixcbiAgXCJQQVlFRVwiLFxuICBcIlBBWUVSXCIsXG4gIFwiUEVBQ0VcIixcbiAgXCJQRUFDSFwiLFxuICBcIlBFQUtTXCIsXG4gIFwiUEVBS1lcIixcbiAgXCJQRUFMU1wiLFxuICBcIlBFQVJMXCIsXG4gIFwiUEVBUlNcIixcbiAgXCJQRUFTRVwiLFxuICBcIlBFQVRTXCIsXG4gIFwiUEVDQU5cIixcbiAgXCJQRUNLU1wiLFxuICBcIlBFREFMXCIsXG4gIFwiUEVFS1NcIixcbiAgXCJQRUVMU1wiLFxuICBcIlBFRU5TXCIsXG4gIFwiUEVFUFNcIixcbiAgXCJQRUVSU1wiLFxuICBcIlBFRVZFXCIsXG4gIFwiUEVLT0VcIixcbiAgXCJQRUxUU1wiLFxuICBcIlBFTkFMXCIsXG4gIFwiUEVOQ0VcIixcbiAgXCJQRU5FU1wiLFxuICBcIlBFTkdPXCIsXG4gIFwiUEVOSVNcIixcbiAgXCJQRU5OWVwiLFxuICBcIlBFT05TXCIsXG4gIFwiUEVPTllcIixcbiAgXCJQRVBQWVwiLFxuICBcIlBFUkNIXCIsXG4gIFwiUEVSSUxcIixcbiAgXCJQRVJLU1wiLFxuICBcIlBFUktZXCIsXG4gIFwiUEVSTVNcIixcbiAgXCJQRVNLWVwiLFxuICBcIlBFU09TXCIsXG4gIFwiUEVTVE9cIixcbiAgXCJQRVNUU1wiLFxuICBcIlBFVEFMXCIsXG4gIFwiUEVURVJcIixcbiAgXCJQRVRJVFwiLFxuICBcIlBFVFRZXCIsXG4gIFwiUEVXRUVcIixcbiAgXCJQRVdJVFwiLFxuICBcIlBIQUdFXCIsXG4gIFwiUEhJQUxcIixcbiAgXCJQSExPWFwiLFxuICBcIlBIT05FXCIsXG4gIFwiUEhPTllcIixcbiAgXCJQSE9UT1wiLFxuICBcIlBIWUxBXCIsXG4gIFwiUElBTk9cIixcbiAgXCJQSUNBU1wiLFxuICBcIlBJQ0tTXCIsXG4gIFwiUElDS1lcIixcbiAgXCJQSUNPVFwiLFxuICBcIlBJRUNFXCIsXG4gIFwiUElFUlNcIixcbiAgXCJQSUVUQVwiLFxuICBcIlBJRVRZXCIsXG4gIFwiUElHR1lcIixcbiAgXCJQSUdNWVwiLFxuICBcIlBJS0VSXCIsXG4gIFwiUElLRVNcIixcbiAgXCJQSUxBRlwiLFxuICBcIlBJTEFVXCIsXG4gIFwiUElMRURcIixcbiAgXCJQSUxFU1wiLFxuICBcIlBJTExTXCIsXG4gIFwiUElMT1RcIixcbiAgXCJQSU1QU1wiLFxuICBcIlBJTkNIXCIsXG4gIFwiUElORURcIixcbiAgXCJQSU5FU1wiLFxuICBcIlBJTkVZXCIsXG4gIFwiUElOR1NcIixcbiAgXCJQSU5LT1wiLFxuICBcIlBJTktTXCIsXG4gIFwiUElOS1lcIixcbiAgXCJQSU5UT1wiLFxuICBcIlBJTlRTXCIsXG4gIFwiUElOVVBcIixcbiAgXCJQSU9OU1wiLFxuICBcIlBJT1VTXCIsXG4gIFwiUElQRURcIixcbiAgXCJQSVBFUlwiLFxuICBcIlBJUEVTXCIsXG4gIFwiUElQRVRcIixcbiAgXCJQSVFVRVwiLFxuICBcIlBJVEFTXCIsXG4gIFwiUElUQ0hcIixcbiAgXCJQSVRIU1wiLFxuICBcIlBJVEhZXCIsXG4gIFwiUElUT05cIixcbiAgXCJQSVZPVFwiLFxuICBcIlBJWEVMXCIsXG4gIFwiUElYSUVcIixcbiAgXCJQSVpaQVwiLFxuICBcIlBMQUNFXCIsXG4gIFwiUExBSURcIixcbiAgXCJQTEFJTlwiLFxuICBcIlBMQUlUXCIsXG4gIFwiUExBTkVcIixcbiAgXCJQTEFOS1wiLFxuICBcIlBMQU5TXCIsXG4gIFwiUExBTlRcIixcbiAgXCJQTEFTSFwiLFxuICBcIlBMQVNNXCIsXG4gIFwiUExBVEVcIixcbiAgXCJQTEFUU1wiLFxuICBcIlBMQVlBXCIsXG4gIFwiUExBWVNcIixcbiAgXCJQTEFaQVwiLFxuICBcIlBMRUFEXCIsXG4gIFwiUExFQVNcIixcbiAgXCJQTEVBVFwiLFxuICBcIlBMRUJFXCIsXG4gIFwiUExFQlNcIixcbiAgXCJQTElFRFwiLFxuICBcIlBMSUVTXCIsXG4gIFwiUExJTktcIixcbiAgXCJQTE9EU1wiLFxuICBcIlBMT05LXCIsXG4gIFwiUExPUFNcIixcbiAgXCJQTE9UU1wiLFxuICBcIlBMT1dTXCIsXG4gIFwiUExPWVNcIixcbiAgXCJQTFVDS1wiLFxuICBcIlBMVUdTXCIsXG4gIFwiUExVTUJcIixcbiAgXCJQTFVNRVwiLFxuICBcIlBMVU1QXCIsXG4gIFwiUExVTVNcIixcbiAgXCJQTFVNWVwiLFxuICBcIlBMVU5LXCIsXG4gIFwiUExVU0hcIixcbiAgXCJQT0FDSFwiLFxuICBcIlBPQ0tTXCIsXG4gIFwiUE9DS1lcIixcbiAgXCJQT0RHWVwiLFxuICBcIlBPRElBXCIsXG4gIFwiUE9FTVNcIixcbiAgXCJQT0VTWVwiLFxuICBcIlBPRVRTXCIsXG4gIFwiUE9JTlRcIixcbiAgXCJQT0lTRVwiLFxuICBcIlBPS0VEXCIsXG4gIFwiUE9LRVJcIixcbiAgXCJQT0tFU1wiLFxuICBcIlBPS0VZXCIsXG4gIFwiUE9MQVJcIixcbiAgXCJQT0xFRFwiLFxuICBcIlBPTEVSXCIsXG4gIFwiUE9MRVNcIixcbiAgXCJQT0xJT1wiLFxuICBcIlBPTElTXCIsXG4gIFwiUE9MS0FcIixcbiAgXCJQT0xMU1wiLFxuICBcIlBPTFlQXCIsXG4gIFwiUE9NUFNcIixcbiAgXCJQT05EU1wiLFxuICBcIlBPT0NIXCIsXG4gIFwiUE9PSFNcIixcbiAgXCJQT09MU1wiLFxuICBcIlBPT1BTXCIsXG4gIFwiUE9QRVNcIixcbiAgXCJQT1BQWVwiLFxuICBcIlBPUkNIXCIsXG4gIFwiUE9SRURcIixcbiAgXCJQT1JFU1wiLFxuICBcIlBPUkdZXCIsXG4gIFwiUE9SS1NcIixcbiAgXCJQT1JLWVwiLFxuICBcIlBPUk5PXCIsXG4gIFwiUE9SVFNcIixcbiAgXCJQT1NFRFwiLFxuICBcIlBPU0VSXCIsXG4gIFwiUE9TRVNcIixcbiAgXCJQT1NJVFwiLFxuICBcIlBPU1NFXCIsXG4gIFwiUE9TVFNcIixcbiAgXCJQT1RUWVwiLFxuICBcIlBPVUNIXCIsXG4gIFwiUE9VRlNcIixcbiAgXCJQT1VORFwiLFxuICBcIlBPVVJTXCIsXG4gIFwiUE9VVFNcIixcbiAgXCJQT1dFUlwiLFxuICBcIlBPWEVTXCIsXG4gIFwiUFJBTVNcIixcbiAgXCJQUkFOS1wiLFxuICBcIlBSQVRFXCIsXG4gIFwiUFJBVFNcIixcbiAgXCJQUkFXTlwiLFxuICBcIlBSQVlTXCIsXG4gIFwiUFJFRU5cIixcbiAgXCJQUkVQU1wiLFxuICBcIlBSRVNTXCIsXG4gIFwiUFJFWFlcIixcbiAgXCJQUkVZU1wiLFxuICBcIlBSSUNFXCIsXG4gIFwiUFJJQ0tcIixcbiAgXCJQUklERVwiLFxuICBcIlBSSUVEXCIsXG4gIFwiUFJJRVNcIixcbiAgXCJQUklHU1wiLFxuICBcIlBSSU1FXCIsXG4gIFwiUFJJTU9cIixcbiAgXCJQUklNUFwiLFxuICBcIlBSSU1TXCIsXG4gIFwiUFJJTktcIixcbiAgXCJQUklOVFwiLFxuICBcIlBSSU9SXCIsXG4gIFwiUFJJU0VcIixcbiAgXCJQUklTTVwiLFxuICBcIlBSSVZZXCIsXG4gIFwiUFJJWkVcIixcbiAgXCJQUk9CRVwiLFxuICBcIlBST0RTXCIsXG4gIFwiUFJPRU1cIixcbiAgXCJQUk9GU1wiLFxuICBcIlBST01PXCIsXG4gIFwiUFJPTVNcIixcbiAgXCJQUk9ORVwiLFxuICBcIlBST05HXCIsXG4gIFwiUFJPT0ZcIixcbiAgXCJQUk9QU1wiLFxuICBcIlBST1NFXCIsXG4gIFwiUFJPU1lcIixcbiAgXCJQUk9VRFwiLFxuICBcIlBST1ZFXCIsXG4gIFwiUFJPV0xcIixcbiAgXCJQUk9XU1wiLFxuICBcIlBST1hZXCIsXG4gIFwiUFJVREVcIixcbiAgXCJQUlVORVwiLFxuICBcIlBTQUxNXCIsXG4gIFwiUFNFVURcIixcbiAgXCJQU0hBV1wiLFxuICBcIlBTT0FTXCIsXG4gIFwiUFNZQ0hcIixcbiAgXCJQVUJFU1wiLFxuICBcIlBVQklDXCIsXG4gIFwiUFVCSVNcIixcbiAgXCJQVUNLU1wiLFxuICBcIlBVREdZXCIsXG4gIFwiUFVGRlNcIixcbiAgXCJQVUZGWVwiLFxuICBcIlBVS0VEXCIsXG4gIFwiUFVLRVNcIixcbiAgXCJQVUtLQVwiLFxuICBcIlBVTExTXCIsXG4gIFwiUFVMUFNcIixcbiAgXCJQVUxQWVwiLFxuICBcIlBVTFNFXCIsXG4gIFwiUFVNQVNcIixcbiAgXCJQVU1QU1wiLFxuICBcIlBVTkNIXCIsXG4gIFwiUFVOS1NcIixcbiAgXCJQVU5LWVwiLFxuICBcIlBVTk5ZXCIsXG4gIFwiUFVOVFNcIixcbiAgXCJQVVBBRVwiLFxuICBcIlBVUElMXCIsXG4gIFwiUFVQUFlcIixcbiAgXCJQVVJFRVwiLFxuICBcIlBVUkVSXCIsXG4gIFwiUFVSR0VcIixcbiAgXCJQVVJMU1wiLFxuICBcIlBVUlJTXCIsXG4gIFwiUFVSU0VcIixcbiAgXCJQVVJUWVwiLFxuICBcIlBVU0hZXCIsXG4gIFwiUFVTU1lcIixcbiAgXCJQVVRUU1wiLFxuICBcIlBVVFRZXCIsXG4gIFwiUFlHTVlcIixcbiAgXCJQWUxPTlwiLFxuICBcIlBZUkVTXCIsXG4gIFwiUVVBQ0tcIixcbiAgXCJRVUFEU1wiLFxuICBcIlFVQUZGXCIsXG4gIFwiUVVBSUxcIixcbiAgXCJRVUFLRVwiLFxuICBcIlFVQUxNXCIsXG4gIFwiUVVBUktcIixcbiAgXCJRVUFSVFwiLFxuICBcIlFVQVNIXCIsXG4gIFwiUVVBU0lcIixcbiAgXCJRVUFZU1wiLFxuICBcIlFVRUVOXCIsXG4gIFwiUVVFRVJcIixcbiAgXCJRVUVMTFwiLFxuICBcIlFVRVJZXCIsXG4gIFwiUVVFU1RcIixcbiAgXCJRVUVVRVwiLFxuICBcIlFVSUNLXCIsXG4gIFwiUVVJRFNcIixcbiAgXCJRVUlFVFwiLFxuICBcIlFVSUZGXCIsXG4gIFwiUVVJTExcIixcbiAgXCJRVUlMVFwiLFxuICBcIlFVSU5UXCIsXG4gIFwiUVVJUFNcIixcbiAgXCJRVUlQVVwiLFxuICBcIlFVSVJFXCIsXG4gIFwiUVVJUktcIixcbiAgXCJRVUlSVFwiLFxuICBcIlFVSVRFXCIsXG4gIFwiUVVJVFNcIixcbiAgXCJRVU9JTlwiLFxuICBcIlFVT0lUXCIsXG4gIFwiUVVPVEFcIixcbiAgXCJRVU9URVwiLFxuICBcIlFVT1RIXCIsXG4gIFwiUkFCQklcIixcbiAgXCJSQUJJRFwiLFxuICBcIlJBQ0VEXCIsXG4gIFwiUkFDRVJcIixcbiAgXCJSQUNFU1wiLFxuICBcIlJBQ0tTXCIsXG4gIFwiUkFEQVJcIixcbiAgXCJSQURJSVwiLFxuICBcIlJBRElPXCIsXG4gIFwiUkFESVhcIixcbiAgXCJSQURPTlwiLFxuICBcIlJBRlRTXCIsXG4gIFwiUkFHRURcIixcbiAgXCJSQUdFU1wiLFxuICBcIlJBSURTXCIsXG4gIFwiUkFJTFNcIixcbiAgXCJSQUlOU1wiLFxuICBcIlJBSU5ZXCIsXG4gIFwiUkFJU0VcIixcbiAgXCJSQUpBSFwiLFxuICBcIlJBSkFTXCIsXG4gIFwiUkFLRURcIixcbiAgXCJSQUtFU1wiLFxuICBcIlJBTExZXCIsXG4gIFwiUkFNUFNcIixcbiAgXCJSQU5DSFwiLFxuICBcIlJBTkRTXCIsXG4gIFwiUkFORFlcIixcbiAgXCJSQU5HRVwiLFxuICBcIlJBTkdZXCIsXG4gIFwiUkFOS1NcIixcbiAgXCJSQU5UU1wiLFxuICBcIlJBUEVSXCIsXG4gIFwiUkFQSURcIixcbiAgXCJSQVJFUlwiLFxuICBcIlJBU1BTXCIsXG4gIFwiUkFTUFlcIixcbiAgXCJSQVRFRFwiLFxuICBcIlJBVEVTXCIsXG4gIFwiUkFUSFNcIixcbiAgXCJSQVRJT1wiLFxuICBcIlJBVFRZXCIsXG4gIFwiUkFWRURcIixcbiAgXCJSQVZFTFwiLFxuICBcIlJBVkVOXCIsXG4gIFwiUkFWRVJcIixcbiAgXCJSQVZFU1wiLFxuICBcIlJBV0VSXCIsXG4gIFwiUkFZRURcIixcbiAgXCJSQVlPTlwiLFxuICBcIlJBWkVEXCIsXG4gIFwiUkFaRVNcIixcbiAgXCJSQVpPUlwiLFxuICBcIlJFQUNIXCIsXG4gIFwiUkVBQ1RcIixcbiAgXCJSRUFEU1wiLFxuICBcIlJFQURZXCIsXG4gIFwiUkVBTE1cIixcbiAgXCJSRUFMU1wiLFxuICBcIlJFQU1TXCIsXG4gIFwiUkVBUFNcIixcbiAgXCJSRUFSTVwiLFxuICBcIlJFQVJTXCIsXG4gIFwiUkVCQVJcIixcbiAgXCJSRUJFTFwiLFxuICBcIlJFQklEXCIsXG4gIFwiUkVCVVNcIixcbiAgXCJSRUJVVFwiLFxuICBcIlJFQ0FQXCIsXG4gIFwiUkVDVEFcIixcbiAgXCJSRUNUT1wiLFxuICBcIlJFQ1VSXCIsXG4gIFwiUkVDVVRcIixcbiAgXCJSRURJRFwiLFxuICBcIlJFRE9YXCIsXG4gIFwiUkVEVVhcIixcbiAgXCJSRUVEU1wiLFxuICBcIlJFRURZXCIsXG4gIFwiUkVFRlNcIixcbiAgXCJSRUVLU1wiLFxuICBcIlJFRUxTXCIsXG4gIFwiUkVFVkVcIixcbiAgXCJSRUZFUlwiLFxuICBcIlJFRklUXCIsXG4gIFwiUkVGSVhcIixcbiAgXCJSRUdBTFwiLFxuICBcIlJFSEFCXCIsXG4gIFwiUkVJRllcIixcbiAgXCJSRUlHTlwiLFxuICBcIlJFSU5TXCIsXG4gIFwiUkVMQVhcIixcbiAgXCJSRUxBWVwiLFxuICBcIlJFTEVUXCIsXG4gIFwiUkVMSUNcIixcbiAgXCJSRU1BTlwiLFxuICBcIlJFTUFQXCIsXG4gIFwiUkVNSVRcIixcbiAgXCJSRU1JWFwiLFxuICBcIlJFTkFMXCIsXG4gIFwiUkVORFNcIixcbiAgXCJSRU5FV1wiLFxuICBcIlJFTlRTXCIsXG4gIFwiUkVQQVlcIixcbiAgXCJSRVBFTFwiLFxuICBcIlJFUExZXCIsXG4gIFwiUkVQUk9cIixcbiAgXCJSRVJBTlwiLFxuICBcIlJFUlVOXCIsXG4gIFwiUkVTRVRcIixcbiAgXCJSRVNJTlwiLFxuICBcIlJFU1RTXCIsXG4gIFwiUkVUQ0hcIixcbiAgXCJSRVRST1wiLFxuICBcIlJFVFJZXCIsXG4gIFwiUkVVU0VcIixcbiAgXCJSRVZFTFwiLFxuICBcIlJFVkVUXCIsXG4gIFwiUkVWVUVcIixcbiAgXCJSSEVBU1wiLFxuICBcIlJIRVVNXCIsXG4gIFwiUkhJTk9cIixcbiAgXCJSSFVNQlwiLFxuICBcIlJIWU1FXCIsXG4gIFwiUklBTFNcIixcbiAgXCJSSUJCWVwiLFxuICBcIlJJQ0VEXCIsXG4gIFwiUklDRVJcIixcbiAgXCJSSUNFU1wiLFxuICBcIlJJREVSXCIsXG4gIFwiUklERVNcIixcbiAgXCJSSURHRVwiLFxuICBcIlJJRkxFXCIsXG4gIFwiUklGVFNcIixcbiAgXCJSSUdIVFwiLFxuICBcIlJJR0lEXCIsXG4gIFwiUklHT1JcIixcbiAgXCJSSUxFRFwiLFxuICBcIlJJTEVTXCIsXG4gIFwiUklMTEVcIixcbiAgXCJSSUxMU1wiLFxuICBcIlJJTUVEXCIsXG4gIFwiUklNRVNcIixcbiAgXCJSSU5EU1wiLFxuICBcIlJJTkdTXCIsXG4gIFwiUklOS1NcIixcbiAgXCJSSU5TRVwiLFxuICBcIlJJT1RTXCIsXG4gIFwiUklQRU5cIixcbiAgXCJSSVBFUlwiLFxuICBcIlJJU0VOXCIsXG4gIFwiUklTRVJcIixcbiAgXCJSSVNFU1wiLFxuICBcIlJJU0tTXCIsXG4gIFwiUklTS1lcIixcbiAgXCJSSVRFU1wiLFxuICBcIlJJVFpZXCIsXG4gIFwiUklWQUxcIixcbiAgXCJSSVZFRFwiLFxuICBcIlJJVkVOXCIsXG4gIFwiUklWRVJcIixcbiAgXCJSSVZFU1wiLFxuICBcIlJJVkVUXCIsXG4gIFwiUk9BQ0hcIixcbiAgXCJST0FEU1wiLFxuICBcIlJPQU1TXCIsXG4gIFwiUk9BTlNcIixcbiAgXCJST0FSU1wiLFxuICBcIlJPQVNUXCIsXG4gIFwiUk9CRURcIixcbiAgXCJST0JFU1wiLFxuICBcIlJPQklOXCIsXG4gIFwiUk9CT1RcIixcbiAgXCJST0NLU1wiLFxuICBcIlJPQ0tZXCIsXG4gIFwiUk9ERU9cIixcbiAgXCJST0dFUlwiLFxuICBcIlJPR1VFXCIsXG4gIFwiUk9JRFNcIixcbiAgXCJST0lMU1wiLFxuICBcIlJPSUxZXCIsXG4gIFwiUk9MRVNcIixcbiAgXCJST0xMU1wiLFxuICBcIlJPTUFOXCIsXG4gIFwiUk9NUFNcIixcbiAgXCJST05ET1wiLFxuICBcIlJPT0RTXCIsXG4gIFwiUk9PRlNcIixcbiAgXCJST09LU1wiLFxuICBcIlJPT01TXCIsXG4gIFwiUk9PTVlcIixcbiAgXCJST09TVFwiLFxuICBcIlJPT1RTXCIsXG4gIFwiUk9QRURcIixcbiAgXCJST1BFUlwiLFxuICBcIlJPUEVTXCIsXG4gIFwiUk9TRVNcIixcbiAgXCJST1NJTlwiLFxuICBcIlJPVE9SXCIsXG4gIFwiUk9VR0VcIixcbiAgXCJST1VHSFwiLFxuICBcIlJPVU5EXCIsXG4gIFwiUk9VU0VcIixcbiAgXCJST1VTVFwiLFxuICBcIlJPVVRFXCIsXG4gIFwiUk9VVFNcIixcbiAgXCJST1ZFRFwiLFxuICBcIlJPVkVSXCIsXG4gIFwiUk9WRVNcIixcbiAgXCJST1dBTlwiLFxuICBcIlJPV0RZXCIsXG4gIFwiUk9XRURcIixcbiAgXCJST1dFUlwiLFxuICBcIlJPWUFMXCIsXG4gIFwiUlVCRVNcIixcbiAgXCJSVUJMRVwiLFxuICBcIlJVQ0hFXCIsXG4gIFwiUlVERFlcIixcbiAgXCJSVURFUlwiLFxuICBcIlJVRkZTXCIsXG4gIFwiUlVHQllcIixcbiAgXCJSVUlOR1wiLFxuICBcIlJVSU5TXCIsXG4gIFwiUlVMRURcIixcbiAgXCJSVUxFUlwiLFxuICBcIlJVTEVTXCIsXG4gIFwiUlVNQkFcIixcbiAgXCJSVU1FTlwiLFxuICBcIlJVTU1ZXCIsXG4gIFwiUlVNT1JcIixcbiAgXCJSVU1QU1wiLFxuICBcIlJVTkVTXCIsXG4gIFwiUlVOR1NcIixcbiAgXCJSVU5OWVwiLFxuICBcIlJVTlRTXCIsXG4gIFwiUlVQRUVcIixcbiAgXCJSVVJBTFwiLFxuICBcIlJVU0VTXCIsXG4gIFwiUlVTS1NcIixcbiAgXCJSVVNUU1wiLFxuICBcIlJVU1RZXCIsXG4gIFwiU0FCRVJcIixcbiAgXCJTQUJMRVwiLFxuICBcIlNBQlJBXCIsXG4gIFwiU0FCUkVcIixcbiAgXCJTQUNLU1wiLFxuICBcIlNBRExZXCIsXG4gIFwiU0FGRVJcIixcbiAgXCJTQUZFU1wiLFxuICBcIlNBR0FTXCIsXG4gIFwiU0FHRVNcIixcbiAgXCJTQUhJQlwiLFxuICBcIlNBSUxTXCIsXG4gIFwiU0FJTlRcIixcbiAgXCJTQUlUSFwiLFxuICBcIlNBS0VTXCIsXG4gIFwiU0FMQURcIixcbiAgXCJTQUxFU1wiLFxuICBcIlNBTExZXCIsXG4gIFwiU0FMT05cIixcbiAgXCJTQUxTQVwiLFxuICBcIlNBTFRTXCIsXG4gIFwiU0FMVFlcIixcbiAgXCJTQUxWRVwiLFxuICBcIlNBTFZPXCIsXG4gIFwiU0FNQkFcIixcbiAgXCJTQU5EU1wiLFxuICBcIlNBTkRZXCIsXG4gIFwiU0FORVJcIixcbiAgXCJTQVBQWVwiLFxuICBcIlNBUkFOXCIsXG4gIFwiU0FSR0VcIixcbiAgXCJTQVJJU1wiLFxuICBcIlNBU1NZXCIsXG4gIFwiU0FURURcIixcbiAgXCJTQVRJTlwiLFxuICBcIlNBVFlSXCIsXG4gIFwiU0FVQ0VcIixcbiAgXCJTQVVDWVwiLFxuICBcIlNBVU5BXCIsXG4gIFwiU0FVVEVcIixcbiAgXCJTQVZFRFwiLFxuICBcIlNBVkVSXCIsXG4gIFwiU0FWRVNcIixcbiAgXCJTQVZPUlwiLFxuICBcIlNBVlZZXCIsXG4gIFwiU0FXRURcIixcbiAgXCJTQVhFU1wiLFxuICBcIlNDQUJTXCIsXG4gIFwiU0NBRFNcIixcbiAgXCJTQ0FMRFwiLFxuICBcIlNDQUxFXCIsXG4gIFwiU0NBTFBcIixcbiAgXCJTQ0FMWVwiLFxuICBcIlNDQU1QXCIsXG4gIFwiU0NBTVNcIixcbiAgXCJTQ0FOU1wiLFxuICBcIlNDQU5UXCIsXG4gIFwiU0NBUkVcIixcbiAgXCJTQ0FSRlwiLFxuICBcIlNDQVJQXCIsXG4gIFwiU0NBUlNcIixcbiAgXCJTQ0FSWVwiLFxuICBcIlNDQVRTXCIsXG4gIFwiU0NFTkVcIixcbiAgXCJTQ0VOVFwiLFxuICBcIlNDSE1PXCIsXG4gIFwiU0NIV0FcIixcbiAgXCJTQ0lPTlwiLFxuICBcIlNDT0ZGXCIsXG4gIFwiU0NPTERcIixcbiAgXCJTQ09ORVwiLFxuICBcIlNDT09QXCIsXG4gIFwiU0NPT1RcIixcbiAgXCJTQ09QRVwiLFxuICBcIlNDT1JFXCIsXG4gIFwiU0NPUk5cIixcbiAgXCJTQ09VUlwiLFxuICBcIlNDT1VUXCIsXG4gIFwiU0NPV0xcIixcbiAgXCJTQ09XU1wiLFxuICBcIlNDUkFNXCIsXG4gIFwiU0NSQVBcIixcbiAgXCJTQ1JFV1wiLFxuICBcIlNDUklNXCIsXG4gIFwiU0NSSVBcIixcbiAgXCJTQ1JPRFwiLFxuICBcIlNDUlVCXCIsXG4gIFwiU0NSVU1cIixcbiAgXCJTQ1VCQVwiLFxuICBcIlNDVURJXCIsXG4gIFwiU0NVRE9cIixcbiAgXCJTQ1VEU1wiLFxuICBcIlNDVUZGXCIsXG4gIFwiU0NVTExcIixcbiAgXCJTQ1VNU1wiLFxuICBcIlNDVVJGXCIsXG4gIFwiU0NVWlpcIixcbiAgXCJTRUFMU1wiLFxuICBcIlNFQU1TXCIsXG4gIFwiU0VBTVlcIixcbiAgXCJTRUFSU1wiLFxuICBcIlNFQVRTXCIsXG4gIFwiU0VCVU1cIixcbiAgXCJTRUNDT1wiLFxuICBcIlNFQ1RTXCIsXG4gIFwiU0VEQU5cIixcbiAgXCJTRURFUlwiLFxuICBcIlNFREdFXCIsXG4gIFwiU0VEVU1cIixcbiAgXCJTRUVEU1wiLFxuICBcIlNFRURZXCIsXG4gIFwiU0VFS1NcIixcbiAgXCJTRUVNU1wiLFxuICBcIlNFRVBTXCIsXG4gIFwiU0VFUlNcIixcbiAgXCJTRUdVRVwiLFxuICBcIlNFSU5FXCIsXG4gIFwiU0VJWkVcIixcbiAgXCJTRUxBSFwiLFxuICBcIlNFTEZTXCIsXG4gIFwiU0VMTFNcIixcbiAgXCJTRU1FTlwiLFxuICBcIlNFTUlTXCIsXG4gIFwiU0VORFNcIixcbiAgXCJTRU5TRVwiLFxuICBcIlNFUEFMXCIsXG4gIFwiU0VQSUFcIixcbiAgXCJTRVBPWVwiLFxuICBcIlNFUFRBXCIsXG4gIFwiU0VSRlNcIixcbiAgXCJTRVJHRVwiLFxuICBcIlNFUklGXCIsXG4gIFwiU0VSVU1cIixcbiAgXCJTRVJWRVwiLFxuICBcIlNFUlZPXCIsXG4gIFwiU0VUVVBcIixcbiAgXCJTRVZFTlwiLFxuICBcIlNFVkVSXCIsXG4gIFwiU0VXRURcIixcbiAgXCJTRVdFUlwiLFxuICBcIlNFWEVEXCIsXG4gIFwiU0VYRVNcIixcbiAgXCJTSEFDS1wiLFxuICBcIlNIQURFXCIsXG4gIFwiU0hBRFNcIixcbiAgXCJTSEFEWVwiLFxuICBcIlNIQUZUXCIsXG4gIFwiU0hBR1NcIixcbiAgXCJTSEFIU1wiLFxuICBcIlNIQUtFXCIsXG4gIFwiU0hBS09cIixcbiAgXCJTSEFLWVwiLFxuICBcIlNIQUxFXCIsXG4gIFwiU0hBTExcIixcbiAgXCJTSEFMVFwiLFxuICBcIlNIQU1FXCIsXG4gIFwiU0hBTVNcIixcbiAgXCJTSEFOS1wiLFxuICBcIlNIQVBFXCIsXG4gIFwiU0hBUkRcIixcbiAgXCJTSEFSRVwiLFxuICBcIlNIQVJLXCIsXG4gIFwiU0hBUlBcIixcbiAgXCJTSEFWRVwiLFxuICBcIlNIQVdMXCIsXG4gIFwiU0hBV01cIixcbiAgXCJTSEFZU1wiLFxuICBcIlNIRUFGXCIsXG4gIFwiU0hFQVJcIixcbiAgXCJTSEVEU1wiLFxuICBcIlNIRUVOXCIsXG4gIFwiU0hFRVBcIixcbiAgXCJTSEVFUlwiLFxuICBcIlNIRUVUXCIsXG4gIFwiU0hFSUtcIixcbiAgXCJTSEVMRlwiLFxuICBcIlNIRUxMXCIsXG4gIFwiU0hFUkRcIixcbiAgXCJTSEVXU1wiLFxuICBcIlNISUVEXCIsXG4gIFwiU0hJRVNcIixcbiAgXCJTSElGVFwiLFxuICBcIlNISUxMXCIsXG4gIFwiU0hJTVNcIixcbiAgXCJTSElORVwiLFxuICBcIlNISU5TXCIsXG4gIFwiU0hJTllcIixcbiAgXCJTSElQU1wiLFxuICBcIlNISVJFXCIsXG4gIFwiU0hJUktcIixcbiAgXCJTSElSUlwiLFxuICBcIlNISVJUXCIsXG4gIFwiU0hJVFNcIixcbiAgXCJTSExFUFwiLFxuICBcIlNIT0FMXCIsXG4gIFwiU0hPQVRcIixcbiAgXCJTSE9DS1wiLFxuICBcIlNIT0VTXCIsXG4gIFwiU0hPSklcIixcbiAgXCJTSE9ORVwiLFxuICBcIlNIT09LXCIsXG4gIFwiU0hPT1NcIixcbiAgXCJTSE9PVFwiLFxuICBcIlNIT1BTXCIsXG4gIFwiU0hPUkVcIixcbiAgXCJTSE9STlwiLFxuICBcIlNIT1JUXCIsXG4gIFwiU0hPVFNcIixcbiAgXCJTSE9VVFwiLFxuICBcIlNIT1ZFXCIsXG4gIFwiU0hPV05cIixcbiAgXCJTSE9XU1wiLFxuICBcIlNIT1dZXCIsXG4gIFwiU0hSRURcIixcbiAgXCJTSFJFV1wiLFxuICBcIlNIUlVCXCIsXG4gIFwiU0hSVUdcIixcbiAgXCJTSFVDS1wiLFxuICBcIlNIVU5TXCIsXG4gIFwiU0hVTlRcIixcbiAgXCJTSFVTSFwiLFxuICBcIlNIVVRTXCIsXG4gIFwiU0hZRVJcIixcbiAgXCJTSFlMWVwiLFxuICBcIlNJQllMXCIsXG4gIFwiU0lDS09cIixcbiAgXCJTSUNLU1wiLFxuICBcIlNJREVEXCIsXG4gIFwiU0lERVNcIixcbiAgXCJTSURMRVwiLFxuICBcIlNJRUdFXCIsXG4gIFwiU0lFVkVcIixcbiAgXCJTSUdIU1wiLFxuICBcIlNJR0hUXCIsXG4gIFwiU0lHTUFcIixcbiAgXCJTSUdOU1wiLFxuICBcIlNJTEtTXCIsXG4gIFwiU0lMS1lcIixcbiAgXCJTSUxMU1wiLFxuICBcIlNJTExZXCIsXG4gIFwiU0lMT1NcIixcbiAgXCJTSUxUU1wiLFxuICBcIlNJTkNFXCIsXG4gIFwiU0lORVNcIixcbiAgXCJTSU5FV1wiLFxuICBcIlNJTkdFXCIsXG4gIFwiU0lOR1NcIixcbiAgXCJTSU5LU1wiLFxuICBcIlNJTlVTXCIsXG4gIFwiU0lSRURcIixcbiAgXCJTSVJFRVwiLFxuICBcIlNJUkVOXCIsXG4gIFwiU0lSRVNcIixcbiAgXCJTSVJVUFwiLFxuICBcIlNJU0FMXCIsXG4gIFwiU0lTU1lcIixcbiAgXCJTSVRBUlwiLFxuICBcIlNJVEVEXCIsXG4gIFwiU0lURVNcIixcbiAgXCJTSVRVU1wiLFxuICBcIlNJWEVTXCIsXG4gIFwiU0lYVEhcIixcbiAgXCJTSVhUWVwiLFxuICBcIlNJWkVEXCIsXG4gIFwiU0laRVNcIixcbiAgXCJTS0FURVwiLFxuICBcIlNLRUVUXCIsXG4gIFwiU0tFSU5cIixcbiAgXCJTS0VXU1wiLFxuICBcIlNLSURTXCIsXG4gIFwiU0tJRURcIixcbiAgXCJTS0lFUlwiLFxuICBcIlNLSUVTXCIsXG4gIFwiU0tJRkZcIixcbiAgXCJTS0lMTFwiLFxuICBcIlNLSU1QXCIsXG4gIFwiU0tJTVNcIixcbiAgXCJTS0lOU1wiLFxuICBcIlNLSU5UXCIsXG4gIFwiU0tJUFNcIixcbiAgXCJTS0lSVFwiLFxuICBcIlNLSVRTXCIsXG4gIFwiU0tPQUxcIixcbiAgXCJTS1VMS1wiLFxuICBcIlNLVUxMXCIsXG4gIFwiU0tVTktcIixcbiAgXCJTTEFCU1wiLFxuICBcIlNMQUNLXCIsXG4gIFwiU0xBR1NcIixcbiAgXCJTTEFJTlwiLFxuICBcIlNMQUtFXCIsXG4gIFwiU0xBTVNcIixcbiAgXCJTTEFOR1wiLFxuICBcIlNMQU5UXCIsXG4gIFwiU0xBUFNcIixcbiAgXCJTTEFTSFwiLFxuICBcIlNMQVRFXCIsXG4gIFwiU0xBVFNcIixcbiAgXCJTTEFWRVwiLFxuICBcIlNMQVlTXCIsXG4gIFwiU0xFRFNcIixcbiAgXCJTTEVFS1wiLFxuICBcIlNMRUVQXCIsXG4gIFwiU0xFRVRcIixcbiAgXCJTTEVQVFwiLFxuICBcIlNMRVdTXCIsXG4gIFwiU0xJQ0VcIixcbiAgXCJTTElDS1wiLFxuICBcIlNMSURFXCIsXG4gIFwiU0xJTFlcIixcbiAgXCJTTElNRVwiLFxuICBcIlNMSU1TXCIsXG4gIFwiU0xJTVlcIixcbiAgXCJTTElOR1wiLFxuICBcIlNMSU5LXCIsXG4gIFwiU0xJUFNcIixcbiAgXCJTTElUU1wiLFxuICBcIlNMT0JTXCIsXG4gIFwiU0xPRVNcIixcbiAgXCJTTE9HU1wiLFxuICBcIlNMT01PXCIsXG4gIFwiU0xPT1BcIixcbiAgXCJTTE9QRVwiLFxuICBcIlNMT1BTXCIsXG4gIFwiU0xPU0hcIixcbiAgXCJTTE9USFwiLFxuICBcIlNMT1RTXCIsXG4gIFwiU0xPV1NcIixcbiAgXCJTTFVFRFwiLFxuICBcIlNMVUVTXCIsXG4gIFwiU0xVR1NcIixcbiAgXCJTTFVNUFwiLFxuICBcIlNMVU1TXCIsXG4gIFwiU0xVTkdcIixcbiAgXCJTTFVOS1wiLFxuICBcIlNMVVJQXCIsXG4gIFwiU0xVUlNcIixcbiAgXCJTTFVTSFwiLFxuICBcIlNMVVRTXCIsXG4gIFwiU0xZRVJcIixcbiAgXCJTTFlMWVwiLFxuICBcIlNNQUNLXCIsXG4gIFwiU01BTExcIixcbiAgXCJTTUFSVFwiLFxuICBcIlNNQVNIXCIsXG4gIFwiU01FQVJcIixcbiAgXCJTTUVMTFwiLFxuICBcIlNNRUxUXCIsXG4gIFwiU01JTEVcIixcbiAgXCJTTUlSS1wiLFxuICBcIlNNSVRFXCIsXG4gIFwiU01JVEhcIixcbiAgXCJTTU9DS1wiLFxuICBcIlNNT0dTXCIsXG4gIFwiU01PS0VcIixcbiAgXCJTTU9LWVwiLFxuICBcIlNNT1RFXCIsXG4gIFwiU01VVFNcIixcbiAgXCJTTkFDS1wiLFxuICBcIlNOQUZVXCIsXG4gIFwiU05BR1NcIixcbiAgXCJTTkFJTFwiLFxuICBcIlNOQUtFXCIsXG4gIFwiU05BS1lcIixcbiAgXCJTTkFQU1wiLFxuICBcIlNOQVJFXCIsXG4gIFwiU05BUkZcIixcbiAgXCJTTkFSS1wiLFxuICBcIlNOQVJMXCIsXG4gIFwiU05FQUtcIixcbiAgXCJTTkVFUlwiLFxuICBcIlNOSURFXCIsXG4gIFwiU05JRkZcIixcbiAgXCJTTklQRVwiLFxuICBcIlNOSVBTXCIsXG4gIFwiU05JVFNcIixcbiAgXCJTTk9CU1wiLFxuICBcIlNOT09EXCIsXG4gIFwiU05PT0tcIixcbiAgXCJTTk9PUFwiLFxuICBcIlNOT09UXCIsXG4gIFwiU05PUkVcIixcbiAgXCJTTk9SVFwiLFxuICBcIlNOT1RTXCIsXG4gIFwiU05PVVRcIixcbiAgXCJTTk9XU1wiLFxuICBcIlNOT1dZXCIsXG4gIFwiU05VQlNcIixcbiAgXCJTTlVDS1wiLFxuICBcIlNOVUZGXCIsXG4gIFwiU05VR1NcIixcbiAgXCJTT0FLU1wiLFxuICBcIlNPQVBTXCIsXG4gIFwiU09BUFlcIixcbiAgXCJTT0FSU1wiLFxuICBcIlNPQkVSXCIsXG4gIFwiU09DS09cIixcbiAgXCJTT0NLU1wiLFxuICBcIlNPQ0xFXCIsXG4gIFwiU09EQVNcIixcbiAgXCJTT0ZBU1wiLFxuICBcIlNPRlRZXCIsXG4gIFwiU09HR1lcIixcbiAgXCJTT0lMU1wiLFxuICBcIlNPTEFSXCIsXG4gIFwiU09MRURcIixcbiAgXCJTT0xFU1wiLFxuICBcIlNPTElEXCIsXG4gIFwiU09MT1NcIixcbiAgXCJTT0xWRVwiLFxuICBcIlNPTUFTXCIsXG4gIFwiU09OQVJcIixcbiAgXCJTT05HU1wiLFxuICBcIlNPTklDXCIsXG4gIFwiU09OTllcIixcbiAgXCJTT09USFwiLFxuICBcIlNPT1RTXCIsXG4gIFwiU09PVFlcIixcbiAgXCJTT1BQWVwiLFxuICBcIlNPUkVSXCIsXG4gIFwiU09SRVNcIixcbiAgXCJTT1JSWVwiLFxuICBcIlNPUlRBXCIsXG4gIFwiU09SVFNcIixcbiAgXCJTT1VMU1wiLFxuICBcIlNPVU5EXCIsXG4gIFwiU09VUFNcIixcbiAgXCJTT1VQWVwiLFxuICBcIlNPVVJTXCIsXG4gIFwiU09VU0VcIixcbiAgXCJTT1VUSFwiLFxuICBcIlNPV0VEXCIsXG4gIFwiU1BBQ0VcIixcbiAgXCJTUEFDWVwiLFxuICBcIlNQQURFXCIsXG4gIFwiU1BBS0VcIixcbiAgXCJTUEFOR1wiLFxuICBcIlNQQU5LXCIsXG4gIFwiU1BBTlNcIixcbiAgXCJTUEFSRVwiLFxuICBcIlNQQVJLXCIsXG4gIFwiU1BBUlNcIixcbiAgXCJTUEFTTVwiLFxuICBcIlNQQVRFXCIsXG4gIFwiU1BBVFNcIixcbiAgXCJTUEFXTlwiLFxuICBcIlNQQVlTXCIsXG4gIFwiU1BBWlpcIixcbiAgXCJTUEVBS1wiLFxuICBcIlNQRUFSXCIsXG4gIFwiU1BFQ0tcIixcbiAgXCJTUEVDU1wiLFxuICBcIlNQRUVEXCIsXG4gIFwiU1BFTExcIixcbiAgXCJTUEVMVFwiLFxuICBcIlNQRU5EXCIsXG4gIFwiU1BFTlRcIixcbiAgXCJTUEVSTVwiLFxuICBcIlNQRVdTXCIsXG4gIFwiU1BJQ0VcIixcbiAgXCJTUElDU1wiLFxuICBcIlNQSUNZXCIsXG4gIFwiU1BJRURcIixcbiAgXCJTUElFTFwiLFxuICBcIlNQSUVTXCIsXG4gIFwiU1BJRkZcIixcbiAgXCJTUElLRVwiLFxuICBcIlNQSUtZXCIsXG4gIFwiU1BJTExcIixcbiAgXCJTUElMVFwiLFxuICBcIlNQSU5FXCIsXG4gIFwiU1BJTlNcIixcbiAgXCJTUElSRVwiLFxuICBcIlNQSVRFXCIsXG4gIFwiU1BJVFNcIixcbiAgXCJTUElUWlwiLFxuICBcIlNQSVZTXCIsXG4gIFwiU1BMQVRcIixcbiAgXCJTUExBWVwiLFxuICBcIlNQTElUXCIsXG4gIFwiU1BPSUxcIixcbiAgXCJTUE9LRVwiLFxuICBcIlNQT09GXCIsXG4gIFwiU1BPT0tcIixcbiAgXCJTUE9PTFwiLFxuICBcIlNQT09OXCIsXG4gIFwiU1BPT1JcIixcbiAgXCJTUE9SRVwiLFxuICBcIlNQT1JUXCIsXG4gIFwiU1BPVFNcIixcbiAgXCJTUE9VVFwiLFxuICBcIlNQUkFUXCIsXG4gIFwiU1BSQVlcIixcbiAgXCJTUFJFRVwiLFxuICBcIlNQUklHXCIsXG4gIFwiU1BSSVRcIixcbiAgXCJTUFJPR1wiLFxuICBcIlNQUlVFXCIsXG4gIFwiU1BVRFNcIixcbiAgXCJTUFVFRFwiLFxuICBcIlNQVU1FXCIsXG4gIFwiU1BVTktcIixcbiAgXCJTUFVSTlwiLFxuICBcIlNQVVJTXCIsXG4gIFwiU1BVUlRcIixcbiAgXCJTUVVBQlwiLFxuICBcIlNRVUFEXCIsXG4gIFwiU1FVQVRcIixcbiAgXCJTUVVBV1wiLFxuICBcIlNRVUlCXCIsXG4gIFwiU1FVSURcIixcbiAgXCJTVEFCU1wiLFxuICBcIlNUQUNLXCIsXG4gIFwiU1RBRkZcIixcbiAgXCJTVEFHRVwiLFxuICBcIlNUQUdTXCIsXG4gIFwiU1RBR1lcIixcbiAgXCJTVEFJRFwiLFxuICBcIlNUQUlOXCIsXG4gIFwiU1RBSVJcIixcbiAgXCJTVEFLRVwiLFxuICBcIlNUQUxFXCIsXG4gIFwiU1RBTEtcIixcbiAgXCJTVEFMTFwiLFxuICBcIlNUQU1QXCIsXG4gIFwiU1RBTkRcIixcbiAgXCJTVEFOS1wiLFxuICBcIlNUQVBIXCIsXG4gIFwiU1RBUkVcIixcbiAgXCJTVEFSS1wiLFxuICBcIlNUQVJTXCIsXG4gIFwiU1RBUlRcIixcbiAgXCJTVEFTSFwiLFxuICBcIlNUQVRFXCIsXG4gIFwiU1RBVFNcIixcbiAgXCJTVEFWRVwiLFxuICBcIlNUQVlTXCIsXG4gIFwiU1RFQURcIixcbiAgXCJTVEVBS1wiLFxuICBcIlNURUFMXCIsXG4gIFwiU1RFQU1cIixcbiAgXCJTVEVFRFwiLFxuICBcIlNURUVMXCIsXG4gIFwiU1RFRVBcIixcbiAgXCJTVEVFUlwiLFxuICBcIlNURUlOXCIsXG4gIFwiU1RFTEFcIixcbiAgXCJTVEVMRVwiLFxuICBcIlNURU1TXCIsXG4gIFwiU1RFTk9cIixcbiAgXCJTVEVQU1wiLFxuICBcIlNURVJOXCIsXG4gIFwiU1RFVFNcIixcbiAgXCJTVEVXU1wiLFxuICBcIlNUSUNLXCIsXG4gIFwiU1RJRURcIixcbiAgXCJTVElFU1wiLFxuICBcIlNUSUZGXCIsXG4gIFwiU1RJTEVcIixcbiAgXCJTVElMTFwiLFxuICBcIlNUSUxUXCIsXG4gIFwiU1RJTkdcIixcbiAgXCJTVElOS1wiLFxuICBcIlNUSU5UXCIsXG4gIFwiU1RJUlNcIixcbiAgXCJTVE9BU1wiLFxuICBcIlNUT0FUXCIsXG4gIFwiU1RPQ0tcIixcbiAgXCJTVE9HWVwiLFxuICBcIlNUT0lDXCIsXG4gIFwiU1RPS0VcIixcbiAgXCJTVE9MRVwiLFxuICBcIlNUT01BXCIsXG4gIFwiU1RPTVBcIixcbiAgXCJTVE9ORVwiLFxuICBcIlNUT05ZXCIsXG4gIFwiU1RPT0RcIixcbiAgXCJTVE9PTFwiLFxuICBcIlNUT09QXCIsXG4gIFwiU1RPUFNcIixcbiAgXCJTVE9SRVwiLFxuICBcIlNUT1JLXCIsXG4gIFwiU1RPUk1cIixcbiAgXCJTVE9SWVwiLFxuICBcIlNUT1VQXCIsXG4gIFwiU1RPVVRcIixcbiAgXCJTVE9WRVwiLFxuICBcIlNUT1dTXCIsXG4gIFwiU1RSQVBcIixcbiAgXCJTVFJBV1wiLFxuICBcIlNUUkFZXCIsXG4gIFwiU1RSRVBcIixcbiAgXCJTVFJFV1wiLFxuICBcIlNUUklQXCIsXG4gIFwiU1RST1BcIixcbiAgXCJTVFJVTVwiLFxuICBcIlNUUlVUXCIsXG4gIFwiU1RVQlNcIixcbiAgXCJTVFVDS1wiLFxuICBcIlNUVURTXCIsXG4gIFwiU1RVRFlcIixcbiAgXCJTVFVGRlwiLFxuICBcIlNUVU1QXCIsXG4gIFwiU1RVTkdcIixcbiAgXCJTVFVOS1wiLFxuICBcIlNUVU5TXCIsXG4gIFwiU1RVTlRcIixcbiAgXCJTVFlFU1wiLFxuICBcIlNUWUxFXCIsXG4gIFwiU1RZTElcIixcbiAgXCJTVUFWRVwiLFxuICBcIlNVQ0tTXCIsXG4gIFwiU1VFREVcIixcbiAgXCJTVUdBUlwiLFxuICBcIlNVSU5HXCIsXG4gIFwiU1VJVEVcIixcbiAgXCJTVUlUU1wiLFxuICBcIlNVTEZBXCIsXG4gIFwiU1VMS1NcIixcbiAgXCJTVUxLWVwiLFxuICBcIlNVTExZXCIsXG4gIFwiU1VNQUNcIixcbiAgXCJTVU1NQVwiLFxuICBcIlNVTVBTXCIsXG4gIFwiU1VOTllcIixcbiAgXCJTVU5VUFwiLFxuICBcIlNVUEVSXCIsXG4gIFwiU1VQUkFcIixcbiAgXCJTVVJBU1wiLFxuICBcIlNVUkRTXCIsXG4gIFwiU1VSRVJcIixcbiAgXCJTVVJGU1wiLFxuICBcIlNVUkdFXCIsXG4gIFwiU1VSTFlcIixcbiAgXCJTVVNISVwiLFxuICBcIlNVVFJBXCIsXG4gIFwiU1dBQlNcIixcbiAgXCJTV0FHU1wiLFxuICBcIlNXQUlOXCIsXG4gIFwiU1dBTUlcIixcbiAgXCJTV0FNUFwiLFxuICBcIlNXQU5LXCIsXG4gIFwiU1dBTlNcIixcbiAgXCJTV0FQU1wiLFxuICBcIlNXQVJEXCIsXG4gIFwiU1dBUkVcIixcbiAgXCJTV0FSRlwiLFxuICBcIlNXQVJNXCIsXG4gIFwiU1dBUlRcIixcbiAgXCJTV0FTSFwiLFxuICBcIlNXQVRIXCIsXG4gIFwiU1dBVFNcIixcbiAgXCJTV0FZU1wiLFxuICBcIlNXRUFSXCIsXG4gIFwiU1dFQVRcIixcbiAgXCJTV0VERVwiLFxuICBcIlNXRUVQXCIsXG4gIFwiU1dFRVRcIixcbiAgXCJTV0VMTFwiLFxuICBcIlNXRVBUXCIsXG4gIFwiU1dJRlRcIixcbiAgXCJTV0lHU1wiLFxuICBcIlNXSUxMXCIsXG4gIFwiU1dJTVNcIixcbiAgXCJTV0lORVwiLFxuICBcIlNXSU5HXCIsXG4gIFwiU1dJUEVcIixcbiAgXCJTV0lSTFwiLFxuICBcIlNXSVNIXCIsXG4gIFwiU1dJU1NcIixcbiAgXCJTV0lWRVwiLFxuICBcIlNXT09OXCIsXG4gIFwiU1dPT1BcIixcbiAgXCJTV09SRFwiLFxuICBcIlNXT1JFXCIsXG4gIFwiU1dPUk5cIixcbiAgXCJTV1VOR1wiLFxuICBcIlNZTFBIXCIsXG4gIFwiU1lOQ0hcIixcbiAgXCJTWU5DU1wiLFxuICBcIlNZTk9EXCIsXG4gIFwiU1lSVVBcIixcbiAgXCJUQUJCWVwiLFxuICBcIlRBQkxFXCIsXG4gIFwiVEFCT09cIixcbiAgXCJUQUJPUlwiLFxuICBcIlRBQlVTXCIsXG4gIFwiVEFDSVRcIixcbiAgXCJUQUNLU1wiLFxuICBcIlRBQ0tZXCIsXG4gIFwiVEFDT1NcIixcbiAgXCJUQUVMU1wiLFxuICBcIlRBRkZZXCIsXG4gIFwiVEFJTFNcIixcbiAgXCJUQUlOVFwiLFxuICBcIlRBS0VOXCIsXG4gIFwiVEFLRVJcIixcbiAgXCJUQUtFU1wiLFxuICBcIlRBTENTXCIsXG4gIFwiVEFMRVNcIixcbiAgXCJUQUxLU1wiLFxuICBcIlRBTEtZXCIsXG4gIFwiVEFMTFlcIixcbiAgXCJUQUxPTlwiLFxuICBcIlRBTFVTXCIsXG4gIFwiVEFNRURcIixcbiAgXCJUQU1FUlwiLFxuICBcIlRBTUVTXCIsXG4gIFwiVEFNUFNcIixcbiAgXCJUQU5HT1wiLFxuICBcIlRBTkdTXCIsXG4gIFwiVEFOR1lcIixcbiAgXCJUQU5LU1wiLFxuICBcIlRBTlNZXCIsXG4gIFwiVEFQRURcIixcbiAgXCJUQVBFUlwiLFxuICBcIlRBUEVTXCIsXG4gIFwiVEFQSVJcIixcbiAgXCJUQVBJU1wiLFxuICBcIlRBUkRZXCIsXG4gIFwiVEFSRVNcIixcbiAgXCJUQVJOU1wiLFxuICBcIlRBUk9TXCIsXG4gIFwiVEFST1RcIixcbiAgXCJUQVJQU1wiLFxuICBcIlRBUlJZXCIsXG4gIFwiVEFSVFNcIixcbiAgXCJUQVNLU1wiLFxuICBcIlRBU1RFXCIsXG4gIFwiVEFTVFlcIixcbiAgXCJUQVRFUlwiLFxuICBcIlRBVFRZXCIsXG4gIFwiVEFVTlRcIixcbiAgXCJUQVVQRVwiLFxuICBcIlRBV05ZXCIsXG4gIFwiVEFYRURcIixcbiAgXCJUQVhFU1wiLFxuICBcIlRBWElTXCIsXG4gIFwiVEFYT0xcIixcbiAgXCJUQVhPTlwiLFxuICBcIlRFQUNIXCIsXG4gIFwiVEVBS1NcIixcbiAgXCJURUFMU1wiLFxuICBcIlRFQU1TXCIsXG4gIFwiVEVBUlNcIixcbiAgXCJURUFSWVwiLFxuICBcIlRFQVNFXCIsXG4gIFwiVEVBVFNcIixcbiAgXCJURUNIU1wiLFxuICBcIlRFQ0hZXCIsXG4gIFwiVEVERFlcIixcbiAgXCJURUVNU1wiLFxuICBcIlRFRU5TXCIsXG4gIFwiVEVFTllcIixcbiAgXCJURUVUSFwiLFxuICBcIlRFTEVYXCIsXG4gIFwiVEVMTFNcIixcbiAgXCJURUxMWVwiLFxuICBcIlRFTVBJXCIsXG4gIFwiVEVNUE9cIixcbiAgXCJURU1QU1wiLFxuICBcIlRFTVBUXCIsXG4gIFwiVEVOQ0hcIixcbiAgXCJURU5EU1wiLFxuICBcIlRFTkVUXCIsXG4gIFwiVEVOT05cIixcbiAgXCJURU5PUlwiLFxuICBcIlRFTlNFXCIsXG4gIFwiVEVOVEhcIixcbiAgXCJURU5UU1wiLFxuICBcIlRFUEVFXCIsXG4gIFwiVEVQSURcIixcbiAgXCJURVJDRVwiLFxuICBcIlRFUk1TXCIsXG4gIFwiVEVSTlNcIixcbiAgXCJURVJSQVwiLFxuICBcIlRFUlJZXCIsXG4gIFwiVEVSU0VcIixcbiAgXCJURVNMQVwiLFxuICBcIlRFU1RTXCIsXG4gIFwiVEVTVFlcIixcbiAgXCJURVRSQVwiLFxuICBcIlRFWFRTXCIsXG4gIFwiVEhBTkVcIixcbiAgXCJUSEFOS1wiLFxuICBcIlRIQU5YXCIsXG4gIFwiVEhBV1NcIixcbiAgXCJUSEVGVFwiLFxuICBcIlRIRU1FXCIsXG4gIFwiVEhFUkVcIixcbiAgXCJUSEVSTVwiLFxuICBcIlRIRVNFXCIsXG4gIFwiVEhFVEFcIixcbiAgXCJUSEVXU1wiLFxuICBcIlRISUNLXCIsXG4gIFwiVEhJRUZcIixcbiAgXCJUSElHSFwiLFxuICBcIlRISU5FXCIsXG4gIFwiVEhJTkdcIixcbiAgXCJUSElOS1wiLFxuICBcIlRISU5TXCIsXG4gIFwiVEhJUkRcIixcbiAgXCJUSE9OR1wiLFxuICBcIlRIT1JOXCIsXG4gIFwiVEhPU0VcIixcbiAgXCJUSFJFRVwiLFxuICBcIlRIUkVXXCIsXG4gIFwiVEhST0JcIixcbiAgXCJUSFJPRVwiLFxuICBcIlRIUk9XXCIsXG4gIFwiVEhSVU1cIixcbiAgXCJUSFVEU1wiLFxuICBcIlRIVUdTXCIsXG4gIFwiVEhVTUJcIixcbiAgXCJUSFVNUFwiLFxuICBcIlRIVU5LXCIsXG4gIFwiVEhZTUVcIixcbiAgXCJUSUFSQVwiLFxuICBcIlRJQklBXCIsXG4gIFwiVElDS1NcIixcbiAgXCJUSURBTFwiLFxuICBcIlRJREVEXCIsXG4gIFwiVElERVNcIixcbiAgXCJUSUVSU1wiLFxuICBcIlRJRkZTXCIsXG4gIFwiVElHRVJcIixcbiAgXCJUSUtFU1wiLFxuICBcIlRJS0lTXCIsXG4gIFwiVElMREVcIixcbiAgXCJUSUxFRFwiLFxuICBcIlRJTEVSXCIsXG4gIFwiVElMRVNcIixcbiAgXCJUSUxMU1wiLFxuICBcIlRJTFRIXCIsXG4gIFwiVElMVFNcIixcbiAgXCJUSU1FRFwiLFxuICBcIlRJTUVSXCIsXG4gIFwiVElNRVNcIixcbiAgXCJUSU1JRFwiLFxuICBcIlRJTkVTXCIsXG4gIFwiVElOR0VcIixcbiAgXCJUSU5HU1wiLFxuICBcIlRJTk5ZXCIsXG4gIFwiVElOVFNcIixcbiAgXCJUSVBQWVwiLFxuICBcIlRJUFNZXCIsXG4gIFwiVElSRURcIixcbiAgXCJUSVJFU1wiLFxuICBcIlRJUk9TXCIsXG4gIFwiVElUQU5cIixcbiAgXCJUSVRFUlwiLFxuICBcIlRJVEhFXCIsXG4gIFwiVElUTEVcIixcbiAgXCJUSVRSRVwiLFxuICBcIlRJVFRZXCIsXG4gIFwiVElaWllcIixcbiAgXCJUT0FEU1wiLFxuICBcIlRPQURZXCIsXG4gIFwiVE9BU1RcIixcbiAgXCJUT0RBWVwiLFxuICBcIlRPRERZXCIsXG4gIFwiVE9GRlNcIixcbiAgXCJUT0ZGWVwiLFxuICBcIlRPR0FTXCIsXG4gIFwiVE9JTEVcIixcbiAgXCJUT0lMU1wiLFxuICBcIlRPS0VEXCIsXG4gIFwiVE9LRU5cIixcbiAgXCJUT0tFU1wiLFxuICBcIlRPTExTXCIsXG4gIFwiVE9NQlNcIixcbiAgXCJUT01FU1wiLFxuICBcIlRPTU1ZXCIsXG4gIFwiVE9OQUxcIixcbiAgXCJUT05FRFwiLFxuICBcIlRPTkVSXCIsXG4gIFwiVE9ORVNcIixcbiAgXCJUT05HU1wiLFxuICBcIlRPTklDXCIsXG4gIFwiVE9PTFNcIixcbiAgXCJUT09OU1wiLFxuICBcIlRPT1RIXCIsXG4gIFwiVE9PVFNcIixcbiAgXCJUT1BBWlwiLFxuICBcIlRPUEVEXCIsXG4gIFwiVE9QRVNcIixcbiAgXCJUT1BJQ1wiLFxuICBcIlRPUE9JXCIsXG4gIFwiVE9QT1NcIixcbiAgXCJUT1FVRVwiLFxuICBcIlRPUkNIXCIsXG4gIFwiVE9SSUNcIixcbiAgXCJUT1JTSVwiLFxuICBcIlRPUlNPXCIsXG4gIFwiVE9SVEVcIixcbiAgXCJUT1JUU1wiLFxuICBcIlRPUlVTXCIsXG4gIFwiVE9UQUxcIixcbiAgXCJUT1RFRFwiLFxuICBcIlRPVEVNXCIsXG4gIFwiVE9URVNcIixcbiAgXCJUT1RUWVwiLFxuICBcIlRPVUdIXCIsXG4gIFwiVE9VUlNcIixcbiAgXCJUT1VUU1wiLFxuICBcIlRPV0VMXCIsXG4gIFwiVE9XRVJcIixcbiAgXCJUT1dOU1wiLFxuICBcIlRPWElDXCIsXG4gIFwiVE9YSU5cIixcbiAgXCJUT1lFRFwiLFxuICBcIlRPWU9OXCIsXG4gIFwiVFJBQ0VcIixcbiAgXCJUUkFDS1wiLFxuICBcIlRSQUNUXCIsXG4gIFwiVFJBREVcIixcbiAgXCJUUkFJTFwiLFxuICBcIlRSQUlOXCIsXG4gIFwiVFJBSVRcIixcbiAgXCJUUkFNUFwiLFxuICBcIlRSQU1TXCIsXG4gIFwiVFJBTlNcIixcbiAgXCJUUkFQU1wiLFxuICBcIlRSQVNIXCIsXG4gIFwiVFJBV0xcIixcbiAgXCJUUkFZU1wiLFxuICBcIlRSRUFEXCIsXG4gIFwiVFJFQVRcIixcbiAgXCJUUkVFRFwiLFxuICBcIlRSRUVTXCIsXG4gIFwiVFJFS1NcIixcbiAgXCJUUkVORFwiLFxuICBcIlRSRVNTXCIsXG4gIFwiVFJFV1NcIixcbiAgXCJUUkVZU1wiLFxuICBcIlRSSUFEXCIsXG4gIFwiVFJJQUxcIixcbiAgXCJUUklCRVwiLFxuICBcIlRSSUNFXCIsXG4gIFwiVFJJQ0tcIixcbiAgXCJUUklFRFwiLFxuICBcIlRSSUVSXCIsXG4gIFwiVFJJRVNcIixcbiAgXCJUUklLRVwiLFxuICBcIlRSSUxMXCIsXG4gIFwiVFJJTVNcIixcbiAgXCJUUklPU1wiLFxuICBcIlRSSVBFXCIsXG4gIFwiVFJJUFNcIixcbiAgXCJUUklURVwiLFxuICBcIlRST0xMXCIsXG4gIFwiVFJPTVBcIixcbiAgXCJUUk9PUFwiLFxuICBcIlRST1RIXCIsXG4gIFwiVFJPVFNcIixcbiAgXCJUUk9VVFwiLFxuICBcIlRST1ZFXCIsXG4gIFwiVFJPV1NcIixcbiAgXCJUUlVDRVwiLFxuICBcIlRSVUNLXCIsXG4gIFwiVFJVRURcIixcbiAgXCJUUlVFUlwiLFxuICBcIlRSVUVTXCIsXG4gIFwiVFJVTFlcIixcbiAgXCJUUlVNUFwiLFxuICBcIlRSVU5LXCIsXG4gIFwiVFJVU1NcIixcbiAgXCJUUlVTVFwiLFxuICBcIlRSVVRIXCIsXG4gIFwiVFJZU1RcIixcbiAgXCJUU0FSU1wiLFxuICBcIlRVQU5TXCIsXG4gIFwiVFVCQUxcIixcbiAgXCJUVUJBU1wiLFxuICBcIlRVQkJZXCIsXG4gIFwiVFVCRURcIixcbiAgXCJUVUJFUlwiLFxuICBcIlRVQkVTXCIsXG4gIFwiVFVDS1NcIixcbiAgXCJUVUZUU1wiLFxuICBcIlRVTElQXCIsXG4gIFwiVFVMTEVcIixcbiAgXCJUVU1NWVwiLFxuICBcIlRVTU9SXCIsXG4gIFwiVFVOQVNcIixcbiAgXCJUVU5FRFwiLFxuICBcIlRVTkVSXCIsXG4gIFwiVFVORVNcIixcbiAgXCJUVU5JQ1wiLFxuICBcIlRVTk5ZXCIsXG4gIFwiVFVQTEVcIixcbiAgXCJUVVJCT1wiLFxuICBcIlRVUkRTXCIsXG4gIFwiVFVSRlNcIixcbiAgXCJUVVJGWVwiLFxuICBcIlRVUk5TXCIsXG4gIFwiVFVSUFNcIixcbiAgXCJUVVNLU1wiLFxuICBcIlRVU0tZXCIsXG4gIFwiVFVUT1JcIixcbiAgXCJUVVRUSVwiLFxuICBcIlRVVFVTXCIsXG4gIFwiVFVYRVNcIixcbiAgXCJUV0FJTlwiLFxuICBcIlRXQU5HXCIsXG4gIFwiVFdBVFNcIixcbiAgXCJUV0VBS1wiLFxuICBcIlRXRUVEXCIsXG4gIFwiVFdFRVRcIixcbiAgXCJUV0VSUFwiLFxuICBcIlRXSUNFXCIsXG4gIFwiVFdJR1NcIixcbiAgXCJUV0lMTFwiLFxuICBcIlRXSU5FXCIsXG4gIFwiVFdJTktcIixcbiAgXCJUV0lOU1wiLFxuICBcIlRXSU5ZXCIsXG4gIFwiVFdJUkxcIixcbiAgXCJUV0lSUFwiLFxuICBcIlRXSVNUXCIsXG4gIFwiVFdJVFNcIixcbiAgXCJUV0lYVFwiLFxuICBcIlRZSU5HXCIsXG4gIFwiVFlLRVNcIixcbiAgXCJUWVBFRFwiLFxuICBcIlRZUEVTXCIsXG4gIFwiVFlQT1NcIixcbiAgXCJUWVJFU1wiLFxuICBcIlRZUk9TXCIsXG4gIFwiVFpBUlNcIixcbiAgXCJVRERFUlwiLFxuICBcIlVLQVNFXCIsXG4gIFwiVUxDRVJcIixcbiAgXCJVTE5BU1wiLFxuICBcIlVMVFJBXCIsXG4gIFwiVU1CRUxcIixcbiAgXCJVTUJFUlwiLFxuICBcIlVNQlJBXCIsXG4gIFwiVU1JQUtcIixcbiAgXCJVTVBFRFwiLFxuICBcIlVOQVBUXCIsXG4gIFwiVU5BUk1cIixcbiAgXCJVTkFSWVwiLFxuICBcIlVOQkFOXCIsXG4gIFwiVU5CQVJcIixcbiAgXCJVTkJPWFwiLFxuICBcIlVOQ0FQXCIsXG4gIFwiVU5DTEVcIixcbiAgXCJVTkNVVFwiLFxuICBcIlVOREVSXCIsXG4gIFwiVU5ESURcIixcbiAgXCJVTkRVRVwiLFxuICBcIlVORkVEXCIsXG4gIFwiVU5GSVRcIixcbiAgXCJVTkhJUFwiLFxuICBcIlVOSUZZXCIsXG4gIFwiVU5JT05cIixcbiAgXCJVTklURVwiLFxuICBcIlVOSVRTXCIsXG4gIFwiVU5JVFlcIixcbiAgXCJVTkxJVFwiLFxuICBcIlVOTUFOXCIsXG4gIFwiVU5NRVRcIixcbiAgXCJVTlBFR1wiLFxuICBcIlVOUElOXCIsXG4gIFwiVU5SSUdcIixcbiAgXCJVTlNBWVwiLFxuICBcIlVOU0VFXCIsXG4gIFwiVU5TRVRcIixcbiAgXCJVTlNFWFwiLFxuICBcIlVOVElFXCIsXG4gIFwiVU5USUxcIixcbiAgXCJVTldFRFwiLFxuICBcIlVOWklQXCIsXG4gIFwiVVBFTkRcIixcbiAgXCJVUFBFRFwiLFxuICBcIlVQUEVSXCIsXG4gIFwiVVBTRVRcIixcbiAgXCJVUkJBTlwiLFxuICBcIlVSR0VEXCIsXG4gIFwiVVJHRVJcIixcbiAgXCJVUkdFU1wiLFxuICBcIlVSSU5FXCIsXG4gIFwiVVNBR0VcIixcbiAgXCJVU0VSU1wiLFxuICBcIlVTSEVSXCIsXG4gIFwiVVNJTkdcIixcbiAgXCJVU1VBTFwiLFxuICBcIlVTVVJQXCIsXG4gIFwiVVNVUllcIixcbiAgXCJVVEVSSVwiLFxuICBcIlVUVEVSXCIsXG4gIFwiVVZVTEFcIixcbiAgXCJWQUNVQVwiLFxuICBcIlZBR1VFXCIsXG4gIFwiVkFJTFNcIixcbiAgXCJWQUxFU1wiLFxuICBcIlZBTEVUXCIsXG4gIFwiVkFMSURcIixcbiAgXCJWQUxPUlwiLFxuICBcIlZBTFVFXCIsXG4gIFwiVkFMVkVcIixcbiAgXCJWQU1QU1wiLFxuICBcIlZBTkVTXCIsXG4gIFwiVkFQRVNcIixcbiAgXCJWQVBJRFwiLFxuICBcIlZBUE9SXCIsXG4gIFwiVkFTRVNcIixcbiAgXCJWQVVMVFwiLFxuICBcIlZBVU5UXCIsXG4gIFwiVkVFUFNcIixcbiAgXCJWRUVSU1wiLFxuICBcIlZFR0FOXCIsXG4gIFwiVkVJTFNcIixcbiAgXCJWRUlOU1wiLFxuICBcIlZFTEFSXCIsXG4gIFwiVkVMRFNcIixcbiAgXCJWRUxEVFwiLFxuICBcIlZFTkFMXCIsXG4gIFwiVkVORFNcIixcbiAgXCJWRU5PTVwiLFxuICBcIlZFTlRTXCIsXG4gIFwiVkVOVUVcIixcbiAgXCJWRVJCU1wiLFxuICBcIlZFUkdFXCIsXG4gIFwiVkVSU0VcIixcbiAgXCJWRVJTT1wiLFxuICBcIlZFUlNUXCIsXG4gIFwiVkVSVkVcIixcbiAgXCJWRVNUU1wiLFxuICBcIlZFVENIXCIsXG4gIFwiVkVYRURcIixcbiAgXCJWRVhFU1wiLFxuICBcIlZJQUxTXCIsXG4gIFwiVklBTkRcIixcbiAgXCJWSUJFU1wiLFxuICBcIlZJQ0FSXCIsXG4gIFwiVklDRVNcIixcbiAgXCJWSURFT1wiLFxuICBcIlZJRVdTXCIsXG4gIFwiVklHSUxcIixcbiAgXCJWSUdPUlwiLFxuICBcIlZJTEVSXCIsXG4gIFwiVklMTEFcIixcbiAgXCJWSUxMSVwiLFxuICBcIlZJTkNBXCIsXG4gIFwiVklORVNcIixcbiAgXCJWSU5ZTFwiLFxuICBcIlZJT0xBXCIsXG4gIFwiVklPTFNcIixcbiAgXCJWSVBFUlwiLFxuICBcIlZJUkFMXCIsXG4gIFwiVklSRU9cIixcbiAgXCJWSVJVU1wiLFxuICBcIlZJU0FTXCIsXG4gIFwiVklTRVNcIixcbiAgXCJWSVNJVFwiLFxuICBcIlZJU09SXCIsXG4gIFwiVklTVEFcIixcbiAgXCJWSVRBTFwiLFxuICBcIlZJVEFTXCIsXG4gIFwiVklWQVNcIixcbiAgXCJWSVZJRFwiLFxuICBcIlZJWEVOXCIsXG4gIFwiVklaT1JcIixcbiAgXCJWT0NBTFwiLFxuICBcIlZPREtBXCIsXG4gIFwiVk9HVUVcIixcbiAgXCJWT0lDRVwiLFxuICBcIlZPSURTXCIsXG4gIFwiVk9JTEFcIixcbiAgXCJWT0lMRVwiLFxuICBcIlZPTFRTXCIsXG4gIFwiVk9NSVRcIixcbiAgXCJWT1RFRFwiLFxuICBcIlZPVEVSXCIsXG4gIFwiVk9URVNcIixcbiAgXCJWT1VDSFwiLFxuICBcIlZPV0VEXCIsXG4gIFwiVk9XRUxcIixcbiAgXCJWT1hFTFwiLFxuICBcIlZST09NXCIsXG4gIFwiVlVMVkFcIixcbiAgXCJWWUlOR1wiLFxuICBcIldBQ0tPXCIsXG4gIFwiV0FDS1lcIixcbiAgXCJXQURFRFwiLFxuICBcIldBREVSXCIsXG4gIFwiV0FERVNcIixcbiAgXCJXQURJU1wiLFxuICBcIldBRkVSXCIsXG4gIFwiV0FGVFNcIixcbiAgXCJXQUdFRFwiLFxuICBcIldBR0VSXCIsXG4gIFwiV0FHRVNcIixcbiAgXCJXQUdPTlwiLFxuICBcIldBSE9PXCIsXG4gIFwiV0FJRlNcIixcbiAgXCJXQUlMU1wiLFxuICBcIldBSVNUXCIsXG4gIFwiV0FJVFNcIixcbiAgXCJXQUlWRVwiLFxuICBcIldBS0VEXCIsXG4gIFwiV0FLRU5cIixcbiAgXCJXQUtFU1wiLFxuICBcIldBTEVTXCIsXG4gIFwiV0FMS1NcIixcbiAgXCJXQUxMU1wiLFxuICBcIldBTFRaXCIsXG4gIFwiV0FORFNcIixcbiAgXCJXQU5FRFwiLFxuICBcIldBTkVTXCIsXG4gIFwiV0FOVFNcIixcbiAgXCJXQVJEU1wiLFxuICBcIldBUkVTXCIsXG4gIFwiV0FSTVNcIixcbiAgXCJXQVJOU1wiLFxuICBcIldBUlBTXCIsXG4gIFwiV0FSVFNcIixcbiAgXCJXQVNIWVwiLFxuICBcIldBU1BTXCIsXG4gIFwiV0FTUFlcIixcbiAgXCJXQVNURVwiLFxuICBcIldBVENIXCIsXG4gIFwiV0FURVJcIixcbiAgXCJXQVRUU1wiLFxuICBcIldBVkVEXCIsXG4gIFwiV0FWRVJcIixcbiAgXCJXQVZFU1wiLFxuICBcIldBWEVEXCIsXG4gIFwiV0FYRU5cIixcbiAgXCJXQVhFU1wiLFxuICBcIldBWk9PXCIsXG4gIFwiV0VBTFNcIixcbiAgXCJXRUFSU1wiLFxuICBcIldFQVJZXCIsXG4gIFwiV0VBVkVcIixcbiAgXCJXRUJFUlwiLFxuICBcIldFREdFXCIsXG4gIFwiV0VFRFNcIixcbiAgXCJXRUVEWVwiLFxuICBcIldFRUtTXCIsXG4gIFwiV0VFTllcIixcbiAgXCJXRUVQU1wiLFxuICBcIldFRVBZXCIsXG4gIFwiV0VFU1RcIixcbiAgXCJXRUZUU1wiLFxuICBcIldFSUdIXCIsXG4gIFwiV0VJUkRcIixcbiAgXCJXRUlSU1wiLFxuICBcIldFTENIXCIsXG4gIFwiV0VMRFNcIixcbiAgXCJXRUxMU1wiLFxuICBcIldFTFNIXCIsXG4gIFwiV0VMVFNcIixcbiAgXCJXRU5DSFwiLFxuICBcIldFTkRTXCIsXG4gIFwiV0hBQ0tcIixcbiAgXCJXSEFMRVwiLFxuICBcIldIQU1TXCIsXG4gIFwiV0hBTkdcIixcbiAgXCJXSEFSRlwiLFxuICBcIldIRUFMXCIsXG4gIFwiV0hFQVRcIixcbiAgXCJXSEVFTFwiLFxuICBcIldIRUxLXCIsXG4gIFwiV0hFTE1cIixcbiAgXCJXSEVMUFwiLFxuICBcIldIRVJFXCIsXG4gIFwiV0hFVFNcIixcbiAgXCJXSElDSFwiLFxuICBcIldISUZGXCIsXG4gIFwiV0hJTEVcIixcbiAgXCJXSElNU1wiLFxuICBcIldISU5FXCIsXG4gIFwiV0hJTllcIixcbiAgXCJXSElQU1wiLFxuICBcIldISVJMXCIsXG4gIFwiV0hJUlJcIixcbiAgXCJXSElSU1wiLFxuICBcIldISVNLXCIsXG4gIFwiV0hJU1RcIixcbiAgXCJXSElURVwiLFxuICBcIldISVRTXCIsXG4gIFwiV0hJWlpcIixcbiAgXCJXSE9MRVwiLFxuICBcIldIT01QXCIsXG4gIFwiV0hPT1BcIixcbiAgXCJXSE9QU1wiLFxuICBcIldIT1JFXCIsXG4gIFwiV0hPUkxcIixcbiAgXCJXSE9TRVwiLFxuICBcIldIT1NPXCIsXG4gIFwiV0hVTVBcIixcbiAgXCJXSUNLU1wiLFxuICBcIldJREVOXCIsXG4gIFwiV0lERVJcIixcbiAgXCJXSURPV1wiLFxuICBcIldJRFRIXCIsXG4gIFwiV0lFTERcIixcbiAgXCJXSUZFWVwiLFxuICBcIldJTENPXCIsXG4gIFwiV0lMRFNcIixcbiAgXCJXSUxFRFwiLFxuICBcIldJTEVTXCIsXG4gIFwiV0lMTFNcIixcbiAgXCJXSUxUU1wiLFxuICBcIldJTVBTXCIsXG4gIFwiV0lNUFlcIixcbiAgXCJXSU5DRVwiLFxuICBcIldJTkNIXCIsXG4gIFwiV0lORFNcIixcbiAgXCJXSU5EWVwiLFxuICBcIldJTkVEXCIsXG4gIFwiV0lORVNcIixcbiAgXCJXSU5HU1wiLFxuICBcIldJTktTXCIsXG4gIFwiV0lOT1NcIixcbiAgXCJXSVBFRFwiLFxuICBcIldJUEVSXCIsXG4gIFwiV0lQRVNcIixcbiAgXCJXSVJFRFwiLFxuICBcIldJUkVTXCIsXG4gIFwiV0lTRURcIixcbiAgXCJXSVNFUlwiLFxuICBcIldJU0VTXCIsXG4gIFwiV0lTUFNcIixcbiAgXCJXSVNQWVwiLFxuICBcIldJVENIXCIsXG4gIFwiV0lUVFlcIixcbiAgXCJXSVZFU1wiLFxuICBcIldJWkVOXCIsXG4gIFwiV09LRU5cIixcbiAgXCJXT0xEU1wiLFxuICBcIldPTUFOXCIsXG4gIFwiV09NQlNcIixcbiAgXCJXT01FTlwiLFxuICBcIldPTktTXCIsXG4gIFwiV09OS1lcIixcbiAgXCJXT05UU1wiLFxuICBcIldPT0RTXCIsXG4gIFwiV09PRFlcIixcbiAgXCJXT09FRFwiLFxuICBcIldPT0ZTXCIsXG4gIFwiV09PTFNcIixcbiAgXCJXT09MWVwiLFxuICBcIldPT1NIXCIsXG4gIFwiV09PWllcIixcbiAgXCJXT1JEU1wiLFxuICBcIldPUkRZXCIsXG4gIFwiV09SS1NcIixcbiAgXCJXT1JMRFwiLFxuICBcIldPUk1TXCIsXG4gIFwiV09STVlcIixcbiAgXCJXT1JSWVwiLFxuICBcIldPUlNFXCIsXG4gIFwiV09SU1RcIixcbiAgXCJXT1JUSFwiLFxuICBcIldPUlRTXCIsXG4gIFwiV09VTERcIixcbiAgXCJXT1VORFwiLFxuICBcIldPVkVOXCIsXG4gIFwiV09XRURcIixcbiAgXCJXT1dFRVwiLFxuICBcIldSQUNLXCIsXG4gIFwiV1JBUFNcIixcbiAgXCJXUkFUSFwiLFxuICBcIldSRUFLXCIsXG4gIFwiV1JFQ0tcIixcbiAgXCJXUkVOU1wiLFxuICBcIldSRVNUXCIsXG4gIFwiV1JJRVJcIixcbiAgXCJXUklOR1wiLFxuICBcIldSSVNUXCIsXG4gIFwiV1JJVEVcIixcbiAgXCJXUklUU1wiLFxuICBcIldST05HXCIsXG4gIFwiV1JPVEVcIixcbiAgXCJXUk9USFwiLFxuICBcIldSVU5HXCIsXG4gIFwiV1JZRVJcIixcbiAgXCJXUllMWVwiLFxuICBcIldVUlNUXCIsXG4gIFwiWEVOT05cIixcbiAgXCJYRVJPWFwiLFxuICBcIlhZTEVNXCIsXG4gIFwiWUFDSFRcIixcbiAgXCJZQUhPT1wiLFxuICBcIllBTktTXCIsXG4gIFwiWUFSRFNcIixcbiAgXCJZQVJOU1wiLFxuICBcIllBV0VEXCIsXG4gIFwiWUFXTFNcIixcbiAgXCJZQVdOU1wiLFxuICBcIllBV05ZXCIsXG4gIFwiWUFXUFNcIixcbiAgXCJZRUFSTlwiLFxuICBcIllFQVJTXCIsXG4gIFwiWUVBU1RcIixcbiAgXCJZRUNDSFwiLFxuICBcIllFTExTXCIsXG4gIFwiWUVMUFNcIixcbiAgXCJZRU5UQVwiLFxuICBcIllFUkJBXCIsXG4gIFwiWUVTRVNcIixcbiAgXCJZSUVMRFwiLFxuICBcIllJS0VTXCIsXG4gIFwiWUlQRVNcIixcbiAgXCJZT0JCT1wiLFxuICBcIllPREVMXCIsXG4gIFwiWU9HSVNcIixcbiAgXCJZT0tFRFwiLFxuICBcIllPS0VMXCIsXG4gIFwiWU9LRVNcIixcbiAgXCJZT0xLU1wiLFxuICBcIllPVU5HXCIsXG4gIFwiWU9VUk5cIixcbiAgXCJZT1VSU1wiLFxuICBcIllPVVNFXCIsXG4gIFwiWU9VVEhcIixcbiAgXCJZT1dMU1wiLFxuICBcIllPWU9TXCIsXG4gIFwiWVVDQ0FcIixcbiAgXCJZVUNLWVwiLFxuICBcIllVS0tZXCIsXG4gIFwiWVVNTVlcIixcbiAgXCJZVVJUU1wiLFxuICBcIlpBUFBZXCIsXG4gIFwiWkFZSU5cIixcbiAgXCJaRUJSQVwiLFxuICBcIlpFQlVTXCIsXG4gIFwiWkVST1NcIixcbiAgXCJaRVNUU1wiLFxuICBcIlpFVEFTXCIsXG4gIFwiWklMQ0hcIixcbiAgXCJaSU5DU1wiLFxuICBcIlpJTkdTXCIsXG4gIFwiWklQUFlcIixcbiAgXCJaTE9UWVwiLFxuICBcIlpPTkFMXCIsXG4gIFwiWk9ORURcIixcbiAgXCJaT05FU1wiLFxuICBcIlpPTktTXCIsXG4gIFwiWk9PTVNcIixcbiAgXCJaT1dJRVwiLFxuXVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgV09SRFMgfVxuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fID0gbmV3IFVSTChcIi4uL2ZvbnRzL0JMQURSTUZfLlRURlwiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8xX19fID0gbmV3IFVSTChcIi4uL2ZvbnRzL094YW5pdW0tVmFyaWFibGVGb250X3dnaHQudHRmXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fXyA9IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzFfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8xX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgOnJvb3Qge1xuICAtLWRlZmF1bHQ6ICMxMjEyMTM7XG4gIC0tdGV4dDogI2ZmZmZmZjtcbiAgLS1ncmF5MTogIzRhNGE0YztcbiAgLS1ncmF5MjogIzJhMmEyYztcbiAgLS1ickJsdWUxOiAjMTdhYWQ4O1xuICAtLWJyQmx1ZTI6ICMwMTdjYjA7XG4gIC0tYnJCbHVlMzogIzBiNjFhODtcbiAgLS1ick9yYW5nZTE6ICNmZTkyMDA7XG4gIC8qZWU2MTBhKi9cbiAgLS1ick9yYW5nZTI6ICNlZTYxMGE7XG4gIC0tYnJPcmFuZ2UzOiAjZWE0MTBiO1xufVxuXG5AZm9udC1mYWNlIHtcbiAgZm9udC1mYW1pbHk6IFwiQmxhZGUgUnVubmVyXCI7XG4gIHNyYzogdXJsKCR7X19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fX30pO1xufVxuQGZvbnQtZmFjZSB7XG4gIGZvbnQtZmFtaWx5OiBcIk94YW5pdW1cIjtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBzcmM6IHVybCgke19fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzFfX199KTtcbn1cbmh0bWwsXG5ib2R5IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGVmYXVsdCk7XG4gIGZvbnQtZmFtaWx5OiBcIk94YW5pdW1cIiwgY3Vyc2l2ZTtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG5cbmRpdiB7XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMDtcbn1cblxuLnN1cGVyY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgbWluLXdpZHRoOiAzMjBweDtcbiAgbWF4LXdpZHRoOiA1NDBweDtcbiAgbWFyZ2luOiAxY3F3IGF1dG87XG4gIGNvbnRhaW5lci10eXBlOiBpbmxpbmUtc2l6ZTtcbn1cblxuLnBhZ2VDb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBmbGV4LXNocmluazogMDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAvKm1hcmdpbjogMWNxdyBhdXRvO1xuICBtaW4td2lkdGg6IDMyMHB4O1xuICBtYXgtd2lkdGg6IDU0MHB4OyovXG4gIHdpZHRoOiAxMDAlO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIC8qZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7Ki9cbiAgLypncmlkLXRlbXBsYXRlLXJvd3M6IGF1dG8gYXV0byAxZnI7Ki9cbiAgLypncmlkLWF1dG8tcm93czogYXV0bzsqL1xuICBjb250YWluZXItdHlwZTogaW5saW5lLXNpemU7XG4gIGhlaWdodDogMTU1Y3F3O1xufVxuXG4uaGVhZGVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleDogMCAxIGF1dG87XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBjb2xvcjogdmFyKC0tYnJPcmFuZ2UyKTtcbiAgZm9udC1mYW1pbHk6IFwiQmxhZGUgUnVubmVyXCI7XG4gIGZvbnQtc2l6ZTogOGNxdztcbiAgcGFkZGluZzogMmNxdyAwO1xuICBtYXJnaW46IDFjcXc7XG4gIGJvcmRlci1ib3R0b206IDAuNWNxdyBzb2xpZCB2YXIoLS1ncmF5MSk7XG4gIGhlaWdodDogOGNxdztcbiAgYm9yZGVyLXRvcDogMC41Y3F3IHNvbGlkIHZhcigtLWRlZmF1bHQpO1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgLW1zLXVzZXItc2VsZWN0OiBub25lO1xuICB1c2VyLXNlbGVjdDogbm9uZTtcbn1cblxuLm1lc3NhZ2Uge1xuICBjb2xvcjogdmFyKC0tYnJPcmFuZ2UyKTtcbiAgZm9udC1mYW1pbHk6IFwiT3hhbml1bVwiLCBjdXJzaXZlO1xuICBmb250LXNpemU6IDZjcXc7XG4gIHBhZGRpbmc6IDJjcXcgMDtcbiAgbWFyZ2luOiAxY3F3O1xuICBoZWlnaHQ6IDhjcXc7XG4gIGJvcmRlci1ib3R0b206IDAuNWNxdyBzb2xpZCB2YXIoLS1ick9yYW5nZTIpO1xuICBib3JkZXItdG9wOiAwLjVjcXcgc29saWQgdmFyKC0tYnJPcmFuZ2UyKTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGVmYXVsdCk7XG59XG5cbi5nYW1lQ29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGZsZXg6IDAgMSBhdXRvO1xuICB3aWR0aDogMTAwY3F3O1xuICBtYXJnaW46IGF1dG87XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XG4gIHVzZXItc2VsZWN0OiBub25lO1xufVxuXG4udGlsZUdyaWQge1xuICBkaXNwbGF5OiBncmlkO1xuICB3aWR0aDogNzVjcXc7XG4gIGdyaWQtdGVtcGxhdGUtcm93czogMWZyIDFmciAxZnIgMWZyIDFmciAxZnI7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmciAxZnIgMWZyIDFmcjtcbiAgZ3JpZC1nYXA6IDEuNWNxdztcbiAgbWFyZ2luOiAwLjVjcXcgMDtcbn1cblxuLnRpbGUge1xuICBhc3BlY3QtcmF0aW86IDEvMTtcbiAgYm9yZGVyOiAwLjVjcXcgc29saWQgdmFyKC0tZ3JheTEpO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBjb2xvcjogdmFyKC0tdGV4dCk7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XG4gIGZvbnQtZmFtaWx5OiBcIk94YW5pdW1cIiwgY3Vyc2l2ZTtcbiAgZm9udC1zaXplOiA3Y3F3O1xufVxuXG4udGlsZVdhdGVyTWFyayB7XG4gIGZvbnQtZmFtaWx5OiBcIkJsYWRlIFJ1bm5lclwiO1xuICBjb2xvcjogdmFyKC0tZ3JheTIpO1xufVxuXG4ua2V5Ym9hcmRDb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4OiAwIDEgYXV0bztcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIG1hcmdpbjogYXV0bztcbiAgbWFyZ2luLXRvcDogMmNxdztcbiAgd2lkdGg6IDEwMGNxdztcbn1cblxuLmtleWJvYXJkR3JpZCB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIHdpZHRoOiA5OGNxdztcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnIgMWZyIDFmcjtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XG4gIGdyaWQtcm93LWdhcDogMS41Y3F3O1xufVxuXG4ua2V5Ym9hcmRSb3cxIHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgd2lkdGg6IDk4Y3F3O1xuICBncmlkLXRlbXBsYXRlLXJvd3M6IDFmcjtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyIDFmciAxZnIgMWZyIDFmciAxZnIgMWZyIDFmciAxZnI7XG4gIGdyaWQtY29sdW1uLWdhcDogMS41Y3F3O1xufVxuXG4ua2V5Ym9hcmRSb3cyIHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgd2lkdGg6IDk4Y3F3O1xuICBncmlkLXRlbXBsYXRlLXJvd3M6IDFmcjtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAwLjVmciAxZnIgMWZyIDFmciAxZnIgMWZyIDFmciAxZnIgMWZyIDFmciAwLjVmcjtcbiAgZ3JpZC1jb2x1bW4tZ2FwOiAxLjVjcXc7XG59XG5cbi5rZXlib2FyZFJvdzMge1xuICBkaXNwbGF5OiBncmlkO1xuICB3aWR0aDogOThjcXc7XG4gIGdyaWQtdGVtcGxhdGUtcm93czogMWZyO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDEuNWZyIDFmciAxZnIgMWZyIDFmciAxZnIgMWZyIDFmciAxLjVmcjtcbiAgZ3JpZC1jb2x1bW4tZ2FwOiAxLjVjcXc7XG59XG5cbi5rZXksXG4ua2V5U3BhY2VyIHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgYm9yZGVyOiAwLjI1Y3F3IHNvbGlkIHZhcigtLXRleHQpO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGZvbnQtZmFtaWx5OiBcIk94YW5pdW1cIiwgY3Vyc2l2ZTtcbiAgZm9udC1zaXplOiAzLjVjcXc7XG4gIGZvbnQtd2VpZ2h0OiBib2xkZXI7XG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XG4gIHBhZGRpbmc6IDAgMDtcbiAgYm9yZGVyLXJhZGl1czogMS41Y3F3O1xuICBjb2xvcjogdmFyKC0tdGV4dCk7XG4gIGFzcGVjdC1yYXRpbzogMS8xLjI7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRlZmF1bHQpO1xuICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XG4gIHVzZXItc2VsZWN0OiBub25lO1xufVxuXG4ua2V5U3BhY2VyIHtcbiAgdmlzaWJpbGl0eTogaGlkZGVuO1xuICBhc3BlY3QtcmF0aW86IDEvMi40O1xufVxuXG4jQkFDS1NQQUNFLFxuI0VOVEVSIHtcbiAgYXNwZWN0LXJhdGlvOiAzLzIuNDtcbiAgZm9udC1zaXplOiAyLjVjcXc7XG59XG5cbi50aWxlQ2xvc2Uge1xuICBjb2xvcjogdmFyKC0tYnJPcmFuZ2UyKTtcbiAgYm9yZGVyOiAwLjVjcXcgc29saWQgdmFyKC0tYnJPcmFuZ2UyKTtcbn1cblxuLnRpbGVIaXQge1xuICBjb2xvcjogdmFyKC0tYnJCbHVlMSk7XG4gIGJvcmRlcjogMC41Y3F3IHNvbGlkIHZhcigtLWJyQmx1ZTEpO1xufVxuXG4udGlsZU1pc3Mge1xuICBjb2xvcjogdmFyKC0tZ3JheTEpO1xuICBib3JkZXI6IDAuNWNxdyBzb2xpZCB2YXIoLS1ncmF5MSk7XG59XG5cbi5nYW1lT3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJyQmx1ZTEpO1xuICBjb2xvcjogdmFyKC0tZGVmYXVsdCk7XG4gIGJvcmRlcjogMC4yNWNxdyBzb2xpZCB2YXIoLS1ickJsdWUxKTtcbn1cblxuLm5vdFdvcmQge1xuICBhbmltYXRpb24tbmFtZTogZmxhc2hCYWNrc3BhY2U7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMXM7XG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xufVxuXG4ucmVzZXQge1xuICBhbmltYXRpb246IDFzIGxpbmVhciByZXNldHRpbmc7XG59XG5cbkBrZXlmcmFtZXMgcmVzZXR0aW5nIHtcbiAgMCUge1xuICAgIHRyYW5zZm9ybTogcm90YXRlWCgwZGVnKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogcm90YXRlWCg5MGRlZyk7XG4gIH1cbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGVYKDBkZWcpO1xuICB9XG59XG5Aa2V5ZnJhbWVzIGZsYXNoQmFja3NwYWNlIHtcbiAgMCUsIDEwMCUge1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJyT3JhbmdlMik7XG4gICAgY29sb3I6IHZhcigtLXRleHQpO1xuICAgIGJvcmRlcjogMC4yNWNxdyBzb2xpZCB2YXIoLS10ZXh0KTtcbiAgfVxuICA1MCUge1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRlZmF1bHQpO1xuICAgIGNvbG9yOiB2YXIoLS10ZXh0KTtcbiAgICBib3JkZXI6IDAuMjVjcXcgc29saWQgdmFyKC0tdGV4dCk7XG4gIH1cbn1cbi5tb2RhbENvbnRhaW5lciB7XG4gIGRpc3BsYXk6IG5vbmU7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgei1pbmRleDogMTtcbiAgcGFkZGluZy10b3A6IDE1Y3F3O1xuICB0b3A6IDA7XG4gIHJpZ2h0OiAwO1xuICBsZWZ0OiAwO1xuICBib3R0b206IDA7XG4gIHdpZHRoOiAxMDBjcXc7XG4gIG92ZXJmbG93OiBhdXRvO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDE4LCAxOCwgMTksIDAuNik7XG59XG5cbi5tb2RhbENvbnRlbnQge1xuICBmb250LWZhbWlseTogXCJPeGFuaXVtXCIsIGN1cnNpdmU7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU0LCAxNDYsIDAsIDAuMyk7XG4gIGNvbG9yOiB2YXIoLS1ick9yYW5nZTEpO1xuICBtYXJnaW46IGF1dG87XG4gIHBhZGRpbmc6IDEuNWNxdztcbiAgcGFkZGluZy10b3A6IDA7XG4gIHdpZHRoOiA4MGNxdztcbiAgbWF4LXdpZHRoOiA4MGNxdztcbiAgbWF4LWhlaWdodDogOTBjcXc7XG4gIGZvbnQtc2l6ZTogNmNxdztcbiAgb3ZlcmZsb3c6IGF1dG87XG59XG5cbi5tb2RhbENvbnRlbnQgaHIge1xuICBib3JkZXI6IDAuMjVjcXcgc29saWQgdmFyKC0tYnJPcmFuZ2UxKTtcbiAgbWFyZ2luLXRvcDogM2Nxdztcbn1cblxuLm1vZGFsVGl0bGUge1xuICBmb250LWZhbWlseTogXCJPeGFuaXVtXCIsIGN1cnNpdmU7XG4gIG1hcmdpbjogMmNxdyAwIDBjcXc7XG4gIHBhZGRpbmc6IDJjcXcgMCAxY3F3O1xufVxuXG4ubW9kYWxDb250ZW50SXRlbSB7XG4gIGZvbnQtZmFtaWx5OiBcIk94YW5pdW1cIiwgY3Vyc2l2ZTtcbiAgbWFyZ2luOiAwIDA7XG4gIHBhZGRpbmc6IDFjcXcgMmNxdztcbiAgZm9udC1zaXplOiA1Y3F3O1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xufVxuXG4uY2xvc2Uge1xuICBjb2xvcjogdmFyKC0tYnJPcmFuZ2UxKTtcbiAgZmxvYXQ6IHJpZ2h0O1xuICBtYXJnaW4tcmlnaHQ6IDEuNWNxdztcbiAgZm9udC1zaXplOiA2Y3F3O1xuICBmb250LXdlaWdodDogYm9sZDtcbn1cblxuLmNsb3NlOmhvdmVyLFxuLmNsb3NlOmZvY3VzIHtcbiAgY29sb3I6IHZhcigtLWJyT3JhbmdlMyk7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG4uc3RhdFRhYmxlIHtcbiAgbWFyZ2luOiAwIGF1dG8gMS41Y3F3O1xufVxuXG4uc3RhdFRhYmxlIHRkIHtcbiAgcGFkZGluZzogMCA0Y3F3O1xufVxuXG4uc3RhdE51bSB7XG4gIHRleHQtYWxpZ246IHJpZ2h0O1xufVxuXG46Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgd2lkdGg6IDJjcXc7XG59XG5cbjo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2sge1xuICBiYWNrZ3JvdW5kOiByZ2JhKDI1NCwgMTQ2LCAwLCAwLjIpO1xufVxuXG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcbiAgYmFja2dyb3VuZDogcmdiYSgyNTQsIDE0NiwgMCwgMC40KTtcbn1cblxuOjotd2Via2l0LXNjcm9sbGJhci10aHVtYjpob3ZlciB7XG4gIGJhY2tncm91bmQ6IHZhcigtLWJyT3JhbmdlMSk7XG59XG5cbi5tb2RhbENvbnRlbnQge1xuICBzY3JvbGxiYXItY29sb3I6IHJnYmEoMjU0LCAxNDYsIDAsIDAuNikgcmdiYSgyNTQsIDE0NiwgMCwgMC4xKTtcbn1gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL2NsaWVudC9zdHlsZS9tYWluLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLGtCQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrQkFBQTtFQUNBLGtCQUFBO0VBQ0Esa0JBQUE7RUFDQSxvQkFBQTtFQUNBLFNBQUE7RUFDQSxvQkFBQTtFQUNBLG9CQUFBO0FBQ0Y7O0FBRUE7RUFDRSwyQkFBQTtFQUNBLDRDQUFBO0FBQ0Y7QUFFQTtFQUNFLHNCQUFB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RjtBQUNBO0VBQ0U7SUFFRSxrQ0FBQTtJQUNBLGtCQUFBO0lBQ0EsaUNBQUE7RUFBRjtFQUVBO0lBQ0UsZ0NBQUE7SUFDQSxrQkFBQTtJQUNBLGlDQUFBO0VBQUY7QUFDRjtBQUdBO0VBQ0UsYUFBQTtFQUNBLGVBQUE7RUFDQSxVQUFBO0VBQ0Esa0JBQUE7RUFDQSxNQUFBO0VBQ0EsUUFBQTtFQUNBLE9BQUE7RUFDQSxTQUFBO0VBQ0EsYUFBQTtFQUNBLGNBQUE7RUFDQSx1Q0FBQTtBQURGOztBQUlBO0VBQ0UsK0JBQUE7RUFDQSx3Q0FBQTtFQUNBLHVCQUFBO0VBQ0EsWUFBQTtFQUNBLGVBQUE7RUFDQSxjQUFBO0VBQ0EsWUFBQTtFQUNBLGdCQUFBO0VBQ0EsaUJBQUE7RUFDQSxlQUFBO0VBQ0EsY0FBQTtBQURGOztBQUlBO0VBQ0Usc0NBQUE7RUFDQSxnQkFBQTtBQURGOztBQUlBO0VBQ0UsK0JBQUE7RUFDQSxtQkFBQTtFQUNBLG9CQUFBO0FBREY7O0FBSUE7RUFDRSwrQkFBQTtFQUNBLFdBQUE7RUFDQSxrQkFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtBQURGOztBQUlBO0VBQ0UsdUJBQUE7RUFDQSxZQUFBO0VBQ0Esb0JBQUE7RUFDQSxlQUFBO0VBQ0EsaUJBQUE7QUFERjs7QUFJQTs7RUFFRSx1QkFBQTtFQUNBLHFCQUFBO0VBQ0EsZUFBQTtBQURGOztBQUlBO0VBQ0UscUJBQUE7QUFERjs7QUFHQTtFQUNFLGVBQUE7QUFBRjs7QUFHQTtFQUNFLGlCQUFBO0FBQUY7O0FBR0E7RUFDRSxXQUFBO0FBQUY7O0FBR0E7RUFDRSxrQ0FBQTtBQUFGOztBQUdBO0VBQ0Usa0NBQUE7QUFBRjs7QUFHQTtFQUNFLDRCQUFBO0FBQUY7O0FBR0E7RUFDRSw4REFBQTtBQUFGXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIjpyb290IHtcXG4gIC0tZGVmYXVsdDogIzEyMTIxMztcXG4gIC0tdGV4dDogI2ZmZmZmZjtcXG4gIC0tZ3JheTE6ICM0YTRhNGM7XFxuICAtLWdyYXkyOiAjMmEyYTJjO1xcbiAgLS1ickJsdWUxOiAjMTdhYWQ4O1xcbiAgLS1ickJsdWUyOiAjMDE3Y2IwO1xcbiAgLS1ickJsdWUzOiAjMGI2MWE4O1xcbiAgLS1ick9yYW5nZTE6ICNmZTkyMDA7XFxuICAvKmVlNjEwYSovXFxuICAtLWJyT3JhbmdlMjogI2VlNjEwYTtcXG4gIC0tYnJPcmFuZ2UzOiAjZWE0MTBiO1xcbn1cXG5cXG5AZm9udC1mYWNlIHtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiQmxhZGUgUnVubmVyXFxcIjtcXG4gIHNyYzogdXJsKC4uL2ZvbnRzL0JMQURSTUZfLlRURik7XFxufVxcblxcbkBmb250LWZhY2Uge1xcbiAgZm9udC1mYW1pbHk6IFxcXCJPeGFuaXVtXFxcIjtcXG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcXG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XFxuICBzcmM6IHVybChcXFwiLi4vZm9udHMvT3hhbml1bS1WYXJpYWJsZUZvbnRfd2dodC50dGZcXFwiKTtcXG59XFxuXFxuaHRtbCxcXG5ib2R5IHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRlZmF1bHQpO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJPeGFuaXVtXFxcIiwgY3Vyc2l2ZTtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbmRpdiB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbn1cXG5cXG4uc3VwZXJjb250YWluZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIG1pbi13aWR0aDogMzIwcHg7XFxuICBtYXgtd2lkdGg6IDU0MHB4O1xcbiAgbWFyZ2luOiAxY3F3IGF1dG87XFxuICBjb250YWluZXItdHlwZTogaW5saW5lLXNpemU7XFxufVxcblxcbi5wYWdlQ29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgZmxleC1zaHJpbms6IDA7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICAvKm1hcmdpbjogMWNxdyBhdXRvO1xcbiAgbWluLXdpZHRoOiAzMjBweDtcXG4gIG1heC13aWR0aDogNTQwcHg7Ki9cXG4gIHdpZHRoOiAxMDAlO1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcbiAgLypncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjsqL1xcbiAgLypncmlkLXRlbXBsYXRlLXJvd3M6IGF1dG8gYXV0byAxZnI7Ki9cXG4gIC8qZ3JpZC1hdXRvLXJvd3M6IGF1dG87Ki9cXG4gIGNvbnRhaW5lci10eXBlOiBpbmxpbmUtc2l6ZTtcXG4gIGhlaWdodDogMTU1Y3F3O1xcbn1cXG5cXG4uaGVhZGVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4OiAwIDEgYXV0bztcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgY29sb3I6IHZhcigtLWJyT3JhbmdlMik7XFxuICBmb250LWZhbWlseTogXFxcIkJsYWRlIFJ1bm5lclxcXCI7XFxuICBmb250LXNpemU6IDhjcXc7XFxuICBwYWRkaW5nOiAyY3F3IDA7XFxuICBtYXJnaW46IDFjcXc7XFxuICBib3JkZXItYm90dG9tOiAwLjVjcXcgc29saWQgdmFyKC0tZ3JheTEpO1xcbiAgaGVpZ2h0OiA4Y3F3O1xcbiAgYm9yZGVyLXRvcDogMC41Y3F3IHNvbGlkIHZhcigtLWRlZmF1bHQpO1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxuICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xcbiAgLW1zLXVzZXItc2VsZWN0OiBub25lO1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxufVxcblxcbi5tZXNzYWdlIHtcXG4gIGNvbG9yOiB2YXIoLS1ick9yYW5nZTIpO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJPeGFuaXVtXFxcIiwgY3Vyc2l2ZTtcXG4gIGZvbnQtc2l6ZTogNmNxdztcXG4gIHBhZGRpbmc6IDJjcXcgMDtcXG4gIG1hcmdpbjogMWNxdztcXG4gIGhlaWdodDogOGNxdztcXG4gIGJvcmRlci1ib3R0b206IDAuNWNxdyBzb2xpZCB2YXIoLS1ick9yYW5nZTIpO1xcbiAgYm9yZGVyLXRvcDogMC41Y3F3IHNvbGlkIHZhcigtLWJyT3JhbmdlMik7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kZWZhdWx0KTtcXG59XFxuXFxuLmdhbWVDb250YWluZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgZmxleDogMCAxIGF1dG87XFxuICB3aWR0aDogMTAwY3F3O1xcbiAgbWFyZ2luOiBhdXRvO1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxuICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xcbiAgLW1zLXVzZXItc2VsZWN0OiBub25lO1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxufVxcblxcbi50aWxlR3JpZCB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgd2lkdGg6IDc1Y3F3O1xcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnIgMWZyIDFmciAxZnIgMWZyIDFmcjtcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmciAxZnIgMWZyIDFmcjtcXG4gIGdyaWQtZ2FwOiAxLjVjcXc7XFxuICBtYXJnaW46IDAuNWNxdyAwO1xcbn1cXG5cXG4udGlsZSB7XFxuICBhc3BlY3QtcmF0aW86IDEgLyAxO1xcbiAgYm9yZGVyOiAwLjVjcXcgc29saWQgdmFyKC0tZ3JheTEpO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIGNvbG9yOiB2YXIoLS10ZXh0KTtcXG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiT3hhbml1bVxcXCIsIGN1cnNpdmU7XFxuICBmb250LXNpemU6IDdjcXc7XFxufVxcblxcbi50aWxlV2F0ZXJNYXJrIHtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiQmxhZGUgUnVubmVyXFxcIjtcXG4gIGNvbG9yOiB2YXIoLS1ncmF5Mik7XFxufVxcblxcbi5rZXlib2FyZENvbnRhaW5lciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleDogMCAxIGF1dG87XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIG1hcmdpbjogYXV0bztcXG4gIG1hcmdpbi10b3A6IDJjcXc7XFxuICB3aWR0aDogMTAwY3F3O1xcbn1cXG5cXG4ua2V5Ym9hcmRHcmlkIHtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICB3aWR0aDogOThjcXc7XFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IDFmciAxZnIgMWZyO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XFxuICBncmlkLXJvdy1nYXA6IDEuNWNxdztcXG59XFxuXFxuLmtleWJvYXJkUm93MSB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgd2lkdGg6IDk4Y3F3O1xcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnI7XFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnIgMWZyIDFmciAxZnIgMWZyIDFmciAxZnIgMWZyIDFmcjtcXG4gIGdyaWQtY29sdW1uLWdhcDogMS41Y3F3O1xcbn1cXG4ua2V5Ym9hcmRSb3cyIHtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICB3aWR0aDogOThjcXc7XFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IDFmcjtcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMC41ZnIgMWZyIDFmciAxZnIgMWZyIDFmciAxZnIgMWZyIDFmciAxZnIgMC41ZnI7XFxuICBncmlkLWNvbHVtbi1nYXA6IDEuNWNxdztcXG59XFxuLmtleWJvYXJkUm93MyB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgd2lkdGg6IDk4Y3F3O1xcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnI7XFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDEuNWZyIDFmciAxZnIgMWZyIDFmciAxZnIgMWZyIDFmciAxLjVmcjtcXG4gIGdyaWQtY29sdW1uLWdhcDogMS41Y3F3O1xcbn1cXG5cXG4ua2V5LFxcbi5rZXlTcGFjZXIge1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGJvcmRlcjogMC4yNWNxdyBzb2xpZCB2YXIoLS10ZXh0KTtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBmb250LWZhbWlseTogXFxcIk94YW5pdW1cXFwiLCBjdXJzaXZlO1xcbiAgZm9udC1zaXplOiAzLjVjcXc7XFxuICBmb250LXdlaWdodDogYm9sZGVyO1xcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcXG4gIHBhZGRpbmc6IDAgMDtcXG4gIGJvcmRlci1yYWRpdXM6IDEuNWNxdztcXG4gIGNvbG9yOiB2YXIoLS10ZXh0KTtcXG4gIGFzcGVjdC1yYXRpbzogMSAvIDEuMjtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRlZmF1bHQpO1xcbiAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcXG4gIC1tcy11c2VyLXNlbGVjdDogbm9uZTtcXG4gIHVzZXItc2VsZWN0OiBub25lO1xcbn1cXG5cXG4ua2V5U3BhY2VyIHtcXG4gIHZpc2liaWxpdHk6IGhpZGRlbjtcXG4gIGFzcGVjdC1yYXRpbzogMSAvIDIuNDtcXG59XFxuXFxuI0JBQ0tTUEFDRSxcXG4jRU5URVIge1xcbiAgYXNwZWN0LXJhdGlvOiAzIC8gMi40O1xcbiAgZm9udC1zaXplOiAyLjVjcXc7XFxufVxcblxcbi50aWxlQ2xvc2Uge1xcbiAgY29sb3I6IHZhcigtLWJyT3JhbmdlMik7XFxuICBib3JkZXI6IDAuNWNxdyBzb2xpZCB2YXIoLS1ick9yYW5nZTIpO1xcbn1cXG5cXG4udGlsZUhpdCB7XFxuICBjb2xvcjogdmFyKC0tYnJCbHVlMSk7XFxuICBib3JkZXI6IDAuNWNxdyBzb2xpZCB2YXIoLS1ickJsdWUxKTtcXG59XFxuLnRpbGVNaXNzIHtcXG4gIGNvbG9yOiB2YXIoLS1ncmF5MSk7XFxuICBib3JkZXI6IDAuNWNxdyBzb2xpZCB2YXIoLS1ncmF5MSk7XFxufVxcblxcbi5nYW1lT3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ickJsdWUxKTtcXG4gIGNvbG9yOiB2YXIoLS1kZWZhdWx0KTtcXG4gIGJvcmRlcjogMC4yNWNxdyBzb2xpZCB2YXIoLS1ickJsdWUxKTtcXG59XFxuXFxuLm5vdFdvcmQge1xcbiAgYW5pbWF0aW9uLW5hbWU6IGZsYXNoQmFja3NwYWNlO1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAxcztcXG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xcbn1cXG5cXG4ucmVzZXQge1xcbiAgYW5pbWF0aW9uOiAxcyBsaW5lYXIgcmVzZXR0aW5nO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHJlc2V0dGluZyB7XFxuICAwJSB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlWCgwZGVnKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlWCg5MGRlZyk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGVYKDBkZWcpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIGZsYXNoQmFja3NwYWNlIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJyT3JhbmdlMik7XFxuICAgIGNvbG9yOiB2YXIoLS10ZXh0KTtcXG4gICAgYm9yZGVyOiAwLjI1Y3F3IHNvbGlkIHZhcigtLXRleHQpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGVmYXVsdCk7XFxuICAgIGNvbG9yOiB2YXIoLS10ZXh0KTtcXG4gICAgYm9yZGVyOiAwLjI1Y3F3IHNvbGlkIHZhcigtLXRleHQpO1xcbiAgfVxcbn1cXG5cXG4ubW9kYWxDb250YWluZXIge1xcbiAgZGlzcGxheTogbm9uZTtcXG4gIHBvc2l0aW9uOiBmaXhlZDtcXG4gIHotaW5kZXg6IDE7XFxuICBwYWRkaW5nLXRvcDogMTVjcXc7XFxuICB0b3A6IDA7XFxuICByaWdodDogMDtcXG4gIGxlZnQ6IDA7XFxuICBib3R0b206IDA7XFxuICB3aWR0aDogMTAwY3F3O1xcbiAgb3ZlcmZsb3c6IGF1dG87XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDE4LCAxOCwgMTksIDAuNik7XFxufVxcblxcbi5tb2RhbENvbnRlbnQge1xcbiAgZm9udC1mYW1pbHk6IFxcXCJPeGFuaXVtXFxcIiwgY3Vyc2l2ZTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU0LCAxNDYsIDAsIDAuMyk7XFxuICBjb2xvcjogdmFyKC0tYnJPcmFuZ2UxKTtcXG4gIG1hcmdpbjogYXV0bztcXG4gIHBhZGRpbmc6IDEuNWNxdztcXG4gIHBhZGRpbmctdG9wOiAwO1xcbiAgd2lkdGg6IDgwY3F3O1xcbiAgbWF4LXdpZHRoOiA4MGNxdztcXG4gIG1heC1oZWlnaHQ6IDkwY3F3O1xcbiAgZm9udC1zaXplOiA2Y3F3O1xcbiAgb3ZlcmZsb3c6IGF1dG87XFxufVxcblxcbi5tb2RhbENvbnRlbnQgaHIge1xcbiAgYm9yZGVyOiAwLjI1Y3F3IHNvbGlkIHZhcigtLWJyT3JhbmdlMSk7XFxuICBtYXJnaW4tdG9wOiAzY3F3O1xcbn1cXG5cXG4ubW9kYWxUaXRsZSB7XFxuICBmb250LWZhbWlseTogXFxcIk94YW5pdW1cXFwiLCBjdXJzaXZlO1xcbiAgbWFyZ2luOiAyY3F3IDAgMGNxdztcXG4gIHBhZGRpbmc6IDJjcXcgMCAxY3F3O1xcbn1cXG5cXG4ubW9kYWxDb250ZW50SXRlbSB7XFxuICBmb250LWZhbWlseTogXFxcIk94YW5pdW1cXFwiLCBjdXJzaXZlO1xcbiAgbWFyZ2luOiAwIDA7XFxuICBwYWRkaW5nOiAxY3F3IDJjcXc7XFxuICBmb250LXNpemU6IDVjcXc7XFxuICB0ZXh0LWFsaWduOiBsZWZ0O1xcbn1cXG5cXG4uY2xvc2Uge1xcbiAgY29sb3I6IHZhcigtLWJyT3JhbmdlMSk7XFxuICBmbG9hdDogcmlnaHQ7XFxuICBtYXJnaW4tcmlnaHQ6IDEuNWNxdztcXG4gIGZvbnQtc2l6ZTogNmNxdztcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbn1cXG5cXG4uY2xvc2U6aG92ZXIsXFxuLmNsb3NlOmZvY3VzIHtcXG4gIGNvbG9yOiB2YXIoLS1ick9yYW5nZTMpO1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG4uc3RhdFRhYmxlIHtcXG4gIG1hcmdpbjogMCBhdXRvIDEuNWNxdztcXG59XFxuLnN0YXRUYWJsZSB0ZCB7XFxuICBwYWRkaW5nOiAwIDRjcXc7XFxufVxcblxcbi5zdGF0TnVtIHtcXG4gIHRleHQtYWxpZ246IHJpZ2h0O1xcbn1cXG5cXG46Oi13ZWJraXQtc2Nyb2xsYmFyIHtcXG4gIHdpZHRoOiAyY3F3O1xcbn1cXG5cXG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRyYWNrIHtcXG4gIGJhY2tncm91bmQ6IHJnYmEoMjU0LCAxNDYsIDAsIDAuMik7XFxufVxcblxcbjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xcbiAgYmFja2dyb3VuZDogcmdiYSgyNTQsIDE0NiwgMCwgMC40KTtcXG59XFxuXFxuOjotd2Via2l0LXNjcm9sbGJhci10aHVtYjpob3ZlciB7XFxuICBiYWNrZ3JvdW5kOiB2YXIoLS1ick9yYW5nZTEpO1xcbn1cXG5cXG4ubW9kYWxDb250ZW50IHtcXG4gIHNjcm9sbGJhci1jb2xvcjogcmdiYSgyNTQsIDE0NiwgMCwgMC42KSByZ2JhKDI1NCwgMTQ2LCAwLCAwLjEpO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodXJsLCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuICBpZiAoIXVybCkge1xuICAgIHJldHVybiB1cmw7XG4gIH1cbiAgdXJsID0gU3RyaW5nKHVybC5fX2VzTW9kdWxlID8gdXJsLmRlZmF1bHQgOiB1cmwpO1xuXG4gIC8vIElmIHVybCBpcyBhbHJlYWR5IHdyYXBwZWQgaW4gcXVvdGVzLCByZW1vdmUgdGhlbVxuICBpZiAoL15bJ1wiXS4qWydcIl0kLy50ZXN0KHVybCkpIHtcbiAgICB1cmwgPSB1cmwuc2xpY2UoMSwgLTEpO1xuICB9XG4gIGlmIChvcHRpb25zLmhhc2gpIHtcbiAgICB1cmwgKz0gb3B0aW9ucy5oYXNoO1xuICB9XG5cbiAgLy8gU2hvdWxkIHVybCBiZSB3cmFwcGVkP1xuICAvLyBTZWUgaHR0cHM6Ly9kcmFmdHMuY3Nzd2cub3JnL2Nzcy12YWx1ZXMtMy8jdXJsc1xuICBpZiAoL1tcIicoKSBcXHRcXG5dfCglMjApLy50ZXN0KHVybCkgfHwgb3B0aW9ucy5uZWVkUXVvdGVzKSB7XG4gICAgcmV0dXJuIFwiXFxcIlwiLmNvbmNhdCh1cmwucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpLnJlcGxhY2UoL1xcbi9nLCBcIlxcXFxuXCIpLCBcIlxcXCJcIik7XG4gIH1cbiAgcmV0dXJuIHVybDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICByZXR1cm4gQ29uc3RydWN0b3I7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUNvbXB1dGVkU3R5bGVWYWx1ZShzdHJpbmcpIHtcbiAgLy8gXCIyNTBweFwiIC0tPiAyNTBcbiAgcmV0dXJuICtzdHJpbmcucmVwbGFjZSgvcHgvLCAnJyk7XG59XG5cbmZ1bmN0aW9uIGZpeERQUihjYW52YXMpIHtcbiAgdmFyIGRwciA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICB2YXIgY29tcHV0ZWRTdHlsZXMgPSBnZXRDb21wdXRlZFN0eWxlKGNhbnZhcyk7XG4gIHZhciB3aWR0aCA9IG5vcm1hbGl6ZUNvbXB1dGVkU3R5bGVWYWx1ZShjb21wdXRlZFN0eWxlcy5nZXRQcm9wZXJ0eVZhbHVlKCd3aWR0aCcpKTtcbiAgdmFyIGhlaWdodCA9IG5vcm1hbGl6ZUNvbXB1dGVkU3R5bGVWYWx1ZShjb21wdXRlZFN0eWxlcy5nZXRQcm9wZXJ0eVZhbHVlKCdoZWlnaHQnKSk7XG4gIGNhbnZhcy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgKHdpZHRoICogZHByKS50b1N0cmluZygpKTtcbiAgY2FudmFzLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgKGhlaWdodCAqIGRwcikudG9TdHJpbmcoKSk7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tTnVtYmVyKG1pbiwgbWF4KSB7XG4gIHZhciBmcmFjdGlvbkRpZ2l0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogMDtcbiAgdmFyIHJhbmRvbU51bWJlciA9IE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbjtcbiAgcmV0dXJuIE1hdGguZmxvb3IocmFuZG9tTnVtYmVyICogTWF0aC5wb3coMTAsIGZyYWN0aW9uRGlnaXRzKSkgLyBNYXRoLnBvdygxMCwgZnJhY3Rpb25EaWdpdHMpO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbUFycmF5RWxlbWVudChhcnIpIHtcbiAgcmV0dXJuIGFycltnZW5lcmF0ZVJhbmRvbU51bWJlcigwLCBhcnIubGVuZ3RoKV07XG59XG5cbnZhciBGUkVFX0ZBTExJTkdfT0JKRUNUX0FDQ0VMRVJBVElPTiA9IDAuMDAxMjU7XG52YXIgTUlOX0RSQUdfRk9SQ0VfQ09FRkZJQ0lFTlQgPSAwLjAwMDU7XG52YXIgTUFYX0RSQUdfRk9SQ0VfQ09FRkZJQ0lFTlQgPSAwLjAwMDk7XG52YXIgUk9UQVRJT05fU0xPV0RPV05fQUNDRUxFUkFUSU9OID0gMC4wMDAwMTtcbnZhciBJTklUSUFMX1NIQVBFX1JBRElVUyA9IDY7XG52YXIgSU5JVElBTF9FTU9KSV9TSVpFID0gODA7XG52YXIgTUlOX0lOSVRJQUxfQ09ORkVUVElfU1BFRUQgPSAwLjk7XG52YXIgTUFYX0lOSVRJQUxfQ09ORkVUVElfU1BFRUQgPSAxLjc7XG52YXIgTUlOX0ZJTkFMX1hfQ09ORkVUVElfU1BFRUQgPSAwLjI7XG52YXIgTUFYX0ZJTkFMX1hfQ09ORkVUVElfU1BFRUQgPSAwLjY7XG52YXIgTUlOX0lOSVRJQUxfUk9UQVRJT05fU1BFRUQgPSAwLjAzO1xudmFyIE1BWF9JTklUSUFMX1JPVEFUSU9OX1NQRUVEID0gMC4wNztcbnZhciBNSU5fQ09ORkVUVElfQU5HTEUgPSAxNTtcbnZhciBNQVhfQ09ORkVUVElfQU5HTEUgPSA4MjtcbnZhciBNQVhfQ09ORkVUVElfUE9TSVRJT05fU0hJRlQgPSAxNTA7XG52YXIgU0hBUEVfVklTSUJJTElUWV9UUkVTSE9MRCA9IDEwMDtcbnZhciBERUZBVUxUX0NPTkZFVFRJX05VTUJFUiA9IDI1MDtcbnZhciBERUZBVUxUX0VNT0pJU19OVU1CRVIgPSA0MDtcbnZhciBERUZBVUxUX0NPTkZFVFRJX0NPTE9SUyA9IFsnI2ZjZjQwMycsICcjNjJmYzAzJywgJyNmNGZjMDMnLCAnIzAzZTdmYycsICcjMDNmY2E1JywgJyNhNTAzZmMnLCAnI2ZjMDNhZCcsICcjZmMwM2MyJ107XG5cbmZ1bmN0aW9uIGdldFdpbmRvd1dpZHRoQ29lZmZpY2llbnQoY2FudmFzV2lkdGgpIHtcbiAgdmFyIEhEX1NDUkVFTl9XSURUSCA9IDE5MjA7XG4gIHJldHVybiBNYXRoLmxvZyhjYW52YXNXaWR0aCkgLyBNYXRoLmxvZyhIRF9TQ1JFRU5fV0lEVEgpO1xufVxuXG52YXIgQ29uZmV0dGlTaGFwZSA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIENvbmZldHRpU2hhcGUoYXJncykge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDb25mZXR0aVNoYXBlKTtcblxuICAgIHZhciBpbml0aWFsUG9zaXRpb24gPSBhcmdzLmluaXRpYWxQb3NpdGlvbixcbiAgICAgICAgZGlyZWN0aW9uID0gYXJncy5kaXJlY3Rpb24sXG4gICAgICAgIGNvbmZldHRpUmFkaXVzID0gYXJncy5jb25mZXR0aVJhZGl1cyxcbiAgICAgICAgY29uZmV0dGlDb2xvcnMgPSBhcmdzLmNvbmZldHRpQ29sb3JzLFxuICAgICAgICBlbW9qaXMgPSBhcmdzLmVtb2ppcyxcbiAgICAgICAgZW1vamlTaXplID0gYXJncy5lbW9qaVNpemUsXG4gICAgICAgIGNhbnZhc1dpZHRoID0gYXJncy5jYW52YXNXaWR0aDtcbiAgICB2YXIgcmFuZG9tQ29uZmV0dGlTcGVlZCA9IGdlbmVyYXRlUmFuZG9tTnVtYmVyKE1JTl9JTklUSUFMX0NPTkZFVFRJX1NQRUVELCBNQVhfSU5JVElBTF9DT05GRVRUSV9TUEVFRCwgMyk7XG4gICAgdmFyIGluaXRpYWxTcGVlZCA9IHJhbmRvbUNvbmZldHRpU3BlZWQgKiBnZXRXaW5kb3dXaWR0aENvZWZmaWNpZW50KGNhbnZhc1dpZHRoKTtcbiAgICB0aGlzLmNvbmZldHRpU3BlZWQgPSB7XG4gICAgICB4OiBpbml0aWFsU3BlZWQsXG4gICAgICB5OiBpbml0aWFsU3BlZWRcbiAgICB9O1xuICAgIHRoaXMuZmluYWxDb25mZXR0aVNwZWVkWCA9IGdlbmVyYXRlUmFuZG9tTnVtYmVyKE1JTl9GSU5BTF9YX0NPTkZFVFRJX1NQRUVELCBNQVhfRklOQUxfWF9DT05GRVRUSV9TUEVFRCwgMyk7XG4gICAgdGhpcy5yb3RhdGlvblNwZWVkID0gZW1vamlzLmxlbmd0aCA/IDAuMDEgOiBnZW5lcmF0ZVJhbmRvbU51bWJlcihNSU5fSU5JVElBTF9ST1RBVElPTl9TUEVFRCwgTUFYX0lOSVRJQUxfUk9UQVRJT05fU1BFRUQsIDMpICogZ2V0V2luZG93V2lkdGhDb2VmZmljaWVudChjYW52YXNXaWR0aCk7XG4gICAgdGhpcy5kcmFnRm9yY2VDb2VmZmljaWVudCA9IGdlbmVyYXRlUmFuZG9tTnVtYmVyKE1JTl9EUkFHX0ZPUkNFX0NPRUZGSUNJRU5ULCBNQVhfRFJBR19GT1JDRV9DT0VGRklDSUVOVCwgNik7XG4gICAgdGhpcy5yYWRpdXMgPSB7XG4gICAgICB4OiBjb25mZXR0aVJhZGl1cyxcbiAgICAgIHk6IGNvbmZldHRpUmFkaXVzXG4gICAgfTtcbiAgICB0aGlzLmluaXRpYWxSYWRpdXMgPSBjb25mZXR0aVJhZGl1cztcbiAgICB0aGlzLnJvdGF0aW9uQW5nbGUgPSBkaXJlY3Rpb24gPT09ICdsZWZ0JyA/IGdlbmVyYXRlUmFuZG9tTnVtYmVyKDAsIDAuMiwgMykgOiBnZW5lcmF0ZVJhbmRvbU51bWJlcigtMC4yLCAwLCAzKTtcbiAgICB0aGlzLmVtb2ppU2l6ZSA9IGVtb2ppU2l6ZTtcbiAgICB0aGlzLmVtb2ppUm90YXRpb25BbmdsZSA9IGdlbmVyYXRlUmFuZG9tTnVtYmVyKDAsIDIgKiBNYXRoLlBJKTtcbiAgICB0aGlzLnJhZGl1c1lVcGRhdGVEaXJlY3Rpb24gPSAnZG93bic7XG4gICAgdmFyIGFuZ2xlID0gZGlyZWN0aW9uID09PSAnbGVmdCcgPyBnZW5lcmF0ZVJhbmRvbU51bWJlcihNQVhfQ09ORkVUVElfQU5HTEUsIE1JTl9DT05GRVRUSV9BTkdMRSkgKiBNYXRoLlBJIC8gMTgwIDogZ2VuZXJhdGVSYW5kb21OdW1iZXIoLU1JTl9DT05GRVRUSV9BTkdMRSwgLU1BWF9DT05GRVRUSV9BTkdMRSkgKiBNYXRoLlBJIC8gMTgwO1xuICAgIHRoaXMuYWJzQ29zID0gTWF0aC5hYnMoTWF0aC5jb3MoYW5nbGUpKTtcbiAgICB0aGlzLmFic1NpbiA9IE1hdGguYWJzKE1hdGguc2luKGFuZ2xlKSk7XG4gICAgdmFyIHBvc2l0aW9uU2hpZnQgPSBnZW5lcmF0ZVJhbmRvbU51bWJlcigtTUFYX0NPTkZFVFRJX1BPU0lUSU9OX1NISUZULCAwKTtcbiAgICB2YXIgc2hpZnRlZEluaXRpYWxQb3NpdGlvbiA9IHtcbiAgICAgIHg6IGluaXRpYWxQb3NpdGlvbi54ICsgKGRpcmVjdGlvbiA9PT0gJ2xlZnQnID8gLXBvc2l0aW9uU2hpZnQgOiBwb3NpdGlvblNoaWZ0KSAqIHRoaXMuYWJzQ29zLFxuICAgICAgeTogaW5pdGlhbFBvc2l0aW9uLnkgLSBwb3NpdGlvblNoaWZ0ICogdGhpcy5hYnNTaW5cbiAgICB9O1xuICAgIHRoaXMuY3VycmVudFBvc2l0aW9uID0gT2JqZWN0LmFzc2lnbih7fSwgc2hpZnRlZEluaXRpYWxQb3NpdGlvbik7XG4gICAgdGhpcy5pbml0aWFsUG9zaXRpb24gPSBPYmplY3QuYXNzaWduKHt9LCBzaGlmdGVkSW5pdGlhbFBvc2l0aW9uKTtcbiAgICB0aGlzLmNvbG9yID0gZW1vamlzLmxlbmd0aCA/IG51bGwgOiBnZW5lcmF0ZVJhbmRvbUFycmF5RWxlbWVudChjb25mZXR0aUNvbG9ycyk7XG4gICAgdGhpcy5lbW9qaSA9IGVtb2ppcy5sZW5ndGggPyBnZW5lcmF0ZVJhbmRvbUFycmF5RWxlbWVudChlbW9qaXMpIDogbnVsbDtcbiAgICB0aGlzLmNyZWF0ZWRBdCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKENvbmZldHRpU2hhcGUsIFt7XG4gICAga2V5OiBcImRyYXdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZHJhdyhjYW52YXNDb250ZXh0KSB7XG4gICAgICB2YXIgY3VycmVudFBvc2l0aW9uID0gdGhpcy5jdXJyZW50UG9zaXRpb24sXG4gICAgICAgICAgcmFkaXVzID0gdGhpcy5yYWRpdXMsXG4gICAgICAgICAgY29sb3IgPSB0aGlzLmNvbG9yLFxuICAgICAgICAgIGVtb2ppID0gdGhpcy5lbW9qaSxcbiAgICAgICAgICByb3RhdGlvbkFuZ2xlID0gdGhpcy5yb3RhdGlvbkFuZ2xlLFxuICAgICAgICAgIGVtb2ppUm90YXRpb25BbmdsZSA9IHRoaXMuZW1vamlSb3RhdGlvbkFuZ2xlLFxuICAgICAgICAgIGVtb2ppU2l6ZSA9IHRoaXMuZW1vamlTaXplO1xuICAgICAgdmFyIGRwciA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuXG4gICAgICBpZiAoY29sb3IpIHtcbiAgICAgICAgY2FudmFzQ29udGV4dC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICAgICAgY2FudmFzQ29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgY2FudmFzQ29udGV4dC5lbGxpcHNlKGN1cnJlbnRQb3NpdGlvbi54ICogZHByLCBjdXJyZW50UG9zaXRpb24ueSAqIGRwciwgcmFkaXVzLnggKiBkcHIsIHJhZGl1cy55ICogZHByLCByb3RhdGlvbkFuZ2xlLCAwLCAyICogTWF0aC5QSSk7XG4gICAgICAgIGNhbnZhc0NvbnRleHQuZmlsbCgpO1xuICAgICAgfSBlbHNlIGlmIChlbW9qaSkge1xuICAgICAgICBjYW52YXNDb250ZXh0LmZvbnQgPSBcIlwiLmNvbmNhdChlbW9qaVNpemUsIFwicHggc2VyaWZcIik7XG4gICAgICAgIGNhbnZhc0NvbnRleHQuc2F2ZSgpO1xuICAgICAgICBjYW52YXNDb250ZXh0LnRyYW5zbGF0ZShkcHIgKiBjdXJyZW50UG9zaXRpb24ueCwgZHByICogY3VycmVudFBvc2l0aW9uLnkpO1xuICAgICAgICBjYW52YXNDb250ZXh0LnJvdGF0ZShlbW9qaVJvdGF0aW9uQW5nbGUpO1xuICAgICAgICBjYW52YXNDb250ZXh0LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICBjYW52YXNDb250ZXh0LmZpbGxUZXh0KGVtb2ppLCAwLCAwKTtcbiAgICAgICAgY2FudmFzQ29udGV4dC5yZXN0b3JlKCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInVwZGF0ZVBvc2l0aW9uXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZVBvc2l0aW9uKGl0ZXJhdGlvblRpbWVEZWx0YSwgY3VycmVudFRpbWUpIHtcbiAgICAgIHZhciBjb25mZXR0aVNwZWVkID0gdGhpcy5jb25mZXR0aVNwZWVkLFxuICAgICAgICAgIGRyYWdGb3JjZUNvZWZmaWNpZW50ID0gdGhpcy5kcmFnRm9yY2VDb2VmZmljaWVudCxcbiAgICAgICAgICBmaW5hbENvbmZldHRpU3BlZWRYID0gdGhpcy5maW5hbENvbmZldHRpU3BlZWRYLFxuICAgICAgICAgIHJhZGl1c1lVcGRhdGVEaXJlY3Rpb24gPSB0aGlzLnJhZGl1c1lVcGRhdGVEaXJlY3Rpb24sXG4gICAgICAgICAgcm90YXRpb25TcGVlZCA9IHRoaXMucm90YXRpb25TcGVlZCxcbiAgICAgICAgICBjcmVhdGVkQXQgPSB0aGlzLmNyZWF0ZWRBdCxcbiAgICAgICAgICBkaXJlY3Rpb24gPSB0aGlzLmRpcmVjdGlvbjtcbiAgICAgIHZhciB0aW1lRGVsdGFTaW5jZUNyZWF0aW9uID0gY3VycmVudFRpbWUgLSBjcmVhdGVkQXQ7XG4gICAgICBpZiAoY29uZmV0dGlTcGVlZC54ID4gZmluYWxDb25mZXR0aVNwZWVkWCkgdGhpcy5jb25mZXR0aVNwZWVkLnggLT0gZHJhZ0ZvcmNlQ29lZmZpY2llbnQgKiBpdGVyYXRpb25UaW1lRGVsdGE7XG4gICAgICB0aGlzLmN1cnJlbnRQb3NpdGlvbi54ICs9IGNvbmZldHRpU3BlZWQueCAqIChkaXJlY3Rpb24gPT09ICdsZWZ0JyA/IC10aGlzLmFic0NvcyA6IHRoaXMuYWJzQ29zKSAqIGl0ZXJhdGlvblRpbWVEZWx0YTtcbiAgICAgIHRoaXMuY3VycmVudFBvc2l0aW9uLnkgPSB0aGlzLmluaXRpYWxQb3NpdGlvbi55IC0gY29uZmV0dGlTcGVlZC55ICogdGhpcy5hYnNTaW4gKiB0aW1lRGVsdGFTaW5jZUNyZWF0aW9uICsgRlJFRV9GQUxMSU5HX09CSkVDVF9BQ0NFTEVSQVRJT04gKiBNYXRoLnBvdyh0aW1lRGVsdGFTaW5jZUNyZWF0aW9uLCAyKSAvIDI7XG4gICAgICB0aGlzLnJvdGF0aW9uU3BlZWQgLT0gdGhpcy5lbW9qaSA/IDAuMDAwMSA6IFJPVEFUSU9OX1NMT1dET1dOX0FDQ0VMRVJBVElPTiAqIGl0ZXJhdGlvblRpbWVEZWx0YTtcbiAgICAgIGlmICh0aGlzLnJvdGF0aW9uU3BlZWQgPCAwKSB0aGlzLnJvdGF0aW9uU3BlZWQgPSAwOyAvLyBubyBuZWVkIHRvIHVwZGF0ZSByb3RhdGlvbiByYWRpdXMgZm9yIGVtb2ppXG5cbiAgICAgIGlmICh0aGlzLmVtb2ppKSB7XG4gICAgICAgIHRoaXMuZW1vamlSb3RhdGlvbkFuZ2xlICs9IHRoaXMucm90YXRpb25TcGVlZCAqIGl0ZXJhdGlvblRpbWVEZWx0YSAlICgyICogTWF0aC5QSSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHJhZGl1c1lVcGRhdGVEaXJlY3Rpb24gPT09ICdkb3duJykge1xuICAgICAgICB0aGlzLnJhZGl1cy55IC09IGl0ZXJhdGlvblRpbWVEZWx0YSAqIHJvdGF0aW9uU3BlZWQ7XG5cbiAgICAgICAgaWYgKHRoaXMucmFkaXVzLnkgPD0gMCkge1xuICAgICAgICAgIHRoaXMucmFkaXVzLnkgPSAwO1xuICAgICAgICAgIHRoaXMucmFkaXVzWVVwZGF0ZURpcmVjdGlvbiA9ICd1cCc7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmFkaXVzLnkgKz0gaXRlcmF0aW9uVGltZURlbHRhICogcm90YXRpb25TcGVlZDtcblxuICAgICAgICBpZiAodGhpcy5yYWRpdXMueSA+PSB0aGlzLmluaXRpYWxSYWRpdXMpIHtcbiAgICAgICAgICB0aGlzLnJhZGl1cy55ID0gdGhpcy5pbml0aWFsUmFkaXVzO1xuICAgICAgICAgIHRoaXMucmFkaXVzWVVwZGF0ZURpcmVjdGlvbiA9ICdkb3duJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRJc1Zpc2libGVPbkNhbnZhc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRJc1Zpc2libGVPbkNhbnZhcyhjYW52YXNIZWlnaHQpIHtcbiAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRQb3NpdGlvbi55IDwgY2FudmFzSGVpZ2h0ICsgU0hBUEVfVklTSUJJTElUWV9UUkVTSE9MRDtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gQ29uZmV0dGlTaGFwZTtcbn0oKTtcblxuZnVuY3Rpb24gY3JlYXRlQ2FudmFzKCkge1xuICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gIGNhbnZhcy5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XG4gIGNhbnZhcy5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgY2FudmFzLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcbiAgY2FudmFzLnN0eWxlLnRvcCA9ICcwJztcbiAgY2FudmFzLnN0eWxlLmxlZnQgPSAnMCc7XG4gIGNhbnZhcy5zdHlsZS56SW5kZXggPSAnMTAwMCc7XG4gIGNhbnZhcy5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gIHJldHVybiBjYW52YXM7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUNvbmZldHRpQ29uZmlnKGNvbmZldHRpQ29uZmlnKSB7XG4gIHZhciBfY29uZmV0dGlDb25maWckY29uZmUgPSBjb25mZXR0aUNvbmZpZy5jb25mZXR0aVJhZGl1cyxcbiAgICAgIGNvbmZldHRpUmFkaXVzID0gX2NvbmZldHRpQ29uZmlnJGNvbmZlID09PSB2b2lkIDAgPyBJTklUSUFMX1NIQVBFX1JBRElVUyA6IF9jb25mZXR0aUNvbmZpZyRjb25mZSxcbiAgICAgIF9jb25mZXR0aUNvbmZpZyRjb25mZTIgPSBjb25mZXR0aUNvbmZpZy5jb25mZXR0aU51bWJlcixcbiAgICAgIGNvbmZldHRpTnVtYmVyID0gX2NvbmZldHRpQ29uZmlnJGNvbmZlMiA9PT0gdm9pZCAwID8gY29uZmV0dGlDb25maWcuY29uZmV0dGllc051bWJlciB8fCAoY29uZmV0dGlDb25maWcuZW1vamlzID8gREVGQVVMVF9FTU9KSVNfTlVNQkVSIDogREVGQVVMVF9DT05GRVRUSV9OVU1CRVIpIDogX2NvbmZldHRpQ29uZmlnJGNvbmZlMixcbiAgICAgIF9jb25mZXR0aUNvbmZpZyRjb25mZTMgPSBjb25mZXR0aUNvbmZpZy5jb25mZXR0aUNvbG9ycyxcbiAgICAgIGNvbmZldHRpQ29sb3JzID0gX2NvbmZldHRpQ29uZmlnJGNvbmZlMyA9PT0gdm9pZCAwID8gREVGQVVMVF9DT05GRVRUSV9DT0xPUlMgOiBfY29uZmV0dGlDb25maWckY29uZmUzLFxuICAgICAgX2NvbmZldHRpQ29uZmlnJGVtb2ppID0gY29uZmV0dGlDb25maWcuZW1vamlzLFxuICAgICAgZW1vamlzID0gX2NvbmZldHRpQ29uZmlnJGVtb2ppID09PSB2b2lkIDAgPyBjb25mZXR0aUNvbmZpZy5lbW9qaWVzIHx8IFtdIDogX2NvbmZldHRpQ29uZmlnJGVtb2ppLFxuICAgICAgX2NvbmZldHRpQ29uZmlnJGVtb2ppMiA9IGNvbmZldHRpQ29uZmlnLmVtb2ppU2l6ZSxcbiAgICAgIGVtb2ppU2l6ZSA9IF9jb25mZXR0aUNvbmZpZyRlbW9qaTIgPT09IHZvaWQgMCA/IElOSVRJQUxfRU1PSklfU0laRSA6IF9jb25mZXR0aUNvbmZpZyRlbW9qaTI7IC8vIGRlcHJlY2F0ZSB3cm9uZyBwbHVyYWwgZm9ybXMsIHVzZWQgaW4gZWFybHkgcmVsZWFzZXNcblxuICBpZiAoY29uZmV0dGlDb25maWcuZW1vamllcykgY29uc29sZS5lcnJvcihcImVtb2ppZXMgYXJndW1lbnQgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSBlbW9qaXMgaW5zdGVhZFwiKTtcbiAgaWYgKGNvbmZldHRpQ29uZmlnLmNvbmZldHRpZXNOdW1iZXIpIGNvbnNvbGUuZXJyb3IoXCJjb25mZXR0aWVzTnVtYmVyIGFyZ3VtZW50IGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSB1c2UgY29uZmV0dGlOdW1iZXIgaW5zdGVhZFwiKTtcbiAgcmV0dXJuIHtcbiAgICBjb25mZXR0aVJhZGl1czogY29uZmV0dGlSYWRpdXMsXG4gICAgY29uZmV0dGlOdW1iZXI6IGNvbmZldHRpTnVtYmVyLFxuICAgIGNvbmZldHRpQ29sb3JzOiBjb25mZXR0aUNvbG9ycyxcbiAgICBlbW9qaXM6IGVtb2ppcyxcbiAgICBlbW9qaVNpemU6IGVtb2ppU2l6ZVxuICB9O1xufVxuXG52YXIgQ29uZmV0dGlCYXRjaCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIENvbmZldHRpQmF0Y2goY2FudmFzQ29udGV4dCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ29uZmV0dGlCYXRjaCk7XG5cbiAgICB0aGlzLmNhbnZhc0NvbnRleHQgPSBjYW52YXNDb250ZXh0O1xuICAgIHRoaXMuc2hhcGVzID0gW107XG4gICAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKGNvbXBsZXRpb25DYWxsYmFjaykge1xuICAgICAgcmV0dXJuIF90aGlzLnJlc29sdmVQcm9taXNlID0gY29tcGxldGlvbkNhbGxiYWNrO1xuICAgIH0pO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKENvbmZldHRpQmF0Y2gsIFt7XG4gICAga2V5OiBcImdldEJhdGNoQ29tcGxldGVQcm9taXNlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEJhdGNoQ29tcGxldGVQcm9taXNlKCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiYWRkU2hhcGVzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZFNoYXBlcygpIHtcbiAgICAgIHZhciBfdGhpcyRzaGFwZXM7XG5cbiAgICAgIChfdGhpcyRzaGFwZXMgPSB0aGlzLnNoYXBlcykucHVzaC5hcHBseShfdGhpcyRzaGFwZXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNvbXBsZXRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBsZXRlKCkge1xuICAgICAgdmFyIF9hO1xuXG4gICAgICBpZiAodGhpcy5zaGFwZXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgKF9hID0gdGhpcy5yZXNvbHZlUHJvbWlzZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwodGhpcyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicHJvY2Vzc1NoYXBlc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwcm9jZXNzU2hhcGVzKHRpbWUsIGNhbnZhc0hlaWdodCwgY2xlYW51cEludmlzaWJsZVNoYXBlcykge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIHZhciB0aW1lRGVsdGEgPSB0aW1lLnRpbWVEZWx0YSxcbiAgICAgICAgICBjdXJyZW50VGltZSA9IHRpbWUuY3VycmVudFRpbWU7XG4gICAgICB0aGlzLnNoYXBlcyA9IHRoaXMuc2hhcGVzLmZpbHRlcihmdW5jdGlvbiAoc2hhcGUpIHtcbiAgICAgICAgLy8gUmVuZGVyIHRoZSBzaGFwZXMgaW4gdGhpcyBiYXRjaFxuICAgICAgICBzaGFwZS51cGRhdGVQb3NpdGlvbih0aW1lRGVsdGEsIGN1cnJlbnRUaW1lKTtcbiAgICAgICAgc2hhcGUuZHJhdyhfdGhpczIuY2FudmFzQ29udGV4dCk7IC8vIE9ubHkgY2xlYW51cCB0aGUgc2hhcGVzIGlmIHdlJ3JlIGJlaW5nIGFza2VkIHRvXG5cbiAgICAgICAgaWYgKCFjbGVhbnVwSW52aXNpYmxlU2hhcGVzKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2hhcGUuZ2V0SXNWaXNpYmxlT25DYW52YXMoY2FudmFzSGVpZ2h0KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBDb25mZXR0aUJhdGNoO1xufSgpO1xuXG52YXIgSlNDb25mZXR0aSA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEpTQ29uZmV0dGkoKSB7XG4gICAgdmFyIGpzQ29uZmV0dGlDb25maWcgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEpTQ29uZmV0dGkpO1xuXG4gICAgdGhpcy5hY3RpdmVDb25mZXR0aUJhdGNoZXMgPSBbXTtcbiAgICB0aGlzLmNhbnZhcyA9IGpzQ29uZmV0dGlDb25maWcuY2FudmFzIHx8IGNyZWF0ZUNhbnZhcygpO1xuICAgIHRoaXMuY2FudmFzQ29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgdGhpcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVSZXF1ZXN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmxhc3RVcGRhdGVkID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgdGhpcy5pdGVyYXRpb25JbmRleCA9IDA7XG4gICAgdGhpcy5sb29wID0gdGhpcy5sb29wLmJpbmQodGhpcyk7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMubG9vcCk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoSlNDb25mZXR0aSwgW3tcbiAgICBrZXk6IFwibG9vcFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsb29wKCkge1xuICAgICAgdGhpcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVSZXF1ZXN0ZWQgPSBmYWxzZTtcbiAgICAgIGZpeERQUih0aGlzLmNhbnZhcyk7XG4gICAgICB2YXIgY3VycmVudFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIHZhciB0aW1lRGVsdGEgPSBjdXJyZW50VGltZSAtIHRoaXMubGFzdFVwZGF0ZWQ7XG4gICAgICB2YXIgY2FudmFzSGVpZ2h0ID0gdGhpcy5jYW52YXMub2Zmc2V0SGVpZ2h0O1xuICAgICAgdmFyIGNsZWFudXBJbnZpc2libGVTaGFwZXMgPSB0aGlzLml0ZXJhdGlvbkluZGV4ICUgMTAgPT09IDA7XG4gICAgICB0aGlzLmFjdGl2ZUNvbmZldHRpQmF0Y2hlcyA9IHRoaXMuYWN0aXZlQ29uZmV0dGlCYXRjaGVzLmZpbHRlcihmdW5jdGlvbiAoYmF0Y2gpIHtcbiAgICAgICAgYmF0Y2gucHJvY2Vzc1NoYXBlcyh7XG4gICAgICAgICAgdGltZURlbHRhOiB0aW1lRGVsdGEsXG4gICAgICAgICAgY3VycmVudFRpbWU6IGN1cnJlbnRUaW1lXG4gICAgICAgIH0sIGNhbnZhc0hlaWdodCwgY2xlYW51cEludmlzaWJsZVNoYXBlcyk7IC8vIERvIG5vdCByZW1vdmUgaW52aXNpYmxlIHNoYXBlcyBvbiBldmVyeSBpdGVyYXRpb25cblxuICAgICAgICBpZiAoIWNsZWFudXBJbnZpc2libGVTaGFwZXMpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhYmF0Y2guY29tcGxldGUoKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5pdGVyYXRpb25JbmRleCsrO1xuICAgICAgdGhpcy5xdWV1ZUFuaW1hdGlvbkZyYW1lSWZOZWVkZWQoY3VycmVudFRpbWUpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJxdWV1ZUFuaW1hdGlvbkZyYW1lSWZOZWVkZWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcXVldWVBbmltYXRpb25GcmFtZUlmTmVlZGVkKGN1cnJlbnRUaW1lKSB7XG4gICAgICBpZiAodGhpcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVSZXF1ZXN0ZWQpIHtcbiAgICAgICAgLy8gV2UgYWxyZWFkeSBoYXZlIGEgcGVuZGVkIGFuaW1hdGlvbiBmcmFtZSwgc28gdGhlcmUgaXMgbm8gbW9yZSB3b3JrXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuYWN0aXZlQ29uZmV0dGlCYXRjaGVzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgLy8gTm8gc2hhcGVzIHRvIGFuaW1hdGUsIHNvIGRvbid0IHF1ZXVlIGFub3RoZXIgZnJhbWVcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJlcXVlc3RBbmltYXRpb25GcmFtZVJlcXVlc3RlZCA9IHRydWU7IC8vIENhcHR1cmUgdGhlIGxhc3QgdXBkYXRlZCB0aW1lIGZvciBhbmltYXRpb25cblxuICAgICAgdGhpcy5sYXN0VXBkYXRlZCA9IGN1cnJlbnRUaW1lIHx8IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMubG9vcCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImFkZENvbmZldHRpXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZENvbmZldHRpKCkge1xuICAgICAgdmFyIGNvbmZldHRpQ29uZmlnID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuICAgICAgdmFyIF9ub3JtYWxpemVDb25mZXR0aUNvbiA9IG5vcm1hbGl6ZUNvbmZldHRpQ29uZmlnKGNvbmZldHRpQ29uZmlnKSxcbiAgICAgICAgICBjb25mZXR0aVJhZGl1cyA9IF9ub3JtYWxpemVDb25mZXR0aUNvbi5jb25mZXR0aVJhZGl1cyxcbiAgICAgICAgICBjb25mZXR0aU51bWJlciA9IF9ub3JtYWxpemVDb25mZXR0aUNvbi5jb25mZXR0aU51bWJlcixcbiAgICAgICAgICBjb25mZXR0aUNvbG9ycyA9IF9ub3JtYWxpemVDb25mZXR0aUNvbi5jb25mZXR0aUNvbG9ycyxcbiAgICAgICAgICBlbW9qaXMgPSBfbm9ybWFsaXplQ29uZmV0dGlDb24uZW1vamlzLFxuICAgICAgICAgIGVtb2ppU2l6ZSA9IF9ub3JtYWxpemVDb25mZXR0aUNvbi5lbW9qaVNpemU7IC8vIFVzZSB0aGUgYm91bmRpbmcgcmVjdCByYXRoZXIgdGFobiB0aGUgY2FudmFzIHdpZHRoIC8gaGVpZ2h0LCBiZWNhdXNlXG4gICAgICAvLyAud2lkdGggLyAuaGVpZ2h0IGFyZSB1bnNldCB1bnRpbCBhIGxheW91dCBwYXNzIGhhcyBiZWVuIGNvbXBsZXRlZC4gVXBvblxuICAgICAgLy8gY29uZmV0dGkgYmVpbmcgaW1tZWRpYXRlbHkgcXVldWVkIG9uIGEgcGFnZSBsb2FkLCB0aGlzIGhhc24ndCBoYXBwZW5lZCBzb1xuICAgICAgLy8gdGhlIGRlZmF1bHQgb2YgMzAweDE1MCB3aWxsIGJlIHJldHVybmVkLCBjYXVzaW5nIGFuIGltcHJvcGVyIHNvdXJjZSBwb2ludFxuICAgICAgLy8gZm9yIHRoZSBjb25mZXR0aSBhbmltYXRpb24uXG5cblxuICAgICAgdmFyIGNhbnZhc1JlY3QgPSB0aGlzLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIHZhciBjYW52YXNXaWR0aCA9IGNhbnZhc1JlY3Qud2lkdGg7XG4gICAgICB2YXIgY2FudmFzSGVpZ2h0ID0gY2FudmFzUmVjdC5oZWlnaHQ7XG4gICAgICB2YXIgeVBvc2l0aW9uID0gY2FudmFzSGVpZ2h0ICogNSAvIDc7XG4gICAgICB2YXIgbGVmdENvbmZldHRpUG9zaXRpb24gPSB7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IHlQb3NpdGlvblxuICAgICAgfTtcbiAgICAgIHZhciByaWdodENvbmZldHRpUG9zaXRpb24gPSB7XG4gICAgICAgIHg6IGNhbnZhc1dpZHRoLFxuICAgICAgICB5OiB5UG9zaXRpb25cbiAgICAgIH07XG4gICAgICB2YXIgY29uZmV0dGlHcm91cCA9IG5ldyBDb25mZXR0aUJhdGNoKHRoaXMuY2FudmFzQ29udGV4dCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29uZmV0dGlOdW1iZXIgLyAyOyBpKyspIHtcbiAgICAgICAgdmFyIGNvbmZldHRpT25UaGVSaWdodCA9IG5ldyBDb25mZXR0aVNoYXBlKHtcbiAgICAgICAgICBpbml0aWFsUG9zaXRpb246IGxlZnRDb25mZXR0aVBvc2l0aW9uLFxuICAgICAgICAgIGRpcmVjdGlvbjogJ3JpZ2h0JyxcbiAgICAgICAgICBjb25mZXR0aVJhZGl1czogY29uZmV0dGlSYWRpdXMsXG4gICAgICAgICAgY29uZmV0dGlDb2xvcnM6IGNvbmZldHRpQ29sb3JzLFxuICAgICAgICAgIGNvbmZldHRpTnVtYmVyOiBjb25mZXR0aU51bWJlcixcbiAgICAgICAgICBlbW9qaXM6IGVtb2ppcyxcbiAgICAgICAgICBlbW9qaVNpemU6IGVtb2ppU2l6ZSxcbiAgICAgICAgICBjYW52YXNXaWR0aDogY2FudmFzV2lkdGhcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBjb25mZXR0aU9uVGhlTGVmdCA9IG5ldyBDb25mZXR0aVNoYXBlKHtcbiAgICAgICAgICBpbml0aWFsUG9zaXRpb246IHJpZ2h0Q29uZmV0dGlQb3NpdGlvbixcbiAgICAgICAgICBkaXJlY3Rpb246ICdsZWZ0JyxcbiAgICAgICAgICBjb25mZXR0aVJhZGl1czogY29uZmV0dGlSYWRpdXMsXG4gICAgICAgICAgY29uZmV0dGlDb2xvcnM6IGNvbmZldHRpQ29sb3JzLFxuICAgICAgICAgIGNvbmZldHRpTnVtYmVyOiBjb25mZXR0aU51bWJlcixcbiAgICAgICAgICBlbW9qaXM6IGVtb2ppcyxcbiAgICAgICAgICBlbW9qaVNpemU6IGVtb2ppU2l6ZSxcbiAgICAgICAgICBjYW52YXNXaWR0aDogY2FudmFzV2lkdGhcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbmZldHRpR3JvdXAuYWRkU2hhcGVzKGNvbmZldHRpT25UaGVSaWdodCwgY29uZmV0dGlPblRoZUxlZnQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmFjdGl2ZUNvbmZldHRpQmF0Y2hlcy5wdXNoKGNvbmZldHRpR3JvdXApO1xuICAgICAgdGhpcy5xdWV1ZUFuaW1hdGlvbkZyYW1lSWZOZWVkZWQoKTtcbiAgICAgIHJldHVybiBjb25mZXR0aUdyb3VwLmdldEJhdGNoQ29tcGxldGVQcm9taXNlKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNsZWFyQ2FudmFzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNsZWFyQ2FudmFzKCkge1xuICAgICAgdGhpcy5hY3RpdmVDb25mZXR0aUJhdGNoZXMgPSBbXTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gSlNDb25mZXR0aTtcbn0oKTtcblxuZXhwb3J0IGRlZmF1bHQgSlNDb25mZXR0aTtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9ydWxlU2V0WzFdLnJ1bGVzWzBdLnVzZVsyXSEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanMhLi9tYWluLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cnVsZVNldFsxXS5ydWxlc1swXS51c2VbMl0hLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vbWFpbi5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIuL1wiOyIsIl9fd2VicGFja19yZXF1aXJlX18uYiA9IGRvY3VtZW50LmJhc2VVUkkgfHwgc2VsZi5sb2NhdGlvbi5ocmVmO1xuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG4vLyBubyBvbiBjaHVua3MgbG9hZGVkXG5cbi8vIG5vIGpzb25wIGZ1bmN0aW9uIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFwiLi4vc3R5bGUvbWFpbi5jc3NcIjtcbmltcG9ydCB7IENhbXBhaWduIH0gZnJvbSBcIi4vY2FtcGFpZ24uanNcIjtcbmltcG9ydCB7IFJvdW5kIH0gZnJvbSBcIi4vcm91bmQuanNcIjtcbmltcG9ydCB7IFVJIH0gZnJvbSBcIi4vdWkuanNcIjtcbmltcG9ydCB7IFdPUkRTIH0gZnJvbSBcIi4vd29yZHMuanNcIjtcbmltcG9ydCB7IFdPUkRTX1NVUFBMRU1FTlQgfSBmcm9tIFwiLi93b3Jkcy1zdXBwbGVtZW50LmpzXCI7XG5pbXBvcnQgSlNDb25mZXR0aSBmcm9tIFwianMtY29uZmV0dGlcIjtcblxubGV0IGdhbWUsIHVpLCBjYW1wYWlnbjtcbmNvbnN0IGpzQ29uZmV0dGkgPSBuZXcgSlNDb25mZXR0aSgpO1xuXG5hc3luYyBmdW5jdGlvbiBjaGVja1JvdygpIHtcbiAgY29uc3QgZ3Vlc3MgPSB1aS5ib2FyZFt1aS5jdXJSb3ddLmpvaW4oXCJcIik7XG4gIHVpLmNsaWNrQXVkaW8ucGF1c2UoKTtcbiAgaWYgKFxuICAgICFXT1JEUy5pbmNsdWRlcyhndWVzcy50b1VwcGVyQ2FzZSgpKSAmJlxuICAgICFXT1JEU19TVVBQTEVNRU5ULmluY2x1ZGVzKGd1ZXNzLnRvVXBwZXJDYXNlKCkpXG4gICkge1xuICAgIHVpLmludmFsaWRBdWRpby5wbGF5KCkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAvKmRvIG5vdGhpbmcgLSBpdCdzIGp1c3QgYXVkaW8qL1xuICAgIH0pO1xuICAgIHVpLmRpc3BsYXlNZXNzYWdlKGAke2d1ZXNzfSBpcyBub3QgYSB3b3JkYCk7XG4gICAgQkFDS1NQQUNFLmNsYXNzTGlzdC5hZGQoXCJub3RXb3JkXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBnYW1lLnN1Ym1pdEd1ZXNzKGd1ZXNzKTtcbiAgYXdhaXQgdWkucmV2ZWFsR3Vlc3MoZ2FtZS5ndWVzc1N0YXR1cygpKTtcbiAgdWkudXBkYXRlS2V5Ym9hcmQoZ2FtZS5sZXR0ZXJTdGF0dXMpO1xuICBpZiAoZ2FtZS5zZWNyZXRXb3JkID09PSBndWVzcykge1xuICAgIHdpblJvdXRpbmUoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKHVpLmN1clJvdyA+PSA1KSB7XG4gICAgbG9zZVJvdXRpbmUoKTtcbiAgICByZXR1cm47XG4gIH1cblxuICB1aS5jdXJSb3crKztcbiAgdWkuY3VyQ29sID0gMDtcbn1cblxuZnVuY3Rpb24gd2luUm91dGluZSgpIHtcbiAgdWkuY3VyUm93Kys7XG4gIGxldCBnYW1lRGV0YWlscyA9IHtcbiAgICBvdXRjb21lOiBcIndvblwiLFxuICAgIGF0dGVtcHRzOiB1aS5jdXJSb3csXG4gICAgd29yZDogZ2FtZS5zZWNyZXRXb3JkLFxuICAgIHNjb3JlOiBnYW1lLndvcmRCYXNlUG9pbnRWYWx1ZSgpICogMTAgKiogKDYgLSB1aS5jdXJSb3cpLFxuICB9O1xuICB1aS5idXN5ID0gdHJ1ZTtcbiAgdWkuc3VjY2Vzc0F1ZGlvLnBsYXkoKS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAvKmRvIG5vdGhpbmcgLSBpdCdzIGp1c3QgYXVkaW8qL1xuICB9KTtcbiAganNDb25mZXR0aS5hZGRDb25mZXR0aSh7XG4gICAgY29uZmV0dGlDb2xvcnM6IFtcbiAgICAgIFwiIzE3YWFkOFwiLFxuICAgICAgXCIjMDE3Y2IwXCIsXG4gICAgICBcIiMwYjYxYThcIixcbiAgICAgIFwiI2ZlOTIwMFwiLFxuICAgICAgXCIjZWU2MTBhXCIsXG4gICAgICBcIiNlYTQxMGJcIixcbiAgICBdLFxuICB9KTtcbiAgY2FtcGFpZ24udXBkYXRlQ2FtcGFpZ24oZ2FtZURldGFpbHMpO1xuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICB1aS5zaG93TW9kYWwoXG4gICAgICBcIlN1Y2Nlc3NcIixcbiAgICAgIFtcbiAgICAgICAgdGFibGl6ZVN0YXRzKGdhbWVEZXRhaWxzKSxcbiAgICAgICAgXCI8aT5XaGF0IGl0IG1lYW5zOjwvPlwiLFxuICAgICAgICAuLi5mb3JtYXREZWZpbml0aW9uKGdhbWUud29yZERlZmluaXRpb24pLFxuICAgICAgXSxcbiAgICAgIGdhbWUuZ2FtZVN0YXRlXG4gICAgKTtcbiAgICB1aS5idXN5ID0gZmFsc2U7XG4gIH0sIDE1MDApO1xufVxuXG5mdW5jdGlvbiBsb3NlUm91dGluZSgpIHtcbiAgdWkuY3VyUm93Kys7XG4gIGxldCBnYW1lRGV0YWlscyA9IHtcbiAgICBvdXRjb21lOiBcImxvc3RcIixcbiAgICBhdHRlbXB0czogdWkuY3VyUm93LFxuICAgIHdvcmQ6IGdhbWUuc2VjcmV0V29yZCxcbiAgICBzY29yZTpcbiAgICAgIGNhbXBhaWduLmF2ZXJhZ2VTY29yZSgpID4gMFxuICAgICAgICA/IC0xICogY2FtcGFpZ24uYXZlcmFnZVNjb3JlKClcbiAgICAgICAgOiBjYW1wYWlnbi5hdmVyYWdlU2NvcmUoKSxcbiAgfTtcbiAgY2FtcGFpZ24udXBkYXRlQ2FtcGFpZ24oZ2FtZURldGFpbHMpO1xuICB1aS5mYWlsQXVkaW8ucGxheSgpLmNhdGNoKChlcnJvcikgPT4ge1xuICAgIC8qZG8gbm90aGluZyAtIGl0J3MganVzdCBhdWRpbyovXG4gIH0pO1xuICB1aS5zaG93TW9kYWwoXG4gICAgXCJGYWlsdXJlXCIsXG4gICAgW1xuICAgICAgdGFibGl6ZVN0YXRzKGdhbWVEZXRhaWxzKSxcbiAgICAgIFwiPGk+V2hhdCBpdCBtZWFuczo8Lz5cIixcbiAgICAgIC4uLmZvcm1hdERlZmluaXRpb24oZ2FtZS53b3JkRGVmaW5pdGlvbiksXG4gICAgXSxcbiAgICBnYW1lLmdhbWVTdGF0ZVxuICApO1xufVxuXG5mdW5jdGlvbiBmb3JtYXREZWZpbml0aW9uKHBhY2tlZERlZmluaXRpb24pIHtcbiAgcmV0dXJuIHBhY2tlZERlZmluaXRpb24ubWFwKChlbCkgPT4ge1xuICAgIGxldCBodG1sU3RyaW5nID0gXCJcIjtcbiAgICBpZiAoZWwucGFydE9mU3BlZWNoKSBodG1sU3RyaW5nID0gYDxpPiR7ZWwucGFydE9mU3BlZWNofTo8L2k+Jm5ic3A7Jm5ic3A7YDtcbiAgICByZXR1cm4gYCR7aHRtbFN0cmluZ30ke2VsLmRlZmluaXRpb259YDtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHRhYmxpemVTdGF0cyhnYW1lRGV0YWlscykge1xuICBsZXQgc3RhdFN0ciA9IFwiPGhyPjx0YWJsZSBjbGFzcz0nc3RhdFRhYmxlJz5cIjtcblxuICBmdW5jdGlvbiBzdGF0Um93KHN0YXRLZXksIHN0YXRWYWx1ZSkge1xuICAgIHJldHVybiBgPHRyPjx0ZD4ke3N0YXRLZXl9PC90ZD48dGQgY2xhc3M9XCJzdGF0TnVtXCI+JHtzdGF0VmFsdWV9PC90ZD48L3RyPmA7XG4gIH1cblxuICBpZiAoZ2FtZURldGFpbHMpIHtcbiAgICBzdGF0U3RyID0gYCR7c3RhdFN0cn0ke3N0YXRSb3coXCJXb3JkXCIsIGdhbWVEZXRhaWxzLndvcmQpfWA7XG4gICAgc3RhdFN0ciA9IGAke3N0YXRTdHJ9JHtzdGF0Um93KFwiQXR0ZW1wdHNcIiwgZ2FtZURldGFpbHMuYXR0ZW1wdHMpfWA7XG4gICAgc3RhdFN0ciA9IGAke3N0YXRTdHJ9JHtzdGF0Um93KFwiUm91bmQgU2NvcmVcIiwgZ2FtZURldGFpbHMuc2NvcmUpfWA7XG4gIH1cbiAgZm9yIChsZXQgZWwgb2YgY2FtcGFpZ24uY2FtcGFpZ25TdW1tYXJ5KCkpIHtcbiAgICBzdGF0U3RyID0gYCR7c3RhdFN0cn0ke3N0YXRSb3coZWwubGFiZWwsIGVsLnZhbHVlKX1gO1xuICB9XG4gIHJldHVybiBgJHtzdGF0U3RyfTwvdGFibGU+PGhyPmA7XG59XG5cbmZ1bmN0aW9uIGluc3RydWN0aW9ucygpIHtcbiAgdWkuc2hvd01vZGFsKFxuICAgIFwiTWlzc2lvbiBCcmllZmluZ1wiLFxuICAgIFtcbiAgICAgIFwiRGVjcnlwdCB0aGUgY29kZS5cIixcbiAgICAgIFwiRWFjaCBjb2RlIGlzIGEgNSBsZXR0ZXIgd29yZC5cIixcbiAgICAgIFwiQmx1ZSBpbmRpY2F0ZXMgcmlnaHQgbGV0dGVyIGluIHJpZ2h0IHBvc2l0aW9uLlwiLFxuICAgICAgXCJPcmFuZ2UgaW5kaWNhdGVzIHJpZ2h0IGxldHRlciBpbiB3cm9uZyBwb3NpdGlvbi5cIixcbiAgICAgIFwiWW91IGhhdmUgNiBhdHRlbXB0cyBiZWZvcmUgbG9ja291dC5cIixcbiAgICAgIFwiR29vZCBMdWNrIVwiLFxuICAgICAgLy8gXCImbmJzcDsmbmJzcDtcIixcbiAgICAgIHRhYmxpemVTdGF0cygpLFxuICAgICAgXCJUaGUgc2NvcmUgY2FsY3VsYXRpb24gc3RhcnRzIHdpdGggdGhlIHJhdyBzY3JhYmJsZSB3b3JkIFwiICtcbiAgICAgICAgXCJ2YWx1ZSBhbmQgaXMgdGhlbiBtdWx0aXBsaWVkIGJ5IDEwIGZvciBldmVyeSB1bnVzZWQgYXR0ZW1wdC4gXCIgK1xuICAgICAgICBcIkZvciBleGFtcGxlLCBpZiB0aGUgd29yZCB3YXMgU01BUlQgYW5kIGl0IHdhcyBzb2x2ZWQgb24gdGhlIFwiICtcbiAgICAgICAgXCJmb3VydGggYXR0ZW1wdCwgdGhlIHNjb3JlIHdvdWxkIGJlIHRoZSByYXcgd29yZCB2YWx1ZSBvZiA3IG11bHRpcGxpZWQgXCIgK1xuICAgICAgICBcImJ5IDEwIHR3aWNlLCBvbmNlIGZvciBlYWNoIG9mIHRoZSB0d28gdW51c2VkIGF0dGVtcHRzOiA3IHggMTAgeCAxMCA9IDcwMC5cIixcbiAgICBdLFxuICAgIGdhbWUuZ2FtZVN0YXRlXG4gICk7XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgaWYgKHVpLmJ1c3kpIHJldHVybjtcbiAgaWYgKGV2ZW50LmtleSA9PT0gXCJFbnRlclwiICYmIG1vZGFsQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgIT09IFwibm9uZVwiKSB7XG4gICAgY2xvc2VCdXR0b24uY2xpY2soKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChldmVudC5rZXkudG9VcHBlckNhc2UoKSkgJiZcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChldmVudC5rZXkudG9VcHBlckNhc2UoKSkuY2xpY2soKTtcblxuICBpZiAoZXZlbnQua2V5ID09PSBcIkRlbGV0ZVwiKSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIkJBQ0tTUEFDRVwiKS5jbGljaygpO1xufSk7XG5cbnBhZ2VDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgdG91Y2hBbmRDbGlja0hhbmRsZXIpO1xuXG5wYWdlQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0b3VjaEFuZENsaWNrSGFuZGxlcik7XG5cbmZ1bmN0aW9uIHRvdWNoQW5kQ2xpY2tIYW5kbGVyKGV2ZW50KSB7XG4gIGlmICghKGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PT0gXCJTUEFOXCIpKSByZXR1cm47XG4gIGlmICh1aS5idXN5KSByZXR1cm47XG5cbiAgaWYgKGV2ZW50LnR5cGUgPT09IFwidG91Y2hzdGFydFwiKSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfVxuXG4gIHVpLmNsaWNrQXVkaW8uY3VycmVudFRpbWUgPSAwO1xuICB1aS5jbGlja0F1ZGlvLnBsYXkoKS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAvKmRvIG5vdGhpbmcgLSBpdCdzIGp1c3QgYXVkaW8qL1xuICB9KTtcblxuICBsZXQga2V5ID0gZXZlbnQudGFyZ2V0LmlkO1xuICBpZiAoZ2FtZS5nYW1lU3RhdGUgPT09IFwiUExBWUlOR1wiKSB7XG4gICAgaWYgKGtleSA9PT0gXCJCQUNLU1BBQ0VcIikgdWkuZGVsZXRlTGV0dGVyKCk7XG4gICAgaWYgKGtleSA9PT0gXCJFTlRFUlwiICYmIHVpLmN1ckNvbCA+IDQpIGNoZWNrUm93KCk7XG4gICAgaWYgKFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpcIi5zcGxpdChcIlwiKS5pbmNsdWRlcyhrZXkpKVxuICAgICAgdWkuYXBwZW5kTGV0dGVyKGtleSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGdhbWUuZ2FtZVN0YXRlICE9PSBcIlBMQVlJTkdcIiAmJiBrZXkgPT09IFwiRU5URVJcIikgbmV3Um91bmQoKTtcbn1cblxuZnVuY3Rpb24gbmV3Um91bmQoKSB7XG4gIGdhbWUgPSBuZXcgUm91bmQoV09SRFNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogV09SRFMubGVuZ3RoKV0pO1xuICBjb25zb2xlLmxvZyhnYW1lLnNlY3JldFdvcmQpO1xuICB1aS5yZXNldCgpO1xufVxuXG5mdW5jdGlvbiBtYWluKCkge1xuICAvLyBsb2NhbFN0b3JhZ2UuY2xlYXIoKVxuICBjYW1wYWlnbiA9IG5ldyBDYW1wYWlnbigpO1xuICB1aSA9IG5ldyBVSShwYWdlQ29udGFpbmVyKTtcbiAgbmV3Um91bmQoKTtcbiAgaW5zdHJ1Y3Rpb25zKCk7XG59XG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gIG1haW4oKTtcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=