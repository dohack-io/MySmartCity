import { ObjectID } from "bson";
import { DbTarget } from "../DbTarget";

export interface FileDbObject {
    binary: Buffer;
    uploaded: Date;
    userId: string;
    requestId: string;
    fieldId: string;
    _id?: ObjectID;
}

export class FileUploadHandler extends DbTarget {

    async saveFile(data: FileDbObject): Promise<ObjectID> {
        let collection = await this.getCollection<FileDbObject>("Uploads", false);
        let result = await collection.insertOne(data);
        return result.insertedId;
    }

}