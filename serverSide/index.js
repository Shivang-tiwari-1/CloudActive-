require("dotenv").config();
const http = require("http");
// const { connectToMongo } = require("./src/config/db");
const app = require("./src/app");
const pool = require("./src/config/postgress.db");
const server = http.createServer(app);

async function initialize() {
  console.log("🔄 Starting initialization...");

  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Connected to PostgreSQL:", res.rows);
  } catch (error) {
    console.error("Error during initialization:", error);
    process.exit(1);
  }
}

server.listen(process.env.PORT, "0.0.0.0", async () => {
  await initialize();
  console.log(`Worker running on http://localhost:${process.env.PORT}`);
});
