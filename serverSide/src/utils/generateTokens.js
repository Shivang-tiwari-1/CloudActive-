const jwt = require("jsonwebtoken");
const pool = require("../config/postgress.db");

exports.generateAccessToken = async (userId) => {
  console.log("GENERATING TOKEN STARTS");

  const userResult = await pool.query(
    "SELECT id, phone, name FROM users WHERE id = $1",
    [userId]
  );
  const user = userResult.rows[0];
  if (!user) {
    console.log("test1->failed");
    throw new Error("User not found while generating token");
  } else {
    console.log("test1->success");
  }

  const accessToken = jwt.sign(
    { id: user.id, phone: user.phone },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
  if (!accessToken) {
    console.log("test2->failed");
    throw new Error("Access token generation failed");
  } else {
    console.log("test2->success");
  }

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
  if (!refreshToken) {
    console.log("test3->failed");
    throw new Error("Refresh token generation failed");
  } else {
    console.log("test3->success");
  }
  await pool.query(
    `UPDATE users
   SET access_token = $1,
       refresh_token = $2
   WHERE id = $3`,
    [accessToken, refreshToken, user.id]
  );

  console.log("test4->success");

  console.log("all tests passed");
  console.log("GENERATING TOKEN ENDS");

  return { accessToken, refreshToken };
};
