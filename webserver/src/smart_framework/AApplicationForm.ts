import { FormField } from "./RequestField";
import { Collection } from "mongodb";
import User from "./user_management/User";

type UserSubmitedData = { [key: string]: any };
type ValidateResponse = { [key: string]: string };
type GeneralRequest = {
    id?: string;
    userId: string;
    requestType: string;
    created: Date;
    state: "OPEN" | "CLOSED" | "ACCEPTED";
}

/**
 * Stellt einen Antrag dar
 */
export default abstract class AApplicationForm<T> {

    private collection: Collection;
    private user: User;

    public requestType: string;

    constructor(user: User) {
        this.user = user;
    }

    public bindCollection(collection: Collection) : void {
        this.collection = collection;
    }

    /**
     * Gibt die Felder die für diesen Antrag benötigt werden zurück
     */
    public abstract get requestFields(): FormField[];

    /**
     * Daten des Nutzers
     * @param userData Daten, welche der Nutzer eingegeben hat
     */
    public abstract validate(userData: T): Promise<ValidateResponse>;
    public abstract get dataTypeValidator(): (data: any) => data is T;
    public abstract get collectionName(): string | null;

    public async processUserData(data: UserSubmitedData): Promise<ValidateResponse | void> {
        // Userdaten entsprechen gefordertes Format
        if (this.dataTypeValidator(data)) {
            let validateCallback = await this.validate(data);

            // Sind Daten valide?
            if (this.isValidValidateResponse(validateCallback)) {
                await this.saveToDatabase(data);
            }
            else {
                // Nein? Abbrechen. User muss Daten ändern.
                return validateCallback;
            }
        }
        else {
            throw new Error("UserData has not the right format!");
        }
    }

    private isValidValidateResponse(response: ValidateResponse): boolean {
        return Object.keys(response).length === 0;
    }

    private createGeneralRequest(): GeneralRequest {
        return {
            created: new Date(),
            requestType: this.requestType,
            state: "OPEN",
            userId: this.user.userId
        };
    }

    protected async saveToDatabase(data: T): Promise<void> {
        let saveData: T & GeneralRequest = this.extend(data, this.createGeneralRequest());
        await this.collection.insert(saveData);
    }

    private extend<T, GeneralRequest>(data: T, general: GeneralRequest): T & GeneralRequest {
        let merged: Partial<T & GeneralRequest> = {};

        for (const prop in data) {
            if (data.hasOwnProperty(prop)) {
                (merged as T)[prop] = data[prop];
            }
        }

        for (const prop in general) {
            if (general.hasOwnProperty(prop)) {
                (merged as GeneralRequest)[prop] = general[prop];
            }
        }
        return merged as T & GeneralRequest;
    }
}