import Frame from "./Frame";
import Message from "./Message";
export declare class Encoder {
    /**
     *
     */
    protected messages: Message[];
    /**
     *
     */
    protected controlFrames: Frame[];
    handle(): void;
    /**
     *
     * @param message
     */
    send(data: Message | Frame): void;
}
export default Encoder;
