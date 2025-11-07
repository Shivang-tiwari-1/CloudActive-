const jwt = require("jsonwebtoken");
const pool = require("../config/postgress.db");

const authentication = async (req, res, next) => {
  try {
    console.log("|");
    console.log("AUTHENTICATION STARTS");

    const authHeader = req.headers.authorization || req.headers.Authorization;

    const tokenFromHeader = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    const { accessToken } = req.cookies;

    if (!accessToken && !tokenFromHeader) {
      return res.status(401).json({ message: "no token" });
    }

    const token = tokenFromHeader ?? accessToken;

    if (!token) {
      console.log("Token not found in both header and cookies");
      return res.status(401).json({
        message: "Token not found in both authorization header and cookies",
      });
    }

    let decodedData;
    try {
      decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log("Token verified");
    } catch (err) {
      console.log("Token verification failed:", err.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const userResult = await pool.query(
      `SELECT id, name, phone, created_at 
       FROM users 
       WHERE id = $1`,
      [decodedData.id]
    );

    const user = userResult.rows[0];

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    console.log("Authentication completed");

    next();
  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error.message);
    return res
      .status(500)
      .json({ error: "Authentication error: " + error.message });
  }
};

module.exports = authentication;
