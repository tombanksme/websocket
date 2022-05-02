"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAcceptHeader = exports.generateMask = void 0;
const crypto_1 = require("crypto");
/**
 * Generate a mask.
 *
 * @returns
 */
function generateMask() {
    return (0, crypto_1.randomBytes)(4);
}
exports.generateMask = generateMask;
/**
 * Make upgrade header.
 *
 * @param req
 */
function makeAcceptHeader(req) {
    return (0, crypto_1.createHash)("sha1")
        .update(req.headers["sec-websocket-key"] +
        "258EAFA5-E914-47DA-95CA-C5AB0DC85B11")
        .digest("base64");
}
exports.makeAcceptHeader = makeAcceptHeader;
