import i18n from 'i18n-2';

import * as AuthMiddleware from './auth/auth.middleware';
import * as UserService from './user.service';
import UserDTO from './user.dto';
import UserDAL from './user.dal';

import routes from './user.routes';
import authRoutes from './auth/auth.routes';

//TODO: https://github.com/tc39/ecma262/pull/1174
//export * as Service from './user.service';
//export * as Middleware from './user.middleware';
//export { Role } from './user.roles';

//Set auth to false to create custom auth.
const initialize = (app, auth = true) => {
    app.use('/users', routes);
    if (auth) app.use('/users/auth', authRoutes);
    //lintl init
    i18n.expressBind(app, {
        locales: ['en', 'es'],
    });
}

export {
    initialize,
    AuthMiddleware,
    UserService,
    UserDTO,
    UserDAL
}

