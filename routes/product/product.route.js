const router = require('express').Router();
const ProductController = require('./../../controllers/product.controller');
// const Authenticate = require("./../../middlewares/authenticate");
const upload = require('./../../middlewares/fileFilter');
router
  .route('/')
  .get(ProductController.findAll)
  .post(upload.single('image'), ProductController.insert);
router
  .route('/gallery-images/:id')
  .put(upload.array('images', 10), ProductController.uploadGallery);
router.use('/get', require('./get/product.get.route'));

router
  .route('/:id')
  .get(ProductController.findById)
  .put(ProductController.update)
  .delete(ProductController.remove);
module.exports = router;
