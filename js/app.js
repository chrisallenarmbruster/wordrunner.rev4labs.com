// import { Wordal } from "./wordal.js"
// import { WORDS } from "./words.js"

let game, uiState

function drawKey(key) {
  const keyButton = document.createElement("button")
  keyButton.id = key === "⌫" ? "Backspace" : key === "ENTER" ? "Enter" : key
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
  console.log("game state", game.gameState)
  if (game.gameState === "PLAYING") {
    if (key === "Backspace") {
      deleteLetter()
    } else if (key === "Enter") {
      checkRow()
      console.log(`checking row: ${key}`)
    } else {
      appendLetter(key)
    }
  } else {
    if (key === "Enter") {
      resetGame()
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

function deleteLetter() {
  if (uiState.curCol > 0) {
    uiState.curCol--
    const tile = document.getElementById(
      `tile-${uiState.curRow}-${uiState.curCol}`
    )
    tile.textContent = ""
    uiState.board[uiState.curRow][uiState.curCol] = ""
  }
}

const checkRow = () => {
  const guess = uiState.board[uiState.curRow].join("")
  if (game.gameState === "PLAYING" && uiState.curCol > 4) {
    if (!commonWords.includes(guess.toLowerCase())) {
      displayMessage(`\"${guess.toLowerCase()}\" is not a word`)
      console.log(guess, "not a word")
    } else {
      console.log(guess, "is a valid a word")
      console.log(game.submitGuess(guess))
      //valid submisssion
      revealGuess()
      updateKeyboard()
      if (game.secretWord === guess) {
        //guess is right
        displayMessage("You Win!")
        console.log("you win")
      } else {
        if (uiState.curRow >= 5) {
          displayMessage(
            `You Lose! Word was \"${game.secretWord.toLowerCase()}\"`,
            10000
          )
          console.log("you lost")
        } else {
          console.log("But it's not the secret word, try again")
          uiState.curRow++
          uiState.curCol = 0
        }
      }
    }
  }
}

function revealGuess() {
  let gArr = game.guessStatus()
  console.log(gArr, uiState.curRow)
  if (gArr[uiState.curRow]) {
    let word = gArr[uiState.curRow]
    console.log(word)
    for (let [idx, letter] of word.entries()) {
      let tile = document.getElementById(`tile-${uiState.curRow}-${idx}`)
      tile.classList.add(
        letter.status === "G"
          ? "tileHit"
          : letter.status === "Y"
          ? "tileClose"
          : "tileMiss"
      )
    }
  }
}

function updateKeyboard() {
  console.log("stat: ", game.letterStatus)
  for (let [letter, status] of Object.entries(game.letterStatus)) {
    // console.log(letter, status)
    console.log("letter:", letter, "status:", status)
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

function drawTile(container, row, col, value = "") {
  const tile = document.createElement("div")
  tile.id = `tile-${row}-${col}`
  tile.className = "tile"
  tile.textContent = value
  container.appendChild(tile)
  return tile
}

function drawTileGrid(container, rows = 6, cols = 5) {
  const tileGrid = document.createElement("div")
  tileGrid.className = "tileGrid"

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      drawTile(tileGrid, row, col, "")
    }
  }
  container.appendChild(tileGrid)
}

window.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault()
    document.getElementById("Enter").click()
  } else if (
    "ABCDEFGHIJKLMNOPQRSTUVWZYZ".split("").includes(event.key.toUpperCase())
  ) {
    event.preventDefault()
    document.getElementById(event.key.toUpperCase()).click()
  } else if (event.key === "Backspace" || event.key === "Delete") {
    event.preventDefault()
    document.getElementById("Backspace").click()
  }
})

function displayMessage(message, time = 3500) {
  header.className = "message"
  header.textContent = message
  setTimeout(() => {
    header.className = "header"
    header.textContent = "wordBrunner"
  }, time)
}

function resetGame() {
  game = new Wordal(commonWords[Math.floor(Math.random() * commonWords.length)])
  console.log(game.secretWord)
  uiState = {
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
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 5; col++) {
      tile = document.getElementById(`tile-${row}-${col}`)
      tile.textContent = ""
      tile.className = "tile"
    }
  }
  for (let letter of "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")) {
    let key = document.getElementById(letter)
    key.className = "key"
  }
  header.className = "header"
  header.textContent = "wordBrunner"
}

function main() {
  drawTileGrid(gameContainer)
  drawKeyboard(keyboardGrid)
  resetGame()
}

window.onload = function () {
  main()
}