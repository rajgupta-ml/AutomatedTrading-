import express from 'express';
import { SuccessResponse } from '../success/Response.success';

export const responseHandlerForSuccess = (response : express.Response , success: SuccessResponse) => {
    response.status(success.statusCode).json({
        success : success.success,
        statusCode : success.statusCode,
        name : success.name,
        message: success.message,
        details : success.details,
        data : success.data,
    });
}