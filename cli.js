
const { readFileSync } = require("fs")
const Console = require("./console.js")

const cns = new Console(0)

cns.setStory(readFileSync("story.txt", "utf-8"))

setInterval(function(){
    if (cns.wait > 0) cns.wait -= 1
}, 500)

function toAction() {
    cns.toAction()
    if (cns.out != "") {
        console.log(cns.out)
        cns.out = ""
    }
    if (cns.choices.length > 0) {
        console.log(cns.choices)
    }
}

setInterval(function(){
    if (cns.wait == 0 && !cns.waitingForChoice) toAction()
}, 100)
