import { AuthController } from "../controller/authentication.controller";
import DatabaseManager from "../managers/Database.manager";
import CipherManager from "../services/services.cipherHandler";
import { UserServices } from "../services/services.userServices";

const databaseInstance = DatabaseManager.getInstance();
const cipherInstance = new CipherManager();
const userServicesInstance = new UserServices(databaseInstance, cipherInstance)
export const authenticationController = new AuthController(userServicesInstance);