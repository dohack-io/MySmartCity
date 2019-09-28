import { ApplicationFormManager } from "./applicationForm/ApplicationFormManager";
import express from "express";
import { ApplicationFormsRoute } from "./server/ApplicationFormsRoute";
import cors from "cors";

export default class MySmartCityServer {

    private app: express.Express;
    private port: number;

    public constructor(port: number) {
        this.port = port;
        this.app = express();
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