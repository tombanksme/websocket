"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const Opcode_1 = __importDefault(require("./Opcode"));
const MessageType_1 = __importDefault(require("./MessageType"));
const TerminateConnectionError_1 = __importDefault(require("./Errors/TerminateConnectionError"));
const Frame_1 = require("./Frame");
class Message {
    /**
     * Build the message.
     *
     * @param type
     * @param data
     */
    constructor(type, data) {
        this.type = type;
        this.data = data;
        /**
         *
         */
        this.MAX_FRAME_SIZE = 115712;
        // ...
    }
    /**
     * Split message into fragments.
     *
     * @returns
     */
    toFragments() {
        let chunks = [], i = 0, n = this.data.length;
        while (i < n) {
            chunks.push(this.data.slice(i, (i += this.MAX_FRAME_SIZE)));
        }
        let fragments = [];
        for (let i = 0; i < chunks.length; i++) {
            fragments.push(new Frame_1.Frame({
                final: i == chunks.length - 1 ? true : false,
                op: i == 0 ? Opcode_1.default.TXT : Opcode_1.default.CONTINUE,
                data: chunks[i],
            }));
        }
        return fragments;
    }
    /**
     * Build message from fragments.
     *
     * @param frames
     * @returns
     */
    static fromFragments(frames) {
        const frame = frames.find((f) => f.getOp() !== Opcode_1.default.CONTINUE);
        if (!frame) {
            throw new TerminateConnectionError_1.default();
        }
        return new Message(frame.getOp() == Opcode_1.default.TXT ? MessageType_1.default.TXT : MessageType_1.default.BIN, Buffer.concat(frames
            .map((f) => f.getData())
            .filter((p) => p !== null)));
    }
}
exports.Message = Message;
exports.default = Message;
