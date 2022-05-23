export * from "./Connection";
export * from "./ConnectionInterface";
export * from "./DecodesFrames";
export * from "./EncodesFrames";
export * from "./Frame";
export * from "./FrameInterface";
export * from "./FrameParameters";
export * from "./functions";
export * from "./Message";
export * from "./MessageType";
export * from "./Opcode";
export * from "./Server";

export * from "./Errors/TerminateConnectionError";
export * from "./Errors/UnauthorizedUpgradeError";

// import { createServer } from "http";
// import Server from "./Server";

// const http = createServer((req, res) => {});

// const svr = new Server(http);

// http.listen(8080);

import { createServer, IncomingMessage } from "http";
import Server from "./Server";
import Connection from "./Connection";
import { Duplex } from "stream";
import Message from "./Message";
import MessageType from "./MessageType";

class CustomConnection extends Connection {
	onMessage(message: Message): void {
		this.send(
			message.type == MessageType.TXT
				? message.data.toString()
				: message.data
		);
	}
}

class CustomServer extends Server {
	makeConnection(
		req: IncomingMessage,
		sock: Duplex,
		head: Buffer
	): Connection {
		return new CustomConnection(this, sock);
	}
}

const http = createServer();
const svr = new CustomServer(http);
http.listen(8080);
