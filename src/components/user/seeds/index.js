import UserDTO from '../user.dto';
import * as UserService from '../user.service';

export const createUserAdmin = async () => {
    try {
        const userDTO = new UserDTO({
            name: 'David',
            lastName: 'González Hidalgo',
            email: 'omindbrand@gmail.com',
            password: '12345678',
            role: 'Admin'
        });
        await UserService.create(userDTO);
    } catch (err) {
        throw err;
    }
};