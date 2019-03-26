import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { config } from '../config'

import User from '../models/user.model';

export const auth = (req, res) => {
    //find the user
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) throw err;
        if (!user) {
            res.status(400).json({ status: 'fail', message: 'Authentication failed. User not found.' });
        } else if (user) {
        bcrypt.compare(req.body.password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    role: user.role
                };
                // Sign token
                jwt.sign(
                    payload, config.auth.secret,
                    {
                        expiresIn: config.auth.tokenTime
                    },
                    (err, token) => {
                        if (err) throw err;
                        res.status(200).json({
                            status: 'success',
                            token: token
                        });
                    }
                );
            } else {
                return res
                .status(400)
                .json({ status: 'error', message: 'Authentication failed. Wrong password.' });
            }
        });
    }});
};