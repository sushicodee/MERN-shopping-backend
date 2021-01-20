const UserModel = require('./../models/user.model');
const bcrypt = require('bcryptjs');
const userMapper = (user, data) => {
  for (key in data) {
    switch (key) {
      default:
        if (
          [
            'name',
            'email',
            'passwordHash',
            'phone',
            'isAdmin',
            'apartment',
            'zip',
            'city',
            'country',
            'street',
          ].includes(key)
        ) {
          user[key] = data[key];
        }
        break;
    }
  }
};

const insert = (data) => {
  const newUser = new UserModel({});
  userMapper(newUser, data);
  if (data.password) {
    newUser.passwordHash = bcrypt.hashSync(data.password, 10);
  }
  return newUser.save();
};
const findAll = () => {
  return UserModel.find().select('-passwordHash');
};
const findById = (id) => {
  return UserModel.findById(id).select('-passwordHash');
};

const findOne = (email) => {
  return UserModel.findOne({ email }).select('-passwordHash');
};

//auth
const login = ({ email }) => {
  return UserModel.findOne({ email });
};

const getCount = async (_, res, next) => {
  try {
    const userCount = await UserModel.countDocuments((count) => count);
    res.status(200).json({ userCount });
  } catch (err) {
    next({ err, status: 500 });
  }
};

const remove = (id, res, next) => {
  UserModel.findById(id, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next({ message: 'user not found' });
    }
    user.remove((err, data) => {
      if (err) {
        return next(err);
      }
      res
        .status(200)
        .json({ data, message: 'the user is removed', success: true });
    });
  });
};
module.exports = {
  insert,
  findById,
  findAll,
  getCount,
  login,
  remove,
  findOne,
};
