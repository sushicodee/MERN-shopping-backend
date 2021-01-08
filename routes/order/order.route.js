const router = require('express').Router();
const OrderController = require('./../../controllers/order.controller');

router.route('/').get(OrderController.findAll).post(OrderController.insert);

router
  .route('/:id')
  .get(OrderController.findById)
  .delete(OrderController.remove)
  .put(OrderController.update);

module.exports = router;
