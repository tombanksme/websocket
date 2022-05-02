// Source: https://github.com/Microsoft/TypeScript/issues/15942

import Opcode from "./Opcode";
import FrameParameters from "./FrameParameters";
import ConnectionInterface from "./ConnectionInterface";
import TerminateConnectionError from "./Errors/TerminateConnectionError";

type Constructor<T = {}> = new (...args: any[]) => T;

export enum State {
	GET_HEAD = 0,
	GET_PAYLOAD_LENGTH_16 = 1,
	GET_PAYLOAD_LENGTH_64 = 2,
	GET_MASK = 3,
	GET_DATA = 4,
	EXPORT_FRAME = 5,
}

export function DecodesFrames<T extends Constructor<ConnectionInterface>>(
	Base: T
) {
	return class DecodesFrames extends Base {
		/**
		 * ...
		 */
		decoding: boolean = false;

		/**
		 * ...
		 */
		decodeState: State = State.GET_HEAD;

		/**
		 * ...
		 */
		decodeBuffer: Buffer[] = [];

		/**
		 * ...
		 */
		decodedParams: FrameParameters = { op: Opcode.TXT };

		/**
		 * ...
		 *
		 * @returns
		 */
		isDecoding() {
			return this.decoding;
		}

		/**
		 * ...
		 */
		decodeLength(): number {
			return this.decodeBuffer.reduce(
				(length, buffer) => length + buffer.length,
				0
			);
		}

		/**
		 * ...
		 *
		 * @param chunk
		 */
		onChunk(chunk: Buffer) {
			this.decodeBuffer.push(chunk);

			this.handleDecode();
		}

		/**
		 * ...
		 */
		handleDecode() {
			if (this.decoding) return;

			this.decoding = true;

			while (this.decoding) {
				const func = [
					this.getHead,
					this.getPayloadLength16,
					this.getPayloadLength64,
					this.getMask,
					this.getData,
					this.exportFrame,
				][this.decodeState];

				try {
					this.decodeState = func.bind(this)();
				} catch (e) {
					if (e instanceof TerminateConnectionError) {
						this.decoding = false;
						this.destroy();
					} else {
						throw e;
					}
				}
			}
		}

		/**
		 * Read 'n' bytes.
		 *
		 * @param n
		 * @returns
		 */
		read(n: number): Buffer | false {
			if (n > this.decodeLength()) {
				this.decoding = false;
				return false;
			}

			const output = Buffer.alloc(n);

			while (n > 0) {
				const buf = this.decodeBuffer.shift();
				const offset = output.length - n;

				if (!buf) return false;

				buf.copy(output, offset, 0, n >= buf.length ? buf.length : n);

				if (n < buf.length) {
					this.decodeBuffer.unshift(buf.slice(n));
				}

				n -= buf.length;
			}

			return output;
		}

		/**
		 * Get frame head.
		 */
		getHead(): State {
			const buf = this.read(2);

			if (!buf) {
				return State.GET_HEAD;
			}

			this.decodedParams = {
				final: (buf[0] & 0x80) != 0,
				rsv1: (buf[0] & 0x40) != 0,
				rsv2: (buf[0] & 0x20) != 0,
				rsv3: (buf[0] & 0x10) != 0,
				masked: (buf[1] & 0x80) != 0,
				op: buf[0] & 0xf,
				length: buf[1] & ~0x80,
			};

			if (this.decodedParams.length == 126) {
				return State.GET_PAYLOAD_LENGTH_16;
			}

			if (this.decodedParams.length == 127) {
				return State.GET_PAYLOAD_LENGTH_64;
			}

			return this.decodedParams.masked ? State.GET_MASK : State.GET_DATA;
		}

		/**
		 * Get payload length (16 bits).
		 */
		getPayloadLength16(): State {
			const buf = this.read(2);

			if (!buf) {
				return State.GET_PAYLOAD_LENGTH_16;
			}

			this.decodedParams.length = buf.readUInt16BE();

			return this.decodedParams.masked ? State.GET_MASK : State.GET_DATA;
		}

		/**
		 * Get payload length (64 bit).
		 */
		getPayloadLength64(): State {
			const buf = this.read(8);

			if (!buf) {
				return State.GET_PAYLOAD_LENGTH_64;
			}

			const num = buf.readUInt32BE(0);

			if (num > Math.pow(2, 53 - 32) - 1) {
				throw new TerminateConnectionError();
			}

			this.decodedParams.length =
				num * Math.pow(2, 32) + buf.readUInt32BE(4);

			return this.decodedParams.masked ? State.GET_MASK : State.GET_DATA;
		}

		/**
		 * Get frame mask.
		 */
		getMask(): State {
			if (this.decodedParams.masked) {
				const buf = this.read(4);

				if (!buf) {
					return State.GET_MASK;
				}

				this.decodedParams.mask = buf;
			}

			return State.GET_DATA;
		}

		/**
		 * Get frame data.
		 */
		getData(): State {
			if (this.decodedParams.length) {
				const buf = this.read(this.decodedParams.length);

				if (!buf) {
					return State.GET_DATA;
				}

				if (this.decodedParams.masked && this.decodedParams.mask) {
					for (let i = 0; i < buf.length; i++) {
						buf[i] ^= this.decodedParams.mask[i & 3];
					}
				}

				this.decodedParams.data = buf;
			}

			return State.EXPORT_FRAME;
		}

		/**
		 * Export a frame.
		 */
		exportFrame(): State {
			this.onFrame(this.makeFrame(this.decodedParams));

			this.decodedParams = { op: Opcode.TXT };

			return State.GET_HEAD;
		}
	};
}

export default DecodesFrames;
