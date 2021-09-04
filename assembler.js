
// Copy to clipboard
function copy(data) {
    var proc = require('child_process').spawn('pbcopy'); 
    proc.stdin.write(data); proc.stdin.end();
}

// parseFloat with hex functionality
function parseFloat(str, radix) {
    var parts = str.split(".")
    if (parts.length > 1)
        return parseInt(parts[0], radix) + parseInt(parts[1], radix) / Math.pow(radix, parts[1].length)
    return parseInt(parts[0], radix)
}

let instructionMapping = {
    "hlt": 0x00,
    "act": 0x01,
    "set": 0x02,

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

let code = `
act 0xFE
set 0x01
act 0xFF
set 0x00

act 0xFF
out
add 0xFE

act 0xFD
set 0x08
jmp
`

// Tokenize everything and remove unwanted things
code = code.split(/[ \n]+/g).filter(e => e.length != 0)

// Converts instruction/number strings into numerals
code = code.map(e => {
    if (e in instructionMapping)
        return instructionMapping[e]
    if (e.indexOf('x') == -1)
        return parseFloat(e, 10)
    if (e.indexOf('x') != -1 && e[0] == '0' && e[1] == 'x')
        return parseFloat(e.slice(2), 16)
    return e
})

// FPO, eventually this should output a binary file, but for now this works.
code = code.map(e => {
    
})

