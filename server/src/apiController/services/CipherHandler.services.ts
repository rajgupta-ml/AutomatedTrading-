import crypto from "crypto";
import { Buffer } from "buffer";
import { ICipher } from "../interfaces/ICipher";
import { CipherError } from "../errors/Cipher.error";
import { BAD_REQUEST_CODE, INTERNAL_SERVER_CODE } from "../statusCode/statusCode";

class CipherManager implements ICipher{
    private readonly algorithm: "aes-256-ccm"
    private readonly keyLength: number
    private readonly ivLength: number
    private readonly saltLength: number
    private readonly tagLength: number
    private readonly encryptionPassword? : string


    constructor() {
        this.algorithm = "aes-256-ccm";
        this.keyLength = 32;
        this.ivLength = 12;
        this.saltLength = 16;
        this.tagLength = 16;
        this.encryptionPassword = process.env.ENCRYPTION_KEY
    }

    async encrypt(data: string): Promise<string> {
        try {
      
            if(!data || !this.encryptionPassword) throw new CipherError("data can't be empty", BAD_REQUEST_CODE, "1001");
            const salt = crypto.randomBytes(this.saltLength);
            const key = await this.deriveKey(this.encryptionPassword, salt);
            const iv = crypto.randomBytes(this.ivLength);
            const cipher = crypto.createCipheriv(this.algorithm , key, iv, {authTagLength : this.tagLength});
            
            const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
            const tag = cipher.getAuthTag();
            const result = Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
            return result;
            
        } catch (error) {
            if(error instanceof CipherError) throw error;
            throw new CipherError((error as Error).message, INTERNAL_SERVER_CODE, "1002");
        }
    }

    async decrypt(encryptedData: string): Promise<string> {
        try {
            if(!encryptedData || !this.encryptionPassword) throw new CipherError("Data is required", BAD_REQUEST_CODE, "1003");
            const buffer = Buffer.from(encryptedData, 'base64');
            const salt = buffer.subarray(0, this.saltLength);
            const iv = buffer.subarray(this.saltLength, this.saltLength + this.ivLength);
            const tag = buffer.subarray(this.saltLength + this.ivLength, this.saltLength + this.ivLength + this.tagLength);
            const encrypted = buffer.subarray(this.saltLength + this.ivLength + this.tagLength);
    
            const key = await this.deriveKey(this.encryptionPassword, salt);
            const decipher = crypto.createDecipheriv(this.algorithm, key, iv, { authTagLength: this.tagLength });
            decipher.setAuthTag(tag);
    
            return decipher.update(encrypted) + decipher.final('utf8');
        } catch (error) {
            if(error instanceof CipherError) throw error
            throw new CipherError((error as Error).message, INTERNAL_SERVER_CODE, "1003");
        }
    }

    private async deriveKey(password: string, salt: Buffer): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, 100000, this.keyLength, 'sha256', (err, key) => {
                if (err) reject(new CipherError(err.message, INTERNAL_SERVER_CODE, "1004"));
                else resolve(key);
            });
        });
    }

    hash(data: string): string {
            try {
                if(!data) throw new CipherError("data is required to be hashed", BAD_REQUEST_CODE, "1005")
                return crypto.createHash('sha256').update(data).digest('hex');
            } catch (error) {
                if(error instanceof CipherError) throw error;
                throw new CipherError((error as Error).message, INTERNAL_SERVER_CODE, "1005");
            }
    }

    compareHash(password: string, hashedPassword: string): boolean {

        try {
            if(!password || !hashedPassword) throw new CipherError("data is required to be hashed", BAD_REQUEST_CODE, "1005")
            const hashedInput = this.hash(password);
            return crypto.timingSafeEqual(Buffer.from(hashedInput), Buffer.from(hashedPassword));
        } catch (error) {
            throw new CipherError((error as Error).message, INTERNAL_SERVER_CODE, "1006");
        }
    }
}

export default CipherManager;