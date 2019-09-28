import { CalendarSourceFactory, ACalendarSource } from "./ACalendarSource";
import { Db } from "mongodb";
import User from "../user_management/User";
import { CalendarItemResponse } from "./CalendarItemResponse";

export default class CalendarManager {
    
    private factories: CalendarSourceFactory[];

    constructor() {
        this.factories = [];
    }

    public addCalendarSource(factory: CalendarSourceFactory) : CalendarManager {
        this.factories.push(factory);
        return this;
    }

    public async getCalendarItems(db: Db, user: User): Promise<CalendarItemResponse> {
        let response = new CalendarItemResponse();
        let calendarItemsPromises = [];

        for (let source of this.getCalendarSources(db, user)) {
            calendarItemsPromises.push( source.addCalendarItems(response) );
        }

        await Promise.all(calendarItemsPromises);

        return response;
    }

    public getCalendarSources(db: Db, user: User) : ACalendarSource[] {
        let items = [];

        for (let sourceFactory of this.factories) {
            items.push(new sourceFactory(db, user));
        }

        return items;
    }

}