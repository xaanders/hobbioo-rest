import { IHelpers } from "../shared/interfaces.js";
import { ValidationError } from "../shared/error/validation-error.js";
export class User {
    private _id: string;
    private _first_name: string;
    private _last_name: string;
    private _email: string;
    private _user_type: 1 | 2; // 1 - seeker, 2 - provider
    private _created_at: string;
    private _updated_at: string;
    private _status: 1 | 0; // 1 - active, 0 - inactive


    constructor(data: { id: string, first_name: string, last_name: string, email: string, user_type: 1 | 2, status: 1 | 0, created_at: string, updated_at: string }, helpers: IHelpers) {
        const sanitizedData = { ...data }
        sanitizedData.first_name = helpers.sanitize(sanitizedData.first_name);
        sanitizedData.last_name = helpers.sanitize(sanitizedData.last_name);
        sanitizedData.email = helpers.sanitize(sanitizedData.email);

        // Validate data
        this.validate(sanitizedData);

        this._id = sanitizedData.id;
        this._first_name = sanitizedData.first_name;
        this._last_name = sanitizedData.last_name;
        this._email = sanitizedData.email;
        this._user_type = sanitizedData.user_type;

        this._status = data.status;
        this._created_at = data.created_at;
        this._updated_at = data.updated_at;
    }

    // Getters
    get id() {
        return this._id;
    }

    get first_name() {
        return this._first_name;
    }

    get last_name() {
        return this._last_name;
    }

    get email() {
        return this._email;
    }

    get user_type() {
        return this._user_type;
    }

    get created_at() {
        return this._created_at;
    }

    get updated_at() {
        return this._updated_at;
    }

    get status() {
        return this._status;
    }

    // Business Logic
    toJson() {
        return Object.freeze({
            id: this.id,
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            user_type: this.user_type,
            created_at: this.created_at,
            updated_at: this.updated_at
        });
    }

    validate(data: { id?: string; first_name?: string; last_name?: string; email?: string; user_type?: 1 | 2 }) {
        if (!data.first_name) {
            throw new ValidationError("First name is required");
        }
        if (data.first_name.trim() === "") {
            throw new ValidationError("First name cannot be empty");
        }
        if (!data.last_name) {
            throw new ValidationError("Last name is required");
        }
        if (data.last_name.trim() === "") {
            throw new ValidationError("Last name cannot be empty");
        }
        if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            throw new ValidationError("Invalid email format");
        }
        if (data.user_type !== 1 && data.user_type !== 2) {
            throw new ValidationError("Invalid user type");
        }
    }

    validateUpdate(data: Partial<{ first_name: string; last_name: string; email: string; user_type: 1 | 2 }>) {
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
    // Updating the entity with sanitization and validation
    update(data: Partial<{ first_name: string; last_name: string; email: string; user_type: 1 | 2 }>, helpers: IHelpers) {
        
        this.validateUpdate(data);

        const sanitizedData = {
            ...this,
            ...data
        }
        sanitizedData.first_name = helpers.sanitize(sanitizedData.first_name);
        sanitizedData.last_name = helpers.sanitize(sanitizedData.last_name);
        sanitizedData.email = helpers.sanitize(sanitizedData.email);


        if (sanitizedData.first_name) this._first_name = sanitizedData.first_name;
        if (sanitizedData.last_name) this._last_name = sanitizedData.last_name;
        if (sanitizedData.email) this._email = sanitizedData.email;
        if (sanitizedData.user_type) this._user_type = sanitizedData.user_type;
    }
}
