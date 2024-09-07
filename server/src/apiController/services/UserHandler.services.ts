import { ICipher } from "../interfaces/ICipher";
import { IStorage } from "../interfaces/IStorage";
import express from "express";

import { SuccessResponse } from "../success/Response.success";
import { BAD_REQUEST_CODE, SUCCESSFULL_CODE, UNAUTHORIZED_STATUS_CODE } from "../statusCode/statusCode";
import { InvalidUserDetailError } from "../errors/InvalidUserDetails.error";
import { IUserServices } from "../interfaces/IUserServices";
import { ITokenizer } from "../interfaces/ITokenizer";
import { IUserLogin, userRegistrationDetail } from "../interfaces/IAuthController";
import { DatabaseError } from "../errors/Database.error";
import { CipherError } from "../errors/Cipher.error";
import { UnknownError } from "../errors/Unknown.error";
import { InternalServerError } from "../errors/InternalServer.error";

export class UserServices implements IUserServices {
    private cipher : ICipher
    private storage : IStorage
    private token : ITokenizer

    constructor(storage : IStorage, cipher : ICipher, token : ITokenizer){
        this.cipher = cipher;
        this.storage = storage;
        this.token = token
    }

        async userRegister (userDetails : userRegistrationDetail) : Promise<SuccessResponse> {
                
            //Validating the required field
            this.validateUserDetails(userDetails as userRegistrationDetail);    

            // hashing the password 
            const hashedPassword = this.cipher.hash(userDetails.password as string);


            //Encrypting the api details
            // const encryptedDetails = await this.encryptSensitiveDetails(userDetails);
            
            //Create the userData which needs to saved to the DB 
            const DBUserData = {
                username : userDetails.username,
                password : hashedPassword,
            }

            // Saving the userDetails in the Database
            await this.storage.insertOne("users", DBUserData);
        
            // Returning a Success Response
            return new SuccessResponse(SUCCESSFULL_CODE, "Database Insert", "Registration Complete successfully")

     

    }
    async userLogin (userDetails : IUserLogin) : Promise<SuccessResponse>{
        // Check if the user Exist or Not
        try {
            const result = await this.storage.findOne("users", undefined, {username : userDetails.username});
            if(result.rows[0] === undefined) throw new InvalidUserDetailError("Invalid username and password", UNAUTHORIZED_STATUS_CODE);
            // if Exist compare the has
            const hashMatch = this.cipher.compareHash(userDetails.password, result.rows[0].password);
            if(!hashMatch) throw new InvalidUserDetailError("Invalid username or password", UNAUTHORIZED_STATUS_CODE);
            // create JWT 
            const token = this.token.getToken(result.rows[0].username);
            // send the SuccessResponse
            return new SuccessResponse(SUCCESSFULL_CODE, "Authentication Done", "login successful", undefined, {token});
        } catch (error) {

            // Make the error more generic If DatabaseError or CipherError is throw then log it and Throw a more generic error
               if (error instanceof InvalidUserDetailError) {
                    throw error;
                }

                if(error instanceof DatabaseError || error instanceof CipherError) {
                    console.error(error) // Change this to Logging functionallity
                    throw new InternalServerError("Internal Server Error");
                }
            throw new UnknownError("Internal server error", "Kindly check the userLogin function ");
        }
    }

    private validateUserDetails(userDetails : userRegistrationDetail){
        const requiredFields = ["username", "password"];
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