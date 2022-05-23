import { Buffer } from "buffer";

import Message from "./Message";
import MessageType from "./MessageType";
import ConnectionInterface from "./ConnectionInterface";
import Opcode from "./Opcode";
import FrameInterface from "./FrameInterface";
import { generateMask } from "./functions";

type Constructor<T = {}> = new (...args: any[]) => T;

export function EncodesFrames<T extends Constructor<ConnectionInterface>>(
    Base: T
) {
    return class EncodesFrames extends Base {
        /**
         * ...
         */
        encoding: boolean = false;

        /**
         * ...
         */
        outgoingQueue: Message[] = [];

        /**
         * ...
         *
         * @returns
         */
        isEncoding() {
            return this.encoding;
        }

        /**
         * Set payload length (16 bit).
         * @returns
         */
        setPayloadLength16(data: Buffer): Buffer {
            const buffer = Buffer.alloc(2);
            buffer.writeUInt16BE(data.length);
            return buffer;
        }

        /**
         * Set payload length (64 bit).
         *
         * @returns
         */
        setPayloadLength64(data: Buffer): Buffer {
            const buffer = Buffer.alloc(8);
            buffer.writeUIntBE(data.length, 2, 6);
            return buffer;
        }

        /**
         * Encode a frame.
         *
         * @param frame
         * @returns
         */
        encodeFrame(frame: FrameInterface) {
            let head = Buffer.alloc(2);
            let mask = frame.getMask();
            let data = frame.getData();

            head[0] = frame.isFinal() ? 0x80 | frame.getOp() : frame.getOp();

            if (frame.rsv1) {
                head[0] |= 0x40;
            }

            if (frame.rsv2) {
                head[0] |= 0x20;
            }

            if (frame.rsv3) {
                head[0] |= 0x10;
            }

            let length: Buffer | null = null;

            if (!data) {
                head[1] = frame.isMasked() ? 0x80 | 0 : 0;
            } else if (data.length >= 65536) {
                length = this.setPayloadLength64(data);
                head[1] = frame.isMasked() ? 0x80 | 127 : 127;
            } else if (data.length >= 126) {
                length = this.setPayloadLength16(data);
                head[1] = frame.isMasked() ? 0x80 | 126 : 126;
            } else {
                head[1] = frame.isMasked() ? 0x80 | data.length : data.length;
            }

            if (frame.isMasked() && data) {
                mask = frame.getMask() ?? generateMask();

                for (let i = 0; i < data.length; i++) {
                    data[i] = data[i] ^ mask[i & 3];
                }
            }

            return Buffer.concat(
                [head, length, mask, data].filter(
                    (p): p is Buffer => p !== null
                )
            );
        }

        /**
         * Handle the encoding process.
         *
         * @returns
         */
        handleEncode() {
            if (this.encoding) return;

            this.encoding = true;

            while (this.outgoingQueue.length > 0) {
                const message = this.outgoingQueue.shift();

                if (!message) {
                    continue;
                }

                for (let frame of message.toFragments()) {
                    if (this.sock.writable) {
                        this.sock.write(this.encodeFrame(frame));
                    }
                }
            }

            this.encoding = false;
        }

        /**
         * Send a message.
         *
         * @param data
         */
        send(data: Buffer | string) {
            this.outgoingQueue.push(
                new Message(
                    data instanceof Buffer ? MessageType.BIN : MessageType.TXT,
                    Buffer.from(data)
                )
            );

            this.handleEncode();
        }

        /**
         * Send a ping frame.
         */
        ping(msg: Buffer | string = "") {
            const data = msg instanceof Buffer ? msg : Buffer.from(msg);

            if (this.sock.writable) {
                this.sock.write(
                    this.encodeFrame(this.makeFrame({ op: Opcode.PING, data }))
                );
            }
        }

        /**
         * Send a pong frame.
         *
         * @param msg
         */
        pong(msg: Buffer | string = "") {
            const data = msg instanceof Buffer ? msg : Buffer.from(msg);

            if (this.sock.writable) {
                this.sock.write(
                    this.encodeFrame(this.makeFrame({ op: Opcode.PONG, data }))
                );
            }
        }

        /**
         * Send a close frame.
         */
        close() {
            if (this.sock.writable) {
                this.sock.write(
                    this.encodeFrame(this.makeFrame({ op: Opcode.CLOSE }))
                );
            }
        }
    };
}

export default EncodesFrames;
