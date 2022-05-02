"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrameInterface = void 0;
class FrameInterface {
    /**
     *
     * @param params
     */
    constructor({ final = true, rsv1 = false, rsv2 = false, rsv3 = false, op, masked = false, mask = null, data = null, }) {
        /**
         * Mask key.
         */
        this.mask = null;
        /**
         * Frame data.
         */
        this.data = null;
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
exports.FrameInterface = FrameInterface;
exports.default = FrameInterface;
