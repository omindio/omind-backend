//Data Transfer Object
export default class ProductImageDTO {
  constructor(data) {
    if (typeof data !== 'object' || data === null || typeof data === 'undefined') data = {};

    this.id = data.id;
    this.title = data.title;
    this.imageFile = data.imageFile || undefined;
    this.coverPage = data.coverPage;
    this.published = data.published;
    this.path = data.path;
    this.main = data.main;
    this.createdDate = data.createdDate;

    Object.freeze(this);
  }
}
