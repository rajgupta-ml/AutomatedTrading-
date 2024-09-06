import express from "express";
import { authenticationController } from "../../di/authController.di";

const v1Router = express.Router();

v1Router.post("/register", authenticationController.userRegister.bind(authenticationController));


export default v1Router;
