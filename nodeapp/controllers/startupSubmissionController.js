const StartupSubmission = require("../models/StartupSubmission");

exports.addStartupSubmission = async (req, res) => {
  try {
  
    const submissionData = {
      ...req.body,
      userId: req.user.userId,
      userName: req.body.userName, 
      submissionDate: new Date()
    };

    await StartupSubmission.create(submissionData);
    return res.status(200).json({ message: "submission is added successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllStartupSubmissions = async (req, res) => {
  try {
    const submissions = await StartupSubmission.find();
    return res.status(200).json(submissions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getSubmissionsByUserId = async (req, res) => {
  try {
    const submissions = await StartupSubmission.find({ userId: req.params.userId });
    return res.status(200).json(submissions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getStartupSubmissionById = async (req, res) => {
  try {
    const submission = await StartupSubmission.findById(req.params.id);
    if (!submission) {
        return res.status(404).json({ message: "submission is not found" });
    }
    return res.status(200).json(submission);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateStartupSubmission = async (req, res) => {
  try {
    const updated = await StartupSubmission.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );

    if (!updated) {
        return res.status(404).json({ message: "submission is not found" });
    }
    return res.status(200).json({ message: "submission is updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteStartupSubmission = async (req, res) => {
  try {
    const submission = await StartupSubmission.findById(req.params.id);
    if (!submission) {
        return res.status(404).json({ message: "submission is not found" });
    }

   
    if (submission.status !== "Pending") {
      return res.status(400).json({ message: "Cannot delete a submission that is already processed" });
    }

    await StartupSubmission.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "submission is deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};