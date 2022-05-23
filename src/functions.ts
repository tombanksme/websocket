import { Buffer } from "buffer";
import { createHash, randomBytes } from "crypto";
import { IncomingMessage } from "http";

/**
 * Generate a mask.
 *
 * @returns
 */
export function generateMask(): Buffer {
    return randomBytes(4);
}

/**
 * Make upgrade header.
 *
 * @param req
 */
export function makeAcceptHeader(req: IncomingMessage): string {
    return createHash("sha1")
        .update(
            req.headers["sec-websocket-key"] +
                "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
        )
        .digest("base64");
}
