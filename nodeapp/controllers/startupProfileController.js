const StartupProfile = require("../models/StartupProfile");

async function maybePopulate(queryOrPromise, path) {
  if (queryOrPromise && typeof queryOrPromise.populate === "function") {
    return await queryOrPromise.populate(path);
  }
  return await queryOrPromise;
}

exports.getAllStartupProfiles = async (req, res) => {
  try {
    const q = StartupProfile.find();
    const profiles = await maybePopulate(q, "mentorId");
    return res.status(200).json(profiles);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getStartupProfileById = async (req, res) => {
  try {
    const q = StartupProfile.findById(req.params.id);
    const profile = await maybePopulate(q, "mentorId");

    if (!profile) {
      return res.status(404).json({ message: "Cannot find any startup profile" });
    }
    return res.status(200).json(profile);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addStartupProfile = async (req, res) => {
  try {
    await StartupProfile.create(req.body);
    return res.status(200).json({ message: "Startup profile added successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateStartupProfile = async (req, res) => {
  try {
    const updated = await StartupProfile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Cannot find any startup profile" });
    }
    return res.status(200).json({ message: "Startup profile updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteStartupProfile = async (req, res) => {
  try {
    const deleted = await StartupProfile.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Cannot find any startup profile" });
    }
    return res.status(200).json({ message: "Startup profile deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getStartupProfilesByMentorId = async (req, res) => {
  try {
    const q = StartupProfile.find({ mentorId: req.params.mentorId });
    const profiles = await maybePopulate(q, "mentorId");
    return res.status(200).json(profiles);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};