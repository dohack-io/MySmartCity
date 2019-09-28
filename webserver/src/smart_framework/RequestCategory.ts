import ARequest from "./ARequest";
import { type } from "os";
import { Collection } from "mongodb";
import User from "./user_management/User";

export type RequestFactory = new (user: User) => ARequest<unknown>;
type RequestFactoryCollection = { [requestTypeName: string]: RequestFactory };

export class RequestCategory {

    private requests: RequestFactoryCollection;
    private _categoryName: string;

    public get categoryName(): string { return this._categoryName; }

    constructor(categoryName: string) {
        this._categoryName = categoryName;
        this.requests = {};
    }

    public addRequest(
        requestTypeName: string | RequestFactoryCollection,
        requestFactory?: RequestFactory
    ): void {

        if (typeof(requestTypeName) == "string") {
            if (this.requests[requestTypeName]) {
                throw new Error("Request with this name already created");
            }

            this.requests[requestTypeName] = requestFactory;
        }
        else {
            for (let key of Object.keys(requestTypeName)) {
                this.addRequest(key, requestTypeName[key]);
            }
        }
    }

    public hasRequestFactory(requestType: string) : boolean {
        return this.requests[requestType] !== undefined;
    }

    public getRequestFactory(requestType: string) : RequestFactory {
        return this.requests[requestType];
    }
}