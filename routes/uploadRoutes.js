// routes/uploadRoute.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Storage engine setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderName = req.params.folderName;
    const uploadPath = path.join(__dirname, "..", "uploads", folderName);

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// Multer with filter
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|mp4|avi|mov/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error("Only images and videos are allowed"));
  },
});

// One endpoint for files + YouTube links
router.post("/api/upload/:folderName", upload.single("file"), (req, res) => {
  try {
    const folderName = req.params.folderName;
    const file = req.file;
    const { youtubeUrl } = req.body;

    if (youtubeUrl) {
      if (
        !youtubeUrl.includes("youtube.com") &&
        !youtubeUrl.includes("youtu.be")
      ) {
        return res.status(400).json({ error: "Invalid YouTube URL" });
      }
      return res.status(200).json({
        message: "YouTube link saved successfully",
        type: "youtube",
        data: youtubeUrl,
      });
    }

    if (file) {
      const fileUrl = `/uploads/${folderName}/${file.filename}`;
      return res.status(200).json({
        message: "File uploaded successfully",
        type: "file",
        data: fileUrl,
      });
    }

    return res.status(400).json({ error: "No file or YouTube link provided" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
