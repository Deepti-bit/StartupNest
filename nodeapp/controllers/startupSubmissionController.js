const StartupSubmission = require("../models/StartupSubmission");
const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }
}).single('pitchDeckFile');

exports.addStartupSubmission = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    try {
      let pitchDeckBase64 = null;
      if (req.file) {
        const base64String = req.file.buffer.toString('base64');
        pitchDeckBase64 = `data:application/pdf;base64,${base64String}`;
      }

      // FIX: Explicitly map every required schema field
      const submissionData = {
        userId: req.user.userId || req.user.id, // Check your token payload key
        userName: req.body.userName,
        startupProfileId: req.body.startupProfileId,
        submissionDate: new Date(),
        marketPotential: Number(req.body.marketPotential),
        launchYear: new Date(req.body.launchYear),
        expectedFunding: Number(req.body.expectedFunding),
        address: req.body.address,
        pitchDeckFile: pitchDeckBase64, // Matches Schema Field
        status: "Submitted"
      };

      await StartupSubmission.create(submissionData);
      return res.status(200).json({ message: "Submission added successfully" });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message });
    }
  });
};


exports.getAllStartupSubmissions = async (req, res) => {
  try {

    const {
      page = 1,
      limit = 10,
      search,
      status,
      sortBy,
      order
    } = req.body;

    const skip = (page - 1) * limit;


    const filter = {};


    if (status) {
      filter.status = status;
    }


    if (search) {
      filter.userName = { $regex: search, $options: "i" };
    }


    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === "asc" ? 1 : -1;
    } else {
      sortOptions.submissionDate = -1;
    }


    const submissions = await StartupSubmission.find(filter)
      .populate(
        "startupProfileId",
        "category targetIndustry fundingLimit avgEquityExpectation"
      )
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);


    const totalCount = await StartupSubmission.countDocuments(filter);

    res.status(200).json({
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      data: submissions,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
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