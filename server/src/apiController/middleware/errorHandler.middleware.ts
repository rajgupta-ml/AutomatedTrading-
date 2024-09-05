import  express from "express";
import { ErrorAndSuccessInterface } from "../interfaces/IErrorAndSuccess";
import { responseHandlerForError } from "../response/errorHandler.response";
import { INTERNAL_SERVER_CODE } from "../statusCode/statusCode";


export const errorHandler = (
    error : Error,
    request : express.Request, 
    response : express.Response,
    next : express.NextFunction
) => 
{

    if(isAppInstance(error)){
        return responseHandlerForError(response, error)
    }else{
        return response.status(INTERNAL_SERVER_CODE).json({
            success: false,
            name: error,
            description: "An unexpected error occurred.",
            details: undefined,
            data: {},
        })
    }
}



const isAppInstance = (error : Error) : error is ErrorAndSuccessInterface => {
    return (error as ErrorAndSuccessInterface).statusCode !== undefined;
}