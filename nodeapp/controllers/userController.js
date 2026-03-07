const User = require('../models/userModel');
const { generateAccessToken, generateRefreshToken, REFRESH_SECRET } = require('../authUtils');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const StartupSubmission = require("../models/StartupSubmission");
const StartupProfile = require("../models/StartupProfile");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/resumes/';

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.pdf') {
            return cb(new Error('Only PDF resumes are allowed'), false);
        }
        cb(null, true);
    },
    limits: { fileSize: 2 * 1024 * 1024 } 
}).single('resume'); 




exports.addUser = (req, res) => {
    upload(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });
  
      try {
        const { userName, mobile, email, password, role } = req.body;
  
        
        if (!["Entrepreneur", "Mentor"].includes(role)) {
          return res.status(400).json({ message: "Invalid role" });
        }
  
        
        if (role === "Mentor" && !req.file) {
          return res.status(400).json({ message: "Resume (PDF) is required for Mentors" });
        }
  
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });
  
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
  
        const userStatus = role === "Mentor" ? "pending" : "active";
  
        const newUserData = {
          userName,
          email,
          mobile,
          password: hashedPassword,
          role,
          status: userStatus
        };
  
        
        if (role === "Mentor") {
          newUserData.resume = {
            data: req.file.buffer,
            contentType: req.file.mimetype,
            filename: req.file.originalname,
            size: req.file.size
          };
        }
  
        await User.create(newUserData);
  
        const msg = role === "Mentor"
          ? "Application submitted. Please wait for Admin approval."
          : "Registration successful!";
  
        return res.status(201).json({ message: msg });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    });
  };
  
  exports.getResumeByUserId = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("resume role status");
  
      if (!user) return res.status(404).json({ message: "User not found" });
      if (!user.resume?.data) return res.status(404).json({ message: "No resume found" });
  
      res.setHeader("Content-Type", user.resume.contentType || "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${user.resume.filename || "resume.pdf"}"`);
  
      return res.send(user.resume.data);
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  };

exports.getUserByEmailAndPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });


        if (user.status === 'pending') {
            return res.status(403).json({ 
                message: "Account pending approval. Please wait for the Admin to verify your resume." 
            });
        }

        if (user.status === 'rejected') {
            return res.status(403).json({ message: "Your application was rejected." });
        }

        
        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        return res.status(200).json({
            accessToken,
            userName: user.userName,
            role: user.role,
            ID: user._id
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


exports.getPendingMentors = async (req, res) => {
    try {
        const mentors = await User.find({ role: 'Mentor', status: 'pending' })
                                  .select('-password'); 
        res.status(200).json(mentors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.updateMentorStatus = async (req, res) => {
    try {
        const { userId, status } = req.body; 
        
        if (!['active', 'rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const user = await User.findByIdAndUpdate(userId, { status }, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: `Mentor status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

        jwt.verify(refreshToken, REFRESH_SECRET, async (err, decoded) => {
            if (err) return res.status(403).json({ message: "Invalid refresh token" });

            const user = await User.findById(decoded.userId);
            if (!user || user.status !== 'active') {
                return res.status(403).json({ message: "User not authorized" });
            }

            const newAccessToken = generateAccessToken(user._id, user.role);
            res.json({ accessToken: newAccessToken });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'Admin' } }).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUserByAdmin = async (req, res) => {
    try {
        const { userId, role, status } = req.body;
        
        const updateData = {};
        if (role) updateData.role = role;
        if (status) updateData.status = status;

        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
        
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEntrepreneurDashboard = async (req, res) => {
    try {
        const userId = req.user.userId;

        // 1. Count how many ideas this specific user has submitted
        const ideasCount = await StartupSubmission.countDocuments({ userId });

        // 2. Count how many total Mentor profiles exist in the system
        const mentorsCount = await StartupProfile.countDocuments();

        // 3. Get the 3 most recent submissions for this user
        const recentSubmissions = await StartupSubmission.find({ userId })
            .sort({ submissionDate: -1 })
            .limit(3);

        res.status(200).json({
            ideasCount,
            mentorsCount,
            recentSubmissions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};