import { Db } from "mongodb";
import User from "../user_management/User";
import { Notification } from "./Notification";
import { DbTarget } from "../DbTarget";

export abstract class ANotificationSource extends DbTarget {

    protected user: User;

    constructor(user: User, db: Db) {
        super(db);
        this.user = user;
    }

    public abstract getNotifications(): Promise<Notification[]>;
 
}