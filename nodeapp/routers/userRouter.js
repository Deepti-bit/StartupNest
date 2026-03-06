const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateToken } = require('../authUtils'); 

router.post('/register', userController.addUser);
router.post('/login', userController.getUserByEmailAndPassword);
router.get('/refresh', userController.refreshToken);
router.get('/all-users', validateToken, userController.getAllUsers);
router.put('/update-user', validateToken, userController.updateUserByAdmin);
router.get('/pending-mentors', validateToken, userController.getPendingMentors);
router.post('/approve-mentor', validateToken, userController.updateMentorStatus);

module.exports = router;