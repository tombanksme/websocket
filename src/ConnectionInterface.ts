import { Duplex } from "stream";

import Frame from "./Frame";
import FrameInterface from "./FrameInterface";
import FrameParameters from "./FrameParameters";
import Message from "./Message";
import Opcode from "./Opcode";
import Server from "./Server";

export class ConnectionInterface {
    /**
     * Build the connection.
     *
     * @param sock
     */
    constructor(public server: Server, public sock: Duplex) {
        sock.on("data", (chunk: Buffer) => {
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
    onChunk(buffer: Buffer) {}

    /**
     * Handle incoming frame.
     *
     * @param frame
     */
    onFrame(frame: FrameInterface) {}

    /**
     * Handle ping frame.
     *
     * @param frame
     */
    onPing(frame: FrameInterface) {}

    /**
     * Handle pong frame.
     *
     * @param frame
     */
    onPong(frame: FrameInterface) {}

    /**
     * Handle close frame.
     *
     * @param frame
     */
    onClose(frame: FrameInterface) {}

    /**
     * Handle incoming message.
     *
     * @param message
     */
    onMessage(message: Message) {}

    /**
     * Make a frame.
     *
     * @param params
     * @returns
     */
    makeFrame(params: FrameParameters): FrameInterface {
        return new Frame(params);
    }

    /**
     * Destroy the connection.
     */
    destroy() {
        // ...
    }
}

export default ConnectionInterface;
