export declare enum Opcode {
    CONTINUE = 0,
    TXT = 1,
    BIN = 2,
    CLOSE = 8,
    PING = 9,
    PONG = 10
}
/**
 * Check if opcode is a control frame code.
 *
 * @param op
 * @returns
 */
export declare function isControl(op: Opcode): boolean;
export default Opcode;
