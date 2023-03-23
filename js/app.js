// import { Wordal } from "./wordal.js"
// import { WORDS } from "./words.js"
const keys = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  [" ", "A", "S", "D", "F", "G", "H", "J", "K", "L", " "],
  ["ENT", "Z", "X", "C", "V", "B", "N", "M", "«"],
]

function drawKeyboardRow(container, row, keys) {
  const keyboardRow = document.createElement("div")
  keyboardRow.className = "keyboardRowContainer"

  const keyboardRowGrid = document.createElement("div")
  keyboardRowGrid.id = `keyboardRow${row}`
  keyboardRowGrid.className = `keyboardRow${row}`

  for (let key of keys) {
    const keyButton = document.createElement("button")
    keyButton.id = key
    keyButton.className = key === " " ? "keySpacer" : "key"
    keyButton.textContent = key
    keyButton.addEventListener("click", () => handleKeyButtonClick(key))
    keyboardRowGrid.append(keyButton)
  }
  keyboardRow.append(keyboardRowGrid)
  container.append(keyboardRow)
}

function handleKeyButtonClick(key) {
  console.log(`"${key}" clicked!`)
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
      drawTile(tileGrid, row, col, "M")
    }
  }
  container.appendChild(tileGrid)
}

function main() {
  drawTileGrid(gameContainer, 6, 5)
  console.log("finished with tiles")
  drawKeyboardRow(keyboardGrid, 1, keys[0])
  drawKeyboardRow(keyboardGrid, 2, keys[1])
  drawKeyboardRow(keyboardGrid, 3, keys[2])
  console.log("finished with keyboard")
}
window.onload = function () {
  main()
}
