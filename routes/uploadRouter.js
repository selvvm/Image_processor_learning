const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const Request = require('../models/Request');
const { csvProcessingQueue } = require('../utils/queue');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const requestId = uuidv4();
    const request = new Request({ requestId, status: 'processing' });
    await request.save();

    csvProcessingQueue.add({ filePath: req.file.path, requestId });

    res.json({ requestId, message: 'File uploaded successfully. Processing started.' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;