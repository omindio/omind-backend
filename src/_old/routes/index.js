import userRoutes from './api/user.routes';
import authRoutes from './api/auth.routes';
//import docRoutes from './api/doc.routes';

import { Router } from 'express';
const routes = Router();

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  swaggerDefinition: {
    // Like the one described here: https://swagger.io/specification/#infoObject
    info: {
      title: 'node-express-mongo API',
      version: '1.0.0',
      description: '',
      contact: {
        'name': "API Support",
        "email": "omindbrand@gmail.com"
      }
    },
  },
  // List of files to be processes. You can also set globs './routes/*.js'
  apis: ['./api/user.routes.js'],
};

const specs = swaggerJsdoc(options);

export default (app) => {

    //app.use('/api/docs', docRoutes);
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);

    //middleware to handle errors
    app.use((err, req, res, next) => {
        if (err.name === 'UnauthorizedError') {
            // jwt authentication error
            return res.status(401).json({ message: err.message });
        } 
        if (err.name === 'Error') {
            return res.status(400).json({ status: 'error', message: err.message });
        }
        //default to 500 server error
        return res.status(500).json({ status: 'error', message: err.message });
    });

};