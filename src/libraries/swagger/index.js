import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import appRoot from 'app-root-path';

//TODO: Split in multiple files

export const initialize = app => {
  let swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'REST API Documentation',
      version: '1.0.0', //Version of the app
      description: '',
    },
    //TODO: Add https after SSL/TLS configured
    schemes: ['http', 'https'],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          //bearerFormat: 'JWT',
        },
      },
    },
    //host: 'localhost:3000', // the host or url of the app
    //basePath: '/', // the basepath of your endpoint
  };

  // options for the swagger docs
  let options = {
    swaggerDefinition,
    // path to the API docs
    apis: [appRoot + '/src/components/**/*.yaml'],
  };

  let swaggerSpec = swaggerJSDoc(options);

  //TODO: Secure access in production
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
