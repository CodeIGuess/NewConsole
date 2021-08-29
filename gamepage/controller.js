
console.log("Loaded controller!")

function buttonPressed(i) {
    console.log("Pressed")
    socket.send(ip + ":BD:" + i)
}

function buttonReleased(i) {
    console.log("Released")
    socket.send(ip + ":BU:" + i)
}
