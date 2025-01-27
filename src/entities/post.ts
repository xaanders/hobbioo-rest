import { IHelpers } from "../app/helpers/IHelpers.js";
import { ValidationError } from "../shared/error/validation-error.js";

export type PostStatus = 1 | 0; // 1 - active, 0 - inactive

export interface PostProps {
  post_id: string;
  title?: string;
  description?: string;
  user_id: string;
  image_id?: string;
  status?: PostStatus;
  created_at?: string;
  updated_at?: string;
}

export class Post {
  private _post_id: string = "";
  private _title?: string = undefined;
  private _description?: string = undefined;
  private _user_id: string = "";
  private _image_id?: string = undefined;
  private _status?: number = undefined;
  private _created_at?: string = undefined;
  private _updated_at?: string = undefined;

  // Add validation constants
  static readonly MAX_TITLE_LENGTH = 200;
  static readonly MAX_DESCRIPTION_LENGTH = 2000;

  constructor(data: PostProps | null) {
    if (!data) return;

    this._post_id = data.post_id;
    this._title = data.title;
    this._description = data.description;
    this._user_id = data.user_id;
    this._image_id = data.image_id;
    this._status = data.status;

    const timeNow = new Date().toISOString();

    this._created_at = data.created_at || timeNow;
    this._updated_at = data.updated_at || timeNow;

    // this.validate();
  }

  get post_id(): string {
    return this._post_id;
  }

  get title(): string | undefined {
    return this._title;
  }

  get description(): string | undefined {
    return this._description;
  }

  get user_id(): string {
    return this._user_id;
  }

  get image_id(): string | undefined {
    return this._image_id;
  }

  get created_at(): string | undefined {
    return this._created_at;
  }

  get updated_at(): string | undefined {
    return this._updated_at;
  }

  get status(): number | undefined {
    return this._status;
  }

  toJson(): {
    post_id: string;
    title: string;
    description: string;
    user_id: string;
    image_id: string;
    status: PostStatus;
    created_at: string;
    updated_at: string;
  } {
    const json = {
      post_id: this._post_id,
      title: this._title,
      description: this._description,
      user_id: this._user_id,
      image_id: this._image_id,
      status: this._status,
      created_at: this._created_at,
      updated_at: this._updated_at,
    };

    if (Object.keys(json).some((key) => json[key as keyof typeof json] === undefined)) {
      throw new ValidationError("Post is not fully initialized");
    }

    return Object.freeze({
      post_id: this._post_id,
      title: this._title as string,
      description: this._description as string,
      user_id: this._user_id,
      image_id: this._image_id as string,
      status: this._status as PostStatus,
      created_at: this._created_at as string,
      updated_at: this._updated_at as string,
    });
  }

  validatePostFields(): void {
    this.validateRequiredFields();
    this.validateTitle();
    this.validateDescription();
  }

  private validateTitle(): void {
    if (!this._title?.trim()) {
      throw new ValidationError("Title is required and cannot be empty");
    }
    if (this._title.length > Post.MAX_TITLE_LENGTH) {
      throw new ValidationError(`Title cannot be longer than ${Post.MAX_TITLE_LENGTH} characters`);
    }
  }

  private validateDescription(): void {
    if (!this._description?.trim()) {
      throw new ValidationError("Description is required and cannot be empty");
    }
    if (this._description.length > Post.MAX_DESCRIPTION_LENGTH) {
      throw new ValidationError(`Description cannot be longer than ${Post.MAX_DESCRIPTION_LENGTH} characters`);
    }
  }

  private validateRequiredFields(): void {
    if (!this._post_id) throw new ValidationError("Post ID is required");
    if (!this._user_id) throw new ValidationError("User ID is required");
    if (!this._image_id) throw new ValidationError("Image ID is required");
  }

  sanitizePostInputs(helpers: IHelpers): void {
    if (this._title) this._title = helpers.sanitize(this._title);
    if (this._description) this._description = helpers.sanitize(this._description);
  }

  sanitizeAndValidatePostInputs(helpers: IHelpers): void {
    this.sanitizePostInputs(helpers);
    this.validatePostFields();
  }

  validatePostFieldsForUpdate(): void {
    if (this._title && this._title.trim() === "") {
      throw new ValidationError("Title cannot be empty");
    }
    if (this._description && this._description.trim() === "") {
      throw new ValidationError("Description cannot be empty");
    }
  }

  beforeUpdate(helpers: IHelpers): {
    title?: string;
    description?: string;
  } {
    if (!this._title && !this._description) {
      throw new ValidationError("No fields to update");
    }

    this.validatePostFieldsForUpdate();
    this.sanitizePostInputs(helpers);

    const data = {
      title: this._title,
      description: this._description,
    };

    Object.keys(data).forEach((key) => {
      if (!data[key as keyof typeof data]) {
        delete data[key as keyof typeof data];
      }
    });

    return data;
  }
}
