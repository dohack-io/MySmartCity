import { ObjectID } from "bson";

/**
 * Antwort auf Submit Form
 */
export interface CreateRequestResponse {
    validate: ValidateResponse,
    requestId: ObjectID;
}

/**
 * Validierungsfehler. 
 * Key = FieldId
 * String = Error Description
 */
export type ValidateResponse = { [key: string]: string };