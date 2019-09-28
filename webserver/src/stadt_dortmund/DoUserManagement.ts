import AUserManager from "../smart_framework/user_management/AUserManager";
import { Db, Collection } from "mongodb";
import User from "../smart_framework/user_management/User";
import { getCollection } from "../smart_framework/Utils";
import { Token } from "../smart_framework/user_management/Token";

export class DoUserManagement extends AUserManager {
    
    private async findUserByName(database: Db, userId: string) : Promise<User> {
        let collection = await getCollection<Token>(database, this.userCollectionName, false);

        return collection.findOne({
            userId
        });
    }

    public async getUserFromToken(database: Db, cookie: string): Promise<User> {
        let collection = await getCollection<Token>(database, this.tokenCollectionName, false);

        let find = await collection.findOne({
            token: cookie
        });

        if (!find) {
            return null;
        } 

        return this.findUserByName(database, find.userId);
    }
    
    public login(database: Db, username: string, password: string): Promise<User> {
        throw new Error("Method not implemented.");
    }


}