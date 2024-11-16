// routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');


const multer = require('multer');
const upload = multer({ dest: 'uploads/' });  // Ensure this directory exists or configure storage

router.post('/upload', upload.single('video'), videoController.uploadVideo);

router.get('/:id/download', videoController.getVideo);
router.get('/', videoController.listVideos);

module.exports = router;
