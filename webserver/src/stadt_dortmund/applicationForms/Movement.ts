import { AApplicationForm } from "../../smart_framework/applicationForm/AApplicationForm";
import { FormField } from "../../smart_framework/applicationForm/RequestField";

interface MovementData {
    street: string;
    number: string;
    postalCode: number;
    city: string;
    date: Date;
}

export class Movement extends AApplicationForm<MovementData> {
    
    public get requestFields(): FormField<MovementData>[] {
        return [
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
            },
            {
                type: "date",
                id: "date",
                min: new Date(),
                label: "Movement Date"
            }
        ]
    }    

    public async validate(userData: MovementData): Promise<{ [key: string]: string; }> {
        let response: { [key: string]: string; } = {};
        if (userData.date < new Date()) {
            response["date"] = "Date must be larger then current date";
        }
        return response;
    }
    
    public validateDataType(data: any): data is MovementData {
        let tData = data as MovementData;
        tData.date = new Date(data.date);

        return tData.city !== undefined 
            && tData.date !== undefined
            && tData.number !== undefined
            && tData.postalCode !== undefined
            && tData.street !== undefined;
    }
}