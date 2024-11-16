const { parentPort } = require('worker_threads');
const ffmpeg = require('fluent-ffmpeg');

function compressVideo({ tempPath, compressedPath, targetSize }) {
    let command = ffmpeg(tempPath)
        .outputOptions(['-vcodec libx264', '-crf 28', '-preset fast']);

    if (targetSize) {
        const targetBitrate = calculateBitrate(file.size, parseInt(targetSize, 10));
        command.outputOptions([`-b:v ${targetBitrate}k`]);
    }

    command.save(compressedPath)
        .on('end', () => parentPort.postMessage({ success: true }))
        .on('error', (err) => parentPort.postMessage({ success: false, error: err }));
}

function calculateBitrate(currentSize, targetSizeMB) {
    const targetSize = targetSizeMB * 1024 * 1024; // Convert MB to bytes
    const bitrateReduction = targetSize / currentSize;
    const currentBitrate = 4000; // Example current bitrate in kbps
    return currentBitrate * bitrateReduction;
}

parentPort.on('message', (data) => compressVideo(data));
