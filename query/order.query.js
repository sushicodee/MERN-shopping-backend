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
  OrderModel.findById(id)
    .then(async (order) => {
      if (!order) {
        return next({ message: 'order not found' });
      }
      console.log(order.orderItems);
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
module.exports = {
  orderMapper,
  insert,
  findAll,
  findById,
  update,
  remove,
  getTotalSales,
  getCount,
};
