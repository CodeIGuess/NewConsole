
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
hlt 0x00
act
set
add
sub 0xFF
mul
div
and
orr
not
xor
sin
cos
psh
pop
jmp
jeq
jne
sma
out
wnf
`

code = code.split(/[ \n]+/g).filter(e => e.length != 0)

code = code.map(e => {
    if (e in instructionMapping)
        return instructionMapping[e]
    if (e.indexOf('x') == -1)
        return parseFloat(e)
    if (e.indexOf('x') != -1 && e[0] == '0' && e[1] == 'x')
        return parseFloat(e)
    return e
})

console.log(code)
