const mongoose = require("mongoose");
const Schema = mongoose.Schema();

const fileSchema = mongoose.Schema(
  {
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    uuid: { type: String, required: true },
    sender: { type: String, required: false }, // if someone wants to send the file using mail, then only -
    receiver: { type: String, required: false }, // sender and receiver emails are required to be stored.
  },
  {
    timestamps: true, // to generate fields like created_at ; updated_at
  }
);
const File = mongoose.model("File", fileSchema);
module.exports = File;
