import { QueryResult } from "pg";

export interface IStorage {
    insertOne(tableName : string, dataToBeSaved : Record<string, string>) : Promise<QueryResult<any>>
}