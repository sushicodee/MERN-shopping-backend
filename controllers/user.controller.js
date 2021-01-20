const UserQuery = require('./../query/user.query');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./../configs');
const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
};
const insert = async (req, res, next) => {
  const data = req.body;
  // try {
  //   const user = await UserQuery.findOne(data.email);
  //   if (user) {
  //     return next('User Exists');
  //   }
  // } catch (err) {
  //   return next(err);
  // }
  try {
    const user = await UserQuery.insert(data);
    res.status(200).json({ user, success: true, status: 200 });
  } catch (err) {
    next(err);
  }
};

const findById = async (req, res, next) => {
  try {
    const user = await UserQuery.findById(req.params.id);
    if (!user) {
      return next({ msg: 'User not found', success: false, status: 500 });
    }
    res.status(200).json({ user, success: true, status: 200 });
  } catch (err) {
    return next({ err, success: false, status: 500 });
  }
};

const findAll = async (req, res, next) => {
  try {
    const userList = await UserQuery.findAll();
    return res.status(200).json({ userList, success: true });
  } catch (err) {
    return next({ err, success: false, status: 500 });
  }
};

//auth
const login = async (req, res, next) => {
  const data = req.body;
  try {
    const user = await UserQuery.login(data);
    if (user && bcrypt.compareSync(data.password, user.passwordHash)) {
      const token = await generateAccessToken({
        userId: user._id,
        isAdmin: user.isAdmin,
      });
      return res
        .status(200)
        .json({ user: user.email, token, success: true, status: 200 });
    }
    next({ msg: 'email/Password is invalid', status: 401 });
  } catch (err) {
    next({ msg: 'email/Password is invalid', status: 401 });
    // next({ err, success: false, status: 400 });
  }
};

const getCount = (req, res, next) => {
  UserQuery.getCount(req, res, next);
};

const remove = (req, res, next) => {
  userQuery.remove(req.params.id, res, next);
};
module.exports = { insert, findById, findAll, login, getCount, remove };
