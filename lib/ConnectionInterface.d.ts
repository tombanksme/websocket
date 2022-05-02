/// <reference types="node" />
import { Duplex } from "stream";
import FrameInterface from "./FrameInterface";
import FrameParameters from "./FrameParameters";
import Message from "./Message";
import Server from "./Server";
export declare class ConnectionInterface {
    server: Server;
    sock: Duplex;
    /**
     * Build the connection.
     *
     * @param sock
     */
    constructor(server: Server, sock: Duplex);
    /**
     * Handle incoming chunk.
     *
     * @param buffer
     */
    onChunk(buffer: Buffer): void;
    /**
     * Handle incoming frame.
     *
     * @param frame
     */
    onFrame(frame: FrameInterface): void;
    /**
     * Handle ping frame.
     *
     * @param frame
     */
    onPing(frame: FrameInterface): void;
    /**
     * Handle pong frame.
     *
     * @param frame
     */
    onPong(frame: FrameInterface): void;
    /**
     * Handle close frame.
     *
     * @param frame
     */
    onClose(frame: FrameInterface): void;
    /**
     * Handle incoming message.
     *
     * @param message
     */
    onMessage(message: Message): void;
    /**
     * Make a frame.
     *
     * @param params
     * @returns
     */
    makeFrame(params: FrameParameters): FrameInterface;
    /**
     * Destroy the connection.
     */
    destroy(): void;
}
export default ConnectionInterface;
