/// <reference types="node" />
import { Buffer } from "buffer";
import { IncomingMessage } from "http";
/**
 * Generate a mask.
 *
 * @returns
 */
export declare function generateMask(): Buffer;
/**
 * Make upgrade header.
 *
 * @param req
 */
export declare function makeAcceptHeader(req: IncomingMessage): string;
