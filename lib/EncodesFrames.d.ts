/// <reference types="node" />
import { Buffer } from "buffer";
import Message from "./Message";
import ConnectionInterface from "./ConnectionInterface";
import FrameInterface from "./FrameInterface";
declare type Constructor<T = {}> = new (...args: any[]) => T;
export declare function EncodesFrames<T extends Constructor<ConnectionInterface>>(Base: T): {
    new (...args: any[]): {
        /**
         * ...
         */
        encoding: boolean;
        /**
         * ...
         */
        outgoingQueue: Message[];
        /**
         * ...
         *
         * @returns
         */
        isEncoding(): boolean;
        /**
         * Set payload length (16 bit).
         * @returns
         */
        setPayloadLength16(data: Buffer): Buffer;
        /**
         * Set payload length (64 bit).
         *
         * @returns
         */
        setPayloadLength64(data: Buffer): Buffer;
        /**
         * Encode a frame.
         *
         * @param frame
         * @returns
         */
        encodeFrame(frame: FrameInterface): Buffer;
        /**
         * Handle the encoding process.
         *
         * @returns
         */
        handleEncode(): void;
        /**
         * Send a message.
         *
         * @param data
         */
        send(data: Buffer | string): void;
        /**
         * Send a ping frame.
         */
        ping(): void;
        /**
         * Send a pong frame.
         */
        pong(): void;
        /**
         * Send a close frame.
         */
        close(): void;
        server: import("./Server").Server;
        sock: import("stream").Duplex;
        onChunk(buffer: Buffer): void;
        onFrame(frame: FrameInterface): void;
        onPing(frame: FrameInterface): void;
        onPong(frame: FrameInterface): void;
        onClose(frame: FrameInterface): void;
        onMessage(message: Message): void;
        makeFrame(params: import("./FrameParameters").FrameParameters): FrameInterface;
        destroy(): void;
    };
} & T;
export default EncodesFrames;
