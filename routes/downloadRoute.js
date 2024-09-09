const router = require("express").Router();
const File = require("../models/fileModel");

router.get("/:uuid", async (req, res) => {
  // Extract link and get file from storage send download stream
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    // Link expired
    if (!file) {
      return res.render("download", { error: "Link has been expired." });
    }
    const response = await file.save();

    const filePath = `${__dirname}/../uploads/${file.filename}`
    // console.log(filePath);
    res.download(filePath);
  } catch (error) {
    return res.render("download", { error: "Link has been expired." });
  }
});

module.exports = router;
