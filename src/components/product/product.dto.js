//Data Transfer Object
export default class ProductDTO {
  constructor(data) {
    if (typeof data !== 'object' || data === null || typeof data === 'undefined') data = {};

    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.description = data.description;
    this.metaDescription = data.metaDescription;
    this.startedDate = data.startedDate;
    this.finishedDate = data.finishedDate;
    this.published = data.published;
    this.status = data.status;
    this.tags = data.tags;
    this.images = data.images;
    this.createdDate = data.createdDate;

    Object.freeze(this);
  }
}
