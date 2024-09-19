import { ErrorAndSuccessInterface } from "../interfaces/IErrorAndSuccess";

export class UnauthorizedUser extends Error implements ErrorAndSuccessInterface{
    success : boolean
    statusCode: number;
    details?: string | undefined;
    data? : Record<string, string>  | undefined

    constructor(message : string, details? : string, data? : Record <string, string>){
        super(message),
        this.statusCode = 401,
        this.details = details,
        this.success = false,
        this.data = data
    }

    
} 