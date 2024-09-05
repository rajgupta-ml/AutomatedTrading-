import { ErrorAndSuccessInterface } from "../interfaces/IErrorAndSuccess";

export class SuccessResponse implements ErrorAndSuccessInterface {
    public success : Boolean;
    public statusCode: number;
    public details?: string | undefined;
    public name: string;
    public message: string;
    public data? : Record<string, string>
    
    
    constructor(
        statusCode : number, 
        name : string,
        message : string,
        details? : string,
        data? : Record <string, string>
     ){
        this.success = true;
        this.statusCode = statusCode;
        this.name = name;
        this.message = message
        this.details = details;
        this.data = data 
    }
}