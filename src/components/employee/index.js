import * as Service from './employee.service';
import DTO from './employee.dto';
import * as DAL from './employee.dal';
import routes from './employee.routes';

const initialize = async app => {
  app.use('/employees', routes);
};

export { initialize, Service, DTO, DAL };
