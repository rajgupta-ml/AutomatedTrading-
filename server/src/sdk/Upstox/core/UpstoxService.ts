import { WebSocket } from "ws";
import { UpstoxAuthentication } from "../api/UpstoxAuthentication";
import { UpstoxUserDetails } from "../api/UpstoxUserDetails";
import { IHttpClient } from "../interfaces/IHttpClient";
import { IUpstoxServices, IAuthentication, IUserDetails } from "../interfaces/IUpstox";
import { HttpClient } from "./HttpClient";
import { UpstoxWebsocket } from "../api/UpstoxWebsocket";
import { UpstoxUnknownError } from "../errors/UpstoxUnknownError";

export class UpstoxServices implements IUpstoxServices {
	private authentication: UpstoxAuthentication
	private user: UpstoxUserDetails
	private httpClient: IHttpClient;
	private UpstoxWebsocket: UpstoxWebsocket
	constructor() {
		this.httpClient = new HttpClient();
		this.user = new UpstoxUserDetails(this.httpClient);
		this.authentication = new UpstoxAuthentication(this.httpClient);
		this.UpstoxWebsocket = new UpstoxWebsocket(this.httpClient);
	}
	getAuthenticated(): IAuthentication {
		return this.authentication;
	}


	getUserDetails(): IUserDetails {
		return this.user;
	}

	async getMarketData(access_token: string): Promise<WebSocket> {
		try {
			const response = await this.UpstoxWebsocket.getMarketFeedURI(access_token);
			console.log(response);
			const ws = await this.UpstoxWebsocket.connectToUpstoxWithWs(response.data.authorized_redirect_uri, access_token);
			return ws;
		} catch (error) {
			if (error instanceof UpstoxUnknownError) throw error;
			throw new UpstoxUnknownError("Internal server error", "getMarketData Error", JSON.stringify(error) as string);
		}
	}
}
