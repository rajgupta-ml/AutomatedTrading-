import { IBrokers } from "../interfaces/Ibroker"
import { UpstoxServices } from "../../sdk/Upstox/core/UpstoxService"
import { ITokenizer } from "../interfaces/ITokenizer";
import { IStorage } from "../interfaces/IStorage";
import { BrokerServiceError } from "../errors/BrokerService.Error";
import { ICipher } from "../interfaces/ICipher";
import { Response } from "../success/Response.success";
import { UnknownError } from "../errors/Unknown.error";
import DatabaseServices from "./DatabaseHandler.services";
import { CipherError } from "../errors/Cipher.error";
import { JsonWebTokenError } from "jsonwebtoken";


interface BrokerData{
    [key : string] : string
}
export class BrokerService implements IBrokers {
    private storage: IStorage;
    private token: ITokenizer;
    private cipher: ICipher;
    // TODO: Make A union type of all the accepted brokers
    private broker?: UpstoxServices;
    constructor(storageInstance: IStorage, tokenInstance: ITokenizer, cipher: ICipher) {
        this.storage = storageInstance;
        this.token = tokenInstance;
        this.cipher = cipher;
    }

    async getOAuthURI(brokerName: string, userID: string, token: string): Promise<Response> {

        try {
            //JWT verification
            const { newToken } = this.token.verifyAndRefreshToken(token);
            // broker selected not not check
            if (!this.broker) throw new BrokerServiceError("Broker not decided Yet", 400);
            // Find the broker clientId and redirect URI where userId and brokerName matches;
            const databaseResult = await this.storage.findOne("userBrokers", ["userClientId", "userRedirectURI"], { brokerName, userID }, ["AND"]);

            // broker registered with client or not check;
            if (!databaseResult.rows[0]) throw new BrokerServiceError("Broker is not registered", 400);
            
            //Encrypt the clientID and redirectURI
            let data : BrokerData = {}
           await Promise.all(Object.entries(databaseResult.rows[0]).map(async ([key, value]) => {
                data[key] = await this.cipher.decrypt(value as string);
            }))
            const {userclientid, userredirecturi} = data;
            //Getting the OAuthURI from the upstox SDK;
            const URI = this.broker.getAuthenticated().getOAuthURI({ clientId: userclientid, redirectURI: userredirecturi });
            return new Response(200, "oAuthURI", "oAuth URI generated", undefined, { OAuthURI: URI, ...(token ? { token } : {}) } );

        } catch (error) {
            console.log(error);
            if (error instanceof BrokerServiceError || error instanceof DatabaseServices || error instanceof JsonWebTokenError) {
                throw error;
            }

            if (error instanceof CipherError) {
                console.error(error);
                throw error;

            }
            throw new UnknownError("Internal Server Error");
        }
    }


    setBrokerInstance(brokerInstance: UpstoxServices) {
        this.broker = brokerInstance;
    }

    getBrokerInstance() {
        return this.broker
    }
} 
