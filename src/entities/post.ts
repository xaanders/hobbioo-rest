import { IHelpers } from "../app/helpers/IHelpers.js";
import { ValidationError } from "../shared/error/validation-error.js";

export class Post {
  private _post_id: string = "";
  private _title: string = "";
  private _description: string = "";
  private _user_id: string = "";
  private _image_id: string = "";
  private _status: number = 1;
  private _created_at: string = "";
  private _updated_at: string = "";

  constructor(data: {
    post_id: string;
    title: string;
    description: string;
    user_id: string;
    image_id: string;
    status: number;
    created_at?: string;
    updated_at?: string;
  } | null) {
    
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

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get user_id(): string {
    return this._user_id;
  }

  get image_id(): string {
    return this._image_id;
  }

  get created_at(): string {
    return this._created_at;
  }

  get updated_at(): string {
    return this._updated_at;
  }

  get status(): number {
    return this._status;
  }

  toJson(): {
    post_id: string;
    title: string;
    description: string;
    user_id: string;
    image_id: string;
    created_at: string;
    updated_at: string;
    status: number;
  } {
    return Object.freeze({
      post_id: this._post_id,
      title: this._title,
      description: this._description,
      user_id: this._user_id,
      image_id: this._image_id,
      created_at: this._created_at,
      updated_at: this._updated_at,
      status: this._status,
    });
  }

  validatePostFields(): void {
    if (!this._post_id) throw new ValidationError("Post ID is required");
    if (!this._title) throw new ValidationError("Title is required");
    if (this._title.length > 200) throw new ValidationError("Title is too long");
    if (!this._description) throw new ValidationError("Description is required");
    if (this._description.length > 2000) throw new ValidationError("Description is too long");
    if (!this._user_id) throw new ValidationError("User ID is required");
    if (!this._image_id) throw new ValidationError("Image ID is required");
  }

  sanitize(helpers: IHelpers): void {
    this._title = helpers.sanitize(this._title);
    this._description = helpers.sanitize(this._description);
    // this._user_id = helpers.sanitize(this._user_id);
    // this._image_id = helpers.sanitize(this._image_id);

  }

  sanitizeAndValidate(helpers: IHelpers): void {
    this.sanitize(helpers);
    this.validatePostFields();
  }
}

