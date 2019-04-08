export default class TokenDTO {
    constructor(data) {
        if (typeof data !== 'object' || data === null || typeof data === 'undefined')
            data = {};      

        this.id = data.id;
        this.userId = data.userId;
        this.token = data.token;
        this.createdAt = data.createdAt;
        this.type = data.type;
    };

    toString() {
        return `${this.id} | 
                ${this.userId} | 
                ${this.token} | 
                ${this.createdDate} |
                ${this.type}`;
    }

    print() {
        console.log(this.toString());
    }

}