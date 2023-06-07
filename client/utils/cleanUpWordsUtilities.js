const { WORDS } = require("./originalWords.js")
const { VETTED_WORDS } = require("./words.js")
const fs = require("fs")

function wordListDiff(originalList, newList) {
  const deletedWords = []
  const stream = fs.createWriteStream("undefinedWords.txt")
  stream.once("open", async function (fd) {
    for (const word of originalList) {
      if (!newList.includes(word.toUpperCase())) {
        deletedWords.push(word)
        stream.write(`"${word.toUpperCase()}",\n`)
      }
    }
    stream.end()
  })
  return deletedWords
}

async function vetList(candidates, delay) {
  let i = 0
  const stream = fs.createWriteStream("vettedWords.txt")
  stream.once("open", async function (fd) {
    for (const word of candidates) {
      // if (i === 3) break
      try {
        i++
        await new Promise((resolve, reject) => {
          setTimeout(resolve, delay)
        })
        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
        )
        if (response.ok) {
          console.log(`${i}: ${word} has a definition`)
          stream.write(`"${word.toUpperCase()}",\n`)
          // let json = await response.json()
          // definitionArr = this.unpackDefinition(json)
        } else {
          console.log(`${i}: ${word} is not a word.`)
        }
      } catch (error) {
        console.log(error)
      }
    }
    stream.end()
  })
}

const diff = wordListDiff(WORDS, VETTED_WORDS)

// vetList(diff, 2000)
