import { FormField } from "./RequestField";
import { Collection } from "mongodb";
import User from "../user_management/User";
import { ApplicationFormMetadata } from "./ApplicationFormMetadata";

type UserSubmitedData = { [key: string]: any };
type ValidateResponse = { [key: string]: string };

/**
 * Daten welcher jeder Antrag hat
 */
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
export default abstract class AApplicationForm<T> implements ApplicationFormMetadata {

    private collection: Collection;
    private user?: User;

    public requestType: string;

    constructor(formId: string, user?: User) {
        this.user = user;
        this.requestType = formId;
    }

    public bindCollection(collection: Collection) : void {
        this.collection = collection;
    }

    /**
     * Gibt die Felder die für diesen Antrag benötigt werden zurück
     */
    public abstract get requestFields(): FormField<T>[];

    /**
     * Daten des Nutzers
     * @param userData Daten, welche der Nutzer eingegeben hat
     */
    public abstract validate(userData: T): Promise<ValidateResponse>;

    /**
     * Prüft ob der Datentyp der Daten, welcher der Nutzer übermittelt hat zu den geforderten passt
     * @param data User Data
     */
    public abstract validateDataType(data: any): data is T;

    /**
     * Gibt den Namen für die Collection in der diese Anträge gespeichert werden zurück
     * null wenn die Standart Collection genutzt werden soll
     */
    public abstract get collectionName(): string | null;

    /**
     * Gibt eine Beschreibung des Antrags zurück
     */
    public abstract get applicationFormDescription(): string;

    /**
     * Gibt den Titel des Antrags zurück
     */
    public abstract get applicationFormTitle(): string;

    /**
     * Bearbeitet einen Nutzerantrag und speichert diesen bei Erfolg
     * @param data Daten, welche der Nutzer übermittelt hat
     */
    public async processUserData(data: UserSubmitedData): Promise<ValidateResponse | void> {
        // Userdaten entsprechen gefordertes Format
        if (this.validateDataType(data)) {
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

    /**
     * Erzeugt Daten, welche bei jedem Antrag mitgespeichert werden
     */
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
        await this.collection.insertOne(saveData);
    }

    /**
     * Vereint Daten
     * @param data Daten, welcher dieser Antrag speichert
     * @param general Daten, welche jeder Antrag enhält
     */
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