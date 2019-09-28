import { DbTarget } from "../DbTarget";
import { Db } from "mongodb";
import { CalendarItem } from "./CalendarItem";
import User from "../user_management/User";

export type CalendarSourceFactory = new (db: Db, user: User) => ACalendarSource;

export abstract class ACalendarSource extends DbTarget {

    private user: User;

    constructor(db: Db, user: User) {
        super(db);
        this.user = user;
    }

    public abstract getCalendarItems() : Promise<CalendarItem[]>;

}