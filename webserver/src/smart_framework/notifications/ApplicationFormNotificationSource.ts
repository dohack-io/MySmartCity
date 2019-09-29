import { ANotificationSource } from "./ANotificationSource";
import { Notification } from "./Notification";
import UserFormsFinder from "../applicationForm/UserFormsFinder";
import { GeneralRequest } from "../applicationForm/AApplicationForm";
import { Db } from "mongodb";
import { LanguageManager } from "../i18n/LanguageManager";
import User from "../user_management/User";
import { ApplicationFormManager } from "../applicationForm/ApplicationFormManager";
import { IRequireApplicationFormManager } from "../applicationForm/IRequireApplicationFormManager";

export class ApplicationFormNotificationSource extends ANotificationSource implements IRequireApplicationFormManager {
    
    private manager: ApplicationFormManager;
    requireApplicationFormManager: boolean = true;

    private i18n: LanguageManager;

    constructor(user: User, db: Db) {
        super(user, db);
        this.i18n = new LanguageManager(db);
    }

    bindApplicationFormManager(manager: ApplicationFormManager): void {
        this.manager = manager;
    }

    public async getNotifications(): Promise<Notification[]> {
        let finder = new UserFormsFinder(this.db, this.user);

        let userForms = await finder.findData();
        let notificationPromises = [];

        for (let userForm of userForms) {
            notificationPromises.push(this.createNotification(userForm));
        }

        return Promise.all(notificationPromises);
    }

    private async createNotification(generalRequest: GeneralRequest): Promise<Notification> {
        let ids = generalRequest.requestType.split("/");
        
        let form = this.manager.getApplicationForm(this.db, ids[0], ids[1], this.user);
        let metadata = await form.getMetadata(this.user);

        return {
            title: await this.i18n.formattedText("form_notifytitle", this.user, [metadata.applicationFormTitle]),
            date: generalRequest.lastChange,
            content: await this.i18n.formattedText("form_summary", this.user, [generalRequest.state]),
            icon: "sap-icon://accelerated"
        }
    }


}