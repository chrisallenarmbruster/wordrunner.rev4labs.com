export class UI {
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
    this.clickAudio = new Audio("./audio/click.mp3")
    this.compAudio = new Audio("./audio/comp.mp3")
    this.successAudio = new Audio("./audio/fight.mp3")
    this.failAudio = new Audio("./audio/regret.mp3")
    this.invalidAudio = new Audio("./audio/invalid.mp3")
    this.ratchetAudio = new Audio("./audio/ratchet.mp3")
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
    const keyButton = document.createElement("button")
    keyButton.id = key === "⌫" ? "BACKSPACE" : key === "ENTER" ? "ENTER" : key
    keyButton.className = key === " " ? "keySpacer" : "key"
    keyButton.textContent = key
    return keyButton
  }

  drawKeyboardRow(container, row, keys) {
    const keyboardRow = document.createElement("div")
    keyboardRow.className = "keyboardRowContainer"

    const keyboardRowGrid = document.createElement("div")
    keyboardRowGrid.id = `keyboardRow${row}`
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
    let modalContent = document.createElement("div")
    modalContent.id = "modalContent"
    modalContent.className = "modalContent"

    let closeButton = document.createElement("span")
    closeButton.id = "closeButton"
    closeButton.className = "close"
    closeButton.textContent = `x`
    closeButton.addEventListener("click", () => {
      modalContainer.style.display = "none"
      this.successAudio.pause()
      this.successAudio.currentTime = 0
      this.failAudio.pause()
      this.failAudio.currentTime = 0
      if (gameState !== "PLAYING") {
        ENTER.classList.add("gameOver")
        ENTER.textContent = "RESET"
      }
    })
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
