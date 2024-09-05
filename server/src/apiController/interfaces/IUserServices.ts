import { SuccessResponse } from "../success/Response.success";
import { userRegistrationDetail } from "./IUserRegistrationDetails";

export interface IUserServices {
    userRegister (userDetails : userRegistrationDetail) : Promise<SuccessResponse>
}