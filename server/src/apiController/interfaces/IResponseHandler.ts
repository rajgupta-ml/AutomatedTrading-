import { UnauthorizedUser } from "../errors/UnauthorizedUser.error";
import { Response } from "../success/Response.success";
import express from "express";
export interface IResponseHandler{
    responseHandlerForSuccess : (response : express.Response , success: Response | UnauthorizedUser) => void,
    responseHandlerForSuccessCookieSetter :(response : express.Response , success: Response | UnauthorizedUser) => void
}