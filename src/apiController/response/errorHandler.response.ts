import express from 'express';
import { ErrorAndSuccessInterface } from '../interfaces/IErrorAndSuccess';

export const responseHandlerForError = (response: express.Response, error: ErrorAndSuccessInterface) => {
    const errorStructure = {
        statusCode: error.statusCode,
        errorBody: {
            success: false,
            name: error.name,
            description: error.message,
            details: error.details,
            data: {},
        }
    }
    response.status(error.statusCode).json(errorStructure);
}
