/// <reference types="node" />
import { Server } from "http";
export interface ServerParameters {
    port?: number;
    server?: Server;
}
export default ServerParameters;
