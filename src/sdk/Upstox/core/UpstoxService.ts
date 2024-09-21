import { UpstoxAuthentication } from "../api/UpstoxAuthentication";
import { UpstoxUserDetails } from "../api/UpstoxUserDetails";
import { IHttpClient } from "../interfaces/IHttpClient";
import { IUpstoxServices, IAuthentication, IUserDetails } from "../interfaces/IUpstox";
import { HttpClient } from "./HttpClient";

export class UpstoxServices implements IUpstoxServices {
	private authentication: UpstoxAuthentication
	private user: UpstoxUserDetails
	private httpClient: IHttpClient;
	constructor() {
		this.httpClient = new HttpClient();
		this.user = new UpstoxUserDetails(this.httpClient);
		this.authentication = new UpstoxAuthentication(this.httpClient);
	}
	getAuthenticated(): IAuthentication {
		return this.authentication;
	}


	getUserDetails(): IUserDetails {
		return this.user;
	}

}
