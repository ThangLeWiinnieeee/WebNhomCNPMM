const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');

router.post('/register',accountController.registerPost);
router.post('/login',accountController.loginPost);
router.post('/logout',accountController.logoutPost);

module.exports = router;