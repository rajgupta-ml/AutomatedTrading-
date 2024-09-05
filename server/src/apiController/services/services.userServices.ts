import { ICipher } from "../interfaces/ICipher";
import { IStorage } from "../interfaces/IStorage";
import express from "express";
import { userRegistrationDetail } from "../interfaces/IUserRegistrationDetails";
import { SuccessResponse } from "../success/Response.success";
import { BAD_REQUEST_CODE, SUCCESSFULL_CODE } from "../statusCode/statusCode";
import { InvalidUserDetailError } from "../errors/InvalidUserDetails.error";
import { IUserServices } from "../interfaces/IUserServices";

export class UserServices implements IUserServices {
    private cipher : ICipher
    private storage : IStorage

    constructor(storage : IStorage, cipher : ICipher){
        this.cipher = cipher;
        this.storage = storage;
    }

        async userRegister (userDetails : userRegistrationDetail) : Promise<SuccessResponse> {
                
            //Validating the required field
            this.validateUserDetails(userDetails as userRegistrationDetail);    

            // hashing the password 
            const hashedPassword = this.cipher.hash(userDetails.password as string);


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
        
            // Returning a Success Response
            return new SuccessResponse(SUCCESSFULL_CODE, "Database Insert", "Registration Complete successfully")

     

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
            encryptedDetails[field] = await this.cipher.encrypt(
                userDetails[field as keyof userRegistrationDetail] as string)
            }
        return encryptedDetails;
    }
}