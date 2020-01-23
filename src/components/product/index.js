import * as Service from './product.service';
import DTO from './product.dto';
import * as DAL from './product.dal';
import * as routes from './product.routes';

const initialize = async app => {
  app.use('/products', routes.protectedRoutes());

  app.use('/public/products', routes.publicRoutes());
};

export { initialize, Service, DTO, DAL };
