let debug = false

let instructionNames = [
    "hlt", "act", "set", "mov",
    "add", "sub", "mul", "div",
    "and", "orr", "not", "xor",
    "sin", "cos", "psh", "pop",
    "jmp", "jeq", "jne", "???",
    "sma", "out", "wnf", "???"
]

let ins = {
    //*HLT - Halts execution
    0x00: function(){},
    // ACT - Sets the active address
    0x01: function(){ aa = memory[++ip]; ip++ },
    // SET - Sets the value of the active address
    0x02: function(){ memory[aa] = memory[++ip]; ip++ },
    // MOV - Copies the value at the active address to another address.
    0x03: function(){ memory[memory[++ip]] = memory[aa]; ip++ },

    // ADD - Adds an address to the active address
    0x04: function(){ memory[aa] += memory[memory[++ip]]; ip++ },
    // SUB - Subtracts an address from the active address
    0x05: function(){ memory[aa] -= memory[memory[++ip]]; ip++ },
    // MUL - Multiplies the active address with an address
    0x06: function(){ memory[aa] *= memory[memory[++ip]]; ip++ },
    // DIV - Divides active address by an address
    0x07: function(){ memory[aa] /= memory[memory[++ip]]; ip++ },

    // AND - Bitwise AND
    0x08: "",
    // ORR - Bitwise OR
    0x09: "",
    // NOT - Bitwise NOT
    0x0A: "",
    // XOR - Bitwise XOR
    0x0B: "",

    //*SIN - Sets the active address to its sine
    0x0C: "",
    //*COS - Sets the active address to its cosine
    0x0D: "",
    //*PSH - Pushes the value at the active address to the stack
    0x0E: "",
    //*POP - Pops a value from the stack to the active address
    0x0F: "",

    //*JMP - Jumps to the memory address at the active address
    0x10: function(){ ip = memory[aa] },
    // JEQ - Jumps to the memory address at the active address if some memory address is not 0
    0x11: "",
    // JNE - Jumps to the memory address at the active address if some memory address is 0
    0x12: function(){ if (memory[memory[++ip]] == 0) { ip = memory[aa] } else { ip++ } },
    // ??? (Currently unused)
    0x13: "",

    //*SMA - Sets the active address to the value at the memory address of the active address (basically a pointer)
    0x14: function(){ aa = memory[aa]; ip++ },
    //*OUT - Outputs the active address for debugging
    0x15: function(){ process.stdout.write(String.fromCharCode(memory[aa])); ip++ },
    // WNF - Waits for the next frame
    0x16: ""
}

let memory = [
    0x01, 0x05, 0x02, 0x17, 0x10, 0x00, 0x00, 0x48, 0x65, 0x6C, 0x6C, 0x6F, 0x2C, 0x20, 0x57, 0x6F, 0x72, 0x6C, 0x64, 0x21, 0x00, 0x00, 0x01, 0x01, 0x15, 0x02, 0x07, 0x05, 0x16, 0x01, 0x15, 0x04, 0x16, 0x14, 0x03, 0x06, 0x01, 0x05, 0x02, 0x30, 0x12, 0x06, 0x01, 0x06, 0x15, 0x02, 0x1D, 0x10, 0x00, 0x00
]

// memory[0xFF + 0] = "h".charCodeAt(0)
// memory[0xFF + 1] = "e".charCodeAt(0)
// memory[0xFF + 2] = "l".charCodeAt(0)
// memory[0xFF + 3] = "l".charCodeAt(0)
// memory[0xFF + 4] = "o".charCodeAt(0)
// memory[0xFF + 5] = "!".charCodeAt(0)

let ip = 0, // Instruction pointer
    aa = 0  // Active address

function hexc(n) {
    if (n === undefined) return "__"
    let ret = n.toString(16)
    if (ret.length % 2 == 1) return "0" + ret
    return ret
}

function runCode() {
    while (memory[ip] != 0) {
    // for (let a = 0; a < 26; a++) {
        if (debug) {
            console.log(`\tip: 0x${hexc(ip)}:  ${instructionNames[memory[ip]]} (0x${hexc(memory[ip])}) 0x${hexc(memory[ip + 1])}     ${memory[aa]}`)
            if (memory[ip] == 0x00) break
        }
        ins[memory[ip]]()
        // ins[memory[ip]]()
        // ins[memory[ip]]()
        // ins[memory[ip]]()
    }
}

runCode()
console.log()
