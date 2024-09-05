import { Client, QueryResult } from 'pg';
import { DatabaseError } from '../errors/Database.error';
import { UnknownError } from '../errors/Unknown.error';
import { BAD_REQUEST_CODE, INTERNAL_SERVER_CODE } from '../statusCode/statusCode';
import { IStorage } from '../interfaces/IStorage';

class DatabaseServices implements IStorage {
    // Private constructor to prevent instantiation

    private readonly user : string | undefined;
    private readonly host : string | undefined;
    private readonly database : string | undefined;
    private readonly password : string | undefined;
    private readonly port : number | undefined;
    private static instance : DatabaseServices | null= null
    public static client : Client | null = null;
    private constructor() {
        // Initialization The database Details
        this.user = process.env.PG_USER ;
        this.host = process.env.PG_HOST;
        this.database = process.env.PG_DATABASE;
        this.password = process.env.PG_PASSWORD;
    }


    public static getInstance() :DatabaseServices {
        if(!DatabaseServices.instance) {
            DatabaseServices.instance = new DatabaseServices();
        }
        return DatabaseServices.instance;
    }

    private getClient() : Client{
        if(!DatabaseServices.client){
            DatabaseServices.client = new Client({
                user : this.user,
                host : this.host,
                database : this.database,
                password : this.password,
                port : this.port,
                
            })
        }
        return DatabaseServices.client;
    }

    public async connect(): Promise<void> {
        const client = this.getClient();
        try {
            await client.connect();
            // await this.createTableIfNotExist();
            console.log('Connected to the database successfully.');
        } catch (err) {
            console.log(err);
            throw new DatabaseError("Internal Server Error", INTERNAL_SERVER_CODE, "Could not connect to the DB");
        }
    }

    public async disconnect(): Promise<void> {
        try {
            const client = DatabaseServices.client;

            if(!client) throw new DatabaseError("Internal Server Error", INTERNAL_SERVER_CODE, "Could not connect to the DB");
            await client.end();
            DatabaseServices.client = null;
            console.log('Disconnected from the database successfully.');
        } catch (err) {
           throw new DatabaseError("Internal Server Error", INTERNAL_SERVER_CODE, "Disconnect Unsuccessful");
        }
    }

    private async createTableIfNotExist () {
        try {
            const client = DatabaseServices.client;
            if(!client) throw new DatabaseError("Internal Server Error", INTERNAL_SERVER_CODE, "Could not connect to the DB");
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS users (
                    userID SERIAL PRIMARY KEY,
                    username VARCHAR(50) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    redirectURI VARCHAR(255) NOT NULL,
                    clientID VARCHAR(255) NOT NULL,
                    clientSecret VARCHAR(255) NOT NULL
                );
            `;
            await client.query(createTableQuery);
        } catch (error) {
           throw new DatabaseError("Internal Server Error", INTERNAL_SERVER_CODE, "Table Creation Unsuccesfull");
        }
    }

    public async insertOne  (tableName : string, dataToBeSaved : Record<string, string>) : Promise<QueryResult<any>> {
        let result : QueryResult<any>;
        try {      
            const client = DatabaseServices.client;
            if(client === null) throw new DatabaseError("Internal Server Error", INTERNAL_SERVER_CODE, "Could not connect to the DB");
            //Table name and object    
            const keys : string[] = [];
            const values : string[] = [];
            const placeholders : string[] = [];
            Object.entries(dataToBeSaved).map(([key, value], index) => {
                keys.push(key);
                values.push(value);
                 placeholders.push(`$${index + 1}`);
            })
    
            const stringKeys = keys.join(",")
            const query = `INSERT INTO ${tableName}(${stringKeys}) VALUES (${placeholders.join(",")}) RETURNING *`;
            result = await client.query(query, values);
        } catch (error) {
            if(error instanceof Error && 'code' in error){

                throw new DatabaseError (error.message, BAD_REQUEST_CODE, "BAD REQUEST (Could Not Insert The data)");
            }
            if (error instanceof DatabaseError) {
                throw error;
            }
                throw new UnknownError("Internal Server Error");
            
        }
        return result;
    }

    public async updateOne (
        tableName: string, 
        updateColumn: string, 
        updateValue: string, 
        conditionColumnAndValues: Record<string, string>, 
        LogicalOperator?: Array<string>
    ): Promise<QueryResult<any>>
    {
        let result: QueryResult<any>;

        try {
            const client = DatabaseServices.client;
            console.log(client)
            if (!client) throw new DatabaseError("Internal Server Error", INTERNAL_SERVER_CODE, "Could not connect to the DB");

            // Creating condition query with placeholders to avoid SQL injection
            const conditionEntries = Object.entries(conditionColumnAndValues);
            const conditions = conditionEntries.map(([key, value], index) => {
                const logicalOp = LogicalOperator && LogicalOperator[index] ? LogicalOperator[index] : 'AND';
                return `${key} = $${index + 2} ${index < conditionEntries.length - 1 ? logicalOp : ''}`;  // $ placeholders
            }).join(' ');

            // Constructing the query with parameterized values
            const updateQuery = `
                UPDATE ${tableName}
                SET ${updateColumn} = $1
                WHERE ${conditions}`;

            // Gathering values for the query
            const values = [updateValue, ...conditionEntries.map(([_, value]) => value)];
            console.log(updateQuery);
            console.log(values);
            // Execute the query
            result = await client.query(updateQuery, values); // Parameterized query execution

        } catch (error) {
            if (error instanceof Error && 'code' in error) {
                throw new DatabaseError(error.message, BAD_REQUEST_CODE, "BAD REQUEST (Could Not Update the Data)");
            }
            if (error instanceof DatabaseError) {
                throw error;
            }
            throw new UnknownError("Internal Server Error");
        }

        return result;
    }


}

export default DatabaseServices;
