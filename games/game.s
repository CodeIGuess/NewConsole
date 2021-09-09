.LC0:
	.ascii	"Hello!\000"

main:
	push	{fp, lr}
	add	fp, sp, #4
	ldr	r0, .L3
	bl	printf
	mov	r3, #0
	mov	r0, r3
	sub	sp, fp, #4
	pop	{fp, lr}
	bx	lr

.L3:
	.word	.LC0