"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncodesFrames = void 0;
const buffer_1 = require("buffer");
const Message_1 = __importDefault(require("./Message"));
const MessageType_1 = __importDefault(require("./MessageType"));
const Opcode_1 = __importDefault(require("./Opcode"));
const functions_1 = require("./functions");
function EncodesFrames(Base) {
    return class EncodesFrames extends Base {
        constructor() {
            super(...arguments);
            /**
             * ...
             */
            this.encoding = false;
            /**
             * ...
             */
            this.outgoingQueue = [];
        }
        /**
         * ...
         *
         * @returns
         */
        isEncoding() {
            return this.encoding;
        }
        /**
         * Set payload length (16 bit).
         * @returns
         */
        setPayloadLength16(data) {
            const buffer = buffer_1.Buffer.alloc(2);
            buffer.writeUInt16BE(data.length);
            return buffer;
        }
        /**
         * Set payload length (64 bit).
         *
         * @returns
         */
        setPayloadLength64(data) {
            const buffer = buffer_1.Buffer.alloc(8);
            buffer.writeUIntBE(data.length, 2, 6);
            return buffer;
        }
        /**
         * Encode a frame.
         *
         * @param frame
         * @returns
         */
        encodeFrame(frame) {
            var _a;
            let head = buffer_1.Buffer.alloc(2);
            let mask = frame.getMask();
            let data = frame.getData();
            head[0] = frame.isFinal() ? 0x80 | frame.getOp() : frame.getOp();
            if (frame.rsv1) {
                head[0] |= 0x40;
            }
            if (frame.rsv2) {
                head[0] |= 0x20;
            }
            if (frame.rsv3) {
                head[0] |= 0x10;
            }
            let length = null;
            if (!data) {
                head[1] = frame.isMasked() ? 0x80 | 0 : 0;
            }
            else if (data.length >= 65536) {
                length = this.setPayloadLength64(data);
                head[1] = frame.isMasked() ? 0x80 | 127 : 127;
            }
            else if (data.length >= 126) {
                length = this.setPayloadLength16(data);
                head[1] = frame.isMasked() ? 0x80 | 126 : 126;
            }
            else {
                head[1] = frame.isMasked() ? 0x80 | data.length : data.length;
            }
            if (frame.isMasked() && data) {
                mask = (_a = frame.getMask()) !== null && _a !== void 0 ? _a : (0, functions_1.generateMask)();
                for (let i = 0; i < data.length; i++) {
                    data[i] = data[i] ^ mask[i & 3];
                }
            }
            return buffer_1.Buffer.concat([head, length, mask, data].filter((p) => p !== null));
        }
        /**
         * Handle the encoding process.
         *
         * @returns
         */
        handleEncode() {
            if (this.encoding)
                return;
            this.encoding = true;
            while (this.outgoingQueue.length > 0) {
                const message = this.outgoingQueue.shift();
                if (!message) {
                    continue;
                }
                for (let frame of message.toFragments()) {
                    this.sock.write(this.encodeFrame(frame));
                }
            }
            this.encoding = false;
        }
        /**
         * Send a message.
         *
         * @param data
         */
        send(data) {
            this.outgoingQueue.push(new Message_1.default(data instanceof buffer_1.Buffer ? MessageType_1.default.BIN : MessageType_1.default.TXT, buffer_1.Buffer.from(data)));
            this.handleEncode();
        }
        /**
         * Send a ping frame.
         */
        ping(msg = "") {
            const data = msg instanceof buffer_1.Buffer ? msg : buffer_1.Buffer.from(msg);
            this.sock.write(this.encodeFrame(this.makeFrame({ op: Opcode_1.default.PING, data })));
        }
        /**
         * Send a pong frame.
         *
         * @param msg
         */
        pong(msg = "") {
            const data = msg instanceof buffer_1.Buffer ? msg : buffer_1.Buffer.from(msg);
            this.sock.write(this.encodeFrame(this.makeFrame({ op: Opcode_1.default.PONG, data })));
        }
        /**
         * Send a close frame.
         */
        close() {
            this.sock.write(this.encodeFrame(this.makeFrame({ op: Opcode_1.default.CLOSE })));
        }
    };
}
exports.EncodesFrames = EncodesFrames;
exports.default = EncodesFrames;
