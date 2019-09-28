import AApplicationForm from "../../smart_framework/applicationForm/AApplicationForm";
import { FormField } from "../../smart_framework/applicationForm/RequestField";

interface VenicleData {
    kennzeichen: string;
    fahrgestellnummer: string;
}

export class VenicleRegistration extends AApplicationForm<VenicleData>{
    
    public applicationFormDescription: string = "Hier können Sie ihr neues KFZ Fahrzeug anmelden";

    public applicationFormTitle: string = "KFZ Fahrzeug anmelden";

    public validateDataType(data: any): data is VenicleData {
        let tData = data as VenicleData;
        return tData.kennzeichen !== undefined &&
            tData.fahrgestellnummer !== undefined;
    }

    public get requestFields(): FormField[] {
        return [
            {
                type: "text",
                id: "kennz",
                label: "Wunschkennzeichen"
            },
            {
                type: "text",
                id: "fgn",
                label: "Fahrgestellnummer des Fahrzeuges"
            }
        ];
    }

    public async validate(userData: VenicleData): Promise<{ [key: string]: string; }> {
        console.log("Fancy validation");
        return {};
    }

    public get collectionName(): string {
        return "venicle_requests";
    }

}