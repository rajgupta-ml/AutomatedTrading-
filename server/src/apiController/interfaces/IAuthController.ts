import express from "express";

export interface IAuthController {
    userRegister(request: express.Request, response: express.Response, next: express.NextFunction): Promise<void>
    userLogin(request: express.Request, response: express.Response, next: express.NextFunction): Promise<void>
    brokerRegistration(request: express.Request, response: express.Response, next: express.NextFunction): Promise<void>
    getOAuthURI(request: express.Request, response: express.Response, next: express.NextFunction): Promise<void>
    getAccessToken(request: express.Request, response: express.Response, next: express.NextFunction): Promise<void>
}

export interface userRegistrationDetail {
    username: string,
    password: string,
}

export interface IUserLogin {
    username: string,
    password: string,
}
