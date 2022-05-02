"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedConnection = void 0;
const Connection_1 = __importDefault(require("./Connection"));
class AdvancedConnection extends Connection_1.default {
    constructor() {
        super();
    }
    onFrame() {
        console.log("onFrame: AdvancedConnection");
    }
}
exports.AdvancedConnection = AdvancedConnection;
exports.default = AdvancedConnection;
