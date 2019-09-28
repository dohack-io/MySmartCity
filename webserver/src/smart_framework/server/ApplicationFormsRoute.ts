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
        app.get("/applicationForms/:categoryId/:formId", this.handleDetail.bind(this));
        app.post("/applicationForms/:categoryId/:formId", this.handleSubmit.bind(this));
    }

    async handleOverview(req: express.Request, res: express.Response) : Promise<void> {
        let overview = this.manager.getOverview();
        res.send(overview);
    }

    async handleDetail(req: express.Request, res: express.Response) : Promise<void> {
        let categoryId = req.params["categoryId"];
        let formId = req.params["formId"];
        
        let form = this.manager.getReadApplicationForm(categoryId, formId, {
            firstName: "Tim",
            lastName: "Ittermann",
            userId: "abc13214654",
            email: "tim.ittermann@gmail.com"
        });

        res.send(form.requestFields);
    }

    async handleSubmit(req: express.Request, res: express.Response) : Promise<void> {
        let categoryId = req.params["categoryId"];
        let formId = req.params["formId"];
        
        let form = await this.manager.getFullApplicationForm(categoryId, formId, {
            firstName: "Tim",
            lastName: "Ittermann",
            userId: "abc13214654",
            email: "tim.ittermann@gmail.com"
        });

        let response = await form.processUserData(req.body);
        res.send(response);
    }

}