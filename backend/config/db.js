const mongoose = require("mongoose");
require("dotenv").config();

// Database connection
const connectDB = async () => {
  // Storing the established connection into a "connect" constant, as we are required to call some methods upon this connection.
  try {
    const connect = await mongoose.connect(process.env.MONGO_CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to Database: ${connect.connection.host}`);
  } catch (error) {
    console.error(`Failed to connect with database: \n${error}`);
  }
};
//Now export this connectDB function() to your server.
module.exports = connectDB;
