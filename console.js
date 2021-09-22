
class Console {
    constructor(id) {
        if (id == undefined) {
            console.log("Please input a console ID.")
            id = -1
        }
        this.id = id   // Console ID
        this.vars = {} // Game variables
        this.on = 0    // On instruction number
        this.indWidth = 4
        this.choices = []
        this.ready = false
        this.out = ""
        console.log("Initialized console", id)
    }

    setStory(storyData) {
        this.st = storyData.split("\n")
            .filter(e => e.trim().length > 0) // Filter empty lines
            .map(e => e.trim()[0] == ':' ? e.trim() : e) // If it's a label, trim spaces
        this.on = 0
    }
    
    step() {
        let ind = this.st[this.on].search(/\S/)
        let at = this.st[this.on].trim()
        let ret = false
        switch (at[0]) {
            case '!':
                ret = true
                this.out = at.slice(1).trim()
                break
            case ':':
                break
            case '$':
                this.vars[at.slice(1).split(" ")[0]] = parseFloat(at.split(" ")[1])
                break
            case '~':
                switch (at[1]) {
                    case 'c':
                        ret = true
                        this.choices = []
                        for (let t = this.on + 1; this.st[t].search(/\S/) > ind; t++)
                            if (this.st[t].search(/\S/) == ind + this.indWidth)
                                this.choices.push([this.st[t].trim().slice(1).trim(), t])
                        break
                    case '+':
                        this.vars[at.split(" ")[1]] += parseFloat(at.split(" ")[2])
                        break
                    case '-':
                        this.vars[at.split(" ")[1]] -= parseFloat(at.split(" ")[2])
                        break
                }
                break
        }
        this.on++
        // console.log(":", at, this.vars)
        return ret
    }

    toAction() {
        while (!this.step()) {}
    }
}

module.exports = Console
