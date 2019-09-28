import IServerRoute from "./IServerRoute";
import express from "express";
import RequestExtention from "../RequestExtention";
import { NotificationManager } from "../notifications/NotificationManager";
import { checkUser } from "../Utils";

export class NotificationsRoute implements IServerRoute {

    private notificationManager: NotificationManager;

    constructor(notificationManager: NotificationManager) {
        this.notificationManager = notificationManager;
    }
    
    mount(app: express.Express): void {
        app.get("/notifications", this.handle.bind(this));
    }

    public async handle(req: RequestExtention, res: express.Response) : Promise<void> {
        let user = checkUser(req, res);

        res.send(
            await this.notificationManager.getNotifications(user, req.database)
        );
    }

}