/// <reference types="node" />
import { Buffer } from "buffer";
import Opcode from "./Opcode";
import FrameParameters from "./FrameParameters";
export declare abstract class FrameInterface {
    /**
     * Final frame flag.
     */
    protected final: boolean;
    /**
     * Reserved bit.
     */
    readonly rsv1: boolean;
    /**
     * Reserved bit.
     */
    readonly rsv2: boolean;
    /**
     * Reserved bit.
     */
    readonly rsv3: boolean;
    /**
     * Masked frame flag.
     */
    protected masked: boolean;
    /**
     * Opcode.
     */
    protected op: Opcode;
    /**
     * Mask key.
     */
    protected mask: Buffer | null;
    /**
     * Frame data.
     */
    protected data: Buffer | null;
    /**
     *
     * @param params
     */
    constructor({ final, rsv1, rsv2, rsv3, op, masked, mask, data, }: FrameParameters);
    /**
     * ...
     */
    isFinal(): boolean;
    /**
     * ...
     */
    getOp(): Opcode;
    /**
     * ...
     */
    isMasked(): boolean;
    /**
     * ...
     */
    getMask(): Buffer | null;
    /**
     * ...
     */
    getData(): Buffer | null;
}
export default FrameInterface;
