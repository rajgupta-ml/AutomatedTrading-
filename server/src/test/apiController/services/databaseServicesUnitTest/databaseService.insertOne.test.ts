import { Client, DatabaseError } from 'pg';
import DatabaseServices from '../../../../apiController/services/DatabaseHandler.services';
import { UnknownError } from '../../../../apiController/errors/Unknown.error';



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
	let databaseServices: DatabaseServices;
	let mockClient: jest.Mocked<Client>;
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
		databaseServices = DatabaseServices.getInstance();
		databaseServices.connect();
		mockClient = DatabaseServices.client as jest.Mocked<Client>;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('insertOne', () => {
		it('should successfully insert data and return the result', async () => {


			const mockQueryResult = {
				rows: [{ ...dataToBeSaved, userID: 1 }],
				rowCount: 1,
				command: 'INSERT',
				oid: null,
				fields: [],
			};

			(mockClient.query as jest.Mock).mockResolvedValueOnce(mockQueryResult);

			const result = await databaseServices.insertOne(tableName, dataToBeSaved);

			expect(mockClient.query).toHaveBeenCalledWith(
				'INSERT INTO users(username,password,redirectURI,clientID,clientSecret) VALUES ($1,$2,$3,$4,$5) RETURNING *',
				['testuser', 'hashedpassword', 'https://example.com', 'client123', 'secret456']
			);
			expect(result).toEqual(mockQueryResult);
		});

		it('should throw DatabaseError when insertion fails due to database error', async () => {
			const tableName = 'users';

			const dbError = new Error('Duplicate key value violates unique constraint');
			(dbError as any).code = '23505'; // Unique violation error code

			(mockClient.query as jest.Mock).mockRejectedValueOnce(dbError);

			await expect(databaseServices.insertOne(tableName, dataToBeSaved))
				.rejects
				.toThrow(DatabaseError);
		});

		it('should throw UnknownError for unexpected errors', async () => {
			const tableName = 'users';

			(mockClient.query as jest.Mock).mockRejectedValueOnce(new Error('Unexpected error'));

			await expect(databaseServices.insertOne(tableName, dataToBeSaved))
				.rejects
				.toThrow(UnknownError);
		});

		it('should throw DatabaseError when client is not initialized', async () => {
			// Ensure the client is not initialized
			DatabaseServices.client = null;

			const tableName = 'users';

			// Act & Assert
			await expect(databaseServices.insertOne(tableName, dataToBeSaved))
				.rejects
				.toThrow(DatabaseError);

			// Ensure the `query` method is not called
			expect(mockClient.query).not.toHaveBeenCalled();
		});
	});
});
