import AApplicationForm from "./AApplicationForm";
import { ApplicationFormCategory, ApplicationFormFactory } from "./ApplicationFormCategory";
import { Collection, MongoClient, Db } from "mongodb";
import User from "./user_management/User";

export class ApplicationFormManager {

    private static DEFAULT_COLLECTION_NAME = "Requests";
    
    private dbConnectionUri: string;
    private databaseName: string;
    public categories: ApplicationFormCategory[];

    public constructor(dbConnectionUri: string, dbName: string) {
        this.dbConnectionUri = dbConnectionUri;
        this.databaseName = dbName;
    }

    public async createRequest(requestType: string, user: User): Promise<AApplicationForm<unknown>> {
       
        for (let category of this.categories) {
            if (category.hasRequestFactory(requestType)) {
                let factory = category.getRequestFactory(requestType);
                return await this.createInstance(factory, user);
            }
        }

        throw new Error(`Factory for type ${requestType} not found!`);
    }

    private async createInstance(fac: ApplicationFormFactory, user: User) : Promise<AApplicationForm<unknown>> {
        let instance = new fac(user);

        let collectionName = instance.collectionName;

        if (collectionName == null) {
            collectionName = ApplicationFormManager.DEFAULT_COLLECTION_NAME;
        }

        instance.bindCollection(
            await this.getCollection(collectionName)
        );

        return instance;
    }

    private async getCollection(collectionName: string) : Promise<Collection> {
        let dbInstance = await this.getDatabase();

        try {
            await dbInstance.createCollection(collectionName);
        } catch (e) {}

        return dbInstance.collection(collectionName);
    }

    private async getDatabase(): Promise<Db> {
        let client = new MongoClient(this.dbConnectionUri, {useNewUrlParser: true});
        await client.connect();
        return client.db(this.databaseName);
    }
}