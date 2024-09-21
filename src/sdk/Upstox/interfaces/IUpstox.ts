
export interface IUpstoxGetOAuthURI {
	clientId: string;
	redirectURI: string;
}

export interface IUpstoxGetAccessToken {
	code: string;
	clientId: string;
	clientSecret: string;
	redirectURI: string;
}

export interface IUpstoxServices {
	getAuthenticated(): IAuthentication;
	getUserDetails(): IUserDetails;
}


//This types can be combined with other broker params requirement.
export interface IAuthentication {
	getOAuthURI(params: IUpstoxGetOAuthURI): URL
	getAccessToken(params: IUpstoxGetAccessToken): Promise<IUpstoxResponse>
}


export interface IUserDetails {
	getProfileDetails(access_token: string): Promise<any>;
	getFundAndMargin(access_token: string): Promise<any>;
}


export interface IUpstoxResponse {
	email: string,
	exchanges: Array<string>,
	products: Array<string>,
	broker: string,
	user_id: string,
	user_name: string,
	order_types: string,
	user_type: string,
	poa: boolean,
	is_active: boolean,
	access_token: string,
	extended_token?: string

}

export interface IUpstoxGetProfileDetailsResponse {

	status: string,
	data: {
		equity: {
			used_margin: number,
			payin_amount: number,
			span_margin: number,
			adhoc_margin: number,
			notional_cash: number,
			available_margin: number,
			exposure_margin: number
		}
	}
}
