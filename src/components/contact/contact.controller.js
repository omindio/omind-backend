import * as Service from './contact.service';
import ContactDTO from './contact.dto';

export const send = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    const contactDTO = new ContactDTO({ name, email, subject, message });
    await Service.send(contactDTO);
    res.status(204).json();
  } catch (err) {
    return next(err);
  }
};
