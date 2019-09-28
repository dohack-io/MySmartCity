import AApplicationForm from "./AApplicationForm";
import { type } from "os";
import { Collection } from "mongodb";
import User from "../user_management/User";

export type ApplicationFormFactory = new (user: User) => AApplicationForm<unknown>;
export type ApplicationFormFactoryCollection = { [requestTypeName: string]: ApplicationFormFactory };

export class ApplicationFormCategory {

    private requests: ApplicationFormFactoryCollection;
    private _categoryName: string;
    private _categoryId: string;

    public get categoryName(): string { return this._categoryName; }
    public get categoryId(): string {return this._categoryId;}

    constructor(categoryId: string, categoryName: string = categoryId) {
        this._categoryId = categoryId;
        this._categoryName = categoryName;
        this.requests = {};
    }

    public get applicationForms(): ApplicationFormFactoryCollection {
        return this.requests;
    }

    public addRequest(
        requestTypeName: string | ApplicationFormFactoryCollection,
        requestFactory?: ApplicationFormFactory
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

    public getRequestFactory(requestType: string) : ApplicationFormFactory {
        return this.requests[requestType];
    }
}