import { AApplicationForm } from "./AApplicationForm";
import { ApplicationFormCategory, ApplicationFormFactory, ApplicationFormFactoryCollection } from "./ApplicationFormCategory";
import { Collection, MongoClient, Db } from "mongodb";
import { ApplicationFormRestMetadata } from "./ApplicationFormMetadata";
import User from "../user_management/User";
import { ApplicationFormOverview } from "../server/ApplicationFormsRoute";
import { getFullId } from "./Utils";
import { getCollection } from "../Utils";

/**
 * Informationen für eine Kategorie
 */
export type CategoryInformation = {
    categoryName: string,
    categoryId: string,
    forms: ApplicationFormFactoryCollection
}

/**
 * Enthält alle Anträge die von dem Server bearbeitet werden können
 */
export class ApplicationFormManager {

    public categories: { [categoryId: string]: ApplicationFormCategory };

    public constructor() {
        this.categories = {};
    }

    /**
     * Fügt meherere Kategorien dem Manager hinzu
     * @param collection Die Kategorien, welche hinzugefügt werden sollen
     */
    public addCategories(collection: CategoryInformation[]): ApplicationFormManager {
        for (let categoryInfo of collection) {
            this.createCategory(categoryInfo.categoryName, categoryInfo.forms, categoryInfo.categoryId);
        }

        return this;
    }

    /**
     * Erstellt eine neue Kategorie im Manager
     * @param categoryName Name der neuen Kategorie
     * @param forms Anträge, welche diese Kategorie enthalten soll
     * @param categoryId ID der Kategorie
     */
    public createCategory(categoryName: string, forms: ApplicationFormFactoryCollection, categoryId: string = undefined) {
        let category = new ApplicationFormCategory(categoryId, categoryName);
        category.addRequest(forms);

        this.categories[category.categoryId] = category;
    }

    /**
     * Gibt einen Antrag, welcher zum Lesen von Metadaten ausgeprägt ist zurück
     * @param categoryId Kategorie des Antrags
     * @param formId Id des Antrags
     * @param user Der Nutzer, für den der Antrag hinzugefügt werden soll
     */
    public getApplicationForm(database: Db, categoryId: string, formId: string, user: User): AApplicationForm<unknown> {
        let formFactory = this.getFormFactory(categoryId, formId);
        return new formFactory(database, getFullId(categoryId, formId), user);
    }


    /**
     * Sucht die Factory für den Antrag
     * @param categoryId KategorieId in der gesucht werden soll
     * @param formId Antragsid
     */
    private getFormFactory(categoryId: string, formId: string): ApplicationFormFactory {
        let category = this.categories[categoryId];

        if (category === undefined) {
            throw new Error(`Category ${categoryId} not found!`);
        }

        let formFactory = category.getRequestFactory(formId);

        if (formFactory === undefined) {
            throw new Error(`Form ${formId} not found on category ${categoryId}`);
        }

        return formFactory;
    }

    /**
     * Gibt einen Überblick der vorhandenen Anträge zurück
     */
    public getOverview(database: Db): ApplicationFormOverview {
        let result: ApplicationFormOverview = {};

        for (let category of Object.values(this.categories)) {
            let entrys: ApplicationFormRestMetadata[] = [];
            let elements = category.applicationForms;

            for (let form of Object.keys(elements)) {

                let infoInstance = new elements[form](database, null);

                entrys.push({
                    applicationFormDescription: infoInstance.applicationFormDescription,
                    applicationFormTitle: infoInstance.applicationFormTitle,
                    fullName: category.categoryId + "/" + form
                });
            }

            result[category.categoryName] = entrys;
        }

        return result;
    }
}