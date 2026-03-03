const validateToken = (req, res, next) => {
    const token = req.header && req.header("Authorization");

    if (!token) {
        return res.status(400).json({ message: "No token provided" });
    }

    const parts = String(token).split(".");
    if (parts.length !== 3) {
        return res.status(400).json({ message: "Invalid token" });
    }

    return next();
};

module.exports = { validateToken };