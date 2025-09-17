import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
 destination: function (req, file, cb) {
  // We don't have the group ID yet, so we'll save to a temporary location first
  const tempPath = "resources/temp";
  fs.mkdirSync(tempPath, { recursive: true });
  cb(null, tempPath);
 },
 filename: function (req, file, cb) {
  // Use a timestamp to make the filename unique
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  cb(null, uniqueSuffix + path.extname(file.originalname));
 },
});

const upload = multer({ storage: storage });

export default upload;