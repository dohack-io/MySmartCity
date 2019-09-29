import { AApplicationForm } from "./AApplicationForm";
import { ApplicationFormCategory, ApplicationFormFactory, ApplicationFormFactoryCollection } from "./ApplicationFormCategory";
import { Db } from "mongodb";
import { ApplicationFormRestMetadata } from "./ApplicationFormMetadata";
import User from "../user_management/User";
import { getFullId } from "./Utils";
import { LanguageManager } from "../i18n/LanguageManager";
import { ApplicationFormOverview } from "./ApplicationFormsOverview";

/**
 * Informationen für eine Kategorie
 */
export type CategoryInformation = {
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
            this.createCategory(categoryInfo.forms, categoryInfo.categoryId);
        }

        return this;
    }

    /**
     * Erstellt eine neue Kategorie im Manager
     * @param forms Anträge, welche diese Kategorie enthalten soll
     * @param categoryId ID der Kategorie
     */
    public createCategory(forms: ApplicationFormFactoryCollection, categoryId: string = undefined) {
        let category = new ApplicationFormCategory(categoryId);
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
    public async getOverview(database: Db, user: User): Promise<ApplicationFormOverview> {
        let result: ApplicationFormOverview = {};
        let i18n = new LanguageManager(database);

        for (let category of Object.values(this.categories)) {
            let entrys: ApplicationFormRestMetadata[] = [];
            let elements = category.applicationForms;

            for (let form of Object.keys(elements)) {

                let infoInstance = new elements[form](database, getFullId(category.categoryId, form), null);

                let metadata = await infoInstance.getMetadata(user) as ApplicationFormRestMetadata;
                metadata.fullName = category.categoryId + "/" + form;

                entrys.push(metadata);
            }

            result[await i18n.getText("form_"+category.categoryId, user)] = entrys;
        }

        return result;
    }
}