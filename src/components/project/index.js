import * as Service from './project.service';
import DTO from './project.dto';
import * as DAL from './project.dal';
import routes from './project.routes';

const initialize = async app => {
  app.use('/projects', routes);
};

export { initialize, Service, DTO, DAL };
