import IServerRoute from "./IServerRoute";
import express from "express";
import RequestExtention from "../RequestExtention";
import { NotificationManager } from "../notifications/NotificationManager";

export class NotificationsRoute implements IServerRoute {

    private notificationManager: NotificationManager;

    constructor(notificationManager: NotificationManager) {
        this.notificationManager = notificationManager;
    }
    
    mount(app: express.Express): void {
        app.get("/notifications", this.handle.bind(this));
    }

    public async handle(req: RequestExtention, res: express.Response) : Promise<void> {
        let user = req.user;
        if (user == undefined) {
            res.status(401)
                .send("Not logged in");
        }

        res.send(
            await this.notificationManager.getNotifications(user, req.database)
        );
    }

}