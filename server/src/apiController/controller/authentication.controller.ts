// -- Todo's 

import  express, { NextFunction } from "express";
import { UserServices } from "../services/UserHandler.services";
import { IAuthController, IUserLogin, userRegistrationDetail } from "../interfaces/IAuthController";
import { IResponseHandler } from "../interfaces/IResponseHandler";
import { UnauthorizedUser } from "../errors/UnauthorizedUser.error";
import { IDataToBeRegistered } from "../interfaces/IDataToBeRegistered";
import { responseHandlerForSuccess } from "../response/successHandler.response";



export class AuthController implements IAuthController {
    // Creating a cipher Manager Instance for encryption and decryption
    private userServices : UserServices

    constructor(userServices : UserServices) {
        this.userServices = userServices
    }

    async userRegister (request: express.Request, response : express.Response, next : express.NextFunction) : Promise<void> {
        try {          
            const userDetails : userRegistrationDetail = {...request.body};
            //Handling the registration 
            const result = await this.userServices.userRegister(userDetails);
            // Sending the response
            return responseHandlerForSuccess(response, result);
        } catch (error) {
            next(error);
        }

    }
    async userLogin (request: express.Request, response : express.Response, next : NextFunction) : Promise <void>{

        try {
		//This is a test 
            const userDetails : IUserLogin = {...request.body};
            // Handling the Authentication 
            const result = await this.userServices.userLogin(userDetails);
            //sending the response
            return responseHandlerForSuccess(response, result);
        } catch (error) {
            next(error);
        }
    }


    async brokerRegistration(request : express.Request, response : express.Response, next : express.NextFunction){
        try {
            const token = request.cookies["set-cookie"];
            const DataToBeRegistered : IDataToBeRegistered = {...request.body}
            if(!token) throw new UnauthorizedUser("You can't access this link")
            const result = await this.userServices.brokerRegistration(DataToBeRegistered, token);    
            return responseHandlerForSuccess(response, result);
        } catch (error) {
            next(error);
        }
    }
    
}
