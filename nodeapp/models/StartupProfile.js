const mongoose = require("mongoose");

const startupProfileSchema = new mongoose.Schema(
  {
    mentorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    category: { type: String, required: true },
    description: { type: String, required: true },

    fundingLimit: { type: Number },
    avgEquityExpectation: { type: Number },
    targetIndustry: { type: String },
    preferredStage: { type: String },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.StartupProfile ||
  mongoose.model("StartupProfile", startupProfileSchema);