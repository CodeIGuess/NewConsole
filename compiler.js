
let code = `
hlt
act
set
add
sub
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
`

code = code.split(/[ \n]+/g).filter(e => e.length != 0)
console.log(code)


