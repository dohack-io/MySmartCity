import { AApplicationForm, GeneralRequest } from "../../smart_framework/applicationForm/AApplicationForm";
import { FormField } from "../../smart_framework/applicationForm/RequestField";
import { CalendarItem } from "../../smart_framework/cityCalendar/CalendarItem";
import moment = require("moment");
import { ACalendarSource } from "../../smart_framework/cityCalendar/ACalendarSource";
import { CalendarItemResponse } from "../../smart_framework/cityCalendar/CalendarItemResponse";

interface BulkTrashData {
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
                label: "Movement Date"
            },
            {
                type: "text",
                id: "street",
                label: "Street"
            },
            {
                type: "text",
                id: "number",
                label: "Home Number"
            },
            {
                type: "number",
                id: "postalCode",
                label: "Postalcode"
            },
            {
                type: "text",
                id: "city",
                label: "City"
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

export class BulkTrashCalendarItems extends ACalendarSource {
    
    public async addCalendarItems(response: CalendarItemResponse): Promise<void> {
        let collection = await this.getCollection<BulkTrashData & GeneralRequest>(AApplicationForm.COLLECTION_NAME, false);

        let items = await collection.find({
            attachedEvent: {
                $ne: null
            }
        })
        .toArray();

        response.addItems("My Application Requests", items.map(e => e.attachedEvent));
    }

}