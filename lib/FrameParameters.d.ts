/// <reference types="node" />
export interface FrameParameters {
    final?: boolean;
    rsv1?: boolean;
    rsv2?: boolean;
    rsv3?: boolean;
    masked?: boolean;
    op: number;
    length?: number;
    mask?: Buffer | null;
    data?: Buffer | null;
}
export default FrameParameters;
