import IServerRoute from "./IServerRoute";
import express from "express";
import { ApplicationFormManager } from "../applicationForm/ApplicationFormManager";
import { ApplicationFormRestMetadata } from "../applicationForm/ApplicationFormMetadata";

export type ApplicationFormOverview = {
    [categoryName: string] : ApplicationFormRestMetadata[]
};

export class ApplicationFormsRoute implements IServerRoute {

    private manager: ApplicationFormManager;

    constructor(manager: ApplicationFormManager) {
        this.manager = manager;
    }

    mount(app: express.Express): void {
        app.get("/applicationForms/list", this.handleOverview.bind(this));
        app.get("/applicationForms/{category}/{requestId}")
    }

    async handleOverview(req: express.Request, res: express.Response) : Promise<void> {
        let overview = this.manager.getOverview();
        res.send(overview);
    }

    async handleDetail(req: express.Request, res: express.Response) : Promise<void> {

    }

}