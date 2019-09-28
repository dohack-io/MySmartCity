import { Collection, Db } from "mongodb";
import RequestExtention from "./RequestExtention";
import express from "express";
import User from "./user_management/User";

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

export function checkUser(req: RequestExtention, res: express.Response) : User {
    if (!req.user) {
        res.status(401)
            .send("Not logged in!");
        throw new Error("Not logged in!");
    }
    return req.user;
}