import express from "express";
import User from "./user_management/User";
import { Db } from "mongodb";
import { LanguageManager } from "./i18n/LanguageManager";

export default interface RequestExtention extends express.Request {
    user?: User;
    database: Db;
}