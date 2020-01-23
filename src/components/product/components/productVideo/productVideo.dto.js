//Data Transfer Object
export default class ProductVideoDTO {
  constructor(data) {
    if (typeof data !== 'object' || data === null || typeof data === 'undefined') data = {};

    this.id = data.id;
    this.title = data.title;
    this.url = data.url;
    this.published = data.published;
    this.source = data.source;
    this.createdDate = data.createdDate;

    Object.freeze(this);
  }
}
