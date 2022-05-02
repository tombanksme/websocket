"use strict";
// Source: https://github.com/Microsoft/TypeScript/issues/15942
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecodesFrames = exports.State = void 0;
const Opcode_1 = __importDefault(require("./Opcode"));
var State;
(function (State) {
    State[State["GET_HEAD"] = 0] = "GET_HEAD";
    State[State["GET_PAYLOAD_LENGTH_16"] = 1] = "GET_PAYLOAD_LENGTH_16";
    State[State["GET_PAYLOAD_LENGTH_64"] = 2] = "GET_PAYLOAD_LENGTH_64";
    State[State["GET_MASK"] = 3] = "GET_MASK";
    State[State["GET_DATA"] = 4] = "GET_DATA";
    State[State["EXPORT_FRAME"] = 5] = "EXPORT_FRAME";
})(State = exports.State || (exports.State = {}));
function DecodesFrames(Base) {
    return class DecodesFrames extends Base {
        constructor() {
            super(...arguments);
            /**
             * ...
             */
            this.decoding = false;
            /**
             * ...
             */
            this.decodeState = State.GET_HEAD;
            /**
             * ...
             */
            this.decodeBuffer = [];
            /**
             * ...
             */
            this.decodedParams = { op: Opcode_1.default.TXT };
        }
        /**
         * ...
         *
         * @returns
         */
        isDecoding() {
            return this.decoding;
        }
        /**
         * ...
         */
        decodeLength() {
            return this.decodeBuffer.reduce((length, buffer) => length + buffer.length, 0);
        }
        /**
         * ...
         *
         * @param chunk
         */
        onChunk(chunk) {
            this.decodeBuffer.push(chunk);
            this.handleDecode();
        }
        /**
         * ...
         */
        handleDecode() {
            if (this.decoding)
                return;
            this.decoding = true;
            while (this.decoding) {
                const func = [
                    this.getHead,
                    this.getPayloadLength16,
                    this.getPayloadLength64,
                    this.getMask,
                    this.getData,
                    this.exportFrame,
                ][this.decodeState];
                this.decodeState = func.bind(this)();
            }
        }
        /**
         * Read 'n' bytes.
         *
         * @param n
         * @returns
         */
        read(n) {
            if (n > this.decodeLength()) {
                this.decoding = false;
                return false;
            }
            const output = Buffer.alloc(n);
            while (n > 0) {
                const buf = this.decodeBuffer.shift();
                const offset = output.length - n;
                if (!buf)
                    return false;
                buf.copy(output, offset, 0, n >= buf.length ? buf.length : n);
                if (n < buf.length) {
                    this.decodeBuffer.unshift(buf.slice(n));
                }
                n -= buf.length;
            }
            return output;
        }
        /**
         * Get frame head.
         */
        getHead() {
            const buf = this.read(2);
            if (!buf) {
                return State.GET_HEAD;
            }
            this.decodedParams = {
                final: (buf[0] & 0x80) != 0,
                rsv1: (buf[0] & 0x40) != 0,
                rsv2: (buf[0] & 0x20) != 0,
                rsv3: (buf[0] & 0x10) != 0,
                masked: (buf[1] & 0x80) != 0,
                op: buf[0] & 0xf,
                length: buf[1] & ~0x80,
            };
            if (this.decodedParams.length == 126) {
                return State.GET_PAYLOAD_LENGTH_16;
            }
            if (this.decodedParams.length == 127) {
                return State.GET_PAYLOAD_LENGTH_64;
            }
            return this.decodedParams.masked ? State.GET_MASK : State.GET_DATA;
        }
        /**
         * Get payload length (16 bits).
         */
        getPayloadLength16() {
            const buf = this.read(2);
            if (!buf) {
                return State.GET_PAYLOAD_LENGTH_16;
            }
            this.decodedParams.length = buf.readUInt16BE();
            return this.decodedParams.masked ? State.GET_MASK : State.GET_DATA;
        }
        /**
         * Get payload length (64 bit).
         */
        getPayloadLength64() {
            const buf = this.read(8);
            if (!buf) {
                return State.GET_PAYLOAD_LENGTH_64;
            }
            const num = buf.readUInt32BE(0);
            if (num > Math.pow(2, 53 - 32) - 1) {
                // TODO: This needs to be caught somewhere.
                throw new Error("");
            }
            this.decodedParams.length =
                num * Math.pow(2, 32) + buf.readUInt32BE(4);
            return this.decodedParams.masked ? State.GET_MASK : State.GET_DATA;
        }
        /**
         * Get frame mask.
         */
        getMask() {
            if (this.decodedParams.masked) {
                const buf = this.read(4);
                if (!buf) {
                    return State.GET_MASK;
                }
                this.decodedParams.mask = buf;
            }
            return State.GET_DATA;
        }
        /**
         * Get frame data.
         */
        getData() {
            if (this.decodedParams.length) {
                const buf = this.read(this.decodedParams.length);
                if (!buf) {
                    return State.GET_DATA;
                }
                if (this.decodedParams.masked && this.decodedParams.mask) {
                    for (let i = 0; i < buf.length; i++) {
                        buf[i] ^= this.decodedParams.mask[i & 3];
                    }
                }
                this.decodedParams.data = buf;
            }
            return State.EXPORT_FRAME;
        }
        /**
         * Export a frame.
         */
        exportFrame() {
            this.onFrame(this.makeFrame(this.decodedParams));
            this.decodedParams = { op: Opcode_1.default.TXT };
            return State.GET_HEAD;
        }
    };
}
exports.DecodesFrames = DecodesFrames;
exports.default = DecodesFrames;
