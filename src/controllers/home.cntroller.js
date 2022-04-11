import { configEnv } from '../config/env/config';

const indexPage = (req, res) => res
  .status(200)
  .json({ message: `Bienvenido a la api de ${configEnv.get('app.name')}.` });

export { indexPage };
