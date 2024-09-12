import { ErrorAndSuccessInterface } from "../interfaces/IErrorAndSuccess";


export class BrokerServiceError extends Error implements ErrorAndSuccessInterface {
    statusCode: number;
    details?: string | undefined;
    constructor(message: string, statusCode: number, details?: string) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}

