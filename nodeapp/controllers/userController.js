const User = require('../models/userModel');
const { generateAccessToken, generateRefreshToken, REFRESH_SECRET } = require('../authUtils');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- 1. MULTER CONFIGURATION (For Resume Uploads) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/resumes/';
        // Create directory if it doesn't exist
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Save as: timestamp-originalname.pdf
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.pdf') {
            return cb(new Error('Only PDF resumes are allowed'), false);
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit
}).single('resume'); // 'resume' is the field name from frontend


// --- 2. SIGNUP (ADD USER) ---
exports.addUser = (req, res) => {
    // Handle the file upload first
    upload(req, res, async (err) => {
        if (err) return res.status(400).json({ message: err.message });

        try {
            const { userName, mobile, email, password, role } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ message: "Email already exists" });

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Logic: Mentors are "pending", others are "active"
            const userStatus = role === 'Mentor' ? 'pending' : 'active';
            const resumePath = req.file ? req.file.path : null;

            const newUser = await User.create({
                userName,
                email,
                mobile,
                password: hashedPassword,
                role,
                status: userStatus,
                resumePath: resumePath
            });

            const successMessage = role === 'Mentor' 
                ? "Application submitted. Please wait for Admin approval." 
                : "Registration successful!";

            return res.status(201).json({ message: successMessage });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    });
};


// --- 3. LOGIN ---
exports.getUserByEmailAndPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        // 1. Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        // 2. IMPORTANT: Check if account is approved
        if (user.status === 'pending') {
            return res.status(403).json({ 
                message: "Account pending approval. Please wait for the Admin to verify your resume." 
            });
        }

        if (user.status === 'rejected') {
            return res.status(403).json({ message: "Your application was rejected." });
        }

        // 3. Issue Tokens
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


// --- 4. ADMIN: GET PENDING MENTORS ---
exports.getPendingMentors = async (req, res) => {
    try {
        const mentors = await User.find({ role: 'Mentor', status: 'pending' })
                                  .select('-password'); // Don't send passwords
        res.status(200).json(mentors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// --- 5. ADMIN: APPROVE/REJECT MENTOR ---
exports.updateMentorStatus = async (req, res) => {
    try {
        const { userId, status } = req.body; // status: 'active' or 'rejected'
        
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


// --- 6. REFRESH TOKEN ---
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