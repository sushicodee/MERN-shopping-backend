const OrderController = require('./../../../controllers/order.controller');
const router = require('express').Router();
router.route('/totalsales').get(OrderController.getTotalSales);
router.route('/count').get(OrderController.getCount);

module.exports = router;
