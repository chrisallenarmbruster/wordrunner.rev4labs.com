// import { Wordal } from "./wordal.js"
// import { WORDS } from "./words.js"

let game

const uiState = {
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
}

function drawKey(key) {
  const keyButton = document.createElement("button")
  keyButton.id = key === "⌫" ? "backspace" : key === "ENTER" ? "enter" : key
  keyButton.className = key === " " ? "keySpacer" : "key"
  keyButton.textContent = key
  keyButton.addEventListener("click", () => handleKeyButtonClick(keyButton.id))
  return keyButton
}

function drawKeyboardRow(container, row, keys) {
  const keyboardRow = document.createElement("div")
  keyboardRow.className = "keyboardRowContainer"

  const keyboardRowGrid = document.createElement("div")
  keyboardRowGrid.id = `keyboardRow${row}`
  keyboardRowGrid.className = `keyboardRow${row}`

  for (let key of keys) {
    const keyButton = drawKey(key)
    keyboardRowGrid.append(keyButton)
  }

  keyboardRow.append(keyboardRowGrid)
  container.append(keyboardRow)
}

function drawKeyboard(container) {
  const keys = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    [" ", "A", "S", "D", "F", "G", "H", "J", "K", "L", " "],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
  ]
  drawKeyboardRow(container, 1, keys[0])
  drawKeyboardRow(container, 2, keys[1])
  drawKeyboardRow(container, 3, keys[2])
}

function handleKeyButtonClick(key) {
  console.log(`"${key}" clicked!`)
  if (game.gameState === "PLAYING") {
    if (key === "backspace") {
      // deleteLetter()
      console.log(`deleting ${key}`)
    } else if (key === "enter") {
      // checkRow()
      console.log(`checking row: ${key}`)
    } else {
      appendLetter(key)
      console.log(`appending ${key}`)
    }
  }
}

function appendLetter(letter) {
  if (uiState.curCol < 5 && uiState.curRow < 6) {
    const tile = document.getElementById(
      `tile-${uiState.curRow}-${uiState.curCol}`
    )
    tile.textContent = letter
    uiState.board[uiState.curRow][uiState.curCol] = letter
    uiState.curCol++
  }
}

function drawTile(container, row, col, value = "") {
  const tile = document.createElement("div")
  tile.id = `tile-${row}-${col}`
  tile.className = "tile"
  tile.textContent = value
  container.appendChild(tile)
  return tile
}

function drawTileGrid(container, rows, cols) {
  const tileGrid = document.createElement("div")
  tileGrid.className = "tileGrid"

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      drawTile(tileGrid, row, col, "")
    }
  }
  container.appendChild(tileGrid)
}

function main() {
  game = new Wordal("guess")
  console.log(game.secretWord)
  drawTileGrid(gameContainer, 6, 5)
  drawKeyboard(keyboardGrid)
}

window.onload = function () {
  main()
}
