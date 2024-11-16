    const Video = require('../models/videoModel');
    const { uploadFile, getSignedUrl } = require('../utils/s3');
    const fs = require('fs');
    const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
    const ffmpeg = require('fluent-ffmpeg');
    ffmpeg.setFfmpegPath(ffmpegPath);

    exports.uploadVideo = async (req, res) => {
        const { file } = req; // Assuming file is attached to the request by Multer

        if (!file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        const { originalname, path: tempPath, mimetype } = file;
        const compressedPath = `uploads/compressed-${originalname}`;

        try {
            // Compress video
            await new Promise((resolve, reject) => {
                ffmpeg(tempPath)
                    .outputOptions(['-vcodec libx264', '-crf 28', '-preset fast'])
                    .save(compressedPath)
                    .on('end', () => resolve())
                    .on('error', (err) => reject(err));
            });

            // Upload original and compressed video to S3
            const originalBuffer = fs.readFileSync(tempPath);
            const compressedBuffer = fs.readFileSync(compressedPath);

            const [originalUpload, compressedUpload] = await Promise.all([
                uploadFile(originalBuffer, process.env.S3_BUCKET_NAME, `original/${originalname}`),
                uploadFile(compressedBuffer, process.env.S3_BUCKET_NAME, `compressed/${originalname}`)
            ]);

            // Save video data to MongoDB
            const video = new Video({
                filename: originalname,
                originalUrl: originalUpload.Location,
                compressedUrl: compressedUpload.Location,
                size: file.size,
                isCompressed: true
            });
            await video.save();

            // Clean up local files
            fs.unlinkSync(tempPath);
            fs.unlinkSync(compressedPath);

            res.status(201).json({
                message: 'Video uploaded and compressed successfully',
                video: {
                    id: video._id,
                    originalUrl: originalUpload.Location,
                    compressedUrl: compressedUpload.Location
                }
            });
        } catch (error) {
            console.error('Failed to process video:', error);
            res.status(500).json({ message: 'Failed to process video' });
        }
    };


    

    exports.getVideo = async (req, res) => {
        const { id } = req.params;

        try {
            const video = await Video.findById(id);
            if (!video) {
                return res.status(404).json({ message: "Video not found." });
            }

            // Generate signed URLs for both original and compressed videos
            const originalSignedUrl = await getSignedUrl(process.env.S3_BUCKET_NAME, `original/${video.filename}`);
            const compressedSignedUrl = await getSignedUrl(process.env.S3_BUCKET_NAME, `compressed/${video.filename}`);

            res.json({
                filename: video.filename,
                originalUrl: originalSignedUrl,
                compressedUrl: compressedSignedUrl
            });
        } catch (error) {
            console.error('Error fetching video:', error);
            res.status(500).json({ message: 'Error fetching video' });
        }
    };

    exports.listVideos = async (req, res) => {
        try {
            const videos = await Video.find({});
            res.json(videos);
        } catch (error) {
            res.status(500).json({ message: "Error fetching videos" });
        }
    };
