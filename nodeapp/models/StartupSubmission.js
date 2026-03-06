const mongoose = require('mongoose');

const startupSubmissionSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
      },
      
    submissionDate: {
      type: Date,
      required: true,
    },
    marketPotential: {
      type: Number,
      required: true,
      min: 0,
    },
    launchYear: {
      type: Date,
      required: true,
    },
    expectedFunding: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      default: "Pending", 
      enum: ["Pending", "Approved", "Rejected"],
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    pitchDeck: {
        type: String, 
        required: false
      }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('StartupSubmission', startupSubmissionSchema);
