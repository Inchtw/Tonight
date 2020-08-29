require('dotenv').config();
const aws = require('aws-sdk');
const {AWS_BUCKET, AWS_KEYID, AWS_KEY} = process.env;

const s3 = new aws.S3({
  accessKeyId: AWS_KEYID,
  secretAccessKey: AWS_KEY,
  Bucket: AWS_BUCKET,
});

module.exports = s3;
