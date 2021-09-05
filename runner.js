
let ins = {
    //*HLT - Halts execution
    0x00: function(){},
    // ACT - Sets the active address
    0x01: function(){ aa = memory[++ip]; ip++ },
    // SET - Sets the value of the active address
    0x02: function(){ memory[aa] = memory[++ip]; ip++ },
    // ??? (Currently unused)
    0x03: "",

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
    0x12: "",
    // ??? (Currently unused)
    0x13: "",

    //*SMA - Sets the active address to the value at the memory address of the active address (basically a pointer)
    0x14: function(){ aa = memory[aa] },
    //*OUT - Outputs the active address for debugging
    0x15: function(){ console.log(memory[aa]); ip++ },
    // WNF - Waits for the next frame
    0x16: ""
}

let memory = [0x01, 0xFE, 0x02, 0x01, 0x01, 0xFF, 0x02, 0x00, 0x01, 0xFF, 0x15, 0x04, 0xFE, 0x01, 0xFD, 0x02, 0x08, 0x10]

memory[0xFF + 0] = "h".charCodeAt(0)
memory[0xFF + 1] = "e".charCodeAt(0)
memory[0xFF + 2] = "l".charCodeAt(0)
memory[0xFF + 3] = "l".charCodeAt(0)
memory[0xFF + 4] = "o".charCodeAt(0)
memory[0xFF + 5] = "!".charCodeAt(0)

let ip = 0, // Instruction pointer
    aa = 0  // Active address

function runCode() {
    while (memory[ip] != 0) {
        // console.log("Address:", ip, memory[ip])
        ins[memory[ip]]()
        // ins[memory[ip]]()
        // ins[memory[ip]]()
        // ins[memory[ip]]()
    }
}

runCode()
