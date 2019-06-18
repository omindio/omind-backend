import * as Service from './auth.service';
import AuthDTO from './auth.dto';

export const auth = async (req, res, next) => {
  try {
    let authDTO = new AuthDTO(req.body);
    let token = await Service.auth(authDTO);
    res.status(200).json({ token: token });
    //res.cookie('token', token, { maxAge: 60 * 60 * 24 * 7, httpOnly: true });
  } catch (err) {
    return next(err);
  }
};
