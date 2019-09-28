import { Language } from "../i18n/LanguageManager";

export default interface User {
    firstName: string;
    lastName: string;
    userId: string;
    email: string;
    isAdmin: boolean;
    language: Language;
}