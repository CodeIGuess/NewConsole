squareFloat:
	push	{r0, r1, r4, lr}
	mov	r4, r0
	add	r1, sp, #4
	ldr	r0, .L9
	bl	scanf
	mov	r0, r4
	ldr	r1, .L9+4
	bl	__aeabi_fcmpgt
	cmp	r0, #0
	beq	.L2
	mov	r0, r4
	mov	r1, #1056964608
	bl	__aeabi_fmul
	mov	r4, r0
	mov	r0, r4
	ldr	r1, .L9+4
	bl	__aeabi_fcmplt
	cmp	r0, #0
	beq	.L4
	mov	r0, r4
	mov	r1, #-1090519040
	bl	__aeabi_fmul
	mov	r4, r0
	mov	r1, r4
	mov	r0, r4
	bl	__aeabi_fmul
	add	sp, sp, #8
	pop	{r4, lr}
	bx	lr
squareInt:
	mov	r3, r0
	mul	r3, r0, r3
	mov	r0, r3
	bx	lr
start:
	mov	r0, #0
	mov	r3, #100
	strb	r0, [r0, #256]
	strb	r3, [r0, #255]
	strb	r0, [r0, #257]
	strb	r0, [r0, #258]
	bx	lr