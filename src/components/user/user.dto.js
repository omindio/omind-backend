import { roles as Role } from './config/roles';

export default class UserContext {
    constructor(data) {
        if (typeof data !== 'object' || data === null || typeof data === 'undefined')
            data = {};      
       
        this._id = data._id;
        this.name = data.name ;
        this.lastName = data.lastName;
        this.email = data.email;
        this.password = data.password;
        this.createdDate = data.createdDate;
        this.role = data.role || Role.User;
    };

    toString() {
        return `${this._id} | 
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