
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateToken, authorize } = require('../authUtils');

router.post('/register', userController.addUser);
router.post('/login', userController.getUserByEmailAndPassword);
router.get('/refresh', userController.refreshToken);


router.get('/pending-mentors', validateToken,authorize("Admin"), userController.getPendingMentors);
router.post('/approve-mentor', validateToken,authorize("Admin"), userController.updateMentorStatus);

router.get('/all-users', validateToken, authorize("Admin"), userController.getAllUsers);
router.put('/update-user', validateToken, authorize("Admin"), userController.updateUserByAdmin);

router.get("/resume/:id", validateToken, authorize("Admin"), userController.getResumeByUserId);
router.get('/entrepreneur/dashboard', validateToken, authorize("Mentor", "Entrepreneur"), userController.getEntrepreneurDashboard);

module.exports = router;