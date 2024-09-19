import { UpstoxAuthentication } from "../../../../sdk/Upstox/api/UpstoxAuthentication"
import { HttpClient } from "../../../../sdk/Upstox/core/HttpClient";
import { BadRequestUpstoxError } from "../../../../sdk/Upstox/errors/UpstoxError";

jest.mock('../../../../sdk/Upstox/core/HttpClient.ts');

describe('UpstoxAuthentication', () => {
	let upstoxAuth: UpstoxAuthentication;

	beforeEach(() => {
		const httpClient = new HttpClient()
		upstoxAuth = new UpstoxAuthentication(httpClient);
		jest.clearAllMocks();
	});

	describe('getOAuthURI', () => {
		it('should return a valid OAuth URI when given correct parameters', () => {
			const params = {
				clientId: 'testClientId',
				redirectURI: 'http://example.com/callback'
			};
			const result = upstoxAuth.getOAuthURI(params);
			expect(result).toBeInstanceOf(URL);
			expect(result.href).toContain('https://api.upstox.com/v2/login/authorization/dialog');
			expect(result.searchParams.get('client_id')).toBe(params.clientId);
			expect(result.searchParams.get('redirect_uri')).toBe(params.redirectURI);
		});

		it('should throw BadRequestUpstoxError when clientId is missing', () => {
			const params = {
				redirectURI: 'http://example.com/callback'
			};
			expect(() => upstoxAuth.getOAuthURI(params as any)).toThrow(BadRequestUpstoxError);
		});

		it('should throw BadRequestUpstoxError when redirectURI is missing', () => {
			const params = {
				clientId: 'testClientId'
			};
			expect(() => upstoxAuth.getOAuthURI(params as any)).toThrow(BadRequestUpstoxError);
		});
	});

	describe('getAccessToken', () => {
		it('should return a valid response when given correct parameters', async () => {
			const mockResponse = { access_token: 'testToken' };
			(HttpClient.prototype.post as jest.Mock).mockResolvedValue(mockResponse);

			const params = {
				code: 'testCode',
				clientId: 'testClientId',
				clientSecret: 'testClientSecret',
				redirectURI: 'http://example.com/callback'
			};

			const result = await upstoxAuth.getAccessToken(params);
			expect(result).toEqual(mockResponse);
			expect(HttpClient.prototype.post).toHaveBeenCalledWith(
				'https://api.upstox.com/v2/login/authorization/token',
				expect.objectContaining({
					code: params.code,
					client_id: params.clientId,
					client_secret: params.clientSecret,
					redirect_uri: params.redirectURI,
					grant_type: 'authorization_code'
				}),
				expect.any(Object)
			);
		});

		it('should throw BadRequestUpstoxError when any required parameter is missing', async () => {
			const incompleteParams = [
				{ clientId: 'testClientId', clientSecret: 'testClientSecret', redirectURI: 'http://example.com/callback' },
				{ code: 'testCode', clientSecret: 'testClientSecret', redirectURI: 'http://example.com/callback' },
				{ code: 'testCode', clientId: 'testClientId', redirectURI: 'http://example.com/callback' },
				{ code: 'testCode', clientId: 'testClientId', clientSecret: 'testClientSecret' }
			];

			for (const params of incompleteParams) {
				await expect(upstoxAuth.getAccessToken(params as any)).rejects.toThrow(BadRequestUpstoxError);
			}
		});

		it('should throw an error when the HTTP request fails', async () => {
			const mockError = new Error('Network error');
			(HttpClient.prototype.post as jest.Mock).mockRejectedValue(mockError);

			const params = {
				code: 'testCode',
				clientId: 'testClientId',
				clientSecret: 'testClientSecret',
				redirectURI: 'http://example.com/callback'
			};

			await expect(upstoxAuth.getAccessToken(params)).rejects.toThrow('Network error');
		});
	});
});
