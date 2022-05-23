import Opcode from "./Opcode";
import MessageType from "./MessageType";
import FrameInterface from "./FrameInterface";
import TerminateConnectionError from "./Errors/TerminateConnectionError";
import { Frame } from "./Frame";

export class Message {
	/**
	 *
	 */
	public MAX_FRAME_SIZE = 115712;

	/**
	 * Build the message.
	 *
	 * @param type
	 * @param data
	 */
	constructor(readonly type: MessageType, readonly data: Buffer) {
		// ...
	}

	/**
	 * Split message into fragments.
	 *
	 * @returns
	 */
	toFragments(): FrameInterface[] {
		let chunks: Buffer[] = [],
			i = 0,
			n = this.data.length;

		while (i < n) {
			chunks.push(this.data.slice(i, (i += this.MAX_FRAME_SIZE)));
		}

		let fragments: FrameInterface[] = [];

		for (let i = 0; i < chunks.length; i++) {
			fragments.push(
				new Frame({
					final: i == chunks.length - 1 ? true : false,
					op:
						i == 0
							? this.type == MessageType.TXT
								? Opcode.TXT
								: Opcode.BIN
							: Opcode.CONTINUE,
					data: chunks[i],
				})
			);
		}

		if (fragments.length == 0) {
			fragments.push(
				new Frame({
					final: true,
					op:
						i == 0
							? this.type == MessageType.TXT
								? Opcode.TXT
								: Opcode.BIN
							: Opcode.CONTINUE,
					data: null,
				})
			);
		}

		return fragments;
	}

	/**
	 * Build message from fragments.
	 *
	 * @param frames
	 * @returns
	 */
	static fromFragments(frames: FrameInterface[]): Message {
		const frame = frames.find((f) => f.getOp() !== Opcode.CONTINUE);

		if (!frame) {
			throw new TerminateConnectionError();
		}

		return new Message(
			frame.getOp() == Opcode.TXT ? MessageType.TXT : MessageType.BIN,
			Buffer.concat(
				frames
					.map((f) => f.getData())
					.filter((p): p is Buffer => p !== null)
			)
		);
	}
}

export default Message;
