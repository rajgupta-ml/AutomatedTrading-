import { ErrorAndSuccessInterface } from "../interfaces/IErrorAndSuccess";

export class InternalServerError extends Error implements ErrorAndSuccessInterface{
    statusCode: number;
    details?: string | undefined;

    constructor(message : string) {
        super(message);
        this.statusCode = 500;
    }   
    
}