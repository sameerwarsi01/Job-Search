const userService = require("../Services/useService");
const { validationResult } = require("express-validator");
const blacklistToken = require("../Models/blaclistToken.model");
const userModel = require("../Models/user.model");
const axios = require("axios");

module.exports.signUp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { fullname, email, password } = req.body;

    const user = await userService.createUser({
      fullname,
      email,
      password,
    });

    const token = user.generateToken();

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: false, // true in production with HTTPS
      sameSite: "lax",
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
      token,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    const user = await userService.login({
      email,
      password,
    });

    const token = await user.generateToken();

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: false, // true in production with HTTPS
      sameSite: "lax",
    });

    res.status(201).json({
      message: "Login Succesfull",
      user,
      token,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

module.exports.logout = async (req, res) => {
  try {
    const token =
      req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No token Found",
      });
    }

    await blacklistToken.create({
      token,
    });

    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Logout Succesfull",
    });
  } catch (err) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
};

module.exports.toggleJobAlerts = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User Not found" });
    }

    user.jobAlertsEnabled =
      user.jobAlertsEnabled === undefined ? false : !user.jobAlertsEnabled;
    await user.save();

    res.status(201).json({
      success: true,
      jobAlertsEnabled: user.jobAlertsEnabled,
      message: `daily job alerts turned ${
        user.jobAlertsEnabled ? "ON" : "OFF"
      }`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update alert preference",
      error: error.message,
    });
  }
};

// GitHub OAuth Controller
module.exports.githubLogin = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: "Authorization code missing" });
  }

  try {
    // 1. GitHub access token exchange
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      return res
        .status(400)
        .json({ message: "Failed to obtain GitHub token" });
    }

    // 2. GitHub profile fetch
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // 3. User emails fetch
    const emailsResponse = await axios.get(
      "https://api.github.com/user/emails",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const primaryEmailObj = emailsResponse.data.find(
      (item) => item.primary && item.verified
    );
    const email = primaryEmailObj
      ? primaryEmailObj.email
      : userResponse.data.email || `${userResponse.data.login}@github.com`;

    const fullName =
      userResponse.data.name || userResponse.data.login || "GitHub User";
    const nameParts = fullName.trim().split(" ");
    const firstname = nameParts[0] || "User";
    const lastname = nameParts.slice(1).join(" ") || "Account";

    // 4. Find or Create User
    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        fullname: { firstname, lastname },
        email,
        password: Math.random().toString(36).slice(-8) + "Aa1!",
      });
    }

    // 5. Generate token (same method as login/signup)
    const token = await user.generateToken();

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "GitHub Login Successful",
      token,
      user,
    });
  } catch (error) {
    console.error("GitHub Auth Error:", error.response?.data || error.message);
    return res.status(500).json({ message: "GitHub authentication failed" });
  }
};