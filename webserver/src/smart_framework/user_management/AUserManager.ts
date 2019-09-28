import User from "./User";
import { Collection, Db } from "mongodb";

/**
 * Stellt einen Nutzermanager dar   
 */
export default abstract class AUserManager {

    protected userCollectionName: string;
    protected tokenCollectionName: string;

    public constructor(userCollectionName: string, tokenCollectionName: string) {
        this.userCollectionName = userCollectionName;
        this.tokenCollectionName = tokenCollectionName;
    }

    /**
     * Ruft einen Nutzer mithilfe seines Tokens ab
     * @param database Datenbankverbindung
     * @param token Zugangschlüssel des Nutzers
     */
    public abstract getUserFromToken(database: Db, token: string): Promise<User>;

    /**
     * Logt einen Nutzer ein
     * @param database Datenbankverbindung
     * @param username Nutzername
     * @param password Nutzerpasswort
     */
    public abstract login(database: Db, username: string, password: string): Promise<User>;
}