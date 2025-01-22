import { IHelpers } from "../app/helpers/IHelpers.js";
import { ValidationError } from "../shared/error/validation-error.js";

// Add type definitions for better type safety
export type UserType = 1 | 2; // 1 - seeker, 2 - provider
export type UserStatus = 1 | 0; // 1 - active, 0 - inactive

export interface UserProps {
  user_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  user_type?: UserType;
  status?: UserStatus;
  created_at?: string;
  updated_at?: string;
}

export class User {
  private _user_id: string = "";
  private _first_name: string | undefined = undefined;
  private _last_name: string | undefined = undefined;
  private _email: string | undefined = undefined;
  private _user_type: 1 | 2 | undefined = undefined; // 1 - seeker, 2 - provider
  private _created_at: string | undefined = undefined;
  private _updated_at: string | undefined = undefined;
  private _status: 1 | 0 | undefined = undefined; // 1 - active, 0 - inactive

  // Add validation constants
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(data: UserProps | null) {
    if (!data) return;

    this._user_id = data.user_id;
    this._first_name = data.first_name;
    this._last_name = data.last_name;
    this._email = data.email;
    this._user_type = data.user_type;

    this._status = data.status;
    this._created_at = data.created_at;
    this._updated_at = data.updated_at;
  }

  // Getters
  get user_id(): string {
    return this._user_id;
  }

  get first_name(): string | undefined {
    return this._first_name;
  }

  get last_name(): string | undefined {
    return this._last_name;
  }

  get email(): string | undefined {
    return this._email;
  }

  get user_type(): 1 | 2 | undefined {
    return this._user_type;
  }

  get created_at(): string | undefined {
    return this._created_at;
  }

  get updated_at(): string | undefined {
    return this._updated_at;
  }

  get status(): 1 | 0 | undefined {
    return this._status;
  }

  // Business Logic
  toJson(): {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    user_type: UserType;
    status: UserStatus;
    updated_at: string;
    created_at: string;
  } {
    const json = {
      user_id: this.user_id,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      user_type: this.user_type,
      status: this.status,
      updated_at: this.updated_at,
      created_at: this.created_at
    }

    if(Object.keys(json).some(key => json[key as keyof typeof json] === undefined)) {
      throw new ValidationError("User is not fully initialized");
    }

    return Object.freeze({
      user_id: this.user_id,
      first_name: this.first_name as string,
      last_name: this.last_name as string,
      email: this.email as string,
      user_type: this.user_type as UserType,
      status: this.status as UserStatus,
      updated_at: this.updated_at as string,
      created_at: this.created_at as string
    });

  }

  validateUserFields(): void {
    this.validateName();
    this.validateEmail();
    this.validateUserType();
  }

  private validateName(): void {
    if (!this.first_name?.trim()) {
      throw new ValidationError("First name is required and cannot be empty");
    }
    if (!this.last_name?.trim()) {
      throw new ValidationError("Last name is required and cannot be empty");
    }

    if (this.first_name.length > propertiesLength.first_name) {
      throw new ValidationError(`First name cannot be longer than ${propertiesLength.first_name} characters`);
    }
    if (this.last_name.length > propertiesLength.last_name) {
      throw new ValidationError(`Last name cannot be longer than ${propertiesLength.last_name} characters`);
    }
  }

  validateEmail(): void {

    if (!this.email) {
      throw new ValidationError("Email is required");
    }
    if (!User.EMAIL_REGEX.test(this.email)) {
      throw new ValidationError("Invalid email format");
    }
    if (this.email.length > propertiesLength.email) {
      throw new ValidationError(`Email cannot be longer than ${propertiesLength.email} characters`);
    }
  }

  private validateUserType(): void {
    if (this.user_type !== 1 && this.user_type !== 2) {
      throw new ValidationError("Invalid user type. Must be 1 (seeker) or 2 (provider)");
    }
  }

  sanitizeUserInputs(helpers: IHelpers): void {
    if(this._first_name) this._first_name = helpers.sanitize(this._first_name);
    if(this._last_name) this._last_name = helpers.sanitize(this._last_name);
    if(this._email) this._email = helpers.sanitize(this._email);
  }

  sanitizeAndValidateUserInputs(helpers: IHelpers): void {
    this.sanitizeUserInputs(helpers);
    this.validateUserFields();
  }

  validateUserFieldsForUpdate(): void {
    if (this.first_name && this.first_name.trim() === "") {
      throw new ValidationError("First name cannot be empty");
    }
    if (this.last_name && this.last_name.trim() === "") {
      throw new ValidationError("Last name cannot be empty");
    }
    if (this.email && !User.EMAIL_REGEX.test(this.email)) {
      throw new ValidationError("Invalid email format");
    }
    // if (this.user_type !== 1 && this.user_type !== 2) {
    //   throw new ValidationError("Invalid user type");
    // }
  }

  beforeUpdate(
    helpers: IHelpers
  ): {
    first_name?: string;
    last_name?: string;
  } {

    if(!this._first_name && !this._last_name) {
      throw new ValidationError("No fields to update");
    }

    this.validateUserFieldsForUpdate();
    this.sanitizeUserInputs(helpers);

    const data = {
      first_name: this._first_name,
      last_name: this._last_name,
    }
    
    Object.keys(data).forEach((key) => {
      if (!data[key as keyof typeof data]) {
        delete data[key as keyof typeof data];
      }
    });

    return data;
  }
}

const propertiesLength = {
  first_name: 100,
  last_name: 100,
  email: 100,
};
