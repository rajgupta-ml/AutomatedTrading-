import { QueryResult } from "pg";

export interface IStorage {

    insertOne(tableName : string, dataToBeSaved : Record<string, any>) : Promise<QueryResult>
    updateOne (
        tableName: string, 
        updateColumn: string, 
        updateValue: string, 
        conditionColumnAndValues: Record<string, string>, 
        LogicalOperator?: Array<string>
    ): Promise<QueryResult>

    findOne(
        tableName: string,
        columnSeleted?: Array<string>,
        condition?: Record<string, string>,
        logical?: Array<string>
    ): Promise<QueryResult<any>>

    deleteOne(
        tableName: string,
        conditionColumnAndValues: Record<string, string>,
        LogicalOperator?: Array<string>
    ): Promise<QueryResult<any>>

    executeRawSQL(query: string, values?: any[]): Promise<QueryResult<any>>
}