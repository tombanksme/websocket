import { Duplex } from "stream";

import EncodesFrames from "./EncodesFrames";
import DecodesFrames from "./DecodesFrames";
import Frame from "./Frame";
import FrameInterface from "./FrameInterface";
import ConnectionInterface from "./ConnectionInterface";
import Message from "./Message";
import TerminateConnectionError from "./Errors/TerminateConnectionError";
import { Opcode, isControl } from "./Opcode";
import MessageType from "./MessageType";

export class Connection extends EncodesFrames(
	DecodesFrames(ConnectionInterface)
) {
	/**
	 * Array of message fragments.
	 */
	protected fragments: FrameInterface[] = [];

	/**
	 * Validate an incoming frame.
	 *
	 * @param frame
	 * @returns
	 */
	validateFrame(frame: FrameInterface): boolean {
		if (frame.rsv1 || frame.rsv2 || frame.rsv3) {
			return false;
		}

		if (!frame.isMasked() || !frame.getMask()) {
			return false;
		}

		if (isControl(frame.getOp()) && !frame.isFinal()) {
			return false;
		}

		return true;
	}

	/**
	 * Handle incoming frame.
	 *
	 * @param frame
	 */
	onFrame(frame: Frame) {
		if (!this.validateFrame(frame)) {
			throw new TerminateConnectionError();
		}

		switch (frame.getOp()) {
			case Opcode.PING:
				this.onPing(frame);
				break;
			case Opcode.PONG:
				this.onPong(frame);
				break;
			case Opcode.CLOSE:
				this.onClose(frame);
				break;
			case Opcode.TXT:
			case Opcode.BIN:
			case Opcode.CONTINUE:
				this.fragments.push(frame);

				if (frame.isFinal()) {
					this.onMessage(Message.fromFragments(this.fragments));

					this.fragments = [];
				}
		}
	}

	/**
	 * Close the connection.
	 *
	 * @param frame
	 */
	onClose(frame: FrameInterface) {
		if (!this.sock.destroyed) {
			this.sock.destroy();
		}

		this.server.delConnection(this);
	}

	/**
	 * Destroy the connection.
	 *
	 * ...
	 */
	destroy() {
		if (!this.sock.destroyed) {
			this.close();
			this.sock.destroy();
		}

		this.server.delConnection(this);
	}
}

export default Connection;
