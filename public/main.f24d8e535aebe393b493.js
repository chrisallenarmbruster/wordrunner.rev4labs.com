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
  animation-name: flashBlue;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}

.pressEnter {
  animation-name: flashBlue;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}

.notWord {
  animation-name: flashOrange;
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
@keyframes flashOrange {
  0% {
    background-color: var(--brOrange2);
    color: var(--text);
    border: 0.25cqw solid var(--brOrange2);
  }
  50% {
    background-color: var(--default);
    color: var(--text);
    border: 0.25cqw solid var(--text);
  }
  100% {
    background-color: var(--brOrange2);
    color: var(--text);
    border: 0.25cqw solid var(--brOrange2);
  }
}
@keyframes flashBlue {
  0% {
    background-color: var(--brBlue1);
    color: var(--text);
    border: 0.25cqw solid var(--brBlue1);
  }
  50% {
    background-color: var(--default);
    color: var(--text);
    border: 0.25cqw solid var(--text);
  }
  100% {
    background-color: var(--brBlue1);
    color: var(--text);
    border: 0.25cqw solid var(--brBlue1);
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
}`, "",{"version":3,"sources":["webpack://./client/style/main.css"],"names":[],"mappings":"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","sourcesContent":[":root {\n  --default: #121213;\n  --text: #ffffff;\n  --gray1: #4a4a4c;\n  --gray2: #2a2a2c;\n  --brBlue1: #17aad8;\n  --brBlue2: #017cb0;\n  --brBlue3: #0b61a8;\n  --brOrange1: #fe9200;\n  /*ee610a*/\n  --brOrange2: #ee610a;\n  --brOrange3: #ea410b;\n}\n\n@font-face {\n  font-family: \"Blade Runner\";\n  src: url(../fonts/BLADRMF_.TTF);\n}\n\n@font-face {\n  font-family: \"Oxanium\";\n  font-style: normal;\n  font-weight: normal;\n  src: url(\"../fonts/Oxanium-VariableFont_wght.ttf\");\n}\n\nhtml,\nbody {\n  background-color: var(--default);\n  font-family: \"Oxanium\", cursive;\n  margin: 0;\n  padding: 0;\n  text-align: center;\n}\n\ndiv {\n  margin: 0;\n  padding: 0;\n}\n\n.supercontainer {\n  display: flex;\n  min-width: 320px;\n  max-width: 540px;\n  margin: 1cqw auto;\n  container-type: inline-size;\n}\n\n.pageContainer {\n  display: flex;\n  flex-direction: column;\n  flex-shrink: 0;\n  text-align: center;\n  /*margin: 1cqw auto;\n  min-width: 320px;\n  max-width: 540px;*/\n  width: 100%;\n  justify-content: space-between;\n  /*grid-template-columns: 1fr;*/\n  /*grid-template-rows: auto auto 1fr;*/\n  /*grid-auto-rows: auto;*/\n  container-type: inline-size;\n  height: 155cqw;\n}\n\n.header {\n  display: flex;\n  flex: 0 1 auto;\n  justify-content: center;\n  color: var(--brOrange2);\n  font-family: \"Blade Runner\";\n  font-size: 8cqw;\n  padding: 2cqw 0;\n  margin: 1cqw;\n  border-bottom: 0.5cqw solid var(--gray1);\n  height: 8cqw;\n  border-top: 0.5cqw solid var(--default);\n  pointer-events: none;\n  -webkit-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.message {\n  color: var(--brOrange2);\n  font-family: \"Oxanium\", cursive;\n  font-size: 6cqw;\n  padding: 2cqw 0;\n  margin: 1cqw;\n  height: 8cqw;\n  border-bottom: 0.5cqw solid var(--brOrange2);\n  border-top: 0.5cqw solid var(--brOrange2);\n  background-color: var(--default);\n}\n\n.gameContainer {\n  display: flex;\n  justify-content: center;\n  flex: 0 1 auto;\n  width: 100cqw;\n  margin: auto;\n  pointer-events: none;\n  -webkit-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.tileGrid {\n  display: grid;\n  width: 75cqw;\n  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;\n  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;\n  grid-gap: 1.5cqw;\n  margin: 0.5cqw 0;\n}\n\n.tile {\n  aspect-ratio: 1 / 1;\n  border: 0.5cqw solid var(--gray1);\n  box-sizing: border-box;\n  color: var(--text);\n  text-transform: uppercase;\n  display: grid;\n  place-items: center;\n  font-family: \"Oxanium\", cursive;\n  font-size: 7cqw;\n}\n\n.tileWaterMark {\n  font-family: \"Blade Runner\";\n  color: var(--gray2);\n}\n\n.keyboardContainer {\n  display: flex;\n  flex: 0 1 auto;\n  justify-content: center;\n  margin: auto;\n  margin-top: 2cqw;\n  width: 100cqw;\n}\n\n.keyboardGrid {\n  display: grid;\n  width: 98cqw;\n  grid-template-rows: 1fr 1fr 1fr;\n  grid-template-columns: 1fr;\n  grid-row-gap: 1.5cqw;\n}\n\n.keyboardRow1 {\n  display: grid;\n  width: 98cqw;\n  grid-template-rows: 1fr;\n  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;\n  grid-column-gap: 1.5cqw;\n}\n.keyboardRow2 {\n  display: grid;\n  width: 98cqw;\n  grid-template-rows: 1fr;\n  grid-template-columns: 0.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 0.5fr;\n  grid-column-gap: 1.5cqw;\n}\n.keyboardRow3 {\n  display: grid;\n  width: 98cqw;\n  grid-template-rows: 1fr;\n  grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1.5fr;\n  grid-column-gap: 1.5cqw;\n}\n\n.key,\n.keySpacer {\n  display: grid;\n  border: 0.25cqw solid var(--text);\n  box-sizing: border-box;\n  text-align: center;\n  font-family: \"Oxanium\", cursive;\n  font-size: 3.5cqw;\n  font-weight: bolder;\n  place-items: center;\n  padding: 0 0;\n  border-radius: 1.5cqw;\n  color: var(--text);\n  aspect-ratio: 1 / 1.2;\n  background-color: var(--default);\n  -webkit-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.keySpacer {\n  visibility: hidden;\n  aspect-ratio: 1 / 2.4;\n}\n\n#BACKSPACE,\n#ENTER {\n  aspect-ratio: 3 / 2.4;\n  font-size: 2.5cqw;\n}\n\n.tileClose {\n  color: var(--brOrange2);\n  border: 0.5cqw solid var(--brOrange2);\n}\n\n.tileHit {\n  color: var(--brBlue1);\n  border: 0.5cqw solid var(--brBlue1);\n}\n.tileMiss {\n  color: var(--gray1);\n  border: 0.5cqw solid var(--gray1);\n}\n\n.gameOver {\n  animation-name: flashBlue;\n  animation-duration: 1s;\n  animation-iteration-count: infinite;\n}\n\n.pressEnter {\n  animation-name: flashBlue;\n  animation-duration: 1s;\n  animation-iteration-count: infinite;\n}\n\n.notWord {\n  animation-name: flashOrange;\n  animation-duration: 1s;\n  animation-iteration-count: infinite;\n}\n\n.reset {\n  animation: 1s linear resetting;\n}\n\n@keyframes resetting {\n  0% {\n    transform: rotateX(0deg);\n  }\n  50% {\n    transform: rotateX(90deg);\n  }\n  100% {\n    transform: rotateX(0deg);\n  }\n}\n\n@keyframes flashOrange {\n  0% {\n    background-color: var(--brOrange2);\n    color: var(--text);\n    border: 0.25cqw solid var(--brOrange2);\n  }\n\n  50% {\n    background-color: var(--default);\n    color: var(--text);\n    border: 0.25cqw solid var(--text);\n  }\n\n  100% {\n    background-color: var(--brOrange2);\n    color: var(--text);\n    border: 0.25cqw solid var(--brOrange2);\n  }\n}\n\n@keyframes flashBlue {\n  0% {\n    background-color: var(--brBlue1);\n    color: var(--text);\n    border: 0.25cqw solid var(--brBlue1);\n  }\n  50% {\n    background-color: var(--default);\n    color: var(--text);\n    border: 0.25cqw solid var(--text);\n  }\n\n  100% {\n    background-color: var(--brBlue1);\n    color: var(--text);\n    border: 0.25cqw solid var(--brBlue1);\n  }\n}\n\n.modalContainer {\n  display: none;\n  position: fixed;\n  z-index: 1;\n  padding-top: 15cqw;\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n  width: 100cqw;\n  overflow: auto;\n  background-color: rgba(18, 18, 19, 0.6);\n}\n\n.modalContent {\n  font-family: \"Oxanium\", cursive;\n  background-color: rgba(254, 146, 0, 0.3);\n  color: var(--brOrange1);\n  margin: auto;\n  padding: 1.5cqw;\n  padding-top: 0;\n  width: 80cqw;\n  max-width: 80cqw;\n  max-height: 90cqw;\n  font-size: 6cqw;\n  overflow: auto;\n}\n\n.modalContent hr {\n  border: 0.25cqw solid var(--brOrange1);\n  margin-top: 3cqw;\n}\n\n.modalTitle {\n  font-family: \"Oxanium\", cursive;\n  margin: 2cqw 0 0cqw;\n  padding: 2cqw 0 1cqw;\n}\n\n.modalContentItem {\n  font-family: \"Oxanium\", cursive;\n  margin: 0 0;\n  padding: 1cqw 2cqw;\n  font-size: 5cqw;\n  text-align: left;\n}\n\n.close {\n  color: var(--brOrange1);\n  float: right;\n  margin-right: 1.5cqw;\n  font-size: 6cqw;\n  font-weight: bold;\n}\n\n.close:hover,\n.close:focus {\n  color: var(--brOrange3);\n  text-decoration: none;\n  cursor: pointer;\n}\n\n.statTable {\n  margin: 0 auto 1.5cqw;\n}\n.statTable td {\n  padding: 0 4cqw;\n}\n\n.statNum {\n  text-align: right;\n}\n\n::-webkit-scrollbar {\n  width: 2cqw;\n}\n\n::-webkit-scrollbar-track {\n  background: rgba(254, 146, 0, 0.2);\n}\n\n::-webkit-scrollbar-thumb {\n  background: rgba(254, 146, 0, 0.4);\n}\n\n::-webkit-scrollbar-thumb:hover {\n  background: var(--brOrange1);\n}\n\n.modalContent {\n  scrollbar-color: rgba(254, 146, 0, 0.6) rgba(254, 146, 0, 0.1);\n}\n"],"sourceRoot":""}]);
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
    if (key === "BACKSPACE") {
      ENTER.classList.remove("pressEnter");
      ui.deleteLetter();
    }
    if (key === "ENTER" && ui.curCol > 4) {
      ENTER.classList.remove("pressEnter");
      checkRow();
    }
    if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").includes(key)) {
      ENTER.classList.remove("pressEnter");
      if (ui.curCol > 3) {
        ENTER.classList.add("pressEnter");
      }
      ui.appendLetter(key);
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1COzs7Ozs7Ozs7OztBQ3BlbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwbUtuQjtBQUM2RztBQUNqQjtBQUNPO0FBQ25HLDRDQUE0Qyx5SEFBd0M7QUFDcEYsNENBQTRDLDJKQUF5RDtBQUNyRyw4QkFBOEIsbUZBQTJCLENBQUMsNEZBQXFDO0FBQy9GLHlDQUF5QyxzRkFBK0I7QUFDeEUseUNBQXlDLHNGQUErQjtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLG1DQUFtQztBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxtQ0FBbUM7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0Isc0NBQXNDO0FBQ3RDLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDLE9BQU8sd0ZBQXdGLFdBQVcsVUFBVSxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxVQUFVLFdBQVcsV0FBVyxNQUFNLEtBQUssV0FBVyxXQUFXLEtBQUssS0FBSyxXQUFXLFdBQVcsV0FBVyxXQUFXLEtBQUssTUFBTSxXQUFXLFdBQVcsVUFBVSxVQUFVLFdBQVcsTUFBTSxLQUFLLFVBQVUsVUFBVSxNQUFNLEtBQUssVUFBVSxXQUFXLFdBQVcsV0FBVyxXQUFXLE1BQU0sS0FBSyxVQUFVLFdBQVcsVUFBVSxXQUFXLE1BQU0sTUFBTSxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxVQUFVLE1BQU0sS0FBSyxVQUFVLFVBQVUsV0FBVyxXQUFXLFdBQVcsVUFBVSxVQUFVLFVBQVUsV0FBVyxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxNQUFNLEtBQUssV0FBVyxXQUFXLFVBQVUsVUFBVSxVQUFVLFVBQVUsV0FBVyxXQUFXLFdBQVcsTUFBTSxLQUFLLFVBQVUsV0FBVyxVQUFVLFVBQVUsVUFBVSxXQUFXLFdBQVcsV0FBVyxXQUFXLE1BQU0sS0FBSyxVQUFVLFVBQVUsV0FBVyxXQUFXLFdBQVcsV0FBVyxNQUFNLEtBQUssV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFVBQVUsV0FBVyxXQUFXLFVBQVUsTUFBTSxLQUFLLFdBQVcsV0FBVyxNQUFNLEtBQUssVUFBVSxVQUFVLFdBQVcsVUFBVSxXQUFXLFVBQVUsTUFBTSxLQUFLLFVBQVUsVUFBVSxXQUFXLFdBQVcsV0FBVyxNQUFNLEtBQUssVUFBVSxVQUFVLFdBQVcsV0FBVyxXQUFXLE1BQU0sS0FBSyxVQUFVLFVBQVUsV0FBVyxXQUFXLFdBQVcsTUFBTSxLQUFLLFVBQVUsVUFBVSxXQUFXLFdBQVcsV0FBVyxNQUFNLE1BQU0sVUFBVSxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFVBQVUsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxNQUFNLEtBQUssV0FBVyxXQUFXLE1BQU0sTUFBTSxXQUFXLFdBQVcsTUFBTSxLQUFLLFdBQVcsV0FBVyxNQUFNLEtBQUssV0FBVyxXQUFXLE1BQU0sS0FBSyxXQUFXLFdBQVcsTUFBTSxLQUFLLFdBQVcsV0FBVyxXQUFXLE1BQU0sS0FBSyxXQUFXLFdBQVcsV0FBVyxNQUFNLEtBQUssV0FBVyxXQUFXLFdBQVcsTUFBTSxLQUFLLFdBQVcsTUFBTSxLQUFLLEtBQUssV0FBVyxLQUFLLEtBQUssV0FBVyxLQUFLLEtBQUssV0FBVyxLQUFLLEtBQUssS0FBSyxLQUFL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QkFBa0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0MsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMERBQTBEOztBQUUxRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1HQUFtRzs7QUFFbkc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7O0FBRTFDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE9BQU87QUFDUDtBQUNBLEdBQUc7O0FBRUg7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLHlDQUF5Qzs7QUFFbEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0RBQWtEOztBQUVsRDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBdUQ7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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Q0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSw0Q0FBSyxDQUFDLDRDQUFLLDRCQUE0Qiw0Q0FBSztBQUN6RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixrREFBUTtBQUN6QixXQUFXLHNDQUFFO0FBQ2I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3dvcmRhbC13ZWIvLi9jbGllbnQvanMvY2FtcGFpZ24uanMiLCJ3ZWJwYWNrOi8vd29yZGFsLXdlYi8uL2NsaWVudC9qcy9yb3VuZC5qcyIsIndlYnBhY2s6Ly93b3JkYWwtd2ViLy4vY2xpZW50L2pzL3VpLmpzIiwid2VicGFjazovL3dvcmRhbC13ZWIvLi9jbGllbnQvanMvd29yZHMtc3VwcGxlbWVudC5qcyIsIndlYnBhY2s6Ly93b3JkYWwtd2ViLy4vY2xpZW50L2pzL3dvcmRzLmpzIiwid2VicGFjazovL3dvcmRhbC13ZWIvLi9jbGllbnQvc3R5bGUvbWFpbi5jc3MiLCJ3ZWJwYWNrOi8vd29yZGFsLXdlYi8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vd29yZGFsLXdlYi8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanMiLCJ3ZWJwYWNrOi8vd29yZGFsLXdlYi8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL3dvcmRhbC13ZWIvLi9ub2RlX21vZHVsZXMvanMtY29uZmV0dGkvZGlzdC9lcy9pbmRleC5qcyIsIndlYnBhY2s6Ly93b3JkYWwtd2ViLy4vY2xpZW50L3N0eWxlL21haW4uY3NzPzhlZjkiLCJ3ZWJwYWNrOi8vd29yZGFsLXdlYi8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly93b3JkYWwtd2ViLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly93b3JkYWwtd2ViLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL3dvcmRhbC13ZWIvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vd29yZGFsLXdlYi8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL3dvcmRhbC13ZWIvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly93b3JkYWwtd2ViL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dvcmRhbC13ZWIvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vd29yZGFsLXdlYi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd29yZGFsLXdlYi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dvcmRhbC13ZWIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93b3JkYWwtd2ViL3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL3dvcmRhbC13ZWIvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vd29yZGFsLXdlYi93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vd29yZGFsLXdlYi8uL2NsaWVudC9qcy9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIENhbXBhaWduIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5nYW1lc1BsYXllZCA9IDBcbiAgICB0aGlzLmdhbWVzV29uID0gMFxuICAgIHRoaXMuaGlnaFNjb3JlID0gMFxuICAgIHRoaXMuYmVzdFN0cmVhayA9IDBcbiAgICB0aGlzLmN1clN0cmVhayA9IDBcbiAgICB0aGlzLmdhbWVEZXRhaWxzID0gW11cbiAgICB0aGlzLnZlcnNpb24gPSAxXG4gICAgdGhpcy5yZXN0b3JlRnJvbUxvY2FsU3RvcmFnZSgpXG4gIH1cblxuICB1cGRhdGVDYW1wYWlnbihnYW1lRGV0YWlscykge1xuICAgIHRoaXMuZ2FtZURldGFpbHMucHVzaChnYW1lRGV0YWlscylcbiAgICB0aGlzLmdhbWVzUGxheWVkKytcblxuICAgIGlmIChnYW1lRGV0YWlscy5vdXRjb21lID09PSBcIndvblwiKSB7XG4gICAgICB0aGlzLmdhbWVzV29uKytcbiAgICAgIHRoaXMuY3VyU3RyZWFrKytcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXJTdHJlYWsgPSAwXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY3VyU3RyZWFrID4gdGhpcy5iZXN0U3RyZWFrKSB7XG4gICAgICB0aGlzLmJlc3RTdHJlYWsgPSB0aGlzLmN1clN0cmVha1xuICAgIH1cblxuICAgIGlmIChnYW1lRGV0YWlscy5zY29yZSA+IHRoaXMuaGlnaFNjb3JlKSB7XG4gICAgICB0aGlzLmhpZ2hTY29yZSA9IGdhbWVEZXRhaWxzLnNjb3JlXG4gICAgfVxuICAgIHRoaXMuc2F2ZVRvTG9jYWxTdG9yYWdlKClcbiAgfVxuXG4gIGF2ZXJhZ2VBdHRlbXB0cygpIHtcbiAgICBpZiAodGhpcy5nYW1lc1BsYXllZCA9PT0gMCkgcmV0dXJuIDBcbiAgICByZXR1cm4gcGFyc2VGbG9hdChcbiAgICAgIChcbiAgICAgICAgdGhpcy5nYW1lRGV0YWlscy5yZWR1Y2UoKGFjYywgY3YpID0+IHtcbiAgICAgICAgICByZXR1cm4gYWNjICsgY3YuYXR0ZW1wdHNcbiAgICAgICAgfSwgMCkgLyB0aGlzLmdhbWVzUGxheWVkXG4gICAgICApLnRvRml4ZWQoMSlcbiAgICApXG4gIH1cblxuICB3aW5QZXJjZW50YWdlKCkge1xuICAgIGlmICh0aGlzLmdhbWVzUGxheWVkID09PSAwKSByZXR1cm4gMFxuICAgIHJldHVybiBNYXRoLnJvdW5kKCgxMDAgKiB0aGlzLmdhbWVzV29uKSAvIHRoaXMuZ2FtZXNQbGF5ZWQpXG4gIH1cblxuICBzbHVnZ2luZ1BlcmNlbnRhZ2UoKSB7XG4gICAgaWYgKHRoaXMuZ2FtZXNQbGF5ZWQgPT09IDApIHJldHVybiAwXG4gICAgcmV0dXJuIE1hdGgucm91bmQoXG4gICAgICAoMTAwICpcbiAgICAgICAgdGhpcy5nYW1lRGV0YWlsc1xuICAgICAgICAgIC5maWx0ZXIoKGVsKSA9PiBlbC5vdXRjb21lID09PSBcIndvblwiKVxuICAgICAgICAgIC5yZWR1Y2UoKGFjYywgY3YpID0+IGFjYyArIDcgLSBjdi5hdHRlbXB0cywgMCkpIC9cbiAgICAgICAgdGhpcy5nYW1lc1BsYXllZFxuICAgIClcbiAgfVxuXG4gIGF2ZXJhZ2VTY29yZSgpIHtcbiAgICBpZiAodGhpcy5nYW1lc1BsYXllZCA9PT0gMCkgcmV0dXJuIDBcbiAgICByZXR1cm4gTWF0aC5yb3VuZChcbiAgICAgIHRoaXMuZ2FtZURldGFpbHMucmVkdWNlKChhY2MsIGN2KSA9PiBhY2MgKyBjdi5zY29yZSwgMCkgLyB0aGlzLmdhbWVzUGxheWVkXG4gICAgKVxuICB9XG5cbiAgc2F2ZVRvTG9jYWxTdG9yYWdlKCkge1xuICAgIGxldCBjYW1wYWlnbkNvcHkgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzKVxuICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJjYW1wYWlnblwiLCBKU09OLnN0cmluZ2lmeShjYW1wYWlnbkNvcHkpKVxuICB9XG5cbiAgcmVzdG9yZUZyb21Mb2NhbFN0b3JhZ2UoKSB7XG4gICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiY2FtcGFpZ25cIikpIHtcbiAgICAgIGxldCBjYW1wYWlnbkNvcHkgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiY2FtcGFpZ25cIikpXG4gICAgICBPYmplY3QuYXNzaWduKHRoaXMsIGNhbXBhaWduQ29weSlcbiAgICB9XG4gIH1cblxuICBjYW1wYWlnblN1bW1hcnkoKSB7XG4gICAgbGV0IHN1bW1hcnkgPSBbXVxuICAgIHN1bW1hcnkucHVzaCh7IGxhYmVsOiBcIkF2ZXJhZ2UgU2NvcmVcIiwgdmFsdWU6IHRoaXMuYXZlcmFnZVNjb3JlKCkgfSlcbiAgICBzdW1tYXJ5LnB1c2goeyBsYWJlbDogXCJIaWdoIFNjb3JlXCIsIHZhbHVlOiB0aGlzLmhpZ2hTY29yZSB9KVxuICAgIHN1bW1hcnkucHVzaCh7IGxhYmVsOiBcIldpbm5pbmcgJVwiLCB2YWx1ZTogdGhpcy53aW5QZXJjZW50YWdlKCkgfSlcbiAgICBzdW1tYXJ5LnB1c2goeyBsYWJlbDogXCJTbHVnZ2luZyAlXCIsIHZhbHVlOiB0aGlzLnNsdWdnaW5nUGVyY2VudGFnZSgpIH0pXG4gICAgc3VtbWFyeS5wdXNoKHsgbGFiZWw6IFwiQmVzdCBTdHJlYWtcIiwgdmFsdWU6IHRoaXMuYmVzdFN0cmVhayB9KVxuICAgIHN1bW1hcnkucHVzaCh7IGxhYmVsOiBcIkN1cnJlbnQgU3RyZWFrXCIsIHZhbHVlOiB0aGlzLmN1clN0cmVhayB9KVxuICAgIHN1bW1hcnkucHVzaCh7IGxhYmVsOiBcIkF0dGVtcHRzL1JuZFwiLCB2YWx1ZTogdGhpcy5hdmVyYWdlQXR0ZW1wdHMoKSB9KVxuICAgIHN1bW1hcnkucHVzaCh7IGxhYmVsOiBcIlJvdW5kcyBQbGF5ZWRcIiwgdmFsdWU6IHRoaXMuZ2FtZXNQbGF5ZWQgfSlcbiAgICByZXR1cm4gc3VtbWFyeVxuICB9XG59XG4iLCJjb25zdCBMRVRURVJfVkFMVUVTID0ge1xuICBhOiAxLFxuICBiOiAzLFxuICBjOiAzLFxuICBkOiAyLFxuICBlOiAxLFxuICBmOiA0LFxuICBnOiAyLFxuICBoOiA0LFxuICBpOiAxLFxuICBqOiA4LFxuICBrOiA1LFxuICBsOiAxLFxuICBtOiAzLFxuICBuOiAxLFxuICBvOiAxLFxuICBwOiAzLFxuICBxOiAxMCxcbiAgcjogMSxcbiAgczogMSxcbiAgdDogMSxcbiAgdTogMSxcbiAgdjogNCxcbiAgdzogNCxcbiAgeDogOCxcbiAgeTogNCxcbiAgejogMTAsXG59XG5cbmV4cG9ydCBjbGFzcyBSb3VuZCB7XG4gIGNvbnN0cnVjdG9yKHNlY3JldFdvcmQgPSBcImd1ZXNzXCIpIHtcbiAgICB0aGlzLnNlY3JldFdvcmQgPSBzZWNyZXRXb3JkLnRvVXBwZXJDYXNlKClcbiAgICB0aGlzLndvcmREZWZpbml0aW9uID0gW11cbiAgICB0aGlzLmd1ZXNzZXMgPSBbXVxuICAgIHRoaXMubGV0dGVyU3RhdHVzID0ge31cbiAgICB0aGlzLmd1ZXNzZXNSZW1haW5pbmcgPSA2XG4gICAgdGhpcy5nYW1lU3RhdGUgPSBcIlBMQVlJTkdcIiAvL1BMQVlJTkcsIFdPTiwgTE9TVFxuICAgIHRoaXMucmVzZXRMZXR0ZXJTdGF0dXMoKVxuICAgIHRoaXMuZ2V0RGVmaW5pdGlvbigpXG4gIH1cblxuICBzdWJtaXRHdWVzcyh3b3JkKSB7XG4gICAgaWYgKHRoaXMuZ2FtZVN0YXRlID09PSBcIlBMQVlJTkdcIikge1xuICAgICAgdGhpcy5ndWVzc2VzLnB1c2god29yZC50b1VwcGVyQ2FzZSgpKVxuICAgICAgdGhpcy5ndWVzc2VzUmVtYWluaW5nLS1cbiAgICAgIHRoaXMuc2V0TGV0dGVyU3RhdHVzKHdvcmQudG9VcHBlckNhc2UoKSlcbiAgICAgIHRoaXMuY2FsY0dhbWVTdGF0ZSh3b3JkLnRvVXBwZXJDYXNlKCkpXG4gICAgICByZXR1cm4gW3RoaXMuZ3Vlc3NTdGF0dXMoKSwgdGhpcy5sZXR0ZXJTdGF0dXNdXG4gICAgfVxuICB9XG5cbiAgY2FsY0dhbWVTdGF0ZSh3b3JkKSB7XG4gICAgaWYgKHRoaXMuZ2FtZVN0YXRlID09PSBcIlBMQVlJTkdcIikge1xuICAgICAgaWYgKHdvcmQudG9VcHBlckNhc2UoKSA9PT0gdGhpcy5zZWNyZXRXb3JkKSB7XG4gICAgICAgIHRoaXMuZ2FtZVN0YXRlID0gXCJXT05cIlxuICAgICAgfSBlbHNlIGlmICh0aGlzLmd1ZXNzZXNSZW1haW5pbmcgPT09IDApIHtcbiAgICAgICAgdGhpcy5nYW1lU3RhdGUgPSBcIkxPU1RcIlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5nYW1lU3RhdGUgPSBcIlBMQVlJTkdcIlxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5nYW1lU3RhdGVcbiAgfVxuXG4gIHNldExldHRlclN0YXR1cyh3b3JkKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3b3JkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAod29yZFtpXSA9PT0gdGhpcy5zZWNyZXRXb3JkW2ldKSB7XG4gICAgICAgIHRoaXMubGV0dGVyU3RhdHVzW3RoaXMuc2VjcmV0V29yZFtpXV0gPSBcIkdcIlxuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgdGhpcy5zZWNyZXRXb3JkLnNwbGl0KFwiXCIpLmluY2x1ZGVzKHdvcmRbaV0pICYmXG4gICAgICAgIHRoaXMubGV0dGVyU3RhdHVzW3dvcmRbaV1dICE9PSBcIkdcIlxuICAgICAgKSB7XG4gICAgICAgIHRoaXMubGV0dGVyU3RhdHVzW3dvcmRbaV1dID0gXCJZXCJcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICF0aGlzLnNlY3JldFdvcmQuc3BsaXQoXCJcIikuaW5jbHVkZXMod29yZFtpXSkgJiZcbiAgICAgICAgdGhpcy5sZXR0ZXJTdGF0dXNbd29yZFtpXV0gPT09IFwiV1wiXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5sZXR0ZXJTdGF0dXNbd29yZFtpXV0gPSBcIlJcIlxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5sZXR0ZXJTdGF0dXNcbiAgfVxuXG4gIHJlc2V0TGV0dGVyU3RhdHVzKCkge1xuICAgIGZvciAobGV0IGxldHRlciBvZiBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaXCIuc3BsaXQoXCJcIikpIHtcbiAgICAgIHRoaXMubGV0dGVyU3RhdHVzW2xldHRlcl0gPSBcIldcIlxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5sZXR0ZXJTdGF0dXNcbiAgfVxuXG4gIGd1ZXNzU3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLmd1ZXNzZXMubWFwKChndWVzcykgPT4ge1xuICAgICAgbGV0IGd1ZXNzU3RhdEFyciA9IGd1ZXNzLnNwbGl0KFwiXCIpLm1hcCgoZWwpID0+IHtcbiAgICAgICAgcmV0dXJuIHsgbGV0dGVyOiBlbCwgc3RhdHVzOiBcIlJcIiB9XG4gICAgICB9KVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNlY3JldFdvcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMuc2VjcmV0V29yZFtpXSA9PT0gZ3Vlc3NbaV0pIHtcbiAgICAgICAgICBndWVzc1N0YXRBcnJbaV0uc3RhdHVzID0gXCJHXCJcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGd1ZXNzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIHRoaXMuc2VjcmV0V29yZFtpXSA9PT0gZ3Vlc3Nbal0gJiZcbiAgICAgICAgICAgICAgZ3Vlc3NTdGF0QXJyW2pdLnN0YXR1cyA9PT0gXCJSXCJcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBndWVzc1N0YXRBcnJbal0uc3RhdHVzID0gXCJZXCJcbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBndWVzc1N0YXRBcnJcbiAgICB9KVxuICB9XG5cbiAgYXN5bmMgZ2V0RGVmaW5pdGlvbigpIHtcbiAgICBsZXQgZGVmaW5pdGlvbkFyciA9IFtdXG4gICAgdHJ5IHtcbiAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgICBgaHR0cHM6Ly9hcGkuZGljdGlvbmFyeWFwaS5kZXYvYXBpL3YyL2VudHJpZXMvZW4vJHt0aGlzLnNlY3JldFdvcmQudG9Mb3dlckNhc2UoKX1gXG4gICAgICApXG4gICAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgICAgbGV0IGpzb24gPSBhd2FpdCByZXNwb25zZS5qc29uKClcbiAgICAgICAgZGVmaW5pdGlvbkFyciA9IHRoaXMudW5wYWNrRGVmaW5pdGlvbihqc29uKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGVmaW5pdGlvbiBGZXRjaCBGYWlsZWRcIilcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZGVmaW5pdGlvbkFyciA9IFtcbiAgICAgICAge1xuICAgICAgICAgIHBhcnRPZlNwZWVjaDogbnVsbCxcbiAgICAgICAgICBkZWZpbml0aW9uOiBcIkRpY3Rpb25hcnkgb3IgZGVmaW5pdGlvbiBub3QgYXZhaWxhYmxlIGF0IHRoaXMgdGltZS5cIixcbiAgICAgICAgfSxcbiAgICAgIF1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy53b3JkRGVmaW5pdGlvbiA9IGRlZmluaXRpb25BcnJcbiAgICAgIHJldHVybiBkZWZpbml0aW9uQXJyXG4gICAgfVxuICB9XG5cbiAgdW5wYWNrRGVmaW5pdGlvbihqc29uKSB7XG4gICAgbGV0IGRlZmluaXRpb25BcnIgPSBbXVxuICAgIGZvciAobGV0IGVudHJ5IG9mIGpzb24pIHtcbiAgICAgIGZvciAobGV0IG1lYW5pbmcgb2YgZW50cnkubWVhbmluZ3MpIHtcbiAgICAgICAgZm9yIChsZXQgZGVmaW5pdGlvbiBvZiBtZWFuaW5nLmRlZmluaXRpb25zKSB7XG4gICAgICAgICAgZGVmaW5pdGlvbkFyci5wdXNoKHtcbiAgICAgICAgICAgIHBhcnRPZlNwZWVjaDogbWVhbmluZy5wYXJ0T2ZTcGVlY2gsXG4gICAgICAgICAgICBkZWZpbml0aW9uOiBkZWZpbml0aW9uLmRlZmluaXRpb24sXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZGVmaW5pdGlvbkFyci5sZW5ndGggPT09IDApIHtcbiAgICAgIGRlZmluaXRpb25BcnIucHVzaCh7XG4gICAgICAgIHBhcnRPZlNwZWVjaDogbnVsbCxcbiAgICAgICAgZGVmaW5pdGlvbjogXCJEaWN0aW9uYXJ5IG9yIGRlZmluaXRpb24gbm90IGF2YWlsYWJsZSBhdCB0aGlzIHRpbWUuXCIsXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gZGVmaW5pdGlvbkFyclxuICB9XG5cbiAgd29yZEJhc2VQb2ludFZhbHVlKCkge1xuICAgIGxldCB3b3JkQmFzZVNjb3JlID0gdGhpcy5zZWNyZXRXb3JkXG4gICAgICAudG9Mb3dlckNhc2UoKVxuICAgICAgLnNwbGl0KFwiXCIpXG4gICAgICAucmVkdWNlKChhY2MsIGN2KSA9PiB7XG4gICAgICAgIHJldHVybiBhY2MgKyBMRVRURVJfVkFMVUVTW2N2XVxuICAgICAgfSwgMClcblxuICAgIHJldHVybiB3b3JkQmFzZVNjb3JlXG4gIH1cbn1cbiIsImltcG9ydCBhdWRpb0ZpbGVDbGljayBmcm9tIFwiLi4vYXVkaW8vY2xpY2subXAzXCI7XG5pbXBvcnQgYXVkaW9GaWxlQ29tcCBmcm9tIFwiLi4vYXVkaW8vY29tcC5tcDNcIjtcbmltcG9ydCBhdWRpb0ZpbGVTdWNjZXNzIGZyb20gXCIuLi9hdWRpby9maWdodC5tcDNcIjtcbmltcG9ydCBhdWRpb0ZpbGVGYWlsIGZyb20gXCIuLi9hdWRpby9yZWdyZXQubXAzXCI7XG5pbXBvcnQgYXVkaW9GaWxlSW52YWxpZCBmcm9tIFwiLi4vYXVkaW8vaW52YWxpZC5tcDNcIjtcbmltcG9ydCBhdWRpb0ZpbGVSYXRjaGV0IGZyb20gXCIuLi9hdWRpby9yYXRjaGV0Lm1wM1wiO1xuaW1wb3J0IFwiLi4vc3R5bGUvbWFpbi5jc3NcIjtcblxuZXhwb3J0IGNsYXNzIFVJIHtcbiAgY29uc3RydWN0b3IoY29udGFpbmVyKSB7XG4gICAgdGhpcy5pbml0aWFsVWlTZXR1cChjb250YWluZXIpO1xuICAgIHRoaXMuYXVkaW9TZXR1cCgpO1xuICAgIHRoaXMuY3VyUm93ID0gMDtcbiAgICB0aGlzLmN1ckNvbCA9IDA7XG4gICAgdGhpcy5ib2FyZCA9IFtcbiAgICAgIFtcIlwiLCBcIlwiLCBcIlwiLCBcIlwiLCBcIlwiXSxcbiAgICAgIFtcIlwiLCBcIlwiLCBcIlwiLCBcIlwiLCBcIlwiXSxcbiAgICAgIFtcIlwiLCBcIlwiLCBcIlwiLCBcIlwiLCBcIlwiXSxcbiAgICAgIFtcIlwiLCBcIlwiLCBcIlwiLCBcIlwiLCBcIlwiXSxcbiAgICAgIFtcIlwiLCBcIlwiLCBcIlwiLCBcIlwiLCBcIlwiXSxcbiAgICAgIFtcIlwiLCBcIlwiLCBcIlwiLCBcIlwiLCBcIlwiXSxcbiAgICBdO1xuICAgIHRoaXMuYnVzeSA9IGZhbHNlO1xuICB9XG5cbiAgaW5pdGlhbFVpU2V0dXAoY29udGFpbmVyKSB7XG4gICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBoZWFkZXIuaWQgPSBcImhlYWRlclwiO1xuICAgIGhlYWRlci5jbGFzc05hbWUgPSBcImhlYWRlclwiO1xuICAgIGhlYWRlci50ZXh0Q29udGVudCA9IFwiV29yZEJydW5uZXJcIjtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaGVhZGVyKTtcblxuICAgIGNvbnN0IGdhbWVDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGdhbWVDb250YWluZXIuaWQgPSBcImdhbWVDb250YWluZXJcIjtcbiAgICBnYW1lQ29udGFpbmVyLmNsYXNzTmFtZSA9IFwiZ2FtZUNvbnRhaW5lclwiO1xuICAgIHRoaXMuZHJhd1RpbGVHcmlkKGdhbWVDb250YWluZXIpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChnYW1lQ29udGFpbmVyKTtcblxuICAgIGNvbnN0IGtleWJvYXJkQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBrZXlib2FyZENvbnRhaW5lci5pZCA9IFwia2V5Ym9hcmRDb250YWluZXJcIjtcbiAgICBrZXlib2FyZENvbnRhaW5lci5jbGFzc05hbWUgPSBcImtleWJvYXJkQ29udGFpbmVyXCI7XG4gICAgdGhpcy5kcmF3S2V5Ym9hcmQoa2V5Ym9hcmRDb250YWluZXIpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChrZXlib2FyZENvbnRhaW5lcik7XG5cbiAgICBjb25zdCBtb2RhbENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgbW9kYWxDb250YWluZXIuaWQgPSBcIm1vZGFsQ29udGFpbmVyXCI7XG4gICAgbW9kYWxDb250YWluZXIuY2xhc3NOYW1lID0gXCJtb2RhbENvbnRhaW5lclwiO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChtb2RhbENvbnRhaW5lcik7XG4gIH1cblxuICBhdWRpb1NldHVwKCkge1xuICAgIHRoaXMuY2xpY2tBdWRpbyA9IG5ldyBBdWRpbygpO1xuICAgIHRoaXMuY2xpY2tBdWRpby5zcmMgPSBhdWRpb0ZpbGVDbGljaztcbiAgICB0aGlzLmNvbXBBdWRpbyA9IG5ldyBBdWRpbygpO1xuICAgIHRoaXMuY29tcEF1ZGlvLnNyYyA9IGF1ZGlvRmlsZUNvbXA7XG4gICAgdGhpcy5zdWNjZXNzQXVkaW8gPSBuZXcgQXVkaW8oKTtcbiAgICB0aGlzLnN1Y2Nlc3NBdWRpby5zcmMgPSBhdWRpb0ZpbGVTdWNjZXNzO1xuICAgIHRoaXMuZmFpbEF1ZGlvID0gbmV3IEF1ZGlvKCk7XG4gICAgdGhpcy5mYWlsQXVkaW8uc3JjID0gYXVkaW9GaWxlRmFpbDtcbiAgICB0aGlzLmludmFsaWRBdWRpbyA9IG5ldyBBdWRpbygpO1xuICAgIHRoaXMuaW52YWxpZEF1ZGlvLnNyYyA9IGF1ZGlvRmlsZUludmFsaWQ7XG4gICAgdGhpcy5yYXRjaGV0QXVkaW8gPSBuZXcgQXVkaW8oKTtcbiAgICB0aGlzLnJhdGNoZXRBdWRpby5zcmMgPSBhdWRpb0ZpbGVSYXRjaGV0O1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5jdXJSb3cgPSAwO1xuICAgIHRoaXMuY3VyQ29sID0gMDtcbiAgICB0aGlzLmJvYXJkID0gW1xuICAgICAgW1wiXCIsIFwiXCIsIFwiXCIsIFwiXCIsIFwiXCJdLFxuICAgICAgW1wiXCIsIFwiXCIsIFwiXCIsIFwiXCIsIFwiXCJdLFxuICAgICAgW1wiXCIsIFwiXCIsIFwiXCIsIFwiXCIsIFwiXCJdLFxuICAgICAgW1wiXCIsIFwiXCIsIFwiXCIsIFwiXCIsIFwiXCJdLFxuICAgICAgW1wiXCIsIFwiXCIsIFwiXCIsIFwiXCIsIFwiXCJdLFxuICAgICAgW1wiXCIsIFwiXCIsIFwiXCIsIFwiXCIsIFwiXCJdLFxuICAgIF07XG4gICAgdGhpcy5idXN5ID0gZmFsc2U7XG4gICAgRU5URVIuY2xhc3NMaXN0LnJlbW92ZShcImdhbWVPdmVyXCIpO1xuICAgIEVOVEVSLnRleHRDb250ZW50ID0gXCJFTlRFUlwiO1xuICAgIGhlYWRlci5jbGFzc05hbWUgPSBcImhlYWRlclwiO1xuICAgIGhlYWRlci50ZXh0Q29udGVudCA9IFwid29yZEJydW5uZXJcIjtcbiAgICB0aGlzLmZsaXBBbmRSZXNldFRpbGVzKCk7XG4gICAgZm9yIChsZXQgbGV0dGVyIG9mIFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpcIi5zcGxpdChcIlwiKSkge1xuICAgICAgbGV0IGtleSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGxldHRlcik7XG4gICAgICBrZXkuY2xhc3NOYW1lID0gXCJrZXlcIjtcbiAgICB9XG4gIH1cblxuICBpdGVyYXRlVGlsZXMoY2FsbGJhY2spIHtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCA2OyByb3crKykge1xuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgNTsgY29sKyspIHtcbiAgICAgICAgY2FsbGJhY2soZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYHRpbGUtJHtyb3d9LSR7Y29sfWApKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmbGlwQW5kUmVzZXRUaWxlcygpIHtcbiAgICB0aGlzLmNsaWNrQXVkaW8ucGF1c2UoKTtcbiAgICB0aGlzLnJhdGNoZXRBdWRpby5wbGF5KCkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAvKmRvIG5vdGhpbmcgLSBpdCdzIGp1c3QgYXVkaW8qL1xuICAgIH0pO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLml0ZXJhdGVUaWxlcygodGlsZSkgPT4ge1xuICAgICAgICB0aWxlLmNsYXNzTGlzdC5yZW1vdmUoXCJ0aWxlSGl0XCIsIFwidGlsZUNsb3NlXCIsIFwidGlsZU1pc3NcIik7XG4gICAgICAgIHRpbGUuaW5uZXJIVE1MID0gJzxzcGFuIGNsYXNzPVwidGlsZVdhdGVyTWFya1wiPkI8L3NwYW4+JztcbiAgICAgIH0pO1xuICAgIH0sIDUwMCk7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuaXRlcmF0ZVRpbGVzKCh0aWxlKSA9PiB7XG4gICAgICAgIHRpbGUuY2xhc3NMaXN0LnJlbW92ZShcInJlc2V0XCIpO1xuICAgICAgfSk7XG4gICAgfSwgMTAwMCk7XG5cbiAgICB0aGlzLml0ZXJhdGVUaWxlcygodGlsZSkgPT4ge1xuICAgICAgdGlsZS5jbGFzc0xpc3QuYWRkKFwicmVzZXRcIik7XG4gICAgfSk7XG4gIH1cblxuICBkcmF3VGlsZShjb250YWluZXIsIHJvdywgY29sLCB2YWx1ZSA9IFwiXCIpIHtcbiAgICBjb25zdCB0aWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICB0aWxlLmlkID0gYHRpbGUtJHtyb3d9LSR7Y29sfWA7XG4gICAgdGlsZS5jbGFzc05hbWUgPSBcInRpbGVcIjtcbiAgICB0aWxlLnRleHRDb250ZW50ID0gdmFsdWU7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRpbGUpO1xuICAgIC8vIHJldHVybiB0aWxlXG4gIH1cblxuICBkcmF3VGlsZUdyaWQoY29udGFpbmVyLCByb3dzID0gNiwgY29scyA9IDUpIHtcbiAgICBjb25zdCB0aWxlR3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgdGlsZUdyaWQuY2xhc3NOYW1lID0gXCJ0aWxlR3JpZFwiO1xuXG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgcm93czsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGNvbHM7IGNvbCsrKSB7XG4gICAgICAgIHRoaXMuZHJhd1RpbGUodGlsZUdyaWQsIHJvdywgY29sLCBcIlwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRpbGVHcmlkKTtcbiAgfVxuXG4gIGRyYXdLZXkoa2V5KSB7XG4gICAgY29uc3Qga2V5QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAga2V5QnV0dG9uLmlkID0ga2V5ID09PSBcIuKMq1wiID8gXCJCQUNLU1BBQ0VcIiA6IGtleSA9PT0gXCJFTlRFUlwiID8gXCJFTlRFUlwiIDoga2V5O1xuICAgIGtleUJ1dHRvbi5yb2xlID0gXCJidXR0b25cIjtcbiAgICBrZXlCdXR0b24uY2xhc3NOYW1lID0ga2V5ID09PSBcIiBcIiA/IFwia2V5U3BhY2VyXCIgOiBcImtleVwiO1xuICAgIGtleUJ1dHRvbi50ZXh0Q29udGVudCA9IGtleTtcbiAgICByZXR1cm4ga2V5QnV0dG9uO1xuICB9XG5cbiAgZHJhd0tleWJvYXJkUm93KGNvbnRhaW5lciwgcm93LCBrZXlzKSB7XG4gICAgY29uc3Qga2V5Ym9hcmRSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGtleWJvYXJkUm93LmNsYXNzTmFtZSA9IFwia2V5Ym9hcmRSb3dDb250YWluZXJcIjtcblxuICAgIGNvbnN0IGtleWJvYXJkUm93R3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAga2V5Ym9hcmRSb3dHcmlkLmlkID0gYGtleWJvYXJkUm93JHtyb3d9YDtcbiAgICAvL0ZvbGxvd2luZyAzIHJvd3MgYWRkZWQgdG8gcHJldmVudCB3ZWJwYWNrIFB1cmdlQ1NTIGZyb20gcmVtb3ZpbmcgdGhlIGNsYXNzZXMgZnJvbSBDU1MsXG4gICAgLy9hcyBpdCBpcyBub3Qgc21hcnQgZW5vdWdoIHRvIGludGVycHJldCB0aGUgdGVtcGxhdGUgbGl0ZXJhbCB0aGF0IGZvbGxvd3MuXG4gICAga2V5Ym9hcmRSb3dHcmlkLmNsYXNzTmFtZSA9IGBrZXlib2FyZFJvdzFgO1xuICAgIGtleWJvYXJkUm93R3JpZC5jbGFzc05hbWUgPSBga2V5Ym9hcmRSb3cyYDtcbiAgICBrZXlib2FyZFJvd0dyaWQuY2xhc3NOYW1lID0gYGtleWJvYXJkUm93M2A7XG4gICAga2V5Ym9hcmRSb3dHcmlkLmNsYXNzTmFtZSA9IGBrZXlib2FyZFJvdyR7cm93fWA7XG5cbiAgICBmb3IgKGxldCBrZXkgb2Yga2V5cykge1xuICAgICAgY29uc3Qga2V5QnV0dG9uID0gdGhpcy5kcmF3S2V5KGtleSk7XG4gICAgICBrZXlib2FyZFJvd0dyaWQuYXBwZW5kKGtleUJ1dHRvbik7XG4gICAgfVxuXG4gICAga2V5Ym9hcmRSb3cuYXBwZW5kKGtleWJvYXJkUm93R3JpZCk7XG4gICAgY29udGFpbmVyLmFwcGVuZChrZXlib2FyZFJvdyk7XG4gIH1cblxuICBkcmF3S2V5Ym9hcmQoY29udGFpbmVyKSB7XG4gICAgY29uc3Qga2V5cyA9IFtcbiAgICAgIFtcIlFcIiwgXCJXXCIsIFwiRVwiLCBcIlJcIiwgXCJUXCIsIFwiWVwiLCBcIlVcIiwgXCJJXCIsIFwiT1wiLCBcIlBcIl0sXG4gICAgICBbXCIgXCIsIFwiQVwiLCBcIlNcIiwgXCJEXCIsIFwiRlwiLCBcIkdcIiwgXCJIXCIsIFwiSlwiLCBcIktcIiwgXCJMXCIsIFwiIFwiXSxcbiAgICAgIFtcIkVOVEVSXCIsIFwiWlwiLCBcIlhcIiwgXCJDXCIsIFwiVlwiLCBcIkJcIiwgXCJOXCIsIFwiTVwiLCBcIuKMq1wiXSxcbiAgICBdO1xuICAgIGNvbnN0IGtleWJvYXJkR3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAga2V5Ym9hcmRHcmlkLmNsYXNzTmFtZSA9IFwia2V5Ym9hcmRHcmlkXCI7XG4gICAga2V5Ym9hcmRHcmlkLmlkID0gXCJrZXlib2FyZEdyaWRcIjtcblxuICAgIGNvbnRhaW5lci5hcHBlbmQoa2V5Ym9hcmRHcmlkKTtcblxuICAgIHRoaXMuZHJhd0tleWJvYXJkUm93KGtleWJvYXJkR3JpZCwgMSwga2V5c1swXSk7XG4gICAgdGhpcy5kcmF3S2V5Ym9hcmRSb3coa2V5Ym9hcmRHcmlkLCAyLCBrZXlzWzFdKTtcbiAgICB0aGlzLmRyYXdLZXlib2FyZFJvdyhrZXlib2FyZEdyaWQsIDMsIGtleXNbMl0pO1xuICB9XG5cbiAgYXBwZW5kTGV0dGVyKGxldHRlcikge1xuICAgIGlmICh0aGlzLmN1ckNvbCA8IDUgJiYgdGhpcy5jdXJSb3cgPCA2KSB7XG4gICAgICBjb25zdCB0aWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgIGB0aWxlLSR7dGhpcy5jdXJSb3d9LSR7dGhpcy5jdXJDb2x9YFxuICAgICAgKTtcbiAgICAgIHRpbGUudGV4dENvbnRlbnQgPSBsZXR0ZXI7XG4gICAgICB0aGlzLmJvYXJkW3RoaXMuY3VyUm93XVt0aGlzLmN1ckNvbF0gPSBsZXR0ZXI7XG4gICAgICB0aGlzLmN1ckNvbCsrO1xuICAgIH1cbiAgfVxuXG4gIGRlbGV0ZUxldHRlcigpIHtcbiAgICBpZiAodGhpcy5jdXJDb2wgPiAwKSB7XG4gICAgICB0aGlzLmN1ckNvbC0tO1xuICAgICAgY29uc3QgdGlsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgICBgdGlsZS0ke3RoaXMuY3VyUm93fS0ke3RoaXMuY3VyQ29sfWBcbiAgICAgICk7XG4gICAgICB0aWxlLmlubmVySFRNTCA9ICc8c3BhbiBjbGFzcz1cInRpbGVXYXRlck1hcmtcIj5CPC9zcGFuPic7XG4gICAgICB0aGlzLmJvYXJkW3RoaXMuY3VyUm93XVt0aGlzLmN1ckNvbF0gPSBcIlwiO1xuICAgICAgQkFDS1NQQUNFLmNsYXNzTGlzdC5yZW1vdmUoXCJub3RXb3JkXCIpO1xuICAgIH1cbiAgfVxuXG4gIGRpc3BsYXlNZXNzYWdlKG1lc3NhZ2UsIHRpbWUgPSAzNTAwKSB7XG4gICAgaGVhZGVyLmNsYXNzTmFtZSA9IFwibWVzc2FnZVwiO1xuICAgIGhlYWRlci50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBoZWFkZXIuY2xhc3NOYW1lID0gXCJoZWFkZXJcIjtcbiAgICAgIGhlYWRlci50ZXh0Q29udGVudCA9IFwid29yZEJydW5uZXJcIjtcbiAgICB9LCB0aW1lKTtcbiAgfVxuXG4gIHVwZGF0ZUtleWJvYXJkKGxldHRlclN0YXR1cykge1xuICAgIGZvciAobGV0IFtsZXR0ZXIsIHN0YXR1c10gb2YgT2JqZWN0LmVudHJpZXMobGV0dGVyU3RhdHVzKSkge1xuICAgICAgbGV0IGtleSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGxldHRlcik7XG4gICAgICBrZXkuY2xhc3NMaXN0LmFkZChcbiAgICAgICAgc3RhdHVzID09PSBcIkdcIlxuICAgICAgICAgID8gXCJ0aWxlSGl0XCJcbiAgICAgICAgICA6IHN0YXR1cyA9PT0gXCJZXCJcbiAgICAgICAgICA/IFwidGlsZUNsb3NlXCJcbiAgICAgICAgICA6IHN0YXR1cyA9PT0gXCJSXCJcbiAgICAgICAgICA/IFwidGlsZU1pc3NcIlxuICAgICAgICAgIDogXCJrZXlcIlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyByZXZlYWxHdWVzcyhndWVzc1N0YXR1cykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLmJ1c3kgPSB0cnVlO1xuICAgICAgbGV0IGdBcnIgPSBndWVzc1N0YXR1cztcbiAgICAgIHRoaXMuY29tcEF1ZGlvLnBsYXkoKS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgLypkbyBub3RoaW5nIC0gaXQncyBqdXN0IGF1ZGlvKi9cbiAgICAgIH0pO1xuICAgICAgbGV0IHdvcmQgPSBnQXJyW3RoaXMuY3VyUm93XTtcbiAgICAgIGxldCBpbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHRoaXMuc2NyYW1ibGVFZmZlY3QoKSwgMzApO1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApO1xuICAgICAgfSk7XG4gICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgIHRoaXMuY29sb3JUaWxlcyh3b3JkKTtcbiAgICAgIHRoaXMuYnVzeSA9IGZhbHNlO1xuICAgICAgcmVzb2x2ZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgc2NyYW1ibGVFZmZlY3QoKSB7XG4gICAgY29uc3QgbGV0dGVycyA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpcIjtcbiAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCA1OyBjb2wrKykge1xuICAgICAgbGV0IHRpbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgdGlsZS0ke3RoaXMuY3VyUm93fS0ke2NvbH1gKTtcbiAgICAgIHRpbGUudGV4dENvbnRlbnQgPSBsZXR0ZXJzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDI2KV07XG4gICAgfVxuICB9XG5cbiAgY29sb3JUaWxlcyh3b3JkKSB7XG4gICAgZm9yIChsZXQgW2lkeCwgbGV0dGVyXSBvZiB3b3JkLmVudHJpZXMoKSkge1xuICAgICAgbGV0IHRpbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgdGlsZS0ke3RoaXMuY3VyUm93fS0ke2lkeH1gKTtcbiAgICAgIHRpbGUudGV4dENvbnRlbnQgPSB3b3JkW2lkeF1bXCJsZXR0ZXJcIl07XG4gICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoXG4gICAgICAgIGxldHRlci5zdGF0dXMgPT09IFwiR1wiXG4gICAgICAgICAgPyBcInRpbGVIaXRcIlxuICAgICAgICAgIDogbGV0dGVyLnN0YXR1cyA9PT0gXCJZXCJcbiAgICAgICAgICA/IFwidGlsZUNsb3NlXCJcbiAgICAgICAgICA6IFwidGlsZU1pc3NcIlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBzaG93TW9kYWwodGl0bGUgPSBcIlRpdGxlXCIsIGNvbnRlbnQgPSBbXCJsb3JlbSBpcHN1bVwiXSwgZ2FtZVN0YXRlKSB7XG4gICAgY29uc3QgbW9kYWxDbG9zZUhhbmRsZXIgPSAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC50eXBlID09PSBcInRvdWNoc3RhcnRcIikge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgICAgbW9kYWxDb250YWluZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgdGhpcy5zdWNjZXNzQXVkaW8ucGF1c2UoKTtcbiAgICAgIHRoaXMuc3VjY2Vzc0F1ZGlvLmN1cnJlbnRUaW1lID0gMDtcbiAgICAgIHRoaXMuZmFpbEF1ZGlvLnBhdXNlKCk7XG4gICAgICB0aGlzLmZhaWxBdWRpby5jdXJyZW50VGltZSA9IDA7XG4gICAgICBpZiAoZ2FtZVN0YXRlICE9PSBcIlBMQVlJTkdcIikge1xuICAgICAgICBFTlRFUi5jbGFzc0xpc3QuYWRkKFwiZ2FtZU92ZXJcIik7XG4gICAgICAgIEVOVEVSLnRleHRDb250ZW50ID0gXCJSRVNFVFwiO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgbW9kYWxDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBtb2RhbENvbnRlbnQuaWQgPSBcIm1vZGFsQ29udGVudFwiO1xuICAgIG1vZGFsQ29udGVudC5jbGFzc05hbWUgPSBcIm1vZGFsQ29udGVudFwiO1xuXG4gICAgbGV0IGNsb3NlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgY2xvc2VCdXR0b24uaWQgPSBcImNsb3NlQnV0dG9uXCI7XG4gICAgY2xvc2VCdXR0b24uY2xhc3NOYW1lID0gXCJjbG9zZVwiO1xuICAgIGNsb3NlQnV0dG9uLnRleHRDb250ZW50ID0gYHhgO1xuICAgIGNsb3NlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBtb2RhbENsb3NlSGFuZGxlcik7XG4gICAgY2xvc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgbW9kYWxDbG9zZUhhbmRsZXIpO1xuICAgIG1vZGFsQ29udGVudC5hcHBlbmRDaGlsZChjbG9zZUJ1dHRvbik7XG5cbiAgICBsZXQgbW9kYWxUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoNFwiKTtcbiAgICBtb2RhbFRpdGxlLmNsYXNzTmFtZSA9IFwibW9kYWxUaXRsZVwiO1xuICAgIG1vZGFsVGl0bGUudGV4dENvbnRlbnQgPSB0aXRsZTtcbiAgICBtb2RhbENvbnRlbnQuYXBwZW5kQ2hpbGQobW9kYWxUaXRsZSk7XG5cbiAgICBmb3IgKGxldCBpdGVtIG9mIGNvbnRlbnQpIHtcbiAgICAgIGxldCBtb2RhbENvbnRlbnRJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICBtb2RhbENvbnRlbnRJdGVtLmNsYXNzTmFtZSA9IFwibW9kYWxDb250ZW50SXRlbVwiO1xuICAgICAgbW9kYWxDb250ZW50SXRlbS5pbm5lckhUTUwgPSBpdGVtO1xuICAgICAgbW9kYWxDb250ZW50LmFwcGVuZENoaWxkKG1vZGFsQ29udGVudEl0ZW0pO1xuICAgIH1cblxuICAgIG1vZGFsQ29udGFpbmVyLnJlcGxhY2VDaGlsZHJlbigpO1xuICAgIG1vZGFsQ29udGFpbmVyLmFwcGVuZENoaWxkKG1vZGFsQ29udGVudCk7XG4gICAgbW9kYWxDb250YWluZXIuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgfVxufVxuIiwiY29uc3QgV09SRFNfU1VQUExFTUVOVCA9IFtcbiAgXCJBQkFDSVwiLFxuICBcIkFCRU5EXCIsXG4gIFwiQUNIT09cIixcbiAgXCJBQ05FRFwiLFxuICBcIkFHQVJTXCIsXG4gIFwiQUdPTkVcIixcbiAgXCJBSE9MRFwiLFxuICBcIkFJREVSXCIsXG4gIFwiQUxHSU5cIixcbiAgXCJBTFRIT1wiLFxuICBcIkFNTU9TXCIsXG4gIFwiQU1VQ0tcIixcbiAgXCJBTVlMU1wiLFxuICBcIkFOREVEXCIsXG4gIFwiQU5JTEVcIixcbiAgXCJBTk5VTVwiLFxuICBcIkFQRVJTXCIsXG4gIFwiQVBPUlRcIixcbiAgXCJBUFNPU1wiLFxuICBcIkFRVUFFXCIsXG4gIFwiQVFVQVNcIixcbiAgXCJBUkVBTFwiLFxuICBcIkFSSVRZXCIsXG4gIFwiQVNLRVJcIixcbiAgXCJBU1NFRFwiLFxuICBcIkFTVFJPXCIsXG4gIFwiQVhMRURcIixcbiAgXCJBWUlOU1wiLFxuICBcIkJBSFRTXCIsXG4gIFwiQkFMRFNcIixcbiAgXCJCQVJJQ1wiLFxuICBcIkJBUktZXCIsXG4gIFwiQkFSTVNcIixcbiAgXCJCQVpBUlwiLFxuICBcIkJFQlVHXCIsXG4gIFwiQkVMTElcIixcbiAgXCJCRVNPVFwiLFxuICBcIkJIT1lTXCIsXG4gIFwiQklERVJcIixcbiAgXCJCSUdHWVwiLFxuICBcIkJJTEVTXCIsXG4gIFwiQklMR1lcIixcbiAgXCJCSVRTWVwiLFxuICBcIkJMQVNIXCIsXG4gIFwiQk9PS1lcIixcbiAgXCJCT1NTQVwiLFxuICBcIkJSQU5TXCIsXG4gIFwiQlJBVkFcIixcbiAgXCJCUkVOVFwiLFxuICBcIkJSSUVTXCIsXG4gIFwiQlJVTkdcIixcbiAgXCJCUlVTS1wiLFxuICBcIkJVRkZBXCIsXG4gIFwiQlVSUllcIixcbiAgXCJDQUdFUlwiLFxuICBcIkNBTkVSXCIsXG4gIFwiQ0FSTkVcIixcbiAgXCJDQVJPTlwiLFxuICBcIkNBUlBZXCIsXG4gIFwiQ0FTVVNcIixcbiAgXCJDRURFUlwiLFxuICBcIkNISUZGXCIsXG4gIFwiQ0hPT1NcIixcbiAgXCJDT09LWVwiLFxuICBcIkNPUVVJXCIsXG4gIFwiQ09SRFlcIixcbiAgXCJDT1JFUlwiLFxuICBcIkNSSU5LXCIsXG4gIFwiQ1VCRVJcIixcbiAgXCJDVUlOR1wiLFxuICBcIkNVUElEXCIsXG4gIFwiQ1VSRFlcIixcbiAgXCJDVVJFUlwiLFxuICBcIkNVUklBXCIsXG4gIFwiQ1VTUFlcIixcbiAgXCJEQVJFUlwiLFxuICBcIkRBU0hZXCIsXG4gIFwiREVBRFNcIixcbiAgXCJERUFSWVwiLFxuICBcIkRFRk9HXCIsXG4gIFwiREVGVU5cIixcbiAgXCJERUdVTVwiLFxuICBcIkRFSUNFXCIsXG4gIFwiREVJU1RcIixcbiAgXCJERVFVRVwiLFxuICBcIkRFV0VZXCIsXG4gIFwiRElDRVJcIixcbiAgXCJESUNVVFwiLFxuICBcIkRJRE9UXCIsXG4gIFwiRElFTVNcIixcbiAgXCJESUVTVFwiLFxuICBcIkRJRVRIXCIsXG4gIFwiRElSVFNcIixcbiAgXCJESVhJVFwiLFxuICBcIkRPUEVSXCIsXG4gIFwiRE9TRURcIixcbiAgXCJET1NFUlwiLFxuICBcIkRPU0VTXCIsXG4gIFwiRE9URVJcIixcbiAgXCJET1ZFWVwiLFxuICBcIkRPWElFXCIsXG4gIFwiRFJBQlNcIixcbiAgXCJEUklCU1wiLFxuICBcIkRVRERZXCIsXG4gIFwiRFVOR1lcIixcbiAgXCJEVU5LU1wiLFxuICBcIkVBUkVEXCIsXG4gIFwiRUFTVFNcIixcbiAgXCJFQ0hPU1wiLFxuICBcIkVER0VSXCIsXG4gIFwiRUxBTlNcIixcbiAgXCJFTkRFUlwiLFxuICBcIkVQU09NXCIsXG4gIFwiRVZFUllcIixcbiAgXCJFWUVSU1wiLFxuICBcIkZBQ0lFXCIsXG4gIFwiRkFDVE9cIixcbiAgXCJGQUlSRVwiLFxuICBcIkZBTUVTXCIsXG4gIFwiRkFOSU5cIixcbiAgXCJGQVRMWVwiLFxuICBcIkZBV05ZXCIsXG4gIFwiRkFYRVJcIixcbiAgXCJGRUlTVFwiLFxuICBcIkZFTk5ZXCIsXG4gIFwiRkVSTllcIixcbiAgXCJGRVVBUlwiLFxuICBcIkZFV0VSXCIsXG4gIFwiRklMQVJcIixcbiAgXCJGSUxFUlwiLFxuICBcIkZJTklGXCIsXG4gIFwiRklSRVJcIixcbiAgXCJGSVNUWVwiLFxuICBcIkZJVExZXCIsXG4gIFwiRklYSVRcIixcbiAgXCJGTEFCU1wiLFxuICBcIkZMQUtTXCIsXG4gIFwiRkxBUFNcIixcbiAgXCJGT0xJQ1wiLFxuICBcIkZPUkVTXCIsXG4gIFwiRk9SS1lcIixcbiAgXCJGT1JNQVwiLFxuICBcIkZVTUVSXCIsXG4gIFwiR0FNSUNcIixcbiAgXCJHQVBQWVwiLFxuICBcIkdBUkRFXCIsXG4gIFwiR0FZTFlcIixcbiAgXCJHQVpFUlwiLFxuICBcIkdIT1RJXCIsXG4gIFwiR0lCRVJcIixcbiAgXCJHSUdBU1wiLFxuICBcIkdJTUVMXCIsXG4gIFwiR0lNUFlcIixcbiAgXCJHSU5OWVwiLFxuICBcIkdMQVJZXCIsXG4gIFwiR0xVRVJcIixcbiAgXCJHT09OWVwiLFxuICBcIkdPT1BZXCIsXG4gIFwiR09SR0VcIixcbiAgXCJHUkFQWVwiLFxuICBcIkdSQVRBXCIsXG4gIFwiR1VOS1NcIixcbiAgXCJHVVRUQVwiLFxuICBcIkdXSU5FXCIsXG4gIFwiR1lWRURcIixcbiAgXCJIQVBBWFwiLFxuICBcIkhBUlVNXCIsXG4gIFwiSEFVVEVcIixcbiAgXCJIQVdFRFwiLFxuICBcIkhBWUVEXCIsXG4gIFwiSEFZRVJcIixcbiAgXCJIQVlFWVwiLFxuICBcIkhFRVJEXCIsXG4gIFwiSEVMTFNcIixcbiAgXCJIRU1QU1wiLFxuICBcIkhFTVBZXCIsXG4gIFwiSEVSRU1cIixcbiAgXCJIRVJPU1wiLFxuICBcIkhFWEVSXCIsXG4gIFwiSElERVJcIixcbiAgXCJISVJFUlwiLFxuICBcIkhJVkVSXCIsXG4gIFwiSE9BUlNcIixcbiAgXCJIT0RBRFwiLFxuICBcIkhPRVJTXCIsXG4gIFwiSE9MRVJcIixcbiAgXCJIT0xFWVwiLFxuICBcIkhPTE9OXCIsXG4gIFwiSE9NTUVcIixcbiAgXCJIT05FUlwiLFxuICBcIkhPUEVSXCIsXG4gIFwiSE9QUFlcIixcbiAgXCJIVUxLWVwiLFxuICBcIkhVUkxZXCIsXG4gIFwiSUNFUlNcIixcbiAgXCJJQ0lMWVwiLFxuICBcIklNTUlYXCIsXG4gIFwiSU5LRVJcIixcbiAgXCJJTk9ERVwiLFxuICBcIklPRElDXCIsXG4gIFwiSkFLRVNcIixcbiAgXCJKSUJFUlwiLFxuICBcIkpPV0xZXCIsXG4gIFwiSlVET1NcIixcbiAgXCJKVVNURVwiLFxuICBcIktBSUFLXCIsXG4gIFwiS0FMRVNcIixcbiAgXCJLRUJPQlwiLFxuICBcIktFTExZXCIsXG4gIFwiS0VMUFlcIixcbiAgXCJLRVlFUlwiLFxuICBcIktJTFRZXCIsXG4gIFwiS0lURURcIixcbiAgXCJLSVRFU1wiLFxuICBcIktMVU5LXCIsXG4gIFwiTEFDRVJcIixcbiAgXCJMQUNFWVwiLFxuICBcIkxBUElOXCIsXG4gIFwiTEFSRFlcIixcbiAgXCJMQVRVU1wiLFxuICBcIkxBVURFXCIsXG4gIFwiTEFXTllcIixcbiAgXCJMQVdaWVwiLFxuICBcIkxBWExZXCIsXG4gIFwiTElFUlNcIixcbiAgXCJMSUVTVFwiLFxuICBcIkxJRVRIXCIsXG4gIFwiTElHTkVcIixcbiAgXCJMSUtFUlwiLFxuICBcIkxJTFRZXCIsXG4gIFwiTElNQllcIixcbiAgXCJMSU5UU1wiLFxuICBcIkxJTlRZXCIsXG4gIFwiTElSQVNcIixcbiAgXCJMSVRFU1wiLFxuICBcIkxJVkVTXCIsXG4gIFwiTElWUkVcIixcbiAgXCJMT0FNU1wiLFxuICBcIkxPQkVEXCIsXG4gIFwiTE9HR1lcIixcbiAgXCJMT1BFUlwiLFxuICBcIkxPVFRBXCIsXG4gIFwiTE9YRVNcIixcbiAgXCJMVUxBQlwiLFxuICBcIkxVUkVSXCIsXG4gIFwiTFVWWUFcIixcbiAgXCJMVVhFU1wiLFxuICBcIk1BTkVEXCIsXG4gIFwiTUFTSFlcIixcbiAgXCJNQVNTRVwiLFxuICBcIk1FQkJFXCIsXG4gIFwiTUVDQ0FcIixcbiAgXCJNRUNVTVwiLFxuICBcIk1FUlNFXCIsXG4gIFwiTUlDQVNcIixcbiAgXCJNSU1FUlwiLFxuICBcIk1JTkFTXCIsXG4gIFwiTU9EVVNcIixcbiAgXCJNT0xUT1wiLFxuICBcIk1PUEVSXCIsXG4gIFwiTU9TVFNcIixcbiAgXCJNUkFEU1wiLFxuICBcIk1VSklLXCIsXG4gIFwiTVVNQk9cIixcbiAgXCJNVU5HWVwiLFxuICBcIk1VUktTXCIsXG4gIFwiTVVTRVJcIixcbiAgXCJNVVNTWVwiLFxuICBcIk1VVEVSXCIsXG4gIFwiTkFCTEFcIixcbiAgXCJOQU1FUlwiLFxuICBcIk5FUlRTXCIsXG4gIFwiTklISUxcIixcbiAgXCJOSVRUWVwiLFxuICBcIk5PQkJZXCIsXG4gIFwiTk9JUkVcIixcbiAgXCJOT05OWVwiLFxuICBcIk5PVEVSXCIsXG4gIFwiTlVERVJcIixcbiAgXCJOVVJCU1wiLFxuICBcIk9GRkVOXCIsXG4gIFwiT0dMRVJcIixcbiAgXCJPSE1JQ1wiLFxuICBcIk9LUkFTXCIsXG4gIFwiT0xFT1NcIixcbiAgXCJPTkNFVFwiLFxuICBcIk9PRExFXCIsXG4gIFwiT1JCRURcIixcbiAgXCJPUklOR1wiLFxuICBcIk9STE9OXCIsXG4gIFwiT1VURU5cIixcbiAgXCJPV0VTVFwiLFxuICBcIk9XRVRIXCIsXG4gIFwiUEFNUEFcIixcbiAgXCJQQU5FRFwiLFxuICBcIlBBUkVSXCIsXG4gIFwiUEFXRVJcIixcbiAgXCJQRUFUWVwiLFxuICBcIlBFTkRTXCIsXG4gIFwiUEVSRFVcIixcbiAgXCJQRVRSSVwiLFxuICBcIlBGRkZUXCIsXG4gIFwiUEhBU0VcIixcbiAgXCJQSUlOR1wiLFxuICBcIlBJU01PXCIsXG4gIFwiUExFSU5cIixcbiAgXCJQTEVOQVwiLFxuICBcIlBMWUVSXCIsXG4gIFwiUE9MTFlcIixcbiAgXCJQT0xPU1wiLFxuICBcIlBPTkVTXCIsXG4gIFwiUE9PRVlcIixcbiAgXCJQT1NFVFwiLFxuICBcIlBPU1RFXCIsXG4gIFwiUE9YRURcIixcbiAgXCJQUkVTVFwiLFxuICBcIlBSSUVSXCIsXG4gIFwiUFJJTUFcIixcbiAgXCJQUlVUQVwiLFxuICBcIlBSWUVSXCIsXG4gIFwiUFVQQUxcIixcbiAgXCJQVVBBU1wiLFxuICBcIlBZWElFXCIsXG4gIFwiUU9QSFNcIixcbiAgXCJRVUFJU1wiLFxuICBcIlFVQUxTXCIsXG4gIFwiUkFLRVJcIixcbiAgXCJSQVBFRFwiLFxuICBcIlJBUEVTXCIsXG4gIFwiUkFTQUVcIixcbiAgXCJSQVRFUlwiLFxuICBcIlJBV0xZXCIsXG4gIFwiUkFaRVJcIixcbiAgXCJSRUJPWFwiLFxuICBcIlJFRElQXCIsXG4gIFwiUkVETFlcIixcbiAgXCJSRUVLWVwiLFxuICBcIlJFRkxZXCIsXG4gIFwiUkVGUllcIixcbiAgXCJSRU5URVwiLFxuICBcIlJFU0FXXCIsXG4gIFwiUkVTQVlcIixcbiAgXCJSRVNFV1wiLFxuICBcIlJFV0VEXCIsXG4gIFwiUklER1lcIixcbiAgXCJSSUZFUlwiLFxuICBcIlJJTUVSXCIsXG4gIFwiUk9CTEVcIixcbiAgXCJST09LWVwiLFxuICBcIlJPT1RZXCIsXG4gIFwiUlVOSUNcIixcbiAgXCJSVU5UWVwiLFxuICBcIlJVU1NFXCIsXG4gIFwiUlVUVFlcIixcbiAgXCJTQUdFUlwiLFxuICBcIlNBVEVTXCIsXG4gIFwiU0FXRVJcIixcbiAgXCJTQVlFUlwiLFxuICBcIlNDT1BTXCIsXG4gIFwiU0NVU0VcIixcbiAgXCJTRURHWVwiLFxuICBcIlNFRVNUXCIsXG4gIFwiU0hJRVJcIixcbiAgXCJTSElLSVwiLFxuICBcIlNISVNIXCIsXG4gIFwiU0hOT1JcIixcbiAgXCJTSE9FRFwiLFxuICBcIlNIT0VSXCIsXG4gIFwiU0hVVEVcIixcbiAgXCJTSUZUU1wiLFxuICBcIlNJTFRZXCIsXG4gIFwiU0laRVJcIixcbiAgXCJTS1lFRFwiLFxuICBcIlNMQVdTXCIsXG4gIFwiU0xJRVJcIixcbiAgXCJTTFVGRlwiLFxuICBcIlNPRlRTXCIsXG4gIFwiU09MT05cIixcbiAgXCJTT0xVTVwiLFxuICBcIlNPTkxZXCIsXG4gIFwiU09XRVJcIixcbiAgXCJTT1lBU1wiLFxuICBcIlNQSUVSXCIsXG4gIFwiU1BJTkFcIixcbiAgXCJTUElOWVwiLFxuICBcIlNQVU1ZXCIsXG4gIFwiU1BVVEFcIixcbiAgXCJTVE9BRVwiLFxuICBcIlNVRFNZXCIsXG4gIFwiU1VFUlNcIixcbiAgXCJTVUVUU1wiLFxuICBcIlNVRVRZXCIsXG4gIFwiU1VQRVNcIixcbiAgXCJUQUNFVFwiLFxuICBcIlRBQ1RTXCIsXG4gIFwiVEFHVUFcIixcbiAgXCJUQVJFRFwiLFxuICBcIlRBWEVSXCIsXG4gIFwiVEVDVU1cIixcbiAgXCJURVhBU1wiLFxuICBcIlRIRUlSXCIsXG4gIFwiVEhFTlNcIixcbiAgXCJUSE9VU1wiLFxuICBcIlRIV0FQXCIsXG4gIFwiVElHSFRcIixcbiAgXCJUT0tFUlwiLFxuICBcIlRPUEVSXCIsXG4gIFwiVE9SQUhcIixcbiAgXCJUT1RFUlwiLFxuICBcIlRPVUNIXCIsXG4gIFwiVE9WRVNcIixcbiAgXCJUT1dFRFwiLFxuICBcIlRPWUVSXCIsXG4gIFwiVFJFQVBcIixcbiAgXCJUUklCU1wiLFxuICBcIlRVRkFTXCIsXG4gIFwiVFVGVFlcIixcbiAgXCJUVVJEWVwiLFxuICBcIlRZUEFMXCIsXG4gIFwiVUxOQVJcIixcbiAgXCJVTVBUWVwiLFxuICBcIlVOQVJDXCIsXG4gIFwiVU5BVEVcIixcbiAgXCJVTkZJWFwiLFxuICBcIlVOSElUXCIsXG4gIFwiVU5KQU1cIixcbiAgXCJVTk1BUFwiLFxuICBcIlVOU0VXXCIsXG4gIFwiVU5XT05cIixcbiAgXCJVUkVBU1wiLFxuICBcIlVURVJPXCIsXG4gIFwiVkFDVU9cIixcbiAgXCJWQUdVU1wiLFxuICBcIlZBTkVEXCIsXG4gIFwiVkFSSUFcIixcbiAgXCJWRUFMU1wiLFxuICBcIlZFSU5ZXCIsXG4gIFwiVkVSU0FcIixcbiAgXCJWSUVSU1wiLFxuICBcIlZJTExFXCIsXG4gIFwiVklORURcIixcbiAgXCJWSVJFU1wiLFxuICBcIlZJU0VEXCIsXG4gIFwiVklUQUVcIixcbiAgXCJWSVRBTVwiLFxuICBcIlZJVFJPXCIsXG4gIFwiVk9XRVJcIixcbiAgXCJXQUtFUlwiLFxuICBcIldBTEVEXCIsXG4gIFwiV0FOTFlcIixcbiAgXCJXQVJUWVwiLFxuICBcIldBWEVSXCIsXG4gIFwiV0VBTERcIixcbiAgXCJXRUFOU1wiLFxuICBcIldFQkJZXCIsXG4gIFwiV0VER1lcIixcbiAgXCJXRVNUU1wiLFxuICBcIldFVExZXCIsXG4gIFwiV0hBVFNcIixcbiAgXCJXSEVFRVwiLFxuICBcIldIRU5TXCIsXG4gIFwiV0hFV1NcIixcbiAgXCJXSEVZU1wiLFxuICBcIldISVNIXCIsXG4gIFwiV0hPQVNcIixcbiAgXCJXSE9PT1wiLFxuICBcIldJTkVZXCIsXG4gIFwiV0lSRVJcIixcbiAgXCJXSVNUU1wiLFxuICBcIldJVEhTXCIsXG4gIFwiV09PRVJcIixcbiAgXCJZT0dBU1wiLFxuICBcIllPR0lDXCIsXG4gIFwiWU9MS1lcIixcbiAgXCJZT1JFU1wiLFxuICBcIllVTEVTXCIsXG4gIFwiWkVBTFNcIixcbiAgXCJaRVNUWVwiLFxuICBcIlpJTkdZXCIsXG4gIFwiWk9NQklcIixcbiAgXCJaT09LU1wiLFxuXVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgV09SRFNfU1VQUExFTUVOVCB9XG4iLCJjb25zdCBXT1JEUyA9IFtcbiAgXCJBQVJHSFwiLFxuICBcIkFCQUNBXCIsXG4gIFwiQUJBQ0tcIixcbiAgXCJBQkFGVFwiLFxuICBcIkFCQVNFXCIsXG4gIFwiQUJBU0hcIixcbiAgXCJBQkFURVwiLFxuICBcIkFCQkVZXCIsXG4gIFwiQUJCT1RcIixcbiAgXCJBQkVBTVwiLFxuICBcIkFCRVRTXCIsXG4gIFwiQUJIT1JcIixcbiAgXCJBQklERVwiLFxuICBcIkFCTEVEXCIsXG4gIFwiQUJMRVJcIixcbiAgXCJBQk9ERVwiLFxuICBcIkFCT1JUXCIsXG4gIFwiQUJPVVRcIixcbiAgXCJBQk9WRVwiLFxuICBcIkFCVVNFXCIsXG4gIFwiQUJVVFNcIixcbiAgXCJBQlVaWlwiLFxuICBcIkFCWVNTXCIsXG4gIFwiQUNIRURcIixcbiAgXCJBQ0hFU1wiLFxuICBcIkFDSURTXCIsXG4gIFwiQUNJTkdcIixcbiAgXCJBQ01FU1wiLFxuICBcIkFDT1JOXCIsXG4gIFwiQUNSRVNcIixcbiAgXCJBQ1JJRFwiLFxuICBcIkFDVEVEXCIsXG4gIFwiQUNUSU5cIixcbiAgXCJBQ1RPUlwiLFxuICBcIkFDVVRFXCIsXG4gIFwiQURBR0VcIixcbiAgXCJBREFQVFwiLFxuICBcIkFEREVEXCIsXG4gIFwiQURERVJcIixcbiAgXCJBRERMRVwiLFxuICBcIkFERVBUXCIsXG4gIFwiQURJRVVcIixcbiAgXCJBRElPU1wiLFxuICBcIkFETElCXCIsXG4gIFwiQURNQU5cIixcbiAgXCJBRE1FTlwiLFxuICBcIkFETUlUXCIsXG4gIFwiQURNSVhcIixcbiAgXCJBRE9CRVwiLFxuICBcIkFET1BUXCIsXG4gIFwiQURPUkVcIixcbiAgXCJBRE9STlwiLFxuICBcIkFEVUxUXCIsXG4gIFwiQURaRVNcIixcbiAgXCJBRUdJU1wiLFxuICBcIkFFUklFXCIsXG4gIFwiQUZGSVhcIixcbiAgXCJBRklSRVwiLFxuICBcIkFGT09UXCIsXG4gIFwiQUZPUkVcIixcbiAgXCJBRk9VTFwiLFxuICBcIkFGVEVSXCIsXG4gIFwiQUdBSU5cIixcbiAgXCJBR0FQRVwiLFxuICBcIkFHQVRFXCIsXG4gIFwiQUdBVkVcIixcbiAgXCJBR0VOVFwiLFxuICBcIkFHSUxFXCIsXG4gIFwiQUdJTkdcIixcbiAgXCJBR0xFWVwiLFxuICBcIkFHTE9XXCIsXG4gIFwiQUdPTllcIixcbiAgXCJBR09SQVwiLFxuICBcIkFHUkVFXCIsXG4gIFwiQUdVRVNcIixcbiAgXCJBSEVBRFwiLFxuICBcIkFJREVEXCIsXG4gIFwiQUlERVNcIixcbiAgXCJBSUxFRFwiLFxuICBcIkFJTUVEXCIsXG4gIFwiQUlPTElcIixcbiAgXCJBSVJFRFwiLFxuICBcIkFJUkVSXCIsXG4gIFwiQUlTTEVcIixcbiAgXCJBSVRDSFwiLFxuICBcIkFKVUdBXCIsXG4gIFwiQUxBQ0tcIixcbiAgXCJBTEFSTVwiLFxuICBcIkFMQlVNXCIsXG4gIFwiQUxERVJcIixcbiAgXCJBTEVQSFwiLFxuICBcIkFMRVJUXCIsXG4gIFwiQUxHQUVcIixcbiAgXCJBTEdBTFwiLFxuICBcIkFMSUFTXCIsXG4gIFwiQUxJQklcIixcbiAgXCJBTElFTlwiLFxuICBcIkFMSUdOXCIsXG4gIFwiQUxJS0VcIixcbiAgXCJBTElWRVwiLFxuICBcIkFMS1lEXCIsXG4gIFwiQUxLWUxcIixcbiAgXCJBTExBWVwiLFxuICBcIkFMTEVZXCIsXG4gIFwiQUxMT1RcIixcbiAgXCJBTExPV1wiLFxuICBcIkFMTE9ZXCIsXG4gIFwiQUxPRVNcIixcbiAgXCJBTE9GVFwiLFxuICBcIkFMT0hBXCIsXG4gIFwiQUxPTkVcIixcbiAgXCJBTE9OR1wiLFxuICBcIkFMT09GXCIsXG4gIFwiQUxPVURcIixcbiAgXCJBTFBIQVwiLFxuICBcIkFMVEFSXCIsXG4gIFwiQUxURVJcIixcbiAgXCJBTFRPU1wiLFxuICBcIkFMVU1TXCIsXG4gIFwiQUxXQVlcIixcbiAgXCJBTUFIU1wiLFxuICBcIkFNQVNTXCIsXG4gIFwiQU1BWkVcIixcbiAgXCJBTUJFUlwiLFxuICBcIkFNQklUXCIsXG4gIFwiQU1CTEVcIixcbiAgXCJBTUVCQVwiLFxuICBcIkFNRU5EXCIsXG4gIFwiQU1FTlNcIixcbiAgXCJBTUlERVwiLFxuICBcIkFNSUdPXCIsXG4gIFwiQU1JTkVcIixcbiAgXCJBTUlOT1wiLFxuICBcIkFNSVNTXCIsXG4gIFwiQU1JVFlcIixcbiAgXCJBTU9OR1wiLFxuICBcIkFNT1VSXCIsXG4gIFwiQU1QRURcIixcbiAgXCJBTVBMRVwiLFxuICBcIkFNUExZXCIsXG4gIFwiQU1VU0VcIixcbiAgXCJBTkVOVFwiLFxuICBcIkFOR0VMXCIsXG4gIFwiQU5HRVJcIixcbiAgXCJBTkdMRVwiLFxuICBcIkFOR1JZXCIsXG4gIFwiQU5HU1RcIixcbiAgXCJBTklNQVwiLFxuICBcIkFOSU9OXCIsXG4gIFwiQU5JU0VcIixcbiAgXCJBTktIU1wiLFxuICBcIkFOS0xFXCIsXG4gIFwiQU5OQVNcIixcbiAgXCJBTk5FWFwiLFxuICBcIkFOTk9ZXCIsXG4gIFwiQU5OVUxcIixcbiAgXCJBTk9ERVwiLFxuICBcIkFOT0xFXCIsXG4gIFwiQU5URURcIixcbiAgXCJBTlRFU1wiLFxuICBcIkFOVElDXCIsXG4gIFwiQU5USVNcIixcbiAgXCJBTlRTWVwiLFxuICBcIkFOVklMXCIsXG4gIFwiQU9SVEFcIixcbiAgXCJBUEFDRVwiLFxuICBcIkFQQVJUXCIsXG4gIFwiQVBISURcIixcbiAgXCJBUEhJU1wiLFxuICBcIkFQSUFOXCIsXG4gIFwiQVBJTkdcIixcbiAgXCJBUElTSFwiLFxuICBcIkFQTkVBXCIsXG4gIFwiQVBQTEVcIixcbiAgXCJBUFBMWVwiLFxuICBcIkFQUk9OXCIsXG4gIFwiQVBTRVNcIixcbiAgXCJBUFRMWVwiLFxuICBcIkFSQk9SXCIsXG4gIFwiQVJDRURcIixcbiAgXCJBUkRPUlwiLFxuICBcIkFSRUFTXCIsXG4gIFwiQVJFTkFcIixcbiAgXCJBUkdPTlwiLFxuICBcIkFSR09UXCIsXG4gIFwiQVJHVUVcIixcbiAgXCJBUklBU1wiLFxuICBcIkFSSVNFXCIsXG4gIFwiQVJNRURcIixcbiAgXCJBUk1PUlwiLFxuICBcIkFST01BXCIsXG4gIFwiQVJPU0VcIixcbiAgXCJBUlJBU1wiLFxuICBcIkFSUkFZXCIsXG4gIFwiQVJST1dcIixcbiAgXCJBUlNFU1wiLFxuICBcIkFSU09OXCIsXG4gIFwiQVJUU1lcIixcbiAgXCJBUlVNU1wiLFxuICBcIkFTQU5BXCIsXG4gIFwiQVNDT1RcIixcbiAgXCJBU0hFTlwiLFxuICBcIkFTSEVTXCIsXG4gIFwiQVNJREVcIixcbiAgXCJBU0tFRFwiLFxuICBcIkFTS0VXXCIsXG4gIFwiQVNQRU5cIixcbiAgXCJBU1BJQ1wiLFxuICBcIkFTU0FJXCIsXG4gIFwiQVNTQVlcIixcbiAgXCJBU1NFU1wiLFxuICBcIkFTU0VUXCIsXG4gIFwiQVNURVJcIixcbiAgXCJBU1RJUlwiLFxuICBcIkFUSUxUXCIsXG4gIFwiQVRMQVNcIixcbiAgXCJBVE9MTFwiLFxuICBcIkFUT01TXCIsXG4gIFwiQVRPTkVcIixcbiAgXCJBVFJJQVwiLFxuICBcIkFUVEFSXCIsXG4gIFwiQVRUSUNcIixcbiAgXCJBVURJT1wiLFxuICBcIkFVRElUXCIsXG4gIFwiQVVHRVJcIixcbiAgXCJBVUdIVFwiLFxuICBcIkFVR1VSXCIsXG4gIFwiQVVOVFNcIixcbiAgXCJBVVJBRVwiLFxuICBcIkFVUkFMXCIsXG4gIFwiQVVSQVNcIixcbiAgXCJBVVJJQ1wiLFxuICBcIkFVVE9TXCIsXG4gIFwiQVZBSUxcIixcbiAgXCJBVkFOVFwiLFxuICBcIkFWQVNUXCIsXG4gIFwiQVZFUlNcIixcbiAgXCJBVkVSVFwiLFxuICBcIkFWSUFOXCIsXG4gIFwiQVZPSURcIixcbiAgXCJBVk9XU1wiLFxuICBcIkFXQUlUXCIsXG4gIFwiQVdBS0VcIixcbiAgXCJBV0FSRFwiLFxuICBcIkFXQVJFXCIsXG4gIFwiQVdBU0hcIixcbiAgXCJBV0FZU1wiLFxuICBcIkFXRlVMXCIsXG4gIFwiQVdJTkdcIixcbiAgXCJBV09LRVwiLFxuICBcIkFYRUxTXCIsXG4gIFwiQVhJQUxcIixcbiAgXCJBWElOR1wiLFxuICBcIkFYSU9NXCIsXG4gIFwiQVhMRVNcIixcbiAgXCJBWE1BTlwiLFxuICBcIkFYTUVOXCIsXG4gIFwiQVhPTlNcIixcbiAgXCJBWklORVwiLFxuICBcIkFaT0lDXCIsXG4gIFwiQVpVUkVcIixcbiAgXCJCQUJFTFwiLFxuICBcIkJBQkVTXCIsXG4gIFwiQkFDS1NcIixcbiAgXCJCQUNPTlwiLFxuICBcIkJBRERZXCIsXG4gIFwiQkFER0VcIixcbiAgXCJCQURMWVwiLFxuICBcIkJBR0VMXCIsXG4gIFwiQkFHR1lcIixcbiAgXCJCQUlMU1wiLFxuICBcIkJBSVJOXCIsXG4gIFwiQkFJVFNcIixcbiAgXCJCQUlaRVwiLFxuICBcIkJBS0VEXCIsXG4gIFwiQkFLRVJcIixcbiAgXCJCQUtFU1wiLFxuICBcIkJBTERZXCIsXG4gIFwiQkFMRURcIixcbiAgXCJCQUxFUlwiLFxuICBcIkJBTEVTXCIsXG4gIFwiQkFMS1NcIixcbiAgXCJCQUxLWVwiLFxuICBcIkJBTExTXCIsXG4gIFwiQkFMTFlcIixcbiAgXCJCQUxNU1wiLFxuICBcIkJBTE1ZXCIsXG4gIFwiQkFMU0FcIixcbiAgXCJCQU5BTFwiLFxuICBcIkJBTkRTXCIsXG4gIFwiQkFORFlcIixcbiAgXCJCQU5FU1wiLFxuICBcIkJBTkdTXCIsXG4gIFwiQkFOSk9cIixcbiAgXCJCQU5LU1wiLFxuICBcIkJBTk5TXCIsXG4gIFwiQkFSQlNcIixcbiAgXCJCQVJEU1wiLFxuICBcIkJBUkVEXCIsXG4gIFwiQkFSRVJcIixcbiAgXCJCQVJFU1wiLFxuICBcIkJBUkZTXCIsXG4gIFwiQkFSRllcIixcbiAgXCJCQVJHRVwiLFxuICBcIkJBUktTXCIsXG4gIFwiQkFSTVlcIixcbiAgXCJCQVJOU1wiLFxuICBcIkJBUk9OXCIsXG4gIFwiQkFTQUxcIixcbiAgXCJCQVNFRFwiLFxuICBcIkJBU0VSXCIsXG4gIFwiQkFTRVNcIixcbiAgXCJCQVNJQ1wiLFxuICBcIkJBU0lMXCIsXG4gIFwiQkFTSU5cIixcbiAgXCJCQVNJU1wiLFxuICBcIkJBU0tTXCIsXG4gIFwiQkFTU0lcIixcbiAgXCJCQVNTT1wiLFxuICBcIkJBU1RFXCIsXG4gIFwiQkFUQ0hcIixcbiAgXCJCQVRFRFwiLFxuICBcIkJBVEVTXCIsXG4gIFwiQkFUSEVcIixcbiAgXCJCQVRIU1wiLFxuICBcIkJBVElLXCIsXG4gIFwiQkFUT05cIixcbiAgXCJCQVRUWVwiLFxuICBcIkJBVURTXCIsXG4gIFwiQkFVTEtcIixcbiAgXCJCQVdEWVwiLFxuICBcIkJBV0xTXCIsXG4gIFwiQkFZRURcIixcbiAgXCJCQVlPVVwiLFxuICBcIkJFQUNIXCIsXG4gIFwiQkVBRFNcIixcbiAgXCJCRUFEWVwiLFxuICBcIkJFQUtTXCIsXG4gIFwiQkVBS1lcIixcbiAgXCJCRUFNU1wiLFxuICBcIkJFQU1ZXCIsXG4gIFwiQkVBTk9cIixcbiAgXCJCRUFOU1wiLFxuICBcIkJFQVJEXCIsXG4gIFwiQkVBUlNcIixcbiAgXCJCRUFTVFwiLFxuICBcIkJFQVRTXCIsXG4gIFwiQkVBVVNcIixcbiAgXCJCRUFVVFwiLFxuICBcIkJFQVVYXCIsXG4gIFwiQkVCT1BcIixcbiAgXCJCRUNLU1wiLFxuICBcIkJFREVXXCIsXG4gIFwiQkVESU1cIixcbiAgXCJCRUVDSFwiLFxuICBcIkJFRUZTXCIsXG4gIFwiQkVFRllcIixcbiAgXCJCRUVQU1wiLFxuICBcIkJFRVJTXCIsXG4gIFwiQkVFUllcIixcbiAgXCJCRUVUU1wiLFxuICBcIkJFRklUXCIsXG4gIFwiQkVGT0dcIixcbiAgXCJCRUdBTlwiLFxuICBcIkJFR0FUXCIsXG4gIFwiQkVHRVRcIixcbiAgXCJCRUdJTlwiLFxuICBcIkJFR09UXCIsXG4gIFwiQkVHVU5cIixcbiAgXCJCRUlHRVwiLFxuICBcIkJFSU5HXCIsXG4gIFwiQkVMQVlcIixcbiAgXCJCRUxDSFwiLFxuICBcIkJFTElFXCIsXG4gIFwiQkVMTEVcIixcbiAgXCJCRUxMU1wiLFxuICBcIkJFTExZXCIsXG4gIFwiQkVMT1dcIixcbiAgXCJCRUxUU1wiLFxuICBcIkJFTkNIXCIsXG4gIFwiQkVORFNcIixcbiAgXCJCRU5UU1wiLFxuICBcIkJFUkVUXCIsXG4gIFwiQkVSR1NcIixcbiAgXCJCRVJNU1wiLFxuICBcIkJFUlJZXCIsXG4gIFwiQkVSVEhcIixcbiAgXCJCRVJZTFwiLFxuICBcIkJFU0VUXCIsXG4gIFwiQkVTVFNcIixcbiAgXCJCRVRBU1wiLFxuICBcIkJFVEVMXCIsXG4gIFwiQkVUSFNcIixcbiAgXCJCRVZFTFwiLFxuICBcIkJFWkVMXCIsXG4gIFwiQkhBTkdcIixcbiAgXCJCSUJCU1wiLFxuICBcIkJJQkxFXCIsXG4gIFwiQklERFlcIixcbiAgXCJCSURFRFwiLFxuICBcIkJJREVTXCIsXG4gIFwiQklERVRcIixcbiAgXCJCSUVSU1wiLFxuICBcIkJJRkZTXCIsXG4gIFwiQklGRllcIixcbiAgXCJCSUdIVFwiLFxuICBcIkJJR0xZXCIsXG4gIFwiQklHT1RcIixcbiAgXCJCSUtFRFwiLFxuICBcIkJJS0VSXCIsXG4gIFwiQklLRVNcIixcbiAgXCJCSUxHRVwiLFxuICBcIkJJTEtTXCIsXG4gIFwiQklMTFNcIixcbiAgXCJCSUxMWVwiLFxuICBcIkJJTUJPXCIsXG4gIFwiQklORFNcIixcbiAgXCJCSU5HRVwiLFxuICBcIkJJTkdPXCIsXG4gIFwiQklPTUVcIixcbiAgXCJCSVBFRFwiLFxuICBcIkJJUE9EXCIsXG4gIFwiQklSQ0hcIixcbiAgXCJCSVJEU1wiLFxuICBcIkJJUlRIXCIsXG4gIFwiQklTT05cIixcbiAgXCJCSVRDSFwiLFxuICBcIkJJVEVSXCIsXG4gIFwiQklURVNcIixcbiAgXCJCSVRUWVwiLFxuICBcIkJMQUJTXCIsXG4gIFwiQkxBQ0tcIixcbiAgXCJCTEFERVwiLFxuICBcIkJMQUhTXCIsXG4gIFwiQkxBTUVcIixcbiAgXCJCTEFORFwiLFxuICBcIkJMQU5LXCIsXG4gIFwiQkxBUkVcIixcbiAgXCJCTEFTVFwiLFxuICBcIkJMQVRTXCIsXG4gIFwiQkxBWkVcIixcbiAgXCJCTEVBS1wiLFxuICBcIkJMRUFSXCIsXG4gIFwiQkxFQVRcIixcbiAgXCJCTEVCU1wiLFxuICBcIkJMRUVEXCIsXG4gIFwiQkxFTkRcIixcbiAgXCJCTEVTU1wiLFxuICBcIkJMRVNUXCIsXG4gIFwiQkxJTVBcIixcbiAgXCJCTElORFwiLFxuICBcIkJMSU5JXCIsXG4gIFwiQkxJTktcIixcbiAgXCJCTElQU1wiLFxuICBcIkJMSVNTXCIsXG4gIFwiQkxJVFpcIixcbiAgXCJCTE9BVFwiLFxuICBcIkJMT0JTXCIsXG4gIFwiQkxPQ0tcIixcbiAgXCJCTE9DU1wiLFxuICBcIkJMT0tFXCIsXG4gIFwiQkxPTkRcIixcbiAgXCJCTE9PRFwiLFxuICBcIkJMT09NXCIsXG4gIFwiQkxPVFNcIixcbiAgXCJCTE9XTlwiLFxuICBcIkJMT1dTXCIsXG4gIFwiQkxPV1lcIixcbiAgXCJCTFVFRFwiLFxuICBcIkJMVUVSXCIsXG4gIFwiQkxVRVNcIixcbiAgXCJCTFVGRlwiLFxuICBcIkJMVU5UXCIsXG4gIFwiQkxVUkJcIixcbiAgXCJCTFVSU1wiLFxuICBcIkJMVVJUXCIsXG4gIFwiQkxVU0hcIixcbiAgXCJCT0FSRFwiLFxuICBcIkJPQVJTXCIsXG4gIFwiQk9BU1RcIixcbiAgXCJCT0FUU1wiLFxuICBcIkJPQkJZXCIsXG4gIFwiQk9DQ0VcIixcbiAgXCJCT0NDSVwiLFxuICBcIkJPQ0tTXCIsXG4gIFwiQk9ERURcIixcbiAgXCJCT0RFU1wiLFxuICBcIkJPREdFXCIsXG4gIFwiQk9GRk9cIixcbiAgXCJCT0ZGU1wiLFxuICBcIkJPR0VZXCIsXG4gIFwiQk9HR1lcIixcbiAgXCJCT0dJRVwiLFxuICBcIkJPR1VTXCIsXG4gIFwiQk9JTFNcIixcbiAgXCJCT0xBU1wiLFxuICBcIkJPTExTXCIsXG4gIFwiQk9MT1NcIixcbiAgXCJCT0xUU1wiLFxuICBcIkJPTUJFXCIsXG4gIFwiQk9NQlNcIixcbiAgXCJCT05EU1wiLFxuICBcIkJPTkVEXCIsXG4gIFwiQk9ORVJcIixcbiAgXCJCT05FU1wiLFxuICBcIkJPTkdPXCIsXG4gIFwiQk9OR1NcIixcbiAgXCJCT05LU1wiLFxuICBcIkJPTk5FXCIsXG4gIFwiQk9OTllcIixcbiAgXCJCT05VU1wiLFxuICBcIkJPT0JTXCIsXG4gIFwiQk9PQllcIixcbiAgXCJCT09FRFwiLFxuICBcIkJPT0tTXCIsXG4gIFwiQk9PTVNcIixcbiAgXCJCT09NWVwiLFxuICBcIkJPT05TXCIsXG4gIFwiQk9PUlNcIixcbiAgXCJCT09TVFwiLFxuICBcIkJPT1RIXCIsXG4gIFwiQk9PVFNcIixcbiAgXCJCT09UWVwiLFxuICBcIkJPT1pFXCIsXG4gIFwiQk9PWllcIixcbiAgXCJCT1JBWFwiLFxuICBcIkJPUkVEXCIsXG4gIFwiQk9SRVJcIixcbiAgXCJCT1JFU1wiLFxuICBcIkJPUklDXCIsXG4gIFwiQk9STkVcIixcbiAgXCJCT1JPTlwiLFxuICBcIkJPU0tZXCIsXG4gIFwiQk9TT01cIixcbiAgXCJCT1NPTlwiLFxuICBcIkJPU1NZXCIsXG4gIFwiQk9TVU5cIixcbiAgXCJCT1RDSFwiLFxuICBcIkJPVUdIXCIsXG4gIFwiQk9VTEVcIixcbiAgXCJCT1VORFwiLFxuICBcIkJPVVRTXCIsXG4gIFwiQk9XRURcIixcbiAgXCJCT1dFTFwiLFxuICBcIkJPV0VSXCIsXG4gIFwiQk9XSUVcIixcbiAgXCJCT1dMU1wiLFxuICBcIkJPWEVEXCIsXG4gIFwiQk9YRVJcIixcbiAgXCJCT1hFU1wiLFxuICBcIkJPWk9TXCIsXG4gIFwiQlJBQ0VcIixcbiAgXCJCUkFDS1wiLFxuICBcIkJSQUNUXCIsXG4gIFwiQlJBRFNcIixcbiAgXCJCUkFFU1wiLFxuICBcIkJSQUdTXCIsXG4gIFwiQlJBSURcIixcbiAgXCJCUkFJTlwiLFxuICBcIkJSQUtFXCIsXG4gIFwiQlJBTkRcIixcbiAgXCJCUkFOVFwiLFxuICBcIkJSQVNIXCIsXG4gIFwiQlJBU1NcIixcbiAgXCJCUkFUU1wiLFxuICBcIkJSQVZFXCIsXG4gIFwiQlJBVk9cIixcbiAgXCJCUkFXTFwiLFxuICBcIkJSQVdOXCIsXG4gIFwiQlJBWVNcIixcbiAgXCJCUkFaRVwiLFxuICBcIkJSRUFEXCIsXG4gIFwiQlJFQUtcIixcbiAgXCJCUkVBTVwiLFxuICBcIkJSRUVEXCIsXG4gIFwiQlJFVkVcIixcbiAgXCJCUkVXU1wiLFxuICBcIkJSSUFSXCIsXG4gIFwiQlJJQkVcIixcbiAgXCJCUklDS1wiLFxuICBcIkJSSURFXCIsXG4gIFwiQlJJRUZcIixcbiAgXCJCUklFUlwiLFxuICBcIkJSSUdTXCIsXG4gIFwiQlJJTVNcIixcbiAgXCJCUklORVwiLFxuICBcIkJSSU5HXCIsXG4gIFwiQlJJTktcIixcbiAgXCJCUklOWVwiLFxuICBcIkJSSVNLXCIsXG4gIFwiQlJPQURcIixcbiAgXCJCUk9JTFwiLFxuICBcIkJST0tFXCIsXG4gIFwiQlJPTU9cIixcbiAgXCJCUk9OQ1wiLFxuICBcIkJST09EXCIsXG4gIFwiQlJPT0tcIixcbiAgXCJCUk9PTVwiLFxuICBcIkJST1RIXCIsXG4gIFwiQlJPV05cIixcbiAgXCJCUk9XU1wiLFxuICBcIkJSVUlOXCIsXG4gIFwiQlJVSVRcIixcbiAgXCJCUlVOVFwiLFxuICBcIkJSVVNIXCIsXG4gIFwiQlJVVEVcIixcbiAgXCJCVUJCQVwiLFxuICBcIkJVQ0tTXCIsXG4gIFwiQlVERFlcIixcbiAgXCJCVURHRVwiLFxuICBcIkJVRkZPXCIsXG4gIFwiQlVGRlNcIixcbiAgXCJCVUdHWVwiLFxuICBcIkJVR0xFXCIsXG4gIFwiQlVJTERcIixcbiAgXCJCVUlMVFwiLFxuICBcIkJVTEJTXCIsXG4gIFwiQlVMR0VcIixcbiAgXCJCVUxHWVwiLFxuICBcIkJVTEtTXCIsXG4gIFwiQlVMS1lcIixcbiAgXCJCVUxMU1wiLFxuICBcIkJVTExZXCIsXG4gIFwiQlVNUEhcIixcbiAgXCJCVU1QU1wiLFxuICBcIkJVTVBZXCIsXG4gIFwiQlVOQ0hcIixcbiAgXCJCVU5DT1wiLFxuICBcIkJVTkRTXCIsXG4gIFwiQlVOR1NcIixcbiAgXCJCVU5LT1wiLFxuICBcIkJVTktTXCIsXG4gIFwiQlVOTllcIixcbiAgXCJCVU5UU1wiLFxuICBcIkJVT1lTXCIsXG4gIFwiQlVSRVRcIixcbiAgXCJCVVJHU1wiLFxuICBcIkJVUkxTXCIsXG4gIFwiQlVSTFlcIixcbiAgXCJCVVJOU1wiLFxuICBcIkJVUk5UXCIsXG4gIFwiQlVSUFNcIixcbiAgXCJCVVJST1wiLFxuICBcIkJVUlJTXCIsXG4gIFwiQlVSU1RcIixcbiAgXCJCVVNCWVwiLFxuICBcIkJVU0VEXCIsXG4gIFwiQlVTRVNcIixcbiAgXCJCVVNIWVwiLFxuICBcIkJVU0tTXCIsXG4gIFwiQlVTVFNcIixcbiAgXCJCVVNUWVwiLFxuICBcIkJVVENIXCIsXG4gIFwiQlVUVEVcIixcbiAgXCJCVVRUU1wiLFxuICBcIkJVVFlMXCIsXG4gIFwiQlVYT01cIixcbiAgXCJCVVlFUlwiLFxuICBcIkJVWlpZXCIsXG4gIFwiQldBTkFcIixcbiAgXCJCWUxBV1wiLFxuICBcIkJZUkVTXCIsXG4gIFwiQllURVNcIixcbiAgXCJCWVdBWVwiLFxuICBcIkNBQkFMXCIsXG4gIFwiQ0FCQllcIixcbiAgXCJDQUJJTlwiLFxuICBcIkNBQkxFXCIsXG4gIFwiQ0FDQU9cIixcbiAgXCJDQUNIRVwiLFxuICBcIkNBQ1RJXCIsXG4gIFwiQ0FERFlcIixcbiAgXCJDQURFVFwiLFxuICBcIkNBREdFXCIsXG4gIFwiQ0FEUkVcIixcbiAgXCJDQUZFU1wiLFxuICBcIkNBR0VEXCIsXG4gIFwiQ0FHRVNcIixcbiAgXCJDQUdFWVwiLFxuICBcIkNBSVJOXCIsXG4gIFwiQ0FLRURcIixcbiAgXCJDQUtFU1wiLFxuICBcIkNBTElYXCIsXG4gIFwiQ0FMS1NcIixcbiAgXCJDQUxMQVwiLFxuICBcIkNBTExTXCIsXG4gIFwiQ0FMTVNcIixcbiAgXCJDQUxWRVwiLFxuICBcIkNBTFlYXCIsXG4gIFwiQ0FNRUxcIixcbiAgXCJDQU1FT1wiLFxuICBcIkNBTVBPXCIsXG4gIFwiQ0FNUFNcIixcbiAgXCJDQU1QWVwiLFxuICBcIkNBTkFMXCIsXG4gIFwiQ0FORFlcIixcbiAgXCJDQU5FRFwiLFxuICBcIkNBTkVTXCIsXG4gIFwiQ0FOTkFcIixcbiAgXCJDQU5OWVwiLFxuICBcIkNBTk9FXCIsXG4gIFwiQ0FOT05cIixcbiAgXCJDQU5TVFwiLFxuICBcIkNBTlRPXCIsXG4gIFwiQ0FOVFNcIixcbiAgXCJDQVBFRFwiLFxuICBcIkNBUEVSXCIsXG4gIFwiQ0FQRVNcIixcbiAgXCJDQVBPTlwiLFxuICBcIkNBUE9TXCIsXG4gIFwiQ0FSQVRcIixcbiAgXCJDQVJEU1wiLFxuICBcIkNBUkVEXCIsXG4gIFwiQ0FSRVJcIixcbiAgXCJDQVJFU1wiLFxuICBcIkNBUkVUXCIsXG4gIFwiQ0FSR09cIixcbiAgXCJDQVJOWVwiLFxuICBcIkNBUk9CXCIsXG4gIFwiQ0FST0xcIixcbiAgXCJDQVJPTVwiLFxuICBcIkNBUlBTXCIsXG4gIFwiQ0FSUllcIixcbiAgXCJDQVJURVwiLFxuICBcIkNBUlRTXCIsXG4gIFwiQ0FSVkVcIixcbiAgXCJDQVNBU1wiLFxuICBcIkNBU0VEXCIsXG4gIFwiQ0FTRVNcIixcbiAgXCJDQVNLU1wiLFxuICBcIkNBU1RFXCIsXG4gIFwiQ0FTVFNcIixcbiAgXCJDQVRDSFwiLFxuICBcIkNBVEVSXCIsXG4gIFwiQ0FUVFlcIixcbiAgXCJDQVVMS1wiLFxuICBcIkNBVUxTXCIsXG4gIFwiQ0FVU0VcIixcbiAgXCJDQVZFRFwiLFxuICBcIkNBVkVTXCIsXG4gIFwiQ0FWSUxcIixcbiAgXCJDQVdFRFwiLFxuICBcIkNFQVNFXCIsXG4gIFwiQ0VEQVJcIixcbiAgXCJDRURFRFwiLFxuICBcIkNFREVTXCIsXG4gIFwiQ0VJTFNcIixcbiAgXCJDRUxFQlwiLFxuICBcIkNFTExPXCIsXG4gIFwiQ0VMTFNcIixcbiAgXCJDRU5UT1wiLFxuICBcIkNFTlRTXCIsXG4gIFwiQ0hBRkVcIixcbiAgXCJDSEFGRlwiLFxuICBcIkNIQUlOXCIsXG4gIFwiQ0hBSVJcIixcbiAgXCJDSEFMS1wiLFxuICBcIkNIQU1QXCIsXG4gIFwiQ0hBTlRcIixcbiAgXCJDSEFPU1wiLFxuICBcIkNIQVBTXCIsXG4gIFwiQ0hBUkRcIixcbiAgXCJDSEFSTVwiLFxuICBcIkNIQVJTXCIsXG4gIFwiQ0hBUlRcIixcbiAgXCJDSEFSWVwiLFxuICBcIkNIQVNFXCIsXG4gIFwiQ0hBU01cIixcbiAgXCJDSEFUU1wiLFxuICBcIkNIQVdTXCIsXG4gIFwiQ0hFQVBcIixcbiAgXCJDSEVBVFwiLFxuICBcIkNIRUNLXCIsXG4gIFwiQ0hFRUtcIixcbiAgXCJDSEVFUFwiLFxuICBcIkNIRUVSXCIsXG4gIFwiQ0hFRlNcIixcbiAgXCJDSEVSVFwiLFxuICBcIkNIRVNTXCIsXG4gIFwiQ0hFU1RcIixcbiAgXCJDSEVXU1wiLFxuICBcIkNIRVdZXCIsXG4gIFwiQ0hJQ0tcIixcbiAgXCJDSElERVwiLFxuICBcIkNISUVGXCIsXG4gIFwiQ0hJTERcIixcbiAgXCJDSElMRVwiLFxuICBcIkNISUxJXCIsXG4gIFwiQ0hJTExcIixcbiAgXCJDSElNRVwiLFxuICBcIkNISU1QXCIsXG4gIFwiQ0hJTkFcIixcbiAgXCJDSElORVwiLFxuICBcIkNISU5LXCIsXG4gIFwiQ0hJTk9cIixcbiAgXCJDSElOU1wiLFxuICBcIkNISVBTXCIsXG4gIFwiQ0hJUlBcIixcbiAgXCJDSElUU1wiLFxuICBcIkNISVZFXCIsXG4gIFwiQ0hPQ0tcIixcbiAgXCJDSE9JUlwiLFxuICBcIkNIT0tFXCIsXG4gIFwiQ0hPTVBcIixcbiAgXCJDSE9QU1wiLFxuICBcIkNIT1JEXCIsXG4gIFwiQ0hPUkVcIixcbiAgXCJDSE9TRVwiLFxuICBcIkNIT1dTXCIsXG4gIFwiQ0hVQ0tcIixcbiAgXCJDSFVGRlwiLFxuICBcIkNIVUdTXCIsXG4gIFwiQ0hVTVBcIixcbiAgXCJDSFVNU1wiLFxuICBcIkNIVU5LXCIsXG4gIFwiQ0hVUkxcIixcbiAgXCJDSFVSTlwiLFxuICBcIkNIVVRFXCIsXG4gIFwiQ0lERVJcIixcbiAgXCJDSUdBUlwiLFxuICBcIkNJTElBXCIsXG4gIFwiQ0lMTFNcIixcbiAgXCJDSU5DSFwiLFxuICBcIkNJUkNBXCIsXG4gIFwiQ0lSUklcIixcbiAgXCJDSVRFRFwiLFxuICBcIkNJVEVTXCIsXG4gIFwiQ0lWRVRcIixcbiAgXCJDSVZJQ1wiLFxuICBcIkNJVklMXCIsXG4gIFwiQ0lWVllcIixcbiAgXCJDTEFDS1wiLFxuICBcIkNMQURTXCIsXG4gIFwiQ0xBSU1cIixcbiAgXCJDTEFNUFwiLFxuICBcIkNMQU1TXCIsXG4gIFwiQ0xBTkdcIixcbiAgXCJDTEFOS1wiLFxuICBcIkNMQU5TXCIsXG4gIFwiQ0xBUFNcIixcbiAgXCJDTEFTSFwiLFxuICBcIkNMQVNQXCIsXG4gIFwiQ0xBU1NcIixcbiAgXCJDTEFWRVwiLFxuICBcIkNMQVdTXCIsXG4gIFwiQ0xBWVNcIixcbiAgXCJDTEVBTlwiLFxuICBcIkNMRUFSXCIsXG4gIFwiQ0xFQVRcIixcbiAgXCJDTEVGU1wiLFxuICBcIkNMRUZUXCIsXG4gIFwiQ0xFUktcIixcbiAgXCJDTEVXU1wiLFxuICBcIkNMSUNLXCIsXG4gIFwiQ0xJRkZcIixcbiAgXCJDTElNQlwiLFxuICBcIkNMSU1FXCIsXG4gIFwiQ0xJTkdcIixcbiAgXCJDTElOS1wiLFxuICBcIkNMSVBTXCIsXG4gIFwiQ0xPQUtcIixcbiAgXCJDTE9DS1wiLFxuICBcIkNMT0RTXCIsXG4gIFwiQ0xPR1NcIixcbiAgXCJDTE9NUFwiLFxuICBcIkNMT05FXCIsXG4gIFwiQ0xPUFNcIixcbiAgXCJDTE9TRVwiLFxuICBcIkNMT1RIXCIsXG4gIFwiQ0xPVFNcIixcbiAgXCJDTE9VRFwiLFxuICBcIkNMT1VUXCIsXG4gIFwiQ0xPVkVcIixcbiAgXCJDTE9XTlwiLFxuICBcIkNMT1lTXCIsXG4gIFwiQ0xVQlNcIixcbiAgXCJDTFVDS1wiLFxuICBcIkNMVUVEXCIsXG4gIFwiQ0xVRVNcIixcbiAgXCJDTFVNUFwiLFxuICBcIkNMVU5HXCIsXG4gIFwiQ0xVTktcIixcbiAgXCJDT0FDSFwiLFxuICBcIkNPQUxTXCIsXG4gIFwiQ09BU1RcIixcbiAgXCJDT0FUSVwiLFxuICBcIkNPQVRTXCIsXG4gIFwiQ09CUkFcIixcbiAgXCJDT0NBU1wiLFxuICBcIkNPQ0NJXCIsXG4gIFwiQ09DS1NcIixcbiAgXCJDT0NLWVwiLFxuICBcIkNPQ09BXCIsXG4gIFwiQ09DT1NcIixcbiAgXCJDT0RBU1wiLFxuICBcIkNPREVEXCIsXG4gIFwiQ09ERVJcIixcbiAgXCJDT0RFU1wiLFxuICBcIkNPREVYXCIsXG4gIFwiQ09ET05cIixcbiAgXCJDT0VEU1wiLFxuICBcIkNPSE9TXCIsXG4gIFwiQ09JRlNcIixcbiAgXCJDT0lMU1wiLFxuICBcIkNPSU5TXCIsXG4gIFwiQ09LRURcIixcbiAgXCJDT0tFU1wiLFxuICBcIkNPTEFTXCIsXG4gIFwiQ09MRFNcIixcbiAgXCJDT0xJQ1wiLFxuICBcIkNPTE9OXCIsXG4gIFwiQ09MT1JcIixcbiAgXCJDT0xUU1wiLFxuICBcIkNPTUFTXCIsXG4gIFwiQ09NQk9cIixcbiAgXCJDT01CU1wiLFxuICBcIkNPTUVSXCIsXG4gIFwiQ09NRVNcIixcbiAgXCJDT01FVFwiLFxuICBcIkNPTUZZXCIsXG4gIFwiQ09NSUNcIixcbiAgXCJDT01NQVwiLFxuICBcIkNPTVBTXCIsXG4gIFwiQ09OQ0hcIixcbiAgXCJDT05ET1wiLFxuICBcIkNPTkVEXCIsXG4gIFwiQ09ORVNcIixcbiAgXCJDT05FWVwiLFxuICBcIkNPTkdBXCIsXG4gIFwiQ09OSUNcIixcbiAgXCJDT05LU1wiLFxuICBcIkNPT0NIXCIsXG4gIFwiQ09PRURcIixcbiAgXCJDT09LU1wiLFxuICBcIkNPT0xTXCIsXG4gIFwiQ09PTlNcIixcbiAgXCJDT09QU1wiLFxuICBcIkNPT1RTXCIsXG4gIFwiQ09QRURcIixcbiAgXCJDT1BFUlwiLFxuICBcIkNPUEVTXCIsXG4gIFwiQ09QUkFcIixcbiAgXCJDT1BTRVwiLFxuICBcIkNPUkFMXCIsXG4gIFwiQ09SRFNcIixcbiAgXCJDT1JFRFwiLFxuICBcIkNPUkVTXCIsXG4gIFwiQ09SR0lcIixcbiAgXCJDT1JLU1wiLFxuICBcIkNPUktZXCIsXG4gIFwiQ09STVNcIixcbiAgXCJDT1JOU1wiLFxuICBcIkNPUk5VXCIsXG4gIFwiQ09STllcIixcbiAgXCJDT1JQU1wiLFxuICBcIkNPU0VUXCIsXG4gIFwiQ09TVEFcIixcbiAgXCJDT1NUU1wiLFxuICBcIkNPVEVTXCIsXG4gIFwiQ09UVEFcIixcbiAgXCJDT1VDSFwiLFxuICBcIkNPVUdIXCIsXG4gIFwiQ09VTERcIixcbiAgXCJDT1VOVFwiLFxuICBcIkNPVVBFXCIsXG4gIFwiQ09VUFNcIixcbiAgXCJDT1VSVFwiLFxuICBcIkNPVVRIXCIsXG4gIFwiQ09WRU5cIixcbiAgXCJDT1ZFUlwiLFxuICBcIkNPVkVTXCIsXG4gIFwiQ09WRVRcIixcbiAgXCJDT1ZFWVwiLFxuICBcIkNPV0VEXCIsXG4gIFwiQ09XRVJcIixcbiAgXCJDT1dMU1wiLFxuICBcIkNPV1JZXCIsXG4gIFwiQ09YRURcIixcbiAgXCJDT1hFU1wiLFxuICBcIkNPWUVSXCIsXG4gIFwiQ09ZTFlcIixcbiAgXCJDT1lQVVwiLFxuICBcIkNPWkVOXCIsXG4gIFwiQ1JBQlNcIixcbiAgXCJDUkFDS1wiLFxuICBcIkNSQUZUXCIsXG4gIFwiQ1JBR1NcIixcbiAgXCJDUkFNUFwiLFxuICBcIkNSQU1TXCIsXG4gIFwiQ1JBTkVcIixcbiAgXCJDUkFOS1wiLFxuICBcIkNSQVBTXCIsXG4gIFwiQ1JBU0hcIixcbiAgXCJDUkFTU1wiLFxuICBcIkNSQVRFXCIsXG4gIFwiQ1JBVkVcIixcbiAgXCJDUkFXTFwiLFxuICBcIkNSQVdTXCIsXG4gIFwiQ1JBWkVcIixcbiAgXCJDUkFaWVwiLFxuICBcIkNSRUFLXCIsXG4gIFwiQ1JFQU1cIixcbiAgXCJDUkVET1wiLFxuICBcIkNSRUVEXCIsXG4gIFwiQ1JFRUtcIixcbiAgXCJDUkVFTFwiLFxuICBcIkNSRUVQXCIsXG4gIFwiQ1JFTUVcIixcbiAgXCJDUkVQRVwiLFxuICBcIkNSRVBUXCIsXG4gIFwiQ1JFU1NcIixcbiAgXCJDUkVTVFwiLFxuICBcIkNSRVdTXCIsXG4gIFwiQ1JJQlNcIixcbiAgXCJDUklDS1wiLFxuICBcIkNSSUVEXCIsXG4gIFwiQ1JJRVJcIixcbiAgXCJDUklFU1wiLFxuICBcIkNSSU1FXCIsXG4gIFwiQ1JJTVBcIixcbiAgXCJDUklTUFwiLFxuICBcIkNSSVRTXCIsXG4gIFwiQ1JPQUtcIixcbiAgXCJDUk9DS1wiLFxuICBcIkNST0NTXCIsXG4gIFwiQ1JPRlRcIixcbiAgXCJDUk9ORVwiLFxuICBcIkNST05ZXCIsXG4gIFwiQ1JPT0tcIixcbiAgXCJDUk9PTlwiLFxuICBcIkNST1BTXCIsXG4gIFwiQ1JPU1NcIixcbiAgXCJDUk9VUFwiLFxuICBcIkNST1dEXCIsXG4gIFwiQ1JPV05cIixcbiAgXCJDUk9XU1wiLFxuICBcIkNSVURFXCIsXG4gIFwiQ1JVRFNcIixcbiAgXCJDUlVFTFwiLFxuICBcIkNSVUVUXCIsXG4gIFwiQ1JVRlRcIixcbiAgXCJDUlVNQlwiLFxuICBcIkNSVU1QXCIsXG4gIFwiQ1JVU0VcIixcbiAgXCJDUlVTSFwiLFxuICBcIkNSVVNUXCIsXG4gIFwiQ1JZUFRcIixcbiAgXCJDVUJCWVwiLFxuICBcIkNVQkVEXCIsXG4gIFwiQ1VCRVNcIixcbiAgXCJDVUJJQ1wiLFxuICBcIkNVQklUXCIsXG4gIFwiQ1VGRlNcIixcbiAgXCJDVUtFU1wiLFxuICBcIkNVTExTXCIsXG4gIFwiQ1VMUEFcIixcbiAgXCJDVUxUU1wiLFxuICBcIkNVTUlOXCIsXG4gIFwiQ1VOVFNcIixcbiAgXCJDVVBQQVwiLFxuICBcIkNVUFBZXCIsXG4gIFwiQ1VSQlNcIixcbiAgXCJDVVJEU1wiLFxuICBcIkNVUkVEXCIsXG4gIFwiQ1VSRVNcIixcbiAgXCJDVVJJRVwiLFxuICBcIkNVUklPXCIsXG4gIFwiQ1VSTFNcIixcbiAgXCJDVVJMWVwiLFxuICBcIkNVUlJZXCIsXG4gIFwiQ1VSU0VcIixcbiAgXCJDVVJWRVwiLFxuICBcIkNVUlZZXCIsXG4gIFwiQ1VTSFlcIixcbiAgXCJDVVNQU1wiLFxuICBcIkNVVEVSXCIsXG4gIFwiQ1VUSUVcIixcbiAgXCJDVVRVUFwiLFxuICBcIkNZQ0FEXCIsXG4gIFwiQ1lDTEVcIixcbiAgXCJDWU5JQ1wiLFxuICBcIkNZU1RTXCIsXG4gIFwiQ1pBUlNcIixcbiAgXCJEQUNIQVwiLFxuICBcIkRBRERZXCIsXG4gIFwiREFET1NcIixcbiAgXCJEQUZGWVwiLFxuICBcIkRBSUxZXCIsXG4gIFwiREFJUllcIixcbiAgXCJEQUlTWVwiLFxuICBcIkRBTEVTXCIsXG4gIFwiREFMTFlcIixcbiAgXCJEQU1FU1wiLFxuICBcIkRBTU5TXCIsXG4gIFwiREFNUFNcIixcbiAgXCJEQU5DRVwiLFxuICBcIkRBTkRZXCIsXG4gIFwiREFSRURcIixcbiAgXCJEQVJFU1wiLFxuICBcIkRBUktTXCIsXG4gIFwiREFSS1lcIixcbiAgXCJEQVJOU1wiLFxuICBcIkRBUlRTXCIsXG4gIFwiREFURURcIixcbiAgXCJEQVRFUlwiLFxuICBcIkRBVEVTXCIsXG4gIFwiREFUVU1cIixcbiAgXCJEQVVCU1wiLFxuICBcIkRBVU5UXCIsXG4gIFwiREFWSVRcIixcbiAgXCJEQVdOU1wiLFxuICBcIkRBWkVEXCIsXG4gIFwiREFaRVNcIixcbiAgXCJERUFMU1wiLFxuICBcIkRFQUxUXCIsXG4gIFwiREVBTlNcIixcbiAgXCJERUFSU1wiLFxuICBcIkRFQVRIXCIsXG4gIFwiREVCQVJcIixcbiAgXCJERUJJVFwiLFxuICBcIkRFQlRTXCIsXG4gIFwiREVCVUdcIixcbiAgXCJERUJVVFwiLFxuICBcIkRFQ0FGXCIsXG4gIFwiREVDQUxcIixcbiAgXCJERUNBWVwiLFxuICBcIkRFQ0tTXCIsXG4gIFwiREVDT1JcIixcbiAgXCJERUNPWVwiLFxuICBcIkRFQ1JZXCIsXG4gIFwiREVFRFNcIixcbiAgXCJERUVNU1wiLFxuICBcIkRFRVBTXCIsXG4gIFwiREVGRVJcIixcbiAgXCJERUdBU1wiLFxuICBcIkRFSUZZXCIsXG4gIFwiREVJR05cIixcbiAgXCJERUlTTVwiLFxuICBcIkRFSVRZXCIsXG4gIFwiREVMQVlcIixcbiAgXCJERUxGVFwiLFxuICBcIkRFTElTXCIsXG4gIFwiREVMTFNcIixcbiAgXCJERUxUQVwiLFxuICBcIkRFTFZFXCIsXG4gIFwiREVNSVRcIixcbiAgXCJERU1PTlwiLFxuICBcIkRFTU9TXCIsXG4gIFwiREVNVVJcIixcbiAgXCJERU5JTVwiLFxuICBcIkRFTlNFXCIsXG4gIFwiREVOVFNcIixcbiAgXCJERVBPVFwiLFxuICBcIkRFUFRIXCIsXG4gIFwiREVSQllcIixcbiAgXCJERVNFWFwiLFxuICBcIkRFU0tTXCIsXG4gIFwiREVURVJcIixcbiAgXCJERVVDRVwiLFxuICBcIkRFVklMXCIsXG4gIFwiREVXRURcIixcbiAgXCJESE9XU1wiLFxuICBcIkRJQUxTXCIsXG4gIFwiRElBUllcIixcbiAgXCJESUFaT1wiLFxuICBcIkRJQ0VEXCIsXG4gIFwiRElDRVNcIixcbiAgXCJESUNFWVwiLFxuICBcIkRJQ0tTXCIsXG4gIFwiRElDS1lcIixcbiAgXCJESUNPVFwiLFxuICBcIkRJQ1RBXCIsXG4gIFwiRElERFlcIixcbiAgXCJESURPU1wiLFxuICBcIkRJRFNUXCIsXG4gIFwiRElFVFNcIixcbiAgXCJESUdJVFwiLFxuICBcIkRJS0VEXCIsXG4gIFwiRElLRVNcIixcbiAgXCJESUxET1wiLFxuICBcIkRJTExTXCIsXG4gIFwiRElMTFlcIixcbiAgXCJESU1FUlwiLFxuICBcIkRJTUVTXCIsXG4gIFwiRElNTFlcIixcbiAgXCJESU5BUlwiLFxuICBcIkRJTkVEXCIsXG4gIFwiRElORVJcIixcbiAgXCJESU5FU1wiLFxuICBcIkRJTkdPXCIsXG4gIFwiRElOR1NcIixcbiAgXCJESU5HWVwiLFxuICBcIkRJTktTXCIsXG4gIFwiRElOS1lcIixcbiAgXCJESU5UU1wiLFxuICBcIkRJT0RFXCIsXG4gIFwiRElQUFlcIixcbiAgXCJESVBTT1wiLFxuICBcIkRJUkVSXCIsXG4gIFwiRElSR0VcIixcbiAgXCJESVJLU1wiLFxuICBcIkRJUlRZXCIsXG4gIFwiRElTQ09cIixcbiAgXCJESVNDU1wiLFxuICBcIkRJU0hZXCIsXG4gIFwiRElTS1NcIixcbiAgXCJESVRDSFwiLFxuICBcIkRJVFRPXCIsXG4gIFwiRElUVFlcIixcbiAgXCJESVZBTlwiLFxuICBcIkRJVkFTXCIsXG4gIFwiRElWRURcIixcbiAgXCJESVZFUlwiLFxuICBcIkRJVkVTXCIsXG4gIFwiRElWT1RcIixcbiAgXCJESVZWWVwiLFxuICBcIkRJWlpZXCIsXG4gIFwiREpJTk5cIixcbiAgXCJET0NLU1wiLFxuICBcIkRPREdFXCIsXG4gIFwiRE9ER1lcIixcbiAgXCJET0RPU1wiLFxuICBcIkRPRVJTXCIsXG4gIFwiRE9FU1RcIixcbiAgXCJET0VUSFwiLFxuICBcIkRPRkZTXCIsXG4gIFwiRE9HRVNcIixcbiAgXCJET0dHT1wiLFxuICBcIkRPR0dZXCIsXG4gIFwiRE9HSUVcIixcbiAgXCJET0dNQVwiLFxuICBcIkRPSUxZXCIsXG4gIFwiRE9JTkdcIixcbiAgXCJET0xDRVwiLFxuICBcIkRPTEVEXCIsXG4gIFwiRE9MRVNcIixcbiAgXCJET0xMU1wiLFxuICBcIkRPTExZXCIsXG4gIFwiRE9MT1JcIixcbiAgXCJET0xUU1wiLFxuICBcIkRPTUVEXCIsXG4gIFwiRE9NRVNcIixcbiAgXCJET05FRVwiLFxuICBcIkRPTk5BXCIsXG4gIFwiRE9OT1JcIixcbiAgXCJET05VVFwiLFxuICBcIkRPT01TXCIsXG4gIFwiRE9PUlNcIixcbiAgXCJET09aWVwiLFxuICBcIkRPUEVEXCIsXG4gIFwiRE9QRVNcIixcbiAgXCJET1BFWVwiLFxuICBcIkRPUktTXCIsXG4gIFwiRE9SS1lcIixcbiAgXCJET1JNU1wiLFxuICBcIkRPVEVEXCIsXG4gIFwiRE9URVNcIixcbiAgXCJET1RUWVwiLFxuICBcIkRPVUJUXCIsXG4gIFwiRE9VR0hcIixcbiAgXCJET1VTRVwiLFxuICBcIkRPVkVTXCIsXG4gIFwiRE9XRFlcIixcbiAgXCJET1dFTFwiLFxuICBcIkRPV0VSXCIsXG4gIFwiRE9XTlNcIixcbiAgXCJET1dOWVwiLFxuICBcIkRPV1JZXCIsXG4gIFwiRE9XU0VcIixcbiAgXCJET1lFTlwiLFxuICBcIkRPWkVEXCIsXG4gIFwiRE9aRU5cIixcbiAgXCJET1pFUlwiLFxuICBcIkRPWkVTXCIsXG4gIFwiRFJBRlRcIixcbiAgXCJEUkFHU1wiLFxuICBcIkRSQUlOXCIsXG4gIFwiRFJBS0VcIixcbiAgXCJEUkFNQVwiLFxuICBcIkRSQU1TXCIsXG4gIFwiRFJBTktcIixcbiAgXCJEUkFQRVwiLFxuICBcIkRSQVdMXCIsXG4gIFwiRFJBV05cIixcbiAgXCJEUkFXU1wiLFxuICBcIkRSQVlTXCIsXG4gIFwiRFJFQURcIixcbiAgXCJEUkVBTVwiLFxuICBcIkRSRUFSXCIsXG4gIFwiRFJFQ0tcIixcbiAgXCJEUkVHU1wiLFxuICBcIkRSRVNTXCIsXG4gIFwiRFJJRURcIixcbiAgXCJEUklFUlwiLFxuICBcIkRSSUVTXCIsXG4gIFwiRFJJRlRcIixcbiAgXCJEUklMTFwiLFxuICBcIkRSSUxZXCIsXG4gIFwiRFJJTktcIixcbiAgXCJEUklQU1wiLFxuICBcIkRSSVZFXCIsXG4gIFwiRFJPSURcIixcbiAgXCJEUk9MTFwiLFxuICBcIkRST05FXCIsXG4gIFwiRFJPT0xcIixcbiAgXCJEUk9PUFwiLFxuICBcIkRST1BTXCIsXG4gIFwiRFJPU1NcIixcbiAgXCJEUk9WRVwiLFxuICBcIkRST1dOXCIsXG4gIFwiRFJVQlNcIixcbiAgXCJEUlVHU1wiLFxuICBcIkRSVUlEXCIsXG4gIFwiRFJVTVNcIixcbiAgXCJEUlVOS1wiLFxuICBcIkRSWUFEXCIsXG4gIFwiRFJZRVJcIixcbiAgXCJEUllMWVwiLFxuICBcIkRVQUxTXCIsXG4gIFwiRFVDQUxcIixcbiAgXCJEVUNBVFwiLFxuICBcIkRVQ0VTXCIsXG4gIFwiRFVDSFlcIixcbiAgXCJEVUNLU1wiLFxuICBcIkRVQ0tZXCIsXG4gIFwiRFVDVFNcIixcbiAgXCJEVURFU1wiLFxuICBcIkRVRUxTXCIsXG4gIFwiRFVFVFNcIixcbiAgXCJEVUZGU1wiLFxuICBcIkRVS0VTXCIsXG4gIFwiRFVMTFNcIixcbiAgXCJEVUxMWVwiLFxuICBcIkRVTFNFXCIsXG4gIFwiRFVNTVlcIixcbiAgXCJEVU1QU1wiLFxuICBcIkRVTVBZXCIsXG4gIFwiRFVOQ0VcIixcbiAgXCJEVU5FU1wiLFxuICBcIkRVTkdTXCIsXG4gIFwiRFVOTk9cIixcbiAgXCJEVU9NT1wiLFxuICBcIkRVUEVEXCIsXG4gIFwiRFVQRVJcIixcbiAgXCJEVVBFU1wiLFxuICBcIkRVUExFXCIsXG4gIFwiRFVSU1RcIixcbiAgXCJEVVNLU1wiLFxuICBcIkRVU0tZXCIsXG4gIFwiRFVTVFNcIixcbiAgXCJEVVNUWVwiLFxuICBcIkRVVENIXCIsXG4gIFwiRFVWRVRcIixcbiAgXCJEV0FSRlwiLFxuICBcIkRXRUVCXCIsXG4gIFwiRFdFTExcIixcbiAgXCJEV0VMVFwiLFxuICBcIkRZQURTXCIsXG4gIFwiRFlFUlNcIixcbiAgXCJEWUlOR1wiLFxuICBcIkRZS0VTXCIsXG4gIFwiRFlORVNcIixcbiAgXCJFQUdFUlwiLFxuICBcIkVBR0xFXCIsXG4gIFwiRUFSTFNcIixcbiAgXCJFQVJMWVwiLFxuICBcIkVBUk5TXCIsXG4gIFwiRUFSVEhcIixcbiAgXCJFQVNFRFwiLFxuICBcIkVBU0VMXCIsXG4gIFwiRUFTRVNcIixcbiAgXCJFQVRFTlwiLFxuICBcIkVBVEVSXCIsXG4gIFwiRUFWRVNcIixcbiAgXCJFQkJFRFwiLFxuICBcIkVCT05ZXCIsXG4gIFwiRUNMQVRcIixcbiAgXCJFREVNQVwiLFxuICBcIkVER0VEXCIsXG4gIFwiRURHRVNcIixcbiAgXCJFRElDVFwiLFxuICBcIkVESUZZXCIsXG4gIFwiRURJVFNcIixcbiAgXCJFRFVDRVwiLFxuICBcIkVFUklFXCIsXG4gIFwiRUdBRFNcIixcbiAgXCJFR0dFRFwiLFxuICBcIkVHR0VSXCIsXG4gIFwiRUdSRVRcIixcbiAgXCJFSURFUlwiLFxuICBcIkVJR0hUXCIsXG4gIFwiRUpFQ1RcIixcbiAgXCJFS0lOR1wiLFxuICBcIkVMQU5EXCIsXG4gIFwiRUxBVEVcIixcbiAgXCJFTEJPV1wiLFxuICBcIkVMREVSXCIsXG4gIFwiRUxFQ1RcIixcbiAgXCJFTEVHWVwiLFxuICBcIkVMRklOXCIsXG4gIFwiRUxJREVcIixcbiAgXCJFTElURVwiLFxuICBcIkVMT1BFXCIsXG4gIFwiRUxVREVcIixcbiAgXCJFTFZFU1wiLFxuICBcIkVNQUlMXCIsXG4gIFwiRU1CRURcIixcbiAgXCJFTUJFUlwiLFxuICBcIkVNQ0VFXCIsXG4gIFwiRU1FTkRcIixcbiAgXCJFTUVSWVwiLFxuICBcIkVNSVJTXCIsXG4gIFwiRU1JVFNcIixcbiAgXCJFTU9URVwiLFxuICBcIkVNUFRZXCIsXG4gIFwiRU5BQ1RcIixcbiAgXCJFTkRFRFwiLFxuICBcIkVORE9XXCIsXG4gIFwiRU5EVUVcIixcbiAgXCJFTkVNQVwiLFxuICBcIkVORU1ZXCIsXG4gIFwiRU5KT1lcIixcbiAgXCJFTk5VSVwiLFxuICBcIkVOUk9MXCIsXG4gIFwiRU5TVUVcIixcbiAgXCJFTlRFUlwiLFxuICBcIkVOVFJZXCIsXG4gIFwiRU5WT0lcIixcbiAgXCJFTlZPWVwiLFxuICBcIkVQQUNUXCIsXG4gIFwiRVBFRVNcIixcbiAgXCJFUEhBSFwiLFxuICBcIkVQSE9EXCIsXG4gIFwiRVBJQ1NcIixcbiAgXCJFUE9DSFwiLFxuICBcIkVQT1hZXCIsXG4gIFwiRVFVQUxcIixcbiAgXCJFUVVJUFwiLFxuICBcIkVSQVNFXCIsXG4gIFwiRVJFQ1RcIixcbiAgXCJFUk9ERVwiLFxuICBcIkVSUkVEXCIsXG4gIFwiRVJST1JcIixcbiAgXCJFUlVDVFwiLFxuICBcIkVSVVBUXCIsXG4gIFwiRVNTQVlcIixcbiAgXCJFU1NFU1wiLFxuICBcIkVTVEVSXCIsXG4gIFwiRVNUT1BcIixcbiAgXCJFVEhFUlwiLFxuICBcIkVUSElDXCIsXG4gIFwiRVRIT1NcIixcbiAgXCJFVEhZTFwiLFxuICBcIkVUVURFXCIsXG4gIFwiRVZBREVcIixcbiAgXCJFVkVOU1wiLFxuICBcIkVWRU5UXCIsXG4gIFwiRVZJQ1RcIixcbiAgXCJFVklMU1wiLFxuICBcIkVWT0tFXCIsXG4gIFwiRVhBQ1RcIixcbiAgXCJFWEFMVFwiLFxuICBcIkVYQU1TXCIsXG4gIFwiRVhDRUxcIixcbiAgXCJFWEVBVFwiLFxuICBcIkVYRUNTXCIsXG4gIFwiRVhFUlRcIixcbiAgXCJFWElMRVwiLFxuICBcIkVYSVNUXCIsXG4gIFwiRVhJVFNcIixcbiAgXCJFWFBBVFwiLFxuICBcIkVYUEVMXCIsXG4gIFwiRVhQT1NcIixcbiAgXCJFWFRPTFwiLFxuICBcIkVYVFJBXCIsXG4gIFwiRVhVREVcIixcbiAgXCJFWFVMVFwiLFxuICBcIkVYVVJCXCIsXG4gIFwiRVlJTkdcIixcbiAgXCJFWVJJRVwiLFxuICBcIkZBQkxFXCIsXG4gIFwiRkFDRURcIixcbiAgXCJGQUNFUlwiLFxuICBcIkZBQ0VTXCIsXG4gIFwiRkFDRVRcIixcbiAgXCJGQUNUU1wiLFxuICBcIkZBRERZXCIsXG4gIFwiRkFERURcIixcbiAgXCJGQURFUlwiLFxuICBcIkZBREVTXCIsXG4gIFwiRkFFUllcIixcbiAgXCJGQUdPVFwiLFxuICBcIkZBSUxTXCIsXG4gIFwiRkFJTlRcIixcbiAgXCJGQUlSU1wiLFxuICBcIkZBSVJZXCIsXG4gIFwiRkFJVEhcIixcbiAgXCJGQUtFRFwiLFxuICBcIkZBS0VSXCIsXG4gIFwiRkFLRVNcIixcbiAgXCJGQUtJUlwiLFxuICBcIkZBTExTXCIsXG4gIFwiRkFMU0VcIixcbiAgXCJGQU1FRFwiLFxuICBcIkZBTkNZXCIsXG4gIFwiRkFOR1NcIixcbiAgXCJGQU5OWVwiLFxuICBcIkZBUkFEXCIsXG4gIFwiRkFSQ0VcIixcbiAgXCJGQVJFRFwiLFxuICBcIkZBUkVTXCIsXG4gIFwiRkFSTVNcIixcbiAgXCJGQVJUU1wiLFxuICBcIkZBU1RTXCIsXG4gIFwiRkFUQUxcIixcbiAgXCJGQVRFRFwiLFxuICBcIkZBVEVTXCIsXG4gIFwiRkFUU09cIixcbiAgXCJGQVRUWVwiLFxuICBcIkZBVFdBXCIsXG4gIFwiRkFVTFRcIixcbiAgXCJGQVVOQVwiLFxuICBcIkZBVU5TXCIsXG4gIFwiRkFWT1JcIixcbiAgXCJGQVdOU1wiLFxuICBcIkZBWEVEXCIsXG4gIFwiRkFYRVNcIixcbiAgXCJGQVpFRFwiLFxuICBcIkZBWkVTXCIsXG4gIFwiRkVBUlNcIixcbiAgXCJGRUFTVFwiLFxuICBcIkZFQVRTXCIsXG4gIFwiRkVDQUxcIixcbiAgXCJGRUNFU1wiLFxuICBcIkZFRURTXCIsXG4gIFwiRkVFTFNcIixcbiAgXCJGRUlHTlwiLFxuICBcIkZFSU5UXCIsXG4gIFwiRkVMTEFcIixcbiAgXCJGRUxMU1wiLFxuICBcIkZFTE9OXCIsXG4gIFwiRkVMVFNcIixcbiAgXCJGRU1NRVwiLFxuICBcIkZFTVVSXCIsXG4gIFwiRkVOQ0VcIixcbiAgXCJGRU5EU1wiLFxuICBcIkZFUkFMXCIsXG4gIFwiRkVSTUlcIixcbiAgXCJGRVJOU1wiLFxuICBcIkZFUlJZXCIsXG4gIFwiRkVUQUxcIixcbiAgXCJGRVRDSFwiLFxuICBcIkZFVEVEXCIsXG4gIFwiRkVURVNcIixcbiAgXCJGRVRJRFwiLFxuICBcIkZFVE9SXCIsXG4gIFwiRkVUVVNcIixcbiAgXCJGRVVEU1wiLFxuICBcIkZFVUVEXCIsXG4gIFwiRkVWRVJcIixcbiAgXCJGSUFUU1wiLFxuICBcIkZJQkVSXCIsXG4gIFwiRklCUkVcIixcbiAgXCJGSUNIRVwiLFxuICBcIkZJQ0hVXCIsXG4gIFwiRklFRlNcIixcbiAgXCJGSUVMRFwiLFxuICBcIkZJRU5EXCIsXG4gIFwiRklFUllcIixcbiAgXCJGSUZFU1wiLFxuICBcIkZJRlRIXCIsXG4gIFwiRklGVFlcIixcbiAgXCJGSUdIVFwiLFxuICBcIkZJTENIXCIsXG4gIFwiRklMRURcIixcbiAgXCJGSUxFU1wiLFxuICBcIkZJTEVUXCIsXG4gIFwiRklMTFNcIixcbiAgXCJGSUxMWVwiLFxuICBcIkZJTE1TXCIsXG4gIFwiRklMTVlcIixcbiAgXCJGSUxUSFwiLFxuICBcIkZJTkFMXCIsXG4gIFwiRklOQ0hcIixcbiAgXCJGSU5EU1wiLFxuICBcIkZJTkVEXCIsXG4gIFwiRklORVJcIixcbiAgXCJGSU5FU1wiLFxuICBcIkZJTklTXCIsXG4gIFwiRklOS1NcIixcbiAgXCJGSU5OWVwiLFxuICBcIkZJT1JEXCIsXG4gIFwiRklSRURcIixcbiAgXCJGSVJFU1wiLFxuICBcIkZJUk1TXCIsXG4gIFwiRklSU1RcIixcbiAgXCJGSVJUSFwiLFxuICBcIkZJU0hZXCIsXG4gIFwiRklTVFNcIixcbiAgXCJGSVZFUlwiLFxuICBcIkZJVkVTXCIsXG4gIFwiRklYRURcIixcbiAgXCJGSVhFUlwiLFxuICBcIkZJWEVTXCIsXG4gIFwiRklaWllcIixcbiAgXCJGSk9SRFwiLFxuICBcIkZMQUNLXCIsXG4gIFwiRkxBR1NcIixcbiAgXCJGTEFJTFwiLFxuICBcIkZMQUlSXCIsXG4gIFwiRkxBS0VcIixcbiAgXCJGTEFLWVwiLFxuICBcIkZMQU1FXCIsXG4gIFwiRkxBTVNcIixcbiAgXCJGTEFOS1wiLFxuICBcIkZMQVJFXCIsXG4gIFwiRkxBU0hcIixcbiAgXCJGTEFTS1wiLFxuICBcIkZMQVRTXCIsXG4gIFwiRkxBV1NcIixcbiAgXCJGTEFZU1wiLFxuICBcIkZMRUFTXCIsXG4gIFwiRkxFQ0tcIixcbiAgXCJGTEVFU1wiLFxuICBcIkZMRUVUXCIsXG4gIFwiRkxFU0hcIixcbiAgXCJGTElDS1wiLFxuICBcIkZMSUNTXCIsXG4gIFwiRkxJRURcIixcbiAgXCJGTElFUlwiLFxuICBcIkZMSUVTXCIsXG4gIFwiRkxJTkdcIixcbiAgXCJGTElOVFwiLFxuICBcIkZMSVBTXCIsXG4gIFwiRkxJUlRcIixcbiAgXCJGTElUU1wiLFxuICBcIkZMT0FUXCIsXG4gIFwiRkxPQ0tcIixcbiAgXCJGTE9FU1wiLFxuICBcIkZMT0dTXCIsXG4gIFwiRkxPT0RcIixcbiAgXCJGTE9PUlwiLFxuICBcIkZMT1BTXCIsXG4gIFwiRkxPUkFcIixcbiAgXCJGTE9TU1wiLFxuICBcIkZMT1VSXCIsXG4gIFwiRkxPVVRcIixcbiAgXCJGTE9XTlwiLFxuICBcIkZMT1dTXCIsXG4gIFwiRkxVQlNcIixcbiAgXCJGTFVFU1wiLFxuICBcIkZMVUZGXCIsXG4gIFwiRkxVSURcIixcbiAgXCJGTFVLRVwiLFxuICBcIkZMVUtZXCIsXG4gIFwiRkxVTUVcIixcbiAgXCJGTFVOR1wiLFxuICBcIkZMVU5LXCIsXG4gIFwiRkxVU0hcIixcbiAgXCJGTFVURVwiLFxuICBcIkZMWUJZXCIsXG4gIFwiRkxZRVJcIixcbiAgXCJGT0FMU1wiLFxuICBcIkZPQU1TXCIsXG4gIFwiRk9BTVlcIixcbiAgXCJGT0NBTFwiLFxuICBcIkZPQ1VTXCIsXG4gIFwiRk9HRVlcIixcbiAgXCJGT0dHWVwiLFxuICBcIkZPSUxTXCIsXG4gIFwiRk9JU1RcIixcbiAgXCJGT0xEU1wiLFxuICBcIkZPTElBXCIsXG4gIFwiRk9MSU9cIixcbiAgXCJGT0xLU1wiLFxuICBcIkZPTEtZXCIsXG4gIFwiRk9MTFlcIixcbiAgXCJGT05EVVwiLFxuICBcIkZPTlRTXCIsXG4gIFwiRk9PRFNcIixcbiAgXCJGT09MU1wiLFxuICBcIkZPT1RTXCIsXG4gIFwiRk9SQVlcIixcbiAgXCJGT1JDRVwiLFxuICBcIkZPUkRTXCIsXG4gIFwiRk9SR0VcIixcbiAgXCJGT1JHT1wiLFxuICBcIkZPUktTXCIsXG4gIFwiRk9STVNcIixcbiAgXCJGT1JURVwiLFxuICBcIkZPUlRIXCIsXG4gIFwiRk9SVFNcIixcbiAgXCJGT1JUWVwiLFxuICBcIkZPUlVNXCIsXG4gIFwiRk9TU0FcIixcbiAgXCJGT1NTRVwiLFxuICBcIkZPVUxTXCIsXG4gIFwiRk9VTkRcIixcbiAgXCJGT1VOVFwiLFxuICBcIkZPVVJTXCIsXG4gIFwiRk9WRUFcIixcbiAgXCJGT1dMU1wiLFxuICBcIkZPWEVEXCIsXG4gIFwiRk9YRVNcIixcbiAgXCJGT1lFUlwiLFxuICBcIkZSQUlMXCIsXG4gIFwiRlJBTUVcIixcbiAgXCJGUkFOQ1wiLFxuICBcIkZSQU5LXCIsXG4gIFwiRlJBVFNcIixcbiAgXCJGUkFVRFwiLFxuICBcIkZSQVlTXCIsXG4gIFwiRlJFQUtcIixcbiAgXCJGUkVFRFwiLFxuICBcIkZSRUVSXCIsXG4gIFwiRlJFRVNcIixcbiAgXCJGUkVTSFwiLFxuICBcIkZSRVRTXCIsXG4gIFwiRlJJQVJcIixcbiAgXCJGUklFRFwiLFxuICBcIkZSSUVSXCIsXG4gIFwiRlJJRVNcIixcbiAgXCJGUklHU1wiLFxuICBcIkZSSUxMXCIsXG4gIFwiRlJJU0tcIixcbiAgXCJGUklaWlwiLFxuICBcIkZST0NLXCIsXG4gIFwiRlJPR1NcIixcbiAgXCJGUk9ORFwiLFxuICBcIkZST05UXCIsXG4gIFwiRlJPU0hcIixcbiAgXCJGUk9TVFwiLFxuICBcIkZST1RIXCIsXG4gIFwiRlJPV05cIixcbiAgXCJGUk9aRVwiLFxuICBcIkZSVUlUXCIsXG4gIFwiRlJVTVBcIixcbiAgXCJGUllFUlwiLFxuICBcIkZVQ0tTXCIsXG4gIFwiRlVER0VcIixcbiAgXCJGVUVMU1wiLFxuICBcIkZVR0FMXCIsXG4gIFwiRlVHVUVcIixcbiAgXCJGVUxMU1wiLFxuICBcIkZVTExZXCIsXG4gIFwiRlVNRURcIixcbiAgXCJGVU1FU1wiLFxuICBcIkZVTkRTXCIsXG4gIFwiRlVOR0lcIixcbiAgXCJGVU5HT1wiLFxuICBcIkZVTktTXCIsXG4gIFwiRlVOS1lcIixcbiAgXCJGVU5OWVwiLFxuICBcIkZVUkxTXCIsXG4gIFwiRlVST1JcIixcbiAgXCJGVVJSWVwiLFxuICBcIkZVUlpFXCIsXG4gIFwiRlVTRURcIixcbiAgXCJGVVNFRVwiLFxuICBcIkZVU0VTXCIsXG4gIFwiRlVTU1lcIixcbiAgXCJGVVNUWVwiLFxuICBcIkZVVE9OXCIsXG4gIFwiRlVaRURcIixcbiAgXCJGVVpFU1wiLFxuICBcIkZVWlpZXCIsXG4gIFwiR0FCQllcIixcbiAgXCJHQUJMRVwiLFxuICBcIkdBRkZFXCIsXG4gIFwiR0FGRlNcIixcbiAgXCJHQUdFU1wiLFxuICBcIkdBSUxZXCIsXG4gIFwiR0FJTlNcIixcbiAgXCJHQUlUU1wiLFxuICBcIkdBTEFTXCIsXG4gIFwiR0FMRVNcIixcbiAgXCJHQUxMU1wiLFxuICBcIkdBTUJBXCIsXG4gIFwiR0FNRURcIixcbiAgXCJHQU1FUlwiLFxuICBcIkdBTUVTXCIsXG4gIFwiR0FNRVlcIixcbiAgXCJHQU1JTlwiLFxuICBcIkdBTU1BXCIsXG4gIFwiR0FNVVRcIixcbiAgXCJHQU5FRlwiLFxuICBcIkdBTkdTXCIsXG4gIFwiR0FPTFNcIixcbiAgXCJHQVBFRFwiLFxuICBcIkdBUEVSXCIsXG4gIFwiR0FQRVNcIixcbiAgXCJHQVJCU1wiLFxuICBcIkdBU0VTXCIsXG4gIFwiR0FTUFNcIixcbiAgXCJHQVNTWVwiLFxuICBcIkdBVEVEXCIsXG4gIFwiR0FURVNcIixcbiAgXCJHQVRPUlwiLFxuICBcIkdBVURZXCIsXG4gIFwiR0FVR0VcIixcbiAgXCJHQVVOVFwiLFxuICBcIkdBVVNTXCIsXG4gIFwiR0FVWkVcIixcbiAgXCJHQVVaWVwiLFxuICBcIkdBVkVMXCIsXG4gIFwiR0FXS1NcIixcbiAgXCJHQVdLWVwiLFxuICBcIkdBWUVSXCIsXG4gIFwiR0FaRURcIixcbiAgXCJHQVpFU1wiLFxuICBcIkdFQVJTXCIsXG4gIFwiR0VDS09cIixcbiAgXCJHRUVLU1wiLFxuICBcIkdFRVNFXCIsXG4gIFwiR0VMRFNcIixcbiAgXCJHRU5FU1wiLFxuICBcIkdFTkVUXCIsXG4gIFwiR0VOSUVcIixcbiAgXCJHRU5JSVwiLFxuICBcIkdFTlJFXCIsXG4gIFwiR0VOVFNcIixcbiAgXCJHRU5VU1wiLFxuICBcIkdFT0RFXCIsXG4gIFwiR0VPSURcIixcbiAgXCJHRVJNU1wiLFxuICBcIkdFU1NPXCIsXG4gIFwiR0VUVVBcIixcbiAgXCJHSE9TVFwiLFxuICBcIkdIT1VMXCIsXG4gIFwiR0lBTlRcIixcbiAgXCJHSUJFRFwiLFxuICBcIkdJQkVTXCIsXG4gIFwiR0lERFlcIixcbiAgXCJHSUZUU1wiLFxuICBcIkdJR1VFXCIsXG4gIFwiR0lMRFNcIixcbiAgXCJHSUxMU1wiLFxuICBcIkdJTFRTXCIsXG4gIFwiR0lNTUVcIixcbiAgXCJHSU1QU1wiLFxuICBcIkdJUFNZXCIsXG4gIFwiR0lSRFNcIixcbiAgXCJHSVJMU1wiLFxuICBcIkdJUkxZXCIsXG4gIFwiR0lST1NcIixcbiAgXCJHSVJUSFwiLFxuICBcIkdJUlRTXCIsXG4gIFwiR0lTTU9cIixcbiAgXCJHSVNUU1wiLFxuICBcIkdJVkVOXCIsXG4gIFwiR0lWRVJcIixcbiAgXCJHSVZFU1wiLFxuICBcIkdJWk1PXCIsXG4gIFwiR0xBREVcIixcbiAgXCJHTEFEU1wiLFxuICBcIkdMQU5EXCIsXG4gIFwiR0xBTlNcIixcbiAgXCJHTEFSRVwiLFxuICBcIkdMQVNTXCIsXG4gIFwiR0xBWkVcIixcbiAgXCJHTEVBTVwiLFxuICBcIkdMRUFOXCIsXG4gIFwiR0xFQkVcIixcbiAgXCJHTEVFU1wiLFxuICBcIkdMRU5TXCIsXG4gIFwiR0xJREVcIixcbiAgXCJHTElOVFwiLFxuICBcIkdMSVRaXCIsXG4gIFwiR0xPQVRcIixcbiAgXCJHTE9CRVwiLFxuICBcIkdMT0JTXCIsXG4gIFwiR0xPTVNcIixcbiAgXCJHTE9PTVwiLFxuICBcIkdMT1JZXCIsXG4gIFwiR0xPU1NcIixcbiAgXCJHTE9WRVwiLFxuICBcIkdMT1dTXCIsXG4gIFwiR0xVRURcIixcbiAgXCJHTFVFU1wiLFxuICBcIkdMVUVZXCIsXG4gIFwiR0xVT05cIixcbiAgXCJHTFVUU1wiLFxuICBcIkdMWVBIXCIsXG4gIFwiR05BUkxcIixcbiAgXCJHTkFTSFwiLFxuICBcIkdOQVRTXCIsXG4gIFwiR05BV1NcIixcbiAgXCJHTk9NRVwiLFxuICBcIkdPQURTXCIsXG4gIFwiR09BTFNcIixcbiAgXCJHT0FUU1wiLFxuICBcIkdPRExZXCIsXG4gIFwiR09FUlNcIixcbiAgXCJHT0VTVFwiLFxuICBcIkdPRVRIXCIsXG4gIFwiR09GRVJcIixcbiAgXCJHT0lOR1wiLFxuICBcIkdPTERTXCIsXG4gIFwiR09MRU1cIixcbiAgXCJHT0xGU1wiLFxuICBcIkdPTExZXCIsXG4gIFwiR09OQURcIixcbiAgXCJHT05FUlwiLFxuICBcIkdPTkdTXCIsXG4gIFwiR09OWk9cIixcbiAgXCJHT09EU1wiLFxuICBcIkdPT0RZXCIsXG4gIFwiR09PRVlcIixcbiAgXCJHT09GU1wiLFxuICBcIkdPT0ZZXCIsXG4gIFwiR09PS1NcIixcbiAgXCJHT09OU1wiLFxuICBcIkdPT1NFXCIsXG4gIFwiR09PU1lcIixcbiAgXCJHT1JFRFwiLFxuICBcIkdPUkVTXCIsXG4gIFwiR09SU0VcIixcbiAgXCJHT1RIU1wiLFxuICBcIkdPVURBXCIsXG4gIFwiR09VR0VcIixcbiAgXCJHT1VSRFwiLFxuICBcIkdPVVRTXCIsXG4gIFwiR09VVFlcIixcbiAgXCJHT1dOU1wiLFxuICBcIkdPWUlNXCIsXG4gIFwiR1JBQlNcIixcbiAgXCJHUkFDRVwiLFxuICBcIkdSQURFXCIsXG4gIFwiR1JBRFNcIixcbiAgXCJHUkFGVFwiLFxuICBcIkdSQUlMXCIsXG4gIFwiR1JBSU5cIixcbiAgXCJHUkFNU1wiLFxuICBcIkdSQU5EXCIsXG4gIFwiR1JBTlRcIixcbiAgXCJHUkFQRVwiLFxuICBcIkdSQVBIXCIsXG4gIFwiR1JBU1BcIixcbiAgXCJHUkFTU1wiLFxuICBcIkdSQVRFXCIsXG4gIFwiR1JBVkVcIixcbiAgXCJHUkFWWVwiLFxuICBcIkdSQVlTXCIsXG4gIFwiR1JBWkVcIixcbiAgXCJHUkVBVFwiLFxuICBcIkdSRUJFXCIsXG4gIFwiR1JFRURcIixcbiAgXCJHUkVFS1wiLFxuICBcIkdSRUVOXCIsXG4gIFwiR1JFRVRcIixcbiAgXCJHUkVZU1wiLFxuICBcIkdSSURTXCIsXG4gIFwiR1JJRUZcIixcbiAgXCJHUklGVFwiLFxuICBcIkdSSUxMXCIsXG4gIFwiR1JJTUVcIixcbiAgXCJHUklNWVwiLFxuICBcIkdSSU5EXCIsXG4gIFwiR1JJTlNcIixcbiAgXCJHUklQRVwiLFxuICBcIkdSSVBTXCIsXG4gIFwiR1JJU1RcIixcbiAgXCJHUklUU1wiLFxuICBcIkdST0FOXCIsXG4gIFwiR1JPQVRcIixcbiAgXCJHUk9EWVwiLFxuICBcIkdST0dTXCIsXG4gIFwiR1JPSU5cIixcbiAgXCJHUk9LU1wiLFxuICBcIkdST09NXCIsXG4gIFwiR1JPUEVcIixcbiAgXCJHUk9TU1wiLFxuICBcIkdST1VQXCIsXG4gIFwiR1JPVVRcIixcbiAgXCJHUk9WRVwiLFxuICBcIkdST1dMXCIsXG4gIFwiR1JPV05cIixcbiAgXCJHUk9XU1wiLFxuICBcIkdSVUJTXCIsXG4gIFwiR1JVRUxcIixcbiAgXCJHUlVGRlwiLFxuICBcIkdSVU1QXCIsXG4gIFwiR1JVTlRcIixcbiAgXCJHVUFOT1wiLFxuICBcIkdVQVJEXCIsXG4gIFwiR1VBVkFcIixcbiAgXCJHVUVTU1wiLFxuICBcIkdVRVNUXCIsXG4gIFwiR1VJREVcIixcbiAgXCJHVUlMRFwiLFxuICBcIkdVSUxFXCIsXG4gIFwiR1VJTFRcIixcbiAgXCJHVUlTRVwiLFxuICBcIkdVTEFHXCIsXG4gIFwiR1VMQ0hcIixcbiAgXCJHVUxFU1wiLFxuICBcIkdVTEZTXCIsXG4gIFwiR1VMTFNcIixcbiAgXCJHVUxMWVwiLFxuICBcIkdVTFBTXCIsXG4gIFwiR1VNQk9cIixcbiAgXCJHVU1NWVwiLFxuICBcIkdVTktZXCIsXG4gIFwiR1VOTllcIixcbiAgXCJHVVBQWVwiLFxuICBcIkdVUlVTXCIsXG4gIFwiR1VTSFlcIixcbiAgXCJHVVNUT1wiLFxuICBcIkdVU1RTXCIsXG4gIFwiR1VTVFlcIixcbiAgXCJHVVRTWVwiLFxuICBcIkdVVFRZXCIsXG4gIFwiR1VZRURcIixcbiAgXCJHWVBTWVwiLFxuICBcIkdZUk9TXCIsXG4gIFwiR1lWRVNcIixcbiAgXCJIQUJJVFwiLFxuICBcIkhBQ0tTXCIsXG4gIFwiSEFERVNcIixcbiAgXCJIQURTVFwiLFxuICBcIkhBRlRTXCIsXG4gIFwiSEFJS1VcIixcbiAgXCJIQUlMU1wiLFxuICBcIkhBSVJTXCIsXG4gIFwiSEFJUllcIixcbiAgXCJIQUxFRFwiLFxuICBcIkhBTEVSXCIsXG4gIFwiSEFMRVNcIixcbiAgXCJIQUxMT1wiLFxuICBcIkhBTExTXCIsXG4gIFwiSEFMTUFcIixcbiAgXCJIQUxPU1wiLFxuICBcIkhBTFRTXCIsXG4gIFwiSEFMVkVcIixcbiAgXCJIQU1FU1wiLFxuICBcIkhBTU1ZXCIsXG4gIFwiSEFNWkFcIixcbiAgXCJIQU5EU1wiLFxuICBcIkhBTkRZXCIsXG4gIFwiSEFOR1NcIixcbiAgXCJIQU5LU1wiLFxuICBcIkhBTktZXCIsXG4gIFwiSEFQTFlcIixcbiAgXCJIQVBQWVwiLFxuICBcIkhBUkRZXCIsXG4gIFwiSEFSRU1cIixcbiAgXCJIQVJFU1wiLFxuICBcIkhBUktTXCIsXG4gIFwiSEFSTVNcIixcbiAgXCJIQVJQU1wiLFxuICBcIkhBUlBZXCIsXG4gIFwiSEFSUllcIixcbiAgXCJIQVJTSFwiLFxuICBcIkhBUlRTXCIsXG4gIFwiSEFTUFNcIixcbiAgXCJIQVNURVwiLFxuICBcIkhBU1RZXCIsXG4gIFwiSEFUQ0hcIixcbiAgXCJIQVRFRFwiLFxuICBcIkhBVEVSXCIsXG4gIFwiSEFURVNcIixcbiAgXCJIQVVMU1wiLFxuICBcIkhBVU5UXCIsXG4gIFwiSEFWRU5cIixcbiAgXCJIQVZFU1wiLFxuICBcIkhBVk9DXCIsXG4gIFwiSEFXS1NcIixcbiAgXCJIQVpFRFwiLFxuICBcIkhBWkVMXCIsXG4gIFwiSEFaRVJcIixcbiAgXCJIQVpFU1wiLFxuICBcIkhFQURTXCIsXG4gIFwiSEVBRFlcIixcbiAgXCJIRUFMU1wiLFxuICBcIkhFQVBTXCIsXG4gIFwiSEVBUkRcIixcbiAgXCJIRUFSU1wiLFxuICBcIkhFQVJUXCIsXG4gIFwiSEVBVEhcIixcbiAgXCJIRUFUU1wiLFxuICBcIkhFQVZFXCIsXG4gIFwiSEVBVllcIixcbiAgXCJIRURHRVwiLFxuICBcIkhFRURTXCIsXG4gIFwiSEVFTFNcIixcbiAgXCJIRUZUU1wiLFxuICBcIkhFRlRZXCIsXG4gIFwiSEVJR0hcIixcbiAgXCJIRUlSU1wiLFxuICBcIkhFSVNUXCIsXG4gIFwiSEVMSVhcIixcbiAgXCJIRUxMT1wiLFxuICBcIkhFTE1TXCIsXG4gIFwiSEVMUFNcIixcbiAgXCJIRU5DRVwiLFxuICBcIkhFTkdFXCIsXG4gIFwiSEVOTkFcIixcbiAgXCJIRU5SWVwiLFxuICBcIkhFUkJTXCIsXG4gIFwiSEVSQllcIixcbiAgXCJIRVJEU1wiLFxuICBcIkhFUk9OXCIsXG4gIFwiSEVSVFpcIixcbiAgXCJIRVdFRFwiLFxuICBcIkhFV0VSXCIsXG4gIFwiSEVYQURcIixcbiAgXCJIRVhFRFwiLFxuICBcIkhFWEVTXCIsXG4gIFwiSElDS1NcIixcbiAgXCJISURFU1wiLFxuICBcIkhJR0hTXCIsXG4gIFwiSElLRURcIixcbiAgXCJISUtFUlwiLFxuICBcIkhJS0VTXCIsXG4gIFwiSElMQVJcIixcbiAgXCJISUxMU1wiLFxuICBcIkhJTExZXCIsXG4gIFwiSElMVFNcIixcbiAgXCJISUxVTVwiLFxuICBcIkhJTUJPXCIsXG4gIFwiSElORFNcIixcbiAgXCJISU5HRVwiLFxuICBcIkhJTlRTXCIsXG4gIFwiSElQUE9cIixcbiAgXCJISVBQWVwiLFxuICBcIkhJUkVEXCIsXG4gIFwiSElSRVNcIixcbiAgXCJISVRDSFwiLFxuICBcIkhJVkVEXCIsXG4gIFwiSElWRVNcIixcbiAgXCJIT0FHWVwiLFxuICBcIkhPQVJEXCIsXG4gIFwiSE9BUllcIixcbiAgXCJIT0JCWVwiLFxuICBcIkhPQk9TXCIsXG4gIFwiSE9DS1NcIixcbiAgXCJIT0NVU1wiLFxuICBcIkhPR0FOXCIsXG4gIFwiSE9JU1RcIixcbiAgXCJIT0tFWVwiLFxuICBcIkhPS1VNXCIsXG4gIFwiSE9MRFNcIixcbiAgXCJIT0xFRFwiLFxuICBcIkhPTEVTXCIsXG4gIFwiSE9MTFlcIixcbiAgXCJIT01FRFwiLFxuICBcIkhPTUVSXCIsXG4gIFwiSE9NRVNcIixcbiAgXCJIT01FWVwiLFxuICBcIkhPTU9TXCIsXG4gIFwiSE9ORURcIixcbiAgXCJIT05FU1wiLFxuICBcIkhPTkVZXCIsXG4gIFwiSE9OS1NcIixcbiAgXCJIT05LWVwiLFxuICBcIkhPTk9SXCIsXG4gIFwiSE9PQ0hcIixcbiAgXCJIT09EU1wiLFxuICBcIkhPT0VZXCIsXG4gIFwiSE9PRlNcIixcbiAgXCJIT09LU1wiLFxuICBcIkhPT0tZXCIsXG4gIFwiSE9PUFNcIixcbiAgXCJIT09UU1wiLFxuICBcIkhPUEVEXCIsXG4gIFwiSE9QRVNcIixcbiAgXCJIT1JERVwiLFxuICBcIkhPUk5TXCIsXG4gIFwiSE9STllcIixcbiAgXCJIT1JTRVwiLFxuICBcIkhPUlNZXCIsXG4gIFwiSE9TRURcIixcbiAgXCJIT1NFU1wiLFxuICBcIkhPU1RTXCIsXG4gIFwiSE9URUxcIixcbiAgXCJIT1RMWVwiLFxuICBcIkhPVU5EXCIsXG4gIFwiSE9VUklcIixcbiAgXCJIT1VSU1wiLFxuICBcIkhPVVNFXCIsXG4gIFwiSE9WRUxcIixcbiAgXCJIT1ZFUlwiLFxuICBcIkhPV0RZXCIsXG4gIFwiSE9XTFNcIixcbiAgXCJIVUJCWVwiLFxuICBcIkhVRkZTXCIsXG4gIFwiSFVGRllcIixcbiAgXCJIVUdFUlwiLFxuICBcIkhVTEFTXCIsXG4gIFwiSFVMS1NcIixcbiAgXCJIVUxMT1wiLFxuICBcIkhVTExTXCIsXG4gIFwiSFVNQU5cIixcbiAgXCJIVU1JRFwiLFxuICBcIkhVTU9SXCIsXG4gIFwiSFVNUEhcIixcbiAgXCJIVU1QU1wiLFxuICBcIkhVTVBZXCIsXG4gIFwiSFVNVVNcIixcbiAgXCJIVU5DSFwiLFxuICBcIkhVTktTXCIsXG4gIFwiSFVOS1lcIixcbiAgXCJIVU5UU1wiLFxuICBcIkhVUkxTXCIsXG4gIFwiSFVSUllcIixcbiAgXCJIVVJUU1wiLFxuICBcIkhVU0tTXCIsXG4gIFwiSFVTS1lcIixcbiAgXCJIVVNTWVwiLFxuICBcIkhVVENIXCIsXG4gIFwiSFVaWkFcIixcbiAgXCJIWURSQVwiLFxuICBcIkhZRFJPXCIsXG4gIFwiSFlFTkFcIixcbiAgXCJIWUlOR1wiLFxuICBcIkhZTUVOXCIsXG4gIFwiSFlNTlNcIixcbiAgXCJIWVBFRFwiLFxuICBcIkhZUEVSXCIsXG4gIFwiSFlQRVNcIixcbiAgXCJIWVBPU1wiLFxuICBcIklBTUJTXCIsXG4gIFwiSUNIT1JcIixcbiAgXCJJQ0lFUlwiLFxuICBcIklDSU5HXCIsXG4gIFwiSUNPTlNcIixcbiAgXCJJREVBTFwiLFxuICBcIklERUFTXCIsXG4gIFwiSURJT01cIixcbiAgXCJJRElPVFwiLFxuICBcIklETEVEXCIsXG4gIFwiSURMRVJcIixcbiAgXCJJRExFU1wiLFxuICBcIklET0xTXCIsXG4gIFwiSURZTExcIixcbiAgXCJJRFlMU1wiLFxuICBcIklHTE9PXCIsXG4gIFwiSUtBVFNcIixcbiAgXCJJS09OU1wiLFxuICBcIklMRVVNXCIsXG4gIFwiSUxFVVNcIixcbiAgXCJJTElBQ1wiLFxuICBcIklMSVVNXCIsXG4gIFwiSU1BR0VcIixcbiAgXCJJTUFHT1wiLFxuICBcIklNQU1TXCIsXG4gIFwiSU1CRURcIixcbiAgXCJJTUJVRVwiLFxuICBcIklNUEVMXCIsXG4gIFwiSU1QTFlcIixcbiAgXCJJTVBST1wiLFxuICBcIklOQU5FXCIsXG4gIFwiSU5BUFRcIixcbiAgXCJJTkNVUlwiLFxuICBcIklOREVYXCIsXG4gIFwiSU5ESUVcIixcbiAgXCJJTkVQVFwiLFxuICBcIklORVJUXCIsXG4gIFwiSU5GRVJcIixcbiAgXCJJTkZJWFwiLFxuICBcIklORlJBXCIsXG4gIFwiSU5HT1RcIixcbiAgXCJJTkpVTlwiLFxuICBcIklOS0VEXCIsXG4gIFwiSU5MQVlcIixcbiAgXCJJTkxFVFwiLFxuICBcIklOTkVSXCIsXG4gIFwiSU5QVVRcIixcbiAgXCJJTlNFVFwiLFxuICBcIklOVEVSXCIsXG4gIFwiSU5UUk9cIixcbiAgXCJJTlVSRVwiLFxuICBcIklPTklDXCIsXG4gIFwiSU9UQVNcIixcbiAgXCJJUkFURVwiLFxuICBcIklSS0VEXCIsXG4gIFwiSVJPTlNcIixcbiAgXCJJUk9OWVwiLFxuICBcIklTTEVTXCIsXG4gIFwiSVNMRVRcIixcbiAgXCJJU1NVRVwiLFxuICBcIklUQ0hZXCIsXG4gIFwiSVRFTVNcIixcbiAgXCJJVklFRFwiLFxuICBcIklWSUVTXCIsXG4gIFwiSVZPUllcIixcbiAgXCJJWE5BWVwiLFxuICBcIkpBQ0tTXCIsXG4gIFwiSkFERURcIixcbiAgXCJKQURFU1wiLFxuICBcIkpBR0dZXCIsXG4gIFwiSkFJTFNcIixcbiAgXCJKQU1CU1wiLFxuICBcIkpBTU1ZXCIsXG4gIFwiSkFORVNcIixcbiAgXCJKQVBBTlwiLFxuICBcIkpBVU5UXCIsXG4gIFwiSkFXRURcIixcbiAgXCJKQVpaWVwiLFxuICBcIkpFQU5TXCIsXG4gIFwiSkVFUFNcIixcbiAgXCJKRUVSU1wiLFxuICBcIkpFTExPXCIsXG4gIFwiSkVMTFNcIixcbiAgXCJKRUxMWVwiLFxuICBcIkpFTk5ZXCIsXG4gIFwiSkVSS1NcIixcbiAgXCJKRVJLWVwiLFxuICBcIkpFUlJZXCIsXG4gIFwiSkVTVFNcIixcbiAgXCJKRVRUWVwiLFxuICBcIkpFV0VMXCIsXG4gIFwiSklCRURcIixcbiAgXCJKSUJFU1wiLFxuICBcIkpJRkZTXCIsXG4gIFwiSklGRllcIixcbiAgXCJKSUhBRFwiLFxuICBcIkpJTFRTXCIsXG4gIFwiSklNTVlcIixcbiAgXCJKSU5HT1wiLFxuICBcIkpJTkdTXCIsXG4gIFwiSklOS1NcIixcbiAgXCJKSU5OU1wiLFxuICBcIkpJVkVEXCIsXG4gIFwiSklWRVNcIixcbiAgXCJKT0NLU1wiLFxuICBcIkpPRVlTXCIsXG4gIFwiSk9ITlNcIixcbiAgXCJKT0lOU1wiLFxuICBcIkpPSU5UXCIsXG4gIFwiSk9JU1RcIixcbiAgXCJKT0tFRFwiLFxuICBcIkpPS0VSXCIsXG4gIFwiSk9LRVNcIixcbiAgXCJKT0xMWVwiLFxuICBcIkpPTFRTXCIsXG4gIFwiSk9VTEVcIixcbiAgXCJKT1VTVFwiLFxuICBcIkpPV0xTXCIsXG4gIFwiSk9ZRURcIixcbiAgXCJKVURHRVwiLFxuICBcIkpVSUNFXCIsXG4gIFwiSlVJQ1lcIixcbiAgXCJKVUpVU1wiLFxuICBcIkpVS0VTXCIsXG4gIFwiSlVMRVBcIixcbiAgXCJKVU1CT1wiLFxuICBcIkpVTVBTXCIsXG4gIFwiSlVNUFlcIixcbiAgXCJKVU5DT1wiLFxuICBcIkpVTktTXCIsXG4gIFwiSlVOS1lcIixcbiAgXCJKVU5UQVwiLFxuICBcIkpVUk9SXCIsXG4gIFwiSlVURVNcIixcbiAgXCJLQUJPQlwiLFxuICBcIktBUE9LXCIsXG4gIFwiS0FQUEFcIixcbiAgXCJLQVBVVFwiLFxuICBcIktBUkFUXCIsXG4gIFwiS0FSTUFcIixcbiAgXCJLQVlBS1wiLFxuICBcIktBWU9TXCIsXG4gIFwiS0FaT09cIixcbiAgXCJLRUJBQlwiLFxuICBcIktFRUxTXCIsXG4gIFwiS0VFTlNcIixcbiAgXCJLRUVQU1wiLFxuICBcIktFRklSXCIsXG4gIFwiS0VMUFNcIixcbiAgXCJLRU5BRlwiLFxuICBcIktFUElTXCIsXG4gIFwiS0VSQlNcIixcbiAgXCJLRVJGU1wiLFxuICBcIktFUk5TXCIsXG4gIFwiS0VUQ0hcIixcbiAgXCJLRVlFRFwiLFxuICBcIktIQUtJXCIsXG4gIFwiS0hBTlNcIixcbiAgXCJLSUNLU1wiLFxuICBcIktJQ0tZXCIsXG4gIFwiS0lERE9cIixcbiAgXCJLSUtFU1wiLFxuICBcIktJTExTXCIsXG4gIFwiS0lMTlNcIixcbiAgXCJLSUxPU1wiLFxuICBcIktJTFRTXCIsXG4gIFwiS0lOREFcIixcbiAgXCJLSU5EU1wiLFxuICBcIktJTkdTXCIsXG4gIFwiS0lOS1NcIixcbiAgXCJLSU5LWVwiLFxuICBcIktJT1NLXCIsXG4gIFwiS0lSS1NcIixcbiAgXCJLSVRIU1wiLFxuICBcIktJVFRZXCIsXG4gIFwiS0lWQVNcIixcbiAgXCJLSVdJU1wiLFxuICBcIktMSUVHXCIsXG4gIFwiS0xVR0VcIixcbiAgXCJLTFVUWlwiLFxuICBcIktOQUNLXCIsXG4gIFwiS05BVkVcIixcbiAgXCJLTkVBRFwiLFxuICBcIktORUVEXCIsXG4gIFwiS05FRUxcIixcbiAgXCJLTkVFU1wiLFxuICBcIktORUxMXCIsXG4gIFwiS05FTFRcIixcbiAgXCJLTklGRVwiLFxuICBcIktOSVNIXCIsXG4gIFwiS05JVFNcIixcbiAgXCJLTk9CU1wiLFxuICBcIktOT0NLXCIsXG4gIFwiS05PTExcIixcbiAgXCJLTk9QU1wiLFxuICBcIktOT1RTXCIsXG4gIFwiS05PVVRcIixcbiAgXCJLTk9XTlwiLFxuICBcIktOT1dTXCIsXG4gIFwiS05VUkxcIixcbiAgXCJLT0FMQVwiLFxuICBcIktPSU5FXCIsXG4gIFwiS09PS1NcIixcbiAgXCJLT09LWVwiLFxuICBcIktPUEVLXCIsXG4gIFwiS1JBQUxcIixcbiAgXCJLUkFVVFwiLFxuICBcIktSSUxMXCIsXG4gIFwiS1JPTkFcIixcbiAgXCJLUk9ORVwiLFxuICBcIktVRE9TXCIsXG4gIFwiS1VEWlVcIixcbiAgXCJLVUxBS1wiLFxuICBcIktZUklFXCIsXG4gIFwiTEFCRUxcIixcbiAgXCJMQUJJQVwiLFxuICBcIkxBQk9SXCIsXG4gIFwiTEFDRURcIixcbiAgXCJMQUNFU1wiLFxuICBcIkxBQ0tTXCIsXG4gIFwiTEFERURcIixcbiAgXCJMQURFTlwiLFxuICBcIkxBREVTXCIsXG4gIFwiTEFETEVcIixcbiAgXCJMQUdFUlwiLFxuICBcIkxBSVJEXCIsXG4gIFwiTEFJUlNcIixcbiAgXCJMQUlUWVwiLFxuICBcIkxBS0VSXCIsXG4gIFwiTEFLRVNcIixcbiAgXCJMQU1BU1wiLFxuICBcIkxBTUJTXCIsXG4gIFwiTEFNRURcIixcbiAgXCJMQU1FUlwiLFxuICBcIkxBTUVTXCIsXG4gIFwiTEFNUFNcIixcbiAgXCJMQU5BSVwiLFxuICBcIkxBTkNFXCIsXG4gIFwiTEFORFNcIixcbiAgXCJMQU5FU1wiLFxuICBcIkxBTktZXCIsXG4gIFwiTEFQRUxcIixcbiAgXCJMQVBJU1wiLFxuICBcIkxBUFNFXCIsXG4gIFwiTEFSQ0hcIixcbiAgXCJMQVJEU1wiLFxuICBcIkxBUkdFXCIsXG4gIFwiTEFSR09cIixcbiAgXCJMQVJLU1wiLFxuICBcIkxBUlZBXCIsXG4gIFwiTEFTRURcIixcbiAgXCJMQVNFUlwiLFxuICBcIkxBU0VTXCIsXG4gIFwiTEFTU09cIixcbiAgXCJMQVNUU1wiLFxuICBcIkxBVENIXCIsXG4gIFwiTEFURVJcIixcbiAgXCJMQVRFWFwiLFxuICBcIkxBVEhFXCIsXG4gIFwiTEFUSFNcIixcbiAgXCJMQVVEU1wiLFxuICBcIkxBVUdIXCIsXG4gIFwiTEFWQVNcIixcbiAgXCJMQVZFRFwiLFxuICBcIkxBVkVSXCIsXG4gIFwiTEFWRVNcIixcbiAgXCJMQVdOU1wiLFxuICBcIkxBWEVSXCIsXG4gIFwiTEFZRVJcIixcbiAgXCJMQVlVUFwiLFxuICBcIkxBWkVEXCIsXG4gIFwiTEFaRVNcIixcbiAgXCJMRUFDSFwiLFxuICBcIkxFQURTXCIsXG4gIFwiTEVBRlNcIixcbiAgXCJMRUFGWVwiLFxuICBcIkxFQUtTXCIsXG4gIFwiTEVBS1lcIixcbiAgXCJMRUFOU1wiLFxuICBcIkxFQU5UXCIsXG4gIFwiTEVBUFNcIixcbiAgXCJMRUFQVFwiLFxuICBcIkxFQVJOXCIsXG4gIFwiTEVBU0VcIixcbiAgXCJMRUFTSFwiLFxuICBcIkxFQVNUXCIsXG4gIFwiTEVBVkVcIixcbiAgXCJMRURHRVwiLFxuICBcIkxFRUNIXCIsXG4gIFwiTEVFS1NcIixcbiAgXCJMRUVSU1wiLFxuICBcIkxFRVJZXCIsXG4gIFwiTEVGVFNcIixcbiAgXCJMRUZUWVwiLFxuICBcIkxFR0FMXCIsXG4gIFwiTEVHR1lcIixcbiAgXCJMRUdJVFwiLFxuICBcIkxFTU1BXCIsXG4gIFwiTEVNT05cIixcbiAgXCJMRU1VUlwiLFxuICBcIkxFTkRTXCIsXG4gIFwiTEVOVE9cIixcbiAgXCJMRVBFUlwiLFxuICBcIkxFUFRBXCIsXG4gIFwiTEVUVVBcIixcbiAgXCJMRVZFRVwiLFxuICBcIkxFVkVMXCIsXG4gIFwiTEVWRVJcIixcbiAgXCJMSUFSU1wiLFxuICBcIkxJQkVMXCIsXG4gIFwiTElCUkFcIixcbiAgXCJMSUNJVFwiLFxuICBcIkxJQ0tTXCIsXG4gIFwiTElFR0VcIixcbiAgXCJMSUVOU1wiLFxuICBcIkxJRkVSXCIsXG4gIFwiTElGVFNcIixcbiAgXCJMSUdIVFwiLFxuICBcIkxJS0VEXCIsXG4gIFwiTElLRU5cIixcbiAgXCJMSUtFU1wiLFxuICBcIkxJTEFDXCIsXG4gIFwiTElMVFNcIixcbiAgXCJMSU1CT1wiLFxuICBcIkxJTUJTXCIsXG4gIFwiTElNRURcIixcbiAgXCJMSU1FTlwiLFxuICBcIkxJTUVTXCIsXG4gIFwiTElNRVlcIixcbiAgXCJMSU1JVFwiLFxuICBcIkxJTU5TXCIsXG4gIFwiTElNT1NcIixcbiAgXCJMSU1QU1wiLFxuICBcIkxJTkVEXCIsXG4gIFwiTElORU5cIixcbiAgXCJMSU5FUlwiLFxuICBcIkxJTkVTXCIsXG4gIFwiTElOR09cIixcbiAgXCJMSU5HU1wiLFxuICBcIkxJTktTXCIsXG4gIFwiTElPTlNcIixcbiAgXCJMSVBJRFwiLFxuICBcIkxJUFBZXCIsXG4gIFwiTElTTEVcIixcbiAgXCJMSVNQU1wiLFxuICBcIkxJU1RTXCIsXG4gIFwiTElURVJcIixcbiAgXCJMSVRIRVwiLFxuICBcIkxJVEhPXCIsXG4gIFwiTElUUkVcIixcbiAgXCJMSVZFRFwiLFxuICBcIkxJVkVOXCIsXG4gIFwiTElWRVJcIixcbiAgXCJMSVZJRFwiLFxuICBcIkxMQU1BXCIsXG4gIFwiTE9BRFNcIixcbiAgXCJMT0FGU1wiLFxuICBcIkxPQU1ZXCIsXG4gIFwiTE9BTlNcIixcbiAgXCJMT0FUSFwiLFxuICBcIkxPQkFSXCIsXG4gIFwiTE9CQllcIixcbiAgXCJMT0JFU1wiLFxuICBcIkxPQ0FMXCIsXG4gIFwiTE9DSFNcIixcbiAgXCJMT0NLU1wiLFxuICBcIkxPQ09TXCIsXG4gIFwiTE9DVVNcIixcbiAgXCJMT0RFU1wiLFxuICBcIkxPREdFXCIsXG4gIFwiTE9FU1NcIixcbiAgXCJMT0ZUU1wiLFxuICBcIkxPRlRZXCIsXG4gIFwiTE9HRVNcIixcbiAgXCJMT0dJQ1wiLFxuICBcIkxPR0lOXCIsXG4gIFwiTE9HT1NcIixcbiAgXCJMT0lOU1wiLFxuICBcIkxPTExTXCIsXG4gIFwiTE9MTFlcIixcbiAgXCJMT05FUlwiLFxuICBcIkxPTkdTXCIsXG4gIFwiTE9PS1NcIixcbiAgXCJMT09LWVwiLFxuICBcIkxPT01TXCIsXG4gIFwiTE9PTlNcIixcbiAgXCJMT09OWVwiLFxuICBcIkxPT1BTXCIsXG4gIFwiTE9PUFlcIixcbiAgXCJMT09TRVwiLFxuICBcIkxPT1RTXCIsXG4gIFwiTE9QRURcIixcbiAgXCJMT1BFU1wiLFxuICBcIkxPUFBZXCIsXG4gIFwiTE9SRFNcIixcbiAgXCJMT1JEWVwiLFxuICBcIkxPUkVTXCIsXG4gIFwiTE9SUllcIixcbiAgXCJMT1NFUlwiLFxuICBcIkxPU0VTXCIsXG4gIFwiTE9TU1lcIixcbiAgXCJMT1RTQVwiLFxuICBcIkxPVFRPXCIsXG4gIFwiTE9UVVNcIixcbiAgXCJMT1VJU1wiLFxuICBcIkxPVVNFXCIsXG4gIFwiTE9VU1lcIixcbiAgXCJMT1VUU1wiLFxuICBcIkxPVkVEXCIsXG4gIFwiTE9WRVJcIixcbiAgXCJMT1ZFU1wiLFxuICBcIkxPV0VEXCIsXG4gIFwiTE9XRVJcIixcbiAgXCJMT1dMWVwiLFxuICBcIkxPWUFMXCIsXG4gIFwiTFVBVVNcIixcbiAgXCJMVUJFU1wiLFxuICBcIkxVQlJBXCIsXG4gIFwiTFVDSURcIixcbiAgXCJMVUNLU1wiLFxuICBcIkxVQ0tZXCIsXG4gIFwiTFVDUkVcIixcbiAgXCJMVUxMU1wiLFxuICBcIkxVTFVTXCIsXG4gIFwiTFVNRU5cIixcbiAgXCJMVU1QU1wiLFxuICBcIkxVTVBZXCIsXG4gIFwiTFVOQVJcIixcbiAgXCJMVU5DSFwiLFxuICBcIkxVTkVTXCIsXG4gIFwiTFVOR0VcIixcbiAgXCJMVU5HU1wiLFxuICBcIkxVUFVTXCIsXG4gIFwiTFVSQ0hcIixcbiAgXCJMVVJFRFwiLFxuICBcIkxVUkVTXCIsXG4gIFwiTFVSSURcIixcbiAgXCJMVVJLU1wiLFxuICBcIkxVU1RTXCIsXG4gIFwiTFVTVFlcIixcbiAgXCJMVVRFRFwiLFxuICBcIkxVVEVTXCIsXG4gIFwiTFlDUkFcIixcbiAgXCJMWUlOR1wiLFxuICBcIkxZTVBIXCIsXG4gIFwiTFlOQ0hcIixcbiAgXCJMWVJFU1wiLFxuICBcIkxZUklDXCIsXG4gIFwiTUFDQVdcIixcbiAgXCJNQUNFRFwiLFxuICBcIk1BQ0VSXCIsXG4gIFwiTUFDRVNcIixcbiAgXCJNQUNIT1wiLFxuICBcIk1BQ1JPXCIsXG4gIFwiTUFEQU1cIixcbiAgXCJNQURMWVwiLFxuICBcIk1BRklBXCIsXG4gIFwiTUFHSUNcIixcbiAgXCJNQUdNQVwiLFxuICBcIk1BR1VTXCIsXG4gIFwiTUFIVUFcIixcbiAgXCJNQUlEU1wiLFxuICBcIk1BSUxTXCIsXG4gIFwiTUFJTVNcIixcbiAgXCJNQUlOU1wiLFxuICBcIk1BSVpFXCIsXG4gIFwiTUFKT1JcIixcbiAgXCJNQUtFUlwiLFxuICBcIk1BS0VTXCIsXG4gIFwiTUFMRVNcIixcbiAgXCJNQUxMU1wiLFxuICBcIk1BTFRTXCIsXG4gIFwiTUFMVFlcIixcbiAgXCJNQU1BU1wiLFxuICBcIk1BTUJPXCIsXG4gIFwiTUFNTUFcIixcbiAgXCJNQU1NWVwiLFxuICBcIk1BTkVTXCIsXG4gIFwiTUFOR0VcIixcbiAgXCJNQU5HT1wiLFxuICBcIk1BTkdZXCIsXG4gIFwiTUFOSUFcIixcbiAgXCJNQU5JQ1wiLFxuICBcIk1BTkxZXCIsXG4gIFwiTUFOTkFcIixcbiAgXCJNQU5PUlwiLFxuICBcIk1BTlNFXCIsXG4gIFwiTUFOVEFcIixcbiAgXCJNQVBMRVwiLFxuICBcIk1BUkNIXCIsXG4gIFwiTUFSRVNcIixcbiAgXCJNQVJHRVwiLFxuICBcIk1BUklBXCIsXG4gIFwiTUFSS1NcIixcbiAgXCJNQVJMU1wiLFxuICBcIk1BUlJZXCIsXG4gIFwiTUFSU0hcIixcbiAgXCJNQVJUU1wiLFxuICBcIk1BU0VSXCIsXG4gIFwiTUFTS1NcIixcbiAgXCJNQVNPTlwiLFxuICBcIk1BU1RTXCIsXG4gIFwiTUFUQ0hcIixcbiAgXCJNQVRFRFwiLFxuICBcIk1BVEVSXCIsXG4gIFwiTUFURVNcIixcbiAgXCJNQVRFWVwiLFxuICBcIk1BVEhTXCIsXG4gIFwiTUFUVEVcIixcbiAgXCJNQVRaT1wiLFxuICBcIk1BVUxTXCIsXG4gIFwiTUFVVkVcIixcbiAgXCJNQVZFTlwiLFxuICBcIk1BVklTXCIsXG4gIFwiTUFYSU1cIixcbiAgXCJNQVhJU1wiLFxuICBcIk1BWUJFXCIsXG4gIFwiTUFZT1JcIixcbiAgXCJNQVlTVFwiLFxuICBcIk1BWkVEXCIsXG4gIFwiTUFaRVJcIixcbiAgXCJNQVpFU1wiLFxuICBcIk1FQURTXCIsXG4gIFwiTUVBTFNcIixcbiAgXCJNRUFMWVwiLFxuICBcIk1FQU5TXCIsXG4gIFwiTUVBTlRcIixcbiAgXCJNRUFOWVwiLFxuICBcIk1FQVRTXCIsXG4gIFwiTUVBVFlcIixcbiAgXCJNRURBTFwiLFxuICBcIk1FRElBXCIsXG4gIFwiTUVESUNcIixcbiAgXCJNRUVUU1wiLFxuICBcIk1FTEJBXCIsXG4gIFwiTUVMRFNcIixcbiAgXCJNRUxFRVwiLFxuICBcIk1FTE9OXCIsXG4gIFwiTUVMVFNcIixcbiAgXCJNRU1FU1wiLFxuICBcIk1FTU9TXCIsXG4gIFwiTUVORFNcIixcbiAgXCJNRU5VU1wiLFxuICBcIk1FT1dTXCIsXG4gIFwiTUVSQ1lcIixcbiAgXCJNRVJHRVwiLFxuICBcIk1FUklUXCIsXG4gIFwiTUVSUllcIixcbiAgXCJNRVNBU1wiLFxuICBcIk1FU05FXCIsXG4gIFwiTUVTT05cIixcbiAgXCJNRVNTWVwiLFxuICBcIk1FVEFMXCIsXG4gIFwiTUVURURcIixcbiAgXCJNRVRFUlwiLFxuICBcIk1FVEVTXCIsXG4gIFwiTUVUUkVcIixcbiAgXCJNRVRST1wiLFxuICBcIk1FV0VEXCIsXG4gIFwiTUVaWk9cIixcbiAgXCJNSUFPV1wiLFxuICBcIk1JQ0tTXCIsXG4gIFwiTUlDUk9cIixcbiAgXCJNSUREWVwiLFxuICBcIk1JRElTXCIsXG4gIFwiTUlEU1RcIixcbiAgXCJNSUVOU1wiLFxuICBcIk1JRkZTXCIsXG4gIFwiTUlHSFRcIixcbiAgXCJNSUtFRFwiLFxuICBcIk1JS0VTXCIsXG4gIFwiTUlMQ0hcIixcbiAgXCJNSUxFUlwiLFxuICBcIk1JTEVTXCIsXG4gIFwiTUlMS1NcIixcbiAgXCJNSUxLWVwiLFxuICBcIk1JTExTXCIsXG4gIFwiTUlNRURcIixcbiAgXCJNSU1FT1wiLFxuICBcIk1JTUVTXCIsXG4gIFwiTUlNSUNcIixcbiAgXCJNSU1TWVwiLFxuICBcIk1JTkNFXCIsXG4gIFwiTUlORFNcIixcbiAgXCJNSU5FRFwiLFxuICBcIk1JTkVSXCIsXG4gIFwiTUlORVNcIixcbiAgXCJNSU5JTVwiLFxuICBcIk1JTklTXCIsXG4gIFwiTUlOS1NcIixcbiAgXCJNSU5PUlwiLFxuICBcIk1JTlRTXCIsXG4gIFwiTUlOVVNcIixcbiAgXCJNSVJFRFwiLFxuICBcIk1JUkVTXCIsXG4gIFwiTUlSVEhcIixcbiAgXCJNSVNFUlwiLFxuICBcIk1JU1NZXCIsXG4gIFwiTUlTVFNcIixcbiAgXCJNSVNUWVwiLFxuICBcIk1JVEVSXCIsXG4gIFwiTUlURVNcIixcbiAgXCJNSVRSRVwiLFxuICBcIk1JVFRTXCIsXG4gIFwiTUlYRURcIixcbiAgXCJNSVhFUlwiLFxuICBcIk1JWEVTXCIsXG4gIFwiTUlYVVBcIixcbiAgXCJNT0FOU1wiLFxuICBcIk1PQVRTXCIsXG4gIFwiTU9DSEFcIixcbiAgXCJNT0NLU1wiLFxuICBcIk1PREFMXCIsXG4gIFwiTU9ERUxcIixcbiAgXCJNT0RFTVwiLFxuICBcIk1PREVTXCIsXG4gIFwiTU9HVUxcIixcbiAgXCJNT0hFTFwiLFxuICBcIk1PSVJFXCIsXG4gIFwiTU9JU1RcIixcbiAgXCJNT0xBTFwiLFxuICBcIk1PTEFSXCIsXG4gIFwiTU9MQVNcIixcbiAgXCJNT0xEU1wiLFxuICBcIk1PTERZXCIsXG4gIFwiTU9MRVNcIixcbiAgXCJNT0xMU1wiLFxuICBcIk1PTExZXCIsXG4gIFwiTU9MVFNcIixcbiAgXCJNT01NQVwiLFxuICBcIk1PTU1ZXCIsXG4gIFwiTU9OQURcIixcbiAgXCJNT05ET1wiLFxuICBcIk1PTkVZXCIsXG4gIFwiTU9OSUNcIixcbiAgXCJNT05LU1wiLFxuICBcIk1PTlRFXCIsXG4gIFwiTU9OVEhcIixcbiAgXCJNT09DSFwiLFxuICBcIk1PT0RTXCIsXG4gIFwiTU9PRFlcIixcbiAgXCJNT09FRFwiLFxuICBcIk1PT0xBXCIsXG4gIFwiTU9PTlNcIixcbiAgXCJNT09OWVwiLFxuICBcIk1PT1JTXCIsXG4gIFwiTU9PU0VcIixcbiAgXCJNT09UU1wiLFxuICBcIk1PUEVEXCIsXG4gIFwiTU9QRVNcIixcbiAgXCJNT1JBTFwiLFxuICBcIk1PUkFZXCIsXG4gIFwiTU9SRUxcIixcbiAgXCJNT1JFU1wiLFxuICBcIk1PUk5TXCIsXG4gIFwiTU9ST05cIixcbiAgXCJNT1JQSFwiLFxuICBcIk1PUlRTXCIsXG4gIFwiTU9TRVlcIixcbiAgXCJNT1NTWVwiLFxuICBcIk1PVEVMXCIsXG4gIFwiTU9URVNcIixcbiAgXCJNT1RFVFwiLFxuICBcIk1PVEhTXCIsXG4gIFwiTU9USFlcIixcbiAgXCJNT1RJRlwiLFxuICBcIk1PVE9SXCIsXG4gIFwiTU9UVE9cIixcbiAgXCJNT1VMRFwiLFxuICBcIk1PVUxUXCIsXG4gIFwiTU9VTkRcIixcbiAgXCJNT1VOVFwiLFxuICBcIk1PVVJOXCIsXG4gIFwiTU9VU0VcIixcbiAgXCJNT1VTWVwiLFxuICBcIk1PVVRIXCIsXG4gIFwiTU9WRURcIixcbiAgXCJNT1ZFUlwiLFxuICBcIk1PVkVTXCIsXG4gIFwiTU9WSUVcIixcbiAgXCJNT1dFRFwiLFxuICBcIk1PV0VSXCIsXG4gIFwiTU9YSUVcIixcbiAgXCJNVUNIT1wiLFxuICBcIk1VQ0tTXCIsXG4gIFwiTVVDS1lcIixcbiAgXCJNVUNVU1wiLFxuICBcIk1VRERZXCIsXG4gIFwiTVVGRlNcIixcbiAgXCJNVUZUSVwiLFxuICBcIk1VR0dZXCIsXG4gIFwiTVVMQ0hcIixcbiAgXCJNVUxDVFwiLFxuICBcIk1VTEVTXCIsXG4gIFwiTVVMRVlcIixcbiAgXCJNVUxMU1wiLFxuICBcIk1VTU1ZXCIsXG4gIFwiTVVNUFNcIixcbiAgXCJNVU5DSFwiLFxuICBcIk1VTkdFXCIsXG4gIFwiTVVOR1NcIixcbiAgXCJNVU9OU1wiLFxuICBcIk1VUkFMXCIsXG4gIFwiTVVSS1lcIixcbiAgXCJNVVNFRFwiLFxuICBcIk1VU0VTXCIsXG4gIFwiTVVTSFlcIixcbiAgXCJNVVNJQ1wiLFxuICBcIk1VU0tTXCIsXG4gIFwiTVVTS1lcIixcbiAgXCJNVVNPU1wiLFxuICBcIk1VU1RTXCIsXG4gIFwiTVVTVFlcIixcbiAgXCJNVVRFRFwiLFxuICBcIk1VVEVTXCIsXG4gIFwiTVVUVFNcIixcbiAgXCJNVVhFU1wiLFxuICBcIk1ZTEFSXCIsXG4gIFwiTVlOQUhcIixcbiAgXCJNWU5BU1wiLFxuICBcIk1ZUlJIXCIsXG4gIFwiTVlUSFNcIixcbiAgXCJOQUJPQlwiLFxuICBcIk5BQ0hPXCIsXG4gIFwiTkFESVJcIixcbiAgXCJOQUlBRFwiLFxuICBcIk5BSUxTXCIsXG4gIFwiTkFJVkVcIixcbiAgXCJOQUtFRFwiLFxuICBcIk5BTUVEXCIsXG4gIFwiTkFNRVNcIixcbiAgXCJOQU5OWVwiLFxuICBcIk5BUEVTXCIsXG4gIFwiTkFQUFlcIixcbiAgXCJOQVJDT1wiLFxuICBcIk5BUkNTXCIsXG4gIFwiTkFSRFNcIixcbiAgXCJOQVJFU1wiLFxuICBcIk5BU0FMXCIsXG4gIFwiTkFTVFlcIixcbiAgXCJOQVRBTFwiLFxuICBcIk5BVENIXCIsXG4gIFwiTkFURVNcIixcbiAgXCJOQVRUWVwiLFxuICBcIk5BVkFMXCIsXG4gIFwiTkFWRUxcIixcbiAgXCJOQVZFU1wiLFxuICBcIk5FQVJTXCIsXG4gIFwiTkVBVEhcIixcbiAgXCJORUNLU1wiLFxuICBcIk5FRURTXCIsXG4gIFwiTkVFRFlcIixcbiAgXCJORUdST1wiLFxuICBcIk5FSUdIXCIsXG4gIFwiTkVPTlNcIixcbiAgXCJORVJEU1wiLFxuICBcIk5FUkRZXCIsXG4gIFwiTkVSRlNcIixcbiAgXCJORVJWRVwiLFxuICBcIk5FUlZZXCIsXG4gIFwiTkVTVFNcIixcbiAgXCJORVZFUlwiLFxuICBcIk5FV0VMXCIsXG4gIFwiTkVXRVJcIixcbiAgXCJORVdMWVwiLFxuICBcIk5FV1NZXCIsXG4gIFwiTkVXVFNcIixcbiAgXCJORVhVU1wiLFxuICBcIk5JQ0FEXCIsXG4gIFwiTklDRVJcIixcbiAgXCJOSUNIRVwiLFxuICBcIk5JQ0tTXCIsXG4gIFwiTklFQ0VcIixcbiAgXCJOSUZUWVwiLFxuICBcIk5JR0hUXCIsXG4gIFwiTklNQklcIixcbiAgXCJOSU5FU1wiLFxuICBcIk5JTkpBXCIsXG4gIFwiTklOTllcIixcbiAgXCJOSU5USFwiLFxuICBcIk5JUFBZXCIsXG4gIFwiTklTRUlcIixcbiAgXCJOSVRFUlwiLFxuICBcIk5JVFJPXCIsXG4gIFwiTklYRURcIixcbiAgXCJOSVhFU1wiLFxuICBcIk5JWElFXCIsXG4gIFwiTk9CTEVcIixcbiAgXCJOT0JMWVwiLFxuICBcIk5PREFMXCIsXG4gIFwiTk9ERFlcIixcbiAgXCJOT0RFU1wiLFxuICBcIk5PRUxTXCIsXG4gIFwiTk9IT1dcIixcbiAgXCJOT0lTRVwiLFxuICBcIk5PSVNZXCIsXG4gIFwiTk9NQURcIixcbiAgXCJOT05DRVwiLFxuICBcIk5PTkVTXCIsXG4gIFwiTk9PS1NcIixcbiAgXCJOT09LWVwiLFxuICBcIk5PT05TXCIsXG4gIFwiTk9PU0VcIixcbiAgXCJOT1JNU1wiLFxuICBcIk5PUlRIXCIsXG4gIFwiTk9TRURcIixcbiAgXCJOT1NFU1wiLFxuICBcIk5PU0VZXCIsXG4gIFwiTk9UQ0hcIixcbiAgXCJOT1RFRFwiLFxuICBcIk5PVEVTXCIsXG4gIFwiTk9VTlNcIixcbiAgXCJOT1ZBRVwiLFxuICBcIk5PVkFTXCIsXG4gIFwiTk9WRUxcIixcbiAgXCJOT1dBWVwiLFxuICBcIk5VREVTXCIsXG4gIFwiTlVER0VcIixcbiAgXCJOVURJRVwiLFxuICBcIk5VS0VEXCIsXG4gIFwiTlVLRVNcIixcbiAgXCJOVUxMU1wiLFxuICBcIk5VTUJTXCIsXG4gIFwiTlVSU0VcIixcbiAgXCJOVVRTWVwiLFxuICBcIk5VVFRZXCIsXG4gIFwiTllMT05cIixcbiAgXCJOWU1QSFwiLFxuICBcIk9BS0VOXCIsXG4gIFwiT0FLVU1cIixcbiAgXCJPQVJFRFwiLFxuICBcIk9BU0VTXCIsXG4gIFwiT0FTSVNcIixcbiAgXCJPQVRFTlwiLFxuICBcIk9BVEhTXCIsXG4gIFwiT0JFQUhcIixcbiAgXCJPQkVTRVwiLFxuICBcIk9CRVlTXCIsXG4gIFwiT0JJVFNcIixcbiAgXCJPQk9FU1wiLFxuICBcIk9DQ1VSXCIsXG4gIFwiT0NFQU5cIixcbiAgXCJPQ0hFUlwiLFxuICBcIk9DSFJFXCIsXG4gIFwiT0NUQUxcIixcbiAgXCJPQ1RFVFwiLFxuICBcIk9EREVSXCIsXG4gIFwiT0RETFlcIixcbiAgXCJPRElVTVwiLFxuICBcIk9ET1JTXCIsXG4gIFwiT0RPVVJcIixcbiAgXCJPRkZBTFwiLFxuICBcIk9GRkVEXCIsXG4gIFwiT0ZGRVJcIixcbiAgXCJPRlRFTlwiLFxuICBcIk9HTEVEXCIsXG4gIFwiT0dMRVNcIixcbiAgXCJPR1JFU1wiLFxuICBcIk9JTEVEXCIsXG4gIFwiT0lMRVJcIixcbiAgXCJPSU5LU1wiLFxuICBcIk9LQVBJXCIsXG4gIFwiT0tBWVNcIixcbiAgXCJPTERFTlwiLFxuICBcIk9MREVSXCIsXG4gIFwiT0xESUVcIixcbiAgXCJPTElPU1wiLFxuICBcIk9MSVZFXCIsXG4gIFwiT01CUkVcIixcbiAgXCJPTUVHQVwiLFxuICBcIk9NRU5TXCIsXG4gIFwiT01JVFNcIixcbiAgXCJPTklPTlwiLFxuICBcIk9OU0VUXCIsXG4gIFwiT09NUEhcIixcbiAgXCJPT1pFRFwiLFxuICBcIk9PWkVTXCIsXG4gIFwiT1BBTFNcIixcbiAgXCJPUEVOU1wiLFxuICBcIk9QRVJBXCIsXG4gIFwiT1BJTkVcIixcbiAgXCJPUElVTVwiLFxuICBcIk9QVEVEXCIsXG4gIFwiT1BUSUNcIixcbiAgXCJPUkFMU1wiLFxuICBcIk9SQVRFXCIsXG4gIFwiT1JCSVRcIixcbiAgXCJPUkNBU1wiLFxuICBcIk9SREVSXCIsXG4gIFwiT1JHQU5cIixcbiAgXCJPUlRIT1wiLFxuICBcIk9TSUVSXCIsXG4gIFwiT1RIRVJcIixcbiAgXCJPVFRFUlwiLFxuICBcIk9VR0hUXCIsXG4gIFwiT1VOQ0VcIixcbiAgXCJPVVNFTFwiLFxuICBcIk9VU1RTXCIsXG4gIFwiT1VURE9cIixcbiAgXCJPVVRFUlwiLFxuICBcIk9VVEdPXCIsXG4gIFwiT1VUVEFcIixcbiAgXCJPVVpFTFwiLFxuICBcIk9WQUxTXCIsXG4gIFwiT1ZBUllcIixcbiAgXCJPVkFURVwiLFxuICBcIk9WRU5TXCIsXG4gIFwiT1ZFUlNcIixcbiAgXCJPVkVSVFwiLFxuICBcIk9WT0lEXCIsXG4gIFwiT1ZVTEVcIixcbiAgXCJPV0lOR1wiLFxuICBcIk9XTEVUXCIsXG4gIFwiT1dORURcIixcbiAgXCJPV05FUlwiLFxuICBcIk9YQk9XXCIsXG4gIFwiT1hFWUVcIixcbiAgXCJPWElERVwiLFxuICBcIk9YTElQXCIsXG4gIFwiT1pPTkVcIixcbiAgXCJQQUNFRFwiLFxuICBcIlBBQ0VSXCIsXG4gIFwiUEFDRVNcIixcbiAgXCJQQUNLU1wiLFxuICBcIlBBQ1RTXCIsXG4gIFwiUEFERFlcIixcbiAgXCJQQURSRVwiLFxuICBcIlBBRUFOXCIsXG4gIFwiUEFHQU5cIixcbiAgXCJQQUdFRFwiLFxuICBcIlBBR0VSXCIsXG4gIFwiUEFHRVNcIixcbiAgXCJQQUlMU1wiLFxuICBcIlBBSU5TXCIsXG4gIFwiUEFJTlRcIixcbiAgXCJQQUlSU1wiLFxuICBcIlBBTEVEXCIsXG4gIFwiUEFMRVJcIixcbiAgXCJQQUxFU1wiLFxuICBcIlBBTExTXCIsXG4gIFwiUEFMTFlcIixcbiAgXCJQQUxNU1wiLFxuICBcIlBBTE1ZXCIsXG4gIFwiUEFMU1lcIixcbiAgXCJQQU5EQVwiLFxuICBcIlBBTkVMXCIsXG4gIFwiUEFORVNcIixcbiAgXCJQQU5HQVwiLFxuICBcIlBBTkdTXCIsXG4gIFwiUEFOSUNcIixcbiAgXCJQQU5TWVwiLFxuICBcIlBBTlRTXCIsXG4gIFwiUEFOVFlcIixcbiAgXCJQQVBBTFwiLFxuICBcIlBBUEFTXCIsXG4gIFwiUEFQQVdcIixcbiAgXCJQQVBFUlwiLFxuICBcIlBBUFBZXCIsXG4gIFwiUEFSQVNcIixcbiAgXCJQQVJDSFwiLFxuICBcIlBBUkRTXCIsXG4gIFwiUEFSRURcIixcbiAgXCJQQVJFTlwiLFxuICBcIlBBUkVTXCIsXG4gIFwiUEFSS0FcIixcbiAgXCJQQVJLU1wiLFxuICBcIlBBUlJZXCIsXG4gIFwiUEFSU0VcIixcbiAgXCJQQVJUU1wiLFxuICBcIlBBUlRZXCIsXG4gIFwiUEFTSEFcIixcbiAgXCJQQVNTRVwiLFxuICBcIlBBU1RBXCIsXG4gIFwiUEFTVEVcIixcbiAgXCJQQVNUU1wiLFxuICBcIlBBU1RZXCIsXG4gIFwiUEFUQ0hcIixcbiAgXCJQQVRFTlwiLFxuICBcIlBBVEVSXCIsXG4gIFwiUEFURVNcIixcbiAgXCJQQVRIU1wiLFxuICBcIlBBVElPXCIsXG4gIFwiUEFUU1lcIixcbiAgXCJQQVRUWVwiLFxuICBcIlBBVVNFXCIsXG4gIFwiUEFWQU5cIixcbiAgXCJQQVZFRFwiLFxuICBcIlBBVkVSXCIsXG4gIFwiUEFWRVNcIixcbiAgXCJQQVdFRFwiLFxuICBcIlBBV0tZXCIsXG4gIFwiUEFXTFNcIixcbiAgXCJQQVdOU1wiLFxuICBcIlBBWUVEXCIsXG4gIFwiUEFZRUVcIixcbiAgXCJQQVlFUlwiLFxuICBcIlBFQUNFXCIsXG4gIFwiUEVBQ0hcIixcbiAgXCJQRUFLU1wiLFxuICBcIlBFQUtZXCIsXG4gIFwiUEVBTFNcIixcbiAgXCJQRUFSTFwiLFxuICBcIlBFQVJTXCIsXG4gIFwiUEVBU0VcIixcbiAgXCJQRUFUU1wiLFxuICBcIlBFQ0FOXCIsXG4gIFwiUEVDS1NcIixcbiAgXCJQRURBTFwiLFxuICBcIlBFRUtTXCIsXG4gIFwiUEVFTFNcIixcbiAgXCJQRUVOU1wiLFxuICBcIlBFRVBTXCIsXG4gIFwiUEVFUlNcIixcbiAgXCJQRUVWRVwiLFxuICBcIlBFS09FXCIsXG4gIFwiUEVMVFNcIixcbiAgXCJQRU5BTFwiLFxuICBcIlBFTkNFXCIsXG4gIFwiUEVORVNcIixcbiAgXCJQRU5HT1wiLFxuICBcIlBFTklTXCIsXG4gIFwiUEVOTllcIixcbiAgXCJQRU9OU1wiLFxuICBcIlBFT05ZXCIsXG4gIFwiUEVQUFlcIixcbiAgXCJQRVJDSFwiLFxuICBcIlBFUklMXCIsXG4gIFwiUEVSS1NcIixcbiAgXCJQRVJLWVwiLFxuICBcIlBFUk1TXCIsXG4gIFwiUEVTS1lcIixcbiAgXCJQRVNPU1wiLFxuICBcIlBFU1RPXCIsXG4gIFwiUEVTVFNcIixcbiAgXCJQRVRBTFwiLFxuICBcIlBFVEVSXCIsXG4gIFwiUEVUSVRcIixcbiAgXCJQRVRUWVwiLFxuICBcIlBFV0VFXCIsXG4gIFwiUEVXSVRcIixcbiAgXCJQSEFHRVwiLFxuICBcIlBISUFMXCIsXG4gIFwiUEhMT1hcIixcbiAgXCJQSE9ORVwiLFxuICBcIlBIT05ZXCIsXG4gIFwiUEhPVE9cIixcbiAgXCJQSFlMQVwiLFxuICBcIlBJQU5PXCIsXG4gIFwiUElDQVNcIixcbiAgXCJQSUNLU1wiLFxuICBcIlBJQ0tZXCIsXG4gIFwiUElDT1RcIixcbiAgXCJQSUVDRVwiLFxuICBcIlBJRVJTXCIsXG4gIFwiUElFVEFcIixcbiAgXCJQSUVUWVwiLFxuICBcIlBJR0dZXCIsXG4gIFwiUElHTVlcIixcbiAgXCJQSUtFUlwiLFxuICBcIlBJS0VTXCIsXG4gIFwiUElMQUZcIixcbiAgXCJQSUxBVVwiLFxuICBcIlBJTEVEXCIsXG4gIFwiUElMRVNcIixcbiAgXCJQSUxMU1wiLFxuICBcIlBJTE9UXCIsXG4gIFwiUElNUFNcIixcbiAgXCJQSU5DSFwiLFxuICBcIlBJTkVEXCIsXG4gIFwiUElORVNcIixcbiAgXCJQSU5FWVwiLFxuICBcIlBJTkdTXCIsXG4gIFwiUElOS09cIixcbiAgXCJQSU5LU1wiLFxuICBcIlBJTktZXCIsXG4gIFwiUElOVE9cIixcbiAgXCJQSU5UU1wiLFxuICBcIlBJTlVQXCIsXG4gIFwiUElPTlNcIixcbiAgXCJQSU9VU1wiLFxuICBcIlBJUEVEXCIsXG4gIFwiUElQRVJcIixcbiAgXCJQSVBFU1wiLFxuICBcIlBJUEVUXCIsXG4gIFwiUElRVUVcIixcbiAgXCJQSVRBU1wiLFxuICBcIlBJVENIXCIsXG4gIFwiUElUSFNcIixcbiAgXCJQSVRIWVwiLFxuICBcIlBJVE9OXCIsXG4gIFwiUElWT1RcIixcbiAgXCJQSVhFTFwiLFxuICBcIlBJWElFXCIsXG4gIFwiUElaWkFcIixcbiAgXCJQTEFDRVwiLFxuICBcIlBMQUlEXCIsXG4gIFwiUExBSU5cIixcbiAgXCJQTEFJVFwiLFxuICBcIlBMQU5FXCIsXG4gIFwiUExBTktcIixcbiAgXCJQTEFOU1wiLFxuICBcIlBMQU5UXCIsXG4gIFwiUExBU0hcIixcbiAgXCJQTEFTTVwiLFxuICBcIlBMQVRFXCIsXG4gIFwiUExBVFNcIixcbiAgXCJQTEFZQVwiLFxuICBcIlBMQVlTXCIsXG4gIFwiUExBWkFcIixcbiAgXCJQTEVBRFwiLFxuICBcIlBMRUFTXCIsXG4gIFwiUExFQVRcIixcbiAgXCJQTEVCRVwiLFxuICBcIlBMRUJTXCIsXG4gIFwiUExJRURcIixcbiAgXCJQTElFU1wiLFxuICBcIlBMSU5LXCIsXG4gIFwiUExPRFNcIixcbiAgXCJQTE9OS1wiLFxuICBcIlBMT1BTXCIsXG4gIFwiUExPVFNcIixcbiAgXCJQTE9XU1wiLFxuICBcIlBMT1lTXCIsXG4gIFwiUExVQ0tcIixcbiAgXCJQTFVHU1wiLFxuICBcIlBMVU1CXCIsXG4gIFwiUExVTUVcIixcbiAgXCJQTFVNUFwiLFxuICBcIlBMVU1TXCIsXG4gIFwiUExVTVlcIixcbiAgXCJQTFVOS1wiLFxuICBcIlBMVVNIXCIsXG4gIFwiUE9BQ0hcIixcbiAgXCJQT0NLU1wiLFxuICBcIlBPQ0tZXCIsXG4gIFwiUE9ER1lcIixcbiAgXCJQT0RJQVwiLFxuICBcIlBPRU1TXCIsXG4gIFwiUE9FU1lcIixcbiAgXCJQT0VUU1wiLFxuICBcIlBPSU5UXCIsXG4gIFwiUE9JU0VcIixcbiAgXCJQT0tFRFwiLFxuICBcIlBPS0VSXCIsXG4gIFwiUE9LRVNcIixcbiAgXCJQT0tFWVwiLFxuICBcIlBPTEFSXCIsXG4gIFwiUE9MRURcIixcbiAgXCJQT0xFUlwiLFxuICBcIlBPTEVTXCIsXG4gIFwiUE9MSU9cIixcbiAgXCJQT0xJU1wiLFxuICBcIlBPTEtBXCIsXG4gIFwiUE9MTFNcIixcbiAgXCJQT0xZUFwiLFxuICBcIlBPTVBTXCIsXG4gIFwiUE9ORFNcIixcbiAgXCJQT09DSFwiLFxuICBcIlBPT0hTXCIsXG4gIFwiUE9PTFNcIixcbiAgXCJQT09QU1wiLFxuICBcIlBPUEVTXCIsXG4gIFwiUE9QUFlcIixcbiAgXCJQT1JDSFwiLFxuICBcIlBPUkVEXCIsXG4gIFwiUE9SRVNcIixcbiAgXCJQT1JHWVwiLFxuICBcIlBPUktTXCIsXG4gIFwiUE9SS1lcIixcbiAgXCJQT1JOT1wiLFxuICBcIlBPUlRTXCIsXG4gIFwiUE9TRURcIixcbiAgXCJQT1NFUlwiLFxuICBcIlBPU0VTXCIsXG4gIFwiUE9TSVRcIixcbiAgXCJQT1NTRVwiLFxuICBcIlBPU1RTXCIsXG4gIFwiUE9UVFlcIixcbiAgXCJQT1VDSFwiLFxuICBcIlBPVUZTXCIsXG4gIFwiUE9VTkRcIixcbiAgXCJQT1VSU1wiLFxuICBcIlBPVVRTXCIsXG4gIFwiUE9XRVJcIixcbiAgXCJQT1hFU1wiLFxuICBcIlBSQU1TXCIsXG4gIFwiUFJBTktcIixcbiAgXCJQUkFURVwiLFxuICBcIlBSQVRTXCIsXG4gIFwiUFJBV05cIixcbiAgXCJQUkFZU1wiLFxuICBcIlBSRUVOXCIsXG4gIFwiUFJFUFNcIixcbiAgXCJQUkVTU1wiLFxuICBcIlBSRVhZXCIsXG4gIFwiUFJFWVNcIixcbiAgXCJQUklDRVwiLFxuICBcIlBSSUNLXCIsXG4gIFwiUFJJREVcIixcbiAgXCJQUklFRFwiLFxuICBcIlBSSUVTXCIsXG4gIFwiUFJJR1NcIixcbiAgXCJQUklNRVwiLFxuICBcIlBSSU1PXCIsXG4gIFwiUFJJTVBcIixcbiAgXCJQUklNU1wiLFxuICBcIlBSSU5LXCIsXG4gIFwiUFJJTlRcIixcbiAgXCJQUklPUlwiLFxuICBcIlBSSVNFXCIsXG4gIFwiUFJJU01cIixcbiAgXCJQUklWWVwiLFxuICBcIlBSSVpFXCIsXG4gIFwiUFJPQkVcIixcbiAgXCJQUk9EU1wiLFxuICBcIlBST0VNXCIsXG4gIFwiUFJPRlNcIixcbiAgXCJQUk9NT1wiLFxuICBcIlBST01TXCIsXG4gIFwiUFJPTkVcIixcbiAgXCJQUk9OR1wiLFxuICBcIlBST09GXCIsXG4gIFwiUFJPUFNcIixcbiAgXCJQUk9TRVwiLFxuICBcIlBST1NZXCIsXG4gIFwiUFJPVURcIixcbiAgXCJQUk9WRVwiLFxuICBcIlBST1dMXCIsXG4gIFwiUFJPV1NcIixcbiAgXCJQUk9YWVwiLFxuICBcIlBSVURFXCIsXG4gIFwiUFJVTkVcIixcbiAgXCJQU0FMTVwiLFxuICBcIlBTRVVEXCIsXG4gIFwiUFNIQVdcIixcbiAgXCJQU09BU1wiLFxuICBcIlBTWUNIXCIsXG4gIFwiUFVCRVNcIixcbiAgXCJQVUJJQ1wiLFxuICBcIlBVQklTXCIsXG4gIFwiUFVDS1NcIixcbiAgXCJQVURHWVwiLFxuICBcIlBVRkZTXCIsXG4gIFwiUFVGRllcIixcbiAgXCJQVUtFRFwiLFxuICBcIlBVS0VTXCIsXG4gIFwiUFVLS0FcIixcbiAgXCJQVUxMU1wiLFxuICBcIlBVTFBTXCIsXG4gIFwiUFVMUFlcIixcbiAgXCJQVUxTRVwiLFxuICBcIlBVTUFTXCIsXG4gIFwiUFVNUFNcIixcbiAgXCJQVU5DSFwiLFxuICBcIlBVTktTXCIsXG4gIFwiUFVOS1lcIixcbiAgXCJQVU5OWVwiLFxuICBcIlBVTlRTXCIsXG4gIFwiUFVQQUVcIixcbiAgXCJQVVBJTFwiLFxuICBcIlBVUFBZXCIsXG4gIFwiUFVSRUVcIixcbiAgXCJQVVJFUlwiLFxuICBcIlBVUkdFXCIsXG4gIFwiUFVSTFNcIixcbiAgXCJQVVJSU1wiLFxuICBcIlBVUlNFXCIsXG4gIFwiUFVSVFlcIixcbiAgXCJQVVNIWVwiLFxuICBcIlBVU1NZXCIsXG4gIFwiUFVUVFNcIixcbiAgXCJQVVRUWVwiLFxuICBcIlBZR01ZXCIsXG4gIFwiUFlMT05cIixcbiAgXCJQWVJFU1wiLFxuICBcIlFVQUNLXCIsXG4gIFwiUVVBRFNcIixcbiAgXCJRVUFGRlwiLFxuICBcIlFVQUlMXCIsXG4gIFwiUVVBS0VcIixcbiAgXCJRVUFMTVwiLFxuICBcIlFVQVJLXCIsXG4gIFwiUVVBUlRcIixcbiAgXCJRVUFTSFwiLFxuICBcIlFVQVNJXCIsXG4gIFwiUVVBWVNcIixcbiAgXCJRVUVFTlwiLFxuICBcIlFVRUVSXCIsXG4gIFwiUVVFTExcIixcbiAgXCJRVUVSWVwiLFxuICBcIlFVRVNUXCIsXG4gIFwiUVVFVUVcIixcbiAgXCJRVUlDS1wiLFxuICBcIlFVSURTXCIsXG4gIFwiUVVJRVRcIixcbiAgXCJRVUlGRlwiLFxuICBcIlFVSUxMXCIsXG4gIFwiUVVJTFRcIixcbiAgXCJRVUlOVFwiLFxuICBcIlFVSVBTXCIsXG4gIFwiUVVJUFVcIixcbiAgXCJRVUlSRVwiLFxuICBcIlFVSVJLXCIsXG4gIFwiUVVJUlRcIixcbiAgXCJRVUlURVwiLFxuICBcIlFVSVRTXCIsXG4gIFwiUVVPSU5cIixcbiAgXCJRVU9JVFwiLFxuICBcIlFVT1RBXCIsXG4gIFwiUVVPVEVcIixcbiAgXCJRVU9USFwiLFxuICBcIlJBQkJJXCIsXG4gIFwiUkFCSURcIixcbiAgXCJSQUNFRFwiLFxuICBcIlJBQ0VSXCIsXG4gIFwiUkFDRVNcIixcbiAgXCJSQUNLU1wiLFxuICBcIlJBREFSXCIsXG4gIFwiUkFESUlcIixcbiAgXCJSQURJT1wiLFxuICBcIlJBRElYXCIsXG4gIFwiUkFET05cIixcbiAgXCJSQUZUU1wiLFxuICBcIlJBR0VEXCIsXG4gIFwiUkFHRVNcIixcbiAgXCJSQUlEU1wiLFxuICBcIlJBSUxTXCIsXG4gIFwiUkFJTlNcIixcbiAgXCJSQUlOWVwiLFxuICBcIlJBSVNFXCIsXG4gIFwiUkFKQUhcIixcbiAgXCJSQUpBU1wiLFxuICBcIlJBS0VEXCIsXG4gIFwiUkFLRVNcIixcbiAgXCJSQUxMWVwiLFxuICBcIlJBTVBTXCIsXG4gIFwiUkFOQ0hcIixcbiAgXCJSQU5EU1wiLFxuICBcIlJBTkRZXCIsXG4gIFwiUkFOR0VcIixcbiAgXCJSQU5HWVwiLFxuICBcIlJBTktTXCIsXG4gIFwiUkFOVFNcIixcbiAgXCJSQVBFUlwiLFxuICBcIlJBUElEXCIsXG4gIFwiUkFSRVJcIixcbiAgXCJSQVNQU1wiLFxuICBcIlJBU1BZXCIsXG4gIFwiUkFURURcIixcbiAgXCJSQVRFU1wiLFxuICBcIlJBVEhTXCIsXG4gIFwiUkFUSU9cIixcbiAgXCJSQVRUWVwiLFxuICBcIlJBVkVEXCIsXG4gIFwiUkFWRUxcIixcbiAgXCJSQVZFTlwiLFxuICBcIlJBVkVSXCIsXG4gIFwiUkFWRVNcIixcbiAgXCJSQVdFUlwiLFxuICBcIlJBWUVEXCIsXG4gIFwiUkFZT05cIixcbiAgXCJSQVpFRFwiLFxuICBcIlJBWkVTXCIsXG4gIFwiUkFaT1JcIixcbiAgXCJSRUFDSFwiLFxuICBcIlJFQUNUXCIsXG4gIFwiUkVBRFNcIixcbiAgXCJSRUFEWVwiLFxuICBcIlJFQUxNXCIsXG4gIFwiUkVBTFNcIixcbiAgXCJSRUFNU1wiLFxuICBcIlJFQVBTXCIsXG4gIFwiUkVBUk1cIixcbiAgXCJSRUFSU1wiLFxuICBcIlJFQkFSXCIsXG4gIFwiUkVCRUxcIixcbiAgXCJSRUJJRFwiLFxuICBcIlJFQlVTXCIsXG4gIFwiUkVCVVRcIixcbiAgXCJSRUNBUFwiLFxuICBcIlJFQ1RBXCIsXG4gIFwiUkVDVE9cIixcbiAgXCJSRUNVUlwiLFxuICBcIlJFQ1VUXCIsXG4gIFwiUkVESURcIixcbiAgXCJSRURPWFwiLFxuICBcIlJFRFVYXCIsXG4gIFwiUkVFRFNcIixcbiAgXCJSRUVEWVwiLFxuICBcIlJFRUZTXCIsXG4gIFwiUkVFS1NcIixcbiAgXCJSRUVMU1wiLFxuICBcIlJFRVZFXCIsXG4gIFwiUkVGRVJcIixcbiAgXCJSRUZJVFwiLFxuICBcIlJFRklYXCIsXG4gIFwiUkVHQUxcIixcbiAgXCJSRUhBQlwiLFxuICBcIlJFSUZZXCIsXG4gIFwiUkVJR05cIixcbiAgXCJSRUlOU1wiLFxuICBcIlJFTEFYXCIsXG4gIFwiUkVMQVlcIixcbiAgXCJSRUxFVFwiLFxuICBcIlJFTElDXCIsXG4gIFwiUkVNQU5cIixcbiAgXCJSRU1BUFwiLFxuICBcIlJFTUlUXCIsXG4gIFwiUkVNSVhcIixcbiAgXCJSRU5BTFwiLFxuICBcIlJFTkRTXCIsXG4gIFwiUkVORVdcIixcbiAgXCJSRU5UU1wiLFxuICBcIlJFUEFZXCIsXG4gIFwiUkVQRUxcIixcbiAgXCJSRVBMWVwiLFxuICBcIlJFUFJPXCIsXG4gIFwiUkVSQU5cIixcbiAgXCJSRVJVTlwiLFxuICBcIlJFU0VUXCIsXG4gIFwiUkVTSU5cIixcbiAgXCJSRVNUU1wiLFxuICBcIlJFVENIXCIsXG4gIFwiUkVUUk9cIixcbiAgXCJSRVRSWVwiLFxuICBcIlJFVVNFXCIsXG4gIFwiUkVWRUxcIixcbiAgXCJSRVZFVFwiLFxuICBcIlJFVlVFXCIsXG4gIFwiUkhFQVNcIixcbiAgXCJSSEVVTVwiLFxuICBcIlJISU5PXCIsXG4gIFwiUkhVTUJcIixcbiAgXCJSSFlNRVwiLFxuICBcIlJJQUxTXCIsXG4gIFwiUklCQllcIixcbiAgXCJSSUNFRFwiLFxuICBcIlJJQ0VSXCIsXG4gIFwiUklDRVNcIixcbiAgXCJSSURFUlwiLFxuICBcIlJJREVTXCIsXG4gIFwiUklER0VcIixcbiAgXCJSSUZMRVwiLFxuICBcIlJJRlRTXCIsXG4gIFwiUklHSFRcIixcbiAgXCJSSUdJRFwiLFxuICBcIlJJR09SXCIsXG4gIFwiUklMRURcIixcbiAgXCJSSUxFU1wiLFxuICBcIlJJTExFXCIsXG4gIFwiUklMTFNcIixcbiAgXCJSSU1FRFwiLFxuICBcIlJJTUVTXCIsXG4gIFwiUklORFNcIixcbiAgXCJSSU5HU1wiLFxuICBcIlJJTktTXCIsXG4gIFwiUklOU0VcIixcbiAgXCJSSU9UU1wiLFxuICBcIlJJUEVOXCIsXG4gIFwiUklQRVJcIixcbiAgXCJSSVNFTlwiLFxuICBcIlJJU0VSXCIsXG4gIFwiUklTRVNcIixcbiAgXCJSSVNLU1wiLFxuICBcIlJJU0tZXCIsXG4gIFwiUklURVNcIixcbiAgXCJSSVRaWVwiLFxuICBcIlJJVkFMXCIsXG4gIFwiUklWRURcIixcbiAgXCJSSVZFTlwiLFxuICBcIlJJVkVSXCIsXG4gIFwiUklWRVNcIixcbiAgXCJSSVZFVFwiLFxuICBcIlJPQUNIXCIsXG4gIFwiUk9BRFNcIixcbiAgXCJST0FNU1wiLFxuICBcIlJPQU5TXCIsXG4gIFwiUk9BUlNcIixcbiAgXCJST0FTVFwiLFxuICBcIlJPQkVEXCIsXG4gIFwiUk9CRVNcIixcbiAgXCJST0JJTlwiLFxuICBcIlJPQk9UXCIsXG4gIFwiUk9DS1NcIixcbiAgXCJST0NLWVwiLFxuICBcIlJPREVPXCIsXG4gIFwiUk9HRVJcIixcbiAgXCJST0dVRVwiLFxuICBcIlJPSURTXCIsXG4gIFwiUk9JTFNcIixcbiAgXCJST0lMWVwiLFxuICBcIlJPTEVTXCIsXG4gIFwiUk9MTFNcIixcbiAgXCJST01BTlwiLFxuICBcIlJPTVBTXCIsXG4gIFwiUk9ORE9cIixcbiAgXCJST09EU1wiLFxuICBcIlJPT0ZTXCIsXG4gIFwiUk9PS1NcIixcbiAgXCJST09NU1wiLFxuICBcIlJPT01ZXCIsXG4gIFwiUk9PU1RcIixcbiAgXCJST09UU1wiLFxuICBcIlJPUEVEXCIsXG4gIFwiUk9QRVJcIixcbiAgXCJST1BFU1wiLFxuICBcIlJPU0VTXCIsXG4gIFwiUk9TSU5cIixcbiAgXCJST1RPUlwiLFxuICBcIlJPVUdFXCIsXG4gIFwiUk9VR0hcIixcbiAgXCJST1VORFwiLFxuICBcIlJPVVNFXCIsXG4gIFwiUk9VU1RcIixcbiAgXCJST1VURVwiLFxuICBcIlJPVVRTXCIsXG4gIFwiUk9WRURcIixcbiAgXCJST1ZFUlwiLFxuICBcIlJPVkVTXCIsXG4gIFwiUk9XQU5cIixcbiAgXCJST1dEWVwiLFxuICBcIlJPV0VEXCIsXG4gIFwiUk9XRVJcIixcbiAgXCJST1lBTFwiLFxuICBcIlJVQkVTXCIsXG4gIFwiUlVCTEVcIixcbiAgXCJSVUNIRVwiLFxuICBcIlJVRERZXCIsXG4gIFwiUlVERVJcIixcbiAgXCJSVUZGU1wiLFxuICBcIlJVR0JZXCIsXG4gIFwiUlVJTkdcIixcbiAgXCJSVUlOU1wiLFxuICBcIlJVTEVEXCIsXG4gIFwiUlVMRVJcIixcbiAgXCJSVUxFU1wiLFxuICBcIlJVTUJBXCIsXG4gIFwiUlVNRU5cIixcbiAgXCJSVU1NWVwiLFxuICBcIlJVTU9SXCIsXG4gIFwiUlVNUFNcIixcbiAgXCJSVU5FU1wiLFxuICBcIlJVTkdTXCIsXG4gIFwiUlVOTllcIixcbiAgXCJSVU5UU1wiLFxuICBcIlJVUEVFXCIsXG4gIFwiUlVSQUxcIixcbiAgXCJSVVNFU1wiLFxuICBcIlJVU0tTXCIsXG4gIFwiUlVTVFNcIixcbiAgXCJSVVNUWVwiLFxuICBcIlNBQkVSXCIsXG4gIFwiU0FCTEVcIixcbiAgXCJTQUJSQVwiLFxuICBcIlNBQlJFXCIsXG4gIFwiU0FDS1NcIixcbiAgXCJTQURMWVwiLFxuICBcIlNBRkVSXCIsXG4gIFwiU0FGRVNcIixcbiAgXCJTQUdBU1wiLFxuICBcIlNBR0VTXCIsXG4gIFwiU0FISUJcIixcbiAgXCJTQUlMU1wiLFxuICBcIlNBSU5UXCIsXG4gIFwiU0FJVEhcIixcbiAgXCJTQUtFU1wiLFxuICBcIlNBTEFEXCIsXG4gIFwiU0FMRVNcIixcbiAgXCJTQUxMWVwiLFxuICBcIlNBTE9OXCIsXG4gIFwiU0FMU0FcIixcbiAgXCJTQUxUU1wiLFxuICBcIlNBTFRZXCIsXG4gIFwiU0FMVkVcIixcbiAgXCJTQUxWT1wiLFxuICBcIlNBTUJBXCIsXG4gIFwiU0FORFNcIixcbiAgXCJTQU5EWVwiLFxuICBcIlNBTkVSXCIsXG4gIFwiU0FQUFlcIixcbiAgXCJTQVJBTlwiLFxuICBcIlNBUkdFXCIsXG4gIFwiU0FSSVNcIixcbiAgXCJTQVNTWVwiLFxuICBcIlNBVEVEXCIsXG4gIFwiU0FUSU5cIixcbiAgXCJTQVRZUlwiLFxuICBcIlNBVUNFXCIsXG4gIFwiU0FVQ1lcIixcbiAgXCJTQVVOQVwiLFxuICBcIlNBVVRFXCIsXG4gIFwiU0FWRURcIixcbiAgXCJTQVZFUlwiLFxuICBcIlNBVkVTXCIsXG4gIFwiU0FWT1JcIixcbiAgXCJTQVZWWVwiLFxuICBcIlNBV0VEXCIsXG4gIFwiU0FYRVNcIixcbiAgXCJTQ0FCU1wiLFxuICBcIlNDQURTXCIsXG4gIFwiU0NBTERcIixcbiAgXCJTQ0FMRVwiLFxuICBcIlNDQUxQXCIsXG4gIFwiU0NBTFlcIixcbiAgXCJTQ0FNUFwiLFxuICBcIlNDQU1TXCIsXG4gIFwiU0NBTlNcIixcbiAgXCJTQ0FOVFwiLFxuICBcIlNDQVJFXCIsXG4gIFwiU0NBUkZcIixcbiAgXCJTQ0FSUFwiLFxuICBcIlNDQVJTXCIsXG4gIFwiU0NBUllcIixcbiAgXCJTQ0FUU1wiLFxuICBcIlNDRU5FXCIsXG4gIFwiU0NFTlRcIixcbiAgXCJTQ0hNT1wiLFxuICBcIlNDSFdBXCIsXG4gIFwiU0NJT05cIixcbiAgXCJTQ09GRlwiLFxuICBcIlNDT0xEXCIsXG4gIFwiU0NPTkVcIixcbiAgXCJTQ09PUFwiLFxuICBcIlNDT09UXCIsXG4gIFwiU0NPUEVcIixcbiAgXCJTQ09SRVwiLFxuICBcIlNDT1JOXCIsXG4gIFwiU0NPVVJcIixcbiAgXCJTQ09VVFwiLFxuICBcIlNDT1dMXCIsXG4gIFwiU0NPV1NcIixcbiAgXCJTQ1JBTVwiLFxuICBcIlNDUkFQXCIsXG4gIFwiU0NSRVdcIixcbiAgXCJTQ1JJTVwiLFxuICBcIlNDUklQXCIsXG4gIFwiU0NST0RcIixcbiAgXCJTQ1JVQlwiLFxuICBcIlNDUlVNXCIsXG4gIFwiU0NVQkFcIixcbiAgXCJTQ1VESVwiLFxuICBcIlNDVURPXCIsXG4gIFwiU0NVRFNcIixcbiAgXCJTQ1VGRlwiLFxuICBcIlNDVUxMXCIsXG4gIFwiU0NVTVNcIixcbiAgXCJTQ1VSRlwiLFxuICBcIlNDVVpaXCIsXG4gIFwiU0VBTFNcIixcbiAgXCJTRUFNU1wiLFxuICBcIlNFQU1ZXCIsXG4gIFwiU0VBUlNcIixcbiAgXCJTRUFUU1wiLFxuICBcIlNFQlVNXCIsXG4gIFwiU0VDQ09cIixcbiAgXCJTRUNUU1wiLFxuICBcIlNFREFOXCIsXG4gIFwiU0VERVJcIixcbiAgXCJTRURHRVwiLFxuICBcIlNFRFVNXCIsXG4gIFwiU0VFRFNcIixcbiAgXCJTRUVEWVwiLFxuICBcIlNFRUtTXCIsXG4gIFwiU0VFTVNcIixcbiAgXCJTRUVQU1wiLFxuICBcIlNFRVJTXCIsXG4gIFwiU0VHVUVcIixcbiAgXCJTRUlORVwiLFxuICBcIlNFSVpFXCIsXG4gIFwiU0VMQUhcIixcbiAgXCJTRUxGU1wiLFxuICBcIlNFTExTXCIsXG4gIFwiU0VNRU5cIixcbiAgXCJTRU1JU1wiLFxuICBcIlNFTkRTXCIsXG4gIFwiU0VOU0VcIixcbiAgXCJTRVBBTFwiLFxuICBcIlNFUElBXCIsXG4gIFwiU0VQT1lcIixcbiAgXCJTRVBUQVwiLFxuICBcIlNFUkZTXCIsXG4gIFwiU0VSR0VcIixcbiAgXCJTRVJJRlwiLFxuICBcIlNFUlVNXCIsXG4gIFwiU0VSVkVcIixcbiAgXCJTRVJWT1wiLFxuICBcIlNFVFVQXCIsXG4gIFwiU0VWRU5cIixcbiAgXCJTRVZFUlwiLFxuICBcIlNFV0VEXCIsXG4gIFwiU0VXRVJcIixcbiAgXCJTRVhFRFwiLFxuICBcIlNFWEVTXCIsXG4gIFwiU0hBQ0tcIixcbiAgXCJTSEFERVwiLFxuICBcIlNIQURTXCIsXG4gIFwiU0hBRFlcIixcbiAgXCJTSEFGVFwiLFxuICBcIlNIQUdTXCIsXG4gIFwiU0hBSFNcIixcbiAgXCJTSEFLRVwiLFxuICBcIlNIQUtPXCIsXG4gIFwiU0hBS1lcIixcbiAgXCJTSEFMRVwiLFxuICBcIlNIQUxMXCIsXG4gIFwiU0hBTFRcIixcbiAgXCJTSEFNRVwiLFxuICBcIlNIQU1TXCIsXG4gIFwiU0hBTktcIixcbiAgXCJTSEFQRVwiLFxuICBcIlNIQVJEXCIsXG4gIFwiU0hBUkVcIixcbiAgXCJTSEFSS1wiLFxuICBcIlNIQVJQXCIsXG4gIFwiU0hBVkVcIixcbiAgXCJTSEFXTFwiLFxuICBcIlNIQVdNXCIsXG4gIFwiU0hBWVNcIixcbiAgXCJTSEVBRlwiLFxuICBcIlNIRUFSXCIsXG4gIFwiU0hFRFNcIixcbiAgXCJTSEVFTlwiLFxuICBcIlNIRUVQXCIsXG4gIFwiU0hFRVJcIixcbiAgXCJTSEVFVFwiLFxuICBcIlNIRUlLXCIsXG4gIFwiU0hFTEZcIixcbiAgXCJTSEVMTFwiLFxuICBcIlNIRVJEXCIsXG4gIFwiU0hFV1NcIixcbiAgXCJTSElFRFwiLFxuICBcIlNISUVTXCIsXG4gIFwiU0hJRlRcIixcbiAgXCJTSElMTFwiLFxuICBcIlNISU1TXCIsXG4gIFwiU0hJTkVcIixcbiAgXCJTSElOU1wiLFxuICBcIlNISU5ZXCIsXG4gIFwiU0hJUFNcIixcbiAgXCJTSElSRVwiLFxuICBcIlNISVJLXCIsXG4gIFwiU0hJUlJcIixcbiAgXCJTSElSVFwiLFxuICBcIlNISVRTXCIsXG4gIFwiU0hMRVBcIixcbiAgXCJTSE9BTFwiLFxuICBcIlNIT0FUXCIsXG4gIFwiU0hPQ0tcIixcbiAgXCJTSE9FU1wiLFxuICBcIlNIT0pJXCIsXG4gIFwiU0hPTkVcIixcbiAgXCJTSE9PS1wiLFxuICBcIlNIT09TXCIsXG4gIFwiU0hPT1RcIixcbiAgXCJTSE9QU1wiLFxuICBcIlNIT1JFXCIsXG4gIFwiU0hPUk5cIixcbiAgXCJTSE9SVFwiLFxuICBcIlNIT1RTXCIsXG4gIFwiU0hPVVRcIixcbiAgXCJTSE9WRVwiLFxuICBcIlNIT1dOXCIsXG4gIFwiU0hPV1NcIixcbiAgXCJTSE9XWVwiLFxuICBcIlNIUkVEXCIsXG4gIFwiU0hSRVdcIixcbiAgXCJTSFJVQlwiLFxuICBcIlNIUlVHXCIsXG4gIFwiU0hVQ0tcIixcbiAgXCJTSFVOU1wiLFxuICBcIlNIVU5UXCIsXG4gIFwiU0hVU0hcIixcbiAgXCJTSFVUU1wiLFxuICBcIlNIWUVSXCIsXG4gIFwiU0hZTFlcIixcbiAgXCJTSUJZTFwiLFxuICBcIlNJQ0tPXCIsXG4gIFwiU0lDS1NcIixcbiAgXCJTSURFRFwiLFxuICBcIlNJREVTXCIsXG4gIFwiU0lETEVcIixcbiAgXCJTSUVHRVwiLFxuICBcIlNJRVZFXCIsXG4gIFwiU0lHSFNcIixcbiAgXCJTSUdIVFwiLFxuICBcIlNJR01BXCIsXG4gIFwiU0lHTlNcIixcbiAgXCJTSUxLU1wiLFxuICBcIlNJTEtZXCIsXG4gIFwiU0lMTFNcIixcbiAgXCJTSUxMWVwiLFxuICBcIlNJTE9TXCIsXG4gIFwiU0lMVFNcIixcbiAgXCJTSU5DRVwiLFxuICBcIlNJTkVTXCIsXG4gIFwiU0lORVdcIixcbiAgXCJTSU5HRVwiLFxuICBcIlNJTkdTXCIsXG4gIFwiU0lOS1NcIixcbiAgXCJTSU5VU1wiLFxuICBcIlNJUkVEXCIsXG4gIFwiU0lSRUVcIixcbiAgXCJTSVJFTlwiLFxuICBcIlNJUkVTXCIsXG4gIFwiU0lSVVBcIixcbiAgXCJTSVNBTFwiLFxuICBcIlNJU1NZXCIsXG4gIFwiU0lUQVJcIixcbiAgXCJTSVRFRFwiLFxuICBcIlNJVEVTXCIsXG4gIFwiU0lUVVNcIixcbiAgXCJTSVhFU1wiLFxuICBcIlNJWFRIXCIsXG4gIFwiU0lYVFlcIixcbiAgXCJTSVpFRFwiLFxuICBcIlNJWkVTXCIsXG4gIFwiU0tBVEVcIixcbiAgXCJTS0VFVFwiLFxuICBcIlNLRUlOXCIsXG4gIFwiU0tFV1NcIixcbiAgXCJTS0lEU1wiLFxuICBcIlNLSUVEXCIsXG4gIFwiU0tJRVJcIixcbiAgXCJTS0lFU1wiLFxuICBcIlNLSUZGXCIsXG4gIFwiU0tJTExcIixcbiAgXCJTS0lNUFwiLFxuICBcIlNLSU1TXCIsXG4gIFwiU0tJTlNcIixcbiAgXCJTS0lOVFwiLFxuICBcIlNLSVBTXCIsXG4gIFwiU0tJUlRcIixcbiAgXCJTS0lUU1wiLFxuICBcIlNLT0FMXCIsXG4gIFwiU0tVTEtcIixcbiAgXCJTS1VMTFwiLFxuICBcIlNLVU5LXCIsXG4gIFwiU0xBQlNcIixcbiAgXCJTTEFDS1wiLFxuICBcIlNMQUdTXCIsXG4gIFwiU0xBSU5cIixcbiAgXCJTTEFLRVwiLFxuICBcIlNMQU1TXCIsXG4gIFwiU0xBTkdcIixcbiAgXCJTTEFOVFwiLFxuICBcIlNMQVBTXCIsXG4gIFwiU0xBU0hcIixcbiAgXCJTTEFURVwiLFxuICBcIlNMQVRTXCIsXG4gIFwiU0xBVkVcIixcbiAgXCJTTEFZU1wiLFxuICBcIlNMRURTXCIsXG4gIFwiU0xFRUtcIixcbiAgXCJTTEVFUFwiLFxuICBcIlNMRUVUXCIsXG4gIFwiU0xFUFRcIixcbiAgXCJTTEVXU1wiLFxuICBcIlNMSUNFXCIsXG4gIFwiU0xJQ0tcIixcbiAgXCJTTElERVwiLFxuICBcIlNMSUxZXCIsXG4gIFwiU0xJTUVcIixcbiAgXCJTTElNU1wiLFxuICBcIlNMSU1ZXCIsXG4gIFwiU0xJTkdcIixcbiAgXCJTTElOS1wiLFxuICBcIlNMSVBTXCIsXG4gIFwiU0xJVFNcIixcbiAgXCJTTE9CU1wiLFxuICBcIlNMT0VTXCIsXG4gIFwiU0xPR1NcIixcbiAgXCJTTE9NT1wiLFxuICBcIlNMT09QXCIsXG4gIFwiU0xPUEVcIixcbiAgXCJTTE9QU1wiLFxuICBcIlNMT1NIXCIsXG4gIFwiU0xPVEhcIixcbiAgXCJTTE9UU1wiLFxuICBcIlNMT1dTXCIsXG4gIFwiU0xVRURcIixcbiAgXCJTTFVFU1wiLFxuICBcIlNMVUdTXCIsXG4gIFwiU0xVTVBcIixcbiAgXCJTTFVNU1wiLFxuICBcIlNMVU5HXCIsXG4gIFwiU0xVTktcIixcbiAgXCJTTFVSUFwiLFxuICBcIlNMVVJTXCIsXG4gIFwiU0xVU0hcIixcbiAgXCJTTFVUU1wiLFxuICBcIlNMWUVSXCIsXG4gIFwiU0xZTFlcIixcbiAgXCJTTUFDS1wiLFxuICBcIlNNQUxMXCIsXG4gIFwiU01BUlRcIixcbiAgXCJTTUFTSFwiLFxuICBcIlNNRUFSXCIsXG4gIFwiU01FTExcIixcbiAgXCJTTUVMVFwiLFxuICBcIlNNSUxFXCIsXG4gIFwiU01JUktcIixcbiAgXCJTTUlURVwiLFxuICBcIlNNSVRIXCIsXG4gIFwiU01PQ0tcIixcbiAgXCJTTU9HU1wiLFxuICBcIlNNT0tFXCIsXG4gIFwiU01PS1lcIixcbiAgXCJTTU9URVwiLFxuICBcIlNNVVRTXCIsXG4gIFwiU05BQ0tcIixcbiAgXCJTTkFGVVwiLFxuICBcIlNOQUdTXCIsXG4gIFwiU05BSUxcIixcbiAgXCJTTkFLRVwiLFxuICBcIlNOQUtZXCIsXG4gIFwiU05BUFNcIixcbiAgXCJTTkFSRVwiLFxuICBcIlNOQVJGXCIsXG4gIFwiU05BUktcIixcbiAgXCJTTkFSTFwiLFxuICBcIlNORUFLXCIsXG4gIFwiU05FRVJcIixcbiAgXCJTTklERVwiLFxuICBcIlNOSUZGXCIsXG4gIFwiU05JUEVcIixcbiAgXCJTTklQU1wiLFxuICBcIlNOSVRTXCIsXG4gIFwiU05PQlNcIixcbiAgXCJTTk9PRFwiLFxuICBcIlNOT09LXCIsXG4gIFwiU05PT1BcIixcbiAgXCJTTk9PVFwiLFxuICBcIlNOT1JFXCIsXG4gIFwiU05PUlRcIixcbiAgXCJTTk9UU1wiLFxuICBcIlNOT1VUXCIsXG4gIFwiU05PV1NcIixcbiAgXCJTTk9XWVwiLFxuICBcIlNOVUJTXCIsXG4gIFwiU05VQ0tcIixcbiAgXCJTTlVGRlwiLFxuICBcIlNOVUdTXCIsXG4gIFwiU09BS1NcIixcbiAgXCJTT0FQU1wiLFxuICBcIlNPQVBZXCIsXG4gIFwiU09BUlNcIixcbiAgXCJTT0JFUlwiLFxuICBcIlNPQ0tPXCIsXG4gIFwiU09DS1NcIixcbiAgXCJTT0NMRVwiLFxuICBcIlNPREFTXCIsXG4gIFwiU09GQVNcIixcbiAgXCJTT0ZUWVwiLFxuICBcIlNPR0dZXCIsXG4gIFwiU09JTFNcIixcbiAgXCJTT0xBUlwiLFxuICBcIlNPTEVEXCIsXG4gIFwiU09MRVNcIixcbiAgXCJTT0xJRFwiLFxuICBcIlNPTE9TXCIsXG4gIFwiU09MVkVcIixcbiAgXCJTT01BU1wiLFxuICBcIlNPTkFSXCIsXG4gIFwiU09OR1NcIixcbiAgXCJTT05JQ1wiLFxuICBcIlNPTk5ZXCIsXG4gIFwiU09PVEhcIixcbiAgXCJTT09UU1wiLFxuICBcIlNPT1RZXCIsXG4gIFwiU09QUFlcIixcbiAgXCJTT1JFUlwiLFxuICBcIlNPUkVTXCIsXG4gIFwiU09SUllcIixcbiAgXCJTT1JUQVwiLFxuICBcIlNPUlRTXCIsXG4gIFwiU09VTFNcIixcbiAgXCJTT1VORFwiLFxuICBcIlNPVVBTXCIsXG4gIFwiU09VUFlcIixcbiAgXCJTT1VSU1wiLFxuICBcIlNPVVNFXCIsXG4gIFwiU09VVEhcIixcbiAgXCJTT1dFRFwiLFxuICBcIlNQQUNFXCIsXG4gIFwiU1BBQ1lcIixcbiAgXCJTUEFERVwiLFxuICBcIlNQQUtFXCIsXG4gIFwiU1BBTkdcIixcbiAgXCJTUEFOS1wiLFxuICBcIlNQQU5TXCIsXG4gIFwiU1BBUkVcIixcbiAgXCJTUEFSS1wiLFxuICBcIlNQQVJTXCIsXG4gIFwiU1BBU01cIixcbiAgXCJTUEFURVwiLFxuICBcIlNQQVRTXCIsXG4gIFwiU1BBV05cIixcbiAgXCJTUEFZU1wiLFxuICBcIlNQQVpaXCIsXG4gIFwiU1BFQUtcIixcbiAgXCJTUEVBUlwiLFxuICBcIlNQRUNLXCIsXG4gIFwiU1BFQ1NcIixcbiAgXCJTUEVFRFwiLFxuICBcIlNQRUxMXCIsXG4gIFwiU1BFTFRcIixcbiAgXCJTUEVORFwiLFxuICBcIlNQRU5UXCIsXG4gIFwiU1BFUk1cIixcbiAgXCJTUEVXU1wiLFxuICBcIlNQSUNFXCIsXG4gIFwiU1BJQ1NcIixcbiAgXCJTUElDWVwiLFxuICBcIlNQSUVEXCIsXG4gIFwiU1BJRUxcIixcbiAgXCJTUElFU1wiLFxuICBcIlNQSUZGXCIsXG4gIFwiU1BJS0VcIixcbiAgXCJTUElLWVwiLFxuICBcIlNQSUxMXCIsXG4gIFwiU1BJTFRcIixcbiAgXCJTUElORVwiLFxuICBcIlNQSU5TXCIsXG4gIFwiU1BJUkVcIixcbiAgXCJTUElURVwiLFxuICBcIlNQSVRTXCIsXG4gIFwiU1BJVFpcIixcbiAgXCJTUElWU1wiLFxuICBcIlNQTEFUXCIsXG4gIFwiU1BMQVlcIixcbiAgXCJTUExJVFwiLFxuICBcIlNQT0lMXCIsXG4gIFwiU1BPS0VcIixcbiAgXCJTUE9PRlwiLFxuICBcIlNQT09LXCIsXG4gIFwiU1BPT0xcIixcbiAgXCJTUE9PTlwiLFxuICBcIlNQT09SXCIsXG4gIFwiU1BPUkVcIixcbiAgXCJTUE9SVFwiLFxuICBcIlNQT1RTXCIsXG4gIFwiU1BPVVRcIixcbiAgXCJTUFJBVFwiLFxuICBcIlNQUkFZXCIsXG4gIFwiU1BSRUVcIixcbiAgXCJTUFJJR1wiLFxuICBcIlNQUklUXCIsXG4gIFwiU1BST0dcIixcbiAgXCJTUFJVRVwiLFxuICBcIlNQVURTXCIsXG4gIFwiU1BVRURcIixcbiAgXCJTUFVNRVwiLFxuICBcIlNQVU5LXCIsXG4gIFwiU1BVUk5cIixcbiAgXCJTUFVSU1wiLFxuICBcIlNQVVJUXCIsXG4gIFwiU1FVQUJcIixcbiAgXCJTUVVBRFwiLFxuICBcIlNRVUFUXCIsXG4gIFwiU1FVQVdcIixcbiAgXCJTUVVJQlwiLFxuICBcIlNRVUlEXCIsXG4gIFwiU1RBQlNcIixcbiAgXCJTVEFDS1wiLFxuICBcIlNUQUZGXCIsXG4gIFwiU1RBR0VcIixcbiAgXCJTVEFHU1wiLFxuICBcIlNUQUdZXCIsXG4gIFwiU1RBSURcIixcbiAgXCJTVEFJTlwiLFxuICBcIlNUQUlSXCIsXG4gIFwiU1RBS0VcIixcbiAgXCJTVEFMRVwiLFxuICBcIlNUQUxLXCIsXG4gIFwiU1RBTExcIixcbiAgXCJTVEFNUFwiLFxuICBcIlNUQU5EXCIsXG4gIFwiU1RBTktcIixcbiAgXCJTVEFQSFwiLFxuICBcIlNUQVJFXCIsXG4gIFwiU1RBUktcIixcbiAgXCJTVEFSU1wiLFxuICBcIlNUQVJUXCIsXG4gIFwiU1RBU0hcIixcbiAgXCJTVEFURVwiLFxuICBcIlNUQVRTXCIsXG4gIFwiU1RBVkVcIixcbiAgXCJTVEFZU1wiLFxuICBcIlNURUFEXCIsXG4gIFwiU1RFQUtcIixcbiAgXCJTVEVBTFwiLFxuICBcIlNURUFNXCIsXG4gIFwiU1RFRURcIixcbiAgXCJTVEVFTFwiLFxuICBcIlNURUVQXCIsXG4gIFwiU1RFRVJcIixcbiAgXCJTVEVJTlwiLFxuICBcIlNURUxBXCIsXG4gIFwiU1RFTEVcIixcbiAgXCJTVEVNU1wiLFxuICBcIlNURU5PXCIsXG4gIFwiU1RFUFNcIixcbiAgXCJTVEVSTlwiLFxuICBcIlNURVRTXCIsXG4gIFwiU1RFV1NcIixcbiAgXCJTVElDS1wiLFxuICBcIlNUSUVEXCIsXG4gIFwiU1RJRVNcIixcbiAgXCJTVElGRlwiLFxuICBcIlNUSUxFXCIsXG4gIFwiU1RJTExcIixcbiAgXCJTVElMVFwiLFxuICBcIlNUSU5HXCIsXG4gIFwiU1RJTktcIixcbiAgXCJTVElOVFwiLFxuICBcIlNUSVJTXCIsXG4gIFwiU1RPQVNcIixcbiAgXCJTVE9BVFwiLFxuICBcIlNUT0NLXCIsXG4gIFwiU1RPR1lcIixcbiAgXCJTVE9JQ1wiLFxuICBcIlNUT0tFXCIsXG4gIFwiU1RPTEVcIixcbiAgXCJTVE9NQVwiLFxuICBcIlNUT01QXCIsXG4gIFwiU1RPTkVcIixcbiAgXCJTVE9OWVwiLFxuICBcIlNUT09EXCIsXG4gIFwiU1RPT0xcIixcbiAgXCJTVE9PUFwiLFxuICBcIlNUT1BTXCIsXG4gIFwiU1RPUkVcIixcbiAgXCJTVE9SS1wiLFxuICBcIlNUT1JNXCIsXG4gIFwiU1RPUllcIixcbiAgXCJTVE9VUFwiLFxuICBcIlNUT1VUXCIsXG4gIFwiU1RPVkVcIixcbiAgXCJTVE9XU1wiLFxuICBcIlNUUkFQXCIsXG4gIFwiU1RSQVdcIixcbiAgXCJTVFJBWVwiLFxuICBcIlNUUkVQXCIsXG4gIFwiU1RSRVdcIixcbiAgXCJTVFJJUFwiLFxuICBcIlNUUk9QXCIsXG4gIFwiU1RSVU1cIixcbiAgXCJTVFJVVFwiLFxuICBcIlNUVUJTXCIsXG4gIFwiU1RVQ0tcIixcbiAgXCJTVFVEU1wiLFxuICBcIlNUVURZXCIsXG4gIFwiU1RVRkZcIixcbiAgXCJTVFVNUFwiLFxuICBcIlNUVU5HXCIsXG4gIFwiU1RVTktcIixcbiAgXCJTVFVOU1wiLFxuICBcIlNUVU5UXCIsXG4gIFwiU1RZRVNcIixcbiAgXCJTVFlMRVwiLFxuICBcIlNUWUxJXCIsXG4gIFwiU1VBVkVcIixcbiAgXCJTVUNLU1wiLFxuICBcIlNVRURFXCIsXG4gIFwiU1VHQVJcIixcbiAgXCJTVUlOR1wiLFxuICBcIlNVSVRFXCIsXG4gIFwiU1VJVFNcIixcbiAgXCJTVUxGQVwiLFxuICBcIlNVTEtTXCIsXG4gIFwiU1VMS1lcIixcbiAgXCJTVUxMWVwiLFxuICBcIlNVTUFDXCIsXG4gIFwiU1VNTUFcIixcbiAgXCJTVU1QU1wiLFxuICBcIlNVTk5ZXCIsXG4gIFwiU1VOVVBcIixcbiAgXCJTVVBFUlwiLFxuICBcIlNVUFJBXCIsXG4gIFwiU1VSQVNcIixcbiAgXCJTVVJEU1wiLFxuICBcIlNVUkVSXCIsXG4gIFwiU1VSRlNcIixcbiAgXCJTVVJHRVwiLFxuICBcIlNVUkxZXCIsXG4gIFwiU1VTSElcIixcbiAgXCJTVVRSQVwiLFxuICBcIlNXQUJTXCIsXG4gIFwiU1dBR1NcIixcbiAgXCJTV0FJTlwiLFxuICBcIlNXQU1JXCIsXG4gIFwiU1dBTVBcIixcbiAgXCJTV0FOS1wiLFxuICBcIlNXQU5TXCIsXG4gIFwiU1dBUFNcIixcbiAgXCJTV0FSRFwiLFxuICBcIlNXQVJFXCIsXG4gIFwiU1dBUkZcIixcbiAgXCJTV0FSTVwiLFxuICBcIlNXQVJUXCIsXG4gIFwiU1dBU0hcIixcbiAgXCJTV0FUSFwiLFxuICBcIlNXQVRTXCIsXG4gIFwiU1dBWVNcIixcbiAgXCJTV0VBUlwiLFxuICBcIlNXRUFUXCIsXG4gIFwiU1dFREVcIixcbiAgXCJTV0VFUFwiLFxuICBcIlNXRUVUXCIsXG4gIFwiU1dFTExcIixcbiAgXCJTV0VQVFwiLFxuICBcIlNXSUZUXCIsXG4gIFwiU1dJR1NcIixcbiAgXCJTV0lMTFwiLFxuICBcIlNXSU1TXCIsXG4gIFwiU1dJTkVcIixcbiAgXCJTV0lOR1wiLFxuICBcIlNXSVBFXCIsXG4gIFwiU1dJUkxcIixcbiAgXCJTV0lTSFwiLFxuICBcIlNXSVNTXCIsXG4gIFwiU1dJVkVcIixcbiAgXCJTV09PTlwiLFxuICBcIlNXT09QXCIsXG4gIFwiU1dPUkRcIixcbiAgXCJTV09SRVwiLFxuICBcIlNXT1JOXCIsXG4gIFwiU1dVTkdcIixcbiAgXCJTWUxQSFwiLFxuICBcIlNZTkNIXCIsXG4gIFwiU1lOQ1NcIixcbiAgXCJTWU5PRFwiLFxuICBcIlNZUlVQXCIsXG4gIFwiVEFCQllcIixcbiAgXCJUQUJMRVwiLFxuICBcIlRBQk9PXCIsXG4gIFwiVEFCT1JcIixcbiAgXCJUQUJVU1wiLFxuICBcIlRBQ0lUXCIsXG4gIFwiVEFDS1NcIixcbiAgXCJUQUNLWVwiLFxuICBcIlRBQ09TXCIsXG4gIFwiVEFFTFNcIixcbiAgXCJUQUZGWVwiLFxuICBcIlRBSUxTXCIsXG4gIFwiVEFJTlRcIixcbiAgXCJUQUtFTlwiLFxuICBcIlRBS0VSXCIsXG4gIFwiVEFLRVNcIixcbiAgXCJUQUxDU1wiLFxuICBcIlRBTEVTXCIsXG4gIFwiVEFMS1NcIixcbiAgXCJUQUxLWVwiLFxuICBcIlRBTExZXCIsXG4gIFwiVEFMT05cIixcbiAgXCJUQUxVU1wiLFxuICBcIlRBTUVEXCIsXG4gIFwiVEFNRVJcIixcbiAgXCJUQU1FU1wiLFxuICBcIlRBTVBTXCIsXG4gIFwiVEFOR09cIixcbiAgXCJUQU5HU1wiLFxuICBcIlRBTkdZXCIsXG4gIFwiVEFOS1NcIixcbiAgXCJUQU5TWVwiLFxuICBcIlRBUEVEXCIsXG4gIFwiVEFQRVJcIixcbiAgXCJUQVBFU1wiLFxuICBcIlRBUElSXCIsXG4gIFwiVEFQSVNcIixcbiAgXCJUQVJEWVwiLFxuICBcIlRBUkVTXCIsXG4gIFwiVEFSTlNcIixcbiAgXCJUQVJPU1wiLFxuICBcIlRBUk9UXCIsXG4gIFwiVEFSUFNcIixcbiAgXCJUQVJSWVwiLFxuICBcIlRBUlRTXCIsXG4gIFwiVEFTS1NcIixcbiAgXCJUQVNURVwiLFxuICBcIlRBU1RZXCIsXG4gIFwiVEFURVJcIixcbiAgXCJUQVRUWVwiLFxuICBcIlRBVU5UXCIsXG4gIFwiVEFVUEVcIixcbiAgXCJUQVdOWVwiLFxuICBcIlRBWEVEXCIsXG4gIFwiVEFYRVNcIixcbiAgXCJUQVhJU1wiLFxuICBcIlRBWE9MXCIsXG4gIFwiVEFYT05cIixcbiAgXCJURUFDSFwiLFxuICBcIlRFQUtTXCIsXG4gIFwiVEVBTFNcIixcbiAgXCJURUFNU1wiLFxuICBcIlRFQVJTXCIsXG4gIFwiVEVBUllcIixcbiAgXCJURUFTRVwiLFxuICBcIlRFQVRTXCIsXG4gIFwiVEVDSFNcIixcbiAgXCJURUNIWVwiLFxuICBcIlRFRERZXCIsXG4gIFwiVEVFTVNcIixcbiAgXCJURUVOU1wiLFxuICBcIlRFRU5ZXCIsXG4gIFwiVEVFVEhcIixcbiAgXCJURUxFWFwiLFxuICBcIlRFTExTXCIsXG4gIFwiVEVMTFlcIixcbiAgXCJURU1QSVwiLFxuICBcIlRFTVBPXCIsXG4gIFwiVEVNUFNcIixcbiAgXCJURU1QVFwiLFxuICBcIlRFTkNIXCIsXG4gIFwiVEVORFNcIixcbiAgXCJURU5FVFwiLFxuICBcIlRFTk9OXCIsXG4gIFwiVEVOT1JcIixcbiAgXCJURU5TRVwiLFxuICBcIlRFTlRIXCIsXG4gIFwiVEVOVFNcIixcbiAgXCJURVBFRVwiLFxuICBcIlRFUElEXCIsXG4gIFwiVEVSQ0VcIixcbiAgXCJURVJNU1wiLFxuICBcIlRFUk5TXCIsXG4gIFwiVEVSUkFcIixcbiAgXCJURVJSWVwiLFxuICBcIlRFUlNFXCIsXG4gIFwiVEVTTEFcIixcbiAgXCJURVNUU1wiLFxuICBcIlRFU1RZXCIsXG4gIFwiVEVUUkFcIixcbiAgXCJURVhUU1wiLFxuICBcIlRIQU5FXCIsXG4gIFwiVEhBTktcIixcbiAgXCJUSEFOWFwiLFxuICBcIlRIQVdTXCIsXG4gIFwiVEhFRlRcIixcbiAgXCJUSEVNRVwiLFxuICBcIlRIRVJFXCIsXG4gIFwiVEhFUk1cIixcbiAgXCJUSEVTRVwiLFxuICBcIlRIRVRBXCIsXG4gIFwiVEhFV1NcIixcbiAgXCJUSElDS1wiLFxuICBcIlRISUVGXCIsXG4gIFwiVEhJR0hcIixcbiAgXCJUSElORVwiLFxuICBcIlRISU5HXCIsXG4gIFwiVEhJTktcIixcbiAgXCJUSElOU1wiLFxuICBcIlRISVJEXCIsXG4gIFwiVEhPTkdcIixcbiAgXCJUSE9STlwiLFxuICBcIlRIT1NFXCIsXG4gIFwiVEhSRUVcIixcbiAgXCJUSFJFV1wiLFxuICBcIlRIUk9CXCIsXG4gIFwiVEhST0VcIixcbiAgXCJUSFJPV1wiLFxuICBcIlRIUlVNXCIsXG4gIFwiVEhVRFNcIixcbiAgXCJUSFVHU1wiLFxuICBcIlRIVU1CXCIsXG4gIFwiVEhVTVBcIixcbiAgXCJUSFVOS1wiLFxuICBcIlRIWU1FXCIsXG4gIFwiVElBUkFcIixcbiAgXCJUSUJJQVwiLFxuICBcIlRJQ0tTXCIsXG4gIFwiVElEQUxcIixcbiAgXCJUSURFRFwiLFxuICBcIlRJREVTXCIsXG4gIFwiVElFUlNcIixcbiAgXCJUSUZGU1wiLFxuICBcIlRJR0VSXCIsXG4gIFwiVElLRVNcIixcbiAgXCJUSUtJU1wiLFxuICBcIlRJTERFXCIsXG4gIFwiVElMRURcIixcbiAgXCJUSUxFUlwiLFxuICBcIlRJTEVTXCIsXG4gIFwiVElMTFNcIixcbiAgXCJUSUxUSFwiLFxuICBcIlRJTFRTXCIsXG4gIFwiVElNRURcIixcbiAgXCJUSU1FUlwiLFxuICBcIlRJTUVTXCIsXG4gIFwiVElNSURcIixcbiAgXCJUSU5FU1wiLFxuICBcIlRJTkdFXCIsXG4gIFwiVElOR1NcIixcbiAgXCJUSU5OWVwiLFxuICBcIlRJTlRTXCIsXG4gIFwiVElQUFlcIixcbiAgXCJUSVBTWVwiLFxuICBcIlRJUkVEXCIsXG4gIFwiVElSRVNcIixcbiAgXCJUSVJPU1wiLFxuICBcIlRJVEFOXCIsXG4gIFwiVElURVJcIixcbiAgXCJUSVRIRVwiLFxuICBcIlRJVExFXCIsXG4gIFwiVElUUkVcIixcbiAgXCJUSVRUWVwiLFxuICBcIlRJWlpZXCIsXG4gIFwiVE9BRFNcIixcbiAgXCJUT0FEWVwiLFxuICBcIlRPQVNUXCIsXG4gIFwiVE9EQVlcIixcbiAgXCJUT0REWVwiLFxuICBcIlRPRkZTXCIsXG4gIFwiVE9GRllcIixcbiAgXCJUT0dBU1wiLFxuICBcIlRPSUxFXCIsXG4gIFwiVE9JTFNcIixcbiAgXCJUT0tFRFwiLFxuICBcIlRPS0VOXCIsXG4gIFwiVE9LRVNcIixcbiAgXCJUT0xMU1wiLFxuICBcIlRPTUJTXCIsXG4gIFwiVE9NRVNcIixcbiAgXCJUT01NWVwiLFxuICBcIlRPTkFMXCIsXG4gIFwiVE9ORURcIixcbiAgXCJUT05FUlwiLFxuICBcIlRPTkVTXCIsXG4gIFwiVE9OR1NcIixcbiAgXCJUT05JQ1wiLFxuICBcIlRPT0xTXCIsXG4gIFwiVE9PTlNcIixcbiAgXCJUT09USFwiLFxuICBcIlRPT1RTXCIsXG4gIFwiVE9QQVpcIixcbiAgXCJUT1BFRFwiLFxuICBcIlRPUEVTXCIsXG4gIFwiVE9QSUNcIixcbiAgXCJUT1BPSVwiLFxuICBcIlRPUE9TXCIsXG4gIFwiVE9RVUVcIixcbiAgXCJUT1JDSFwiLFxuICBcIlRPUklDXCIsXG4gIFwiVE9SU0lcIixcbiAgXCJUT1JTT1wiLFxuICBcIlRPUlRFXCIsXG4gIFwiVE9SVFNcIixcbiAgXCJUT1JVU1wiLFxuICBcIlRPVEFMXCIsXG4gIFwiVE9URURcIixcbiAgXCJUT1RFTVwiLFxuICBcIlRPVEVTXCIsXG4gIFwiVE9UVFlcIixcbiAgXCJUT1VHSFwiLFxuICBcIlRPVVJTXCIsXG4gIFwiVE9VVFNcIixcbiAgXCJUT1dFTFwiLFxuICBcIlRPV0VSXCIsXG4gIFwiVE9XTlNcIixcbiAgXCJUT1hJQ1wiLFxuICBcIlRPWElOXCIsXG4gIFwiVE9ZRURcIixcbiAgXCJUT1lPTlwiLFxuICBcIlRSQUNFXCIsXG4gIFwiVFJBQ0tcIixcbiAgXCJUUkFDVFwiLFxuICBcIlRSQURFXCIsXG4gIFwiVFJBSUxcIixcbiAgXCJUUkFJTlwiLFxuICBcIlRSQUlUXCIsXG4gIFwiVFJBTVBcIixcbiAgXCJUUkFNU1wiLFxuICBcIlRSQU5TXCIsXG4gIFwiVFJBUFNcIixcbiAgXCJUUkFTSFwiLFxuICBcIlRSQVdMXCIsXG4gIFwiVFJBWVNcIixcbiAgXCJUUkVBRFwiLFxuICBcIlRSRUFUXCIsXG4gIFwiVFJFRURcIixcbiAgXCJUUkVFU1wiLFxuICBcIlRSRUtTXCIsXG4gIFwiVFJFTkRcIixcbiAgXCJUUkVTU1wiLFxuICBcIlRSRVdTXCIsXG4gIFwiVFJFWVNcIixcbiAgXCJUUklBRFwiLFxuICBcIlRSSUFMXCIsXG4gIFwiVFJJQkVcIixcbiAgXCJUUklDRVwiLFxuICBcIlRSSUNLXCIsXG4gIFwiVFJJRURcIixcbiAgXCJUUklFUlwiLFxuICBcIlRSSUVTXCIsXG4gIFwiVFJJS0VcIixcbiAgXCJUUklMTFwiLFxuICBcIlRSSU1TXCIsXG4gIFwiVFJJT1NcIixcbiAgXCJUUklQRVwiLFxuICBcIlRSSVBTXCIsXG4gIFwiVFJJVEVcIixcbiAgXCJUUk9MTFwiLFxuICBcIlRST01QXCIsXG4gIFwiVFJPT1BcIixcbiAgXCJUUk9USFwiLFxuICBcIlRST1RTXCIsXG4gIFwiVFJPVVRcIixcbiAgXCJUUk9WRVwiLFxuICBcIlRST1dTXCIsXG4gIFwiVFJVQ0VcIixcbiAgXCJUUlVDS1wiLFxuICBcIlRSVUVEXCIsXG4gIFwiVFJVRVJcIixcbiAgXCJUUlVFU1wiLFxuICBcIlRSVUxZXCIsXG4gIFwiVFJVTVBcIixcbiAgXCJUUlVOS1wiLFxuICBcIlRSVVNTXCIsXG4gIFwiVFJVU1RcIixcbiAgXCJUUlVUSFwiLFxuICBcIlRSWVNUXCIsXG4gIFwiVFNBUlNcIixcbiAgXCJUVUFOU1wiLFxuICBcIlRVQkFMXCIsXG4gIFwiVFVCQVNcIixcbiAgXCJUVUJCWVwiLFxuICBcIlRVQkVEXCIsXG4gIFwiVFVCRVJcIixcbiAgXCJUVUJFU1wiLFxuICBcIlRVQ0tTXCIsXG4gIFwiVFVGVFNcIixcbiAgXCJUVUxJUFwiLFxuICBcIlRVTExFXCIsXG4gIFwiVFVNTVlcIixcbiAgXCJUVU1PUlwiLFxuICBcIlRVTkFTXCIsXG4gIFwiVFVORURcIixcbiAgXCJUVU5FUlwiLFxuICBcIlRVTkVTXCIsXG4gIFwiVFVOSUNcIixcbiAgXCJUVU5OWVwiLFxuICBcIlRVUExFXCIsXG4gIFwiVFVSQk9cIixcbiAgXCJUVVJEU1wiLFxuICBcIlRVUkZTXCIsXG4gIFwiVFVSRllcIixcbiAgXCJUVVJOU1wiLFxuICBcIlRVUlBTXCIsXG4gIFwiVFVTS1NcIixcbiAgXCJUVVNLWVwiLFxuICBcIlRVVE9SXCIsXG4gIFwiVFVUVElcIixcbiAgXCJUVVRVU1wiLFxuICBcIlRVWEVTXCIsXG4gIFwiVFdBSU5cIixcbiAgXCJUV0FOR1wiLFxuICBcIlRXQVRTXCIsXG4gIFwiVFdFQUtcIixcbiAgXCJUV0VFRFwiLFxuICBcIlRXRUVUXCIsXG4gIFwiVFdFUlBcIixcbiAgXCJUV0lDRVwiLFxuICBcIlRXSUdTXCIsXG4gIFwiVFdJTExcIixcbiAgXCJUV0lORVwiLFxuICBcIlRXSU5LXCIsXG4gIFwiVFdJTlNcIixcbiAgXCJUV0lOWVwiLFxuICBcIlRXSVJMXCIsXG4gIFwiVFdJUlBcIixcbiAgXCJUV0lTVFwiLFxuICBcIlRXSVRTXCIsXG4gIFwiVFdJWFRcIixcbiAgXCJUWUlOR1wiLFxuICBcIlRZS0VTXCIsXG4gIFwiVFlQRURcIixcbiAgXCJUWVBFU1wiLFxuICBcIlRZUE9TXCIsXG4gIFwiVFlSRVNcIixcbiAgXCJUWVJPU1wiLFxuICBcIlRaQVJTXCIsXG4gIFwiVURERVJcIixcbiAgXCJVS0FTRVwiLFxuICBcIlVMQ0VSXCIsXG4gIFwiVUxOQVNcIixcbiAgXCJVTFRSQVwiLFxuICBcIlVNQkVMXCIsXG4gIFwiVU1CRVJcIixcbiAgXCJVTUJSQVwiLFxuICBcIlVNSUFLXCIsXG4gIFwiVU1QRURcIixcbiAgXCJVTkFQVFwiLFxuICBcIlVOQVJNXCIsXG4gIFwiVU5BUllcIixcbiAgXCJVTkJBTlwiLFxuICBcIlVOQkFSXCIsXG4gIFwiVU5CT1hcIixcbiAgXCJVTkNBUFwiLFxuICBcIlVOQ0xFXCIsXG4gIFwiVU5DVVRcIixcbiAgXCJVTkRFUlwiLFxuICBcIlVORElEXCIsXG4gIFwiVU5EVUVcIixcbiAgXCJVTkZFRFwiLFxuICBcIlVORklUXCIsXG4gIFwiVU5ISVBcIixcbiAgXCJVTklGWVwiLFxuICBcIlVOSU9OXCIsXG4gIFwiVU5JVEVcIixcbiAgXCJVTklUU1wiLFxuICBcIlVOSVRZXCIsXG4gIFwiVU5MSVRcIixcbiAgXCJVTk1BTlwiLFxuICBcIlVOTUVUXCIsXG4gIFwiVU5QRUdcIixcbiAgXCJVTlBJTlwiLFxuICBcIlVOUklHXCIsXG4gIFwiVU5TQVlcIixcbiAgXCJVTlNFRVwiLFxuICBcIlVOU0VUXCIsXG4gIFwiVU5TRVhcIixcbiAgXCJVTlRJRVwiLFxuICBcIlVOVElMXCIsXG4gIFwiVU5XRURcIixcbiAgXCJVTlpJUFwiLFxuICBcIlVQRU5EXCIsXG4gIFwiVVBQRURcIixcbiAgXCJVUFBFUlwiLFxuICBcIlVQU0VUXCIsXG4gIFwiVVJCQU5cIixcbiAgXCJVUkdFRFwiLFxuICBcIlVSR0VSXCIsXG4gIFwiVVJHRVNcIixcbiAgXCJVUklORVwiLFxuICBcIlVTQUdFXCIsXG4gIFwiVVNFUlNcIixcbiAgXCJVU0hFUlwiLFxuICBcIlVTSU5HXCIsXG4gIFwiVVNVQUxcIixcbiAgXCJVU1VSUFwiLFxuICBcIlVTVVJZXCIsXG4gIFwiVVRFUklcIixcbiAgXCJVVFRFUlwiLFxuICBcIlVWVUxBXCIsXG4gIFwiVkFDVUFcIixcbiAgXCJWQUdVRVwiLFxuICBcIlZBSUxTXCIsXG4gIFwiVkFMRVNcIixcbiAgXCJWQUxFVFwiLFxuICBcIlZBTElEXCIsXG4gIFwiVkFMT1JcIixcbiAgXCJWQUxVRVwiLFxuICBcIlZBTFZFXCIsXG4gIFwiVkFNUFNcIixcbiAgXCJWQU5FU1wiLFxuICBcIlZBUEVTXCIsXG4gIFwiVkFQSURcIixcbiAgXCJWQVBPUlwiLFxuICBcIlZBU0VTXCIsXG4gIFwiVkFVTFRcIixcbiAgXCJWQVVOVFwiLFxuICBcIlZFRVBTXCIsXG4gIFwiVkVFUlNcIixcbiAgXCJWRUdBTlwiLFxuICBcIlZFSUxTXCIsXG4gIFwiVkVJTlNcIixcbiAgXCJWRUxBUlwiLFxuICBcIlZFTERTXCIsXG4gIFwiVkVMRFRcIixcbiAgXCJWRU5BTFwiLFxuICBcIlZFTkRTXCIsXG4gIFwiVkVOT01cIixcbiAgXCJWRU5UU1wiLFxuICBcIlZFTlVFXCIsXG4gIFwiVkVSQlNcIixcbiAgXCJWRVJHRVwiLFxuICBcIlZFUlNFXCIsXG4gIFwiVkVSU09cIixcbiAgXCJWRVJTVFwiLFxuICBcIlZFUlZFXCIsXG4gIFwiVkVTVFNcIixcbiAgXCJWRVRDSFwiLFxuICBcIlZFWEVEXCIsXG4gIFwiVkVYRVNcIixcbiAgXCJWSUFMU1wiLFxuICBcIlZJQU5EXCIsXG4gIFwiVklCRVNcIixcbiAgXCJWSUNBUlwiLFxuICBcIlZJQ0VTXCIsXG4gIFwiVklERU9cIixcbiAgXCJWSUVXU1wiLFxuICBcIlZJR0lMXCIsXG4gIFwiVklHT1JcIixcbiAgXCJWSUxFUlwiLFxuICBcIlZJTExBXCIsXG4gIFwiVklMTElcIixcbiAgXCJWSU5DQVwiLFxuICBcIlZJTkVTXCIsXG4gIFwiVklOWUxcIixcbiAgXCJWSU9MQVwiLFxuICBcIlZJT0xTXCIsXG4gIFwiVklQRVJcIixcbiAgXCJWSVJBTFwiLFxuICBcIlZJUkVPXCIsXG4gIFwiVklSVVNcIixcbiAgXCJWSVNBU1wiLFxuICBcIlZJU0VTXCIsXG4gIFwiVklTSVRcIixcbiAgXCJWSVNPUlwiLFxuICBcIlZJU1RBXCIsXG4gIFwiVklUQUxcIixcbiAgXCJWSVRBU1wiLFxuICBcIlZJVkFTXCIsXG4gIFwiVklWSURcIixcbiAgXCJWSVhFTlwiLFxuICBcIlZJWk9SXCIsXG4gIFwiVk9DQUxcIixcbiAgXCJWT0RLQVwiLFxuICBcIlZPR1VFXCIsXG4gIFwiVk9JQ0VcIixcbiAgXCJWT0lEU1wiLFxuICBcIlZPSUxBXCIsXG4gIFwiVk9JTEVcIixcbiAgXCJWT0xUU1wiLFxuICBcIlZPTUlUXCIsXG4gIFwiVk9URURcIixcbiAgXCJWT1RFUlwiLFxuICBcIlZPVEVTXCIsXG4gIFwiVk9VQ0hcIixcbiAgXCJWT1dFRFwiLFxuICBcIlZPV0VMXCIsXG4gIFwiVk9YRUxcIixcbiAgXCJWUk9PTVwiLFxuICBcIlZVTFZBXCIsXG4gIFwiVllJTkdcIixcbiAgXCJXQUNLT1wiLFxuICBcIldBQ0tZXCIsXG4gIFwiV0FERURcIixcbiAgXCJXQURFUlwiLFxuICBcIldBREVTXCIsXG4gIFwiV0FESVNcIixcbiAgXCJXQUZFUlwiLFxuICBcIldBRlRTXCIsXG4gIFwiV0FHRURcIixcbiAgXCJXQUdFUlwiLFxuICBcIldBR0VTXCIsXG4gIFwiV0FHT05cIixcbiAgXCJXQUhPT1wiLFxuICBcIldBSUZTXCIsXG4gIFwiV0FJTFNcIixcbiAgXCJXQUlTVFwiLFxuICBcIldBSVRTXCIsXG4gIFwiV0FJVkVcIixcbiAgXCJXQUtFRFwiLFxuICBcIldBS0VOXCIsXG4gIFwiV0FLRVNcIixcbiAgXCJXQUxFU1wiLFxuICBcIldBTEtTXCIsXG4gIFwiV0FMTFNcIixcbiAgXCJXQUxUWlwiLFxuICBcIldBTkRTXCIsXG4gIFwiV0FORURcIixcbiAgXCJXQU5FU1wiLFxuICBcIldBTlRTXCIsXG4gIFwiV0FSRFNcIixcbiAgXCJXQVJFU1wiLFxuICBcIldBUk1TXCIsXG4gIFwiV0FSTlNcIixcbiAgXCJXQVJQU1wiLFxuICBcIldBUlRTXCIsXG4gIFwiV0FTSFlcIixcbiAgXCJXQVNQU1wiLFxuICBcIldBU1BZXCIsXG4gIFwiV0FTVEVcIixcbiAgXCJXQVRDSFwiLFxuICBcIldBVEVSXCIsXG4gIFwiV0FUVFNcIixcbiAgXCJXQVZFRFwiLFxuICBcIldBVkVSXCIsXG4gIFwiV0FWRVNcIixcbiAgXCJXQVhFRFwiLFxuICBcIldBWEVOXCIsXG4gIFwiV0FYRVNcIixcbiAgXCJXQVpPT1wiLFxuICBcIldFQUxTXCIsXG4gIFwiV0VBUlNcIixcbiAgXCJXRUFSWVwiLFxuICBcIldFQVZFXCIsXG4gIFwiV0VCRVJcIixcbiAgXCJXRURHRVwiLFxuICBcIldFRURTXCIsXG4gIFwiV0VFRFlcIixcbiAgXCJXRUVLU1wiLFxuICBcIldFRU5ZXCIsXG4gIFwiV0VFUFNcIixcbiAgXCJXRUVQWVwiLFxuICBcIldFRVNUXCIsXG4gIFwiV0VGVFNcIixcbiAgXCJXRUlHSFwiLFxuICBcIldFSVJEXCIsXG4gIFwiV0VJUlNcIixcbiAgXCJXRUxDSFwiLFxuICBcIldFTERTXCIsXG4gIFwiV0VMTFNcIixcbiAgXCJXRUxTSFwiLFxuICBcIldFTFRTXCIsXG4gIFwiV0VOQ0hcIixcbiAgXCJXRU5EU1wiLFxuICBcIldIQUNLXCIsXG4gIFwiV0hBTEVcIixcbiAgXCJXSEFNU1wiLFxuICBcIldIQU5HXCIsXG4gIFwiV0hBUkZcIixcbiAgXCJXSEVBTFwiLFxuICBcIldIRUFUXCIsXG4gIFwiV0hFRUxcIixcbiAgXCJXSEVMS1wiLFxuICBcIldIRUxNXCIsXG4gIFwiV0hFTFBcIixcbiAgXCJXSEVSRVwiLFxuICBcIldIRVRTXCIsXG4gIFwiV0hJQ0hcIixcbiAgXCJXSElGRlwiLFxuICBcIldISUxFXCIsXG4gIFwiV0hJTVNcIixcbiAgXCJXSElORVwiLFxuICBcIldISU5ZXCIsXG4gIFwiV0hJUFNcIixcbiAgXCJXSElSTFwiLFxuICBcIldISVJSXCIsXG4gIFwiV0hJUlNcIixcbiAgXCJXSElTS1wiLFxuICBcIldISVNUXCIsXG4gIFwiV0hJVEVcIixcbiAgXCJXSElUU1wiLFxuICBcIldISVpaXCIsXG4gIFwiV0hPTEVcIixcbiAgXCJXSE9NUFwiLFxuICBcIldIT09QXCIsXG4gIFwiV0hPUFNcIixcbiAgXCJXSE9SRVwiLFxuICBcIldIT1JMXCIsXG4gIFwiV0hPU0VcIixcbiAgXCJXSE9TT1wiLFxuICBcIldIVU1QXCIsXG4gIFwiV0lDS1NcIixcbiAgXCJXSURFTlwiLFxuICBcIldJREVSXCIsXG4gIFwiV0lET1dcIixcbiAgXCJXSURUSFwiLFxuICBcIldJRUxEXCIsXG4gIFwiV0lGRVlcIixcbiAgXCJXSUxDT1wiLFxuICBcIldJTERTXCIsXG4gIFwiV0lMRURcIixcbiAgXCJXSUxFU1wiLFxuICBcIldJTExTXCIsXG4gIFwiV0lMVFNcIixcbiAgXCJXSU1QU1wiLFxuICBcIldJTVBZXCIsXG4gIFwiV0lOQ0VcIixcbiAgXCJXSU5DSFwiLFxuICBcIldJTkRTXCIsXG4gIFwiV0lORFlcIixcbiAgXCJXSU5FRFwiLFxuICBcIldJTkVTXCIsXG4gIFwiV0lOR1NcIixcbiAgXCJXSU5LU1wiLFxuICBcIldJTk9TXCIsXG4gIFwiV0lQRURcIixcbiAgXCJXSVBFUlwiLFxuICBcIldJUEVTXCIsXG4gIFwiV0lSRURcIixcbiAgXCJXSVJFU1wiLFxuICBcIldJU0VEXCIsXG4gIFwiV0lTRVJcIixcbiAgXCJXSVNFU1wiLFxuICBcIldJU1BTXCIsXG4gIFwiV0lTUFlcIixcbiAgXCJXSVRDSFwiLFxuICBcIldJVFRZXCIsXG4gIFwiV0lWRVNcIixcbiAgXCJXSVpFTlwiLFxuICBcIldPS0VOXCIsXG4gIFwiV09MRFNcIixcbiAgXCJXT01BTlwiLFxuICBcIldPTUJTXCIsXG4gIFwiV09NRU5cIixcbiAgXCJXT05LU1wiLFxuICBcIldPTktZXCIsXG4gIFwiV09OVFNcIixcbiAgXCJXT09EU1wiLFxuICBcIldPT0RZXCIsXG4gIFwiV09PRURcIixcbiAgXCJXT09GU1wiLFxuICBcIldPT0xTXCIsXG4gIFwiV09PTFlcIixcbiAgXCJXT09TSFwiLFxuICBcIldPT1pZXCIsXG4gIFwiV09SRFNcIixcbiAgXCJXT1JEWVwiLFxuICBcIldPUktTXCIsXG4gIFwiV09STERcIixcbiAgXCJXT1JNU1wiLFxuICBcIldPUk1ZXCIsXG4gIFwiV09SUllcIixcbiAgXCJXT1JTRVwiLFxuICBcIldPUlNUXCIsXG4gIFwiV09SVEhcIixcbiAgXCJXT1JUU1wiLFxuICBcIldPVUxEXCIsXG4gIFwiV09VTkRcIixcbiAgXCJXT1ZFTlwiLFxuICBcIldPV0VEXCIsXG4gIFwiV09XRUVcIixcbiAgXCJXUkFDS1wiLFxuICBcIldSQVBTXCIsXG4gIFwiV1JBVEhcIixcbiAgXCJXUkVBS1wiLFxuICBcIldSRUNLXCIsXG4gIFwiV1JFTlNcIixcbiAgXCJXUkVTVFwiLFxuICBcIldSSUVSXCIsXG4gIFwiV1JJTkdcIixcbiAgXCJXUklTVFwiLFxuICBcIldSSVRFXCIsXG4gIFwiV1JJVFNcIixcbiAgXCJXUk9OR1wiLFxuICBcIldST1RFXCIsXG4gIFwiV1JPVEhcIixcbiAgXCJXUlVOR1wiLFxuICBcIldSWUVSXCIsXG4gIFwiV1JZTFlcIixcbiAgXCJXVVJTVFwiLFxuICBcIlhFTk9OXCIsXG4gIFwiWEVST1hcIixcbiAgXCJYWUxFTVwiLFxuICBcIllBQ0hUXCIsXG4gIFwiWUFIT09cIixcbiAgXCJZQU5LU1wiLFxuICBcIllBUkRTXCIsXG4gIFwiWUFSTlNcIixcbiAgXCJZQVdFRFwiLFxuICBcIllBV0xTXCIsXG4gIFwiWUFXTlNcIixcbiAgXCJZQVdOWVwiLFxuICBcIllBV1BTXCIsXG4gIFwiWUVBUk5cIixcbiAgXCJZRUFSU1wiLFxuICBcIllFQVNUXCIsXG4gIFwiWUVDQ0hcIixcbiAgXCJZRUxMU1wiLFxuICBcIllFTFBTXCIsXG4gIFwiWUVOVEFcIixcbiAgXCJZRVJCQVwiLFxuICBcIllFU0VTXCIsXG4gIFwiWUlFTERcIixcbiAgXCJZSUtFU1wiLFxuICBcIllJUEVTXCIsXG4gIFwiWU9CQk9cIixcbiAgXCJZT0RFTFwiLFxuICBcIllPR0lTXCIsXG4gIFwiWU9LRURcIixcbiAgXCJZT0tFTFwiLFxuICBcIllPS0VTXCIsXG4gIFwiWU9MS1NcIixcbiAgXCJZT1VOR1wiLFxuICBcIllPVVJOXCIsXG4gIFwiWU9VUlNcIixcbiAgXCJZT1VTRVwiLFxuICBcIllPVVRIXCIsXG4gIFwiWU9XTFNcIixcbiAgXCJZT1lPU1wiLFxuICBcIllVQ0NBXCIsXG4gIFwiWVVDS1lcIixcbiAgXCJZVUtLWVwiLFxuICBcIllVTU1ZXCIsXG4gIFwiWVVSVFNcIixcbiAgXCJaQVBQWVwiLFxuICBcIlpBWUlOXCIsXG4gIFwiWkVCUkFcIixcbiAgXCJaRUJVU1wiLFxuICBcIlpFUk9TXCIsXG4gIFwiWkVTVFNcIixcbiAgXCJaRVRBU1wiLFxuICBcIlpJTENIXCIsXG4gIFwiWklOQ1NcIixcbiAgXCJaSU5HU1wiLFxuICBcIlpJUFBZXCIsXG4gIFwiWkxPVFlcIixcbiAgXCJaT05BTFwiLFxuICBcIlpPTkVEXCIsXG4gIFwiWk9ORVNcIixcbiAgXCJaT05LU1wiLFxuICBcIlpPT01TXCIsXG4gIFwiWk9XSUVcIixcbl1cblxubW9kdWxlLmV4cG9ydHMgPSB7IFdPUkRTIH1cbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMF9fXyA9IG5ldyBVUkwoXCIuLi9mb250cy9CTEFEUk1GXy5UVEZcIiwgaW1wb3J0Lm1ldGEudXJsKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMV9fXyA9IG5ldyBVUkwoXCIuLi9mb250cy9PeGFuaXVtLVZhcmlhYmxlRm9udF93Z2h0LnR0ZlwiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8xX19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMV9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYDpyb290IHtcbiAgLS1kZWZhdWx0OiAjMTIxMjEzO1xuICAtLXRleHQ6ICNmZmZmZmY7XG4gIC0tZ3JheTE6ICM0YTRhNGM7XG4gIC0tZ3JheTI6ICMyYTJhMmM7XG4gIC0tYnJCbHVlMTogIzE3YWFkODtcbiAgLS1ickJsdWUyOiAjMDE3Y2IwO1xuICAtLWJyQmx1ZTM6ICMwYjYxYTg7XG4gIC0tYnJPcmFuZ2UxOiAjZmU5MjAwO1xuICAvKmVlNjEwYSovXG4gIC0tYnJPcmFuZ2UyOiAjZWU2MTBhO1xuICAtLWJyT3JhbmdlMzogI2VhNDEwYjtcbn1cblxuQGZvbnQtZmFjZSB7XG4gIGZvbnQtZmFtaWx5OiBcIkJsYWRlIFJ1bm5lclwiO1xuICBzcmM6IHVybCgke19fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX199KTtcbn1cbkBmb250LWZhY2Uge1xuICBmb250LWZhbWlseTogXCJPeGFuaXVtXCI7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgc3JjOiB1cmwoJHtfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8xX19ffSk7XG59XG5odG1sLFxuYm9keSB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRlZmF1bHQpO1xuICBmb250LWZhbWlseTogXCJPeGFuaXVtXCIsIGN1cnNpdmU7XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuXG5kaXYge1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG59XG5cbi5zdXBlcmNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIG1pbi13aWR0aDogMzIwcHg7XG4gIG1heC13aWR0aDogNTQwcHg7XG4gIG1hcmdpbjogMWNxdyBhdXRvO1xuICBjb250YWluZXItdHlwZTogaW5saW5lLXNpemU7XG59XG5cbi5wYWdlQ29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgZmxleC1zaHJpbms6IDA7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgLyptYXJnaW46IDFjcXcgYXV0bztcbiAgbWluLXdpZHRoOiAzMjBweDtcbiAgbWF4LXdpZHRoOiA1NDBweDsqL1xuICB3aWR0aDogMTAwJTtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAvKmdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyOyovXG4gIC8qZ3JpZC10ZW1wbGF0ZS1yb3dzOiBhdXRvIGF1dG8gMWZyOyovXG4gIC8qZ3JpZC1hdXRvLXJvd3M6IGF1dG87Ki9cbiAgY29udGFpbmVyLXR5cGU6IGlubGluZS1zaXplO1xuICBoZWlnaHQ6IDE1NWNxdztcbn1cblxuLmhlYWRlciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXg6IDAgMSBhdXRvO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgY29sb3I6IHZhcigtLWJyT3JhbmdlMik7XG4gIGZvbnQtZmFtaWx5OiBcIkJsYWRlIFJ1bm5lclwiO1xuICBmb250LXNpemU6IDhjcXc7XG4gIHBhZGRpbmc6IDJjcXcgMDtcbiAgbWFyZ2luOiAxY3F3O1xuICBib3JkZXItYm90dG9tOiAwLjVjcXcgc29saWQgdmFyKC0tZ3JheTEpO1xuICBoZWlnaHQ6IDhjcXc7XG4gIGJvcmRlci10b3A6IDAuNWNxdyBzb2xpZCB2YXIoLS1kZWZhdWx0KTtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gIC1tcy11c2VyLXNlbGVjdDogbm9uZTtcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XG59XG5cbi5tZXNzYWdlIHtcbiAgY29sb3I6IHZhcigtLWJyT3JhbmdlMik7XG4gIGZvbnQtZmFtaWx5OiBcIk94YW5pdW1cIiwgY3Vyc2l2ZTtcbiAgZm9udC1zaXplOiA2Y3F3O1xuICBwYWRkaW5nOiAyY3F3IDA7XG4gIG1hcmdpbjogMWNxdztcbiAgaGVpZ2h0OiA4Y3F3O1xuICBib3JkZXItYm90dG9tOiAwLjVjcXcgc29saWQgdmFyKC0tYnJPcmFuZ2UyKTtcbiAgYm9yZGVyLXRvcDogMC41Y3F3IHNvbGlkIHZhcigtLWJyT3JhbmdlMik7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRlZmF1bHQpO1xufVxuXG4uZ2FtZUNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBmbGV4OiAwIDEgYXV0bztcbiAgd2lkdGg6IDEwMGNxdztcbiAgbWFyZ2luOiBhdXRvO1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgLW1zLXVzZXItc2VsZWN0OiBub25lO1xuICB1c2VyLXNlbGVjdDogbm9uZTtcbn1cblxuLnRpbGVHcmlkIHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgd2lkdGg6IDc1Y3F3O1xuICBncmlkLXRlbXBsYXRlLXJvd3M6IDFmciAxZnIgMWZyIDFmciAxZnIgMWZyO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnIgMWZyIDFmciAxZnI7XG4gIGdyaWQtZ2FwOiAxLjVjcXc7XG4gIG1hcmdpbjogMC41Y3F3IDA7XG59XG5cbi50aWxlIHtcbiAgYXNwZWN0LXJhdGlvOiAxLzE7XG4gIGJvcmRlcjogMC41Y3F3IHNvbGlkIHZhcigtLWdyYXkxKTtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgY29sb3I6IHZhcigtLXRleHQpO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBkaXNwbGF5OiBncmlkO1xuICBwbGFjZS1pdGVtczogY2VudGVyO1xuICBmb250LWZhbWlseTogXCJPeGFuaXVtXCIsIGN1cnNpdmU7XG4gIGZvbnQtc2l6ZTogN2Nxdztcbn1cblxuLnRpbGVXYXRlck1hcmsge1xuICBmb250LWZhbWlseTogXCJCbGFkZSBSdW5uZXJcIjtcbiAgY29sb3I6IHZhcigtLWdyYXkyKTtcbn1cblxuLmtleWJvYXJkQ29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleDogMCAxIGF1dG87XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBtYXJnaW46IGF1dG87XG4gIG1hcmdpbi10b3A6IDJjcXc7XG4gIHdpZHRoOiAxMDBjcXc7XG59XG5cbi5rZXlib2FyZEdyaWQge1xuICBkaXNwbGF5OiBncmlkO1xuICB3aWR0aDogOThjcXc7XG4gIGdyaWQtdGVtcGxhdGUtcm93czogMWZyIDFmciAxZnI7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xuICBncmlkLXJvdy1nYXA6IDEuNWNxdztcbn1cblxuLmtleWJvYXJkUm93MSB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIHdpZHRoOiA5OGNxdztcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnI7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmciAxZnIgMWZyIDFmciAxZnIgMWZyIDFmciAxZnIgMWZyO1xuICBncmlkLWNvbHVtbi1nYXA6IDEuNWNxdztcbn1cblxuLmtleWJvYXJkUm93MiB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIHdpZHRoOiA5OGNxdztcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnI7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMC41ZnIgMWZyIDFmciAxZnIgMWZyIDFmciAxZnIgMWZyIDFmciAxZnIgMC41ZnI7XG4gIGdyaWQtY29sdW1uLWdhcDogMS41Y3F3O1xufVxuXG4ua2V5Ym9hcmRSb3czIHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgd2lkdGg6IDk4Y3F3O1xuICBncmlkLXRlbXBsYXRlLXJvd3M6IDFmcjtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxLjVmciAxZnIgMWZyIDFmciAxZnIgMWZyIDFmciAxZnIgMS41ZnI7XG4gIGdyaWQtY29sdW1uLWdhcDogMS41Y3F3O1xufVxuXG4ua2V5LFxuLmtleVNwYWNlciB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGJvcmRlcjogMC4yNWNxdyBzb2xpZCB2YXIoLS10ZXh0KTtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBmb250LWZhbWlseTogXCJPeGFuaXVtXCIsIGN1cnNpdmU7XG4gIGZvbnQtc2l6ZTogMy41Y3F3O1xuICBmb250LXdlaWdodDogYm9sZGVyO1xuICBwbGFjZS1pdGVtczogY2VudGVyO1xuICBwYWRkaW5nOiAwIDA7XG4gIGJvcmRlci1yYWRpdXM6IDEuNWNxdztcbiAgY29sb3I6IHZhcigtLXRleHQpO1xuICBhc3BlY3QtcmF0aW86IDEvMS4yO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kZWZhdWx0KTtcbiAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgLW1zLXVzZXItc2VsZWN0OiBub25lO1xuICB1c2VyLXNlbGVjdDogbm9uZTtcbn1cblxuLmtleVNwYWNlciB7XG4gIHZpc2liaWxpdHk6IGhpZGRlbjtcbiAgYXNwZWN0LXJhdGlvOiAxLzIuNDtcbn1cblxuI0JBQ0tTUEFDRSxcbiNFTlRFUiB7XG4gIGFzcGVjdC1yYXRpbzogMy8yLjQ7XG4gIGZvbnQtc2l6ZTogMi41Y3F3O1xufVxuXG4udGlsZUNsb3NlIHtcbiAgY29sb3I6IHZhcigtLWJyT3JhbmdlMik7XG4gIGJvcmRlcjogMC41Y3F3IHNvbGlkIHZhcigtLWJyT3JhbmdlMik7XG59XG5cbi50aWxlSGl0IHtcbiAgY29sb3I6IHZhcigtLWJyQmx1ZTEpO1xuICBib3JkZXI6IDAuNWNxdyBzb2xpZCB2YXIoLS1ickJsdWUxKTtcbn1cblxuLnRpbGVNaXNzIHtcbiAgY29sb3I6IHZhcigtLWdyYXkxKTtcbiAgYm9yZGVyOiAwLjVjcXcgc29saWQgdmFyKC0tZ3JheTEpO1xufVxuXG4uZ2FtZU92ZXIge1xuICBhbmltYXRpb24tbmFtZTogZmxhc2hCbHVlO1xuICBhbmltYXRpb24tZHVyYXRpb246IDFzO1xuICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiBpbmZpbml0ZTtcbn1cblxuLnByZXNzRW50ZXIge1xuICBhbmltYXRpb24tbmFtZTogZmxhc2hCbHVlO1xuICBhbmltYXRpb24tZHVyYXRpb246IDFzO1xuICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiBpbmZpbml0ZTtcbn1cblxuLm5vdFdvcmQge1xuICBhbmltYXRpb24tbmFtZTogZmxhc2hPcmFuZ2U7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMXM7XG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xufVxuXG4ucmVzZXQge1xuICBhbmltYXRpb246IDFzIGxpbmVhciByZXNldHRpbmc7XG59XG5cbkBrZXlmcmFtZXMgcmVzZXR0aW5nIHtcbiAgMCUge1xuICAgIHRyYW5zZm9ybTogcm90YXRlWCgwZGVnKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogcm90YXRlWCg5MGRlZyk7XG4gIH1cbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGVYKDBkZWcpO1xuICB9XG59XG5Aa2V5ZnJhbWVzIGZsYXNoT3JhbmdlIHtcbiAgMCUge1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJyT3JhbmdlMik7XG4gICAgY29sb3I6IHZhcigtLXRleHQpO1xuICAgIGJvcmRlcjogMC4yNWNxdyBzb2xpZCB2YXIoLS1ick9yYW5nZTIpO1xuICB9XG4gIDUwJSB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGVmYXVsdCk7XG4gICAgY29sb3I6IHZhcigtLXRleHQpO1xuICAgIGJvcmRlcjogMC4yNWNxdyBzb2xpZCB2YXIoLS10ZXh0KTtcbiAgfVxuICAxMDAlIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ick9yYW5nZTIpO1xuICAgIGNvbG9yOiB2YXIoLS10ZXh0KTtcbiAgICBib3JkZXI6IDAuMjVjcXcgc29saWQgdmFyKC0tYnJPcmFuZ2UyKTtcbiAgfVxufVxuQGtleWZyYW1lcyBmbGFzaEJsdWUge1xuICAwJSB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYnJCbHVlMSk7XG4gICAgY29sb3I6IHZhcigtLXRleHQpO1xuICAgIGJvcmRlcjogMC4yNWNxdyBzb2xpZCB2YXIoLS1ickJsdWUxKTtcbiAgfVxuICA1MCUge1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRlZmF1bHQpO1xuICAgIGNvbG9yOiB2YXIoLS10ZXh0KTtcbiAgICBib3JkZXI6IDAuMjVjcXcgc29saWQgdmFyKC0tdGV4dCk7XG4gIH1cbiAgMTAwJSB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYnJCbHVlMSk7XG4gICAgY29sb3I6IHZhcigtLXRleHQpO1xuICAgIGJvcmRlcjogMC4yNWNxdyBzb2xpZCB2YXIoLS1ickJsdWUxKTtcbiAgfVxufVxuLm1vZGFsQ29udGFpbmVyIHtcbiAgZGlzcGxheTogbm9uZTtcbiAgcG9zaXRpb246IGZpeGVkO1xuICB6LWluZGV4OiAxO1xuICBwYWRkaW5nLXRvcDogMTVjcXc7XG4gIHRvcDogMDtcbiAgcmlnaHQ6IDA7XG4gIGxlZnQ6IDA7XG4gIGJvdHRvbTogMDtcbiAgd2lkdGg6IDEwMGNxdztcbiAgb3ZlcmZsb3c6IGF1dG87XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMTgsIDE4LCAxOSwgMC42KTtcbn1cblxuLm1vZGFsQ29udGVudCB7XG4gIGZvbnQtZmFtaWx5OiBcIk94YW5pdW1cIiwgY3Vyc2l2ZTtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTQsIDE0NiwgMCwgMC4zKTtcbiAgY29sb3I6IHZhcigtLWJyT3JhbmdlMSk7XG4gIG1hcmdpbjogYXV0bztcbiAgcGFkZGluZzogMS41Y3F3O1xuICBwYWRkaW5nLXRvcDogMDtcbiAgd2lkdGg6IDgwY3F3O1xuICBtYXgtd2lkdGg6IDgwY3F3O1xuICBtYXgtaGVpZ2h0OiA5MGNxdztcbiAgZm9udC1zaXplOiA2Y3F3O1xuICBvdmVyZmxvdzogYXV0bztcbn1cblxuLm1vZGFsQ29udGVudCBociB7XG4gIGJvcmRlcjogMC4yNWNxdyBzb2xpZCB2YXIoLS1ick9yYW5nZTEpO1xuICBtYXJnaW4tdG9wOiAzY3F3O1xufVxuXG4ubW9kYWxUaXRsZSB7XG4gIGZvbnQtZmFtaWx5OiBcIk94YW5pdW1cIiwgY3Vyc2l2ZTtcbiAgbWFyZ2luOiAyY3F3IDAgMGNxdztcbiAgcGFkZGluZzogMmNxdyAwIDFjcXc7XG59XG5cbi5tb2RhbENvbnRlbnRJdGVtIHtcbiAgZm9udC1mYW1pbHk6IFwiT3hhbml1bVwiLCBjdXJzaXZlO1xuICBtYXJnaW46IDAgMDtcbiAgcGFkZGluZzogMWNxdyAyY3F3O1xuICBmb250LXNpemU6IDVjcXc7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG59XG5cbi5jbG9zZSB7XG4gIGNvbG9yOiB2YXIoLS1ick9yYW5nZTEpO1xuICBmbG9hdDogcmlnaHQ7XG4gIG1hcmdpbi1yaWdodDogMS41Y3F3O1xuICBmb250LXNpemU6IDZjcXc7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xufVxuXG4uY2xvc2U6aG92ZXIsXG4uY2xvc2U6Zm9jdXMge1xuICBjb2xvcjogdmFyKC0tYnJPcmFuZ2UzKTtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5cbi5zdGF0VGFibGUge1xuICBtYXJnaW46IDAgYXV0byAxLjVjcXc7XG59XG5cbi5zdGF0VGFibGUgdGQge1xuICBwYWRkaW5nOiAwIDRjcXc7XG59XG5cbi5zdGF0TnVtIHtcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XG59XG5cbjo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICB3aWR0aDogMmNxdztcbn1cblxuOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XG4gIGJhY2tncm91bmQ6IHJnYmEoMjU0LCAxNDYsIDAsIDAuMik7XG59XG5cbjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xuICBiYWNrZ3JvdW5kOiByZ2JhKDI1NCwgMTQ2LCAwLCAwLjQpO1xufVxuXG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iOmhvdmVyIHtcbiAgYmFja2dyb3VuZDogdmFyKC0tYnJPcmFuZ2UxKTtcbn1cblxuLm1vZGFsQ29udGVudCB7XG4gIHNjcm9sbGJhci1jb2xvcjogcmdiYSgyNTQsIDE0NiwgMCwgMC42KSByZ2JhKDI1NCwgMTQ2LCAwLCAwLjEpO1xufWAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vY2xpZW50L3N0eWxlL21haW4uY3Nz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LGVBQUE7RUFDQSxnQkFBQTtBQUpGOztBQU9BO0VBQ0UsdUJBQUE7RUFDQSxZQUFBO0VBQ0Esb0JBQUE7RUFDQSxlQUFBO0VBQ0EsaUJBQUE7QUFKRjs7QUFPQTs7RUFFRSx1QkFBQTtFQUNBLHFCQUFBO0VBQ0EsZUFBQTtBQUpGOztBQU9BO0VBQ0UscUJBQUE7QUFKRjs7QUFNQTtFQUNFLGVBQUE7QUFIRjs7QUFNQTtFQUNFLGlCQUFBO0FBSEY7O0FBTUE7RUFDRSxXQUFBO0FBSEY7O0FBTUE7RUFDRSxrQ0FBQTtBQUhGOztBQU1BO0VBQ0Usa0NBQUE7QUFIRjs7QUFNQTtFQUNFLDRCQUFBO0FBSEY7O0FBTUE7RUFDRSw4REFBQTtBQUhGXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIjpyb290IHtcXG4gIC0tZGVmYXVsdDogIzEyMTIxMztcXG4gIC0tdGV4dDogI2ZmZmZmZjtcXG4gIC0tZ3JheTE6ICM0YTRhNGM7XFxuICAtLWdyYXkyOiAjMmEyYTJjO1xcbiAgLS1ickJsdWUxOiAjMTdhYWQ4O1xcbiAgLS1ickJsdWUyOiAjMDE3Y2IwO1xcbiAgLS1ickJsdWUzOiAjMGI2MWE4O1xcbiAgLS1ick9yYW5nZTE6ICNmZTkyMDA7XFxuICAvKmVlNjEwYSovXFxuICAtLWJyT3JhbmdlMjogI2VlNjEwYTtcXG4gIC0tYnJPcmFuZ2UzOiAjZWE0MTBiO1xcbn1cXG5cXG5AZm9udC1mYWNlIHtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiQmxhZGUgUnVubmVyXFxcIjtcXG4gIHNyYzogdXJsKC4uL2ZvbnRzL0JMQURSTUZfLlRURik7XFxufVxcblxcbkBmb250LWZhY2Uge1xcbiAgZm9udC1mYW1pbHk6IFxcXCJPeGFuaXVtXFxcIjtcXG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcXG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XFxuICBzcmM6IHVybChcXFwiLi4vZm9udHMvT3hhbml1bS1WYXJpYWJsZUZvbnRfd2dodC50dGZcXFwiKTtcXG59XFxuXFxuaHRtbCxcXG5ib2R5IHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRlZmF1bHQpO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJPeGFuaXVtXFxcIiwgY3Vyc2l2ZTtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbmRpdiB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbn1cXG5cXG4uc3VwZXJjb250YWluZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIG1pbi13aWR0aDogMzIwcHg7XFxuICBtYXgtd2lkdGg6IDU0MHB4O1xcbiAgbWFyZ2luOiAxY3F3IGF1dG87XFxuICBjb250YWluZXItdHlwZTogaW5saW5lLXNpemU7XFxufVxcblxcbi5wYWdlQ29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgZmxleC1zaHJpbms6IDA7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICAvKm1hcmdpbjogMWNxdyBhdXRvO1xcbiAgbWluLXdpZHRoOiAzMjBweDtcXG4gIG1heC13aWR0aDogNTQwcHg7Ki9cXG4gIHdpZHRoOiAxMDAlO1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcbiAgLypncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjsqL1xcbiAgLypncmlkLXRlbXBsYXRlLXJvd3M6IGF1dG8gYXV0byAxZnI7Ki9cXG4gIC8qZ3JpZC1hdXRvLXJvd3M6IGF1dG87Ki9cXG4gIGNvbnRhaW5lci10eXBlOiBpbmxpbmUtc2l6ZTtcXG4gIGhlaWdodDogMTU1Y3F3O1xcbn1cXG5cXG4uaGVhZGVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4OiAwIDEgYXV0bztcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgY29sb3I6IHZhcigtLWJyT3JhbmdlMik7XFxuICBmb250LWZhbWlseTogXFxcIkJsYWRlIFJ1bm5lclxcXCI7XFxuICBmb250LXNpemU6IDhjcXc7XFxuICBwYWRkaW5nOiAyY3F3IDA7XFxuICBtYXJnaW46IDFjcXc7XFxuICBib3JkZXItYm90dG9tOiAwLjVjcXcgc29saWQgdmFyKC0tZ3JheTEpO1xcbiAgaGVpZ2h0OiA4Y3F3O1xcbiAgYm9yZGVyLXRvcDogMC41Y3F3IHNvbGlkIHZhcigtLWRlZmF1bHQpO1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxuICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xcbiAgLW1zLXVzZXItc2VsZWN0OiBub25lO1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxufVxcblxcbi5tZXNzYWdlIHtcXG4gIGNvbG9yOiB2YXIoLS1ick9yYW5nZTIpO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJPeGFuaXVtXFxcIiwgY3Vyc2l2ZTtcXG4gIGZvbnQtc2l6ZTogNmNxdztcXG4gIHBhZGRpbmc6IDJjcXcgMDtcXG4gIG1hcmdpbjogMWNxdztcXG4gIGhlaWdodDogOGNxdztcXG4gIGJvcmRlci1ib3R0b206IDAuNWNxdyBzb2xpZCB2YXIoLS1ick9yYW5nZTIpO1xcbiAgYm9yZGVyLXRvcDogMC41Y3F3IHNvbGlkIHZhcigtLWJyT3JhbmdlMik7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kZWZhdWx0KTtcXG59XFxuXFxuLmdhbWVDb250YWluZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgZmxleDogMCAxIGF1dG87XFxuICB3aWR0aDogMTAwY3F3O1xcbiAgbWFyZ2luOiBhdXRvO1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxuICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xcbiAgLW1zLXVzZXItc2VsZWN0OiBub25lO1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxufVxcblxcbi50aWxlR3JpZCB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgd2lkdGg6IDc1Y3F3O1xcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnIgMWZyIDFmciAxZnIgMWZyIDFmcjtcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmciAxZnIgMWZyIDFmcjtcXG4gIGdyaWQtZ2FwOiAxLjVjcXc7XFxuICBtYXJnaW46IDAuNWNxdyAwO1xcbn1cXG5cXG4udGlsZSB7XFxuICBhc3BlY3QtcmF0aW86IDEgLyAxO1xcbiAgYm9yZGVyOiAwLjVjcXcgc29saWQgdmFyKC0tZ3JheTEpO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIGNvbG9yOiB2YXIoLS10ZXh0KTtcXG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiT3hhbml1bVxcXCIsIGN1cnNpdmU7XFxuICBmb250LXNpemU6IDdjcXc7XFxufVxcblxcbi50aWxlV2F0ZXJNYXJrIHtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiQmxhZGUgUnVubmVyXFxcIjtcXG4gIGNvbG9yOiB2YXIoLS1ncmF5Mik7XFxufVxcblxcbi5rZXlib2FyZENvbnRhaW5lciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleDogMCAxIGF1dG87XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIG1hcmdpbjogYXV0bztcXG4gIG1hcmdpbi10b3A6IDJjcXc7XFxuICB3aWR0aDogMTAwY3F3O1xcbn1cXG5cXG4ua2V5Ym9hcmRHcmlkIHtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICB3aWR0aDogOThjcXc7XFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IDFmciAxZnIgMWZyO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XFxuICBncmlkLXJvdy1nYXA6IDEuNWNxdztcXG59XFxuXFxuLmtleWJvYXJkUm93MSB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgd2lkdGg6IDk4Y3F3O1xcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnI7XFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnIgMWZyIDFmciAxZnIgMWZyIDFmciAxZnIgMWZyIDFmcjtcXG4gIGdyaWQtY29sdW1uLWdhcDogMS41Y3F3O1xcbn1cXG4ua2V5Ym9hcmRSb3cyIHtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICB3aWR0aDogOThjcXc7XFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IDFmcjtcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMC41ZnIgMWZyIDFmciAxZnIgMWZyIDFmciAxZnIgMWZyIDFmciAxZnIgMC41ZnI7XFxuICBncmlkLWNvbHVtbi1nYXA6IDEuNWNxdztcXG59XFxuLmtleWJvYXJkUm93MyB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgd2lkdGg6IDk4Y3F3O1xcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnI7XFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDEuNWZyIDFmciAxZnIgMWZyIDFmciAxZnIgMWZyIDFmciAxLjVmcjtcXG4gIGdyaWQtY29sdW1uLWdhcDogMS41Y3F3O1xcbn1cXG5cXG4ua2V5LFxcbi5rZXlTcGFjZXIge1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGJvcmRlcjogMC4yNWNxdyBzb2xpZCB2YXIoLS10ZXh0KTtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBmb250LWZhbWlseTogXFxcIk94YW5pdW1cXFwiLCBjdXJzaXZlO1xcbiAgZm9udC1zaXplOiAzLjVjcXc7XFxuICBmb250LXdlaWdodDogYm9sZGVyO1xcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcXG4gIHBhZGRpbmc6IDAgMDtcXG4gIGJvcmRlci1yYWRpdXM6IDEuNWNxdztcXG4gIGNvbG9yOiB2YXIoLS10ZXh0KTtcXG4gIGFzcGVjdC1yYXRpbzogMSAvIDEuMjtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRlZmF1bHQpO1xcbiAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcXG4gIC1tcy11c2VyLXNlbGVjdDogbm9uZTtcXG4gIHVzZXItc2VsZWN0OiBub25lO1xcbn1cXG5cXG4ua2V5U3BhY2VyIHtcXG4gIHZpc2liaWxpdHk6IGhpZGRlbjtcXG4gIGFzcGVjdC1yYXRpbzogMSAvIDIuNDtcXG59XFxuXFxuI0JBQ0tTUEFDRSxcXG4jRU5URVIge1xcbiAgYXNwZWN0LXJhdGlvOiAzIC8gMi40O1xcbiAgZm9udC1zaXplOiAyLjVjcXc7XFxufVxcblxcbi50aWxlQ2xvc2Uge1xcbiAgY29sb3I6IHZhcigtLWJyT3JhbmdlMik7XFxuICBib3JkZXI6IDAuNWNxdyBzb2xpZCB2YXIoLS1ick9yYW5nZTIpO1xcbn1cXG5cXG4udGlsZUhpdCB7XFxuICBjb2xvcjogdmFyKC0tYnJCbHVlMSk7XFxuICBib3JkZXI6IDAuNWNxdyBzb2xpZCB2YXIoLS1ickJsdWUxKTtcXG59XFxuLnRpbGVNaXNzIHtcXG4gIGNvbG9yOiB2YXIoLS1ncmF5MSk7XFxuICBib3JkZXI6IDAuNWNxdyBzb2xpZCB2YXIoLS1ncmF5MSk7XFxufVxcblxcbi5nYW1lT3ZlciB7XFxuICBhbmltYXRpb24tbmFtZTogZmxhc2hCbHVlO1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAxcztcXG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xcbn1cXG5cXG4ucHJlc3NFbnRlciB7XFxuICBhbmltYXRpb24tbmFtZTogZmxhc2hCbHVlO1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAxcztcXG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xcbn1cXG5cXG4ubm90V29yZCB7XFxuICBhbmltYXRpb24tbmFtZTogZmxhc2hPcmFuZ2U7XFxuICBhbmltYXRpb24tZHVyYXRpb246IDFzO1xcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XFxufVxcblxcbi5yZXNldCB7XFxuICBhbmltYXRpb246IDFzIGxpbmVhciByZXNldHRpbmc7XFxufVxcblxcbkBrZXlmcmFtZXMgcmVzZXR0aW5nIHtcXG4gIDAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGVYKDBkZWcpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGVYKDkwZGVnKTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZVgoMGRlZyk7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgZmxhc2hPcmFuZ2Uge1xcbiAgMCUge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ick9yYW5nZTIpO1xcbiAgICBjb2xvcjogdmFyKC0tdGV4dCk7XFxuICAgIGJvcmRlcjogMC4yNWNxdyBzb2xpZCB2YXIoLS1ick9yYW5nZTIpO1xcbiAgfVxcblxcbiAgNTAlIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGVmYXVsdCk7XFxuICAgIGNvbG9yOiB2YXIoLS10ZXh0KTtcXG4gICAgYm9yZGVyOiAwLjI1Y3F3IHNvbGlkIHZhcigtLXRleHQpO1xcbiAgfVxcblxcbiAgMTAwJSB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJyT3JhbmdlMik7XFxuICAgIGNvbG9yOiB2YXIoLS10ZXh0KTtcXG4gICAgYm9yZGVyOiAwLjI1Y3F3IHNvbGlkIHZhcigtLWJyT3JhbmdlMik7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgZmxhc2hCbHVlIHtcXG4gIDAlIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYnJCbHVlMSk7XFxuICAgIGNvbG9yOiB2YXIoLS10ZXh0KTtcXG4gICAgYm9yZGVyOiAwLjI1Y3F3IHNvbGlkIHZhcigtLWJyQmx1ZTEpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGVmYXVsdCk7XFxuICAgIGNvbG9yOiB2YXIoLS10ZXh0KTtcXG4gICAgYm9yZGVyOiAwLjI1Y3F3IHNvbGlkIHZhcigtLXRleHQpO1xcbiAgfVxcblxcbiAgMTAwJSB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJyQmx1ZTEpO1xcbiAgICBjb2xvcjogdmFyKC0tdGV4dCk7XFxuICAgIGJvcmRlcjogMC4yNWNxdyBzb2xpZCB2YXIoLS1ickJsdWUxKTtcXG4gIH1cXG59XFxuXFxuLm1vZGFsQ29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxuICBwb3NpdGlvbjogZml4ZWQ7XFxuICB6LWluZGV4OiAxO1xcbiAgcGFkZGluZy10b3A6IDE1Y3F3O1xcbiAgdG9wOiAwO1xcbiAgcmlnaHQ6IDA7XFxuICBsZWZ0OiAwO1xcbiAgYm90dG9tOiAwO1xcbiAgd2lkdGg6IDEwMGNxdztcXG4gIG92ZXJmbG93OiBhdXRvO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxOCwgMTgsIDE5LCAwLjYpO1xcbn1cXG5cXG4ubW9kYWxDb250ZW50IHtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiT3hhbml1bVxcXCIsIGN1cnNpdmU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NCwgMTQ2LCAwLCAwLjMpO1xcbiAgY29sb3I6IHZhcigtLWJyT3JhbmdlMSk7XFxuICBtYXJnaW46IGF1dG87XFxuICBwYWRkaW5nOiAxLjVjcXc7XFxuICBwYWRkaW5nLXRvcDogMDtcXG4gIHdpZHRoOiA4MGNxdztcXG4gIG1heC13aWR0aDogODBjcXc7XFxuICBtYXgtaGVpZ2h0OiA5MGNxdztcXG4gIGZvbnQtc2l6ZTogNmNxdztcXG4gIG92ZXJmbG93OiBhdXRvO1xcbn1cXG5cXG4ubW9kYWxDb250ZW50IGhyIHtcXG4gIGJvcmRlcjogMC4yNWNxdyBzb2xpZCB2YXIoLS1ick9yYW5nZTEpO1xcbiAgbWFyZ2luLXRvcDogM2NxdztcXG59XFxuXFxuLm1vZGFsVGl0bGUge1xcbiAgZm9udC1mYW1pbHk6IFxcXCJPeGFuaXVtXFxcIiwgY3Vyc2l2ZTtcXG4gIG1hcmdpbjogMmNxdyAwIDBjcXc7XFxuICBwYWRkaW5nOiAyY3F3IDAgMWNxdztcXG59XFxuXFxuLm1vZGFsQ29udGVudEl0ZW0ge1xcbiAgZm9udC1mYW1pbHk6IFxcXCJPeGFuaXVtXFxcIiwgY3Vyc2l2ZTtcXG4gIG1hcmdpbjogMCAwO1xcbiAgcGFkZGluZzogMWNxdyAyY3F3O1xcbiAgZm9udC1zaXplOiA1Y3F3O1xcbiAgdGV4dC1hbGlnbjogbGVmdDtcXG59XFxuXFxuLmNsb3NlIHtcXG4gIGNvbG9yOiB2YXIoLS1ick9yYW5nZTEpO1xcbiAgZmxvYXQ6IHJpZ2h0O1xcbiAgbWFyZ2luLXJpZ2h0OiAxLjVjcXc7XFxuICBmb250LXNpemU6IDZjcXc7XFxuICBmb250LXdlaWdodDogYm9sZDtcXG59XFxuXFxuLmNsb3NlOmhvdmVyLFxcbi5jbG9zZTpmb2N1cyB7XFxuICBjb2xvcjogdmFyKC0tYnJPcmFuZ2UzKTtcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuLnN0YXRUYWJsZSB7XFxuICBtYXJnaW46IDAgYXV0byAxLjVjcXc7XFxufVxcbi5zdGF0VGFibGUgdGQge1xcbiAgcGFkZGluZzogMCA0Y3F3O1xcbn1cXG5cXG4uc3RhdE51bSB7XFxuICB0ZXh0LWFsaWduOiByaWdodDtcXG59XFxuXFxuOjotd2Via2l0LXNjcm9sbGJhciB7XFxuICB3aWR0aDogMmNxdztcXG59XFxuXFxuOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XFxuICBiYWNrZ3JvdW5kOiByZ2JhKDI1NCwgMTQ2LCAwLCAwLjIpO1xcbn1cXG5cXG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcXG4gIGJhY2tncm91bmQ6IHJnYmEoMjU0LCAxNDYsIDAsIDAuNCk7XFxufVxcblxcbjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWI6aG92ZXIge1xcbiAgYmFja2dyb3VuZDogdmFyKC0tYnJPcmFuZ2UxKTtcXG59XFxuXFxuLm1vZGFsQ29udGVudCB7XFxuICBzY3JvbGxiYXItY29sb3I6IHJnYmEoMjU0LCAxNDYsIDAsIDAuNikgcmdiYSgyNTQsIDE0NiwgMCwgMC4xKTtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHVybCwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgaWYgKCF1cmwpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG4gIHVybCA9IFN0cmluZyh1cmwuX19lc01vZHVsZSA/IHVybC5kZWZhdWx0IDogdXJsKTtcblxuICAvLyBJZiB1cmwgaXMgYWxyZWFkeSB3cmFwcGVkIGluIHF1b3RlcywgcmVtb3ZlIHRoZW1cbiAgaWYgKC9eWydcIl0uKlsnXCJdJC8udGVzdCh1cmwpKSB7XG4gICAgdXJsID0gdXJsLnNsaWNlKDEsIC0xKTtcbiAgfVxuICBpZiAob3B0aW9ucy5oYXNoKSB7XG4gICAgdXJsICs9IG9wdGlvbnMuaGFzaDtcbiAgfVxuXG4gIC8vIFNob3VsZCB1cmwgYmUgd3JhcHBlZD9cbiAgLy8gU2VlIGh0dHBzOi8vZHJhZnRzLmNzc3dnLm9yZy9jc3MtdmFsdWVzLTMvI3VybHNcbiAgaWYgKC9bXCInKCkgXFx0XFxuXXwoJTIwKS8udGVzdCh1cmwpIHx8IG9wdGlvbnMubmVlZFF1b3Rlcykge1xuICAgIHJldHVybiBcIlxcXCJcIi5jb25jYXQodXJsLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKS5yZXBsYWNlKC9cXG4vZywgXCJcXFxcblwiKSwgXCJcXFwiXCIpO1xuICB9XG4gIHJldHVybiB1cmw7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gIGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgcmV0dXJuIENvbnN0cnVjdG9yO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVDb21wdXRlZFN0eWxlVmFsdWUoc3RyaW5nKSB7XG4gIC8vIFwiMjUwcHhcIiAtLT4gMjUwXG4gIHJldHVybiArc3RyaW5nLnJlcGxhY2UoL3B4LywgJycpO1xufVxuXG5mdW5jdGlvbiBmaXhEUFIoY2FudmFzKSB7XG4gIHZhciBkcHIgPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgdmFyIGNvbXB1dGVkU3R5bGVzID0gZ2V0Q29tcHV0ZWRTdHlsZShjYW52YXMpO1xuICB2YXIgd2lkdGggPSBub3JtYWxpemVDb21wdXRlZFN0eWxlVmFsdWUoY29tcHV0ZWRTdHlsZXMuZ2V0UHJvcGVydHlWYWx1ZSgnd2lkdGgnKSk7XG4gIHZhciBoZWlnaHQgPSBub3JtYWxpemVDb21wdXRlZFN0eWxlVmFsdWUoY29tcHV0ZWRTdHlsZXMuZ2V0UHJvcGVydHlWYWx1ZSgnaGVpZ2h0JykpO1xuICBjYW52YXMuc2V0QXR0cmlidXRlKCd3aWR0aCcsICh3aWR0aCAqIGRwcikudG9TdHJpbmcoKSk7XG4gIGNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIChoZWlnaHQgKiBkcHIpLnRvU3RyaW5nKCkpO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbU51bWJlcihtaW4sIG1heCkge1xuICB2YXIgZnJhY3Rpb25EaWdpdHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IDA7XG4gIHZhciByYW5kb21OdW1iZXIgPSBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW47XG4gIHJldHVybiBNYXRoLmZsb29yKHJhbmRvbU51bWJlciAqIE1hdGgucG93KDEwLCBmcmFjdGlvbkRpZ2l0cykpIC8gTWF0aC5wb3coMTAsIGZyYWN0aW9uRGlnaXRzKTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21BcnJheUVsZW1lbnQoYXJyKSB7XG4gIHJldHVybiBhcnJbZ2VuZXJhdGVSYW5kb21OdW1iZXIoMCwgYXJyLmxlbmd0aCldO1xufVxuXG52YXIgRlJFRV9GQUxMSU5HX09CSkVDVF9BQ0NFTEVSQVRJT04gPSAwLjAwMTI1O1xudmFyIE1JTl9EUkFHX0ZPUkNFX0NPRUZGSUNJRU5UID0gMC4wMDA1O1xudmFyIE1BWF9EUkFHX0ZPUkNFX0NPRUZGSUNJRU5UID0gMC4wMDA5O1xudmFyIFJPVEFUSU9OX1NMT1dET1dOX0FDQ0VMRVJBVElPTiA9IDAuMDAwMDE7XG52YXIgSU5JVElBTF9TSEFQRV9SQURJVVMgPSA2O1xudmFyIElOSVRJQUxfRU1PSklfU0laRSA9IDgwO1xudmFyIE1JTl9JTklUSUFMX0NPTkZFVFRJX1NQRUVEID0gMC45O1xudmFyIE1BWF9JTklUSUFMX0NPTkZFVFRJX1NQRUVEID0gMS43O1xudmFyIE1JTl9GSU5BTF9YX0NPTkZFVFRJX1NQRUVEID0gMC4yO1xudmFyIE1BWF9GSU5BTF9YX0NPTkZFVFRJX1NQRUVEID0gMC42O1xudmFyIE1JTl9JTklUSUFMX1JPVEFUSU9OX1NQRUVEID0gMC4wMztcbnZhciBNQVhfSU5JVElBTF9ST1RBVElPTl9TUEVFRCA9IDAuMDc7XG52YXIgTUlOX0NPTkZFVFRJX0FOR0xFID0gMTU7XG52YXIgTUFYX0NPTkZFVFRJX0FOR0xFID0gODI7XG52YXIgTUFYX0NPTkZFVFRJX1BPU0lUSU9OX1NISUZUID0gMTUwO1xudmFyIFNIQVBFX1ZJU0lCSUxJVFlfVFJFU0hPTEQgPSAxMDA7XG52YXIgREVGQVVMVF9DT05GRVRUSV9OVU1CRVIgPSAyNTA7XG52YXIgREVGQVVMVF9FTU9KSVNfTlVNQkVSID0gNDA7XG52YXIgREVGQVVMVF9DT05GRVRUSV9DT0xPUlMgPSBbJyNmY2Y0MDMnLCAnIzYyZmMwMycsICcjZjRmYzAzJywgJyMwM2U3ZmMnLCAnIzAzZmNhNScsICcjYTUwM2ZjJywgJyNmYzAzYWQnLCAnI2ZjMDNjMiddO1xuXG5mdW5jdGlvbiBnZXRXaW5kb3dXaWR0aENvZWZmaWNpZW50KGNhbnZhc1dpZHRoKSB7XG4gIHZhciBIRF9TQ1JFRU5fV0lEVEggPSAxOTIwO1xuICByZXR1cm4gTWF0aC5sb2coY2FudmFzV2lkdGgpIC8gTWF0aC5sb2coSERfU0NSRUVOX1dJRFRIKTtcbn1cblxudmFyIENvbmZldHRpU2hhcGUgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBDb25mZXR0aVNoYXBlKGFyZ3MpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ29uZmV0dGlTaGFwZSk7XG5cbiAgICB2YXIgaW5pdGlhbFBvc2l0aW9uID0gYXJncy5pbml0aWFsUG9zaXRpb24sXG4gICAgICAgIGRpcmVjdGlvbiA9IGFyZ3MuZGlyZWN0aW9uLFxuICAgICAgICBjb25mZXR0aVJhZGl1cyA9IGFyZ3MuY29uZmV0dGlSYWRpdXMsXG4gICAgICAgIGNvbmZldHRpQ29sb3JzID0gYXJncy5jb25mZXR0aUNvbG9ycyxcbiAgICAgICAgZW1vamlzID0gYXJncy5lbW9qaXMsXG4gICAgICAgIGVtb2ppU2l6ZSA9IGFyZ3MuZW1vamlTaXplLFxuICAgICAgICBjYW52YXNXaWR0aCA9IGFyZ3MuY2FudmFzV2lkdGg7XG4gICAgdmFyIHJhbmRvbUNvbmZldHRpU3BlZWQgPSBnZW5lcmF0ZVJhbmRvbU51bWJlcihNSU5fSU5JVElBTF9DT05GRVRUSV9TUEVFRCwgTUFYX0lOSVRJQUxfQ09ORkVUVElfU1BFRUQsIDMpO1xuICAgIHZhciBpbml0aWFsU3BlZWQgPSByYW5kb21Db25mZXR0aVNwZWVkICogZ2V0V2luZG93V2lkdGhDb2VmZmljaWVudChjYW52YXNXaWR0aCk7XG4gICAgdGhpcy5jb25mZXR0aVNwZWVkID0ge1xuICAgICAgeDogaW5pdGlhbFNwZWVkLFxuICAgICAgeTogaW5pdGlhbFNwZWVkXG4gICAgfTtcbiAgICB0aGlzLmZpbmFsQ29uZmV0dGlTcGVlZFggPSBnZW5lcmF0ZVJhbmRvbU51bWJlcihNSU5fRklOQUxfWF9DT05GRVRUSV9TUEVFRCwgTUFYX0ZJTkFMX1hfQ09ORkVUVElfU1BFRUQsIDMpO1xuICAgIHRoaXMucm90YXRpb25TcGVlZCA9IGVtb2ppcy5sZW5ndGggPyAwLjAxIDogZ2VuZXJhdGVSYW5kb21OdW1iZXIoTUlOX0lOSVRJQUxfUk9UQVRJT05fU1BFRUQsIE1BWF9JTklUSUFMX1JPVEFUSU9OX1NQRUVELCAzKSAqIGdldFdpbmRvd1dpZHRoQ29lZmZpY2llbnQoY2FudmFzV2lkdGgpO1xuICAgIHRoaXMuZHJhZ0ZvcmNlQ29lZmZpY2llbnQgPSBnZW5lcmF0ZVJhbmRvbU51bWJlcihNSU5fRFJBR19GT1JDRV9DT0VGRklDSUVOVCwgTUFYX0RSQUdfRk9SQ0VfQ09FRkZJQ0lFTlQsIDYpO1xuICAgIHRoaXMucmFkaXVzID0ge1xuICAgICAgeDogY29uZmV0dGlSYWRpdXMsXG4gICAgICB5OiBjb25mZXR0aVJhZGl1c1xuICAgIH07XG4gICAgdGhpcy5pbml0aWFsUmFkaXVzID0gY29uZmV0dGlSYWRpdXM7XG4gICAgdGhpcy5yb3RhdGlvbkFuZ2xlID0gZGlyZWN0aW9uID09PSAnbGVmdCcgPyBnZW5lcmF0ZVJhbmRvbU51bWJlcigwLCAwLjIsIDMpIDogZ2VuZXJhdGVSYW5kb21OdW1iZXIoLTAuMiwgMCwgMyk7XG4gICAgdGhpcy5lbW9qaVNpemUgPSBlbW9qaVNpemU7XG4gICAgdGhpcy5lbW9qaVJvdGF0aW9uQW5nbGUgPSBnZW5lcmF0ZVJhbmRvbU51bWJlcigwLCAyICogTWF0aC5QSSk7XG4gICAgdGhpcy5yYWRpdXNZVXBkYXRlRGlyZWN0aW9uID0gJ2Rvd24nO1xuICAgIHZhciBhbmdsZSA9IGRpcmVjdGlvbiA9PT0gJ2xlZnQnID8gZ2VuZXJhdGVSYW5kb21OdW1iZXIoTUFYX0NPTkZFVFRJX0FOR0xFLCBNSU5fQ09ORkVUVElfQU5HTEUpICogTWF0aC5QSSAvIDE4MCA6IGdlbmVyYXRlUmFuZG9tTnVtYmVyKC1NSU5fQ09ORkVUVElfQU5HTEUsIC1NQVhfQ09ORkVUVElfQU5HTEUpICogTWF0aC5QSSAvIDE4MDtcbiAgICB0aGlzLmFic0NvcyA9IE1hdGguYWJzKE1hdGguY29zKGFuZ2xlKSk7XG4gICAgdGhpcy5hYnNTaW4gPSBNYXRoLmFicyhNYXRoLnNpbihhbmdsZSkpO1xuICAgIHZhciBwb3NpdGlvblNoaWZ0ID0gZ2VuZXJhdGVSYW5kb21OdW1iZXIoLU1BWF9DT05GRVRUSV9QT1NJVElPTl9TSElGVCwgMCk7XG4gICAgdmFyIHNoaWZ0ZWRJbml0aWFsUG9zaXRpb24gPSB7XG4gICAgICB4OiBpbml0aWFsUG9zaXRpb24ueCArIChkaXJlY3Rpb24gPT09ICdsZWZ0JyA/IC1wb3NpdGlvblNoaWZ0IDogcG9zaXRpb25TaGlmdCkgKiB0aGlzLmFic0NvcyxcbiAgICAgIHk6IGluaXRpYWxQb3NpdGlvbi55IC0gcG9zaXRpb25TaGlmdCAqIHRoaXMuYWJzU2luXG4gICAgfTtcbiAgICB0aGlzLmN1cnJlbnRQb3NpdGlvbiA9IE9iamVjdC5hc3NpZ24oe30sIHNoaWZ0ZWRJbml0aWFsUG9zaXRpb24pO1xuICAgIHRoaXMuaW5pdGlhbFBvc2l0aW9uID0gT2JqZWN0LmFzc2lnbih7fSwgc2hpZnRlZEluaXRpYWxQb3NpdGlvbik7XG4gICAgdGhpcy5jb2xvciA9IGVtb2ppcy5sZW5ndGggPyBudWxsIDogZ2VuZXJhdGVSYW5kb21BcnJheUVsZW1lbnQoY29uZmV0dGlDb2xvcnMpO1xuICAgIHRoaXMuZW1vamkgPSBlbW9qaXMubGVuZ3RoID8gZ2VuZXJhdGVSYW5kb21BcnJheUVsZW1lbnQoZW1vamlzKSA6IG51bGw7XG4gICAgdGhpcy5jcmVhdGVkQXQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhDb25mZXR0aVNoYXBlLCBbe1xuICAgIGtleTogXCJkcmF3XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRyYXcoY2FudmFzQ29udGV4dCkge1xuICAgICAgdmFyIGN1cnJlbnRQb3NpdGlvbiA9IHRoaXMuY3VycmVudFBvc2l0aW9uLFxuICAgICAgICAgIHJhZGl1cyA9IHRoaXMucmFkaXVzLFxuICAgICAgICAgIGNvbG9yID0gdGhpcy5jb2xvcixcbiAgICAgICAgICBlbW9qaSA9IHRoaXMuZW1vamksXG4gICAgICAgICAgcm90YXRpb25BbmdsZSA9IHRoaXMucm90YXRpb25BbmdsZSxcbiAgICAgICAgICBlbW9qaVJvdGF0aW9uQW5nbGUgPSB0aGlzLmVtb2ppUm90YXRpb25BbmdsZSxcbiAgICAgICAgICBlbW9qaVNpemUgPSB0aGlzLmVtb2ppU2l6ZTtcbiAgICAgIHZhciBkcHIgPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcblxuICAgICAgaWYgKGNvbG9yKSB7XG4gICAgICAgIGNhbnZhc0NvbnRleHQuZmlsbFN0eWxlID0gY29sb3I7XG4gICAgICAgIGNhbnZhc0NvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIGNhbnZhc0NvbnRleHQuZWxsaXBzZShjdXJyZW50UG9zaXRpb24ueCAqIGRwciwgY3VycmVudFBvc2l0aW9uLnkgKiBkcHIsIHJhZGl1cy54ICogZHByLCByYWRpdXMueSAqIGRwciwgcm90YXRpb25BbmdsZSwgMCwgMiAqIE1hdGguUEkpO1xuICAgICAgICBjYW52YXNDb250ZXh0LmZpbGwoKTtcbiAgICAgIH0gZWxzZSBpZiAoZW1vamkpIHtcbiAgICAgICAgY2FudmFzQ29udGV4dC5mb250ID0gXCJcIi5jb25jYXQoZW1vamlTaXplLCBcInB4IHNlcmlmXCIpO1xuICAgICAgICBjYW52YXNDb250ZXh0LnNhdmUoKTtcbiAgICAgICAgY2FudmFzQ29udGV4dC50cmFuc2xhdGUoZHByICogY3VycmVudFBvc2l0aW9uLngsIGRwciAqIGN1cnJlbnRQb3NpdGlvbi55KTtcbiAgICAgICAgY2FudmFzQ29udGV4dC5yb3RhdGUoZW1vamlSb3RhdGlvbkFuZ2xlKTtcbiAgICAgICAgY2FudmFzQ29udGV4dC50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgY2FudmFzQ29udGV4dC5maWxsVGV4dChlbW9qaSwgMCwgMCk7XG4gICAgICAgIGNhbnZhc0NvbnRleHQucmVzdG9yZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ1cGRhdGVQb3NpdGlvblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGVQb3NpdGlvbihpdGVyYXRpb25UaW1lRGVsdGEsIGN1cnJlbnRUaW1lKSB7XG4gICAgICB2YXIgY29uZmV0dGlTcGVlZCA9IHRoaXMuY29uZmV0dGlTcGVlZCxcbiAgICAgICAgICBkcmFnRm9yY2VDb2VmZmljaWVudCA9IHRoaXMuZHJhZ0ZvcmNlQ29lZmZpY2llbnQsXG4gICAgICAgICAgZmluYWxDb25mZXR0aVNwZWVkWCA9IHRoaXMuZmluYWxDb25mZXR0aVNwZWVkWCxcbiAgICAgICAgICByYWRpdXNZVXBkYXRlRGlyZWN0aW9uID0gdGhpcy5yYWRpdXNZVXBkYXRlRGlyZWN0aW9uLFxuICAgICAgICAgIHJvdGF0aW9uU3BlZWQgPSB0aGlzLnJvdGF0aW9uU3BlZWQsXG4gICAgICAgICAgY3JlYXRlZEF0ID0gdGhpcy5jcmVhdGVkQXQsXG4gICAgICAgICAgZGlyZWN0aW9uID0gdGhpcy5kaXJlY3Rpb247XG4gICAgICB2YXIgdGltZURlbHRhU2luY2VDcmVhdGlvbiA9IGN1cnJlbnRUaW1lIC0gY3JlYXRlZEF0O1xuICAgICAgaWYgKGNvbmZldHRpU3BlZWQueCA+IGZpbmFsQ29uZmV0dGlTcGVlZFgpIHRoaXMuY29uZmV0dGlTcGVlZC54IC09IGRyYWdGb3JjZUNvZWZmaWNpZW50ICogaXRlcmF0aW9uVGltZURlbHRhO1xuICAgICAgdGhpcy5jdXJyZW50UG9zaXRpb24ueCArPSBjb25mZXR0aVNwZWVkLnggKiAoZGlyZWN0aW9uID09PSAnbGVmdCcgPyAtdGhpcy5hYnNDb3MgOiB0aGlzLmFic0NvcykgKiBpdGVyYXRpb25UaW1lRGVsdGE7XG4gICAgICB0aGlzLmN1cnJlbnRQb3NpdGlvbi55ID0gdGhpcy5pbml0aWFsUG9zaXRpb24ueSAtIGNvbmZldHRpU3BlZWQueSAqIHRoaXMuYWJzU2luICogdGltZURlbHRhU2luY2VDcmVhdGlvbiArIEZSRUVfRkFMTElOR19PQkpFQ1RfQUNDRUxFUkFUSU9OICogTWF0aC5wb3codGltZURlbHRhU2luY2VDcmVhdGlvbiwgMikgLyAyO1xuICAgICAgdGhpcy5yb3RhdGlvblNwZWVkIC09IHRoaXMuZW1vamkgPyAwLjAwMDEgOiBST1RBVElPTl9TTE9XRE9XTl9BQ0NFTEVSQVRJT04gKiBpdGVyYXRpb25UaW1lRGVsdGE7XG4gICAgICBpZiAodGhpcy5yb3RhdGlvblNwZWVkIDwgMCkgdGhpcy5yb3RhdGlvblNwZWVkID0gMDsgLy8gbm8gbmVlZCB0byB1cGRhdGUgcm90YXRpb24gcmFkaXVzIGZvciBlbW9qaVxuXG4gICAgICBpZiAodGhpcy5lbW9qaSkge1xuICAgICAgICB0aGlzLmVtb2ppUm90YXRpb25BbmdsZSArPSB0aGlzLnJvdGF0aW9uU3BlZWQgKiBpdGVyYXRpb25UaW1lRGVsdGEgJSAoMiAqIE1hdGguUEkpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChyYWRpdXNZVXBkYXRlRGlyZWN0aW9uID09PSAnZG93bicpIHtcbiAgICAgICAgdGhpcy5yYWRpdXMueSAtPSBpdGVyYXRpb25UaW1lRGVsdGEgKiByb3RhdGlvblNwZWVkO1xuXG4gICAgICAgIGlmICh0aGlzLnJhZGl1cy55IDw9IDApIHtcbiAgICAgICAgICB0aGlzLnJhZGl1cy55ID0gMDtcbiAgICAgICAgICB0aGlzLnJhZGl1c1lVcGRhdGVEaXJlY3Rpb24gPSAndXAnO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJhZGl1cy55ICs9IGl0ZXJhdGlvblRpbWVEZWx0YSAqIHJvdGF0aW9uU3BlZWQ7XG5cbiAgICAgICAgaWYgKHRoaXMucmFkaXVzLnkgPj0gdGhpcy5pbml0aWFsUmFkaXVzKSB7XG4gICAgICAgICAgdGhpcy5yYWRpdXMueSA9IHRoaXMuaW5pdGlhbFJhZGl1cztcbiAgICAgICAgICB0aGlzLnJhZGl1c1lVcGRhdGVEaXJlY3Rpb24gPSAnZG93bic7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0SXNWaXNpYmxlT25DYW52YXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0SXNWaXNpYmxlT25DYW52YXMoY2FudmFzSGVpZ2h0KSB7XG4gICAgICByZXR1cm4gdGhpcy5jdXJyZW50UG9zaXRpb24ueSA8IGNhbnZhc0hlaWdodCArIFNIQVBFX1ZJU0lCSUxJVFlfVFJFU0hPTEQ7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIENvbmZldHRpU2hhcGU7XG59KCk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUNhbnZhcygpIHtcbiAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICBjYW52YXMuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnO1xuICBjYW52YXMuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gIGNhbnZhcy5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XG4gIGNhbnZhcy5zdHlsZS50b3AgPSAnMCc7XG4gIGNhbnZhcy5zdHlsZS5sZWZ0ID0gJzAnO1xuICBjYW52YXMuc3R5bGUuekluZGV4ID0gJzEwMDAnO1xuICBjYW52YXMuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xuICByZXR1cm4gY2FudmFzO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVDb25mZXR0aUNvbmZpZyhjb25mZXR0aUNvbmZpZykge1xuICB2YXIgX2NvbmZldHRpQ29uZmlnJGNvbmZlID0gY29uZmV0dGlDb25maWcuY29uZmV0dGlSYWRpdXMsXG4gICAgICBjb25mZXR0aVJhZGl1cyA9IF9jb25mZXR0aUNvbmZpZyRjb25mZSA9PT0gdm9pZCAwID8gSU5JVElBTF9TSEFQRV9SQURJVVMgOiBfY29uZmV0dGlDb25maWckY29uZmUsXG4gICAgICBfY29uZmV0dGlDb25maWckY29uZmUyID0gY29uZmV0dGlDb25maWcuY29uZmV0dGlOdW1iZXIsXG4gICAgICBjb25mZXR0aU51bWJlciA9IF9jb25mZXR0aUNvbmZpZyRjb25mZTIgPT09IHZvaWQgMCA/IGNvbmZldHRpQ29uZmlnLmNvbmZldHRpZXNOdW1iZXIgfHwgKGNvbmZldHRpQ29uZmlnLmVtb2ppcyA/IERFRkFVTFRfRU1PSklTX05VTUJFUiA6IERFRkFVTFRfQ09ORkVUVElfTlVNQkVSKSA6IF9jb25mZXR0aUNvbmZpZyRjb25mZTIsXG4gICAgICBfY29uZmV0dGlDb25maWckY29uZmUzID0gY29uZmV0dGlDb25maWcuY29uZmV0dGlDb2xvcnMsXG4gICAgICBjb25mZXR0aUNvbG9ycyA9IF9jb25mZXR0aUNvbmZpZyRjb25mZTMgPT09IHZvaWQgMCA/IERFRkFVTFRfQ09ORkVUVElfQ09MT1JTIDogX2NvbmZldHRpQ29uZmlnJGNvbmZlMyxcbiAgICAgIF9jb25mZXR0aUNvbmZpZyRlbW9qaSA9IGNvbmZldHRpQ29uZmlnLmVtb2ppcyxcbiAgICAgIGVtb2ppcyA9IF9jb25mZXR0aUNvbmZpZyRlbW9qaSA9PT0gdm9pZCAwID8gY29uZmV0dGlDb25maWcuZW1vamllcyB8fCBbXSA6IF9jb25mZXR0aUNvbmZpZyRlbW9qaSxcbiAgICAgIF9jb25mZXR0aUNvbmZpZyRlbW9qaTIgPSBjb25mZXR0aUNvbmZpZy5lbW9qaVNpemUsXG4gICAgICBlbW9qaVNpemUgPSBfY29uZmV0dGlDb25maWckZW1vamkyID09PSB2b2lkIDAgPyBJTklUSUFMX0VNT0pJX1NJWkUgOiBfY29uZmV0dGlDb25maWckZW1vamkyOyAvLyBkZXByZWNhdGUgd3JvbmcgcGx1cmFsIGZvcm1zLCB1c2VkIGluIGVhcmx5IHJlbGVhc2VzXG5cbiAgaWYgKGNvbmZldHRpQ29uZmlnLmVtb2ppZXMpIGNvbnNvbGUuZXJyb3IoXCJlbW9qaWVzIGFyZ3VtZW50IGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSB1c2UgZW1vamlzIGluc3RlYWRcIik7XG4gIGlmIChjb25mZXR0aUNvbmZpZy5jb25mZXR0aWVzTnVtYmVyKSBjb25zb2xlLmVycm9yKFwiY29uZmV0dGllc051bWJlciBhcmd1bWVudCBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIGNvbmZldHRpTnVtYmVyIGluc3RlYWRcIik7XG4gIHJldHVybiB7XG4gICAgY29uZmV0dGlSYWRpdXM6IGNvbmZldHRpUmFkaXVzLFxuICAgIGNvbmZldHRpTnVtYmVyOiBjb25mZXR0aU51bWJlcixcbiAgICBjb25mZXR0aUNvbG9yczogY29uZmV0dGlDb2xvcnMsXG4gICAgZW1vamlzOiBlbW9qaXMsXG4gICAgZW1vamlTaXplOiBlbW9qaVNpemVcbiAgfTtcbn1cblxudmFyIENvbmZldHRpQmF0Y2ggPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBDb25mZXR0aUJhdGNoKGNhbnZhc0NvbnRleHQpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIENvbmZldHRpQmF0Y2gpO1xuXG4gICAgdGhpcy5jYW52YXNDb250ZXh0ID0gY2FudmFzQ29udGV4dDtcbiAgICB0aGlzLnNoYXBlcyA9IFtdO1xuICAgIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChjb21wbGV0aW9uQ2FsbGJhY2spIHtcbiAgICAgIHJldHVybiBfdGhpcy5yZXNvbHZlUHJvbWlzZSA9IGNvbXBsZXRpb25DYWxsYmFjaztcbiAgICB9KTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhDb25mZXR0aUJhdGNoLCBbe1xuICAgIGtleTogXCJnZXRCYXRjaENvbXBsZXRlUHJvbWlzZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRCYXRjaENvbXBsZXRlUHJvbWlzZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb21pc2U7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImFkZFNoYXBlc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRTaGFwZXMoKSB7XG4gICAgICB2YXIgX3RoaXMkc2hhcGVzO1xuXG4gICAgICAoX3RoaXMkc2hhcGVzID0gdGhpcy5zaGFwZXMpLnB1c2guYXBwbHkoX3RoaXMkc2hhcGVzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjb21wbGV0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wbGV0ZSgpIHtcbiAgICAgIHZhciBfYTtcblxuICAgICAgaWYgKHRoaXMuc2hhcGVzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIChfYSA9IHRoaXMucmVzb2x2ZVByb21pc2UpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jYWxsKHRoaXMpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInByb2Nlc3NTaGFwZXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcHJvY2Vzc1NoYXBlcyh0aW1lLCBjYW52YXNIZWlnaHQsIGNsZWFudXBJbnZpc2libGVTaGFwZXMpIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICB2YXIgdGltZURlbHRhID0gdGltZS50aW1lRGVsdGEsXG4gICAgICAgICAgY3VycmVudFRpbWUgPSB0aW1lLmN1cnJlbnRUaW1lO1xuICAgICAgdGhpcy5zaGFwZXMgPSB0aGlzLnNoYXBlcy5maWx0ZXIoZnVuY3Rpb24gKHNoYXBlKSB7XG4gICAgICAgIC8vIFJlbmRlciB0aGUgc2hhcGVzIGluIHRoaXMgYmF0Y2hcbiAgICAgICAgc2hhcGUudXBkYXRlUG9zaXRpb24odGltZURlbHRhLCBjdXJyZW50VGltZSk7XG4gICAgICAgIHNoYXBlLmRyYXcoX3RoaXMyLmNhbnZhc0NvbnRleHQpOyAvLyBPbmx5IGNsZWFudXAgdGhlIHNoYXBlcyBpZiB3ZSdyZSBiZWluZyBhc2tlZCB0b1xuXG4gICAgICAgIGlmICghY2xlYW51cEludmlzaWJsZVNoYXBlcykge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNoYXBlLmdldElzVmlzaWJsZU9uQ2FudmFzKGNhbnZhc0hlaWdodCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gQ29uZmV0dGlCYXRjaDtcbn0oKTtcblxudmFyIEpTQ29uZmV0dGkgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBKU0NvbmZldHRpKCkge1xuICAgIHZhciBqc0NvbmZldHRpQ29uZmlnID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBKU0NvbmZldHRpKTtcblxuICAgIHRoaXMuYWN0aXZlQ29uZmV0dGlCYXRjaGVzID0gW107XG4gICAgdGhpcy5jYW52YXMgPSBqc0NvbmZldHRpQ29uZmlnLmNhbnZhcyB8fCBjcmVhdGVDYW52YXMoKTtcbiAgICB0aGlzLmNhbnZhc0NvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIHRoaXMucmVxdWVzdEFuaW1hdGlvbkZyYW1lUmVxdWVzdGVkID0gZmFsc2U7XG4gICAgdGhpcy5sYXN0VXBkYXRlZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIHRoaXMuaXRlcmF0aW9uSW5kZXggPSAwO1xuICAgIHRoaXMubG9vcCA9IHRoaXMubG9vcC5iaW5kKHRoaXMpO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmxvb3ApO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEpTQ29uZmV0dGksIFt7XG4gICAga2V5OiBcImxvb3BcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbG9vcCgpIHtcbiAgICAgIHRoaXMucmVxdWVzdEFuaW1hdGlvbkZyYW1lUmVxdWVzdGVkID0gZmFsc2U7XG4gICAgICBmaXhEUFIodGhpcy5jYW52YXMpO1xuICAgICAgdmFyIGN1cnJlbnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICB2YXIgdGltZURlbHRhID0gY3VycmVudFRpbWUgLSB0aGlzLmxhc3RVcGRhdGVkO1xuICAgICAgdmFyIGNhbnZhc0hlaWdodCA9IHRoaXMuY2FudmFzLm9mZnNldEhlaWdodDtcbiAgICAgIHZhciBjbGVhbnVwSW52aXNpYmxlU2hhcGVzID0gdGhpcy5pdGVyYXRpb25JbmRleCAlIDEwID09PSAwO1xuICAgICAgdGhpcy5hY3RpdmVDb25mZXR0aUJhdGNoZXMgPSB0aGlzLmFjdGl2ZUNvbmZldHRpQmF0Y2hlcy5maWx0ZXIoZnVuY3Rpb24gKGJhdGNoKSB7XG4gICAgICAgIGJhdGNoLnByb2Nlc3NTaGFwZXMoe1xuICAgICAgICAgIHRpbWVEZWx0YTogdGltZURlbHRhLFxuICAgICAgICAgIGN1cnJlbnRUaW1lOiBjdXJyZW50VGltZVxuICAgICAgICB9LCBjYW52YXNIZWlnaHQsIGNsZWFudXBJbnZpc2libGVTaGFwZXMpOyAvLyBEbyBub3QgcmVtb3ZlIGludmlzaWJsZSBzaGFwZXMgb24gZXZlcnkgaXRlcmF0aW9uXG5cbiAgICAgICAgaWYgKCFjbGVhbnVwSW52aXNpYmxlU2hhcGVzKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gIWJhdGNoLmNvbXBsZXRlKCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuaXRlcmF0aW9uSW5kZXgrKztcbiAgICAgIHRoaXMucXVldWVBbmltYXRpb25GcmFtZUlmTmVlZGVkKGN1cnJlbnRUaW1lKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicXVldWVBbmltYXRpb25GcmFtZUlmTmVlZGVkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHF1ZXVlQW5pbWF0aW9uRnJhbWVJZk5lZWRlZChjdXJyZW50VGltZSkge1xuICAgICAgaWYgKHRoaXMucmVxdWVzdEFuaW1hdGlvbkZyYW1lUmVxdWVzdGVkKSB7XG4gICAgICAgIC8vIFdlIGFscmVhZHkgaGF2ZSBhIHBlbmRlZCBhbmltYXRpb24gZnJhbWUsIHNvIHRoZXJlIGlzIG5vIG1vcmUgd29ya1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbmZldHRpQmF0Y2hlcy5sZW5ndGggPCAxKSB7XG4gICAgICAgIC8vIE5vIHNoYXBlcyB0byBhbmltYXRlLCBzbyBkb24ndCBxdWV1ZSBhbm90aGVyIGZyYW1lXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVSZXF1ZXN0ZWQgPSB0cnVlOyAvLyBDYXB0dXJlIHRoZSBsYXN0IHVwZGF0ZWQgdGltZSBmb3IgYW5pbWF0aW9uXG5cbiAgICAgIHRoaXMubGFzdFVwZGF0ZWQgPSBjdXJyZW50VGltZSB8fCBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmxvb3ApO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJhZGRDb25mZXR0aVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRDb25mZXR0aSgpIHtcbiAgICAgIHZhciBjb25mZXR0aUNvbmZpZyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cbiAgICAgIHZhciBfbm9ybWFsaXplQ29uZmV0dGlDb24gPSBub3JtYWxpemVDb25mZXR0aUNvbmZpZyhjb25mZXR0aUNvbmZpZyksXG4gICAgICAgICAgY29uZmV0dGlSYWRpdXMgPSBfbm9ybWFsaXplQ29uZmV0dGlDb24uY29uZmV0dGlSYWRpdXMsXG4gICAgICAgICAgY29uZmV0dGlOdW1iZXIgPSBfbm9ybWFsaXplQ29uZmV0dGlDb24uY29uZmV0dGlOdW1iZXIsXG4gICAgICAgICAgY29uZmV0dGlDb2xvcnMgPSBfbm9ybWFsaXplQ29uZmV0dGlDb24uY29uZmV0dGlDb2xvcnMsXG4gICAgICAgICAgZW1vamlzID0gX25vcm1hbGl6ZUNvbmZldHRpQ29uLmVtb2ppcyxcbiAgICAgICAgICBlbW9qaVNpemUgPSBfbm9ybWFsaXplQ29uZmV0dGlDb24uZW1vamlTaXplOyAvLyBVc2UgdGhlIGJvdW5kaW5nIHJlY3QgcmF0aGVyIHRhaG4gdGhlIGNhbnZhcyB3aWR0aCAvIGhlaWdodCwgYmVjYXVzZVxuICAgICAgLy8gLndpZHRoIC8gLmhlaWdodCBhcmUgdW5zZXQgdW50aWwgYSBsYXlvdXQgcGFzcyBoYXMgYmVlbiBjb21wbGV0ZWQuIFVwb25cbiAgICAgIC8vIGNvbmZldHRpIGJlaW5nIGltbWVkaWF0ZWx5IHF1ZXVlZCBvbiBhIHBhZ2UgbG9hZCwgdGhpcyBoYXNuJ3QgaGFwcGVuZWQgc29cbiAgICAgIC8vIHRoZSBkZWZhdWx0IG9mIDMwMHgxNTAgd2lsbCBiZSByZXR1cm5lZCwgY2F1c2luZyBhbiBpbXByb3BlciBzb3VyY2UgcG9pbnRcbiAgICAgIC8vIGZvciB0aGUgY29uZmV0dGkgYW5pbWF0aW9uLlxuXG5cbiAgICAgIHZhciBjYW52YXNSZWN0ID0gdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICB2YXIgY2FudmFzV2lkdGggPSBjYW52YXNSZWN0LndpZHRoO1xuICAgICAgdmFyIGNhbnZhc0hlaWdodCA9IGNhbnZhc1JlY3QuaGVpZ2h0O1xuICAgICAgdmFyIHlQb3NpdGlvbiA9IGNhbnZhc0hlaWdodCAqIDUgLyA3O1xuICAgICAgdmFyIGxlZnRDb25mZXR0aVBvc2l0aW9uID0ge1xuICAgICAgICB4OiAwLFxuICAgICAgICB5OiB5UG9zaXRpb25cbiAgICAgIH07XG4gICAgICB2YXIgcmlnaHRDb25mZXR0aVBvc2l0aW9uID0ge1xuICAgICAgICB4OiBjYW52YXNXaWR0aCxcbiAgICAgICAgeTogeVBvc2l0aW9uXG4gICAgICB9O1xuICAgICAgdmFyIGNvbmZldHRpR3JvdXAgPSBuZXcgQ29uZmV0dGlCYXRjaCh0aGlzLmNhbnZhc0NvbnRleHQpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbmZldHRpTnVtYmVyIC8gMjsgaSsrKSB7XG4gICAgICAgIHZhciBjb25mZXR0aU9uVGhlUmlnaHQgPSBuZXcgQ29uZmV0dGlTaGFwZSh7XG4gICAgICAgICAgaW5pdGlhbFBvc2l0aW9uOiBsZWZ0Q29uZmV0dGlQb3NpdGlvbixcbiAgICAgICAgICBkaXJlY3Rpb246ICdyaWdodCcsXG4gICAgICAgICAgY29uZmV0dGlSYWRpdXM6IGNvbmZldHRpUmFkaXVzLFxuICAgICAgICAgIGNvbmZldHRpQ29sb3JzOiBjb25mZXR0aUNvbG9ycyxcbiAgICAgICAgICBjb25mZXR0aU51bWJlcjogY29uZmV0dGlOdW1iZXIsXG4gICAgICAgICAgZW1vamlzOiBlbW9qaXMsXG4gICAgICAgICAgZW1vamlTaXplOiBlbW9qaVNpemUsXG4gICAgICAgICAgY2FudmFzV2lkdGg6IGNhbnZhc1dpZHRoXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgY29uZmV0dGlPblRoZUxlZnQgPSBuZXcgQ29uZmV0dGlTaGFwZSh7XG4gICAgICAgICAgaW5pdGlhbFBvc2l0aW9uOiByaWdodENvbmZldHRpUG9zaXRpb24sXG4gICAgICAgICAgZGlyZWN0aW9uOiAnbGVmdCcsXG4gICAgICAgICAgY29uZmV0dGlSYWRpdXM6IGNvbmZldHRpUmFkaXVzLFxuICAgICAgICAgIGNvbmZldHRpQ29sb3JzOiBjb25mZXR0aUNvbG9ycyxcbiAgICAgICAgICBjb25mZXR0aU51bWJlcjogY29uZmV0dGlOdW1iZXIsXG4gICAgICAgICAgZW1vamlzOiBlbW9qaXMsXG4gICAgICAgICAgZW1vamlTaXplOiBlbW9qaVNpemUsXG4gICAgICAgICAgY2FudmFzV2lkdGg6IGNhbnZhc1dpZHRoXG4gICAgICAgIH0pO1xuICAgICAgICBjb25mZXR0aUdyb3VwLmFkZFNoYXBlcyhjb25mZXR0aU9uVGhlUmlnaHQsIGNvbmZldHRpT25UaGVMZWZ0KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5hY3RpdmVDb25mZXR0aUJhdGNoZXMucHVzaChjb25mZXR0aUdyb3VwKTtcbiAgICAgIHRoaXMucXVldWVBbmltYXRpb25GcmFtZUlmTmVlZGVkKCk7XG4gICAgICByZXR1cm4gY29uZmV0dGlHcm91cC5nZXRCYXRjaENvbXBsZXRlUHJvbWlzZSgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjbGVhckNhbnZhc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjbGVhckNhbnZhcygpIHtcbiAgICAgIHRoaXMuYWN0aXZlQ29uZmV0dGlCYXRjaGVzID0gW107XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEpTQ29uZmV0dGk7XG59KCk7XG5cbmV4cG9ydCBkZWZhdWx0IEpTQ29uZmV0dGk7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cnVsZVNldFsxXS5ydWxlc1swXS51c2VbMl0hLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vbWFpbi5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvZGlzdC9janMuanM/P3J1bGVTZXRbMV0ucnVsZXNbMF0udXNlWzJdIS4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL21haW4uY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiLi9cIjsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmIgPSBkb2N1bWVudC5iYXNlVVJJIHx8IHNlbGYubG9jYXRpb24uaHJlZjtcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuLy8gbm8gb24gY2h1bmtzIGxvYWRlZFxuXG4vLyBubyBqc29ucCBmdW5jdGlvbiIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBcIi4uL3N0eWxlL21haW4uY3NzXCI7XG5pbXBvcnQgeyBDYW1wYWlnbiB9IGZyb20gXCIuL2NhbXBhaWduLmpzXCI7XG5pbXBvcnQgeyBSb3VuZCB9IGZyb20gXCIuL3JvdW5kLmpzXCI7XG5pbXBvcnQgeyBVSSB9IGZyb20gXCIuL3VpLmpzXCI7XG5pbXBvcnQgeyBXT1JEUyB9IGZyb20gXCIuL3dvcmRzLmpzXCI7XG5pbXBvcnQgeyBXT1JEU19TVVBQTEVNRU5UIH0gZnJvbSBcIi4vd29yZHMtc3VwcGxlbWVudC5qc1wiO1xuaW1wb3J0IEpTQ29uZmV0dGkgZnJvbSBcImpzLWNvbmZldHRpXCI7XG5cbmxldCBnYW1lLCB1aSwgY2FtcGFpZ247XG5jb25zdCBqc0NvbmZldHRpID0gbmV3IEpTQ29uZmV0dGkoKTtcblxuYXN5bmMgZnVuY3Rpb24gY2hlY2tSb3coKSB7XG4gIGNvbnN0IGd1ZXNzID0gdWkuYm9hcmRbdWkuY3VyUm93XS5qb2luKFwiXCIpO1xuICB1aS5jbGlja0F1ZGlvLnBhdXNlKCk7XG4gIGlmIChcbiAgICAhV09SRFMuaW5jbHVkZXMoZ3Vlc3MudG9VcHBlckNhc2UoKSkgJiZcbiAgICAhV09SRFNfU1VQUExFTUVOVC5pbmNsdWRlcyhndWVzcy50b1VwcGVyQ2FzZSgpKVxuICApIHtcbiAgICB1aS5pbnZhbGlkQXVkaW8ucGxheSgpLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgLypkbyBub3RoaW5nIC0gaXQncyBqdXN0IGF1ZGlvKi9cbiAgICB9KTtcbiAgICB1aS5kaXNwbGF5TWVzc2FnZShgJHtndWVzc30gaXMgbm90IGEgd29yZGApO1xuICAgIEJBQ0tTUEFDRS5jbGFzc0xpc3QuYWRkKFwibm90V29yZFwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgZ2FtZS5zdWJtaXRHdWVzcyhndWVzcyk7XG4gIGF3YWl0IHVpLnJldmVhbEd1ZXNzKGdhbWUuZ3Vlc3NTdGF0dXMoKSk7XG4gIHVpLnVwZGF0ZUtleWJvYXJkKGdhbWUubGV0dGVyU3RhdHVzKTtcbiAgaWYgKGdhbWUuc2VjcmV0V29yZCA9PT0gZ3Vlc3MpIHtcbiAgICB3aW5Sb3V0aW5lKCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICh1aS5jdXJSb3cgPj0gNSkge1xuICAgIGxvc2VSb3V0aW5lKCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdWkuY3VyUm93Kys7XG4gIHVpLmN1ckNvbCA9IDA7XG59XG5cbmZ1bmN0aW9uIHdpblJvdXRpbmUoKSB7XG4gIHVpLmN1clJvdysrO1xuICBsZXQgZ2FtZURldGFpbHMgPSB7XG4gICAgb3V0Y29tZTogXCJ3b25cIixcbiAgICBhdHRlbXB0czogdWkuY3VyUm93LFxuICAgIHdvcmQ6IGdhbWUuc2VjcmV0V29yZCxcbiAgICBzY29yZTogZ2FtZS53b3JkQmFzZVBvaW50VmFsdWUoKSAqIDEwICoqICg2IC0gdWkuY3VyUm93KSxcbiAgfTtcbiAgdWkuYnVzeSA9IHRydWU7XG4gIHVpLnN1Y2Nlc3NBdWRpby5wbGF5KCkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgLypkbyBub3RoaW5nIC0gaXQncyBqdXN0IGF1ZGlvKi9cbiAgfSk7XG4gIGpzQ29uZmV0dGkuYWRkQ29uZmV0dGkoe1xuICAgIGNvbmZldHRpQ29sb3JzOiBbXG4gICAgICBcIiMxN2FhZDhcIixcbiAgICAgIFwiIzAxN2NiMFwiLFxuICAgICAgXCIjMGI2MWE4XCIsXG4gICAgICBcIiNmZTkyMDBcIixcbiAgICAgIFwiI2VlNjEwYVwiLFxuICAgICAgXCIjZWE0MTBiXCIsXG4gICAgXSxcbiAgfSk7XG4gIGNhbXBhaWduLnVwZGF0ZUNhbXBhaWduKGdhbWVEZXRhaWxzKTtcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgdWkuc2hvd01vZGFsKFxuICAgICAgXCJTdWNjZXNzXCIsXG4gICAgICBbXG4gICAgICAgIHRhYmxpemVTdGF0cyhnYW1lRGV0YWlscyksXG4gICAgICAgIFwiPGk+V2hhdCBpdCBtZWFuczo8Lz5cIixcbiAgICAgICAgLi4uZm9ybWF0RGVmaW5pdGlvbihnYW1lLndvcmREZWZpbml0aW9uKSxcbiAgICAgIF0sXG4gICAgICBnYW1lLmdhbWVTdGF0ZVxuICAgICk7XG4gICAgdWkuYnVzeSA9IGZhbHNlO1xuICB9LCAxNTAwKTtcbn1cblxuZnVuY3Rpb24gbG9zZVJvdXRpbmUoKSB7XG4gIHVpLmN1clJvdysrO1xuICBsZXQgZ2FtZURldGFpbHMgPSB7XG4gICAgb3V0Y29tZTogXCJsb3N0XCIsXG4gICAgYXR0ZW1wdHM6IHVpLmN1clJvdyxcbiAgICB3b3JkOiBnYW1lLnNlY3JldFdvcmQsXG4gICAgc2NvcmU6XG4gICAgICBjYW1wYWlnbi5hdmVyYWdlU2NvcmUoKSA+IDBcbiAgICAgICAgPyAtMSAqIGNhbXBhaWduLmF2ZXJhZ2VTY29yZSgpXG4gICAgICAgIDogY2FtcGFpZ24uYXZlcmFnZVNjb3JlKCksXG4gIH07XG4gIGNhbXBhaWduLnVwZGF0ZUNhbXBhaWduKGdhbWVEZXRhaWxzKTtcbiAgdWkuZmFpbEF1ZGlvLnBsYXkoKS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAvKmRvIG5vdGhpbmcgLSBpdCdzIGp1c3QgYXVkaW8qL1xuICB9KTtcbiAgdWkuc2hvd01vZGFsKFxuICAgIFwiRmFpbHVyZVwiLFxuICAgIFtcbiAgICAgIHRhYmxpemVTdGF0cyhnYW1lRGV0YWlscyksXG4gICAgICBcIjxpPldoYXQgaXQgbWVhbnM6PC8+XCIsXG4gICAgICAuLi5mb3JtYXREZWZpbml0aW9uKGdhbWUud29yZERlZmluaXRpb24pLFxuICAgIF0sXG4gICAgZ2FtZS5nYW1lU3RhdGVcbiAgKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0RGVmaW5pdGlvbihwYWNrZWREZWZpbml0aW9uKSB7XG4gIHJldHVybiBwYWNrZWREZWZpbml0aW9uLm1hcCgoZWwpID0+IHtcbiAgICBsZXQgaHRtbFN0cmluZyA9IFwiXCI7XG4gICAgaWYgKGVsLnBhcnRPZlNwZWVjaCkgaHRtbFN0cmluZyA9IGA8aT4ke2VsLnBhcnRPZlNwZWVjaH06PC9pPiZuYnNwOyZuYnNwO2A7XG4gICAgcmV0dXJuIGAke2h0bWxTdHJpbmd9JHtlbC5kZWZpbml0aW9ufWA7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiB0YWJsaXplU3RhdHMoZ2FtZURldGFpbHMpIHtcbiAgbGV0IHN0YXRTdHIgPSBcIjxocj48dGFibGUgY2xhc3M9J3N0YXRUYWJsZSc+XCI7XG5cbiAgZnVuY3Rpb24gc3RhdFJvdyhzdGF0S2V5LCBzdGF0VmFsdWUpIHtcbiAgICByZXR1cm4gYDx0cj48dGQ+JHtzdGF0S2V5fTwvdGQ+PHRkIGNsYXNzPVwic3RhdE51bVwiPiR7c3RhdFZhbHVlfTwvdGQ+PC90cj5gO1xuICB9XG5cbiAgaWYgKGdhbWVEZXRhaWxzKSB7XG4gICAgc3RhdFN0ciA9IGAke3N0YXRTdHJ9JHtzdGF0Um93KFwiV29yZFwiLCBnYW1lRGV0YWlscy53b3JkKX1gO1xuICAgIHN0YXRTdHIgPSBgJHtzdGF0U3RyfSR7c3RhdFJvdyhcIkF0dGVtcHRzXCIsIGdhbWVEZXRhaWxzLmF0dGVtcHRzKX1gO1xuICAgIHN0YXRTdHIgPSBgJHtzdGF0U3RyfSR7c3RhdFJvdyhcIlJvdW5kIFNjb3JlXCIsIGdhbWVEZXRhaWxzLnNjb3JlKX1gO1xuICB9XG4gIGZvciAobGV0IGVsIG9mIGNhbXBhaWduLmNhbXBhaWduU3VtbWFyeSgpKSB7XG4gICAgc3RhdFN0ciA9IGAke3N0YXRTdHJ9JHtzdGF0Um93KGVsLmxhYmVsLCBlbC52YWx1ZSl9YDtcbiAgfVxuICByZXR1cm4gYCR7c3RhdFN0cn08L3RhYmxlPjxocj5gO1xufVxuXG5mdW5jdGlvbiBpbnN0cnVjdGlvbnMoKSB7XG4gIHVpLnNob3dNb2RhbChcbiAgICBcIk1pc3Npb24gQnJpZWZpbmdcIixcbiAgICBbXG4gICAgICBcIkRlY3J5cHQgdGhlIGNvZGUuXCIsXG4gICAgICBcIkVhY2ggY29kZSBpcyBhIDUgbGV0dGVyIHdvcmQuXCIsXG4gICAgICBcIkJsdWUgaW5kaWNhdGVzIHJpZ2h0IGxldHRlciBpbiByaWdodCBwb3NpdGlvbi5cIixcbiAgICAgIFwiT3JhbmdlIGluZGljYXRlcyByaWdodCBsZXR0ZXIgaW4gd3JvbmcgcG9zaXRpb24uXCIsXG4gICAgICBcIllvdSBoYXZlIDYgYXR0ZW1wdHMgYmVmb3JlIGxvY2tvdXQuXCIsXG4gICAgICBcIkdvb2QgTHVjayFcIixcbiAgICAgIC8vIFwiJm5ic3A7Jm5ic3A7XCIsXG4gICAgICB0YWJsaXplU3RhdHMoKSxcbiAgICAgIFwiVGhlIHNjb3JlIGNhbGN1bGF0aW9uIHN0YXJ0cyB3aXRoIHRoZSByYXcgc2NyYWJibGUgd29yZCBcIiArXG4gICAgICAgIFwidmFsdWUgYW5kIGlzIHRoZW4gbXVsdGlwbGllZCBieSAxMCBmb3IgZXZlcnkgdW51c2VkIGF0dGVtcHQuIFwiICtcbiAgICAgICAgXCJGb3IgZXhhbXBsZSwgaWYgdGhlIHdvcmQgd2FzIFNNQVJUIGFuZCBpdCB3YXMgc29sdmVkIG9uIHRoZSBcIiArXG4gICAgICAgIFwiZm91cnRoIGF0dGVtcHQsIHRoZSBzY29yZSB3b3VsZCBiZSB0aGUgcmF3IHdvcmQgdmFsdWUgb2YgNyBtdWx0aXBsaWVkIFwiICtcbiAgICAgICAgXCJieSAxMCB0d2ljZSwgb25jZSBmb3IgZWFjaCBvZiB0aGUgdHdvIHVudXNlZCBhdHRlbXB0czogNyB4IDEwIHggMTAgPSA3MDAuXCIsXG4gICAgXSxcbiAgICBnYW1lLmdhbWVTdGF0ZVxuICApO1xufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gIGlmICh1aS5idXN5KSByZXR1cm47XG4gIGlmIChldmVudC5rZXkgPT09IFwiRW50ZXJcIiAmJiBtb2RhbENvbnRhaW5lci5zdHlsZS5kaXNwbGF5ICE9PSBcIm5vbmVcIikge1xuICAgIGNsb3NlQnV0dG9uLmNsaWNrKCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZXZlbnQua2V5LnRvVXBwZXJDYXNlKCkpICYmXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZXZlbnQua2V5LnRvVXBwZXJDYXNlKCkpLmNsaWNrKCk7XG5cbiAgaWYgKGV2ZW50LmtleSA9PT0gXCJEZWxldGVcIikgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJCQUNLU1BBQ0VcIikuY2xpY2soKTtcbn0pO1xuXG5wYWdlQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHRvdWNoQW5kQ2xpY2tIYW5kbGVyKTtcblxucGFnZUNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdG91Y2hBbmRDbGlja0hhbmRsZXIpO1xuXG5mdW5jdGlvbiB0b3VjaEFuZENsaWNrSGFuZGxlcihldmVudCkge1xuICBpZiAoIShldmVudC50YXJnZXQubm9kZU5hbWUgPT09IFwiU1BBTlwiKSkgcmV0dXJuO1xuICBpZiAodWkuYnVzeSkgcmV0dXJuO1xuXG4gIGlmIChldmVudC50eXBlID09PSBcInRvdWNoc3RhcnRcIikge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH1cblxuICB1aS5jbGlja0F1ZGlvLmN1cnJlbnRUaW1lID0gMDtcbiAgdWkuY2xpY2tBdWRpby5wbGF5KCkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgLypkbyBub3RoaW5nIC0gaXQncyBqdXN0IGF1ZGlvKi9cbiAgfSk7XG5cbiAgbGV0IGtleSA9IGV2ZW50LnRhcmdldC5pZDtcbiAgaWYgKGdhbWUuZ2FtZVN0YXRlID09PSBcIlBMQVlJTkdcIikge1xuICAgIGlmIChrZXkgPT09IFwiQkFDS1NQQUNFXCIpIHtcbiAgICAgIEVOVEVSLmNsYXNzTGlzdC5yZW1vdmUoXCJwcmVzc0VudGVyXCIpO1xuICAgICAgdWkuZGVsZXRlTGV0dGVyKCk7XG4gICAgfVxuICAgIGlmIChrZXkgPT09IFwiRU5URVJcIiAmJiB1aS5jdXJDb2wgPiA0KSB7XG4gICAgICBFTlRFUi5jbGFzc0xpc3QucmVtb3ZlKFwicHJlc3NFbnRlclwiKTtcbiAgICAgIGNoZWNrUm93KCk7XG4gICAgfVxuICAgIGlmIChcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaXCIuc3BsaXQoXCJcIikuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgRU5URVIuY2xhc3NMaXN0LnJlbW92ZShcInByZXNzRW50ZXJcIik7XG4gICAgICBpZiAodWkuY3VyQ29sID4gMykge1xuICAgICAgICBFTlRFUi5jbGFzc0xpc3QuYWRkKFwicHJlc3NFbnRlclwiKTtcbiAgICAgIH1cbiAgICAgIHVpLmFwcGVuZExldHRlcihrZXkpO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoZ2FtZS5nYW1lU3RhdGUgIT09IFwiUExBWUlOR1wiICYmIGtleSA9PT0gXCJFTlRFUlwiKSBuZXdSb3VuZCgpO1xufVxuXG5mdW5jdGlvbiBuZXdSb3VuZCgpIHtcbiAgZ2FtZSA9IG5ldyBSb3VuZChXT1JEU1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBXT1JEUy5sZW5ndGgpXSk7XG4gIGNvbnNvbGUubG9nKGdhbWUuc2VjcmV0V29yZCk7XG4gIHVpLnJlc2V0KCk7XG59XG5cbmZ1bmN0aW9uIG1haW4oKSB7XG4gIC8vIGxvY2FsU3RvcmFnZS5jbGVhcigpXG4gIGNhbXBhaWduID0gbmV3IENhbXBhaWduKCk7XG4gIHVpID0gbmV3IFVJKHBhZ2VDb250YWluZXIpO1xuICBuZXdSb3VuZCgpO1xuICBpbnN0cnVjdGlvbnMoKTtcbn1cblxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgbWFpbigpO1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==