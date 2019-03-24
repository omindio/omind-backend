import { Router } from 'express';
const router = Router();

import userRoutes from './api/user.routes';
import authRoutes from './api/auth.routes';

export default (app) => {

    app.use('/api', router);

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