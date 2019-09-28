import AApplicationForm from "./AApplicationForm";
import { ApplicationFormCategory, ApplicationFormFactory, ApplicationFormFactoryCollection } from "./ApplicationFormCategory";
import { Collection, MongoClient, Db } from "mongodb";
import { ApplicationFormRestMetadata } from "./ApplicationFormMetadata";
import User from "../user_management/User";
import { ApplicationFormOverview } from "../server/ApplicationFormsRoute";
import { getFullId } from "./Utils";

export type CategoryInformation = {
    categoryName: string,
    categoryId: string,
    forms: ApplicationFormFactoryCollection
}

export class ApplicationFormManager {

    private static DEFAULT_COLLECTION_NAME = "Requests";
    
    private dbConnectionUri: string;
    private databaseName: string;
    public categories: {[categoryId: string]: ApplicationFormCategory};

    public constructor(dbConnectionUri: string, dbName: string) {
        this.dbConnectionUri = dbConnectionUri;
        this.databaseName = dbName;
        this.categories = {};
    }

    public addCategories(collection: CategoryInformation[]) : ApplicationFormManager {
        for (let categoryInfo of collection) {
            this.createCategory(categoryInfo.categoryName, categoryInfo.forms, categoryInfo.categoryId);
        }

        return this;
    }

    public createCategory(categoryName: string, forms: ApplicationFormFactoryCollection, categoryId: string = undefined) {
        let category = new ApplicationFormCategory(categoryId, categoryName);
        category.addRequest(forms);

        this.categories[category.categoryId] = category;
    }

    public getReadApplicationForm(categoryId: string, formId: string, user: User) : AApplicationForm<unknown> {
        let formFactory = this.getFormFactory(categoryId, formId);   
        return new formFactory(getFullId(categoryId, formId), user);
    }

    public async getFullApplicationForm(categoryId: string, formId: string, user: User) : Promise<AApplicationForm<unknown>> {
        let formFactory = this.getFormFactory(categoryId, formId);
        return this.createInstance(formFactory, user, getFullId(categoryId, formId));
    }

    private getFormFactory(categoryId: string, formId: string) : ApplicationFormFactory {
        let category = this.categories[categoryId];

        if (category === undefined) {
            throw new Error(`Category ${categoryId} not found!`);
        }

        let formFactory = category.getRequestFactory(formId);

        if (formFactory === undefined) {
            throw new Error(`Form ${formId} not found on category ${categoryId}`);
        }

        return formFactory;
    }

    public getOverview() : ApplicationFormOverview {
        let result: ApplicationFormOverview = {};

        for (let category of Object.values(this.categories)) {
            let entrys: ApplicationFormRestMetadata[] = [];
            let elements = category.applicationForms;

            for (let form of Object.keys(elements)) {

                let infoInstance = new elements[form](null);

                entrys.push({
                    applicationFormDescription: infoInstance.applicationFormDescription,
                    applicationFormTitle: infoInstance.applicationFormTitle,
                    fullName: category.categoryId + "/" + form
                });
            }

            result[category.categoryName] = entrys;
        }

        return result;
    }

    private async createInstance(fac: ApplicationFormFactory, user: User, fullFormId: string) : Promise<AApplicationForm<unknown>> {
        let instance = new fac(fullFormId, user);

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