import * as Service from './auth.service';

export const auth = (req, res, next) => {
    let userData = req.body;

    Service.auth(userData)
        .then(token => {
            res.status(200).json({
                token: token
            });
        })
        .catch(next);     
};