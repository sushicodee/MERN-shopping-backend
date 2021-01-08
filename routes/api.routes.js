const router = require('express').Router();
// const authenticate = require('./../middlewares/authenticate');
// router.use("/auth", require("./auth/auth.route"));
router.use('/user', require('./user/user.route'));
router.use('/category', require('./category/category.route'));
router.use('/product', require('./product/product.route'));
router.use('/order', require('./order/order.route'));
module.exports = router;
