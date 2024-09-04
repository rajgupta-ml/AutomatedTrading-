import express from "express";
import { AuthController } from "../../controller/authentication.controller";
import DatabaseManager from "../../managers/Database.manager";
const v1Router = express.Router();

const databaseInstance = DatabaseManager.getInstance();
const authenticationController = new AuthController(databaseInstance);
v1Router.post("/register", authenticationController.userRegister.bind(authenticationController));


export default v1Router;
