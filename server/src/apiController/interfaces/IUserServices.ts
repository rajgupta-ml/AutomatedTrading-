import { Response } from "../success/Response.success";
import { IUserLogin, userRegistrationDetail } from "./IAuthController";
import { IDataToBeRegistered } from "./IDataToBeRegistered";


export interface IUserServices {
    userRegister (userDetails : userRegistrationDetail) : Promise<Response>
    userLogin (userDetails : IUserLogin) : Promise<Response>
    brokerRegistration(DataToBeRegistered : IDataToBeRegistered, token : string) : Promise<Response> 
}