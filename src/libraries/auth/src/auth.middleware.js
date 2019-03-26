import expressJwt from 'express-jwt';

import { config } from '../../../config';

export const authorize = (roles = []) => {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }
    return [
        // authenticate JWT token and attach user to request object (req.user)
        expressJwt({
            secret: config.auth.secret
        }),
        // authorize based on user role
        (req, res, next) => {
            if (roles.length && !roles.includes(req.user.role)) {
                // user's role is not authorized
                //TODO: CREATE ERROR UNHAUTORIZED AND HANDLE TO MIDDLEWARE
                return res.status(401).json({ message: 'Unauthorized' });
            }
            // authentication and authorization successful
            next();
        }
    ];
};