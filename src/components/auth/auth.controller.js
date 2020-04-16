import * as Service from './auth.service';
import AuthDTO from './auth.dto';
import { config } from '@config';

export const auth = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const authDTO = new AuthDTO({ email, password });
    const token = await Service.auth(authDTO);
    res.status(200).json({ token: token });
  } catch (err) {
    return next(err);
  }
};

export const authBrowser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const authDTO = new AuthDTO({ email, password });
    const token = await Service.auth(authDTO);

    res
      .cookie('token', token, {
        expires: new Date(Date.now() + config.auth.tokenTime),
        secure: false, // set to true if your using https
        httpOnly: true,
        sameSite: true,
      })
      .sendStatus(200);
  } catch (err) {
    return next(err);
  }
};

export const authBrowserLogout = async (req, res, next) => {
  try {
    res.clearCookie('token').sendStatus(200);
  } catch (err) {
    return next(err);
  }
};
