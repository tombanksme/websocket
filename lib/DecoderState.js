"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecoderState = void 0;
var DecoderState;
(function (DecoderState) {
    DecoderState[DecoderState["GET_HEAD"] = 0] = "GET_HEAD";
    DecoderState[DecoderState["GET_PAYLOAD_LENGTH_16"] = 1] = "GET_PAYLOAD_LENGTH_16";
    DecoderState[DecoderState["GET_PAYLOAD_LENGTH_64"] = 2] = "GET_PAYLOAD_LENGTH_64";
    DecoderState[DecoderState["GET_MASK"] = 3] = "GET_MASK";
    DecoderState[DecoderState["GET_DATA"] = 4] = "GET_DATA";
})(DecoderState = exports.DecoderState || (exports.DecoderState = {}));
exports.default = DecoderState;
