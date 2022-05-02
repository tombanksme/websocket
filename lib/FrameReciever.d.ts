/// <reference types="node" />
import { Buffer } from "buffer";
import FrameParameters from "./FrameParameters";
declare enum State {
    GET_HEAD = 0,
    GET_PAYLOAD_LENGTH_16 = 1,
    GET_PAYLOAD_LENGTH_64 = 2,
    GET_MASK = 3,
    GET_DATA = 4,
    FLUSH = 5
}
export declare class FrameDecoder {
    protected cb: (params: FrameParameters) => void;
    /**
     * Length of buffered chunks.
     */
    protected bufferedLength: number;
    /**
     * Array of buffered chunks.
     */
    protected bufferedChunks: Buffer[];
    /**
     * Is the decoder looping.
     */
    protected loop: boolean;
    /**
     * The state of the decoder.
     */
    protected state: State;
    /**
     * ...
     */
    protected params: FrameParameters;
    /**
     * ...
     */
    constructor(cb: (params: FrameParameters) => void);
    /**
     * Read chunk of bytes.
     *
     * @param bytes
     */
    read(bytes: number): Buffer;
    /**
     * Write chunk of bytes.
     *
     * @param chunk
     */
    write(chunk: Buffer): void;
    /**
     * Handle the decoder.
     */
    handle(): void;
    /**
     * Get frame header.
     */
    getHead(): State;
    /**
     * Get frame payload length (16 bit).
     */
    getPayloadLength16(): State;
    /**
     * Get frame payload lenght (64 bit).
     */
    getPayloadLength64(): State;
    /**
     * Get frame mask.
     */
    getMask(): State;
    /**
     * Get frame data.
     */
    getData(): State;
    /**
     * ...
     */
    flush(): State;
}
export default FrameDecoder;
