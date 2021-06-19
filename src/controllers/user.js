import { db } from '../models';

const listUser = async (req, res) => {
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
  res.status(200).json({ data: req.body });
};

export { listUser, createUser, updateUser };
