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
	getAccessToken(params: IUpstoxGetAccessToken): Promise<any>

}

