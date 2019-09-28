import { ANotificationSource } from "./ANotificationSource";
import { Db } from "mongodb";
import User from "../user_management/User";
import { Notification } from "./Notification";
import { ApplicationFormNotificationSource } from "./ApplicationFormNotificationSource";
import { flatArray } from "../Utils";

export type NotificationSourceFactory = new (user: User, db: Db) => ANotificationSource;

export class NotificationManager {

    private sources: NotificationSourceFactory[];

    public constructor() {
        this.sources = [];
    }

    public addSources(...sources: NotificationSourceFactory[]) : NotificationManager {
        sources.forEach(s=>this.sources.push(s));
        return this;
    }

    public integrateApplicationForms() : NotificationManager {
        this.addSources(ApplicationFormNotificationSource);
        return this;
    }

    public async getNotifications(user: User, db: Db) : Promise<Notification[]> {
        let sourcesInstances = this.sources.map(f => new f(user, db));
        let promises = sourcesInstances.map( s => s.getNotifications() );
        let notifications = flatArray( await Promise.all(promises) ); 

        notifications = notifications.sort((a,b) => b.date.getTime() - a.date.getTime());

        return notifications;
    }

}