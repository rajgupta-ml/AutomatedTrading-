import { AuthController } from "../controller/authentication.controller";
import DatabaseServices from "../services/DatabaseHandler.services";
import CipherManager from "../services/CipherHandler.services";
import { UserServices } from "../services/UserHandler.services";
import { TokenizationServices } from "../services/TokenizationHandler.services";

const databaseInstance = DatabaseServices.getInstance();
const cipherInstance = new CipherManager();
const tokenInstance = new TokenizationServices();
const userServicesInstance = new UserServices(databaseInstance, cipherInstance, tokenInstance)
export const authenticationController = new AuthController(userServicesInstance);