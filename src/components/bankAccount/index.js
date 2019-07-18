import * as Service from './bankAccount.service';
import DTO from './bankAccount.dto';
import * as DAL from './bankAccount.dal';
import routes from './bankAccount.routes';

const initialize = async app => {
  app.use('/bank-accounts', routes);
};

export { initialize, Service, DTO, DAL };
