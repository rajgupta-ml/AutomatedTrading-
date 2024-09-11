export interface ITokenizer {
    getToken (username : string) : string;
    verifyAndRefreshToken(jwt_token : string) : {newToken? : string}
}