import * as AuthMiddleware from './auth/auth.middleware';
import * as UserService from './user.service';
import UserDTO from './user.dto';

import routes from './user.routes';
import authRoutes from './auth/auth.routes';

import * as Seeds from './seeds';

//TODO: https://github.com/tc39/ecma262/pull/1174
//export * as Service from './user.service';
//export * as Middleware from './user.middleware';
//export { Role } from './user.roles';

//Set auth to false to create custom auth.
const initialize = async (app, auth = true) => {
    app.use('/users', routes);
   
    if (auth) app.use('/users/auth', authRoutes);
    try {
        await Seeds.createUserAdmin();
    } catch (err) {
        return;
    }
}

export {
    initialize,
    AuthMiddleware,
    UserService,
    UserDTO
}

