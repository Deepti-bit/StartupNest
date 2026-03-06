const express = require('express');
const router = express.Router();

const startupProfileController = require('../controllers/startupProfileController');

const { validateToken, authorize } = require('../authUtils'); 


router.get('/getAllStartupProfiles', validateToken, startupProfileController.getAllStartupProfiles);
router.get('/getStartupProfileById/:id', validateToken, startupProfileController.getStartupProfileById);
router.get('/getStartupProfilesByMentorId/:mentorId', validateToken, startupProfileController.getStartupProfilesByMentorId);

router.post('/addStartupProfile', validateToken, authorize('Mentor'), startupProfileController.addStartupProfile);
router.put('/updateStartupProfile/:id', validateToken, authorize('Mentor'), startupProfileController.updateStartupProfile);
router.delete('/deleteStartupProfile/:id', validateToken, authorize('Mentor'), startupProfileController.deleteStartupProfile);

module.exports = router;