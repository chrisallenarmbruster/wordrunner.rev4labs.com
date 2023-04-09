export class UI {
  constructor(container) {
    this.initialUiSetup(container)
    this.uiState = {
      curRow: 0,
      curCol: 0,
      board: [
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
      ],
      busy: false,
    }
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
    keyButton.id = key === "⌫" ? "Backspace" : key === "ENTER" ? "Enter" : key
    keyButton.className = key === " " ? "keySpacer" : "key"
    keyButton.textContent = key
    keyButton.addEventListener("click", () =>
      this.handleKeyButtonClick(keyButton.id)
    )
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

  handleKeyButtonClick(key) {
    console.log(key)
    if (!this.uiState.busy) {
      clickAudio.currentTime = 0
      clickAudio.play().catch((error) => {
        /*do nothing - it's just audio*/
      })
      if (game.gameState === "PLAYING") {
        if (key === "Backspace") {
          deleteLetter()
        } else if (key === "Enter") {
          checkRow()
        } else {
          appendLetter(key)
        }
      } else {
        if (key === "Enter") {
          resetGame()
        }
      }
    }
  }
}
