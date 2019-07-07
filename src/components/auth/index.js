import * as middleware from './auth.middleware';
import routes from './auth.routes';

const initialize = async app => {
  app.use('/auth', routes);
};

export { initialize, middleware };
