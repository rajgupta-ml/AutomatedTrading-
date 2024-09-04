import { ErrorAndSuccessInterface } from "../typesAndInterfaces/errorAndSuccess.interface";

export class DatabaseError extends Error implements ErrorAndSuccessInterface {
    public statusCode: number;
    public details?: string;

    constructor(description: string, statusCode: number, details?: string) {
        super(description);
        this.statusCode = statusCode;
        this.name = "DatabaseError";
        this.details = details;
    }
}
