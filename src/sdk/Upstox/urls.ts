const baseURL = "https://api.upstox.com/v2";
const authorizationURL = `${baseURL}/login/authorization/token`
const authenticationURL = `${baseURL}/login/authorization/dialog`
const getUserDetails = `${baseURL}/user/profile`
const getFundAndMargin = `${baseURL}/user/get-funds-and-margin`;
export {
	authorizationURL, authenticationURL, getUserDetails, getFundAndMargin
}

