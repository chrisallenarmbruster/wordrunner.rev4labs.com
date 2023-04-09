"use strict"

import { Campaign } from "./campaign.js"
import { Round } from "./round.js"
import { WORDS } from "./words.js"
import { JSConfetti } from "./js-confetti.js"
// import { UI } from "./ui.js"

let game, uiState, ui
const campaign = new Campaign()
const jsConfetti = new JSConfetti()

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
  const keyboardGrid = document.createElement("div")
  keyboardGrid.className = "keyboardGrid"
  keyboardGrid.id = "keyboardGrid"

  container.append(keyboardGrid)

  drawKeyboardRow(keyboardGrid, 1, keys[0])
  drawKeyboardRow(keyboardGrid, 2, keys[1])
  drawKeyboardRow(keyboardGrid, 3, keys[2])
}

function handleKeyButtonClick(key) {
  if (!uiState.busy) {
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
    tile.innerHTML = '<span class="tileWaterMark">B</span>'
    uiState.board[uiState.curRow][uiState.curCol] = ""
  }
}

async function checkRow() {
  const guess = uiState.board[uiState.curRow].join("")
  if (game.gameState === "PLAYING" && uiState.curCol > 4) {
    clickAudio.pause()
    if (!WORDS.includes(guess.toLowerCase())) {
      invalidAudio.play().catch((error) => {
        /*do nothing - it's just audio*/
      })
      displayMessage(`${guess} is not a word`)
    } else {
      game.submitGuess(guess)
      await revealGuess()
      updateKeyboard()
      if (game.secretWord === guess) {
        uiState.curRow++
        let gameDetails = {
          outcome: "won",
          attempts: uiState.curRow,
          word: game.secretWord,
          score: game.wordBasePointValue() * 10 ** (6 - uiState.curRow),
        }
        uiState.busy = true
        successAudio.play().catch((error) => {
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
          showModal("Success", [
            campaign.createCampaignSummary(gameDetails),
            "<i>What it means:</>",
            ...game.wordDefinition,
          ])
          uiState.busy = false
        }, 1500)
      } else {
        if (uiState.curRow >= 5) {
          console.log(campaign.averageScore())
          uiState.curRow++
          let gameDetails = {
            outcome: "lost",
            attempts: uiState.curRow,
            word: game.secretWord,
            score:
              campaign.averageScore() > 0
                ? -1 * campaign.averageScore()
                : campaign.averageScore(),
          }
          campaign.updateCampaign(gameDetails)
          failAudio.play().catch((error) => {
            /*do nothing - it's just audio*/
          })
          showModal("Failure", [
            campaign.createCampaignSummary(gameDetails),
            "<i>What it means:</>",
            ...game.wordDefinition,
          ])
        } else {
          uiState.curRow++
          uiState.curCol = 0
        }
      }
    }
  }
}

async function revealGuess() {
  return new Promise(async function (resolve, reject) {
    uiState.busy = true
    let gArr = game.guessStatus()
    compAudio.play().catch((error) => {
      /*do nothing - it's just audio*/
    })
    if (gArr[uiState.curRow]) {
      let word = gArr[uiState.curRow]
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      let interval = setInterval(() => {
        for (let col = 0; col < 5; col++) {
          let tile = document.getElementById(`tile-${uiState.curRow}-${col}`)
          tile.textContent = letters[Math.floor(Math.random() * 26)]
        }
      }, 30)
      await colorTiles(word, interval)
      uiState.busy = false
      resolve()
    }
  })
}

function colorTiles(word, interval) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, 1000)
  }).then(function () {
    clearInterval(interval)
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
  for (let [letter, status] of Object.entries(game.letterStatus)) {
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
  // return tile
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
  if (!uiState.busy) {
    if (event.key === "Enter") {
      if (modalContainer.style.display != "none") {
        closeButton.click()
      } else {
        document.getElementById("Enter").click()
      }
    } else if (
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").includes(event.key.toUpperCase())
    ) {
      document.getElementById(event.key.toUpperCase()).click()
    } else if (event.key === "Backspace" || event.key === "Delete") {
      document.getElementById("Backspace").click()
    }
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

function addAudio(id, url, container) {
  window[id] = new Audio(url)
}

function setUpAudio() {
  addAudio("clickAudio", "./audio/click.mp3", pageContainer)
  addAudio("compAudio", "./audio/comp.mp3", pageContainer)
  addAudio("successAudio", "./audio/fight.mp3", pageContainer)
  addAudio("failAudio", "./audio/regret.mp3", pageContainer)
  addAudio("invalidAudio", "./audio/invalid.mp3", pageContainer)
  addAudio("ratchetAudio", "./audio/ratchet.mp3", pageContainer)
}

function showModal(title = "Title", content = ["lorem ipsum"]) {
  let modalContent = document.createElement("div")
  modalContent.id = "modalContent"
  modalContent.className = "modalContent"

  let closeButton = document.createElement("span")
  closeButton.id = "closeButton"
  closeButton.className = "close"
  closeButton.textContent = `x`
  closeButton.addEventListener("click", () => {
    modalContainer.style.display = "none"
    successAudio.pause()
    successAudio.currentTime = 0
    failAudio.pause()
    failAudio.currentTime = 0
    if (game.gameState !== "PLAYING") {
      Enter.classList.add("gameOver")
      Enter.textContent = "RESET"
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

function iterateTiles(callback) {
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 5; col++) {
      callback(document.getElementById(`tile-${row}-${col}`))
    }
  }
}

function flipAndResetTiles() {
  clickAudio.pause()
  ratchetAudio.play().catch((error) => {
    /*do nothing - it's just audio*/
  })

  setTimeout(() => {
    iterateTiles((tile) => {
      tile.classList.remove("tileHit", "tileClose", "tileMiss")
      tile.innerHTML = '<span class="tileWaterMark">B</span>'
    })
  }, 500)

  setTimeout(() => {
    iterateTiles((tile) => {
      tile.classList.remove("reset")
    })
  }, 1000)

  iterateTiles((tile) => {
    tile.classList.add("reset")
  })
}

function resetKeyboard() {
  for (let letter of "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")) {
    let key = document.getElementById(letter)
    key.className = "key"
  }
}

function resetGame() {
  game = new Round(WORDS[Math.floor(Math.random() * WORDS.length)])
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
    busy: false,
  }
  Enter.classList.remove("gameOver")
  Enter.textContent = "ENTER"

  flipAndResetTiles()
  resetKeyboard()

  header.className = "header"
  header.textContent = "wordBrunner"
}

function main() {
  // localStorage.clear()
  campaign.restoreFromLocalStorage()
  setUpAudio()
  // ui = new UI(pageContainer)
  drawTileGrid(gameContainer)
  drawKeyboard(keyboardContainer)
  resetGame()
  showModal("Mission Briefing", [
    "Decrypt the code.",
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
