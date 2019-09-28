import { AApplicationForm } from "./AApplicationForm";
import User from "../user_management/User";
import { Db } from "mongodb";

export type ApplicationFormFactory = new (database: Db, fullFormId: string, user?: User) => AApplicationForm<any>;
export type ApplicationFormFactoryCollection = { [requestTypeName: string]: ApplicationFormFactory };

export class ApplicationFormCategory {

    private forms: ApplicationFormFactoryCollection;
    private _categoryName: string;
    private _categoryId: string;

    public get categoryName(): string { return this._categoryName; }
    public get categoryId(): string {return this._categoryId;}

    constructor(categoryId: string, categoryName: string = categoryId) {
        this._categoryId = categoryId;
        this._categoryName = categoryName;
        this.forms = {};
    }

    /**
     * Gibt alle Anträge dieser Kategorie zurück
     */
    public get applicationForms(): ApplicationFormFactoryCollection {
        return this.forms;
    }

    /**
     * Fügt der Kategorie einen neuen Antrag hinzu
     * @param requestTypeName Name des Antrags
     * @param requestFactory Konstruktorfunktion des Antrags
     */
    public addRequest(
        requestTypeName: string | ApplicationFormFactoryCollection,
        requestFactory?: ApplicationFormFactory
    ): void {

        if (typeof(requestTypeName) == "string") {
            if (this.forms[requestTypeName]) {
                throw new Error("Request with this name already created");
            }

            this.forms[requestTypeName] = requestFactory;
        }
        else {
            for (let key of Object.keys(requestTypeName)) {
                this.addRequest(key, requestTypeName[key]);
            }
        }
    }

    /**
     * Gibt den Antrag mit der ID der Kategorie zurück (falls vorhanden)
     * @param formId ID des Antrags
     */
    public getRequestFactory(formId: string) : ApplicationFormFactory {
        return this.forms[formId];
    }
}