import { Buffer } from "buffer";

import Opcode from "./Opcode";
import FrameParameters from "./FrameParameters";
import { generateMask } from "./functions";

export abstract class FrameInterface {
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
    protected mask: Buffer | null = null;

    /**
     * Frame data.
     */
    protected data: Buffer | null = null;

    /**
     *
     * @param params
     */
    constructor({
        final = true,
        rsv1 = false,
        rsv2 = false,
        rsv3 = false,
        op,
        masked = false,
        mask = null,
        data = null,
    }: FrameParameters) {
        this.final = final;
        this.rsv1 = rsv1;
        this.rsv2 = rsv2;
        this.rsv3 = rsv3;
        this.op = op;
        this.masked = masked;
        this.mask = mask;
        this.data = data;
    }

    /**
     * ...
     */
    isFinal() {
        return this.final;
    }

    /**
     * ...
     */
    getOp() {
        return this.op;
    }

    /**
     * ...
     */
    isMasked() {
        return this.masked;
    }

    /**
     * ...
     */
    getMask() {
        return this.mask;
    }

    /**
     * ...
     */
    getData() {
        return this.data;
    }
}

export default FrameInterface;
