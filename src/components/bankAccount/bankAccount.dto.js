//Data Transfer Object
export default class BankAccountDTO {
  constructor(data) {
    if (typeof data !== 'object' || data === null || typeof data === 'undefined') data = {};

    this.id = data.id;
    this.iban = data.iban;
    this.swift = data.swift;
    this.vat = data.vat;
    this.bankName = data.bankName;
    this.routeNumber = data.routeNumber;
    this.status = data.status;
    this.createdDate = data.createdDate;
    this.user = data.user;

    Object.freeze(this);
  }
}
