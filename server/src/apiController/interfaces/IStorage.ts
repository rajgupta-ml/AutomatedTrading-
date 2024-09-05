import { QueryResult } from "pg";

export interface IStorage {
    insertOne(tableName : string, dataToBeSaved : Record<string, string>) : Promise<QueryResult>
    updateOne (
        tableName: string, 
        updateColumn: string, 
        updateValue: string, 
        conditionColumnAndValues: Record<string, string>, 
        LogicalOperator?: Array<string>
    ): Promise<QueryResult>
}