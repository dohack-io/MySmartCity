import IServerRoute from "./IServerRoute";
import express from "express";
import RequestExtention from "../RequestExtention";
import CalendarManager from "../cityCalendar/CalendarManager";
import { checkUser } from "../Utils";
import { CalendarItem } from "../cityCalendar/CalendarItem";
import { CalendarCategoryItem } from "../cityCalendar/CalendarItemResponse";

export class CalendarItemRoute implements IServerRoute {

    private manager: CalendarManager;

    public constructor(manager: CalendarManager) {
        this.manager = manager;
    }

    mount(app: express.Express): void {
        app.get("/calendar", this.handle.bind(this));
    }

    public async handle(req: RequestExtention, res: express.Response): Promise<void> {
        let user = checkUser(req, res);

        let calendarItemsResponse = await this.manager.getCalendarItems(req.database, user);
        let items = calendarItemsResponse.items;

        // Wenn nur das nächste Item geladen werden soll
        if (req.query["next"]) {
            res.send(this.getNextItems(items, req.query["next"]));
        }
        else {
            res.send(items);
        }
    }

    private getNextItems(items: CalendarCategoryItem[], count: number): CalendarItem[] {
        let allItems: CalendarItem[] = [];

        items.forEach(c => allItems = allItems.concat(c.events));

        allItems = allItems.sort((a,b)=>a.start.getTime() - b.start.getTime());

        return allItems.slice(0, count);
    }
}