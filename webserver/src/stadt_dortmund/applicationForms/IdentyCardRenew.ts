import { AApplicationForm } from "../../smart_framework/applicationForm/AApplicationForm";
import { FormField } from "../../smart_framework/applicationForm/RequestField";
import { ValidateResponse } from "../../smart_framework/applicationForm/CreateRequestResponse";
import moment = require("moment");
import { Db } from "mongodb";
import User from "../../smart_framework/user_management/User";
import { LanguageManager } from "../../smart_framework/i18n/LanguageManager";

// Daten Interface anlegen
interface IdentyCardData {
    cardId: string;
    expires: Date;
}

// Klasse erben
export class IdentyCardRenew extends AApplicationForm<IdentyCardData> {

    private minDate: moment.Moment;
    private maxDate: moment.Moment;

    public constructor(database: Db, formId: string, user: User) {
        super(database, formId, user);

        // Ausweis muss einen Monat vorher oder nachher ablaufen
        this.minDate = moment().subtract(4, "weeks");
        this.maxDate = moment().add(4, "weeks");
    }

    // Welche Felder hat der Antrag?
    public get requestFields(): FormField<IdentyCardData>[] {
        return [
            {
                id: "cardId",
                type: "text",
                label: "@form_pers/identyCardRenew_cardId"
            }
        ]
    }

    // Nutzerdaten validieren? (Sind Daten im Kontext gültig)
    public async validate(userData: IdentyCardData): Promise<ValidateResponse> {
        let validateErrors : ValidateResponse = {};
        let i18n = new LanguageManager(this.db);
        userData.expires = new Date(userData.expires);
        
        if (userData.expires < this.minDate.toDate() || userData.expires > this.maxDate.toDate()) {
            validateErrors["expires"] = await i18n.getText("form_pers/identyCardRenew_rangeError", this.user);
        }
        
        return validateErrors;
    }

    // Datentyp validieren (sind die Daten richtig übergeben?)
    public validateDataType(data: any): data is IdentyCardData {
        let useData = data as IdentyCardData;
        return useData.cardId !== undefined
            && useData.expires !== undefined;
    }
}