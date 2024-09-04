import { Client, QueryResult } from 'pg';
import { DatabaseError } from '../errors/Database.error';
import { PostgresError } from '../typesAndInterfaces/Postgress.types';
import { UnknownError } from '../errors/Unknown.error';
import { BAD_REQUEST_CODE, INTERNAL_SERVER_CODE } from '../statusCode/statusCode';
import { IStorage } from '../typesAndInterfaces/IStorage';

class DatabaseManager implements IStorage {
    // Private constructor to prevent instantiation

    private readonly user : string | undefined;
    private readonly host : string | undefined;
    private readonly database : string | undefined;
    private readonly password : string | undefined;
    private readonly port : number | undefined;
    private static instance : DatabaseManager | null= null
    private static client : Client | null = null;
    private constructor() {
        // Initialization The database Details
        this.user = process.env.PG_USER ;
        this.host = process.env.PG_HOST;
        this.database = process.env.PG_DATABASE;
        this.password = process.env.PG_PASSWORD;
    }


    public static getInstance() :DatabaseManager {
        if(!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }
        return DatabaseManager.instance;
    }

    private getClient() : Client{
        if(!DatabaseManager.client){
            DatabaseManager.client = new Client({
                user : this.user,
                host : this.host,
                database : this.database,
                password : this.password,
                port : this.port,
                
            })
        }
        return DatabaseManager.client;
    }

    public async connect(): Promise<void> {
        const client = this.getClient();
        try {
            await client.connect();
            await this.createTableIfNotExist();
            console.log('Connected to the database successfully.');
        } catch (err) {
            console.log(err);
            throw new DatabaseError("Internal Server Error", INTERNAL_SERVER_CODE, "Could not connect to the DB");
        }
    }

    public async disconnect(): Promise<void> {
        try {
            const client = DatabaseManager.client;

            if(!client) throw new DatabaseError("Internal Server Error", INTERNAL_SERVER_CODE, "Could not connect to the DB");
            await client.end();
            DatabaseManager.client = null;
            console.log('Disconnected from the database successfully.');
        } catch (err) {
           throw new DatabaseError("Internal Server Error", INTERNAL_SERVER_CODE, "Disconnect Unsuccessful");
        }
    }

    private async createTableIfNotExist () {
        try {
            const client = DatabaseManager.client;
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
            const client = DatabaseManager.client;
            if(!client) throw new DatabaseError("Internal Server Error", INTERNAL_SERVER_CODE, "Could not connect to the DB");
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
            throw new UnknownError("Internal Server Error");
        }
        return result;
    }


}

export default DatabaseManager;
