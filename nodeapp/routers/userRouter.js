// routers/userRouter.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateToken } = require('../authUtils'); // Assuming you have middleware to check JWT

router.post('/register', userController.addUser);
router.post('/login', userController.getUserByEmailAndPassword);
router.get('/refresh', userController.refreshToken);

// Admin Specific Routes (Protected)
router.get('/pending-mentors', validateToken, userController.getPendingMentors);
router.post('/approve-mentor', validateToken, userController.updateMentorStatus);

module.exports = router;