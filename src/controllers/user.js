import { db } from '../models';

const userList = async (req, res) => {
  const data = await db.User.findAll({});
  res.status(200).json({ data });
};

export { userList };
