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
const DatabaseHandler_services_1 = __importDefault(require("../../src/apiController/services/DatabaseHandler.services"));
const Database_error_1 = require("../../src/apiController/errors/Database.error");
const Unknown_error_1 = require("../../src/apiController/errors/Unknown.error");
// Mock the pg Client
jest.mock('pg', () => {
    const mClient = {
        connect: jest.fn(),
        query: jest.fn(),
        end: jest.fn(),
    };
    return { Client: jest.fn(() => mClient) };
});
describe('DatabaseServices', () => {
    let databaseServices;
    let mockClient;
    const tableName = 'users';
    const dataToBeSaved = {
        username: 'testuser',
        password: 'hashedpassword',
        redirectURI: 'https://example.com',
        clientID: 'client123',
        clientSecret: 'secret456'
    };
    beforeEach(() => {
        // Reset the singleton instance before each test
        databaseServices = DatabaseHandler_services_1.default.getInstance();
        databaseServices.connect();
        mockClient = DatabaseHandler_services_1.default.client;
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('insertOne', () => {
        it('should successfully insert data and return the result', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockQueryResult = {
                rows: [Object.assign(Object.assign({}, dataToBeSaved), { userID: 1 })],
                rowCount: 1,
                command: 'INSERT',
                oid: null,
                fields: [],
            };
            mockClient.query.mockResolvedValueOnce(mockQueryResult);
            const result = yield databaseServices.insertOne(tableName, dataToBeSaved);
            expect(mockClient.query).toHaveBeenCalledWith('INSERT INTO users(username,password,redirectURI,clientID,clientSecret) VALUES ($1,$2,$3,$4,$5) RETURNING *', ['testuser', 'hashedpassword', 'https://example.com', 'client123', 'secret456']);
            expect(result).toEqual(mockQueryResult);
        }));
        it('should throw DatabaseError when insertion fails due to database error', () => __awaiter(void 0, void 0, void 0, function* () {
            const tableName = 'users';
            const dbError = new Error('Duplicate key value violates unique constraint');
            dbError.code = '23505'; // Unique violation error code
            mockClient.query.mockRejectedValueOnce(dbError);
            yield expect(databaseServices.insertOne(tableName, dataToBeSaved))
                .rejects
                .toThrow(Database_error_1.DatabaseError);
        }));
        it('should throw UnknownError for unexpected errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const tableName = 'users';
            mockClient.query.mockRejectedValueOnce(new Error('Unexpected error'));
            yield expect(databaseServices.insertOne(tableName, dataToBeSaved))
                .rejects
                .toThrow(Unknown_error_1.UnknownError);
        }));
        it('should throw DatabaseError when client is not initialized', () => __awaiter(void 0, void 0, void 0, function* () {
            // Ensure the client is not initialized
            DatabaseHandler_services_1.default.client = null;
            const tableName = 'users';
            // Act & Assert
            yield expect(databaseServices.insertOne(tableName, dataToBeSaved))
                .rejects
                .toThrow(Unknown_error_1.UnknownError);
            // Ensure the `query` method is not called
            expect(mockClient.query).not.toHaveBeenCalled();
        }));
    });
});
