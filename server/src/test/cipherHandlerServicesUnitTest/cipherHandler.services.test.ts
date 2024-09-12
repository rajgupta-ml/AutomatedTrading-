import { CipherError } from "../../apiController/errors/Cipher.error";
import { ICipher } from "../../apiController/interfaces/ICipher";
import CipherManager from "../../apiController/services/CipherHandler.services";

describe("Cipher Service Testing", () => {
    let cipherManager: ICipher;

    beforeAll(() => {
        process.env.ENCRYPTION_KEY = 'test_password';
        cipherManager = new CipherManager();
    });

    afterAll(() => {
        // Clean up environment variable if needed
        delete process.env.ENCRYPTION_KEY;
    });

    describe("Encrypt function testing", () => {
        it("Should return an encrypted string", async () => {
            const result = await cipherManager.encrypt("Hello World");
            expect(result).toBeDefined();
            expect(typeof result).toBe("string");
        });

        it("Should throw a CipherError when encrypting an empty string", async () => {
            await expect(cipherManager.encrypt("")).rejects.toThrow(CipherError);
        });

        it("Should throw a CipherError for an undefined input", async () => {
            // @ts-ignore
            await expect(cipherManager.encrypt(undefined)).rejects.toThrow(CipherError);
        });

        it("Should throw a CipherError for a null input", async () => {
            // @ts-ignore
            await expect(cipherManager.encrypt(null)).rejects.toThrow(CipherError);
        });
    });

    describe("Decrypt function testing", () => {
        let encrypt: string;
        const password = "password123";

        beforeAll(async () => {
            cipherManager = new CipherManager();
            encrypt = await cipherManager.encrypt(password);
        });

        it("Should return the original password after decryption", async () => {
            const result = await cipherManager.decrypt(encrypt);
            expect(result).toBe(password);
        });

        it("Should throw a CipherError for decryption with a wrong password", async () => {
            // Simulate wrong password by changing encryptionPassword
            process.env.ENCRYPTION_KEY = 'wrong_password';
            const wrongCipherManager = new CipherManager();
            // console.log(process.env.ENCRYPTION_KEY)
            await expect(wrongCipherManager.decrypt(encrypt)).rejects.toThrow(CipherError);
        });

        it("Should throw a CipherError for corrupted encrypted data", async () => {
            const corruptedData = encrypt.slice(0, -10); // Simulate corrupted data
            await expect(cipherManager.decrypt(corruptedData)).rejects.toThrow(CipherError);
        });

        it("Should throw a CipherError when decrypting an empty string", async () => {
            await expect(cipherManager.decrypt("")).rejects.toThrow(CipherError);
        });

        it("Should throw a CipherError for an undefined input", async () => {
            // @ts-ignore
            await expect(cipherManager.decrypt(undefined)).rejects.toThrow(CipherError);
        });

        it("Should throw a CipherError for a null input", async () => {
            // @ts-ignore
            await expect(cipherManager.decrypt(null)).rejects.toThrow(CipherError);
        });
    });

    describe("CipherManager - hash function", () => {
        it("Should return a valid hash for a non-empty input", () => {
            const result = cipherManager.hash("HelloWorld");
            expect(result).toBeDefined();
            expect(result).toHaveLength(64); // SHA-256 produces a 64-character hex string
        });

        it("Should throw a CipherError when hashing an empty string", () => {
            expect(() => cipherManager.hash("")).toThrow(CipherError);
        });

        it("Should throw a CipherError for an undefined input", () => {
            // @ts-ignore
            expect(() => cipherManager.hash(undefined)).toThrow(CipherError);
        });

        it("Should throw a CipherError for a null input", () => {
            // @ts-ignore
            expect(() => cipherManager.hash(null)).toThrow(CipherError);
        });
    });

    describe("CipherManager - compareHash function", () => {
        const password = "password123";
        let validHash: string;
        const wrongHash = "2f92b778bafee6f7f626e9ed703d6b512d80edee959bd45efda6d707d8961bbb"; // Wrong hash

        beforeAll(() => {
            cipherManager = new CipherManager();
            validHash = cipherManager.hash(password);
        });

        it("Should return true for matching password and hash", () => {
            const result = cipherManager.compareHash(password, validHash);
            expect(result).toBe(true);
        });

        it("Should return false for non-matching password and hash", () => {
            const result = cipherManager.compareHash(password, wrongHash);
            expect(result).toBe(false);
        });

        it("Should throw a CipherError for empty password", () => {
            expect(() => cipherManager.compareHash("", validHash)).toThrow(CipherError);
        });

        it("Should throw a CipherError for null password", () => {
            // @ts-ignore
            expect(() => cipherManager.compareHash(null, validHash)).toThrow(CipherError);
        });

        it("Should throw a CipherError for undefined password", () => {
            // @ts-ignore
            expect(() => cipherManager.compareHash(undefined, validHash)).toThrow(CipherError);
        });

        it("Should throw a CipherError for empty hashedPassword", () => {
            expect(() => cipherManager.compareHash(password, "")).toThrow(CipherError);
        });

        it("Should throw a CipherError for null hashedPassword", () => {
            // @ts-ignore
            expect(() => cipherManager.compareHash(password, null)).toThrow(CipherError);
        });

        it("Should throw a CipherError for undefined hashedPassword", () => {
            // @ts-ignore
            expect(() => cipherManager.compareHash(password, undefined)).toThrow(CipherError);
        });

        it("Should throw a CipherError for hashedPassword in incorrect format (e.g., wrong length)", () => {
            const invalidHash = "shortHash"; // Invalid format, too short
            expect(() => cipherManager.compareHash(password, invalidHash)).toThrow(Error);
        });
    });
});
