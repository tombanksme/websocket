import Frame from "../src/Frame";
import Message from "../src/Message";
import MessageType from "../src/MessageType";
import Opcode from "../src/Opcode";

describe("Message", () => {
	it("instansiated from constructor", () => {
		const message = new Message(
			MessageType.TXT,
			Buffer.from("Hello World")
		);

		expect(message).not.toBeUndefined();
	});

	it("instansiated fromFragments", () => {
		const message = Message.fromFragments([
			new Frame({
				final: false,
				op: Opcode.TXT,
				data: Buffer.from("Hello "),
			}),
			new Frame({
				final: true,
				op: Opcode.CONTINUE,
				data: Buffer.from("World"),
			}),
		]);

		expect(message.type).toBe(MessageType.TXT);
		expect(message.data).toStrictEqual(Buffer.from("Hello World"));
	});

	it("can split into fragments", () => {
		const message = new Message(
			MessageType.TXT,
			Buffer.from("Hello World")
		);

		message.MAX_FRAME_SIZE = 5;

		const frames = message.toFragments();

		expect(frames.map((f) => f.getData())).toStrictEqual([
			Buffer.from("Hello"),
			Buffer.from(" Worl"),
			Buffer.from("d"),
		]);

		expect(frames.map((f) => f.getOp())).toStrictEqual([
			Opcode.TXT,
			Opcode.CONTINUE,
			Opcode.CONTINUE,
		]);

		expect(frames.map((f) => f.isFinal())).toStrictEqual([
			false,
			false,
			true,
		]);
	});
});
