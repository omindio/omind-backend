import routes from './src/user.routes';

//TODO: https://github.com/tc39/ecma262/pull/1174
//export * as Service from './src/user.service';

//TODO: Dependency Injection? (AuthLibrary). Not self-contained.

export const initialize = (app) => {
    app.use('/users', routes);
}