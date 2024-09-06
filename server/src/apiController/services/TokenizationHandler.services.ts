import { UnknownError } from "../errors/Unknown.error";
import { ITokenizer } from "../interfaces/ITokenizer";
import jwt, { JsonWebTokenError, JwtPayload, SignOptions, VerifyOptions } from "jsonwebtoken";
import * as crypto from 'crypto';
//Pratices Which needs to followed using the JWT
/*  -- Don't put sensitive information in the JWT token
    -- Secure algorithm ES256
    -- Added the refresh token so that no one can use the token 
*/


export class TokenizationServices{
    private readonly tokenSecret :{publicKey : crypto.KeyObject, privateKey : crypto.KeyObject};
    private readonly issuer : string;
    private readonly tokenExpiration : number;
    private readonly refreshThreshold: number;
    private readonly __config__ : SignOptions ; 
    constructor () {

        this.tokenSecret = this.generateToken();
        this.issuer = process.env.ISSUER || `automatedTrading${crypto.randomBytes(16).toString("hex")}`
        this.tokenExpiration =  Number(new Date(Date.now() + 1000 * 60 * 5));
        this.refreshThreshold = Number(process.env.REFRESH_THRESHOLD) || 1000;
        this.__config__ = {
            algorithm : 'ES256',
            expiresIn: this.tokenExpiration,
            issuer: this.issuer,
        }
        
    }


    private generateToken() : {publicKey : crypto.KeyObject, privateKey : crypto.KeyObject}{
        // converting the key into pem Format
        const {publicKey, privateKey} = crypto.generateKeyPairSync("ec", {namedCurve : "P-256"})
        return { publicKey, privateKey };

    }   



    public getToken (username : string) : string {  
        let token;
        if(!username) throw new JsonWebTokenError("username Not defined");
        try {
            return token = jwt.sign({username}, this.tokenSecret.privateKey, this.__config__); 
            
        } catch (error) {
            if(error instanceof JsonWebTokenError){
                throw error;
            }

            throw new UnknownError("Internal server error", "Got it from getToken");
        }
        return token;
    }

    public verifyAndRefreshToken(token : string, ) : {tokenVerified : Boolean, newToken? : string} {

        try {         
            const payload = jwt.verify(token, this.tokenSecret.publicKey, {
                 algorithms: ['ES256'],
                 issuer: this.issuer
             }) as JwtPayload
 
             const ExpirationTime = payload.exp as number;
             console.log(`ExpTime : ${ExpirationTime}`);
             const nowInSeconds = Math.floor(Date.now() / 1000);
             console.log(`NowInSeconds : ${nowInSeconds}`);
             const timeLeftToExpire = ExpirationTime - nowInSeconds;
             console.log(`timeLeftToExpire : ${timeLeftToExpire}`);
             console.log(`flag : ${timeLeftToExpire <= this.refreshThreshold}`);
             if(timeLeftToExpire <= this.refreshThreshold){
                 const newToken = this.getToken(payload.username);
                 return {tokenVerified : true, newToken};
             }
 
             return {tokenVerified : true};
        } catch (error) {
            if(error instanceof JsonWebTokenError){
                throw new JsonWebTokenError("illegal JWT", error);
            }
            throw new UnknownError("Internal Server Error", "TokenizationHandler Threw This error");
        }

    }

}