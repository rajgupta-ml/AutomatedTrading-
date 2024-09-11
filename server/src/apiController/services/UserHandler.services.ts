import { ICipher } from "../interfaces/ICipher";
import { IStorage } from "../interfaces/IStorage";
import { Response } from "../success/Response.success";
import { BAD_REQUEST_CODE, SUCCESSFULL_CODE, UNAUTHORIZED_STATUS_CODE } from "../statusCode/statusCode";
import { InvalidUserDetailError } from "../errors/InvalidUserDetails.error";
import { IUserServices } from "../interfaces/IUserServices";
import { ITokenizer } from "../interfaces/ITokenizer";
import { IUserLogin, userRegistrationDetail } from "../interfaces/IAuthController";
import { DatabaseError } from "../errors/Database.error";
import { CipherError } from "../errors/Cipher.error";
import { UnknownError } from "../errors/Unknown.error";
import { InternalServerError } from "../errors/InternalServer.error";
import { IDataToBeRegistered } from "../interfaces/IDataToBeRegistered";
import { JsonWebTokenError } from "jsonwebtoken";
import { UnauthorizedUser } from "../errors/UnauthorizedUser.error";
import { json } from "express";

export class UserServices implements IUserServices {
    private cipher : ICipher
    private storage : IStorage
    private token : ITokenizer

    constructor(storage : IStorage, cipher : ICipher, token : ITokenizer){
        this.cipher = cipher;
        this.storage = storage;
        this.token = token
    }

        async userRegister (userDetails : userRegistrationDetail) : Promise<Response> {


            try {
                const validateUserDetails : Record<string, string> = {...userDetails}
                // console.log(validateUserDetails);
                //Validating the required field
                this.validateUserDetails(validateUserDetails, ["username" ,"password"]);    
    
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
                return new Response(SUCCESSFULL_CODE, "Database Insert", "Registration Complete successfully")
                
            } catch (error) {
                if(error instanceof InvalidUserDetailError || error instanceof UnknownError){
                    throw error
                }
                console.error(error) // Changes this to a logger
                throw new InternalServerError("Internal Server Error");
            }
                

     

    }
    async userLogin (userDetails : IUserLogin) : Promise<Response>{
        // Check if the user Exist or Not
        try {

            const validateUserDetails : Record<string, any> = {...userDetails};
            this.validateUserDetails(validateUserDetails, ["username", "password"]);    
            const result = await this.storage.findOne("users", undefined, {username : userDetails.username});
            if(result.rows[0] === undefined) throw new InvalidUserDetailError("Invalid username and password", UNAUTHORIZED_STATUS_CODE);
            // if Exist compare the has
            const hashMatch = this.cipher.compareHash(userDetails.password, result.rows[0].password);
            if(!hashMatch) throw new InvalidUserDetailError("Invalid username or password", UNAUTHORIZED_STATUS_CODE);
            // create JWT 
            const token = this.token.getToken(result.rows[0].username);
            // send the Response
            return new Response(SUCCESSFULL_CODE, "Authentication Done", "login successful", undefined, {token, userId : result.rows[0].userID});
        } catch (error) {
            // Make the error more generic If DatabaseError or CipherError is throw then log it and Throw a more generic error
            if (error instanceof InvalidUserDetailError) {
                throw error;
            }
            
            if(error instanceof DatabaseError || error instanceof CipherError) {
                console.log(error);
                throw new InternalServerError("Internal Server Error");
                }
                    // Change this to Logging functionallity
                throw new UnknownError("Internal server error", "Kindly check the userLogin function ");
        }
    }


    async brokerRegistration(dataToBeRegistered : IDataToBeRegistered, token : string): Promise<Response>{
        try {
            const validateUserDetails : Record<string, any> = {...dataToBeRegistered}
            this.validateUserDetails(validateUserDetails, ["userID", "brokerName", "brokerClientId", "brokerClientSecret", "brokerRedirectURI"])
            // Verify Jwt token 
            const {newToken} = this.token.verifyAndRefreshToken(token);

            //Encrypt the DataToBe Registered;
            let DataToBeSaved : Record<string, string>= {}
            await Promise.all(Object.entries(dataToBeRegistered)
                .filter(([key]) => key != "userID" && key != "brokerName")
                .map(async ([key, value]) => {
                    DataToBeSaved[key] = await this.cipher.encrypt(value)

                }))
            const extraData = dataToBeRegistered.extraData ? JSON.stringify(dataToBeRegistered.extraData) : undefined;

            // TODO : For extraData check if it require's encryption or not if required encrypt those field then stringfy it
            DataToBeSaved = {
                ...DataToBeSaved,
                userID : dataToBeRegistered.userID,
                brokerName : dataToBeRegistered.brokerName,
                ...(extraData && {extraData})
            }

            //Save the data in the Database 
            await this.storage.insertOne("userBrokers", DataToBeSaved)
            // Return The response
            return new Response(200, "BrokerRegistration", "BrokerRegistrationComplete",undefined, {token : newToken});
        } catch (error) {
            if(error instanceof JsonWebTokenError){
                throw new UnauthorizedUser("Unauthorized user");
            }
            if(error instanceof DatabaseError || error instanceof UnknownError || error instanceof InvalidUserDetailError){
                throw error;
            }

            throw new UnknownError("Internal server error", "Kindly check the userLogin function ");
        }
    }

    private validateUserDetails(userDetails : Record<string, any>, requiredFields : Array<string>){
        requiredFields.map((requiredField) => {
            if(!userDetails[requiredField]) 
                throw new InvalidUserDetailError(`${requiredField} is required`, BAD_REQUEST_CODE, "BAD REQUEST");
        })
    }
}