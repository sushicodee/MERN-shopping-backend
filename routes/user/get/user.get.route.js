const UserController = require('./../../../controllers/user.controller');
const router = require('express').Router();
router.route('/count').get(UserController.getCount);
module.exports = router;
