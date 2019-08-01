import * as Service from './project.service';
import DTO from './project.dto';
import * as DAL from './project.dal';
import * as routes from './project.routes';

const initialize = async app => {
  app.use('/projects', routes.protectedRoutes());
  
  app.use('/public/projects', routes.publicRoutes());
};

export { initialize, Service, DTO, DAL };
