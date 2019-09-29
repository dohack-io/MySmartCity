import IServerRoute from "./IServerRoute";
import express from "express";
import { ApplicationFormManager } from "../applicationForm/ApplicationFormManager";
import { ApplicationFormRestMetadata } from "../applicationForm/ApplicationFormMetadata";
import RequestExtention from "../RequestExtention";
import { checkUser } from "../Utils";
import { LanguageManager } from "../i18n/LanguageManager";

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

    async handleOverview(req: RequestExtention, res: express.Response) : Promise<void> {
        let user = checkUser(req, res);
        let overview = await this.manager.getOverview(req.database, user);
        res.send(overview);
    }

    async handleDetail(req: RequestExtention, res: express.Response) : Promise<void> {
        let categoryId = req.params["categoryId"];
        let formId = req.params["formId"];
        let user = checkUser(req, res);
        
        let form = this.manager.getApplicationForm(req.database, categoryId, formId, user);
        let i18n = new LanguageManager(req.database);

        // Replace Label if nessessary
        let requestFields = form.requestFields;
        for (let field of requestFields) {
            field.label = await i18n.handleText(field.label, user);
        }

        res.send(requestFields);
    }

    async handleSubmit(req: RequestExtention, res: express.Response) : Promise<void> {
        let categoryId = req.params["categoryId"];
        let formId = req.params["formId"];
        let user = checkUser(req, res);
        
        let form = this.manager.getApplicationForm(req.database, categoryId, formId, user);

        let response = await form.processUserData(req.body);
        res.send(response);
    }

}