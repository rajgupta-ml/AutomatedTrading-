import { TokenizationServices } from "../../apiController/services/TokenizationHandler.services";
import jwt from "jsonwebtoken"; // to verify token structure

describe("Tokenization Service Testing", () => {
    let tokenizer: TokenizationServices;

    beforeAll(() => {
        tokenizer = new TokenizationServices();
    });

    describe("getToken From the file src/apiController/services/TokenizationHandler.services.ts", () => {
        it("should return a string token when provided a valid username", () => {
            const token = tokenizer.getToken("Raj Gupta");
            expect(typeof token).toBe("string");
        });

        it("should throw an error when username is missing", () => {
            expect(() => tokenizer.getToken("")).toThrow();
        });

        it("should return a valid JWT token format", () => {
            const token = tokenizer.getToken("Raj Gupta");
            const parts = token.split(".");
            expect(parts.length).toBe(3); // A valid JWT has 3 parts
        });

        it("should sign token with the correct algorithm", () => {
            const token = tokenizer.getToken("Raj Gupta");
            const decodedToken = jwt.decode(token, { complete: true }) as jwt.Jwt | null;
            expect(decodedToken?.header.alg).toBe("ES256");
        });
    });

    describe("verifyAndRefreshToken From the file src/apiController/services/TokenizationHandler.services.ts", () => {
        it("should return a new token if the token is nearing expiration", () => {
            const token = tokenizer.getToken("Raj Gupta");
            setTimeout(() => {
                const {newToken} = tokenizer.verifyAndRefreshToken(token);
                expect(newToken).toBeDefined();
            },1000)

        });

        it("should verify and return the same token if not near expiration", () => {
            const token = tokenizer.getToken("Raj Gupta");
            const { tokenVerified, newToken } = tokenizer.verifyAndRefreshToken(token);
            expect(tokenVerified).toBe(true);
            expect(newToken).toBeUndefined();
        });

        it("should throw an error for an invalid token", () => {
            expect(() => tokenizer.verifyAndRefreshToken("invalid.token")).toThrow();
        });
    });
});
