export interface PostgresError extends Error {
    code: string;
    detail?: string;
    constraint?: string;
    schema?: string;
    table?: string;
    column?: string;
    dataType?: string;
    file?: string;
    line?: string;
    routine?: string;
    message : string;
}


export interface errorResponseHandler {
    statusCode : number
    errorBody : {
        success : Boolean;
        name : string
        description : string | undefined
        details : string | undefined
        data : Record<string, string>
    }
}
