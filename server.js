const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");
const app = express();

// Cors
const corsOptions = {
  origin: process.env.ALLOWED_CLIENTS.split(","),
};

app.use(cors(corsOptions));

app.use(express.json());

// Static files
app.use(express.static("public"));

// Template engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// Routes
// Upload file
app.use("/api/files", require("./routes/fileRoute"));
// Show file
app.use("/files", require("./routes/showRoute"));
// Download file
app.use("/files/download", require("./routes/downloadRoute.js"));

// --------------------------DEPLOYMENT------------------------------

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname1, "public/index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// --------------------------DEPLOYMENT------------------------------

const PORT = process.env.PORT || 5000;

connectDB();
app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
