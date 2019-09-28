import AUserManager from "../smart_framework/user_management/AUserManager";

export class DoUserManagement extends AUserManager {
    
    public getUserFromCookie(cookie: string): Promise<import("../smart_framework/user_management/User").default> {
        throw new Error("Method not implemented.");
    }
    
    public login(username: string, password: string): Promise<import("../smart_framework/user_management/User").default> {
        throw new Error("Method not implemented.");
    }


}