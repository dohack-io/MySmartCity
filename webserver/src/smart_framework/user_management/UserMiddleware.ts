import express from "express";
import AUserManager from "./AUserManager";
import RequestExtention from "../RequestExtention";

export class UserMiddleware {

    private static readonly COOKIE_NAME = "mysmartcity_auth";

    private userManager: AUserManager;

    constructor(userManager: AUserManager) {
        this.userManager = userManager;

        this.handle = this.handle.bind(this);
    }

    public async handle(req: express.Request, res: express.Response, next: express.NextFunction) : Promise<void> {
        if (req.cookies[UserMiddleware.COOKIE_NAME] !== undefined) {
            await this.addUserFromCookie(req);
        }
        else {
            (req as any)["user"]  = {
                firstName: "Max",
                lastName: "Mustermann",
                userId: "abcd",
                email: "max@mustermann.de"
            };
        }

        next();
    }

    private async addUserFromCookie(req: express.Request) {
        let token = req.cookies[UserMiddleware.COOKIE_NAME];
        let user = await this.userManager.getUserFromCookie(token);
        (req as RequestExtention).user = user;
    }

}