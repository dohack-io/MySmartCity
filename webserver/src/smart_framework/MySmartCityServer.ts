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

export default class MySmartCityServer {

    private app: express.Express;
    private port: number;
    private mongoDbString: string;
    private mongoDbDatabase: string;

    public constructor(port: number, mongoDbString: string, mongoDbName: string) {
        this.mongoDbString = mongoDbString;
        this.mongoDbDatabase = mongoDbName;
        this.port = port;
        this.app = express();
        this.prepare();
    }

    private prepare(): void {
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
        this.app.use(SmartMiddleware(this.getDatabase.bind(this)));
    }

    public async getDatabase(): Promise<Db> {
        let client = new MongoClient(this.mongoDbString, {useNewUrlParser: true});
        await client.connect();
        return client.db(this.mongoDbDatabase);
    }

    public useUserManager(userManager: AUserManager) : MySmartCityServer {
        this.app.use(
            (new UserMiddleware(userManager)).handle
        );
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