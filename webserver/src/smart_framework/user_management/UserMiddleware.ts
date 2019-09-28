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

    public async handle(req: RequestExtention, res: express.Response, next: express.NextFunction) : Promise<void> {
        let token: string;

        if (req.cookies[UserMiddleware.COOKIE_NAME] !== undefined) {
            token = req.cookies[UserMiddleware.COOKIE_NAME]
        }
        else if (req.header("X-Token") !== undefined) {
            token = req.header("X-Token");
        }
        // Testfall: Default User
        else {
            token = "default";
        }

        await this.addUserFromCookie(req, token);
        
        next();
    }

    private async addUserFromCookie(req: RequestExtention, token: string) {
        let user = await this.userManager.getUserFromToken(req.database, token);
        (req as RequestExtention).user = user;
    }

}