const orderQuery = require('./../query/order.query');
const insert = (req, res, next) => {
  const data = req.body;
  orderQuery
    .insert(data)
    .then((data) => {
      res.status(200).json({ data, success: true });
    })
    .catch((err) => {
      next(err);
    });
};

const findAll = async (req, res, next) => {
  try {
    const orderList = await orderQuery.findAll();
    return res.status(200).json({ orderList, success: true });
  } catch (err) {
    next(err);
  }
};

const findById = async (req, res, next) => {
  try {
    const order = await orderQuery.findById(req.params.id);
    if (!order) {
      return next({ msg: 'order not found' });
    }
    res.status(200).json({ order, success: true });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  if (!req.body.status) return next({ msg: 'Payload should contain status ' });
  try {
    const updatedOrder = await orderQuery.update(req.params.id, req.body);
    if (!updatedOrder) {
      return next({ msg: 'Order not updated' });
    }
    res.status(200).json({ updatedOrder, success: true });
  } catch (err) {
    next({ err });
  }
};

const remove = (req, res, next) => {
  orderQuery.remove(req.params.id, res, next);
};

//GET
const getTotalSales = (req, res, next) => {
  orderQuery.getTotalSales(req, res, next);
};

const getCount = (req, res, next) => {
  orderQuery.getCount(req, res, next);
};
const getUserOrders = async (req, res, next) => {
  const userid = req.params.userid;
  try {
    const userOrdeList = await orderQuery.getUserOrders(userid);
    res.status(200).json({ userOrdeList });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  insert,
  findAll,
  findById,
  update,
  remove,
  getTotalSales,
  getCount,
  getUserOrders,
};
