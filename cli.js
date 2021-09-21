
const { readFileSync } = require("fs")
const Console = require("./console.js")

const cns = new Console(0)

cns.setStory(readFileSync("story.txt", "utf-8"))
console.log(cns.step())
