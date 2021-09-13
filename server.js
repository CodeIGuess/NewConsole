
// Modifiable things
let pathLogs = false // Url logs
let cdLogs   = false // Connected / Disconnected logs

// Code...

const http = require('http')
const fs = require('fs').promises
const ws = require('ws')
let game = require('./cartSelect')

// Last connected user
let last = "-1"
// All connected users
let connected = {}

// URLs that should return nothing
let urlBlackList = [ "/favicon.ico" ]

// Called when a user connects
function connect(ip) {
    connected[ip] = [0, 0, 0, 0]
    if (cdLogs) console.log("Connected:", ip)
}

// Called when a user disconnects
function disconnect(ip) {
    delete connected[ip]
    if (cdLogs) console.log("Disconnected:", ip)
}

// Called for every HTTP request
function requestListener(req, res) {
    if (req.connection.remoteAddress == ip) {} // Code for dev mode
    let url = req.url
    if (url[url.length - 1] == '/') url += "index.html"
    last = req.connection.remoteAddress
    if (!(req.connection.remoteAddress in connected)) connect(req.connection.remoteAddress)
    if (urlBlackList.includes(url)) {
        url = "/nothing"
    } else {
        url = "/gamepage" + url
    }
    if (pathLogs) console.log(url)
    fs.readFile(__dirname + url)
    .then(contents => {
        res.writeHead(200)
        res.end(contents)
    })
    .catch(err => {
        res.writeHead(404)
        res.end(`You're on the wrong page, ${[
            "human being", "buddy", "friend", "mate", "human", "creature", "pal"
        ][Math.floor(Math.random() * 7)]}.`)
        return
    })
}

// This server's IP address
const ip = getIPAddress()
const server = http.createServer(requestListener)
server.listen(80, ip, () => {
    console.log(`Server is running on ${ip}:80`)
})

// Gets this server's IP address
function getIPAddress() {
    var interfaces = require('os').networkInterfaces()
    for (var devName in interfaces) {
        var iface = interfaces[devName]
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i]
            if (alias.family === "IPv4" && alias.address !== "127.0.0.1" 
                && !alias.internal) return alias.address
        }
    }
    return "0.0.0.0"
}

// Client timeout disconnect
setInterval(function(){
    let ret = ""
    for (let k in connected) {
        connected[k][0] += 1
        if (connected[k][0] > 6) {
            disconnect(k)
            continue
        }
        ret += ", " + k + ": " + connected[k][3]
    }
    console.log(ret)
}, 1000)

// WebSocket for other communications
const wss = new ws.WebSocketServer({port: 5077})

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        message = message.toString().split(":")
        let sip = message[0] // Sender IP
        let cnt = message.slice(1)
        // console.log(message)
        switch (cnt[0]) {
            case "":
                if (!(sip in connected)) connect(sip)
                else connected[sip][0] = 0
                break
            case "FT":
                connected[sip][1] = parseInt(cnt[1])
                break
            case "NK":
                for (let e = 0; e < els.length; e++) {
                    console.log(`GK:${sendFullElement(els[e])}`)
                    connected[sip][2].send(`GK:${e},${sendFullElement(els[e])}`)
                }
                break
            case "BD":
                connected[sip][3] |= 1 << cnt[1]
                break
            case "BU":
                console.log("Up!")
                connected[sip][3] &= ~(1 << cnt[1])
                break
        }
    })
    ws.send("IP:" + last)
    connected[last][2] = ws
})

/* GAME LOGIC */
let els = [{
    type: "rect",
    attributes: {
        x: 0,
        y: 224,
        width: 64,
        height: 64,
        fill: "--p2"
    },
    dirtyAttributes: {
        x: false,
        y: false,
        width: false,
        height: false,
        fill: false
    }
}]

let frameCount = 0
setInterval(function update(){
    for (let c in connected) {
        if (connected[c][2] === 0) continue
        if (connected[c][1] & 1) { // Check if client has display
            // connected[c][2].send(`GR:<rect x="224" y="224" fill="red" width="64" height="64"/>`)
            // connected[c][2].send(`GR:`)
            els[0].attributes.x += 0.2
            els[0].dirtyAttributes.x = true
        }
        for (let e = 0; e < els.length; e++) cleanupAttributes(e, c)
    }
    // console.log(els[0].dirtyAttributes)
    frameCount++
}, 220) // 22

// Sends attributes to client
function cleanupAttributes(el, c) {
    let cleanString = "GP:" + el
    for (let a in els[el].dirtyAttributes) {
        if (els[el].dirtyAttributes[a]) {
            els[el].dirtyAttributes[a] = false
            cleanString += ',' + a + ':' + els[el].attributes[a]
        }
    }
    // console.log(connected[c])
    connected[c][2].send(cleanString)
}

// Element compression
function sendFullElement(el) {
    let ret = el.type
    for (let a in el.attributes) {
        ret += "," + a + ":" + el.attributes[a]
    }
    return ret
}

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

// console.log(spriteDecompress(spriteCompress(game.spriteData[0])))
