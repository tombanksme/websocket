"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Connection"), exports);
__exportStar(require("./ConnectionInterface"), exports);
__exportStar(require("./DecodesFrames"), exports);
__exportStar(require("./EncodesFrames"), exports);
__exportStar(require("./Frame"), exports);
__exportStar(require("./FrameInterface"), exports);
__exportStar(require("./FrameParameters"), exports);
__exportStar(require("./functions"), exports);
__exportStar(require("./Message"), exports);
__exportStar(require("./MessageType"), exports);
__exportStar(require("./Opcode"), exports);
__exportStar(require("./Server"), exports);
__exportStar(require("./Errors/TerminateConnectionError"), exports);
__exportStar(require("./Errors/UnauthorizedUpgradeError"), exports);
// import { createServer } from "http";
// import Server from "./Server";
// const http = createServer((req, res) => {});
// const svr = new Server(http);
// http.listen(8080);
