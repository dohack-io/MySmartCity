import User from "./User";
import { Collection, Db } from "mongodb";

export default abstract class AUserManager {

    protected userCollectionName: string;
    protected tokenCollectionName: string;

    public constructor(userCollectionName: string, tokenCollectionName: string) {
        this.userCollectionName = userCollectionName;
        this.tokenCollectionName = tokenCollectionName;
    }

    public abstract getUserFromCookie(database: Db, cookie: string): Promise<User>;
    public abstract login(database: Db, username: string, password: string): Promise<User>;
}