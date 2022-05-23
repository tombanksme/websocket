"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const EncodesFrames_1 = __importDefault(require("./EncodesFrames"));
const DecodesFrames_1 = __importDefault(require("./DecodesFrames"));
const ConnectionInterface_1 = __importDefault(require("./ConnectionInterface"));
const Message_1 = __importDefault(require("./Message"));
const TerminateConnectionError_1 = __importDefault(require("./Errors/TerminateConnectionError"));
const Opcode_1 = require("./Opcode");
class Connection extends (0, EncodesFrames_1.default)((0, DecodesFrames_1.default)(ConnectionInterface_1.default)) {
    constructor() {
        super(...arguments);
        /**
         * Array of message fragments.
         */
        this.fragments = [];
    }
    /**
     * Validate an incoming frame.
     *
     * @param frame
     * @returns
     */
    validateFrame(frame) {
        if (frame.rsv1 || frame.rsv2 || frame.rsv3) {
            return false;
        }
        if (!frame.isMasked() || !frame.getMask()) {
            return false;
        }
        if ((0, Opcode_1.isControl)(frame.getOp()) && !frame.isFinal()) {
            return false;
        }
        if ((0, Opcode_1.isControl)(frame.getOp())) {
            if (!frame.isFinal()) {
                return false;
            }
            const data = frame.getData();
            if (data && data.length > 125) {
                return false;
            }
        }
        return true;
    }
    /**
     * Handle incoming frame.
     *
     * @param frame
     */
    onFrame(frame) {
        if (!this.validateFrame(frame)) {
            throw new TerminateConnectionError_1.default();
        }
        switch (frame.getOp()) {
            case Opcode_1.Opcode.PING:
                this.onPing(frame);
                break;
            case Opcode_1.Opcode.PONG:
                this.onPong(frame);
                break;
            case Opcode_1.Opcode.CLOSE:
                this.onClose(frame);
                break;
            case Opcode_1.Opcode.TXT:
            case Opcode_1.Opcode.BIN:
            case Opcode_1.Opcode.CONTINUE:
                this.fragments.push(frame);
                if (frame.isFinal()) {
                    this.onMessage(Message_1.default.fromFragments(this.fragments));
                    this.fragments = [];
                }
        }
    }
    onPing(frame) {
        var _a;
        this.pong((_a = frame.getData()) !== null && _a !== void 0 ? _a : "");
    }
    /**
     * Close the connection.
     *
     * @param frame
     */
    onClose(frame) {
        if (!this.sock.destroyed) {
            this.sock.destroy();
        }
        this.server.delConnection(this);
    }
    /**
     * Destroy the connection.
     *
     * ...
     */
    destroy() {
        if (!this.sock.destroyed) {
            this.close();
            this.sock.destroy();
        }
        this.server.delConnection(this);
    }
}
exports.Connection = Connection;
exports.default = Connection;
