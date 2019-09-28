import User from "./User";
import { Collection } from "mongodb";

export default abstract class AUserManager {

    protected collection: Collection;

    public constructor(collection: Collection) {
        this.collection = collection;
    }

    public abstract getUserFromCookie(cookie: string): Promise<User>;
    public abstract login(username: string, password: string): Promise<User>;
}