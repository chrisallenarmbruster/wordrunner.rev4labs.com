"use strict"

import { Campaign } from "./campaign.js"
import { Round } from "./round.js"
import { UI } from "./ui.js"
import { WORDS } from "./words.js"
import { JSConfetti } from "./js-confetti.js"

let game, ui, campaign
const jsConfetti = new JSConfetti()

async function checkRow() {
  const guess = ui.board[ui.curRow].join("")
  ui.clickAudio.pause()
  if (!WORDS.includes(guess.toLowerCase())) {
    ui.invalidAudio.play().catch((error) => {
      /*do nothing - it's just audio*/
    })
    ui.displayMessage(`${guess} is not a word`)
    return
  }
  game.submitGuess(guess)
  await ui.revealGuess(game.guessStatus())
  ui.updateKeyboard(game.letterStatus)
  if (game.secretWord === guess) {
    winRoutine()
    return
  }
  if (ui.curRow >= 5) {
    loseRoutine()
    return
  }

  ui.curRow++
  ui.curCol = 0
}

function winRoutine() {
  ui.curRow++
  let gameDetails = {
    outcome: "won",
    attempts: ui.curRow,
    word: game.secretWord,
    score: game.wordBasePointValue() * 10 ** (6 - ui.curRow),
  }
  ui.busy = true
  ui.successAudio.play().catch((error) => {
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
    ui.showModal(
      "Success",
      [
        campaign.createCampaignSummary(gameDetails),
        "<i>What it means:</>",
        ...game.wordDefinition,
      ],
      game.gameState
    )
    ui.busy = false
  }, 1500)
}

function loseRoutine() {
  ui.curRow++
  let gameDetails = {
    outcome: "lost",
    attempts: ui.curRow,
    word: game.secretWord,
    score:
      campaign.averageScore() > 0
        ? -1 * campaign.averageScore()
        : campaign.averageScore(),
  }
  campaign.updateCampaign(gameDetails)
  ui.failAudio.play().catch((error) => {
    /*do nothing - it's just audio*/
  })
  ui.showModal(
    "Failure",
    [
      campaign.createCampaignSummary(gameDetails),
      "<i>What it means:</>",
      ...game.wordDefinition,
    ],
    game.gameState
  )
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
    ],
    game.gameState
  )
}

window.addEventListener("keydown", function (event) {
  if (ui.busy) return
  if (event.key === "Enter" && modalContainer.style.display !== "none") {
    closeButton.click()
    return
  }

  document.getElementById(event.key.toUpperCase()) &&
    document.getElementById(event.key.toUpperCase()).click()

  if (event.key === "Delete") document.getElementById("BACKSPACE").click()
})

pageContainer.addEventListener("click", (event) => {
  if (!(event.target.nodeName === "BUTTON")) return
  if (ui.busy) return

  ui.clickAudio.currentTime = 0
  ui.clickAudio.play().catch((error) => {
    /*do nothing - it's just audio*/
  })

  let key = event.target.id
  if (game.gameState === "PLAYING") {
    if (key === "BACKSPACE") ui.deleteLetter()
    if (key === "ENTER" && ui.curCol > 4) checkRow()
    if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").includes(key))
      ui.appendLetter(key)
    return
  }

  if (game.gameState !== "PLAYING" && key === "ENTER") newRound()
})

function newRound() {
  game = new Round(WORDS[Math.floor(Math.random() * WORDS.length)])
  console.log(game.secretWord)
  ui.reset()
}

function main() {
  // localStorage.clear()
  campaign = new Campaign()
  ui = new UI(pageContainer)
  newRound()
  instructions()
}

window.onload = function () {
  main()
}
