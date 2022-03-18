const File = require("./models/fileModel");
const fs = require("fs");
const connectDB = require("./config/db");

connectDB();

const fetchData = async () => {
  // fetch all files that are older than 24 hours.
  const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24);
  const files = await File.find({ createdAt: { $lt: pastDate } });

  if (files.length) {
    for (const file of files) {
      try {
        // deleting file from upload folder
        fs.unlinkSync(file.path);

        // deleting file from database
        await file.remove();

        console.log(`successfully deleted ${file.filename}`);
      } catch (error) {
        console.error(`Error while deleting file ${error}`);
      }
    }
	console.log("scheduler executed");
  }
};

fetchData().then(process.exit);
