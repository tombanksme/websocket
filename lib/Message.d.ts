/// <reference types="node" />
import MessageType from "./MessageType";
import FrameInterface from "./FrameInterface";
export declare class Message {
    readonly type: MessageType;
    readonly data: Buffer;
    /**
     *
     */
    MAX_FRAME_SIZE: number;
    /**
     * Build the message.
     *
     * @param type
     * @param data
     */
    constructor(type: MessageType, data: Buffer);
    /**
     * Split message into fragments.
     *
     * @returns
     */
    toFragments(): FrameInterface[];
    /**
     * Build message from fragments.
     *
     * @param frames
     * @returns
     */
    static fromFragments(frames: FrameInterface[]): Message;
}
export default Message;
