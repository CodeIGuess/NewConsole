
// The screen
let screen = document.getElementsByTagName("svg")[0]

// This IP
let ip = "-1"

// Create WebSocket connection.
const socket = new WebSocket(`ws://${window.location.host}:5077`)

// Connection opened
socket.addEventListener('open', function (event) {
    setInterval(function(){
        socket.send(ip + ":")
    }, 3500)
})

// Listen for messages
socket.addEventListener('message', function (event) {
    message = event.data.toString().split(":")
    let typ = message[0] // Type
    let cnt = message.slice(1).join(":") // Content
    switch (typ) {
        case "IP": {
            ip = cnt
            onServerReady()
        } break
        case "GK": {
            let fullTag = cnt.split(',')
            fullTag = "<" + fullTag[0] + " " + fullTag.slice(1).map(e => `${e.split(":")[0]}="${e.split(":")[1]}"`).join(" ") + "/>"
            screen.innerHTML += fullTag
        } break
        case "GP": {
            // let fullTag = cnt.split(',').map(e => e.split(':'))
            // let tag = screen.children[fullTag[0]]
            // for (let a = 1; a < fullTag.length; a++) {
            //     tag.setAttribute(fullTag[a][0], fullTag[a][1])
            // }
        } break
        default: {
            console.log(`Didn't understand packet: "${event.data}"`)
        } break
    }
})

// Main loop ~45
setInterval(function(){

}, 22)

// Runs when the server is ready to recieve data
function onServerReady() {
    socket.send(ip + ":DP")
}

/* Sprites */

// Sprite compression
function spriteCompress(dat, cs) {
    let ret = ""
    for (let a = 0; a < dat.length; a += 2)
        ret += String.fromCharCode(dat[a] << 4 | dat[a + 1])
    cs.send("SP:", ret)
}

// Sprite decompression
function spriteDecompress(dat) {
    let ret = []
    for (let a = 0; a < dat.length; a++) {
        ret.push(dat.charCodeAt(a) >> 4)
        ret.push(dat.charCodeAt(a) & 15)
    }
    return ret
}
