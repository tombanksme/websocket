"use strict";
// import { Buffer } from "buffer";
// import { Duplex } from "stream";
// import { createHash } from "crypto";
// import { createServer, IncomingMessage, Server } from "http";
// import ConnectionInterface from "./ConnectionInterface";
// import ServerParameters from "./ServerParameters";
// import ServerConfigurationError from "./Errors/ServerConfigurationError";
// import FrameInterface from "./FrameInterface";
// export abstract class ServerInterface {
// 	/**
// 	 * The HTTP server.
// 	 */
// 	protected server: Server;
// 	/**
// 	 * List of active connections.
// 	 */
// 	protected connections: ConnectionInterface[] = [];
// 	/**
// 	 * Build a server.
// 	 *
// 	 * @param params
// 	 */
// 	constructor(params: ServerParameters) {
// 		if (!params.port && !params.server) {
// 			throw new ServerConfigurationError();
// 		}
// 		if (params.server) {
// 			this.server = params.server;
// 			this.server.on("upgrade", (req, sock, head) => {
// 				this.upgrade(req, sock, head);
// 			});
// 			this.server.listen(params.port);
// 		} else {
// 			this.server = createServer((req, res) => {
// 				res.writeHead(200, { "Content-Type": "text/plain" });
// 				res.end("Hello World");
// 			});
// 			this.server.on("upgrade", (req, sock, head) => {
// 				this.upgrade(req, sock, head);
// 			});
// 			this.server.listen(params.port);
// 		}
// 	}
// 	/**
// 	 * Validate an upgrade.
// 	 *
// 	 * @param req
// 	 * @returns
// 	 */
// 	validateUpgrade(req: IncomingMessage): boolean {
// 		const key = req.headers["sec-websocket-key"];
// 		if (!key) {
// 			return false;
// 		}
// 		const version = req.headers["sec-websocket-version"];
// 		if (version != "12" && version != "13") {
// 			return false;
// 		}
// 		return true;
// 	}
// 	/**
// 	 * Authorize an upgrade.
// 	 *
// 	 * @param req
// 	 * @returns
// 	 */
// 	authorizeUpgrade(req: IncomingMessage): boolean {
// 		return true;
// 	}
// 	/**
// 	 * Upgrade a connection.
// 	 *
// 	 * @param req
// 	 * @param sock
// 	 * @param head
// 	 */
// 	upgrade(req: IncomingMessage, sock: Duplex, head: Buffer) {
// 		if (!this.validateUpgrade(req)) {
// 			return;
// 			// throw new CannotUpgradeException();
// 		}
// 		if (!this.authorizeUpgrade(req)) {
// 			return;
// 			// throw new UnauthorizedUpgrade();
// 		}
// 		const accept = createHash("sha1")
// 			.update(
// 				req.headers["sec-websocket-key"] +
// 					"258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
// 			)
// 			.digest("base64");
// 		sock.write(
// 			[
// 				"HTTP/1.1 101 Switching Protocols",
// 				"Upgrade: websocket",
// 				"Connection: Upgrade",
// 				`Sec-Websocket-Accept: ${accept}`,
// 			]
// 				.join("\r\n")
// 				.concat("\r\n\r\n")
// 		);
// 		this.connections.push(this.makeConnection(req, sock, head));
// 	}
// 	/**
// 	 * Make a connection.
// 	 *
// 	 * @param req
// 	 * @param sock
// 	 * @param head
// 	 */
// 	abstract makeConnection(
// 		req: IncomingMessage,
// 		sock: Duplex,
// 		head: Buffer
// 	): ConnectionInterface;
// }
// export default ServerInterface;
