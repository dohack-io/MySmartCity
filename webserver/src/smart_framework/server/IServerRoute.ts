import express from "express";

export default interface IServerRoute {
    mount(app: express.Express): void;
}