
float squareFloat(float num) {
    if (num > 100) { num *= 0.5f; }
    if (num < 100) { num *= -0.5f; }
    return num * num;
}

int squareInt(int num) {
    return num * num;
}

int start() {
    *(int*)0x000000FF = squareInt(10); // setting a memory address. evil.
    return 0;
}
