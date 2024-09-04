// -- Todo's 

import  express from "express";

import CipherManager from "../services/services.cipherHandler";
import DatabaseManager from "../managers/Database.manager";
import { InvalidUserDetailError } from "../errors/InvalidUserDetails.error";
import { SuccessResponse } from "../success/Response.success";
import { responseHandlerForSuccess } from "../response/successHandler.response";
import { BAD_REQUEST_CODE, SUCCESSFULL_CODE } from "../statusCode/statusCode";
import { IStorage } from "../typesAndInterfaces/IStorage";
interface userRegistrationDetail {
    username : string,
    password : string,
    redirectURI : string,
    clientId : string
    clientSecret : string
}


export class AuthController {
    // Creating a cipher Manager Instance for encryption and decryption
    private cipherManager : CipherManager
    private storage : IStorage

    constructor(storage : IStorage) {
        this.cipherManager = new CipherManager();
        this.storage = storage;
    }

    async userRegister (request: express.Request, response : express.Response, next : express.NextFunction) {
        try {          
            const userDetails : userRegistrationDetail = {...request.body};
            
            //Validating the required field
            this.validateUserDetails(userDetails as userRegistrationDetail);    

            // hashing the password 
            const hashedPassword = this.cipherManager.hash(userDetails.password as string);


            //Encrypting the api details
            const encryptedDetails = await this.encryptSensitiveDetails(userDetails);
            
            //Create the userData which needs to saved to the DB 
            const DBUserData = {
                username : userDetails.username,
                password : hashedPassword,
                ...encryptedDetails
            }

            // Saving the userDetails in the Database
            await this.storage.insertOne("users", DBUserData);
        
            // Sending the response
            return responseHandlerForSuccess(response, new SuccessResponse(SUCCESSFULL_CODE, "Database Insert", "Registration Complete successfully"))

        } catch (error) {
            next(error);
        }

    }
    userLogin (request: express.Request, response : express.Response){
    }

    private validateUserDetails(userDetails : userRegistrationDetail){
        const requiredFields = ["username", "password", "redirectURI" ,"clientId", "clientSecret"];
        for(const requiredField of requiredFields){
            if(!userDetails[requiredField as keyof userRegistrationDetail]) throw new InvalidUserDetailError(`${requiredField} is required`, BAD_REQUEST_CODE, "BAD REQUEST");
        }
    }


    private  async encryptSensitiveDetails(userDetails : userRegistrationDetail): Promise<Record<string, string>>  {

        const sensitiveField = ["redirectURI" ,"clientId", "clientSecret"];
        const encryptedDetails: Record<string, string> = {};
        for(const field of sensitiveField){
            encryptedDetails[field] = await this.cipherManager.encrypt(
                userDetails[field as keyof userRegistrationDetail] as string)
            }
        return encryptedDetails;
    }
    
}