import { Buffer } from "buffer";
import { Duplex } from "stream";
import { Server as Http, IncomingMessage } from "http";

import Connection from "./Connection";
import { makeAcceptHeader } from "./functions";
import UnauthorizedUpgradeError from "./Errors/UnauthorizedUpgradeError";

export class Server {
	/**
	 * Array of active connections.
	 */
	protected connections: Connection[] = [];

	constructor(protected http: Http) {
		http.on("upgrade", (req, sock, head) => {
			try {
				this.upgrade(req, sock, head);
			} catch (e) {
				console.log(e);

				if (e instanceof UnauthorizedUpgradeError) {
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
	validateUpgrade(req: IncomingMessage): boolean {
		return true;
	}

	/**
	 * Authorize an upgrade.
	 *
	 * @returns
	 */
	authorizeUpgrade(req: IncomingMessage): boolean {
		return true;
	}

	/**
	 * Upgrade a connection.
	 *
	 * @param req
	 * @param sock
	 * @param head
	 */
	upgrade(req: IncomingMessage, sock: Duplex, head: Buffer) {
		if (!this.validateUpgrade(req)) {
			// ...
		}

		if (!this.authorizeUpgrade(req)) {
			throw new UnauthorizedUpgradeError();
		}

		sock.write(
			[
				"HTTP/1.1 101 Switching Protocols",
				"Upgrade: websocket",
				"Connection: Upgrade",
				`Sec-Websocket-Accept: ${makeAcceptHeader(req)}`,
			]
				.join("\r\n")
				.concat("\r\n\r\n")
		);

		this.addConnection(this.makeConnection(req, sock, head));
	}

	/**
	 * Get all connections.
	 *
	 * @returns
	 */
	getConnections(): Connection[] {
		// Potential Bug: This is probably passed as a reference, if someone where
		// to mutate the array, they could mutate the internal list of connections.

		return this.connections;
	}

	/**
	 * Add a connection.
	 *
	 * @param conn
	 */
	addConnection(conn: Connection) {
		this.connections.push(conn);
	}

	/**
	 * Delete a connection.
	 *
	 * @param conn
	 * @returns
	 */
	delConnection(conn: Connection): boolean {
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
	makeConnection(
		req: IncomingMessage,
		sock: Duplex,
		head: Buffer
	): Connection {
		return new Connection(this, sock);
	}
}

export default Server;
