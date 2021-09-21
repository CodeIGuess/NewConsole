
class Console {
    constructor(id) {
        if (id == undefined) {
            console.log("Please input a console ID.")
            id = -1
        }
        this.id = id   // Console ID
        this.vars = {} // Game variables
        this.on = 0    // On instruction number
        console.log("Initialized console", id)
    }

    setStory(storyData) {
        this.st = storyData.split("\n")
        this.on = 0
    }
    
    step() {
        let ret = null
        this.on++
        return ret
    }
}

module.exports = Console
