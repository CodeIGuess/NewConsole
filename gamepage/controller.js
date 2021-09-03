
console.log("Loaded controller!")

var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

function buttonPressed(i) {
    // console.log("Pressed")
    socket.send(ip + ":BD:" + i)
}

function buttonReleased(i, pointerLeave) {
    // console.log("Released")
    if (pointerLeave && !isMobile) return
    socket.send(ip + ":BU:" + i)
}
