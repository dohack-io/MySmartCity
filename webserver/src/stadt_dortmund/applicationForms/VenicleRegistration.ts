import { AApplicationForm } from "../../smart_framework/applicationForm/AApplicationForm";
import { FormField } from "../../smart_framework/applicationForm/RequestField";

interface VenicleData {
    kennz: string;
    fgn: string;
}

export class VenicleRegistration extends AApplicationForm<VenicleData>{

    public validateDataType(data: any): data is VenicleData {
        let tData = data as VenicleData;
        return tData.kennz !== undefined &&
            tData.fgn !== undefined;
    }

    public get requestFields(): FormField<VenicleData>[] {
        return [
            {
                type: "text",
                id: "kennz",
                label: "@form_kfz/registerVenicle_kennz"
            },
            {
                type: "text",
                id: "fgn",
                label: "@form_kfz/registerVenicle_fgn"
            }
        ];
    }

    public async validate(userData: VenicleData): Promise<{ [key: string]: string; }> {
        return {};
    }
}