"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerInterface = void 0;
const crypto_1 = require("crypto");
const http_1 = require("http");
const ServerConfigurationError_1 = __importDefault(require("./Errors/ServerConfigurationError"));
class ServerInterface {
    /**
     * Build a server.
     *
     * @param params
     */
    constructor(params) {
        /**
         * List of active connections.
         */
        this.connections = [];
        if (!params.port && !params.server) {
            throw new ServerConfigurationError_1.default();
        }
        if (params.server) {
            this.server = params.server;
            this.server.on("upgrade", (req, sock, head) => {
                this.upgrade(req, sock, head);
            });
            this.server.listen(params.port);
        }
        else {
            this.server = (0, http_1.createServer)((req, res) => {
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("Hello World");
            });
            this.server.on("upgrade", (req, sock, head) => {
                this.upgrade(req, sock, head);
            });
            this.server.listen(params.port);
        }
    }
    /**
     * Validate an upgrade.
     *
     * @param req
     * @returns
     */
    validateUpgrade(req) {
        const key = req.headers["sec-websocket-key"];
        if (!key) {
            return false;
        }
        const version = req.headers["sec-websocket-version"];
        if (version != "12" && version != "13") {
            return false;
        }
        return true;
    }
    /**
     * Authorize an upgrade.
     *
     * @param req
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
            return;
            // throw new CannotUpgradeException();
        }
        if (!this.authorizeUpgrade(req)) {
            return;
            // throw new UnauthorizedUpgrade();
        }
        const accept = (0, crypto_1.createHash)("sha1")
            .update(req.headers["sec-websocket-key"] +
            "258EAFA5-E914-47DA-95CA-C5AB0DC85B11")
            .digest("base64");
        sock.write([
            "HTTP/1.1 101 Switching Protocols",
            "Upgrade: websocket",
            "Connection: Upgrade",
            `Sec-Websocket-Accept: ${accept}`,
        ]
            .join("\r\n")
            .concat("\r\n\r\n"));
        this.connections.push(this.makeConnection(req, sock, head));
    }
}
exports.ServerInterface = ServerInterface;
exports.default = ServerInterface;
