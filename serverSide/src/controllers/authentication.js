const { generateAccessToken } = require("../utils/generateTokens");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../config/postgress.db");

exports.createUser = async (req, res) => {
  try {
    const { name, password, phone } = req.body;
    if (!name && !password && !phone) {
      return res.status(500).json({ error: "All params are required" });
    }

    const existing = await pool.query("SELECT id FROM users WHERE phone = $1", [
      phone,
    ]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Phone number already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, password_hash, phone)
       VALUES ($1, $2, $3)
       RETURNING id, name, phone, created_at`,
      [name, hashedPassword, phone]
    );
    if (result.rows.length === 0) {
      return res.status(500).json({ error: "User was not created" });
    }

    return res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    console.error("createUser error:", error);
    return res.status(500).json({ error: "Error occurred: " + error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res
        .status(400)
        .json({ message: "phone and password not available" });
    }

    const userResult = await pool.query(
      "SELECT * FROM users WHERE phone = $1",
      [phone]
    );
    const user = userResult.rows[0];
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password_hash);
    if (!passwordCompare) {
      return res
        .status(401)
        .json({ message: "please login with correct credentials" });
    }

    const cleanUserResult = await pool.query(
      `SELECT id, name, phone, created_at 
       FROM users 
       WHERE id = $1`,
      [user.id]
    );
    const loggedInUser = cleanUserResult.rows[0];
    if (!loggedInUser) {
      return res.status(400).json({ error: "no user found" });
    }

    const { accessToken, refreshToken } = await generateAccessToken(user.id);
    if (!accessToken || !refreshToken) {
      return res.status(400).json({ error: "no token found" });
    }

    console.log("all tests passed — user logged in");

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .json({
        user: loggedInUser,
        accessToken,
        refreshToken,
        message: "user logged in successfully",
      });
  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({ error: "error occurred: " + error.message });
  }
};

exports.refreshAcessToken = async (req, res) => {
  try {
    console.log("|");
    console.log("refreshtoken starts");

    const incomingRefreshToken = req.cookies.refreshToken;
    if (!incomingRefreshToken) {
      return res.status(401).json({ message: "You need to be logged in" });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
    } catch (err) {
      return res.status(500).json({
        error: "verification failed",
        message: err.message,
      });
    }

    const userResult = await pool.query(
      `SELECT id, refresh_token FROM users WHERE id = $1`,
      [decodedToken.id]
    );

    const user = userResult.rows[0];
    if (!user) {
      return res.status(500).json({ error: "User not found" });
    }

    if (incomingRefreshToken !== user.refresh_token) {
      return res.status(500).json({
        error: "incoming refresh token does not match stored token",
      });
    } 

    const { accessToken, refreshToken } = await generateAccessToken(user.id);
    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .json({
        accessToken,
        refreshToken,
        message: "Token refreshed successfully",
      });
  } catch (error) {
    console.error("refresh error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.logout = async (req, res) => {
  try {

    const user = req.user;
    if (!user) {
      return res.status(500).json({ error: "user not found" });
    } 

    const result = await pool.query(
      `UPDATE users
       SET refresh_token = NULL,
           access_token = NULL
       WHERE id = $1
       RETURNING id`,
      [user.id]
    );
    if (result.rows.length === 0) {
      return res.status(500).json({ message: "user does not exist" });
    } 

    return res
      .status(200)
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("logout error:", error);
    return res.status(500).json({ error: "error occurred: " + error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT id, name, phone, created_at
       FROM users
       WHERE id = $1`,
      [userId]
    );
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({
      error: "Error fetching user profile: " + error.message,
    });
  }
};
