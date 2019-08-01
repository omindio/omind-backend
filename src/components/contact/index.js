import routes from './contact.routes';

const initialize = async app => {
  app.use('/public/contact', routes);
};

export { initialize };
