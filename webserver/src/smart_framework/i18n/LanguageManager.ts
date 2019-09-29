import { Collection, Db } from "mongodb";
import Format = require("string-format");
import { DbTarget } from "../DbTarget";

export type Language = "DE" | "EN";
export type Langable = {
    language: Language;
}

type LangEntry = {
    key: string;
    lang: Language;
    value: string;
}

export class LanguageManager extends DbTarget {

    private collection: Collection<LangEntry>;

    public constructor(database: Db) {
        super(database);
        this.collection = database.collection<LangEntry>("i18n");
    }

    public async getText(key: string, lang: Language | Langable): Promise<string> {
        lang = this.getLanguage(lang);

        let text = await this.collection.findOne({
            lang,
            key
        });

        if (!text) {
            throw new Error(`String ${key} in ${lang} not found`);
        }

        return text.value;
    }

    public async formattedText(key: string, lang: Language | Langable, args: string[] | { [k: string]: any; }): Promise<string> {
        let text = await this.getText(key, lang);
        return Format(text, args);
    }

    private getLanguage(lang: Language | Langable): Language {
        if (this.isLangable(lang)) {
            return lang.language;
        }
        else {
            return lang;
        }
    }

    private isLangable(lang: any): lang is Langable {
        let lLang = lang as Langable;
        return lLang.language !== undefined;
    }
}