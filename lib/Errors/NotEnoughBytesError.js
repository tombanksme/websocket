"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotEnoughBytesError = void 0;
class NotEnoughBytesError extends Error {
    constructor(bytes) {
        super(`Cannot read ${bytes} bytes`);
    }
}
exports.NotEnoughBytesError = NotEnoughBytesError;
exports.default = NotEnoughBytesError;
