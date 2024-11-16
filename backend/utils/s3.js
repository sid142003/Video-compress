const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.uploadFile = (fileBuffer, bucketName, fileName) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileBuffer
  };
  return s3.upload(params).promise();
};

exports.getSignedUrl = (bucketName, fileName) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Expires: 60 * 5 // Link expires in 5 minutes
  };
  return s3.getSignedUrlPromise('getObject', params);
};
