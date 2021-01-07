const router = require('express').Router();
const CategoryController = require('./../../controllers/category.controller');

router
  .route('/')
  .get(CategoryController.findAll)
  .post(CategoryController.insert);

router
  .route('/:id')
  .get(CategoryController.findById)
  .delete(CategoryController.remove)
  .put(CategoryController.update);

module.exports = router;
