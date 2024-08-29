const User = require("./../models/usermodel.js");
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");const User = require("../models/User");
// const bcrypt = require("bcryptjs");
const mongoose=require('mongoose')
const jwt = require("jsonwebtoken");

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Email does not exist" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password" });
    }

    const payload = {
      email: user.email,
      user: user._id,
      role: user.role,
    };

    //verify password and generate a JWT token
    if (await bcrypt.compare(password, user.password)) {
      // Password match
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      console.log(token);

      // Login successful
      res.json({ msg: "Login successful", userId: user._id });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create a new user instance
    user = new User({
      fullName,
      email,
      password,
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user.save();

    const payload = {
      email: user.email,
      user: user._id,
      role: user.role,
    };

    //verify password and generate a JWT token
    if (await bcrypt.compare(password, user.password)) {
      // Password match
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      console.log(token);

      res.status(201).json({ msg: "User registered successfully" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};
loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Email does not exist" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password" });
    }

    // Login successful
    res.json({ msg: "Login successful", userId: user._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create a new user instance
    user = new User({
      fullName,
      email,
      password,
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports={
  loginUser,signup
}
