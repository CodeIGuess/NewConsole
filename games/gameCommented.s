
@ This is a stripped version of the ARM assembly output from game.c
@ I'm using it to better understand how arm works

squareFloat:
	push	{fp, lr}       @ 
	add		fp, sp, #4     @ 
	sub		sp, sp, #8     @ 
	str		r0, [fp, #-8]  @ 
	ldr		r1, [fp, #-8]  @ 
	ldr		r0, [fp, #-8]  @ 
	bl		__aeabi_fmul   @ 
	mov		r3, r0         @ 
	mov		r0, r3         @ 
	sub		sp, fp, #4     @ 
	pop		{fp, lr}       @ 
	bx		lr             @ 
squareInt:
	str		fp, [sp, #-4]! @ Function start
	add		fp, sp, #0     @ fp = sp + #0
	sub		sp, sp, #12    @ sp = sp - #12
	str		r0, [fp, #-8]  @ 
	ldr		r3, [fp, #-8]  @ 
	mov		r2, r3         @ 
	mul		r2, r3, r2     @ 
	mov		r3, r2         @ 
	mov		r0, r3         @ 
	add		sp, fp, #0     @ Function end
	ldr		fp, [sp], #4
	bx		lr
start:
	push	{fp, lr}       @ Function start, pushes things to save for later
	add		fp, sp, #4     @ fp = sp + #4
	ldr		r0, .L7        @ Loads the constant at L7 (10f) to r0
	bl		squareFloat    @ Branches to `squareFloat`
	mov		r3, #0         @ Clears registers after they were used by `squareFloat`
	mov		r0, r3
	sub		sp, fp, #4     @ Function end, offsets stack pointer
	pop		{fp, lr}       @ Pops things that were saved in stack?
	bx		lr             @ Returns from function
