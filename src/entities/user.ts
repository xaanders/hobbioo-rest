import { IHelpers } from "../app/helpers/IHelpers.js";
import { ValidationError } from "../shared/error/validation-error.js";
export class User {
  private _user_id: string = "";
  private _first_name: string = "";
  private _last_name: string = "";
  private _email: string = "";
  private _user_type: 1 | 2 = 1; // 1 - seeker, 2 - provider
  private _created_at: string = "";
  private _updated_at: string = "";
  private _status: 1 | 0 = 1; // 1 - active, 0 - inactive

  constructor(
    data: {
      user_id: string;
      first_name: string;
      last_name: string;
      email: string;
      user_type: 1 | 2;
      status: 1 | 0;
      created_at: string;
      updated_at: string;
    } | null,
    helpers: IHelpers
  ) {
    if (!data) return;

    const sanitizedData = this.sanitizeUserInputs(
      {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
      },
      helpers
    );
    // Validate data
    this.validateUserFields({
      first_name: sanitizedData.first_name,
      last_name: sanitizedData.last_name,
      email: sanitizedData.email,
      user_type: data.user_type,
    });

    this._user_id = data.user_id;
    this._first_name = sanitizedData.first_name;
    this._last_name = sanitizedData.last_name;
    this._email = sanitizedData.email;
    this._user_type = data.user_type;

    this._status = data.status;
    this._created_at = data.created_at;
    this._updated_at = data.updated_at;
  }

  // Getters
  get user_id(): string {
    return this._user_id;
  }

  get first_name(): string {
    return this._first_name;
  }

  get last_name(): string {
    return this._last_name;
  }

  get email(): string {
    return this._email;
  }

  get user_type(): 1 | 2 {
    return this._user_type;
  }

  get created_at(): string {
    return this._created_at;
  }

  get updated_at(): string {
    return this._updated_at;
  }

  get status(): 1 | 0 {
    return this._status;
  }

  // Business Logic
  toJson(): {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    user_type: 1 | 2;
    created_at: string;
    updated_at: string;
  } {
    return Object.freeze({
      user_id: this.user_id,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      user_type: this.user_type,
      created_at: this.created_at,
      updated_at: this.updated_at,
    });
  }

  validateUserFields(data: {
    user_id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    user_type?: 1 | 2;
  }): void {
    if (!data.first_name) {
      throw new ValidationError("First name is required");
    }
    if (data.first_name.trim() === "") {
      throw new ValidationError("First name cannot be empty");
    }
    if (data.first_name.length > propertiesLength.first_name) {
      throw new ValidationError(
        `First name cannot be longer than ${propertiesLength.first_name} characters`
      );
    }
    if (!data.last_name) {
      throw new ValidationError("Last name is required");
    }
    if (data.last_name.trim() === "") {
      throw new ValidationError("Last name cannot be empty");
    }
    if (data.last_name.length > propertiesLength.last_name) {
      throw new ValidationError(
        `Last name cannot be longer than ${propertiesLength.last_name} characters`
      );
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new ValidationError("Invalid email format");
    }
    if (data.email.length > propertiesLength.email) {
      throw new ValidationError(`Email cannot be longer than ${propertiesLength.email} characters`);
    }
    if (data.user_type !== 1 && data.user_type !== 2) {
      throw new ValidationError("Invalid user type");
    }
  }

  sanitizeUserInputs(
    data: {
      first_name: string;
      last_name: string;
      email: string;
    },
    helpers: IHelpers
  ): {
    first_name: string;
    last_name: string;
    email: string;
  } {
    return {
      first_name: helpers.sanitize(data.first_name),
      last_name: helpers.sanitize(data.last_name),
      email: helpers.sanitize(data.email),
    };
  }

  sanitizeUserFieldsForUpdate(
    data: {
      first_name?: string;
      last_name?: string;
      email?: string;
    },
    helpers: IHelpers
  ): {
    first_name?: string;
    last_name?: string;
    email?: string;
  } {
    return {
      first_name: data.first_name ? helpers.sanitize(data.first_name) : undefined,
      last_name: data.last_name ? helpers.sanitize(data.last_name) : undefined,
      email: data.email ? helpers.sanitize(data.email) : undefined,
    };
  }

  validateUserFieldsForUpdate(data: {
    first_name?: string;
    last_name?: string;
    email?: string;
    user_type?: 1 | 2;
  }): void {
    if (data.first_name && data.first_name.trim() === "") {
      throw new ValidationError("First name cannot be empty");
    }
    if (data.last_name && data.last_name.trim() === "") {
      throw new ValidationError("Last name cannot be empty");
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new ValidationError("Invalid email format");
    }
    if (data.user_type && data.user_type !== 1 && data.user_type !== 2) {
      throw new ValidationError("Invalid user type");
    }
  }

  beforeUpdate(
    data: Partial<{ first_name: string; last_name: string; email: string; user_type: 1 | 2 }>,
    helpers: IHelpers
  ): {
    first_name?: string;
    last_name?: string;
    email?: string;
  } {
    this.validateUserFieldsForUpdate(data);
    const sanitizedData = this.sanitizeUserFieldsForUpdate(data, helpers);
    Object.keys(sanitizedData).forEach((key) => {
      if (!sanitizedData[key as keyof typeof sanitizedData]) {
        delete sanitizedData[key as keyof typeof sanitizedData];
      }
    });

    if (Object.keys(sanitizedData).length === 0) throw new ValidationError("No fields to update");

    return sanitizedData;
  }
  // Updating the entity with sanitization and validation
  // update(
  //   data: Partial<{ first_name: string; last_name: string; email: string; user_type: 1 | 2 }>,
  //   helpers: IHelpers
  // ) {
  //   this.validateUpdate(data);

  //   const sanitizedData = {
  //     ...this,
  //     ...data,
  //   };
  //   sanitizedData.first_name = helpers.sanitize(sanitizedData.first_name);
  //   sanitizedData.last_name = helpers.sanitize(sanitizedData.last_name);
  //   sanitizedData.email = helpers.sanitize(sanitizedData.email);

  //   if (sanitizedData.first_name) this._first_name = sanitizedData.first_name;
  //   if (sanitizedData.last_name) this._last_name = sanitizedData.last_name;
  //   if (sanitizedData.email) this._email = sanitizedData.email;
  //   if (sanitizedData.user_type) this._user_type = sanitizedData.user_type;
  // }
}

const propertiesLength = {
  first_name: 100,
  last_name: 100,
  email: 100,
};
