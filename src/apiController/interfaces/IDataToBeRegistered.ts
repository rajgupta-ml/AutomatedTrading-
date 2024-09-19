export interface IDataToBeRegistered{
    userID : string,
    brokerName : string,
    userClientId : string,
    userClientSecret : string,
    userRedirectURI : string,
    extraData? : Record<string , string | number>,
}