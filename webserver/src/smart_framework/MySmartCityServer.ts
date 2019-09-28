import { ApplicationFormManager } from "./applicationForm/ApplicationFormManager";
import express from "express";
import { ApplicationFormsRoute } from "./server/ApplicationFormsRoute";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import AUserManager from "./user_management/AUserManager";
import { UserMiddleware } from "./user_management/UserMiddleware";
import { Db, MongoClient } from "mongodb";
import SmartMiddleware from "./server/SmartMiddleware";
import RequestExtention from "./RequestExtention";
import { NotificationManager } from "./notifications/NotificationManager";
import { NotificationsRoute } from "./server/NotificationsRoute";

export default class MySmartCityServer {

    private app: express.Express;
    private port: number;
    private mongoDbString: string;
    private dbName: string;

    public constructor(port: number, mongoDbString: string, mongoDbName: string) {
        this.mongoDbString = mongoDbString;
        this.dbName = mongoDbName;
        this.port = port;
        this.app = express();
        this.prepare();
    }

    private prepare(): void {
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
        this.app.use(SmartMiddleware(this.mongoDbString, this.dbName));
    }

    public useNotification(notificationManager: NotificationManager) : MySmartCityServer {
        let route = new NotificationsRoute(notificationManager);
        route.mount(this.app);
        return this;
    }

    public useUserManager(userManager: AUserManager) : MySmartCityServer {
        this.app.use(
            (new UserMiddleware(userManager)).handle
        );
        this.app.get("/me", (req: RequestExtention, res)=>{
            res.send(req.user);
        })
        return this;
    }

    public useCors(): MySmartCityServer {
        this.app.use(cors());
        return this;
    }

    public start() : MySmartCityServer {
        this.app.listen(this.port, ()=>
            console.log(`Serving MySmartCity Server at Port ${this.port}`)
        );
        return this;
    }

    public useApplicationForms(manager: ApplicationFormManager) : MySmartCityServer {
        let route = new ApplicationFormsRoute(manager);
        route.mount(this.app);
        return this
    }

}