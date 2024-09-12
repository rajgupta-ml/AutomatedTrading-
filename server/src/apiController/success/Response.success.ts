import { ErrorAndSuccessInterface } from "../interfaces/IErrorAndSuccess";

export class Response implements ErrorAndSuccessInterface {
    public success: Boolean;
    public statusCode: number;
    public details?: string;
    public name: string;
    public message: string;
    public data?: {
        token?: string,
        userId?: string,
        OAuthURI?: URL,
    }


    constructor(
        statusCode: number,
        name: string,
        message: string,
        details?: string,
        data?: { token?: string, userId?: string, OAuthURI?: URL }
    ) {
        this.success = true;
        this.statusCode = statusCode;
        this.name = name;
        this.message = message
        this.details = details;
        this.data = data
    }
}
