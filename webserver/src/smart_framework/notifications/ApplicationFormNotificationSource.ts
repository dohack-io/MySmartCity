import { ANotificationSource } from "./ANotificationSource";
import {Notification} from "./Notification";
import UserFormsFinder from "../applicationForm/UserFormsFinder";
import { GeneralRequest } from "../applicationForm/AApplicationForm";
import { Db } from "mongodb";
import { LanguageManager } from "../i18n/LanguageManager";
import User from "../user_management/User";

export class ApplicationFormNotificationSource extends ANotificationSource {

    private i18n: LanguageManager;

    constructor(user: User, db: Db) {
        super(user, db);
        this.i18n = new LanguageManager(db);
    }
    
    public async getNotifications(): Promise<Notification[]> {
        let finder = new UserFormsFinder(this.db, this.user);

        let userForms = await finder.findData();
        let notificationPromises = [];

        for (let userForm of userForms) {
            notificationPromises.push( this.createNotification(userForm) );
        }

        return Promise.all(notificationPromises);
    }

    private async createNotification(generalRequest: GeneralRequest) : Promise<Notification> {
        return {
            title: await this.i18n.getText("form_notifytitle", this.user),
            date: generalRequest.lastChange,
            content: await this.i18n.formattedText("form_summary", this.user, [generalRequest.state]),
            icon: "sap-icon://accelerated"
        }
    }


}