import ARequest from "./ARequest";

export class RequestManager {
    private requests: {
        [key: string]: new () => ARequest<any>
    }
}