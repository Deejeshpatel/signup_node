const User = require("../models"); // Adjust the path as needed
const bcrypt = require("bcrypt");

// authController.js

exports.signupGet = (req, res) => {
  // Render the signup page without any additional parameters
  res.render("signup");
};

exports.signupPost = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("signup"); // No message, just re-render the signup page
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, phone });
    await user.save();

    // Redirect to login page without any messages
    return res.render("login");
  } catch (err) {
    res.status(500).send("Error signing up.");
  }
};

// Login
exports.loginGet = (req, res) => {
  // Render the login page without any additional parameters
  res.render("login");
};

exports.loginPost = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("signup"); // Just re-render the signup page
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login"); // Re-render login page on failed login
    }

    res.cookie("userID", user._id, { httpOnly: true });

    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error logging in.");
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie("userID");
  res.redirect("/login");
};
