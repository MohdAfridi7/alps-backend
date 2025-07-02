const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadAttachment } = require('../controllers/ticketController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.post('/ticket/:id', authMiddleware, upload.single('file'), uploadAttachment);

module.exports = router;
