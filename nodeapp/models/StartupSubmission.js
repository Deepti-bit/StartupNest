const mongoose = require("mongoose");

const startupSubmissionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true, ref: "User"
        },
        userName: { type: String, required: true },
        startupProfileId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "StartupProfile"
        },

        submissionDate: {
            type: Date
        },
        marketPotential: {
            type: Number
        },
        launchYear: {
            type: Date
        },
        expectedFunding: {
            type: Number
        },
        status: {
            type: Number
        },
        address: {
            type: String
        },

        pitchDeckFile: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
);

module.exports =
    mongoose.models.StartupSubmission ||
    mongoose.model("StartupSubmission", startupSubmissionSchema);