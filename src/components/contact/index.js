import routes from './contact.routes';

const initialize = async app => {
  app.use('/contact', routes);
};

export { initialize };
