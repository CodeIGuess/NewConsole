
let features = 0

// The websocket
let socket = new WebSocket(`ws://${window.location.host}:5077`)
    
// Connection opened
socket.addEventListener('open', function (event) {
    // socket.send(ip + ":")
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
            socket.send(ip + ":")
        } break
    }
})

// This IP
let ip = "-1"

// Runs when the server is ready to recieve data
function onServerReady() {
    console.log("Sending features...")
    socket.send(ip + ":FT:" + features)
}

function readyStart() {
    let b1 = document.getElementById("settingsContainer").children[2].style.filter == ""
    let b2 = document.getElementById("settingsContainer").children[3].style.filter == ""
    if (!b1 && !b2) {
        alert("Please, turn something on.")
        return
    }
    if (b1) features |= 1
    if (b2) features |= 2

    onServerReady()

    document.getElementById("fullScreen").style.opacity = "1"
    document.body.removeChild(document.getElementById("settingsContainer"))

    if (b1) {
        fetch("display.js").then(d => d.text().then(t => {
            (1, eval)(t)
        }))
    }
    if (b2) {
        fetch("controller.js").then(d => d.text().then(t => {
            (1, eval)(t)
        }))
    }
}

function dpSwitches(i) {
    let button = document.getElementById("settingsContainer").children[i]
    if (button.style.filter === "") {
        button.style.filter = "saturate(0.1)"
        button.children[0].style.filter = "blur(1px)"
    } else {
        button.style.filter = ""
        button.children[0].style.filter = ""
    }
}

// dpSwitches(2)
// dpSwitches(3)
