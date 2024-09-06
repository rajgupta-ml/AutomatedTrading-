// -- Todo's 

import  express, { NextFunction } from "express";
import { responseHandlerForSuccess } from "../response/successHandler.response";
import { UserServices } from "../services/UserHandler.services";
import { IAuthController, IUserLogin, userRegistrationDetail } from "../interfaces/IAuthController";



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
            const userDetails : IUserLogin = {...request.body};

            // Handling the Authentication 
            const result = await this.userServices.userLogin(userDetails);

            //sending the response
            return responseHandlerForSuccess(response, result);
        } catch (error) {
            next(error);
        }
    }
    
}