const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname) || '.bin';
    const safe = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safe);
  },
});

const fileFilter = (_req, file, cb) => {
  const isImage = /^image\/(jpeg|png|gif|webp)$/i.test(file.mimetype);
  const isPdf = /^application\/pdf$/i.test(file.mimetype);
  if (isImage || isPdf) cb(null, true);
  else cb(new Error('Only image and PDF files are allowed'), false);
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter,
});

/** Middleware for product create/update: accepts image + optional PDF document */
const productFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'document', maxCount: 1 },
]);

upload.productFields = productFields;

module.exports = upload;
