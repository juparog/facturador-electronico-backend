import { db } from '../models';

const getListUser = async (req, res) => {
  const data = await db.User.findAll({});
  res.status(200).json({ data });
};

const createUser = async (req, res) => {
  const data = await db.User.create(req.body);
  res.status(200).json({ data });
};

const updateUser = async (req, res) => {
  const num = await db.User.update(req.body, {
    where: {
      id: req.params.id,
    },
  });
  if (num[0] === 1) {
    res.status(200).json({
      data: {
        id: req.params.id,
        ...req.body,
      },
    });
  }
  res.status(200).json({ message: 'No se pudo actualizar el usuario' });
};

export { getListUser, createUser, updateUser };
