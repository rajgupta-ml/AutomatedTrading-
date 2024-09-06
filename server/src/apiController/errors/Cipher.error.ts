import { ErrorAndSuccessInterface } from "../interfaces/IErrorAndSuccess";

export class CipherError extends Error implements ErrorAndSuccessInterface{
    statusCode: number;
    errorCode : string;
    details?: string | undefined;
    constructor(message : string, statusCode : number, errorCode : string, details? : string){
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.details = details;
    }
}