import IServerRoute from "./IServerRoute";
import express from "express";
import { ApplicationFormManager } from "../applicationForm/ApplicationFormManager";
import { ApplicationFormRestMetadata } from "../applicationForm/ApplicationFormMetadata";
import RequestExtention from "../RequestExtention";
import { checkUser } from "../Utils";
import { LanguageManager } from "../i18n/LanguageManager";
import { UploadedFile } from "express-fileupload";
import { FileDbObject, FileUploadHandler } from "../applicationForm/FileDbObject";

export type ApplicationFormOverview = {
    [categoryName: string]: ApplicationFormRestMetadata[]
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
        app.post("/applicationForms/:requestId/:fieldId/upload", this.handleFileUpload.bind(this));
    }

    async handleFileUpload(req: RequestExtention, res: express.Response): Promise<void> {
        if (!req.files["file"]) {
            return;
        }

        let user = checkUser(req, res);

        let file = req.files["file"] as UploadedFile;

        let dbObject: FileDbObject = {
            binary: file.data,
            uploaded: new Date(),
            requestId: req.params["requestId"],
            userId: user.userId,
            fieldId: req.params["fieldId"]
        };

        let handler = new FileUploadHandler(req.database);
        let objectId = await handler.saveFile(dbObject);

        dbObject._id = objectId;
        delete dbObject.binary;

        res.send(dbObject);
    }

    async handleOverview(req: RequestExtention, res: express.Response): Promise<void> {
        let user = checkUser(req, res);
        let overview = await this.manager.getOverview(req.database, user);
        res.send(overview);
    }

    async handleDetail(req: RequestExtention, res: express.Response): Promise<void> {
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

    async handleSubmit(req: RequestExtention, res: express.Response): Promise<void> {
        let categoryId = req.params["categoryId"];
        let formId = req.params["formId"];
        let user = checkUser(req, res);

        let form = this.manager.getApplicationForm(req.database, categoryId, formId, user);

        res.send(await form.processUserData(req.body));
    }

}