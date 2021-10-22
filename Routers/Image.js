const router = require("express").Router();
const multer = require("multer");
const fs = require("fs");

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (!fs.existsSync("image/")) {
        fs.mkdirSync("image/");
      }
      cb(null, "image/");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now();
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  }),
});

router.post("/", upload.single("file"), (req, res) => {
  const imageUrl = req.file.destination + req.file.filename;
  res.json({ imageUrl });
});

router.delete("/:id", async (req, res) => {
  try {
    const image = req.params.id;
    console.log(image);
    fs.unlink(`image/${image}`, () => {});
    res.json("deleted");
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
