const StartupSubmission = require("../models/StartupSubmission");

async function maybePopulate(queryOrPromise, path) {
  // If jest mocked `.find()` or `.findById()` to return a chainable object
  if (queryOrPromise && typeof queryOrPromise.populate === "function") {
    return await queryOrPromise.populate(path);
  }
  // If jest mocked to return a Promise (rejected/resolved)
  return await queryOrPromise;
}

exports.getSubmissionsByUserId = async (req, res) => {
  try {
    const q = StartupSubmission.find({ userId: req.params.userId });
    const submissions = await maybePopulate(q, "startupProfileId");
    return res.status(200).json(submissions);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getStartupSubmissionById = async (req, res) => {
  try {
    const q = StartupSubmission.findById(req.params.id);
    const submission = await maybePopulate(q, "startupProfileId");

    if (!submission) {
      return res.status(404).json({ message: "Cannot find any submission" });
    }
    return res.status(200).json(submission);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addStartupSubmission = async (req, res) => {
  try {
    await StartupSubmission.create(req.body);
    return res.status(200).json({ message: "Submission added successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
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
      return res.status(404).json({ message: "Cannot find any submission" });
    }
    return res.status(200).json({ message: "Submission updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteStartupSubmission = async (req, res) => {
  try {
    const deleted = await StartupSubmission.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Cannot find any submission" });
    }
    return res.status(200).json({ message: "Submission deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};