import AWS from 'aws-sdk';
import dotenv from 'dotenv'

dotenv.config()

AWS.config.update({
  region: 'us-east-1', // e.g., 'us-east-1'
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4'
});

export const s3 = new AWS.S3();
