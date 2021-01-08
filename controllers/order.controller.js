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
    return next(err);
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
    return next(err);
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
    return next({ err });
  }
};

const remove = (req, res, next) => {
  orderQuery.remove(req.params.id, res, next);
};

module.exports = { insert, findAll, findById, update, remove };
