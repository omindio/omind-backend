import * as Service from './user.service';
import DTO from './user.dto';
import * as DAL from './user.dal';

import routes from './user.routes';
import * as UserSeed from './seeds/user.seed';

const initialize = async app => {
  app.use('/users', routes);

  //seeding
  try {
    await UserSeed.createUserAdmin();
  } catch (err) {
    //TODO: Study handling errors (write in logs)
    //throw err;
    return;
  }
};

export { initialize, Service, DTO, DAL };
