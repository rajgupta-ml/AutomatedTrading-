import { Response } from "../../apiController/success/Response.success";

export interface IBrokers {
	getOAuthURI(brokerName: string, userId: string, token: string): Promise<Response>;
}
