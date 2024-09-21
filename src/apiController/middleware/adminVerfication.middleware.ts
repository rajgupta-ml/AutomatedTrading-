import express from "express"
export function adminVerficationMiddleware(request: express.Request, response: express.Response, next: express.NextFunction) {
    const { password } = request.body;

    if (!(password === process.env.PASSWORD)) {
        response.status(403).json({
            success: false,
            name: "Not a Authenicated user",
        })
    }
    next();
}
