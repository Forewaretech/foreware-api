import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../../config/aws.config.js";

export const deleteS3Object = async (fileUrl: string) => {
  try {
    // 1. Check if it's an AWS URL (adjust the bucket name to match yours)
    const isAwsUrl = fileUrl.includes("amazonaws.com");
    if (!isAwsUrl) return;

    // 2. Extract the Key (everything after the bucket domain)
    // URL: https://bucket.s3.region.amazonaws.com/blog/image.png
    // Key: blog/image.png
    const urlParts = new URL(fileUrl);

    const key = urlParts.pathname.substring(1); // Removes the leading slash

    // 3. Send Delete Command
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
      }),
    );

    console.log(`Successfully deleted S3 object: ${key}`);
  } catch (error) {
    console.error("Error deleting S3 object:", error);
    // We usually log this but don't stop the whole process
    // to avoid "orphaned" files blocking DB cleanup
  }
};
