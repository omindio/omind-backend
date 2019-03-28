import * as Middleware from './auth/auth.middleware';
import * as Service from './user.service';

import routes from './user.routes';
import authRoutes from './auth/auth.routes';

//import { Errors } from '@libraries';

//TODO: https://github.com/tc39/ecma262/pull/1174
//export * as Service from './user.service';
//export * as Middleware from './user.middleware';
//export { Role } from './user.roles';

//Set auth to false to create custom auth.
const initialize = (app, auth = true) => {
    app.use('/users', routes);
    if (auth) app.use('/users/auth', authRoutes);
}

export {
    initialize,
    Middleware,
    Service
}

