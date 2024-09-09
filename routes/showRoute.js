const router = require("express").Router();
const File = require("../models/fileModel");

// All dynamic parameters are found in req.params
router.get("/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
      return res.render("download", { error: `Something went wrong` });
    }
    // console.log(`${process.env.APP_BASE_URL}/files/download/${file.uuid}`);
    // console.log(`${__dirname}\\..\\uploads`);
    return res.render("download", {
      uuid: file.uuid,
      fileName: file.filename,
      fileSize: file.size,
      downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
      // http://localhost:5000/files/download/454326989-4496464285
    });
  } catch (error) {
    return res.render("download", { error: `Error: ${error}` });
  }
});

module.exports = router;
