import { AuthController } from "../controller/authentication.controller";
import DatabaseServices from "../services/DatabaseHandler.services";
import CipherManager from "../services/CipherHandler.services";
import { UserServices } from "../services/UserHandler.services";

const databaseInstance = DatabaseServices.getInstance();
const cipherInstance = new CipherManager();
const userServicesInstance = new UserServices(databaseInstance, cipherInstance)
export const authenticationController = new AuthController(userServicesInstance);