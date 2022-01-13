const multer = require("multer");
const fs = require("fs");
const multerS3 = require("multer-s3");
const S3 = require("aws-sdk/clients/s3");
// Set the region

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY;
const secretKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
});

// Call S3 to list the bucket

const upload = async (path, filename) => {
  const fileContent = fs.readFileSync(path);
  const params = {
    Bucket: bucketName,
    Key: filename,
    Body: fileContent,
  };
  return await s3.upload(params).promise();
};

module.exports = upload;
