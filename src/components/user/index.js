import * as AuthMiddleware from './auth/auth.middleware';
import * as UserService from './user.service';
import UserDTO from './user.dto';

import routes from './user.routes';
import authRoutes from './auth/auth.routes';

import * as UserSeed from './seeds/user.seed';
import * as UserTest from './test/user.spec';

//TODO: https://github.com/tc39/ecma262/pull/1174
//export * as Service from './user.service';
//export * as Middleware from './user.middleware';
//export { Role } from './user.roles';


const initialize = async (app) => {
   
    //initialize auth
    app.use('/users/auth', authRoutes);

    app.use('/users', routes);
   
    //seeding
    try {
        await UserSeed.createUserAdmin();
    } catch (err) {
        //TODO: Study handling errors (write in logs)
        //throw err;
        return;
    }
}

export {
    initialize,
    AuthMiddleware,
    UserService,
    UserDTO,
    UserTest
}

