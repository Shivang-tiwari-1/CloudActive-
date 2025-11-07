const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json({ limit: "32mb" }));
app.use(express.urlencoded({ extended: true, limit: "32mb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/home", (req, res) => {
  res.json({ message: "hello" });
});
app.use("/api/auth", require("./routes/userRoute"));
app.use("/api/events", require("./routes/eventManagement"));

module.exports = app;
