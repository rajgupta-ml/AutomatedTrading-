
import { IAuthentication, IUpstoxResponse } from "../interfaces/IUpstox"
import { IUpstoxGetAccessToken, IUpstoxGetOAuthURI } from "../../Upstox/interfaces/IUpstox"
import { BadRequestUpstoxError } from "../errors/UpstoxError"
import { IHttpClient } from "../interfaces/IHttpClient"
import { HttpClient } from "../core/HttpClient"


export class UpstoxAuthentication implements IAuthentication {

	//TODO : Handling the Unknow errors which would occur

	private httpClient: IHttpClient
	constructor() {
		this.httpClient = new HttpClient();
	}
	getOAuthURI(params: IUpstoxGetOAuthURI): URL {
		const { clientId, redirectURI } = params
		if (!clientId || !redirectURI) throw new BadRequestUpstoxError("ClientId and RedirectURI is required");
		const OAuthURI = new URL(`
		https://api.upstox.com/v2/login/authorization/dialog?response_type=code&client_id=${clientId}&redirect_uri=${redirectURI}
		`)

		return OAuthURI;
	}

	async getAccessToken(params: IUpstoxGetAccessToken): Promise<IUpstoxResponse> {
		const { code, clientId, clientSecret, redirectURI } = params

		if (!code || !clientId || !clientSecret || !redirectURI) throw new BadRequestUpstoxError("Bad Request, Required Field empty");

		const URI = 'https://api.upstox.com/v2/login/authorization/token'
		const data = {
			code,
			client_id: clientId,
			client_secret: clientSecret,
			redirect_uri: redirectURI,
			grant_type: "authorization_code",
		}


		const config = {
			headers: {
				'accept': 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded',
			}
		}
		const response : IUpstoxResponse = await this.httpClient.post(URI, data, config);
		return response
	}
}
