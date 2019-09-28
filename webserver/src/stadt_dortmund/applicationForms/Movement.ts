import AApplicationForm from "../../smart_framework/applicationForm/AApplicationForm";
import { FormField } from "../../smart_framework/applicationForm/RequestField";

interface MovementData {
    street: string;
    number: string;
    postalCode: number;
    city: string;
    date: Date;
}

export class Movement extends AApplicationForm<MovementData> {
    
    public get requestFields(): FormField[] {
        return [
            {
                type: "text",
                id: "street",
                label: "Straße"
            },
            {
                type: "text",
                id: "hnr",
                label: "Hausnummer"
            },
            {
                type: "number",
                id: "postalcode",
                label: "PLZ"
            },
            {
                type: "text",
                id: "city",
                label: "Stadt"
            },
            {
                type: "dateTime",
                id: "date",
                min: new Date(),
                label: "Umzugsdatum"
            }
        ]
    }    

    public async validate(userData: MovementData): Promise<{ [key: string]: string; }> {
        return {};
    }
    public validateDataType(data: any): data is MovementData {
        let tData = data as MovementData;
        return tData.city !== undefined 
            && tData.date !== undefined
            && tData.number !== undefined
            && tData.postalCode !== undefined
            && tData.street !== undefined;
    }

    public collectionName: string = "movement_requests";
    public applicationFormDescription = "Umziehen";
    public applicationFormTitle = "Umzug melden";
}