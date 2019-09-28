import IServerRoute from "./IServerRoute";
import express from "express";
import RequestExtention from "../RequestExtention";
import CalendarManager from "../cityCalendar/CalendarManager";

export class CalendarItemRoute implements IServerRoute {

    private manager: CalendarManager;

    public constructor(manager: CalendarManager) {
        this.manager = manager;
    }
    
    mount(app: express.Express): void {
        app.get("/calendar", this.handle.bind(this));
    }

    public async handle(req: RequestExtention, res: express.Response) : Promise<void> {
        let events = await this.manager.getCalendarItems(req.database, req.user);
        res.send(events);
    }
}