import { ApplicationFormManager } from "./applicationForm/ApplicationFormManager";
import express from "express";
import { ApplicationFormsRoute } from "./server/ApplicationFormsRoute";

export default class MySmartCityServer {

    private app: express.Express;
    private port: number;

    public constructor(port: number) {
        this.port = port;
        this.app = express();
    }

    public start() {
        this.app.listen(this.port, ()=>
            console.log(`Serving MySmartCity Server at Port ${this.port}`)
        );
    }

    public useApplicationForms(manager: ApplicationFormManager) : void {
        let route = new ApplicationFormsRoute(manager);
        route.mount(this.app);
    }

}