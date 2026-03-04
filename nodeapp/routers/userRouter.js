const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

console.log("Controller methods:", Object.keys(userController));

router.post('/register', userController.addUser);
router.post('/login', userController.getUserByEmailAndPassword);
router.get('/refresh', userController.refreshToken);

module.exports = router;