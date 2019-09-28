import express from "express";
import { Db } from "mongodb";
import RequestExtention from "../RequestExtention";

export default function SmartMiddleware(dbConnector: () => Promise<Db>) : (req: express.Request, res: express.Response, next: express.NextFunction) => void {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let myReq = req as RequestExtention;
        myReq.database = dbConnector;
        next();
    }
}