import { SuccessResponse } from "../success/Response.success";
import { IUserLogin, userRegistrationDetail } from "./IAuthController";


export interface IUserServices {
    userRegister (userDetails : userRegistrationDetail) : Promise<SuccessResponse>
    userLogin (userDetails : IUserLogin) : Promise<SuccessResponse>
}