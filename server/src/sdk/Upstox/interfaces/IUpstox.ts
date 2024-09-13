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
}


//This types can be combined with other broker params requirement.
export interface IAuthentication {
	getOAuthURI(params: IUpstoxGetOAuthURI): URL
	getAccessToken(params: IUpstoxGetAccessToken): Promise<IUpstoxResponse>
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

