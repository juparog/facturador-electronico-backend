import { db } from '../models';

const getListUser = async (req, res) => {
  const data = await db.User.findAll({});
  if (data) {
    res.status(200).json({ data });
  } else {
    res.status(409).json({ message: 'No se pudo listar los usuarios' });
  }
};

const getOneUser = async (req, res) => {
  const data = await db.User.findOne({
    where: req.params,
  });
  res.status(200).json({ data });
};

const createUser = async (req, res) => {
  const data = await db.User.create(req.body);
  if (data) {
    res.status(200).json({ data });
  } else {
    res.status(409).json({ message: 'No se pudo crear el usuario' });
  }
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
  } else {
    res.status(409).json({ message: 'No se pudo actualizar el usuario' });
  }
};

export {
  getListUser, createUser, updateUser, getOneUser
};
