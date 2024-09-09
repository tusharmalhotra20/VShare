const router = require("express").Router();

// multer is middleware, used to handle file uploads.
const multer = require("multer");
const path = require("path");
const File = require("../models/fileModel");
const { v4: uuid4 } = require("uuid");

// multer configuration
let storage = multer.diskStorage({
  // Where to store the file?
  // cb is a callback func() first parameter of cb is used to report error -> which is defined null here, and second parameter defines where to store the files -> in uploads folder
  destination: (req, file, cb) => cb(null, "uploads/"),

  // We have to generate a unique name for each and every file, to avoid mixing of files.
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    // uniqueName = 32848468956-4984578972.extension
    cb(null, uniqueName);
  },
});

let upload = multer({ storage, limits: { fileSize: 1000000 } }).single(
  "uploaded_file"
); //1mb
// only a single file is allowed to upload at a time.
// console.log(upload.storage);
// "file" field in req.file is added by the multer middleware to req object.

// To Store file
router.post("/", (req, res) => {
  upload(req, res, async (err) => {
    // 1. validate the request
    if (!req.file) {
      return res.json({ error: "Error occurred" });
    }
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    // 2. Store file info to Database
    // uuid is used so that every file can be identified uniquely in the database and no one can access any other file on the by entering the subsequent id. e.g. 5 then 6 and so on...
    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),  // to generate an unique download page link
      path: req.file.path,
      size: req.file.size,
    });
    const response = await file.save();

    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
    //http://localhost:5000/files/32654564-12544-54545646 (unique download page link)
  });
});

// Email handler route
router.post("/send", async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;

  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({ error: "All fields are required" });
    // 422 -> validation error
  }

  // Get data from database
  // querying into db wether the uuid provided by client is present in db or not.
  const file = await File.findOne({ uuid: uuid });

  // to send email only once.
  if (file.sender) {
    return res.status(422).send({ error: "Email already sent." });
  }
  file.sender = emailFrom;
  file.receiver = emailTo;

  const response = await file.save();

  // Send Email
  const sendMail = require("../services/emailService");
  sendMail({
    from: emailFrom,
    to: emailTo,
    subject: "VShare- share your files",
    text: `${emailFrom} shared a file with you.`,
    html: require("../services/emailTemplate")({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
      size: `${parseFloat(file.size / 1000)}KB`,
      expires: "24 hours",
    }),
  });

  return res.send({ success: true });
});

module.exports = router;
