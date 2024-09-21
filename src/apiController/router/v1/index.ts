import express from "express";
import { authenticationController } from "../../di/authController.di";
import { adminVerficationMiddleware } from "../../middleware/adminVerfication.middleware";

const v1Router = express.Router();

v1Router.post("/register", authenticationController.userRegister.bind(authenticationController));
v1Router.post("/login", authenticationController.userLogin.bind(authenticationController));
v1Router.post("/broker_registration", authenticationController.brokerRegistration.bind(authenticationController));
v1Router.post("/broker_oauth_uri", authenticationController.getOAuthURI.bind(authenticationController));
v1Router.post("/broker_access_token", authenticationController.getAccessToken.bind(authenticationController));
v1Router.post("/get_realtime_data", adminVerficationMiddleware, authenticationController.startDataDigestion.bind(authenticationController));
export default v1Router;
