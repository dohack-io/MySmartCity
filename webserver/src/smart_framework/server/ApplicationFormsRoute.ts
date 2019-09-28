import IServerRoute from "./IServerRoute";
import express from "express";
import { ApplicationFormManager } from "../applicationForm/ApplicationFormManager";
import { ApplicationFormRestMetadata } from "../applicationForm/ApplicationFormMetadata";
import RequestExtention from "../RequestExtention";

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
        app.get("/applicationForms/:categoryId/:formId", this.handleDetail.bind(this));
        app.post("/applicationForms/:categoryId/:formId", this.handleSubmit.bind(this));
    }

    async handleOverview(req: express.Request, res: express.Response) : Promise<void> {
        let overview = this.manager.getOverview();
        res.send(overview);
    }

    async handleDetail(req: RequestExtention, res: express.Response) : Promise<void> {
        let categoryId = req.params["categoryId"];
        let formId = req.params["formId"];
        
        let form = this.manager.getReadApplicationForm(categoryId, formId, req.user);

        res.send(form.requestFields);
    }

    async handleSubmit(req: RequestExtention, res: express.Response) : Promise<void> {
        let categoryId = req.params["categoryId"];
        let formId = req.params["formId"];
        
        let form = await this.manager.getFullApplicationForm(categoryId, formId, req.user, await req.database());

        let response = await form.processUserData(req.body);
        res.send(response);
    }

}