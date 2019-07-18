import sgMail from '@sendgrid/mail';

import ContactDTO from './contact.dto';
import * as ContactValidation from './validation/contact.validation';

import { ValidationSchemaError } from '@libraries/Error';
import { config } from '@config';

export const send = async contactDTOParameter => {
  try {
    if (!(contactDTOParameter instanceof ContactDTO))
      throw new InstanceofError('Param sent need to be an ContactDTO.');

    //validate
    await ContactValidation.sendContactSchema.validate(contactDTOParameter, {
      abortEarly: false,
    });

    _sendEmail(contactDTOParameter)
      .then()
      .catch(err => console.log(err));
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

const _sendEmail = async contactDTOParameter => {
  try {
    if (!(contactDTOParameter instanceof ContactDTO))
      throw new InstanceofError('Param sent need to be an ContactDTO.');

    const { name, email, subject, message } = contactDTOParameter;
    sgMail.setApiKey(config.sendgridApiKey);
    const msg = {
      to: config.contactEmail,
      from: email,
      subject: 'Contact from Web.',
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };
    sgMail.send(msg);
  } catch (err) {
    throw err;
  }
};
