import ARequest from "./ARequest";

export class RequestCategory {
    private requests: {
        [key: string]: new () => ARequest<any>
    }
}