import express from "express";
import { Db, MongoClient } from "mongodb";
import RequestExtention from "../RequestExtention";

export default function SmartMiddleware(mongoDbString: string, dbName: string) : (req: express.Request, res: express.Response, next: express.NextFunction) => void {
    return async (req: RequestExtention, res: express.Response, next: express.NextFunction) => {
        let handler = new SmartMiddlewareHandler(mongoDbString, dbName);
        handler.handle(req, res, next);
    }
}

class SmartMiddlewareHandler {
    
    private mongoClient: MongoClient;
    private databaseName: string;
    private database: Db;

    constructor(mongoDbString: string, dbName: string) {
        this.mongoClient = new MongoClient(mongoDbString, {useNewUrlParser: true});
        this.databaseName = dbName;

        this.endPipe = this.endPipe.bind(this);
    }

    public async handle(req: RequestExtention, res: express.Response, next: express.NextFunction) {
        await this.mongoClient.connect();
        this.database = this.mongoClient.db(this.databaseName);

        req.database = this.database;
        req.on("end", this.endPipe);
        next();
    }

    public async endPipe() : Promise<void> {
        await this.mongoClient.close();
    }


}