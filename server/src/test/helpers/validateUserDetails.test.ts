import { InvalidUserDetailError } from "../../apiController/errors/InvalidUserDetails.error";
import { validateUserDetails } from "../../apiController/helpers/dataValidation.helper";

// Test user details validation
describe("validateUserDetails", () => {
	it("should throw InvalidUserDetailError if username is missing", () => {
		const invalidUserDetails = { password: "password123" };
		//@ts-ignore
		expect(() => validateUserDetails(invalidUserDetails, ["username", "password"]),).toThrow(InvalidUserDetailError);
	});

	it("should throw InvalidUserDetailError if password is missing", () => {
		const invalidUserDetails = { username: "user" };
		//@ts-ignore
		expect(() => validateUserDetails(invalidUserDetails, ["username", "password"])).toThrow(InvalidUserDetailError);
	});
});


