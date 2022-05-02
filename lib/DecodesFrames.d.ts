/// <reference types="node" />
import FrameParameters from "./FrameParameters";
import ConnectionInterface from "./ConnectionInterface";
declare type Constructor<T = {}> = new (...args: any[]) => T;
export declare enum State {
    GET_HEAD = 0,
    GET_PAYLOAD_LENGTH_16 = 1,
    GET_PAYLOAD_LENGTH_64 = 2,
    GET_MASK = 3,
    GET_DATA = 4,
    EXPORT_FRAME = 5
}
export declare function DecodesFrames<T extends Constructor<ConnectionInterface>>(Base: T): {
    new (...args: any[]): {
        /**
         * ...
         */
        decoding: boolean;
        /**
         * ...
         */
        decodeState: State;
        /**
         * ...
         */
        decodeBuffer: Buffer[];
        /**
         * ...
         */
        decodedParams: FrameParameters;
        /**
         * ...
         *
         * @returns
         */
        isDecoding(): boolean;
        /**
         * ...
         */
        decodeLength(): number;
        /**
         * ...
         *
         * @param chunk
         */
        onChunk(chunk: Buffer): void;
        /**
         * ...
         */
        handleDecode(): void;
        /**
         * Read 'n' bytes.
         *
         * @param n
         * @returns
         */
        read(n: number): Buffer | false;
        /**
         * Get frame head.
         */
        getHead(): State;
        /**
         * Get payload length (16 bits).
         */
        getPayloadLength16(): State;
        /**
         * Get payload length (64 bit).
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
         * Export a frame.
         */
        exportFrame(): State;
        server: import("./Server").Server;
        sock: import("stream").Duplex;
        onFrame(frame: import("./FrameInterface").FrameInterface): void;
        onPing(frame: import("./FrameInterface").FrameInterface): void;
        onPong(frame: import("./FrameInterface").FrameInterface): void;
        onClose(frame: import("./FrameInterface").FrameInterface): void;
        onMessage(message: import("./Message").Message): void;
        makeFrame(params: FrameParameters): import("./FrameInterface").FrameInterface;
        destroy(): void;
    };
} & T;
export default DecodesFrames;
