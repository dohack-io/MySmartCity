import User from "../user_management/User";
import { Collection, Db } from "mongodb";
import { GeneralRequest, AApplicationForm } from "./AApplicationForm";
import { ApplicationFormManager } from "./ApplicationFormManager";
import { DbTarget } from "../DbTarget";

export default class UserFormsFinder extends DbTarget {

    private user: User;

    constructor(db: Db, user: User) {
        super(db);
        this.user = user;
    }

    public async findData() : Promise<GeneralRequest[]> {
        let collection = await this.getCollection<GeneralRequest>(AApplicationForm.COLLECTION_NAME);

        return await collection.find({
            userId: this.user.userId
        })
        .sort({
            created: -1
        })
        .limit(10)
        .toArray();
    }
}