import Opcode, { isControl } from "../src/Opcode";

describe("Opcode", () => {
	it("isControl identifys control opcodes", () => {
		expect([
			isControl(Opcode.PING),
			isControl(Opcode.PONG),
			isControl(Opcode.CLOSE),
			isControl(Opcode.TXT),
			isControl(Opcode.BIN),
			isControl(Opcode.CONTINUE),
		]).toStrictEqual([true, true, true, false, false, false]);
	});
});
