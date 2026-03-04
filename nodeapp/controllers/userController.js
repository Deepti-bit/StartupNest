const User = require('../models/userModel');
const { generateAccessToken, generateRefreshToken, REFRESH_SECRET } = require('../authUtils');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 1. ADD USER
exports.addUser = async (req, res) => {
    try {
        const { userName, mobile, email, password, role } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            userName,
            email,
            mobile,
            password: hashedPassword,
            role
        });
        return res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// 2. LOGIN
exports.getUserByEmailAndPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && await bcrypt.compare(password, user.password)) {
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
        }
        return res.status(401).json({ message: "Invalid credentials" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// 3. REFRESH (This was likely missing or misnamed)
exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

        jwt.verify(refreshToken, REFRESH_SECRET, async (err, decoded) => {
            if (err) return res.status(403).json({ message: "Invalid refresh token" });
            
            const user = await User.findById(decoded.userId);
            if (!user) return res.status(403).json({ message: "User not found" });

            const newAccessToken = generateAccessToken(user._id, user.role);
            res.json({ accessToken: newAccessToken });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

