/// <reference types="node" />
export interface FrameParametersStrict {
    final: boolean;
    rsv1: boolean;
    rsv2: boolean;
    rsv3: boolean;
    masked: boolean;
    op: number;
    length?: number;
    mask: Buffer | null;
    data: Buffer | null;
}
export default FrameParametersStrict;
