import { ErrorAndSuccessInterface } from "../../../apiController/interfaces/IErrorAndSuccess"

export class UpstoxUnknownError extends Error implements ErrorAndSuccessInterface {

	public statusCode: number;
	public name: string;
	public details?: string;
	constructor(description: string, name: string, details?: string) {
		super(description);
		this.statusCode = 500;
		this.name = name
		this.name = "UnknownError";
		this.details = details;
	}
}

