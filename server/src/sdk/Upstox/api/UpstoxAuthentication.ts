
import { IAuthentication, IUpstoxResponse } from "../interfaces/IUpstox"
import { IUpstoxGetAccessToken, IUpstoxGetOAuthURI } from "../../Upstox/interfaces/IUpstox"
import { BadRequestUpstoxError } from "../errors/UpstoxError"
import { IHttpClient } from "../interfaces/IHttpClient"
import { authenticationURL, authorizationURL } from "../urls"


export class UpstoxAuthentication implements IAuthentication {

	//TODO : Handling the Unknow errors which would occur

	private httpClient: IHttpClient
	constructor(httpClient: IHttpClient) {
		this.httpClient = httpClient;
	}
	getOAuthURI(params: IUpstoxGetOAuthURI): URL {
		const { clientId, redirectURI } = params
		if (!clientId || !redirectURI) throw new BadRequestUpstoxError("ClientId and RedirectURI is required");
		const urlParams = new URLSearchParams({
			response_type : 'code',
			client_id : clientId,
			redirect_uri : redirectURI,
		})
		const OAuthURI = new URL(`${authenticationURL}?${urlParams}`)

		return OAuthURI;
	}

	async getAccessToken(params: IUpstoxGetAccessToken): Promise<IUpstoxResponse> {
		const { code, clientId, clientSecret, redirectURI } = params

		if (!code || !clientId || !clientSecret || !redirectURI) throw new BadRequestUpstoxError("Bad Request, Required Field empty");

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
		const response: IUpstoxResponse = await this.httpClient.post(authorizationURL, data, config);
		return response
	}
}
