import models from '../../models/index.model';
import userService from '../../services/user';
import { parentLogger, getCallerFile } from '../logger';

const log = parentLogger.child({location: `src/helpers/db/${getCallerFile()}`});

const categories = async () => {
  log.debug('funcion categories');
  log.info('Sincronizando categorias...');
  
  const [category, created] = await models.Category.findOrCreate({
    where: {
      name: 'Sin categoría'
    },
  });

  if (created) {
    log.debug(`Se creo la categoria: ${category.name}`);
  }
  log.info('Sincronizacion de las categorias completa!.');
}

const users = async () => {
  log.debug('funcion users');
  log.info('Sincronizando usuarios...');
  
  const [user, created] = await models.User.findOrCreate({
    where: {
      username: 'admin'
    },
    defaults: {
      firstName: 'MonkeyWit',
      lastName: 'Admin',
      username: 'admin',
      password: await userService.hashPassword('Admin2022*'),
      email: 'engineer.jrg@gmail.com',
      documentNumber: 'monkeywitadmin'
    }
  });
  
  if (created) {
    log.debug(`Se creo el usuario: ${user.username}`);
  }
  log.info('Sincronizacion de los usuarios completa!.');
};

export default {
  categories,
  users
};
