import { FormField } from "./RequestField";
import { Collection, Db } from "mongodb";
import User from "../user_management/User";
import { ApplicationFormMetadata } from "./ApplicationFormMetadata";
import { DbTarget } from "../DbTarget";
import { LanguageManager, Language, Langable } from "../i18n/LanguageManager";

type UserSubmitedData = { [key: string]: any };
type ValidateResponse = { [key: string]: string };

/**
 * Daten welcher jeder Antrag hat
 */
export type GeneralRequest = {
    id?: string;
    userId: string;
    requestType: string;
    created: Date;
    lastChange: Date;
    state: "Open" | "Closed" | "Acceped" | "In Progress";
}

/**
 * Stellt einen Antrag dar
 */
export abstract class AApplicationForm<T> extends DbTarget {

    public static readonly COLLECTION_NAME = "Requests";

    private user: User;

    public formId: string;

    constructor(database: Db, formId: string, user: User) {
        super(database);
        this.user = user;
        this.formId = formId;
    }

    /**
     * Gibt die Metadaten zurück.
     * Standartmäßig wird aus den i18n die Felder: 
     * form_{categoryId}/{formId}_description und form_{categoryId}/{formid}_title genommen
     * @param lang Sprache für die Metadaten
     */
    public async getMetadata(lang: Language | Langable): Promise<ApplicationFormMetadata> {
        let i18n = new LanguageManager(this.db);
        return {
            applicationFormDescription: await i18n.getText("form_" + this.formId + "_description", lang),
            applicationFormTitle: await i18n.getText("form_" + this.formId + "_title", lang)
        };
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

            return validateCallback;
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
            requestType: this.formId,
            state: "Open",
            lastChange: new Date(),
            userId: this.user.userId
        };
    }

    protected async saveToDatabase(data: T): Promise<void> {
        let saveData: T & GeneralRequest = this.extend(data, this.createGeneralRequest());
        let collection = await this.getCollection<T & GeneralRequest>(AApplicationForm.COLLECTION_NAME);
        await collection.insertOne(saveData);
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