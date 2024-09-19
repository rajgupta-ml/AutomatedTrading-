import { ErrorAndSuccessInterface } from "../../../apiController/interfaces/IErrorAndSuccess"

export class BadRequestUpstoxError extends Error implements ErrorAndSuccessInterface {
	success: boolean
	statusCode: number;
	name: string;
	details?: string | undefined;
	data?: Record<string, string> | undefined

	constructor(message: string, details?: string, data?: Record<string, string>) {
		super(message),
			this.statusCode = 400,
			this.name = "BadRequestUpstoxError"
		this.details = details,
			this.success = false,
			this.data = data
	}


}

