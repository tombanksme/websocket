"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrameDecoder = void 0;
const buffer_1 = require("buffer");
const NotEnoughBytesError_1 = __importDefault(require("./Errors/NotEnoughBytesError"));
const Opcode_1 = __importDefault(require("./Opcode"));
var State;
(function (State) {
    State[State["GET_HEAD"] = 0] = "GET_HEAD";
    State[State["GET_PAYLOAD_LENGTH_16"] = 1] = "GET_PAYLOAD_LENGTH_16";
    State[State["GET_PAYLOAD_LENGTH_64"] = 2] = "GET_PAYLOAD_LENGTH_64";
    State[State["GET_MASK"] = 3] = "GET_MASK";
    State[State["GET_DATA"] = 4] = "GET_DATA";
    State[State["FLUSH"] = 5] = "FLUSH";
})(State || (State = {}));
// Return state from functions.
class FrameDecoder {
    /**
     * ...
     */
    constructor(cb) {
        this.cb = cb;
        /**
         * Length of buffered chunks.
         */
        this.bufferedLength = 0;
        /**
         * Array of buffered chunks.
         */
        this.bufferedChunks = [];
        /**
         * Is the decoder looping.
         */
        this.loop = false;
        /**
         * The state of the decoder.
         */
        this.state = State.GET_HEAD;
        /**
         * ...
         */
        this.params = { op: Opcode_1.default.TXT };
        // ...
    }
    /**
     * Read chunk of bytes.
     *
     * @param bytes
     */
    read(bytes) {
        if (bytes > this.bufferedLength) {
            throw new NotEnoughBytesError_1.default(bytes);
        }
        let bytesRead = 0;
        const buffer = buffer_1.Buffer.alloc(bytes);
        while (bytesRead < bytes) {
            let chunk = this.bufferedChunks[0];
            if (chunk.length > bytes - bytesRead) {
                chunk = chunk.slice(0, bytes - bytesRead);
            }
            chunk.copy(buffer, bytesRead);
            if (chunk.length < this.bufferedChunks[0].length) {
                this.bufferedChunks[0] = this.bufferedChunks[0].slice(bytes - bytesRead);
            }
            else {
                this.bufferedChunks.shift();
            }
            bytesRead += chunk.length;
            this.bufferedLength -= chunk.length;
        }
        return buffer;
    }
    /**
     * Write chunk of bytes.
     *
     * @param chunk
     */
    write(chunk) {
        this.bufferedLength += chunk.length;
        this.bufferedChunks.push(chunk);
        this.handle();
    }
    /**
     * Handle the decoder.
     */
    handle() {
        if (this.loop) {
            return;
        }
        this.loop = true;
        while (this.loop) {
            try {
                switch (this.state) {
                    case State.GET_HEAD:
                        this.state = this.getHead();
                        break;
                    case State.GET_PAYLOAD_LENGTH_16:
                        this.state = this.getPayloadLength16();
                        break;
                    case State.GET_PAYLOAD_LENGTH_64:
                        this.state = this.getPayloadLength64();
                        break;
                    case State.GET_MASK:
                        this.state = this.getMask();
                        break;
                    case State.GET_DATA:
                        this.state = this.getData();
                        break;
                    case State.FLUSH:
                        this.state = this.flush();
                        break;
                }
            }
            catch (err) {
                this.loop = false;
            }
        }
    }
    /**
     * Get frame header.
     */
    getHead() {
        const head = this.read(2);
        this.params = {
            final: (head[0] & 0x80) != 0,
            rsv1: (head[0] & 0x40) != 0,
            rsv2: (head[0] & 0x20) != 0,
            rsv3: (head[0] & 0x10) != 0,
            masked: (head[1] & 0x80) != 0,
            op: head[0] & 0xf,
            length: head[1] & ~0x80,
        };
        if (this.params.length == 126) {
            return State.GET_PAYLOAD_LENGTH_16;
        }
        if (this.params.length == 127) {
            return State.GET_PAYLOAD_LENGTH_64;
        }
        return this.params.masked ? State.GET_MASK : State.GET_DATA;
    }
    /**
     * Get frame payload length (16 bit).
     */
    getPayloadLength16() {
        this.params.length = this.read(2).readUInt16BE();
        return this.params.masked ? State.GET_MASK : State.GET_DATA;
    }
    /**
     * Get frame payload lenght (64 bit).
     */
    getPayloadLength64() {
        const buf = this.read(8);
        const num = buf.readUInt32BE();
        // Avoid
        if (num > Math.pow(2, 53 - 32) - 1) {
            this.loop = false;
            // Throw an error.
            // console.log("Throw an error");
            throw new Error("");
        }
        this.params.length = num * Math.pow(2, 32) + buf.readUInt32BE(4);
        return this.params.masked ? State.GET_MASK : State.GET_DATA;
    }
    /**
     * Get frame mask.
     */
    getMask() {
        if (this.params.masked) {
            this.params.mask = this.read(4);
        }
        return State.GET_DATA;
    }
    /**
     * Get frame data.
     */
    getData() {
        if (this.params.length) {
            const data = this.read(this.params.length);
            if (this.params.masked && this.params.mask) {
                for (let i = 0; i < data.length; i++) {
                    data[i] ^= this.params.mask[i & 3];
                }
            }
            this.params.data = data;
        }
        return State.FLUSH;
    }
    /**
     * ...
     */
    flush() {
        this.cb(this.params);
        this.params = { op: Opcode_1.default.TXT };
        return State.GET_HEAD;
    }
}
exports.FrameDecoder = FrameDecoder;
exports.default = FrameDecoder;
