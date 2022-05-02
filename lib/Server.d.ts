/// <reference types="node" />
import { Buffer } from "buffer";
import { Duplex } from "stream";
import { Server as Http, IncomingMessage } from "http";
import Connection from "./Connection";
export declare class Server {
    protected http: Http;
    /**
     * Array of active connections.
     */
    protected connections: Connection[];
    constructor(http: Http);
    /**
     * Validate an upgrade.
     *
     * @returns
     */
    validateUpgrade(req: IncomingMessage): boolean;
    /**
     * Authorize an upgrade.
     *
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
     * Get all connections.
     *
     * @returns
     */
    getConnections(): Connection[];
    /**
     * Add a connection.
     *
     * @param conn
     */
    addConnection(conn: Connection): void;
    /**
     * Delete a connection.
     *
     * @param conn
     * @returns
     */
    delConnection(conn: Connection): boolean;
    /**
     * Make a connection.
     *
     * @param req
     * @param sock
     * @param head
     */
    makeConnection(req: IncomingMessage, sock: Duplex, head: Buffer): Connection;
}
export default Server;
