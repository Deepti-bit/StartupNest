const StartupProfile = require("../models/StartupProfile");


exports.getAllStartupProfiles = async (req, res) => {
  try {
    const profiles = await StartupProfile.find({})
      .populate('mentorId', 'userName email'); 
    return res.status(200).json(profiles);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


exports.getStartupProfileById = async (req, res) => {
  try {
    const profile = await StartupProfile.findById(req.params.id)
      .populate('mentorId', 'userName email');

    if (!profile) {
      return res.status(404).json({ message: "profile is not found" });
    }
    return res.status(200).json(profile);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


exports.addStartupProfile = async (req, res) => {
  try {

    const profileData = {
        ...req.body,
        mentorId: req.user.userId 
    };

    await StartupProfile.create(profileData);
    return res.status(200).json({ message: "profile is added successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


exports.updateStartupProfile = async (req, res) => {
  try {
    const profile = await StartupProfile.findById(req.params.id);
    
    if (!profile) {
      return res.status(404).json({ message: "profile is not found" });
    }

    
    if (profile.mentorId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You are not authorized to update this profile" });
    }

    const updated = await StartupProfile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.status(200).json({ message: "profile is updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


exports.deleteStartupProfile = async (req, res) => {
  try {
    const profile = await StartupProfile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ message: "profile is not found" });
    }

    
    if (profile.mentorId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You are not authorized to delete this profile" });
    }

    await StartupProfile.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "profile is deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


exports.getStartupProfilesByMentorId = async (req, res) => {
  try {
    const profiles = await StartupProfile.find({ mentorId: req.params.mentorId })
      .populate('mentorId', 'userName email');
    return res.status(200).json(profiles);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};