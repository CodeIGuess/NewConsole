
const { readFileSync } = require("fs")
const Console = require("./console.js")

const cns = new Console(0)

cns.setStory(readFileSync("story.txt", "utf-8"))

function toAction() {
    cns.toAction()
    
}
cns.toAction()
console.log(cns.choices, cns.out)
