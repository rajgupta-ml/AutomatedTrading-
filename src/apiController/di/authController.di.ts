import { AuthController } from "../controller/authentication.controller";
import DatabaseServices from "../services/DatabaseHandler.services";
import CipherManager from "../services/CipherHandler.services";
import { UserServices } from "../services/UserHandler.services";
import { TokenizationServices } from "../services/TokenizationHandler.services";
import { BrokerService } from "../services/BrokerHandler.services";
import { BrokerSelector } from "../services/brokerSelector.service";
import { MicroServiceCaller } from "../services/MicroServiceCaller.service";

const databaseInstance = DatabaseServices.getInstance();
const cipherInstance = new CipherManager();
const tokenInstance = new TokenizationServices();
const userServicesInstance = new UserServices(databaseInstance, cipherInstance, tokenInstance);
const microServiceCallerInstance = new MicroServiceCaller();
const brokerSelectorInstance = new BrokerSelector();
const brokerServiceInstance = new BrokerService(databaseInstance, tokenInstance, cipherInstance);
export const authenticationController = new AuthController(userServicesInstance, brokerServiceInstance, brokerSelectorInstance, microServiceCallerInstance);
