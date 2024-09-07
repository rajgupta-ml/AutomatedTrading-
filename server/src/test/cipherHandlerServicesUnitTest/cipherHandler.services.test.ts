import { CipherError } from "../../apiController/errors/Cipher.error";
import { ICipher } from "../../apiController/interfaces/ICipher"
import CipherManager from "../../apiController/services/CipherHandler.services"

describe("Cipher Service Testing", () => {
    let cipherManager: ICipher;

    beforeAll(() => {
        cipherManager = new CipherManager();
    });

    describe("Encrypt function testing", () => {
        it("Should send back an encrypted string", async () => {
            const result = await cipherManager.encrypt("Hello World");
            expect(result).toBeDefined();
            expect(typeof result).toBe("string");
        });

        it("Should throw an error when encrypting an empty string", async () => {
            await expect(cipherManager.encrypt("")).rejects.toThrow(CipherError);
        });
        
        it("Should throw an Cipher Error for an undefined input", async() => {
            // @ts-ignore
            await expect(cipherManager.encrypt(undefined)).rejects.toThrow(CipherError);
        })

        it("Should throw an Cipher Error for an null input", async() => {
            // @ts-ignore
            await expect(cipherManager.encrypt(null)).rejects.toThrow(CipherError);
        })
    });



    describe("Decrypt function testing", () =>{
        let cipherManager : CipherManager;
        let encrypt : string;
        const password = "password123";

        beforeAll( async () => {
            cipherManager = new CipherManager();
            encrypt = await cipherManager.encrypt(password);
        })

        it("Expected to be the original password", async () => {
            const result = await cipherManager.decrypt(encrypt, password)
            expect(result).toBe(password);
        })

        it("Should throw CipherError for decryption with a wrong password", async () => {
            await expect(cipherManager.decrypt(encrypt, "wrongpassword")).rejects.toThrow(CipherError);
        })

        it("Should throw CipherError for corrupted encrypted data", async () => {
            const corruptedData = encrypt.slice(0, -10); // Simulate corrupted data
            await expect(cipherManager.decrypt(corruptedData, password)).rejects.toThrow(CipherError);
        });
            it("Should throw an error when decrypting an empty string", async () => {
            await expect(cipherManager.decrypt("", "pass")).rejects.toThrow(CipherError);
        });
        
        it("Should throw an Cipher Error for an undefined input", async() => {
            // @ts-ignore
            await expect(cipherManager.decrypt(undefined, "asd")).rejects.toThrow(CipherError);
        })

        it("Should throw an Cipher Error for an null input", async() => {
            // @ts-ignore
            await expect(cipherManager.decrypt("asds",null)).rejects.toThrow(CipherError);
        })
    })


   describe("CipherManager - hash function", () => {
    let cipherManager: CipherManager;

    beforeAll(() => {
        cipherManager = new CipherManager();
    });

    it("Should return a valid hash for a non-empty input", () => {
        const result = cipherManager.hash("HelloWorld");
        expect(result).toBeDefined();
        expect(result).toHaveLength(64); // SHA-256 produces a 64-character hex string
    });

    it("Should throw a CipherError when hash an empty string", () => {
        expect(() => cipherManager.hash("")).toThrow(CipherError); // Use .toThrow for synchronous functions
    });

    it("Should throw a CipherError for an undefined input", () => {
        // @ts-ignore
        expect(() => cipherManager.hash(undefined)).toThrow(CipherError); // .toThrow instead of .rejects.toThrow
    });

    it("Should throw a CipherError for a null input", () => {
        // @ts-ignore
        expect(() => cipherManager.hash(null)).toThrow(CipherError); // .toThrow instead of .rejects.toThrow
    });
});


describe("CipherManager - compareHash function", () => {
    let cipherManager: CipherManager;

    const password = "password123";
    let validHash :string // SHA-256 hash of "password123"
    const wrongHash = "2f92b778bafee6f7f626e9ed703d6b512d80edee959bd45efda6d707d8961bbb"; // Wrong hash
    
    beforeAll(() => {
        cipherManager = new CipherManager();
        validHash = cipherManager.hash(password);
    });

    // 1. Test for valid matching password and hash
    it("Should return true for matching password and hash", () => {
        const result = cipherManager.compareHash(password, validHash);
        expect(result).toBe(true);
    });

    // 2. Test for valid password but wrong hash
    it("Should return false for non-matching password and hash", () => {
        const result = cipherManager.compareHash(password, wrongHash);
        expect(result).toBe(false);
    });

    // 3. Test for empty password
    it("Should throw a CipherError for empty password", () => {
        expect(() => cipherManager.compareHash("", validHash)).toThrow(CipherError);
    });

    // 4. Test for null password
    it("Should throw a CipherError for null password", () => {
        // @ts-ignore
        expect(() => cipherManager.compareHash(null, validHash)).toThrow(CipherError);
    });

    // 5. Test for undefined password
    it("Should throw a CipherError for undefined password", () => {
        // @ts-ignore
        expect(() => cipherManager.compareHash(undefined, validHash)).toThrow(CipherError);
    });

    // 6. Test for empty hashedPassword
    it("Should throw a CipherError for empty hashedPassword", () => {
        expect(() => cipherManager.compareHash(password, "")).toThrow(CipherError);
    });

    // 7. Test for null hashedPassword
    it("Should throw a CipherError for null hashedPassword", () => {
        // @ts-ignore
        expect(() => cipherManager.compareHash(password, null)).toThrow(CipherError);
    });

    // 8. Test for undefined hashedPassword
    it("Should throw a CipherError for undefined hashedPassword", () => {
        // @ts-ignore
        expect(() => cipherManager.compareHash(password, undefined)).toThrow(CipherError);
    });

    // 9. Test for hashedPassword in incorrect format (e.g., wrong length)
    it("Should throw a CipherError for invalid format hashedPassword", () => {
        const invalidHash = "shortHash"; // Invalid format, too short
        expect(() => cipherManager.compareHash(password, invalidHash)).toThrow(Error);
    });
});


});
