import { DbTarget } from "../DbTarget";
import { Db } from "mongodb";
import User from "../user_management/User";
import { CalendarItemResponse } from "./CalendarItemResponse";

export type CalendarSourceFactory = new (db: Db, user: User) => ACalendarSource;

export abstract class ACalendarSource extends DbTarget {

    private user: User;

    constructor(db: Db, user: User) {
        super(db);
        this.user = user;
    }

    public abstract addCalendarItems(response: CalendarItemResponse) : Promise<void>;

}