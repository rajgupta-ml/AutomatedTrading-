import { SuccessResponse } from "../success/Response.success";
import { userRegistrationDetail } from "./IAuthController";


export interface IUserServices {
    userRegister (userDetails : userRegistrationDetail) : Promise<SuccessResponse>
}