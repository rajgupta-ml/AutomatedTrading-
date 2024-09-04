import express from "express";
import { AuthController } from "../../controller/authentication.controller";
const v1Router = express.Router();

const authenticationController = new AuthController();
v1Router.post("/register", authenticationController.userRegister.bind(authenticationController));


export default v1Router;
