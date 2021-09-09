
let showLogs = true

const { execSync } = require("child_process")
const { prototype } = require("events")
const { readFileSync, writeFileSync } = require('fs')

let keepDirectives = [
    ".ascii",
    ".word"
]

// parseFloat with hex functionality
function parseFloat(str, radix) {
    var parts = str.split(".")
    if (parts.length > 1)
        return parseInt(parts[0], radix) + parseInt(parts[1], radix) / Math.pow(radix, parts[1].length)
    return parseInt(parts[0], radix)
}

// Parses a number (checking if it's decimal, binary, or hexadecimal)
function parseNum(num) {
    if (num.indexOf('x') == -1)
        return parseFloat(num, 10)
    if (num.indexOf('b') != -1 && num[0] == '0' && num[1] == 'b')
        return parseFloat(num.slice(2), 2)
    if (num.indexOf('x') != -1 && num[0] == '0' && num[1] == 'x')
        return parseFloat(num.slice(2), 16)
    return num
}

// Compiles C to ARM
// Strips all the unecessary things. I have no idea what these mean.
function compile() {
    execSync("arm-none-eabi-gcc -S games/game.c -o games/game.s") // -Os
    let data = readFileSync('games/game.s', 'utf8')
    let original = data + ''
    data = data
        // Remove comments
        .split("\n")
        .filter(e => e.length > 0 && e.trim()[0] != '@')
        .join("\n")

        // Remove unused tags
        .split(/\n(?!\t)/g)
        .filter(e => e[0] != '\t')
        .filter(e => {
            let lab = e.split("\n")[0].slice(0, -1)
            if (lab == "main") return true
            return (original.match(new RegExp(lab.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length > 1
        })
        .map(e => {
            e = e.split("\n")
            let lab = e.splice(0, 1)[0].trim()
            e = e.map(g => g = g.trim().split('\t'))
            e = e.filter(g => keepDirectives.includes(g[0]) || g[0][0] != '.')
            return lab + "\n\t" + e.map(g => g.join("\t")).join("\n\t")
        })
        // .join("\n@ ------------------------------------------\n")
        .join("\n\n")
    writeFileSync("games/game.s", data, "utf-8")
    return data
}

// Converts ARM assembly to Console assembly
function assembleARM(prg) {
    prg = prg.replace(/\t/g, " ").replace(/\n\n/g, "\n").split(/\n/g)
    let ins = prg
        .map(e => e.trim()
            .split(/(( |)(?=[!@#$%^&*(){}\-={}\[\]\\\|:;<>?,\/])( |)|( |)(?<=[!@#$%^&*(){}\-={}\[\]\\\|:;<>?,\/])( |)| )/g)
            .filter(e => e && e != " "))
    let out = []
    for (let e = 0; e < ins.length; e++) {
        if (ins[e][ins[e].length - 1] == ":") {
            ins[e] = [ ins[e].join("") ]
            out.push(ins[e][0])
        } else if (ins[e][0][0] == ".") {
            if (ins[e][0] == ".ascii") {
                out.push("@st " + prg[e].split(" ").slice(2).join(" "))
            } else if (ins[e][0] == ".word") {
                out.push("@nm " + ins[e].slice(1))
            }
        }
    }
    console.log(out)
}

let source = `
act .any
set .main
jmp

:any
    @nm 0x00
:check
    @nm 0x00
:string
    @st "Hello, World!"
:pointer
    @nm 0x00
:one
    @nm 0x01

:main
    act .pointer
    set .string
    sub .one

:loop
    act .pointer
    add .one
    sma
    mov .check
    act .any
    set .end
    jne .check
    act .check
    out
    set .loop
    jmp

:end
    hlt
`

// Converts Console assembly to bytes
function assembleConsole(prg) {
    // Tokenize everything and remove unwanted things
    prg = prg.split(/[ \n]+/g).filter(e => e.length != 0)
    for (let a = 0; a < prg.length; a++) {
        if (prg[a][0] == '"') {
            while (prg[a][prg[a].length - 1] != '"' || (prg[a][prg[a].length - 1] == '"' && prg[a].length > 1 && prg[a][prg[a].length - 2] == '\\')) {
                prg[a] += " " + prg.splice(a + 1, 1)
            }
            prg[a] = prg[a]
        }
    }

    for (let a = 0; a < prg.length; a++) {
        if (prg[a][0] == '@') {
            if (prg[a] == "@nm") {
                prg[a] = prg.splice(a + 1, 1)[0]
            } else if (prg[a] == "@st") {
                prg.splice(a, 1)
                let str = prg.splice(a, 1)[0].slice(1, -1)
                // prg.splice(a, 0, "0xFF")
                for (let s = 0; s < str.length; s++) {
                    prg.splice(a + s, 0, str.charCodeAt(s) + '')
                }
                a += str.length
                prg.splice(a, 0, '0')
            }
        }
    }

    // Parses labels and variables
    let code = [] // Mid-level code
    let labs = {} // Labels
    for (let a = 0; a < prg.length; a++) {
        if (prg[a][0] == ':') {
            labs[prg[a].slice(1)] = code.length
        } else {
            code.push(prg[a])
        }
    }
    code.push('0')

    // Converts instruction/number strings into numerals
    let instructionMapping = {
        "hlt": 0x00, "act": 0x01,
        "set": 0x02, "mov": 0x03,
        "add": 0x04, "sub": 0x05,
        "mul": 0x06, "div": 0x07,
        "and": 0x08, "orr": 0x09,
        "not": 0x0A, "xor": 0x0B,
        "sin": 0x0C, "cos": 0x0D,
        "psh": 0x0E, "pop": 0x0F,
        "jmp": 0x10,  "jeq": 0x11,
        "jne": 0x12,
        "sma": 0x14, "out": 0x15,
        "wnf": 0x16
    }
    code = code.map(e => {
        if (e in instructionMapping)
            return instructionMapping[e]
        if (e[0] == '.') // Parses references to labels
            return labs[e.slice(1)]
        if (e[0] == '$') // Parses references to variables
            return vars[e.slice(1)][1]
        return parseNum(e)
    })

    // Returns the code as a list of numbers
    return code
}

// console.log(assembleConsole(source).map(e => {
//     let r = e.toString(16).toUpperCase()
//     if (r.length % 2 == 1) r = "0" + r
//     return (r.length % 2 == 1 ? "0x0" : "0x") + r
// }).join(", "))

assembleARM(compile())
// console.log(assembleConsole(source))
