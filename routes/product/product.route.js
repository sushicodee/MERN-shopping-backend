const router = require('express').Router();
const productController = require('./../../controllers/product.controller');
// const Authenticate = require("./../../middlewares/authenticate");

router.route('/').get(productController.findAll).post(productController.insert);
router.use('/get', require('./get/product.get.route'));

router
  .route('/:id')
  .get(productController.findById)
  .put(productController.update)
  .delete(productController.remove);
module.exports = router;
