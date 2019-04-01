import * as Service from './auth.service';
import AuthDTO from './auth.dto';

export const auth = (req, res, next) => {
    let authDTO = new AuthDTO(req.body);
    Service.auth(authDTO)
        .then(token => { 
            res.status(200).json({ token: token }) 
        })
        .catch(err => { 
            return next(err) 
        });    
};