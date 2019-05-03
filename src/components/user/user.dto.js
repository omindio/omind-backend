//Data Transfer Object
import { roles as Role } from './config/roles';

export default class UserDTO {
  constructor(data) {
    if (typeof data !== 'object' || data === null || typeof data === 'undefined') data = {};

    this.id = data.id;
    this.name = data.name;
    this.lastName = data.lastName;
    this.email = data.email;
    this.password = data.password;
    this.createdAt = data.createdAt;
    this.role = data.role;
    this.isVerified = data.isVerified;
  }

  toString() {
    return `${this.id} |
                ${this.name} |
                ${this.lastName} |
                ${this.email} |
                ${this.password} |
                ${this.createdAt} |
                ${this.role}`;
  }

  print() {
    console.log(this.toString());
  }
}
