import express from "express";
import User from "./user_management/User";
import { Db } from "mongodb";

export default interface RequestExtention extends express.Request {
    user?: User;
    database: () => Promise<Db>;
}