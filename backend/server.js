const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const app = express();
connectDB();

app.use(express.json());
app.use(express.static("public"));
// Template engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// Upload file
app.use("/api/files", require("./routes/fileRoute"));

// Show file
app.use("/files", require("./routes/showRoute"));

// Download file
app.use("/files/download", require("./routes/downloadRoute.js"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
