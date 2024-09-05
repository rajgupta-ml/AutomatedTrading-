"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_error_1 = require("../../src/apiController/errors/Database.error");
const DatabaseHandler_services_1 = __importDefault(require("../../src/apiController/services/DatabaseHandler.services"));
jest.mock('pg', () => {
    const mClient = {
        query: jest.fn(),
        connect: jest.fn(),
        end: jest.fn(),
    };
    return { Client: jest.fn(() => mClient) };
});
describe("Database Update One testing", () => {
    let dbServices;
    let mockClient;
    const tableName = 'users';
    const updateColumn = 'username';
    const updateValue = 'newUsername';
    const condition = { userID: '1' }; // For example, updating user with userID=1
    const LogicalOperator = ['AND'];
    const normalizeQuery = (query) => query.replace(/\s+/g, ' ').trim();
    beforeEach(() => {
        dbServices = DatabaseHandler_services_1.default.getInstance();
        dbServices.connect(); // Ensure the connection is established before each test
        mockClient = DatabaseHandler_services_1.default.client;
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("Update One", () => {
        it("should update the username of the client", () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock result to return when query is called
            const mockResult = {
                rows: [{ userID: 1, username: updateValue }],
                command: "UPDATE",
                rowCount: 1,
                oid: 0,
                fields: []
            };
            // Set up the mock to resolve with the mockResult
            mockClient.query.mockResolvedValueOnce(mockResult);
            // Act
            const result = yield dbServices.updateOne(tableName, updateColumn, updateValue, condition, LogicalOperator);
            // Normalize function to compare query strings regardless of formatting
            const expectedQuery = `UPDATE ${tableName} SET ${updateColumn} = $1 WHERE ${Object.keys(condition).map((key, index) => `${key} = $${index + 2}`).join(' AND ')}`;
            // Retrieve actual query from the mock call
            const actualQuery = mockClient.query.mock.calls[0][0];
            const actualValues = mockClient.query.mock.calls[0][1];
            // Normalize both the expected and actual query
            expect(normalizeQuery(actualQuery)).toBe(normalizeQuery(expectedQuery));
            expect(actualValues).toEqual([updateValue, ...Object.values(condition)]);
            expect(result).toEqual(mockResult);
        }));
        it('should throw DatabaseError when a database error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockDbError = new Error('Simulated database error');
            mockDbError.code = '23505'; // Example code for unique constraint violation
            mockClient.query.mockRejectedValueOnce(mockDbError);
            yield expect(dbServices.updateOne(tableName, updateColumn, updateValue, condition))
                .rejects
                .toThrow(Database_error_1.DatabaseError);
        }));
        it("If Client is null Should throw DatabaseError and Handle it.", () => __awaiter(void 0, void 0, void 0, function* () {
            DatabaseHandler_services_1.default.client = null;
            try {
                yield dbServices.updateOne(tableName, updateColumn, updateValue, condition, LogicalOperator);
            }
            catch (error) {
                console.error("Caught error:", error);
                expect(error).toBeInstanceOf(Database_error_1.DatabaseError);
            }
            expect(mockClient.query).not.toHaveBeenCalled();
        }));
    });
});
