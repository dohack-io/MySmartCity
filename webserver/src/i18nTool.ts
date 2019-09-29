/**
 * Simples Tool um i18n Daten zu importieren oder zu exportieren
 */
import { Collection, MongoClient } from "mongodb";
import { LangEntry, Language } from "./smart_framework/i18n/LanguageManager";
import { writeFileSync, readFileSync } from "fs";

type FileLangFormat = {
    [key: string] : string;
}

let args = process.argv;

// ... export/import lang filename
if (args.length < 4) {
    throw new Error("i18nTool.ts export {lang} {fileName} \n or i18nTool.ts import {lang} {fileName} ");
}

let lang = args[3] as Language;
let filename = args[4];

async function exportFunction(collection: Collection<LangEntry>) : Promise<void> {
    console.log("Start export....");
    let query = await collection.find({
        lang: {
            $eq: lang
        }
    }).toArray();

    let exportData: FileLangFormat = {};

    query.forEach(e => exportData[e.key] = e.value);

    writeFileSync(filename, JSON.stringify(exportData, null, 4), "utf-8");
    console.log("File exported!");
}

async function importFunction(collection: Collection<LangEntry>) : Promise<void> {
    let importData = JSON.parse( readFileSync(filename, "utf-8") );

    for (let key of Object.keys(importData)) {
        await collection.replaceOne({
            lang: {
                $eq: lang
            },
            key: {
                $eq: key
            }
        },
        {
            key,
            lang,
            value: importData[key]
        }, {upsert: true});
    }

    console.log("Data imported!");
}

async function handle() {
    let client = new MongoClient("mongodb://localhost:27017", {useNewUrlParser: true});
    await client.connect();
    let db = client.db("mysmartcity");
    let i18nCollection = db.collection<LangEntry>("i18n");

    if (args[2] == "export") {
        await exportFunction(i18nCollection);
    }
    else if (args[2] == "import") {
        await importFunction(i18nCollection);
    }
    else {
        console.log(args);
        throw new Error("Method not supported");
    }
    await client.close();
};
handle();

