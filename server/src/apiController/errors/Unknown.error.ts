import { ErrorAndSuccessInterface } from "../interfaces/IErrorAndSuccess";

export class UnknownError extends Error implements ErrorAndSuccessInterface {

    public statusCode: number;
    public details?: string;

    constructor(description: string, details?: string) {
        super(description);
        this.statusCode = 500;
        this.name = "UnknownError";
        this.details = details;
    }
}