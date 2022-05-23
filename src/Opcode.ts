export enum Opcode {
    CONTINUE = 0x0,
    TXT = 0x1,
    BIN = 0x2,
    CLOSE = 0x8,
    PING = 0x9,
    PONG = 0xa,
}

/**
 * Check if opcode is a control frame code.
 *
 * @param op
 * @returns
 */
export function isControl(op: Opcode) {
    return op == Opcode.PING || op == Opcode.PONG || op == Opcode.CLOSE;
}

export default Opcode;
