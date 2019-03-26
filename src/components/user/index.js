import routes from './src/user.routes';

//TODO: https://github.com/tc39/ecma262/pull/1174
//export * as Service from './src/user.service';

export const initialize = (app) => {
    app.use('/api/users', routes);
}