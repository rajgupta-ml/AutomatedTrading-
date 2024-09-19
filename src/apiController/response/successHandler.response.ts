import express from 'express';
import { Response } from '../success/Response.success';
import { UnauthorizedUser } from '../errors/UnauthorizedUser.error';

export const responseHandlerForSuccess = (response : express.Response , success: Response | UnauthorizedUser) => {
    if(success.data?.token){
        response.cookie("set-cookie", success.data?.token, {
            httpOnly : false,
            sameSite : "none",
            secure : false,
            maxAge : 24 * 60 * 60 * 1000,
        })
    }
    response.status(success.statusCode).json({
        success : success.success,
        statusCode : success.statusCode,
        name : success.name,
        message: success.message,
        details : success.details,
        data : success.data,
    });
}



