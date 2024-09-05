import express from "express";

export interface IAuthController {
    userRegister (request: express.Request, response : express.Response, next : express.NextFunction) : Promise <void>
    userLogin (request: express.Request, response : express.Response, next : express.NextFunction) : Promise <void>
}