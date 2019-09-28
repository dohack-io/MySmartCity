import { Db, Collection } from "mongodb";
import { getCollection } from "./Utils";
import { LanguageManager } from "./i18n/LanguageManager";

export class DbTarget {

    protected db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    protected async getCollection<T = any>(collectionName: string, create: boolean = true): Promise<Collection> {
        return getCollection<T>(this.db, collectionName, create);
    }
}