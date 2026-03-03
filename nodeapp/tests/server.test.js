const userController = require('../controllers/userController');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const { validateToken } = require('../authUtils');
const StartupSubmission = require('../models/StartupSubmission');
const StartupProfile = require('../models/StartupProfile');
const startupSubmissionController = require('../controllers/startupSubmissionController'); 
const startupProfileController = require('../controllers/startupProfileController'); 




describe('User_Model_Test', () => {


  test('backend_usermodel_should_validate_a_user_with_missing_username', async () => {
    const invalidUserData = {
      email: 'demouser@gmail.com',
      mobile: '9876543212',
      password: 'validpassword',
      role: 'Entrepreneur'
    };

    const user = new User(invalidUserData);

    await expect(user.validate()).rejects.toThrowError();
  });

  test('backend_usermodel_should_validate_a_user_with_missing_email', async () => {
    const invalidUserData = {
      userName: 'validUserName',
      mobile: '9876543212',
      password: 'validpassword',
      role: 'Entrepreneur'
    };

    const user = new User(invalidUserData);

    await expect(user.validate()).rejects.toThrowError();
  });

  test('backend_usermodel_should_validate_a_user_with_missing_mobile', async () => {
    const invalidUserData = {
      userName: 'validUserName',
      email: 'demouser@gmail.com',
      password: 'validpassword',
      role: 'Entrepreneur'
    };

    const user = new User(invalidUserData);

    await expect(user.validate()).rejects.toThrowError();
  });

  test('backend_usermodel_should_validate_a_user_with_missing_password', async () => {
    const invalidUserData = {
      userName: 'validUserName',
      email: 'demouser@gmail.com',
      mobile: '9876543212',
      role: 'Entrepreneur'
    };

    const user = new User(invalidUserData);

    await expect(user.validate()).rejects.toThrowError();
  });

  test('backend_usermodel_should_validate_a_user_with_missing_role', async () => {
    const invalidUserData = {
      userName: 'validUserName',
      email: 'demouser@gmail.com',
      mobile: '9876543212',
      password: 'validpassword',
    };

    const user = new User(invalidUserData);

    await expect(user.validate()).rejects.toThrowError();
  });
});


describe('StartupSubmission_Model_Test', () => {

  test('backend_startupSubmissionModel_should_validate_a_submission_with_all_required_fields', async () => {
    const validSubmission = new StartupSubmission({
      userId: new mongoose.Types.ObjectId(),
      userName: 'Jane Doe',
      startupProfileId: new mongoose.Types.ObjectId(),
      submissionDate: new Date(),
      marketPotential: 85,
      launchYear: new Date(),
      expectedFunding: 1000000,
      status: 1,
      address: '456 Startup Blvd',
      pitchDeckFile: 'path/to/deck.pdf',
    });

    await expect(validSubmission.validate()).resolves.toBeUndefined();
  });

  test('backend_startupSubmissionModel_should_throw_validation_error_when_userId_is_missing', async () => {
    const submission = new StartupSubmission({
      userName: 'Jane Doe',
      startupProfileId: new mongoose.Types.ObjectId(),
      submissionDate: new Date(),
      marketPotential: 85,
      launchYear: new Date(),
      expectedFunding: 1000000,
      status: 1,
      address: '456 Startup Blvd',
      pitchDeckFile: 'path/to/deck.pdf',
    });

    await expect(submission.validate()).rejects.toThrowError();
  });

  test('backend_startupSubmissionModel_should_throw_validation_error_when_userName_is_missing', async () => {
    const submission = new StartupSubmission({
      userId: new mongoose.Types.ObjectId(),
      startupProfileId: new mongoose.Types.ObjectId(),
      submissionDate: new Date(),
      marketPotential: 85,
      launchYear: new Date(),
      expectedFunding: 1000000,
      status: 1,
      address: '456 Startup Blvd',
      pitchDeckFile: 'path/to/deck.pdf',
    });

    await expect(submission.validate()).rejects.toThrowError();
  });

  test('backend_startupSubmissionModel_should_throw_validation_error_when_startupProfileId_is_missing', async () => {
    const submission = new StartupSubmission({
      userId: new mongoose.Types.ObjectId(),
      userName: 'Jane Doe',
      submissionDate: new Date(),
      marketPotential: 85,
      launchYear: new Date(),
      expectedFunding: 1000000,
      status: 1,
      address: '456 Startup Blvd',
      pitchDeckFile: 'path/to/deck.pdf',
    });

    await expect(submission.validate()).rejects.toThrowError();
  });

  test('backend_startupSubmissionModel_should_throw_validation_error_when_pitchDeckFile_is_missing', async () => {
    const submission = new StartupSubmission({
      userId: new mongoose.Types.ObjectId(),
      userName: 'Jane Doe',
      startupProfileId: new mongoose.Types.ObjectId(),
      submissionDate: new Date(),
      marketPotential: 85,
      launchYear: new Date(),
      expectedFunding: 1000000,
      status: 1,
      address: '456 Startup Blvd',
    });

    await expect(submission.validate()).rejects.toThrowError();
  });
});

describe('StartupProfile_Model_Test', () => {

  test('backend_startupProfileModel_should_validate_a_profile_with_all_required_fields', async () => {
    const validProfileData = {
      mentorId: new mongoose.Types.ObjectId(),
      category: 'FinTech',
      description: 'Financial technology innovations',
      fundingLimit: 5000000,
      avgEquityExpectation: 12,
      targetIndustry: 'Finance',
      preferredStage: 'MVP',
    };

    const profile = new StartupProfile(validProfileData);
    await expect(profile.validate()).resolves.toBeUndefined();
  });

  test('backend_startupProfileModel_should_validate_a_profile_with_missing_mentorId', async () => {
    const invalidProfileData = {
      category: 'FinTech',
      description: 'Financial technology innovations',
      fundingLimit: 5000000,
      avgEquityExpectation: 12,
      targetIndustry: 'Finance',
      preferredStage: 'MVP',
    };

    const profile = new StartupProfile(invalidProfileData);
    await expect(profile.validate()).rejects.toThrowError();
  });

  test('backend_startupProfileModel_should_validate_a_profile_with_missing_category', async () => {
    const invalidProfileData = {
      mentorId: new mongoose.Types.ObjectId(),
      description: 'Financial technology innovations',
      fundingLimit: 5000000,
      avgEquityExpectation: 12,
      targetIndustry: 'Finance',
      preferredStage: 'MVP',
    };

    const profile = new StartupProfile(invalidProfileData);
    await expect(profile.validate()).rejects.toThrowError();
  });

  test('backend_startupProfileModel_should_validate_a_profile_with_missing_description', async () => {
    const invalidProfileData = {
      mentorId: new mongoose.Types.ObjectId(),
      category: 'FinTech',
      fundingLimit: 5000000,
      avgEquityExpectation: 12,
      targetIndustry: 'Finance',
      preferredStage: 'MVP',
    };

    const profile = new StartupProfile(invalidProfileData);
    await expect(profile.validate()).rejects.toThrowError();
  });

});

describe('getUserByEmailAndPassword_Test', () => {
  test('backend_getuserbyemailandpassword_in_usercontroller_should_return_200_status_code_when_user_found', async () => {
    const req = { 
      body: {   
        email: 'test@example.com',
        password: 'password123'
      } 
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const user = {
      userName: 'TestUser',
      role: 'user',
      _id: new mongoose.Types.ObjectId()
    };
    User.findOne = jest.fn().mockResolvedValue(user);

    await userController.getUserByEmailAndPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

  });
  test('backend_getuserbyemailandpassword_in_usercontroller_should_return_404_status_code_when_user_not_found', async () => {
    const req = { 
      body: {   
        email: 'nonexistent@example.com',
        password: 'password123'
      } 
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    User.findOne = jest.fn().mockResolvedValue(null);

    await userController.getUserByEmailAndPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('backend_getuserbyemailandpassword_in_usercontroller_should_return_500_status_code_when_internal_server_error_occurs', async () => {
    const req = { 
      body: {   
        email: 'test@example.com',
        password: 'password123'
      } 
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    User.findOne = jest.fn().mockRejectedValue(new Error('Internal Server Error'));

    await userController.getUserByEmailAndPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('addUser_Test', () => {
  test('backend_add_user_in_usercontroller_should_return_200_status_code_when_user_added_successfully', async () => {
    const req = { 
      body: {   
        userName: 'NewUser',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'Entrepreneur',
        mobile:'9876543212'
      } 
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    User.create = jest.fn().mockResolvedValue(req.body);

    await userController.addUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('backend_add_user_in_usercontroller_should_return_500_status_code_when_internal_server_error_occurs', async () => {
    const req = { 
      body: {   
        userName: 'NewUser',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'Entrepreneur',
        mobile:'9876544321'
      } 
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    User.create = jest.fn().mockRejectedValue(new Error('Internal Server Error'));

    await userController.addUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});




describe('startupSubmissionController', () => {

  describe('getSubmissionsByUserId', () => {
    test('backend_getsubmissionsbyuserid_in_startupsubmissioncontroller_should_return_submissions_by_user_id_and_respond_with_200', async () => {
      const submissions = [{ _id: 'sub1', userId: 'user1', userName: 'Jane Doe' }];
      const req = { params: { userId: 'user1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      StartupSubmission.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(submissions),
      });
      
      await startupSubmissionController.getSubmissionsByUserId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('backend_getsubmissionsbyuserid_in_startupsubmissioncontroller_should_handle_errors_and_respond_with_500', async () => {
      const error = new Error('Database error');
      const req = { params: { userId: 'user1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      StartupSubmission.find = jest.fn().mockRejectedValue(error);

      await startupSubmissionController.getSubmissionsByUserId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getStartupSubmissionById', () => {
    test('backend_getstartupsubmissionbyid_in_startupsubmissioncontroller_should_return_submission_and_respond_with_200', async () => {
      const submission = { _id: 'sub1', userId: 'user1', userName: 'Jane Doe' };
      const req = { params: { id: 'sub1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      StartupSubmission.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(submission),
      });
      
      await startupSubmissionController.getStartupSubmissionById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('backend_getstartupsubmissionbyid_in_startupsubmissioncontroller_should_return_404_if_submission_not_found', async () => {
      const req = { params: { id: 'nonexistent' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      StartupSubmission.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });
      
      await startupSubmissionController.getStartupSubmissionById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cannot find any submission' });
    });

    test('backend_getstartupsubmissionbyid_in_startupsubmissioncontroller_should_handle_errors_and_respond_with_500', async () => {
      const error = new Error('Database error');
      const req = { params: { id: 'sub1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      StartupSubmission.findById = jest.fn().mockRejectedValue(error);

      await startupSubmissionController.getStartupSubmissionById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('addStartupSubmission', () => {
    test('backend_addstartupsubmission_in_startupsubmissioncontroller_should_add_submission_and_respond_with_200', async () => {
      const req = {
        body: {
          userId: 'user1',
          userName: 'Jane Doe',
          startupProfileId: 'profile1',
          submissionDate: new Date(),
          marketPotential: 90,
          launchYear: new Date(),
          expectedFunding: 1000000,
          status: 1,
          address: 'Startup Street',
          pitchDeckFile: 'deck.pdf',
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      StartupSubmission.create = jest.fn().mockResolvedValue(req.body);

      await startupSubmissionController.addStartupSubmission(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Submission added successfully' });
    });

    test('backend_addstartupsubmission_in_startupsubmissioncontroller_should_handle_errors_and_respond_with_500', async () => {
      const error = new Error('Database error');
      const req = { body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      StartupSubmission.create = jest.fn().mockRejectedValue(error);

      await startupSubmissionController.addStartupSubmission(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('updateStartupSubmission', () => {
    test('backend_updatestartupsubmission_in_startupsubmissioncontroller_should_update_submission_and_respond_with_200', async () => {
      const req = {
        params: { id: 'sub1' },
        body: { userName: 'Updated Jane Doe' },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      StartupSubmission.findByIdAndUpdate = jest.fn().mockResolvedValue(req.body);

      await startupSubmissionController.updateStartupSubmission(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Submission updated successfully' });
    });

    test('backend_updatestartupsubmission_in_startupsubmissioncontroller_should_return_404_if_submission_not_found', async () => {
      const req = { params: { id: 'nonexistent' }, body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      StartupSubmission.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await startupSubmissionController.updateStartupSubmission(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cannot find any submission' });
    });

    test('backend_updatestartupsubmission_in_startupsubmissioncontroller_should_handle_errors_and_respond_with_500', async () => {
      const error = new Error('Database error');
      const req = { params: { id: 'sub1' }, body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      StartupSubmission.findByIdAndUpdate = jest.fn().mockRejectedValue(error);

      await startupSubmissionController.updateStartupSubmission(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('deleteStartupSubmission', () => {
    test('backend_deletestartupsubmission_in_startupsubmissioncontroller_should_delete_submission_and_respond_with_200', async () => {
      const req = { params: { id: 'sub1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      StartupSubmission.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: 'sub1' });

      await startupSubmissionController.deleteStartupSubmission(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Submission deleted successfully' });
    });

    test('backend_deletestartupsubmission_in_startupsubmissioncontroller_should_return_404_if_submission_not_found', async () => {
      const req = { params: { id: 'nonexistent' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      StartupSubmission.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await startupSubmissionController.deleteStartupSubmission(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cannot find any submission' });
    });

    test('backend_deletestartupsubmission_in_startupsubmissioncontroller_should_handle_errors_and_respond_with_500', async () => {
      const error = new Error('Database error');
      const req = { params: { id: 'sub1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      StartupSubmission.findByIdAndDelete = jest.fn().mockRejectedValue(error);

      await startupSubmissionController.deleteStartupSubmission(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});


describe('startupProfileController', () => {
  describe('getAllStartupProfiles', () => {
    test('backend_getallstartupprofiles_in_startupprofilecontroller_should_return_all_profiles_and_respond_with_200', async () => {
      const profiles = [
        { _id: 'p1', category: 'FinTech', description: 'FinTech desc' },
        { _id: 'p2', category: 'AgriTech', description: 'AgriTech desc' },
      ];
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      StartupProfile.find = jest.fn().mockReturnValue({ populate: jest.fn().mockResolvedValue(profiles) });

      await startupProfileController.getAllStartupProfiles(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('backend_getallstartupprofiles_in_startupprofilecontroller_should_handle_errors_and_respond_with_500', async () => {
      const error = new Error('Database error');
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      StartupProfile.find = jest.fn().mockRejectedValue(error);

      await startupProfileController.getAllStartupProfiles(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getStartupProfileById', () => {
    test('backend_getstartupprofilebyid_in_startupprofilecontroller_should_return_profile_and_respond_with_200', async () => {
      const profile = { _id: 'p1', category: 'FinTech' };
      const req = { params: { id: 'p1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      StartupProfile.findById = jest.fn().mockReturnValue({ populate: jest.fn().mockResolvedValue(profile) });

      await startupProfileController.getStartupProfileById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('backend_getstartupprofilebyid_in_startupprofilecontroller_should_return_404_if_not_found', async () => {
      const req = { params: { id: 'notfound' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      StartupProfile.findById = jest.fn().mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });

      await startupProfileController.getStartupProfileById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cannot find any startup profile' });
    });

    test('backend_getstartupprofilebyid_in_startupprofilecontroller_should_handle_errors_and_respond_with_500', async () => {
      const error = new Error('Database error');
      const req = { params: { id: 'p1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      StartupProfile.findById = jest.fn().mockRejectedValue(error);

      await startupProfileController.getStartupProfileById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('addStartupProfile', () => {
    test('backend_addstartupprofile_in_startupprofilecontroller_should_add_profile_and_respond_with_200', async () => {
      const req = {
        body: {
          mentorId: 'mentor1',
          category: 'Tech',
          description: 'Tech description',
          fundingLimit: 1000000,
          avgEquityExpectation: 10,
          targetIndustry: 'Technology',
          preferredStage: 'MVP',
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      StartupProfile.create = jest.fn().mockResolvedValue(req.body);

      await startupProfileController.addStartupProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Startup profile added successfully' });
    });

    test('backend_addstartupprofile_in_startupprofilecontroller_should_handle_errors_and_respond_with_500', async () => {
      const error = new Error('DB error');
      const req = { body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      StartupProfile.create = jest.fn().mockRejectedValue(error);

      await startupProfileController.addStartupProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('updateStartupProfile', () => {
    test('backend_updatestartupprofile_in_startupprofilecontroller_should_update_profile_and_respond_with_200', async () => {
      const req = {
        params: { id: 'p1' },
        body: { category: 'Updated Tech' },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      StartupProfile.findByIdAndUpdate = jest.fn().mockResolvedValue(req.body);

      await startupProfileController.updateStartupProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Startup profile updated successfully' });
    });

    test('backend_updatestartupprofile_in_startupprofilecontroller_should_return_404_if_profile_not_found', async () => {
      const req = { params: { id: 'nonexistent' }, body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      StartupProfile.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await startupProfileController.updateStartupProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cannot find any startup profile' });
    });

    test('backend_updatestartupprofile_in_startupprofilecontroller_should_handle_errors_and_respond_with_500', async () => {
      const error = new Error('DB error');
      const req = { params: { id: 'p1' }, body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      StartupProfile.findByIdAndUpdate = jest.fn().mockRejectedValue(error);

      await startupProfileController.updateStartupProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('deleteStartupProfile', () => {
    test('backend_deletestartupprofile_in_startupprofilecontroller_should_delete_profile_and_respond_with_200', async () => {
      const req = { params: { id: 'p1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      StartupProfile.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: 'p1' });

      await startupProfileController.deleteStartupProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Startup profile deleted successfully' });
    });

    test('backend_deletestartupprofile_in_startupprofilecontroller_should_return_404_if_not_found', async () => {
      const req = { params: { id: 'nonexistent' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      StartupProfile.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await startupProfileController.deleteStartupProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cannot find any startup profile' });
    });

    test('backend_deletestartupprofile_in_startupprofilecontroller_should_handle_errors_and_respond_with_500', async () => {
      const error = new Error('DB error');
      const req = { params: { id: 'p1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      StartupProfile.findByIdAndDelete = jest.fn().mockRejectedValue(error);

      await startupProfileController.deleteStartupProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getStartupProfilesByMentorId', () => {
    test('backend_getstartupprofilesbymentorid_in_startupprofilecontroller_should_return_profiles_and_respond_with_200', async () => {
      const profiles = [
        { _id: 'p1', category: 'Health', mentorId: 'mentor1' },
        { _id: 'p2', category: 'Finance', mentorId: 'mentor1' },
      ];
      const req = { params: { mentorId: 'mentor1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      StartupProfile.find = jest.fn().mockReturnValue({ populate: jest.fn().mockResolvedValue(profiles) });

      await startupProfileController.getStartupProfilesByMentorId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(profiles);
    });

    test('backend_getstartupprofilesbymentorid_in_startupprofilecontroller_should_handle_errors_and_respond_with_500', async () => {
      const error = new Error('Database error');
      const req = { params: { mentorId: 'mentor1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      StartupProfile.find = jest.fn().mockRejectedValue(error);

      await startupProfileController.getStartupProfilesByMentorId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});

describe('validateToken', () => {
 
  test('backend_validatetoken_function_in_authutils_should_respond_with_400_status_for_invalidtoken', () => {
    // Mock the req, res, and next objects
    const req = {
      header: jest.fn().mockReturnValue('invalidToken'),
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Call the validateToken function
    validateToken(req, res, next);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('backend_validatetoken_function_in_authutils_should_respond_with_400_status_for_no_token', () => {
    // Mock the req, res, and next objects
    const req = {
      header: jest.fn().mockReturnValue(null),
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Call the validateToken function
    validateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});