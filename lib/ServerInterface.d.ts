/// <reference types="node" />
import { Buffer } from "buffer";
import { Duplex } from "stream";
import { IncomingMessage, Server } from "http";
import ConnectionInterface from "./ConnectionInterface";
import ServerParameters from "./ServerParameters";
export declare abstract class ServerInterface {
    /**
     * The HTTP server.
     */
    protected server: Server;
    /**
     * List of active connections.
     */
    protected connections: ConnectionInterface[];
    /**
     * Build a server.
     *
     * @param params
     */
    constructor(params: ServerParameters);
    /**
     * Validate an upgrade.
     *
     * @param req
     * @returns
     */
    validateUpgrade(req: IncomingMessage): boolean;
    /**
     * Authorize an upgrade.
     *
     * @param req
     * @returns
     */
    authorizeUpgrade(req: IncomingMessage): boolean;
    /**
     * Upgrade a connection.
     *
     * @param req
     * @param sock
     * @param head
     */
    upgrade(req: IncomingMessage, sock: Duplex, head: Buffer): void;
    /**
     * Make a connection.
     *
     * @param req
     * @param sock
     * @param head
     */
    abstract makeConnection(req: IncomingMessage, sock: Duplex, head: Buffer): ConnectionInterface;
}
export default ServerInterface;
