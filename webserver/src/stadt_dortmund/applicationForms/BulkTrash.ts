import { AApplicationForm, GeneralRequest } from "../../smart_framework/applicationForm/AApplicationForm";
import { FormField } from "../../smart_framework/applicationForm/RequestField";
import { CalendarItem } from "../../smart_framework/cityCalendar/CalendarItem";
import moment = require("moment");

export interface BulkTrashData {
    date: Date;
    street: string;
    number: string;
    postalCode: number;
    city: string;
    attachedEvent: CalendarItem;
}

export class BulkTrash extends AApplicationForm<BulkTrashData> {
    public get requestFields(): FormField<BulkTrashData>[] {
        return [
            {
                type: "dateTime",
                id: "date",
                min: new Date(),
                label: "@form_pers/bulkTrash_date"
            },
            {
                type: "text",
                id: "street",
                label: "@form_universal_street"
            },
            {
                type: "text",
                id: "number",
                label: "@form_universal_number"
            },
            {
                type: "number",
                id: "postalCode",
                label: "@form_universal_postalCode"
            },
            {
                type: "text",
                id: "city",
                label: "@form_universal_city"
            }
        ]
    }    

    public async validate(userData: BulkTrashData): Promise<{ [key: string]: string; }> {
        let response: { [key: string]: string; } = {};
        if (userData.date < new Date()) {
            response["date"] = "Date must be larger then current date";
        }
        return response;
    }
    
    public validateDataType(data: any): data is BulkTrashData {
        let tData = data as BulkTrashData;
        tData.date = new Date(data.date);

        return tData.city !== undefined 
            && tData.date !== undefined
            && tData.number !== undefined
            && tData.postalCode !== undefined
            && tData.street !== undefined;
    }

    protected async saveToDatabase(data: BulkTrashData) : Promise<void> {
        data.attachedEvent = {
            color: "#550000",
            description: "Your Bulk Trash Appointment",
            start: data.date,
            end: moment(data.date).add("1", "hour").toDate(),
            tenative: true,
            title: "Bulk Trash"
        };
        await super.saveToDatabase(data);
    }
}