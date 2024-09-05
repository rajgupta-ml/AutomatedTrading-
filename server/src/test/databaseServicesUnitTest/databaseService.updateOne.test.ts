import { Client, QueryResult } from "pg";
import DatabaseServices from "../../apiController/services/DatabaseHandler.services";
import { DatabaseError } from "../../apiController/errors/Database.error";

jest.mock('pg', () => {
    const mClient = {
        query: jest.fn(),
        connect: jest.fn(),
        end: jest.fn(),
    };

    return { Client: jest.fn(() => mClient) };
});

describe("Database Update One testing", () => {
    let dbServices: DatabaseServices;
    let mockClient: jest.Mocked<Client>;
    const tableName = 'users';
    const updateColumn = 'username';
    const updateValue = 'newUsername';
    const condition = { userID: '1' }; // For example, updating user with userID=1
    const LogicalOperator = ['AND'];
    const normalizeQuery = (query: string) => query.replace(/\s+/g, ' ').trim();

    beforeEach(() => {
        dbServices = DatabaseServices.getInstance();
        dbServices.connect(); // Ensure the connection is established before each test
        mockClient = DatabaseServices.client as jest.Mocked<Client>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Update One", () => {
        it("should update the username of the client", async () => {
            // Mock result to return when query is called
            const mockResult: QueryResult<any> = {
                rows: [{ userID: 1, username: updateValue }],
                command: "UPDATE",
                rowCount: 1,
                oid: 0,
                fields: []
            };

            // Set up the mock to resolve with the mockResult
            (mockClient.query as jest.Mock).mockResolvedValueOnce(mockResult);

            // Act
            const result = await dbServices.updateOne(
                tableName,
                updateColumn,
                updateValue,
                condition,
                LogicalOperator
            );

            // Normalize function to compare query strings regardless of formatting
            const expectedQuery = `UPDATE ${tableName} SET ${updateColumn} = $1 WHERE ${Object.keys(condition).map((key, index) => `${key} = $${index + 2}`).join(' AND ')}`;

            // Retrieve actual query from the mock call
            const actualQuery = (mockClient.query as jest.Mock).mock.calls[0][0];
            const actualValues = (mockClient.query as jest.Mock).mock.calls[0][1];

            // Normalize both the expected and actual query
            expect(normalizeQuery(actualQuery)).toBe(normalizeQuery(expectedQuery));
            expect(actualValues).toEqual([updateValue, ...Object.values(condition)]);
            expect(result).toEqual(mockResult);
        });

        it('should throw DatabaseError when a database error occurs', async () => {
            const mockDbError = new Error('Simulated database error');
            (mockDbError as any).code = '23505'; // Example code for unique constraint violation

            (mockClient.query as jest.Mock).mockRejectedValueOnce(mockDbError);

            await expect(dbServices.updateOne(tableName, updateColumn, updateValue, condition))
        .rejects
        .toThrow(DatabaseError);
});
        it("If Client is null Should throw DatabaseError and Handle it.", async () => {
            DatabaseServices.client = null;

            try {
                await dbServices.updateOne(tableName, updateColumn, updateValue, condition, LogicalOperator);
            } catch (error) {
                console.error("Caught error:", error);
                expect(error).toBeInstanceOf(DatabaseError);
            }

            expect(mockClient.query).not.toHaveBeenCalled();
        });

    });
});
