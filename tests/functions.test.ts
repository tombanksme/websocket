import { generateMask } from "../src/functions";

describe("functions.ts", () => {
	it("generateMask returns 4 random bytes", () => {
		const masks = [generateMask(), generateMask()];

		expect(masks[0].equals(masks[1])).toBe(false);
		expect(masks.map((m) => m.length)).toStrictEqual([4, 4]);
	});
});
