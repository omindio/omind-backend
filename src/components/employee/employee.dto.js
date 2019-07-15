//Data Transfer Object
export default class ClientDTO {
  constructor(data) {
    if (typeof data !== 'object' || data === null || typeof data === 'undefined') data = {};

    this.id = data.id;
    this.workPosition = data.workPosition;
    this.dni = data.dni;
    this.fiscalAddress = data.fiscalAddress;
    this.phone = data.phone;
    this.socialLinkedin = data.socialLinkedin;
    this.socialFacebook = data.socialFacebook;
    this.socialInstagram = data.socialInstagram;
    this.web = data.web;
    this.createdDate = data.createdDate;
    this.user = data.user;

    Object.freeze(this);
  }
}
