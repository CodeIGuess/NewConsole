
// parseFloat with hex functionality
function parseFloat(str, radix) {
    var parts = str.split(".")
    if (parts.length > 1)
        return parseInt(parts[0], radix) + parseInt(parts[1], radix) / Math.pow(radix, parts[1].length)
    return parseInt(parts[0], radix)
}

function parseNum(num) {
    if (num.indexOf('x') == -1)
        return parseFloat(num, 10)
    if (num.indexOf('x') != -1 && num[0] == '0' && num[1] == 'x')
        return parseFloat(num.slice(2), 16)
    return num
}

let instructionMapping = {
    "hlt": 0x00,
    "act": 0x01,
    "set": 0x02,
    "mov": 0x03,
    "add": 0x04,
    "sub": 0x05,
    "mul": 0x06,
    "div": 0x07,
    "and": 0x08,
    "orr": 0x09,
    "not": 0x0A,
    "xor": 0x0B,
    "sin": 0x0C,
    "cos": 0x0D,
    "psh": 0x0E,
    "pop": 0x0F,
    "jmp": 0x10, 
    "jeq": 0x11,
    "jne": 0x12,

    "sma": 0x14,
    "out": 0x15,
    "wnf": 0x16
}

let source = `
@any 0x00
@check 0xAB
@string "hey there, \\"mate\\" :)"
@pointer 0x00
@one 0x01

:start
    act $pointer
    set $string
    sub $one

:loop
    act $pointer
    add $one
    sma
    mov $check
    act $any
    set .end
    jne $check
    act $check
    out
    set .loop
    jmp

:end
    hlt
`

// Tokenize everything and remove unwanted things
source = source.split(/[ \n]+/g).filter(e => e.length != 0)
for (let a = 0; a < source.length; a++) {
    if (source[a][0] == '"') {
        while (source[a][source[a].length - 1] != '"' || (source[a][source[a].length - 1] == '"' && source[a].length > 1 && source[a][source[a].length - 2] == '\\')) {
            source[a] += " " + source.splice(a + 1, 1)
        }
        source[a] = source[a]
    }
}

// 
let code = []
let labs = {}
let vars = {}
for (let a = 0; a < source.length; a++) {
    if (source[a][0] == ':') {
        labs[source[a].slice(1)] = code.length
    } else if (source[a][0] == '@') {
        vars[source[a].slice(1)] = [source[++a], -1]
    } else {
        code.push(source[a])
    }
}
let vidx = code.length
for (let a in vars) {
    vars[a][1] = vidx
    if (vars[a][0][0] == '"') {
        let s = vars[a][0].slice(1,-1)
        for (let b = 0; b < s.length; b++) {
            code[vidx++] = s.charCodeAt(b) + ""
        }
        code[vidx++] = "0"
    } else {
        code[vidx++] = vars[a][0]
    }
}

// Converts instruction/number strings into numerals
code = code.map(e => {
    if (e in instructionMapping)
        return instructionMapping[e]
    if (e[0] == '.')
        return labs[e.slice(1)]
    if (e[0] == '$')
        return vars[e.slice(1)][1]
        // return 0xDD
    return parseNum(e)
})

// FPO, eventually this should output a binary file, but for now this works.
code = code.map(e => {
    let r = e.toString(16).toUpperCase()
    if (r.length % 2 == 1) r = "0" + r
    return (r.length % 2 == 1 ? "0x0" : "0x") + r
}).join(", ")
console.log(code)
