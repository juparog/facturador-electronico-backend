import { logger } from '../src/helpers/console';
import { db as models } from '../src/models';
import { dbSync, tablesTruncate } from '../src/helpers/db';

before('Iniciando la configuracion de test', async () => {
  await dbSync({ force: true });
});

after('Limpiando la configuracion de test', async () => {
  tablesTruncate();
});
