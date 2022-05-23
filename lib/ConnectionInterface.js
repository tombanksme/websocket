"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionInterface = void 0;
const Frame_1 = __importDefault(require("./Frame"));
class ConnectionInterface {
    /**
     * Build the connection.
     *
     * @param sock
     */
    constructor(server, sock) {
        this.server = server;
        this.sock = sock;
        sock.on("data", (chunk) => {
            this.onChunk(chunk);
        });
        sock.on("error", () => {
            this.destroy();
        });
        sock.on("close", () => {
            this.destroy();
        });
    }
    /**
     * Handle incoming chunk.
     *
     * @param buffer
     */
    onChunk(buffer) { }
    /**
     * Handle incoming frame.
     *
     * @param frame
     */
    onFrame(frame) { }
    /**
     * Handle ping frame.
     *
     * @param frame
     */
    onPing(frame) { }
    /**
     * Handle pong frame.
     *
     * @param frame
     */
    onPong(frame) { }
    /**
     * Handle close frame.
     *
     * @param frame
     */
    onClose(frame) { }
    /**
     * Handle incoming message.
     *
     * @param message
     */
    onMessage(message) { }
    /**
     * Make a frame.
     *
     * @param params
     * @returns
     */
    makeFrame(params) {
        return new Frame_1.default(params);
    }
    /**
     * Destroy the connection.
     */
    destroy() {
        // ...
    }
}
exports.ConnectionInterface = ConnectionInterface;
exports.default = ConnectionInterface;
