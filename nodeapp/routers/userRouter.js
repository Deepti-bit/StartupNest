
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateToken, authorize } = require('../authUtils');

router.post('/register', userController.addUser);
router.post('/login', userController.getUserByEmailAndPassword);
router.get('/refresh', userController.refreshToken);


router.get('/pending-mentors', validateToken,authorize("Admin"), userController.getPendingMentors);
router.post('/approve-mentor', validateToken,authorize("Admin"), userController.updateMentorStatus);

router.get('/all-users', validateToken, userController.getAllUsers);
router.put('/update-user', validateToken, authorize("Mentor", "Entrepreneur"), userController.updateUserByAdmin);

router.get("/resume/:id", validateToken, authorize("Admin"), userController.getResumeByUserId);

module.exports = router;