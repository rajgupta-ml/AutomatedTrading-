import { AuthController } from "../controller/authentication.controller";
import DatabaseManager from "../services/DatabaseHandler.services";
import CipherManager from "../services/cipherHandler.services";
import { UserServices } from "../services/userHandler.services";

const databaseInstance = DatabaseManager.getInstance();
const cipherInstance = new CipherManager();
const userServicesInstance = new UserServices(databaseInstance, cipherInstance)
export const authenticationController = new AuthController(userServicesInstance);