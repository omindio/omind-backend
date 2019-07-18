export default class ContactDTO {
  constructor(data) {
    if (typeof data !== 'object' || data === null || typeof data === 'undefined') data = {};

    this.name = data.name;
    this.email = data.email;
    this.subject = data.subject;
    this.message = data.message;

    Object.freeze(this);
  }
}
