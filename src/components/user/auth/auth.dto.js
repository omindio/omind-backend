export default class AuthDTO {
  constructor(data) {
    if (typeof data !== 'object' || data === null || typeof data === 'undefined') data = {};

    this.email = data.email;
    this.password = data.password;
  }

  toString() {
    return `${this.email} |
                ${this.password}`;
  }

  print() {
    console.log(this.toString());
  }
}
