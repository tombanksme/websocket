export declare enum DecoderState {
    GET_HEAD = 0,
    GET_PAYLOAD_LENGTH_16 = 1,
    GET_PAYLOAD_LENGTH_64 = 2,
    GET_MASK = 3,
    GET_DATA = 4
}
export default DecoderState;
