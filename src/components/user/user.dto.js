//Data Transfer Object
import { roles as Role } from './config';

export default class UserDTO {
  constructor(data) {
    if (typeof data !== 'object' || data === null || typeof data === 'undefined') data = {};

    this.id = data.id;
    this.name = data.name;
    this.lastName = data.lastName;
    this.email = data.email;
    this.password = data.password;
    this.createdDate = data.createdDate;
    this.role = data.role;
    this.isVerified = data.isVerified;
  }

  toString() {
    return `${this.id} |
                ${this.name} |
                ${this.lastName} |
                ${this.email} |
                ${this.password} |
                ${this.createdDate} |
                ${this.role}`;
  }

  print() {
    console.log(this.toString());
  }
}
