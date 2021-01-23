const router = require('express').Router();
const OrderController = require('./../../controllers/order.controller');

router.route('/').get(OrderController.findAll).post(OrderController.insert);
router.use('/get', require('./get/order.get.route'));
router.route('/search').post(OrderController.search);
router
  .route('/:id')
  .get(OrderController.findById)
  .delete(OrderController.remove)
  .put(OrderController.update);

module.exports = router;
