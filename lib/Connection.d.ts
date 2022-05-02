/// <reference types="node" />
import { Duplex } from "stream";
import Frame from "./Frame";
import FrameInterface from "./FrameInterface";
import ConnectionInterface from "./ConnectionInterface";
import Message from "./Message";
declare const Connection_base: {
    new (...args: any[]): {
        encoding: boolean;
        outgoingQueue: Message[];
        isEncoding(): boolean;
        setPayloadLength16(data: Buffer): Buffer;
        setPayloadLength64(data: Buffer): Buffer;
        encodeFrame(frame: FrameInterface): Buffer;
        handleEncode(): void;
        send(data: string | Buffer): void;
        ping(): void;
        pong(): void;
        close(): void;
        server: import("./Server").Server;
        sock: Duplex;
        onChunk(buffer: Buffer): void;
        onFrame(frame: FrameInterface): void;
        onPing(frame: FrameInterface): void;
        onPong(frame: FrameInterface): void;
        onClose(frame: FrameInterface): void;
        onMessage(message: Message): void;
        makeFrame(params: import("./FrameParameters").FrameParameters): FrameInterface;
        destroy(): void;
    };
} & {
    new (...args: any[]): {
        decoding: boolean;
        decodeState: import("./DecodesFrames").State;
        decodeBuffer: Buffer[];
        decodedParams: import("./FrameParameters").FrameParameters;
        isDecoding(): boolean;
        decodeLength(): number;
        onChunk(chunk: Buffer): void;
        handleDecode(): void;
        read(n: number): false | Buffer;
        getHead(): import("./DecodesFrames").State;
        getPayloadLength16(): import("./DecodesFrames").State;
        getPayloadLength64(): import("./DecodesFrames").State;
        getMask(): import("./DecodesFrames").State;
        getData(): import("./DecodesFrames").State;
        exportFrame(): import("./DecodesFrames").State;
        server: import("./Server").Server;
        sock: Duplex;
        onFrame(frame: FrameInterface): void;
        onPing(frame: FrameInterface): void;
        onPong(frame: FrameInterface): void;
        onClose(frame: FrameInterface): void;
        onMessage(message: Message): void;
        makeFrame(params: import("./FrameParameters").FrameParameters): FrameInterface;
        destroy(): void;
    };
} & typeof ConnectionInterface;
export declare class Connection extends Connection_base {
    /**
     * Array of message fragments.
     */
    protected fragments: FrameInterface[];
    /**
     * Validate an incoming frame.
     *
     * @param frame
     * @returns
     */
    validateFrame(frame: FrameInterface): boolean;
    /**
     * Handle incoming frame.
     *
     * @param frame
     */
    onFrame(frame: Frame): void;
    /**
     * Close the connection.
     *
     * @param frame
     */
    onClose(frame: FrameInterface): void;
    /**
     * Destroy the connection.
     *
     * ...
     */
    destroy(): void;
}
export default Connection;
