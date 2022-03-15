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
  destination: (req, file, cb) => cb(null, "backend/uploads/"),

  // We have to generate a unique name for each and every file, to avoid mixing of files.
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    // uniqueName = 32848468956-4984578972.extension
    cb(null, uniqueName);
  },
});

let upload = multer({ storage, limits: { fileSize: 1000000 * 100 } }).single(
  "uploaded_file"
); //100mb
// only a single file is allowed to upload at a time.

// "file" field in req.file is added by the multer middleware to req object.
router.post("/", (req, res) => {
  // Store file
  upload(req, res, async (err) => {
    // Before storing validate the request
    if (!req.file) {
      return res.json({ error: "Error occurred" });
    }
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    // Store to Database
    // uuid is used so that every file can be identified uniquely in the database and no one can access any other file on the by entering the subsequent id. e.g. 5 then 6 and so on...
    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });
    const response = await file.save();
    // console.log(response);
    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
    //http://localhost:5000/files/32654564-12544-54545646
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
    subject: "FileShare- file sharing",
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
