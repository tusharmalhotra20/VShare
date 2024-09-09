const mongoose = require("mongoose");
require("dotenv").config();

// Database connection
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_CONNECTION_URL);
    
    console.log(`Connected to Database: ${connect.connection.host}`);
  } catch (error) {
    console.log(`Failed to connect with database: \n${error}`);
  }

  mongoose.connection.on("error", (err) => {
     console.log(err);
  });
};

//Now export this connectDB function() to your server.
module.exports = connectDB;
