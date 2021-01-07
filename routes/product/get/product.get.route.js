const productController = require('./../../../controllers/product.controller');
const router = require('express').Router();
router.route('/count').get(productController.getCount);
router.route('/featured/:count').get(productController.getFeatured);

module.exports = router;
