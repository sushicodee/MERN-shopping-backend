const router = require('express').Router();
const UserController = require('./../../controllers/user.controller');

router.route('/').get(UserController.findAll);
router.route('/login').post(UserController.login);
router.route('/register').post(UserController.insert);

router.use('/get', require('./get/user.get.route'));
router.route('/:id').get(UserController.findById).delete(UserController.remove);
//   .delete(UserController.remove)
//   .put(UserController.update);
module.exports = router;
