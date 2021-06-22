const indexPage = (req, res) => res
  .status(200)
  .json({ message: 'Bienvenido a la api de Facturador Electrónico.' });

export { indexPage };
