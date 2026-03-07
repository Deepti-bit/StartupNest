const mongoose = require('mongoose');

const startupProfileSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: 'text',
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    fundingLimit: {
      type: Number,
      required: true,
      min: 0,
    },
    avgEquityExpectation: {
      type: Number,
      required: true,
      min: 0,
    },
    targetIndustry: {
      type: String,
      required: true,
      trim: true,
    },
    preferredStage: {
      type: String,
      required: true,
      enum: ['idea', 'MVP', 'pre-revenue', 'scaling', 'established'],
    },
  },
  {
    versionKey: false,
    timestamps:true
  }
);
module.exports = mongoose.model('StartupProfile', startupProfileSchema);