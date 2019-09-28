import { Collection, Db } from "mongodb";
import { getCollection } from "../Utils";
import User from "../user_management/User";

export type Language = "DE" | "EN";

type LangEntry = {
    key: string;
    lang: Language;
    value: string;
}

export class LanguageManager {
    
    private collection: Collection<LangEntry>;

    public constructor(database: Db, collectionName: string) {
        this.connectCollection(database, collectionName);   
    }

    private async connectCollection(database: Db, collectionName: string): Promise<void> {
        this.collection = await getCollection<LangEntry>(database, collectionName, false);
    }

    public async getText(key: string, lang: Language | User) : Promise<string> {
        let text = await this.collection.findOne({
            lang,
            key
        });

        if (!text) {
            throw new Error(`String ${key} in ${lang} not found`);    
        }

        return text.value;
    }
}