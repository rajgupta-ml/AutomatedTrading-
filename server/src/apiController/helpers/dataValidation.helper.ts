import { InvalidUserDetailError } from "../errors/InvalidUserDetails.error";
import { BAD_REQUEST_CODE } from "../statusCode/statusCode";

export function validateUserDetails(userDetails: Record<string, any>, requiredFields: Array<string>) {
    requiredFields.map((requiredField) => {
        if (!userDetails[requiredField])
            throw new InvalidUserDetailError(`${requiredField} is required`, BAD_REQUEST_CODE, "BAD REQUEST");
    })
}

