import { ObjectID } from "bson";

export interface CreateRequestResponse {
    validate: ValidateResponse,
    requestId: ObjectID;
}

export type ValidateResponse = { [key: string]: string };