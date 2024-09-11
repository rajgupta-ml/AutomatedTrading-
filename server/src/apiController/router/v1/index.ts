import express from "express";
import { authenticationController } from "../../di/authController.di";

const v1Router = express.Router();

v1Router.post("/register", authenticationController.userRegister.bind(authenticationController));
v1Router.post("/login", authenticationController.userLogin.bind(authenticationController));
v1Router.post("/broker_registration", authenticationController.brokerRegistration.bind(authenticationController));
export default v1Router;
