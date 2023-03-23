// import { Wordal } from "./wordal.js"
// import { WORDS } from "./words.js"

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
}
window.onload = function () {
  main()
}
