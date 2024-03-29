//Data Transfer Object
export default class ClientDTO {
  constructor(data) {
    if (typeof data !== 'object' || data === null || typeof data === 'undefined') data = {};

    this.id = data.id;
    this.companyName = data.companyName;
    this.slug = data.slug;
    this.description = data.description;
    this.logoFile = data.logoFile || undefined;
    this.logo = data.logo;
    this.cif = data.cif;
    this.fiscalAddress = data.fiscalAddress;
    this.phone = data.phone;
    this.published = data.published;
    this.socialLinkedin = data.socialLinkedin;
    this.socialFacebook = data.socialFacebook;
    this.socialInstagram = data.socialInstagram;
    this.web = data.web;
    this.createdDate = data.createdDate;
    this.user = data.user;

    Object.freeze(this);
  }
}
