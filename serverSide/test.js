const pool = require("./src/config/postgress.db");

(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Connected to PostgreSQL:", res.rows);
  } catch (err) {
    console.error("❌ DB connection error:", err.message);
  }
})();
