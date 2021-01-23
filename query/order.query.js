const OrderItemModel = require('../models/order-item.model');
const OrderModel = require('./../models/order.model');

const orderMapper = (category, data) => {
  for (key in data) {
    switch (key) {
      default:
        if (
          [
            'shippingAddress1',
            'shippingAddress2',
            'city',
            'zip',
            'country',
            'phone',
            'status',
            'user',
          ].includes(key)
        ) {
          category[key] = data[key];
        }
        break;
    }
  }
};

const insert = async (data) => {
  const newOrder = new OrderModel({});
  const orderItemIds = Promise.all(
    data.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItemModel({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );
  const orderItemsIdsResolved = await orderItemIds;
  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItemModel.findById(orderItemId).populate(
        'product',
        'price'
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );
  const totalPrice = totalPrices.reduce((acc, p) => acc + p, 0);
  newOrder.orderItems = orderItemsIdsResolved;
  newOrder.totalPrice = totalPrice;
  orderMapper(newOrder, data);
  return newOrder.save();
};

const findAll = () => {
  return OrderModel.find().populate('user', 'name').sort({ dateOrdered: -1 });
};

const find = (condition = {}, query = {}, options = {}) => {
  return new Promise((resolve, reject) => {
    console.log(condition);
    let perPage = parseInt(options.perPage) || 100;
    let currentPage = (parseInt(options.currentPage) || 1) - 1;
    let skipCount = perPage * currentPage;
    let sortObj = {};
    let sortVal = 1;
    if (options && options.sort) {
      switch (options.sort.sort) {
        case 'asc':
          sortVal = 1;
          break;
        case 'desc':
          sortVal = -1;
          break;
        default:
          break;
      }
      if (options.sort.sortBy) {
        sortObj['_id'] = sortVal;
      } else {
        sortObj[options.sort.sortBy] = sortVal;
      }
    }
    OrderModel.find(condition, {})
      .sort(sortObj)
      // .skip(skipCount)
      .populate({
        path: 'orderItems',
        populate: {
          path: 'product',
          populate: 'category',
        },
      })
      .exec((err, data) => {
        if (!err) {
          OrderModel.countDocuments(condition).exec((count_error, count) => {
            if (count_error) {
              return reject(count_error);
            }
            resolve({ data, count });
          });
        }
      });
  });
};
const findById = (id) => {
  return OrderModel.findById(id)
    .populate('user', 'name')
    .populate({
      path: 'orderItems',
      populate: {
        path: 'product',
        populate: 'category',
      },
    });
};

//update status
const update = (id, data) => {
  return OrderModel.findByIdAndUpdate(
    id,
    { status: data.status },
    { new: true }
  );
};

const remove = (id, res, next) => {
  OrderModel.findByIdAndRemove(id)
    .then(async (order) => {
      if (!order) {
        return next({ message: 'order not found' });
      }
      await order.orderItems.map(async (orderItem) => {
        await OrderItemModel.findByIdAndRemove(orderItem);
      });

      res
        .status(200)
        .json({ message: 'Order Items deleted successfully', success: true });
    })
    .catch((err) => {
      return next(err);
    });
};

const getTotalSales = async (req, res, next) => {
  const totalSales = await OrderModel.aggregate([
    { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } },
  ]);
  if (!totalSales) {
    return next('The order sales cannot be generated');
  }
  res.status(200).json({ totalsales: totalSales.pop().totalsales });
};

const getCount = async (_, res, next) => {
  try {
    const orderCount = await OrderModel.countDocuments((count) => count);
    res.status(200).json({ orderCount });
  } catch (err) {
    next({ err, status: 500 });
  }
};

const getUserOrders = (id) => {
  return OrderModel.find({ user: id })
    .populate({
      path: 'orderItems',
      populate: { path: 'product', populate: 'category' },
    })
    .sort({ dateOrdered: -1 });
};
module.exports = {
  orderMapper,
  insert,
  findAll,
  findById,
  update,
  remove,
  getTotalSales,
  getCount,
  getUserOrders,
  find,
};
