import { ApplicationFormManager } from "./ApplicationFormManager";

export interface IRequireApplicationFormManager {
    
    requireApplicationFormManager: boolean;
    bindApplicationFormManager(manager: ApplicationFormManager) : void;

}

export function instanceOfRequireManager(object: any) : object is IRequireApplicationFormManager {
    return "requireApplicationFormManager" in object;
}