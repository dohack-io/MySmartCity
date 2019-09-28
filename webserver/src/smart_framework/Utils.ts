import { Collection, Db } from "mongodb";

export async function getCollection<T = any>(database: Db, collectionName: string, create: boolean = true): Promise<Collection<T>> {

    if (create) {
        try {
            await database.createCollection(collectionName);
        } catch (e) { }
    }

    return database.collection<T>(collectionName);
}

export function flatArray<T>(data: T[][]): T[] {
    let result = [];
    for (let a of data) {
        for (let b of a) {
            result.push(b);
        } 
    }

    return result;
}