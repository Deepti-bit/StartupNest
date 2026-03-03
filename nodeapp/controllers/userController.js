const User = require("../models/userModel");

exports.getUserByEmailAndPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addUser = async (req, res) => {
  try {
    await User.create(req.body);
    return res.status(200).json({ message: "User added successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};