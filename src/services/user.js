import models from '../models';
import {logger} from '../helpers/console';

const update = (documentNumber, body) => {
  logger.info(' ::: service.user.update');
  return models.User.update(body, {
    where: {
      documentNumber: documentNumber,
    },
  });
}
