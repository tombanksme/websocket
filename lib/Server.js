"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const Connection_1 = __importDefault(require("./Connection"));
const functions_1 = require("./functions");
const UnauthorizedUpgradeError_1 = __importDefault(require("./Errors/UnauthorizedUpgradeError"));
class Server {
    constructor(http) {
        this.http = http;
        /**
         * Array of active connections.
         */
        this.connections = [];
        http.on("upgrade", (req, sock, head) => {
            try {
                this.upgrade(req, sock, head);
            }
            catch (e) {
                console.log(e);
                if (e instanceof UnauthorizedUpgradeError_1.default) {
                    // Write http response.
                }
            }
        });
    }
    /**
     * Validate an upgrade.
     *
     * @returns
     */
    validateUpgrade(req) {
        return true;
    }
    /**
     * Authorize an upgrade.
     *
     * @returns
     */
    authorizeUpgrade(req) {
        return true;
    }
    /**
     * Upgrade a connection.
     *
     * @param req
     * @param sock
     * @param head
     */
    upgrade(req, sock, head) {
        if (!this.validateUpgrade(req)) {
            // ...
        }
        if (!this.authorizeUpgrade(req)) {
            throw new UnauthorizedUpgradeError_1.default();
        }
        sock.write([
            "HTTP/1.1 101 Switching Protocols",
            "Upgrade: websocket",
            "Connection: Upgrade",
            `Sec-Websocket-Accept: ${(0, functions_1.makeAcceptHeader)(req)}`,
        ]
            .join("\r\n")
            .concat("\r\n\r\n"));
        this.addConnection(this.makeConnection(req, sock, head));
    }
    /**
     * Get all connections.
     *
     * @returns
     */
    getConnections() {
        // Potential Bug: This is probably passed as a reference, if someone where
        // to mutate the array, they could mutate the internal list of connections.
        return this.connections;
    }
    /**
     * Add a connection.
     *
     * @param conn
     */
    addConnection(conn) {
        this.connections.push(conn);
    }
    /**
     * Delete a connection.
     *
     * @param conn
     * @returns
     */
    delConnection(conn) {
        const idx = this.connections.findIndex((c) => c == conn);
        if (idx >= 0) {
            return this.connections.splice(idx, 1).length == 1;
        }
        return false;
    }
    /**
     * Make a connection.
     *
     * @param req
     * @param sock
     * @param head
     */
    makeConnection(req, sock, head) {
        return new Connection_1.default(this, sock);
    }
}
exports.Server = Server;
exports.default = Server;
