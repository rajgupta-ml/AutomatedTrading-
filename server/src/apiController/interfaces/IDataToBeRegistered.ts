export interface IDataToBeRegistered{
    userID : string,
    brokerName : string,
    brokerClientId : string,
    brokerClientSecret : string,
    brokerRedirectURI : string,
    extraData? : Record<string , string | number>,
}