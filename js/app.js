// import { Wordal } from "./wordal.js"
// import { WORDS } from "./words.js"

let game, uiState
const jsConfetti = new JSConfetti()

let campaign = {
  gamesPlayed: 0,
  gamesWon: 0,
  winPercentage: 0,
  averageAttempts: 0,
  sluggingPercentage: 0,
  highScore: 0,
  curStreak: 0,
  bestStreak: 0,
  gameDetails: [],
}

function calculateScore() {
  let letterValues = {
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

  let wordScore = game.secretWord
    .toLowerCase()
    .split("")
    .reduce((acc, cv) => {
      return acc + letterValues[cv]
    }, 0)
  console.log(wordScore)

  switch (uiState.curRow) {
    case 6:
      return wordScore * 1
    case 5:
      return wordScore * 10
    case 4:
      return wordScore * 100
    case 3:
      return wordScore * 1000
    case 2:
      return wordScore * 10000
    case 1:
      return wordScore * 100000
    default:
      return 0
  }
}

function updateCampaign(gameDetails) {
  campaign.gamesPlayed++
  if (gameDetails.outcome === "won") {
    campaign.gamesWon++
    campaign.curStreak++
  } else {
    campaign.curStreak = 0
  }
  if (campaign.curStreak > campaign.bestStreak) {
    campaign.bestStreak = campaign.curStreak
  }
  campaign.gameDetails.push(gameDetails)
  campaign.averageAttempts =
    campaign.gameDetails
      .filter((el) => el.outcome === "won")
      .reduce((acc, cv) => {
        return acc + cv.attempts
      }, 0) /
    (campaign.gameDetails.filter((el) => el.outcome === "won").length > 0
      ? campaign.gameDetails.filter((el) => el.outcome === "won").length
      : 1
    ).toFixed(1)

  campaign.winPercentage = Math.round(
    (100 * campaign.gamesWon) / campaign.gamesPlayed
  )

  campaign.sluggingPercentage = Math.round(
    (100 *
      campaign.gameDetails
        .filter((el) => el.outcome === "won")
        .reduce((acc, cv) => {
          if (cv.attempts === 1) return acc + 6
          if (cv.attempts === 2) return acc + 5
          if (cv.attempts === 3) return acc + 4
          if (cv.attempts === 4) return acc + 3
          if (cv.attempts === 5) return acc + 2
          if (cv.attempts === 6) return acc + 1
        }, 0)) /
      campaign.gamesPlayed
  )

  if (gameDetails.score > campaign.highScore) {
    campaign.highScore = gameDetails.score
  }

  localStorage.setItem("campaign", JSON.stringify(campaign))
  console.log(JSON.parse(localStorage.getItem("campaign")))
}

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

async function checkRow() {
  const guess = uiState.board[uiState.curRow].join("")
  if (game.gameState === "PLAYING" && uiState.curCol > 4) {
    if (!commonWords.includes(guess.toLowerCase())) {
      displayMessage(`${guess} is not a word`)
    } else {
      game.submitGuess(guess)
      await revealGuess()
      console.log("returned from revealGuess()")
      updateKeyboard()
      if (game.secretWord === guess) {
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
        setTimeout(() => {
          Enter.classList.add("gameOver")
          Enter.textContent = "RESET"
        }, 3000)
        uiState.curRow++
        updateCampaign({
          outcome: "won",
          attempts: uiState.curRow,
          word: game.secretWord,
          score: calculateScore(),
        })
        setTimeout(() => {
          showModal("Success", [
            `Code ${game.secretWord} successfully decrypted in ${
              uiState.curRow
            } attempt${uiState.curRow > 1 ? "s." : "."}`,
            "Please proceed to next assignment.",
          ])
        }, 1500)
      } else {
        if (uiState.curRow >= 5) {
          uiState.curRow++
          updateCampaign({
            outcome: "lost",
            attempts: uiState.curRow,
            word: game.secretWord,
            score: calculateScore(),
          })
          setTimeout(() => {
            Enter.classList.add("gameOver")
            Enter.textContent = "RESET"
          }, 1500)
          console.log("you lost")
          showModal("Failure", [
            "After 6 incorrect attempts you've been locked out.",
            "Please proceed to another assignment.",
            "============",
            `Mission Notes:`,
            `Code ${game.secretWord} successfully decrypted by competing intelligence.`,
          ])
        } else {
          console.log("But it's not the secret word, try again")
          uiState.curRow++
          uiState.curCol = 0
        }
      }
    }
  }
}

async function revealGuess() {
  return new Promise(async function (resolve, reject) {
    let gArr = game.guessStatus()
    console.log(
      "revealGuess() started, guessStatus():",
      gArr,
      "curRow:",
      uiState.curRow
    )
    if (gArr[uiState.curRow]) {
      let word = gArr[uiState.curRow]
      // console.log(word)
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      let interval = setInterval(() => {
        for (let col = 0; col < 5; col++) {
          let tile = document.getElementById(`tile-${uiState.curRow}-${col}`)
          tile.textContent = letters[Math.floor(Math.random() * 26)]
        }
      }, 30)
      // setTimeout(() => colorTiles(word, interval), 10)
      await colorTiles(word, interval)
      resolve()
    }
  })
}

function colorTiles(word, interval) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, 1000)
  }).then(function () {
    clearInterval(interval)
    // updateKeyboard()
    for (let [idx, letter] of word.entries()) {
      let tile = document.getElementById(`tile-${uiState.curRow}-${idx}`)
      tile.textContent = word[idx]["letter"]
      tile.classList.add(
        letter.status === "G"
          ? "tileHit"
          : letter.status === "Y"
          ? "tileClose"
          : "tileMiss"
      )
    }
  })
}

function updateKeyboard() {
  // console.log("stat: ", game.letterStatus)
  for (let [letter, status] of Object.entries(game.letterStatus)) {
    // console.log(letter, status)
    // console.log("letter:", letter, "status:", status)
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
    modalContainer.style.display = "none"
    document.getElementById("Enter").click()
  } else if (
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").includes(event.key.toUpperCase())
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

function showModal(title = "Title", content = ["lorem ipsum"]) {
  let modalContent = document.createElement("div")
  modalContent.id = "modalContent"
  modalContent.className = "modalContent"

  let closeButton = document.createElement("span")
  closeButton.className = "close"
  closeButton.textContent = `x`
  closeButton.addEventListener("click", () => {
    modalContainer.style.display = "none"
  })
  modalContent.appendChild(closeButton)

  let modalTitle = document.createElement("h4")
  modalTitle.className = "modalTitle"
  modalTitle.textContent = title
  modalContent.appendChild(modalTitle)

  for (let item of content) {
    let modalContentItem = document.createElement("p")
    modalContentItem.className = "modalContentItem"
    modalContentItem.textContent = item
    modalContent.appendChild(modalContentItem)
  }

  modalContainer.replaceChildren()
  modalContainer.appendChild(modalContent)
  modalContainer.style.display = "block"
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
  Enter.classList.remove("gameOver")
  Enter.textContent = "ENTER"

  setTimeout(() => {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        tile = document.getElementById(`tile-${row}-${col}`)
        tile.textContent = ""
        tile.innerHTML = '<span class="tileWaterMark">B</span>'
        tile.className = "tile reset"
      }
    }
  }, 500)

  setTimeout(() => {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        tile = document.getElementById(`tile-${row}-${col}`)
        tile.classList.remove("reset")
      }
    }
  }, 1000)

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 5; col++) {
      tile = document.getElementById(`tile-${row}-${col}`)
      tile.classList.add("reset")
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
  // localStorage.clear()
  if (localStorage.getItem("campaign")) {
    campaign = JSON.parse(localStorage.getItem("campaign"))
  }
  drawTileGrid(gameContainer)
  drawKeyboard(keyboardGrid)
  resetGame()
  showModal("Mission Briefing", [
    "It is 2049 and you are replicant KD6-3.7 hired as a word runner to hunt rogue replicants. You must crack codes to do this.",
    "Each code is a 5 letter word.",
    "Blue indicates right letter in right position.",
    "Orange indicates right letter in wrong position.",
    "You have 6 attempts before lockout.",
    "Good Luck!",
  ])
}

window.onload = function () {
  main()
}
