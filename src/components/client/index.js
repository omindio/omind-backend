import * as Service from './client.service';
import DTO from './client.dto';
import * as DAL from './client.dal';
import routes from './client.routes';

const initialize = async app => {
  app.use('/clients', routes);
};

export { initialize, Service, DTO, DAL };
