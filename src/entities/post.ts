import { IHelpers } from "../app/helpers/IHelpers.js";
import { ValidationError } from "../shared/error/validation-error.js";

export class Post {
  private _post_id: string = "";
  private _title: string = "";
  private _description: string = "";
  private _user_id: string = "";
  private _image_id: string = "";

  constructor(data: {
    post_id: string;
    title: string;
    description: string;
    user_id: string;
    image_id: string;
  } | null) {
    
    if (!data) return;

    this._post_id = data.post_id;
    this._title = data.title;
    this._description = data.description;
    this._user_id = data.user_id;
    this._image_id = data.image_id;

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

  toJson(): {
    post_id: string;
    title: string;
    description: string;
    user_id: string;
    image_id: string;
  } {
    return Object.freeze({
      post_id: this._post_id,
      title: this._title,
      description: this._description,
      user_id: this._user_id,
      image_id: this._image_id,
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

  sanitize(helpers: IHelpers) {
    this._title = helpers.sanitize(this._title);
    this._description = helpers.sanitize(this._description);
    // this._user_id = helpers.sanitize(this._user_id);
    // this._image_id = helpers.sanitize(this._image_id);

  }
}

