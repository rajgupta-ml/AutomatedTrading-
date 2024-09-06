import express from "express";

export interface IAuthController {
    userRegister (request: express.Request, response : express.Response, next : express.NextFunction) : Promise <void>
    userLogin (request: express.Request, response : express.Response, next : express.NextFunction) : Promise <void>
}

export interface userRegistrationDetail {
    username : string,
    password : string,
    redirectURI : string,
    clientId : string
    clientSecret : string
}

export interface IUserLogin{
    username : string,
    password : string,
}