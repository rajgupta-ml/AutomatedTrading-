import { IUserDetails } from "../interfaces/IUpstox";
import { BadRequestUpstoxError } from "../errors/UpstoxError"
import { IHttpClient } from "../interfaces/IHttpClient";
import { UpstoxUnknownError } from "../errors/UpstoxUnknownError";
import { getUserDetails } from "../urls";
export class UpstoxUserDetails implements IUserDetails {

	private httpClient: IHttpClient;

	constructor(httpClient: IHttpClient) {
		this.httpClient = httpClient;
	}
	async getProfileDetails(access_token: string): Promise<any> {
		try {
			const config = {
				headers: {
					'Accept': 'application/json',
					'Authorization': `Bearer ${access_token}`
				}
			}
			if (!access_token) throw new BadRequestUpstoxError("This access Token is not valid");
			const response = await this.httpClient.get(getUserDetails, config);
			return response;
		} catch (error) {
			if (error instanceof BadRequestUpstoxError) throw error;
			throw new UpstoxUnknownError("Internal Server Error", "UpstoxUnknownError");
		}
	}

	//@ts-ignore
	getFundAndMargin(access_token: string): Promise<any> {

	}

}
