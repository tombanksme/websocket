"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerConfigurationError = void 0;
class ServerConfigurationError extends Error {
    constructor() {
        super("Server Configuration Error");
    }
}
exports.ServerConfigurationError = ServerConfigurationError;
exports.default = ServerConfigurationError;
