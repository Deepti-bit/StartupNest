const express = require('express');
const router = express.Router();
const startupSubmissionController = require('../controllers/startupSubmissionController');
const { validateToken, authorize } = require('../authUtils');


router.post('/addStartupSubmission', validateToken, authorize('Entrepreneur'), startupSubmissionController.addStartupSubmission);

router.get('/getAllStartupSubmissions', validateToken, authorize('Mentor'), startupSubmissionController.getAllStartupSubmissions);

router.get('/getSubmissionsByUserId/:userId', validateToken, startupSubmissionController.getSubmissionsByUserId);

router.get('/getStartupSubmissionById/:id', validateToken, startupSubmissionController.getStartupSubmissionById);

router.put('/updateStartupSubmission/:id', validateToken, authorize('Mentor'), startupSubmissionController.updateStartupSubmission);

router.delete('/deleteStartupSubmission/:id', validateToken, authorize('Entrepreneur'), startupSubmissionController.deleteStartupSubmission);


module.exports = router;