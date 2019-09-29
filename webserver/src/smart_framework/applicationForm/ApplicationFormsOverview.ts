import { ApplicationFormRestMetadata } from "./ApplicationFormMetadata";

/**
 * Übersicht der Kategorien welche existieren mit den Kurzdaten der Formulare 
 */
export type ApplicationFormOverview = {
    [categoryName: string]: ApplicationFormRestMetadata[]
};