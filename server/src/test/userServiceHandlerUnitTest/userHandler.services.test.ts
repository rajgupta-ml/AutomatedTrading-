import { QueryResult } from "pg";
import { CipherError } from "../../apiController/errors/Cipher.error";
import { DatabaseError } from "../../apiController/errors/Database.error";
import { InternalServerError } from "../../apiController/errors/InternalServer.error";
import { InvalidUserDetailError } from "../../apiController/errors/InvalidUserDetails.error";
import { ICipher } from "../../apiController/interfaces/ICipher";
import { IStorage } from "../../apiController/interfaces/IStorage";
import { ITokenizer } from "../../apiController/interfaces/ITokenizer";
import { UserServices } from "../../apiController/services/UserHandler.services";
import { INTERNAL_SERVER_CODE } from "../../apiController/statusCode/statusCode";
import { SuccessResponse } from "../../apiController/success/Response.success";

describe("UserServices Tests", () => {
  let mockStorage: jest.Mocked<IStorage>;
  let mockCipher: jest.Mocked<ICipher>;
  let mockTokenizer: jest.Mocked<ITokenizer>;
  let userServices: UserServices;

  beforeEach(() => {
    mockStorage = {
      insertOne: jest.fn(),
      findOne: jest.fn(),
      updateOne : jest.fn(),
      deleteOne : jest.fn(),
      executeRawSQL : jest.fn(),
    };
    mockCipher = {
      hash: jest.fn(),
      compareHash: jest.fn(),
      encrypt: jest.fn(),
      decrypt : jest.fn()
    };
    mockTokenizer = {
      getToken: jest.fn(),
      verifyAndRefreshToken: jest.fn()
    };

    userServices = new UserServices(mockStorage, mockCipher, mockTokenizer);
  });

  // 1. Test user registration
  describe("User Registration", () => {
    const userDetails = { username: "user", password: "password123" };

    it("should register user successfully", async () => {
      (mockStorage.insertOne as any).mockResolvedValueOnce(undefined);
      mockCipher.hash.mockReturnValueOnce("hashed_password");

      const response = await userServices.userRegister(userDetails);

      expect(mockCipher.hash).toHaveBeenCalledWith(userDetails.password);
      expect(mockStorage.insertOne).toHaveBeenCalledWith("users", {
        username: "user",
        password: "hashed_password",
      });
      expect(response).toBeInstanceOf(SuccessResponse);
    });

    it("should throw InvalidUserDetailError when required fields are missing", async () => {
      const invalidUserDetails = { username: "" }; // No password
        // @ts-ignore
      await expect(userServices.userRegister(invalidUserDetails)).rejects.toThrow(InvalidUserDetailError);
    });

    it("should throw InternalServerError when database insert fails", async () => {
      (mockStorage.insertOne as any).mockRejectedValueOnce(new DatabaseError("Database insert error", INTERNAL_SERVER_CODE));
      mockCipher.hash.mockReturnValueOnce("hashed_password");

      await expect(userServices.userRegister(userDetails)).rejects.toThrow(InternalServerError);
      expect(mockStorage.insertOne).toHaveBeenCalled();
    });
  });

  // 2. Test user login
  describe("User Login", () => {
    const userLoginDetails = { username: "user", password: "password123" };

    it("should login user successfully and return token", async () => {
      (mockStorage.findOne as any).mockResolvedValueOnce({ rows: [{ username: "user", password: "hashed_password" }] });
      mockCipher.compareHash.mockReturnValueOnce(true);
      mockTokenizer.getToken.mockReturnValueOnce("generated_token");

      const response = await userServices.userLogin(userLoginDetails);

      expect(mockStorage.findOne).toHaveBeenCalledWith("users", undefined, { username: "user" });
      expect(mockCipher.compareHash).toHaveBeenCalledWith("password123", "hashed_password");
      expect(mockTokenizer.getToken).toHaveBeenCalledWith("user");
      expect(response).toBeInstanceOf(SuccessResponse);
      expect(response.data?.token).toBe("generated_token");
    });

    it("should throw InvalidUserDetailError if username does not exist", async () => {
      (mockStorage.findOne as any).mockResolvedValueOnce({ rows: [] });

      await expect(userServices.userLogin(userLoginDetails)).rejects.toThrow(InvalidUserDetailError);
      expect(mockStorage.findOne).toHaveBeenCalledWith("users", undefined, { username: "user" });
    });

    it("should throw InvalidUserDetailError for incorrect password", async () => {
      (mockStorage.findOne as any).mockResolvedValueOnce({ rows: [{ username: "user", password: "hashed_password" }] });
      mockCipher.compareHash.mockReturnValueOnce(false);

      await expect(userServices.userLogin(userLoginDetails)).rejects.toThrow(InvalidUserDetailError);
      expect(mockCipher.compareHash).toHaveBeenCalledWith("password123", "hashed_password");
    });

    it("should throw InternalServerError if storage or cipher throws error", async () => {
      mockStorage.findOne.mockRejectedValueOnce(new DatabaseError("Database retrieval error", INTERNAL_SERVER_CODE));

      await expect(userServices.userLogin(userLoginDetails)).rejects.toThrow(InternalServerError);
      expect(mockStorage.findOne).toHaveBeenCalled();

      (mockStorage.findOne as any).mockResolvedValueOnce({ rows: [{ username: "user", password: "hashed_password" }] });
      mockCipher.compareHash.mockImplementationOnce(() => {
        throw new CipherError("Cipher error", INTERNAL_SERVER_CODE, "1002");
      });

      await expect(userServices.userLogin(userLoginDetails)).rejects.toThrow(InternalServerError);
      expect(mockCipher.compareHash).toHaveBeenCalled();
    });
  });

  // 3. Test user details validation
  describe("validateUserDetails", () => {
    it("should throw InvalidUserDetailError if username is missing", () => {
      const invalidUserDetails = { password: "password123" };
        //@ts-ignore
      expect(() => userServices["validateUserDetails"](invalidUserDetails)).toThrow(InvalidUserDetailError);
    });

    it("should throw InvalidUserDetailError if password is missing", () => {
      const invalidUserDetails = { username: "user" };
        //@ts-ignore
      expect(() => userServices["validateUserDetails"](invalidUserDetails)).toThrow(InvalidUserDetailError);
    });
  });
});