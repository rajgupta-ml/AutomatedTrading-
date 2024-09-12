export interface ICipher {
    encrypt(password : string) : Promise<string>
    decrypt(encryptedData : string) : Promise<string>
    hash(data: string) : string
    compareHash(password : string, hashedPassword : string) : boolean 
}