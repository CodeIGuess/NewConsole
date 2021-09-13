
console.log("Loaded display!")

// The display
let display = document.getElementById("fullScreen")

// Listen for messages
socket.addEventListener('message', function (event) {
    message = event.data.toString().split(":")
    let typ = message[0] // Type
    let cnt = message.slice(1).join(":") // Content
    switch (typ) {
        case "GK": {
            // console.log("KEYFRAME!")
            cnt = cnt.split(',')
            let id = parseInt(cnt.splice(0, 1))
            let tag = document.createElement(cnt.splice(0, 1))
            if (display.children.length <= id) display.appendChild(tag)
            cnt = cnt.map(e => e.split(":"))
            console.log(cnt)
            for (let a = 0; a < cnt.length; a++) {
                tag.setAttribute(cnt[a][0], cnt[a][1])
            }
        } break
        case "GP": {
            // console.log(cnt)
            // let fullTag = cnt.split(',').map(e => e.split(':'))
            // let tag = display.children[fullTag[0]]
            // for (let a = 1; a < fullTag.length; a++) {
            //     tag.setAttribute(fullTag[a][0], fullTag[a][1])
            // }
        } break
        default: {
            console.log(`Didn't understand packet: "${event.data}"`)
        } break
    }
})

socket.send(ip + ":NK:")

// Main loop ~45 fps
setInterval(function(){

}, 22)

/* Sprites */

// Sprite compression
function spriteCompress(dat, cs) {
    let ret = ""
    for (let a = 0; a < dat.length; a += 2)
        ret += String.fromCharCode(dat[a] << 4 | dat[a + 1])
    cs.send(ip + ":SP:", ret)
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
