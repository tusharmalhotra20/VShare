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
// app.use("/css", express.static(__dirname + "public/css"));
// app.use("/style.css", express.static(__dirname + "style.css"));
// app.use("/img", express.static(__dirname + "public/img"));
// app.use("/favicon.ico", express.static(__dirname + "public/favicon.ico"));

// Template engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

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

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server started on PORT ${PORT}`);
  } catch (err) {
    console.error(err.message);
  }
});
