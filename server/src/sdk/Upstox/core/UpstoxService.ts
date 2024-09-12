import { UpstoxAuthentication } from "../api/UpstoxAuthentication";
import { IUpstoxServices, IAuthentication } from "../interfaces/IUpstox";

export class UpstoxServices implements IUpstoxServices {
	private authentication: UpstoxAuthentication
	constructor() {

		this.authentication = new UpstoxAuthentication();
	}
	getAuthenticated(): IAuthentication {
		return this.authentication;
	}
}
