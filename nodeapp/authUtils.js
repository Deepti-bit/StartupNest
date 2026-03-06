const jwt = require("jsonwebtoken");

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret_123";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret_456";

const generateAccessToken = (userId, role) => {
  return jwt.sign({ userId, role }, ACCESS_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: "1h" });
};

const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, ACCESS_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token expired/invalid" });
    req.user = decoded;
    next();
  });
};


const authorize = (...roles) => {
  return (req, res, next) => {
    // Note: We check req.user.role (which was decoded in validateToken)
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role '${req.user?.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { generateAccessToken, generateRefreshToken, validateToken,authorize, REFRESH_SECRET };