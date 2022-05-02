"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encoder = void 0;
const Frame_1 = __importDefault(require("./Frame"));
const Opcode_1 = require("./Opcode");
class Encoder {
    constructor() {
        /**
         *
         */
        this.messages = [];
        /**
         *
         */
        this.controlFrames = [];
    }
    handle() {
        for (let message in this.messages) {
            if (this.controlFrames.length > 0) {
                for (let frame in this.controlFrames) {
                    // sock.write(frame.encode());
                }
            }
        }
    }
    /**
     *
     * @param message
     */
    send(data) {
        if (data instanceof Frame_1.default) {
            if (!(0, Opcode_1.isControl)(data.getOp())) {
                return;
            }
            this.handleFrame();
            return;
        }
    }
}
exports.Encoder = Encoder;
exports.default = Encoder;
