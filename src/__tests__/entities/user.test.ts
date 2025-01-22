import { User } from "../../entities/user.js";
import { ValidationError } from "../../shared/error/validation-error.js";
import { IHelpers } from "../../app/helpers/IHelpers.js";

const mockHelpers = {
  sanitize: (input: string) => input.trim().replace(/<br>/g, ""),
  generateId: () => "mock-user_id",
  isProductionData: () => ({ data: "mock" }),
  logger: () => ({}),
  getSettings: () => ({ rateLimit: { maxRequests: 100, timeWindowSec: 60, ipWhitelist: [] } }),
} as IHelpers;

describe("User Entity", () => {
  const validUserData = {
    user_id: "123",
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    user_type: 1 as const,
    status: 1 as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  describe("Constructor", () => {
    it("should create a valid user", () => {
      const user = new User(validUserData);
      expect(user.toJson()).toEqual(
        expect.objectContaining({
          user_id: validUserData.user_id,
          first_name: validUserData.first_name,
          last_name: validUserData.last_name,
          email: validUserData.email,
          user_type: validUserData.user_type,
          status: validUserData.status,
          created_at: validUserData.created_at,
          updated_at: validUserData.updated_at,
        })
      );
    });

    it("should handle null input", () => {
      const user = new User(null);
      expect(user.user_id).toBe("");
    });
  });

  describe("Validation", () => {
    it("should throw on empty first name", () => {
      expect(() => {
        const user = new User({ ...validUserData, first_name: "" });
        user.validateUserFields();
      }).toThrow(ValidationError);
    });

    it("should throw on long first name", () => {
      expect(() => {
        const user = new User({ ...validUserData, first_name: "a".repeat(101) });
        user.validateUserFields();
      }).toThrow(ValidationError);
    });

    it("should throw on empty last name", () => {
      expect(() => {
        const user = new User({ ...validUserData, last_name: "" });
        user.validateUserFields();
      }).toThrow(ValidationError);
    });

    it("should throw on long last name", () => {
      expect(() => {
        const user = new User({ ...validUserData, last_name: "a".repeat(101) });
        user.validateUserFields();
      }).toThrow(ValidationError);
    });

    it("should throw on invalid email", () => {
      expect(() => {
        const user = new User({ ...validUserData, email: "invalid-email" });
        user.validateUserFields();
      }).toThrow(ValidationError);
    });

    it("should throw on invalid user type", () => {
      expect(() => {
        const user = new User({ ...validUserData, user_type: 3 as 1 | 2 });
        user.validateUserFields();
      }).toThrow(ValidationError);
    });
  });

  describe("Sanitization", () => {
    it("should trim whitespace from inputs", () => {
      const user = new User(
        {
          ...validUserData,
          first_name: "  John  ",
          last_name: "  Doe  ",
          email: "  john@example.com<br>  ",
        }
      );
      user.sanitizeAndValidateUserInputs(mockHelpers);

      expect(user.first_name).toBe("John");
      expect(user.last_name).toBe("Doe");
      expect(user.email).toBe("john@example.com");
    });
  });

  describe("Update Validation", () => {
    it("should validate partial updates", () => {

      const user = new User({user_id: "123", first_name: "Jane"});
      const result = user.beforeUpdate(mockHelpers);

      expect(result).toEqual({first_name: "Jane"});
    });

    it("should throw on empty update", () => {
      const testUser = new User(null);
      expect(() => {
        testUser.beforeUpdate(mockHelpers);
      }).toThrow("No fields to update");
    });

    it("should remove undefined fields", () => {
      const user = new User({...validUserData, last_name: undefined});
      const result = user.beforeUpdate(mockHelpers);

      expect(result).toHaveProperty("first_name");
      expect(result).not.toHaveProperty("last_name");
    });
  });

  describe("Immutability", () => {
    it("should return frozen object from toJson", () => {
      const user = new User(validUserData);
      const json = user.toJson();

      expect(Object.isFrozen(json)).toBe(true);
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (json as any).user_id = "new-id";
      }).toThrow();
    });
  });
});
